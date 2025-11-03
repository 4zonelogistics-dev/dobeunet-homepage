/*
  # SEO Tracking and Content Management Schema

  1. New Tables
    - `keyword_rankings`
      - Tracks keyword positions over time
      - Includes search volume, competition, and location data
    - `content_calendar`
      - Manages content planning and publishing schedule
      - Tracks content type, status, and performance metrics
    - `local_citations`
      - Monitors local directory listings
      - Tracks NAP consistency and citation status
    - `competitor_tracking`
      - Monitors competitor SEO metrics
      - Tracks rankings, backlinks, and content velocity
    - `backlinks`
      - Tracks incoming backlinks
      - Monitors link quality and status
    - `location_pages`
      - Manages geographic landing pages
      - Tracks location-specific metrics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage SEO data
    - Restrict public access to sensitive competitive data

  3. Indexes
    - Add indexes for frequently queried fields (keyword, date, status)
    - Optimize for time-series queries (rank tracking over time)
*/

-- Keyword Rankings Table
CREATE TABLE IF NOT EXISTS keyword_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text NOT NULL,
  position integer,
  search_volume integer,
  competition text CHECK (competition IN ('low', 'medium', 'high')),
  location text DEFAULT 'US',
  search_intent text CHECK (search_intent IN ('informational', 'commercial', 'transactional', 'navigational')),
  tracked_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  notes text
);

CREATE INDEX IF NOT EXISTS idx_keyword_rankings_keyword ON keyword_rankings(keyword);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_date ON keyword_rankings(tracked_date DESC);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_position ON keyword_rankings(position);

ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view keyword rankings"
  ON keyword_rankings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert keyword rankings"
  ON keyword_rankings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update keyword rankings"
  ON keyword_rankings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Content Calendar Table
CREATE TABLE IF NOT EXISTS content_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content_type text NOT NULL CHECK (content_type IN ('blog_post', 'landing_page', 'case_study', 'guide', 'tool', 'video', 'infographic')),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'review', 'published', 'updated')),
  target_keyword text,
  word_count integer,
  author text,
  publish_date date,
  last_updated timestamptz,
  page_views integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  avg_time_on_page interval,
  url text,
  meta_description text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);
CREATE INDEX IF NOT EXISTS idx_content_calendar_publish_date ON content_calendar(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_content_calendar_type ON content_calendar(content_type);

ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage content calendar"
  ON content_calendar FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Local Citations Table
CREATE TABLE IF NOT EXISTS local_citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  directory_name text NOT NULL,
  directory_url text,
  citation_url text,
  business_name text NOT NULL,
  address text,
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'verified', 'needs_update', 'removed')),
  domain_authority integer,
  category text CHECK (category IN ('tier_1', 'tier_2', 'tier_3', 'industry', 'local')),
  nap_consistent boolean DEFAULT true,
  last_verified timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_local_citations_status ON local_citations(status);
CREATE INDEX IF NOT EXISTS idx_local_citations_category ON local_citations(category);

ALTER TABLE local_citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage citations"
  ON local_citations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Competitor Tracking Table
CREATE TABLE IF NOT EXISTS competitor_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name text NOT NULL,
  website text NOT NULL,
  domain_authority integer,
  total_backlinks integer,
  referring_domains integer,
  keywords_ranking integer,
  content_published_month integer DEFAULT 0,
  tracked_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_competitor_tracking_date ON competitor_tracking(tracked_date DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_tracking_competitor ON competitor_tracking(competitor_name);

ALTER TABLE competitor_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view competitor data"
  ON competitor_tracking FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert competitor data"
  ON competitor_tracking FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Backlinks Table
CREATE TABLE IF NOT EXISTS backlinks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url text NOT NULL,
  source_domain text NOT NULL,
  target_url text NOT NULL,
  anchor_text text,
  link_type text CHECK (link_type IN ('dofollow', 'nofollow', 'ugc', 'sponsored')),
  domain_authority integer,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'lost', 'pending')),
  acquired_method text CHECK (acquired_method IN ('guest_post', 'directory', 'partnership', 'press', 'organic', 'other')),
  discovered_date date DEFAULT CURRENT_DATE,
  last_checked timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_backlinks_status ON backlinks(status);
CREATE INDEX IF NOT EXISTS idx_backlinks_domain ON backlinks(source_domain);
CREATE INDEX IF NOT EXISTS idx_backlinks_target ON backlinks(target_url);

ALTER TABLE backlinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage backlinks"
  ON backlinks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Location Pages Table
CREATE TABLE IF NOT EXISTS location_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name text NOT NULL,
  state text NOT NULL,
  county text,
  city text,
  url text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'published', 'needs_update')),
  target_keyword text,
  monthly_searches integer,
  current_rank integer,
  page_views integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  local_case_study_id uuid,
  publish_date date,
  last_updated timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_location_pages_status ON location_pages(status);
CREATE INDEX IF NOT EXISTS idx_location_pages_state ON location_pages(state);
CREATE INDEX IF NOT EXISTS idx_location_pages_rank ON location_pages(current_rank);

ALTER TABLE location_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage location pages"
  ON location_pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Calculator Submissions Table (extends existing leads tracking)
CREATE TABLE IF NOT EXISTS calculator_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_type text NOT NULL CHECK (calculator_type IN ('food_waste', 'ap_automation', 'location_comparison', 'tech_stack')),
  email text NOT NULL,
  company_name text,
  num_locations integer,
  calculated_savings numeric,
  roi_months numeric,
  submission_data jsonb,
  lead_created boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calculator_submissions_type ON calculator_submissions(calculator_type);
CREATE INDEX IF NOT EXISTS idx_calculator_submissions_date ON calculator_submissions(created_at DESC);

ALTER TABLE calculator_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view calculator submissions"
  ON calculator_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can submit calculator data"
  ON calculator_submissions FOR INSERT
  TO anon
  WITH CHECK (true);
