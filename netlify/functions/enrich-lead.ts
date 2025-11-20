import { Handler } from '@netlify/functions';
import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { LeadRecord } from './helpers/lead-types';

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
    const body = JSON.parse(event.body || '{}') as { leadId?: string };
    if (!body.leadId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'leadId is required' }),
      };
    }

    let leadObjectId: ObjectId;
    try {
      leadObjectId = new ObjectId(body.leadId);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid leadId' }),
      };
    }

    const db = await getDatabase();
    const leadsCollection = db.collection<LeadRecord>('leads');
    const lead = await leadsCollection.findOne({ _id: leadObjectId });

    if (!lead) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Lead not found' }),
      };
    }

    const domain = lead.email.split('@')[1] || 'unknown.com';
    const enrichment = deriveEnrichment(domain, lead.business_type);

    await leadsCollection.updateOne(
      { _id: lead._id },
      {
        $set: {
          ...enrichment,
          updated_at: new Date(),
        },
      },
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        leadId: lead._id,
        enrichment,
      }),
    };
  } catch (error) {
    console.error('Error enriching lead:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to enrich lead',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

function deriveEnrichment(domain: string, businessType: LeadRecord['business_type']) {
  const heuristics = getDomainHeuristics(domain);

  return {
    headcount: heuristics.estimatedHeadcount,
    tags: heuristics.tags,
    enrichment_status: 'complete' as const,
    enrichment_notes: `Enriched via domain heuristics (${domain})`,
    marketing: {
      lead_source: heuristics.leadSource,
      utm_source: heuristics.utmSource,
    },
    insights: {
      ideal_software_tier: heuristics.tier,
      recommended_product_focus:
        businessType === 'fleet'
          ? 'Fleet compliance automation'
          : 'Food waste + AP automation bundle',
      follow_up_actions: heuristics.followUps,
    },
  };
}

function getDomainHeuristics(domain: string) {
  const lower = domain.toLowerCase();
  if (lower.includes('group')) {
    return {
      estimatedHeadcount: 500,
      leadSource: 'account_based',
      utmSource: 'account_based',
      tier: 'enterprise',
      tags: ['enterprise', 'abm_target'],
      followUps: ['Route to enterprise AE', 'Invite to executive briefing'],
    };
  }

  if (lower.includes('cafe') || lower.includes('dining')) {
    return {
      estimatedHeadcount: 150,
      leadSource: 'inbound_content',
      utmSource: 'seo',
      tier: 'growth',
      tags: ['hospitality', 'regional_chain'],
      followUps: ['Share food waste case study', 'Offer analytics walkthrough'],
    };
  }

  return {
    estimatedHeadcount: 75,
    leadSource: 'organic',
    utmSource: 'direct',
    tier: 'starter',
    tags: ['smb'],
    followUps: ['Send personalized onboarding plan'],
  };
}

