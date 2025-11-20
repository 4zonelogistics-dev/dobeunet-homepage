import { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { LeadRecord, LeadSubmissionPayload } from './helpers/lead-types';
import { buildLeadInsights, determinePriority, scoreLead } from './helpers/lead-utils';

export const handler: Handler = async (event) => {
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
    const body = JSON.parse(event.body || '{}') as {
      limit?: number;
      force?: boolean;
      leadIds?: string[];
    };
    const limit = Math.min(Math.max(body.limit ?? 50, 1), 500);
    const force = Boolean(body.force);
    const ids = body.leadIds?.map(id => {
      try {
        return new ObjectId(id);
      } catch {
        return null;
      }
    }).filter(Boolean) as ObjectId[];

    const db = await getDatabase();
    const leadsCollection = db.collection<LeadRecord>('leads');

    const filter: Record<string, unknown> = {};
    if (!force) {
      filter.$or = [
        { score: { $exists: false } },
        { priority: { $exists: false } },
      ];
    }
    if (ids?.length) {
      filter._id = { $in: ids };
    }

    const leads = await leadsCollection
      .find(filter)
      .limit(limit)
      .toArray();

    const updates = await Promise.all(
      leads.map(async (lead) => {
        const payload: LeadSubmissionPayload = {
          name: lead.name,
          email: lead.email,
          company: lead.company,
          business_type: lead.business_type,
          phone: lead.phone,
          message: lead.message,
          submission_type: lead.submission_type,
          location: lead.location,
          estimated_locations: lead.estimated_locations,
          headcount: lead.headcount,
          marketing: lead.marketing,
        };

        const score = scoreLead(payload);
        const priority = determinePriority(score);
        const insights = buildLeadInsights(payload, score);

        await leadsCollection.updateOne(
          { _id: lead._id },
          {
            $set: {
              score,
              priority,
              insights,
              updated_at: new Date(),
            },
          },
        );

        return {
          id: lead._id,
          score,
          priority,
        };
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        processed: updates.length,
        results: updates,
      }),
    };
  } catch (error) {
    console.error('Error recalculating lead scores:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to recalculate lead scores',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

