import { Handler } from '@netlify/functions';
import { getDatabase } from './mongodb';

type Granularity = 'daily' | 'weekly' | 'monthly';

const GRANULARITY_FORMAT: Record<Granularity, string> = {
  daily: '%Y-%m-%d',
  weekly: '%G-W%V',
  monthly: '%Y-%m',
};

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const days = Math.min(Math.max(parseInt(params.get('days') || '90', 10), 7), 365);
    const granularity = (params.get('granularity') as Granularity) || 'daily';
    const format = GRANULARITY_FORMAT[granularity] ?? GRANULARITY_FORMAT.daily;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const db = await getDatabase();
    const leadsCollection = db.collection('leads');
    const errorsCollection = db.collection('error_logs');

    const leadsSeries = await leadsCollection
      .aggregate([
        { $match: { created_at: { $gte: since } } },
        {
          $group: {
            _id: {
              interval: { $dateToString: { format, date: '$created_at' } },
              submission_type: '$submission_type',
            },
            count: { $sum: 1 },
            avgScore: { $avg: '$score' },
            hotLeads: {
              $sum: {
                $cond: [{ $eq: ['$priority', 'hot'] }, 1, 0],
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id.interval',
            count: { $sum: '$count' },
            avgScore: { $avg: '$avgScore' },
            hotLeads: { $sum: '$hotLeads' },
            bySubmission: {
              $push: {
                type: '$_id.submission_type',
                count: '$count',
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const errorsSeries = await errorsCollection
      .aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $group: {
            _id: {
              interval: { $dateToString: { format, date: '$timestamp' } },
              severity: '$severity',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.interval',
            count: { $sum: '$count' },
            bySeverity: {
              $push: {
                severity: '$_id.severity',
                count: '$count',
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        granularity,
        days,
        leads: leadsSeries,
        errors: errorsSeries,
      }),
    };
  } catch (error) {
    console.error('Error generating time-series analytics:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to build time-series analytics',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

