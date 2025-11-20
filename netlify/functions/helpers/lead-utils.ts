import type { WithId } from 'mongodb';
import { LeadRecord, LeadSubmissionPayload, LeadPriority, LeadInsights } from './lead-types';

interface CoordinateRecord {
  state: string;
  city: string;
  coordinates: [number, number];
}

const GEO_CACHE: CoordinateRecord[] = [
  { city: 'toms river', state: 'nj', coordinates: [-74.1979, 39.9537] },
  { city: 'atlantic city', state: 'nj', coordinates: [-74.4229, 39.3643] },
  { city: 'newark', state: 'nj', coordinates: [-74.1724, 40.7357] },
  { city: 'jersey city', state: 'nj', coordinates: [-74.074, 40.7282] },
  { city: 'trenton', state: 'nj', coordinates: [-74.7439, 40.2171] },
  { city: 'camden', state: 'nj', coordinates: [-75.1196, 39.9259] },
  { city: 'cherry hill', state: 'nj', coordinates: [-75.0379, 39.9268] },
  { city: 'philadelphia', state: 'pa', coordinates: [-75.1652, 39.9526] },
  { city: 'king of prussia', state: 'pa', coordinates: [-75.3899, 40.1013] },
  { city: 'wilmington', state: 'de', coordinates: [-75.5467, 39.7447] },
];

const PRIORITY_THRESHOLDS: Record<LeadPriority, number> = {
  hot: 80,
  warm: 55,
  nurture: 0,
};

export function scoreLead(payload: LeadSubmissionPayload): number {
  let score = 0;

  if (payload.business_type === 'restaurant') {
    score += 35;
  } else if (payload.business_type === 'fleet') {
    score += 25;
  } else {
    score += 15;
  }

  if (payload.submission_type === 'strategy') {
    score += 25;
  } else {
    score += 18;
  }

  if (payload.estimated_locations && payload.estimated_locations >= 10) {
    score += 20;
  } else if (payload.estimated_locations && payload.estimated_locations >= 5) {
    score += 12;
  } else if (payload.estimated_locations && payload.estimated_locations >= 2) {
    score += 5;
  }

  if (payload.headcount && payload.headcount >= 200) {
    score += 15;
  } else if (payload.headcount && payload.headcount >= 100) {
    score += 10;
  }

  const utmSource = payload.marketing?.utm_source?.toLowerCase();
  if (utmSource) {
    if (utmSource.includes('paid')) {
      score += 10;
    } else if (utmSource.includes('event')) {
      score += 8;
    } else if (utmSource.includes('referral')) {
      score += 6;
    }
  }

  const city = payload.location.city.toLowerCase();
  const state = payload.location.state.toLowerCase();
  if (state === 'nj' || state === 'pa' || state === 'de') {
    score += 10;
  }
  if (state === 'nj' && city === 'toms river') {
    score += 5;
  }

  return Math.min(score, 100);
}

export function determinePriority(score: number): LeadPriority {
  if (score >= PRIORITY_THRESHOLDS.hot) {
    return 'hot';
  }
  if (score >= PRIORITY_THRESHOLDS.warm) {
    return 'warm';
  }
  return 'nurture';
}

export function buildLeadInsights(payload: LeadSubmissionPayload, score: number): LeadInsights {
  const insights: LeadInsights = {
    ideal_software_tier: score >= 80 ? 'enterprise' : score >= 55 ? 'growth' : 'starter',
    recommended_product_focus: payload.business_type === 'restaurant'
      ? 'Food waste tracking & AP automation'
      : payload.business_type === 'fleet'
        ? 'Fleet compliance dashboards & maintenance scheduling'
        : 'Operational intelligence starter package',
    follow_up_actions: [],
  };

  if (payload.submission_type === 'strategy') {
    insights.follow_up_actions.push('Schedule strategy workshop within 24h');
  } else {
    insights.follow_up_actions.push('Offer pilot kickoff within 72h');
  }

  if ((payload.estimated_locations || 0) >= 10) {
    insights.follow_up_actions.push('Share multi-location ROI benchmarks');
  }

  if (payload.location.state.toLowerCase() === 'nj') {
    insights.follow_up_actions.push('Highlight local NJ support team availability');
  }

  return insights;
}

export function resolveCoordinates(city: string, state: string): [number, number] | undefined {
  const normalizedCity = city.trim().toLowerCase();
  const normalizedState = state.trim().toLowerCase();
  const record = GEO_CACHE.find(entry => entry.city === normalizedCity && entry.state === normalizedState);
  return record?.coordinates;
}

export async function sendWebhookNotification(
  lead: WithId<LeadRecord>,
  webhookUrl?: string,
): Promise<void> {
  if (!webhookUrl || typeof fetch === 'undefined') {
    return;
  }

  const payload = {
    text: `New ${lead.priority.toUpperCase()} lead: ${lead.name} (${lead.company})`,
    fields: {
      business_type: lead.business_type,
      submission_type: lead.submission_type,
      email: lead.email,
      phone: lead.phone,
      location: `${lead.location.city}, ${lead.location.state}`,
      score: lead.score,
      recommended_follow_up: lead.insights.follow_up_actions.join('; '),
    },
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Ignore webhook errors for now
  });
}

