import { Handler, HandlerEvent } from '@netlify/functions';
import { getDatabase } from './mongodb';

interface SearchParams {
  query?: string;
  error_type?: string;
  severity?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

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
    const collection = db.collection('error_logs');

    // Parse query parameters
    const params = new URLSearchParams(event.queryStringParameters || {});
    const searchParams: SearchParams = {
      query: params.get('q') || undefined,
      error_type: params.get('error_type') || undefined,
      severity: params.get('severity') || undefined,
      date_from: params.get('date_from') || undefined,
      date_to: params.get('date_to') || undefined,
      limit: parseInt(params.get('limit') || '50', 10),
      offset: parseInt(params.get('offset') || '0', 10),
    };

    // Build aggregation pipeline
    const pipeline: Record<string, unknown>[] = [];

    // Text search using Atlas Search if query provided
    if (searchParams.query) {
      pipeline.push({
        $search: {
          index: 'error_logs_search',
          text: {
            query: searchParams.query,
            path: ['message', 'user_message', 'stack', 'code'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      });
    }

    // Build match stage for filters
    const matchStage: Record<string, unknown> = {};
    if (searchParams.error_type) {
      matchStage.error_type = searchParams.error_type;
    }
    if (searchParams.severity) {
      matchStage.severity = searchParams.severity;
    }
    if (searchParams.date_from || searchParams.date_to) {
      matchStage.timestamp = {};
      if (searchParams.date_from) {
        matchStage.timestamp.$gte = new Date(searchParams.date_from);
      }
      if (searchParams.date_to) {
        matchStage.timestamp.$lte = new Date(searchParams.date_to);
      }
    }

    // Add match stage if filters exist
    if (Object.keys(matchStage).length > 0) {
      if (searchParams.query) {
        pipeline.push({ $match: matchStage });
      } else {
        pipeline.push({ $match: matchStage });
      }
    }

    // If no search query, use regular find with filters
    if (!searchParams.query) {
      const filter: Record<string, unknown> = {};
      if (searchParams.error_type) filter.error_type = searchParams.error_type;
      if (searchParams.severity) filter.severity = searchParams.severity;
      if (searchParams.date_from || searchParams.date_to) {
        filter.timestamp = {};
        if (searchParams.date_from) filter.timestamp.$gte = new Date(searchParams.date_from);
        if (searchParams.date_to) filter.timestamp.$lte = new Date(searchParams.date_to);
      }

      const results = await collection
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(searchParams.offset || 0)
        .limit(searchParams.limit || 50)
        .toArray();

      const total = await collection.countDocuments(filter);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          results,
          total,
          limit: searchParams.limit,
          offset: searchParams.offset,
        }),
      };
    }

    // Add sorting, skip, and limit for search results
    pipeline.push({ $sort: { timestamp: -1 } });
    pipeline.push({ $skip: searchParams.offset || 0 });
    pipeline.push({ $limit: searchParams.limit || 50 });

    // Execute aggregation
    const results = await collection.aggregate(pipeline).toArray();

    // Get total count
    const countPipeline = [...pipeline];
    countPipeline.pop();
    countPipeline.pop();
    countPipeline.push({ $count: 'total' });
    const countResult = await collection.aggregate(countPipeline).toArray();
    const total = countResult[0]?.total || 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results,
        total,
        limit: searchParams.limit,
        offset: searchParams.offset,
        query: searchParams.query,
      }),
    };
  } catch (error) {
    console.error('Error searching error logs:', error);
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

