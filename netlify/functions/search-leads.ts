import { Handler, HandlerEvent } from '@netlify/functions';
import { getDatabase } from './mongodb';
import { LeadRecord, LeadSearchResult } from './helpers/lead-types';
import { resolveCoordinates } from './helpers/lead-utils';

interface SearchParams {
  query?: string;
  business_type?: string;
  submission_type?: 'strategy' | 'pilot';
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
  score_min?: number;
  priority?: 'hot' | 'warm' | 'nurture';
  state?: string;
  city?: string;
  radius_miles?: number;
  center_lat?: number;
  center_lng?: number;
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
    const collection = db.collection<LeadRecord>('leads');

    const params = new URLSearchParams(event.queryStringParameters || {});
    const searchParams: SearchParams = {
      query: params.get('q') || undefined,
      business_type: params.get('business_type') || undefined,
      submission_type: params.get('submission_type') as 'strategy' | 'pilot' | undefined,
      date_from: params.get('date_from') || undefined,
      date_to: params.get('date_to') || undefined,
      limit: Math.min(Math.max(parseInt(params.get('limit') || '50', 10), 1), 200),
      offset: Math.max(parseInt(params.get('offset') || '0', 10), 0),
      score_min: params.get('score_min') ? parseInt(params.get('score_min')!, 10) : undefined,
      priority: params.get('priority') as 'hot' | 'warm' | 'nurture' | undefined,
      state: params.get('state') || undefined,
      city: params.get('city') || undefined,
      radius_miles: params.get('radius_miles') ? parseFloat(params.get('radius_miles')!) : undefined,
      center_lat: params.get('center_lat') ? parseFloat(params.get('center_lat')!) : undefined,
      center_lng: params.get('center_lng') ? parseFloat(params.get('center_lng')!) : undefined,
    };

    const matchStage: Record<string, unknown> = {};
    if (searchParams.business_type) {
      matchStage.business_type = searchParams.business_type;
    }
    if (searchParams.submission_type) {
      matchStage.submission_type = searchParams.submission_type;
    }
    if (searchParams.priority) {
      matchStage.priority = searchParams.priority;
    }
    if (typeof searchParams.score_min === 'number') {
      matchStage.score = { $gte: searchParams.score_min };
    }
    if (searchParams.state) {
      matchStage['location.state'] = searchParams.state.toUpperCase();
    }
    if (searchParams.city) {
      matchStage['location.city'] = new RegExp(`^${searchParams.city}$`, 'i');
    }
    if (searchParams.date_from || searchParams.date_to) {
      matchStage.created_at = {};
      if (searchParams.date_from) {
        (matchStage.created_at as Record<string, Date>).$gte = new Date(searchParams.date_from);
      }
      if (searchParams.date_to) {
        (matchStage.created_at as Record<string, Date>).$lte = new Date(searchParams.date_to);
      }
    }

    const geoFilter = buildGeoFilter(searchParams);
    if (geoFilter) {
      matchStage['location.coordinates'] = geoFilter;
    }

    const pipeline: Record<string, unknown>[] = [];
    if (searchParams.query) {
      pipeline.push({
        $search: {
          index: 'leads_search',
          text: {
            query: searchParams.query,
            path: { wildcard: '*' },
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      });
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({
      $facet: {
        results: [
          { $sort: { created_at: -1 } },
          { $skip: searchParams.offset },
          { $limit: searchParams.limit },
        ],
        totalCount: [{ $count: 'count' }],
        businessTypeFacets: [
          { $group: { _id: '$business_type', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        submissionTypeFacets: [
          { $group: { _id: '$submission_type', count: { $sum: 1 } } },
        ],
        priorityFacets: [
          { $group: { _id: '$priority', count: { $sum: 1 } } },
        ],
        stateFacets: [
          { $group: { _id: '$location.state', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
      },
    });

    const aggregated = await collection.aggregate(pipeline).toArray();
    const facetResult = aggregated[0] || {};

    const response: LeadSearchResult = {
      results: facetResult.results ?? [],
      total: facetResult.totalCount?.[0]?.count ?? 0,
      limit: searchParams.limit,
      offset: searchParams.offset,
      facets: {
        businessTypes: mapFacet(facetResult.businessTypeFacets),
        submissionTypes: mapFacet(facetResult.submissionTypeFacets),
        priorities: mapFacet(facetResult.priorityFacets),
        states: mapFacet(facetResult.stateFacets),
      },
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, ...response }),
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

function buildGeoFilter(params: SearchParams) {
  if (!params.radius_miles) {
    return undefined;
  }

  let coordinates: [number, number] | undefined;
  if (typeof params.center_lat === 'number' && typeof params.center_lng === 'number') {
    coordinates = [params.center_lng, params.center_lat];
  } else if (params.city && params.state) {
    const resolved = resolveCoordinates(params.city, params.state);
    if (resolved) {
      coordinates = resolved;
    }
  }

  if (!coordinates) {
    return undefined;
  }

  const meters = params.radius_miles * 1609.34;
  return {
    $nearSphere: {
      $geometry: {
        type: 'Point',
        coordinates,
      },
      $maxDistance: meters,
    },
  };
}

function mapFacet(entries: Array<{ _id: string; count: number }> = []) {
  return entries
    .filter(entry => entry._id)
    .map(entry => ({
      value: entry._id,
      count: entry.count,
    }));
}
