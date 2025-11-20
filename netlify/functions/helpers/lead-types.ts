import type { Document } from 'mongodb';

export type SubmissionType = 'strategy' | 'pilot';
export type BusinessType = 'restaurant' | 'fleet' | 'other';
export type LeadPriority = 'hot' | 'warm' | 'nurture';

export interface LeadMarketingMeta {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  lead_source?: string;
}

export interface LeadLocation {
  city: string;
  state: string;
  postal_code: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  company: string;
  business_type: BusinessType;
  phone: string;
  message?: string;
  submission_type: SubmissionType;
  location: LeadLocation;
  estimated_locations?: number;
  headcount?: number;
  marketing?: LeadMarketingMeta;
}

export interface LeadInsights {
  ideal_software_tier: 'starter' | 'growth' | 'enterprise';
  recommended_product_focus: string;
  follow_up_actions: string[];
}

export interface LeadRecord extends Document, LeadSubmissionPayload {
  created_at: Date;
  updated_at: Date;
  score: number;
  priority: LeadPriority;
  insights: LeadInsights;
  enrichment_status: 'pending' | 'complete' | 'skipped';
  enrichment_notes?: string;
  tags?: string[];
}

export interface LeadSearchFacets {
  businessTypes: Array<{ value: BusinessType; count: number }>;
  submissionTypes: Array<{ value: SubmissionType; count: number }>;
  priorities: Array<{ value: LeadPriority; count: number }>;
  states: Array<{ value: string; count: number }>;
}

export interface LeadSearchResult {
  results: LeadRecord[];
  total: number;
  limit: number;
  offset: number;
  facets: LeadSearchFacets;
}

