import { Handler, HandlerEvent } from '@netlify/functions';
import { getDatabase } from './mongodb';

interface SearchParams {
  query?: string;
  business_type?: string;
  submission_type?: 'strategy' | 'pilot';
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
    const collection = db.collection('leads');

    // Parse query parameters
    const params = new URLSearchParams(event.queryStringParameters || {});
    const searchParams: SearchParams = {
      query: params.get('q') || undefined,
      business_type: params.get('business_type') || undefined,
      submission_type: params.get('submission_type') as 'strategy' | 'pilot' | undefined,
      date_from: params.get('date_from') || undefined,
      date_to: params.get('date_to') || undefined,
      limit: parseInt(params.get('limit') || '50', 10),
      offset: parseInt(params.get('offset') || '0', 10),
    };

    // Build aggregation pipeline
    const pipeline: any[] = [];

    // Text search using Atlas Search if query provided
    if (searchParams.query) {
      pipeline.push({
        $search: {
          index: 'leads_search',
          text: {
            query: searchParams.query,
            path: {
              wildcard: '*', // Search all text fields
            },
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      });
    }

    // Build match stage for filters
    const matchStage: any = {};
    if (searchParams.business_type) {
      matchStage.business_type = searchParams.business_type;
    }
    if (searchParams.submission_type) {
      matchStage.submission_type = searchParams.submission_type;
    }
    if (searchParams.date_from || searchParams.date_to) {
      matchStage.created_at = {};
      if (searchParams.date_from) {
        matchStage.created_at.$gte = new Date(searchParams.date_from);
      }
      if (searchParams.date_to) {
        matchStage.created_at.$lte = new Date(searchParams.date_to);
      }
    }

    // Add match stage if filters exist
    if (Object.keys(matchStage).length > 0) {
      if (searchParams.query) {
        // If using search, add match after search
        pipeline.push({ $match: matchStage });
      } else {
        // If no search, use regular match
        pipeline.push({ $match: matchStage });
      }
    }

    // If no search query, use regular find with filters
    if (!searchParams.query) {
      const filter: any = {};
      if (searchParams.business_type) filter.business_type = searchParams.business_type;
      if (searchParams.submission_type) filter.submission_type = searchParams.submission_type;
      if (searchParams.date_from || searchParams.date_to) {
        filter.created_at = {};
        if (searchParams.date_from) filter.created_at.$gte = new Date(searchParams.date_from);
        if (searchParams.date_to) filter.created_at.$lte = new Date(searchParams.date_to);
      }

      const results = await collection
        .find(filter)
        .sort({ created_at: -1 })
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
    pipeline.push({ $sort: { created_at: -1 } });
    pipeline.push({ $skip: searchParams.offset || 0 });
    pipeline.push({ $limit: searchParams.limit || 50 });

    // Execute aggregation
    const results = await collection.aggregate(pipeline).toArray();

    // Get total count (for search, we need a separate count)
    const countPipeline = [...pipeline];
    countPipeline.pop(); // Remove limit
    countPipeline.pop(); // Remove skip
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
    console.error('Error searching leads:', error);
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

