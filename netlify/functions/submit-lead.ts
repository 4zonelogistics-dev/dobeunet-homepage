import { Handler, HandlerEvent } from '@netlify/functions';
import { getCollection } from './mongodb';
import { LeadRecord, LeadSubmissionPayload, LeadMarketingMeta, LeadPriority } from './helpers/lead-types';
import { buildLeadInsights, determinePriority, resolveCoordinates, scoreLead } from './helpers/lead-utils';

export const handler: Handler = async (
  event: HandlerEvent
) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}') as Record<string, string>;

    const requiredFields = [
      'name',
      'email',
      'company',
      'business_type',
      'phone',
      'submission_type',
    ];
    const missingFields = requiredFields.filter(field => !body[field]);

    const locationCity = body.location?.city ?? body.location_city;
    const locationState = body.location?.state ?? body.location_state;
    const locationPostal = body.location?.postal_code ?? body.location_postal_code;

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          fields: missingFields,
        }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    if (!['strategy', 'pilot'].includes(body.submission_type)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid submission type' }),
      };
    }

    if (!locationCity || !locationState || !locationPostal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Location city, state, and postal code are required' }),
      };
    }

    const statePattern = /^[A-Za-z]{2}$/;
    if (!statePattern.test(locationState)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'State must be a 2-letter abbreviation' }),
      };
    }

    const postalPattern = /^\d{5}(-\d{4})?$/;
    if (!postalPattern.test(locationPostal)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Postal code must be a valid US ZIP code' }),
      };
    }

    const estimatedLocations = body.estimated_locations ? parseInt(body.estimated_locations, 10) : undefined;
    const headcount = body.headcount ? parseInt(body.headcount, 10) : undefined;

    if (Number.isNaN(estimatedLocations as number) && body.estimated_locations) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'estimated_locations must be a number' }),
      };
    }

    if (Number.isNaN(headcount as number) && body.headcount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'headcount must be a number' }),
      };
    }

    const marketingPayload = body.marketing ?? {};
    const marketing: LeadMarketingMeta = {
      utm_source: marketingPayload.utm_source?.trim() || body.utm_source?.trim() || undefined,
      utm_medium: marketingPayload.utm_medium?.trim() || body.utm_medium?.trim() || undefined,
      utm_campaign: marketingPayload.utm_campaign?.trim() || body.utm_campaign?.trim() || undefined,
      lead_source: marketingPayload.lead_source?.trim() || body.lead_source?.trim() || 'contact_modal',
    };

    const payload: LeadSubmissionPayload = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company.trim(),
      business_type: body.business_type,
      phone: body.phone.trim(),
      message: body.message ? body.message.trim() : '',
      submission_type: body.submission_type,
      estimated_locations,
      headcount,
      marketing,
      location: {
        city: locationCity.trim(),
        state: locationState.trim().toUpperCase(),
        postal_code: locationPostal.trim(),
      },
    };

    const coordinates = resolveCoordinates(payload.location.city, payload.location.state);
    if (coordinates) {
      payload.location.coordinates = {
        type: 'Point',
        coordinates,
      };
    }

    const score = scoreLead(payload);
    const priority = determinePriority(score);
    const insights = buildLeadInsights(payload, score);

    const leadRecord: LeadRecord = {
      ...payload,
      created_at: new Date(),
      updated_at: new Date(),
      score,
      priority,
      insights,
      enrichment_status: 'complete',
      enrichment_notes: 'Automated heuristic enrichment applied',
      tags: buildTags(payload, priority),
    };

    const collection = await getCollection<LeadRecord>('leads');
    const result = await collection.insertOne(leadRecord);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result.insertedId,
        score,
        priority,
      }),
    };

  } catch (error) {
    console.error('Error submitting lead:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

function buildTags(payload: LeadSubmissionPayload, priority: LeadPriority): string[] {
  const tags = new Set<string>();
  tags.add(payload.business_type);
  tags.add(`${payload.submission_type}_request`);
  tags.add(`${priority}_priority`);

  if ((payload.estimated_locations || 0) >= 10) {
    tags.add('multi_location');
  }
  if ((payload.headcount || 0) >= 200) {
    tags.add('enterprise_headcount');
  }
  if (payload.location.state === 'NJ') {
    tags.add('local_nj');
  }

  return Array.from(tags);
}
