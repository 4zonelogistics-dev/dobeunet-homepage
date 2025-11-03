/*
  # Create Leads Table for Contact Form Submissions

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text) - Full name of contact
      - `email` (text) - Email address
      - `company` (text) - Company name
      - `business_type` (text) - Type of business (restaurant/fleet/other)
      - `phone` (text) - Phone number
      - `message` (text) - Additional message
      - `submission_type` (text) - Type of submission (strategy/pilot)
      - `created_at` (timestamptz) - Submission timestamp

  2. Security
    - Enable RLS on `leads` table
    - Add policy for authenticated admin users to read all leads
    - Allow anonymous inserts for contact form submissions
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  business_type text NOT NULL,
  phone text NOT NULL,
  message text DEFAULT '',
  submission_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for contact forms"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);
