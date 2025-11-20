import { Handler, HandlerEvent } from '@netlify/functions';
import { getDatabase } from './mongodb';
import { sendWebhookNotification } from './helpers/lead-utils';
import { LeadRecord } from './helpers/lead-types';

const DEFAULT_DURATION_MS = 5000;

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input = JSON.parse(event.body || '{}') as {
      durationMs?: number;
      minPriority?: 'hot' | 'warm' | 'nurture';
    };
    const duration = Math.min(
      Math.max(input.durationMs ?? DEFAULT_DURATION_MS, 1000),
      15000,
    );
    const minPriority = input.minPriority ?? 'warm';

    const db = await getDatabase();
    const leadsCollection = db.collection<LeadRecord>('leads');
    const stateCollection = db.collection('automation_state');

    const stateDoc = await stateCollection.findOne<{ resumeToken?: unknown }>({
      _id: 'lead_notifications',
    });
    const resumeToken = stateDoc?.resumeToken;

    const pipeline = [
      {
        $match: {
          operationType: 'insert',
        },
      },
    ];

    const changeStream = leadsCollection.watch(pipeline, {
      fullDocument: 'updateLookup',
      ...(resumeToken ? { resumeAfter: resumeToken } : {}),
    });

    const captured: LeadRecord[] = [];
    let lastResumeToken: unknown = resumeToken;
    const start = Date.now();

    while (Date.now() - start < duration) {
      const change = await changeStream.tryNext();
      if (!change) {
        await new Promise(resolve => setTimeout(resolve, 250));
        continue;
      }

      const lead = change.fullDocument as LeadRecord;
      if (!lead) continue;
      lastResumeToken = change._id;

      if (shouldNotify(lead.priority, minPriority)) {
        captured.push(lead);
      }
    }

    await changeStream.close();

    if (lastResumeToken) {
      await stateCollection.updateOne(
        { _id: 'lead_notifications' },
        { $set: { resumeToken: lastResumeToken, updated_at: new Date() } },
        { upsert: true },
      );
    }

    const webhookUrl = process.env.LEAD_ALERT_WEBHOOK_URL;
    await Promise.all(
      captured.map(lead => sendWebhookNotification(lead, webhookUrl)),
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        captured: captured.length,
        leads: captured.map(lead => ({
          id: lead._id,
          name: lead.name,
          company: lead.company,
          priority: lead.priority,
          score: lead.score,
          email: lead.email,
          phone: lead.phone,
          created_at: lead.created_at,
        })),
        windowMs: duration,
      }),
    };
  } catch (error) {
    console.error('Error monitoring lead notifications:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process lead notifications',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

function shouldNotify(priority: LeadRecord['priority'], min: 'hot' | 'warm' | 'nurture') {
  const order: Record<'hot' | 'warm' | 'nurture', number> = {
    hot: 3,
    warm: 2,
    nurture: 1,
  };
  return order[priority ?? 'nurture'] >= order[min];
}

