import { Handler, HandlerEvent } from '@netlify/functions';
import { getDatabase } from './mongodb';

export const handler: Handler = async (event: HandlerEvent) => {
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
    const db = await getDatabase();
    const leadsCollection = db.collection('leads');
    const errorsCollection = db.collection('error_logs');

    // Get date range from query params (default: last 30 days)
    const params = new URLSearchParams(event.queryStringParameters || {});
    const days = parseInt(params.get('days') || '30', 10);
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Leads Analytics
    const leadsStats = await leadsCollection.aggregate([
      {
        $match: {
          created_at: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: {
            $push: '$submission_type',
          },
          byBusinessType: {
            $push: '$business_type',
          },
        },
      },
      {
        $project: {
          total: 1,
          byType: 1,
          byBusinessType: 1,
        },
      },
    ]).toArray();

    // Count by submission type
    const leadsByType = await leadsCollection.aggregate([
      {
        $match: {
          created_at: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: '$submission_type',
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    // Count by business type
    const leadsByBusinessType = await leadsCollection.aggregate([
      {
        $match: {
          created_at: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: '$business_type',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).toArray();

    // Daily leads trend
    const dailyLeads = await leadsCollection.aggregate([
      {
        $match: {
          created_at: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created_at',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).toArray();

    // Error Logs Analytics
    const errorsStats = await errorsCollection.aggregate([
      {
        $match: {
          timestamp: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          bySeverity: {
            $push: '$severity',
          },
          byType: {
            $push: '$error_type',
          },
        },
      },
    ]).toArray();

    // Count by severity
    const errorsBySeverity = await errorsCollection.aggregate([
      {
        $match: {
          timestamp: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    // Count by error type
    const errorsByType = await errorsCollection.aggregate([
      {
        $match: {
          timestamp: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: '$error_type',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).toArray();

    // Daily errors trend
    const dailyErrors = await errorsCollection.aggregate([
      {
        $match: {
          timestamp: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).toArray();

    // Total counts
    const totalLeads = await leadsCollection.countDocuments();
    const totalErrors = await errorsCollection.countDocuments();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        period: {
          days,
          from: dateFrom.toISOString(),
          to: new Date().toISOString(),
        },
        leads: {
          total: totalLeads,
          periodTotal: leadsStats[0]?.total || 0,
          byType: leadsByType.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          byBusinessType: leadsByBusinessType.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          dailyTrend: dailyLeads,
        },
        errors: {
          total: totalErrors,
          periodTotal: errorsStats[0]?.total || 0,
          bySeverity: errorsBySeverity.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          byType: errorsByType.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          dailyTrend: dailyErrors,
        },
      }),
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

