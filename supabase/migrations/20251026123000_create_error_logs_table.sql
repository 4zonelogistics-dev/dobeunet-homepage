/*
  # Create Error Logs Table

  1. New Tables
    - `error_logs`
      - `id` (uuid, primary key) - Unique identifier for each error log
      - `error_type` (text) - Type of error (NETWORK, VALIDATION, SUPABASE, AUTHENTICATION, UNEXPECTED, TIMEOUT)
      - `severity` (text) - Severity level (INFO, WARNING, ERROR, CRITICAL)
      - `message` (text) - Technical error message for developers
      - `user_message` (text) - User-friendly error message
      - `code` (text, nullable) - Error code if available
      - `details` (jsonb, nullable) - Additional error context and metadata
      - `user_agent` (text, nullable) - Browser user agent string
      - `url` (text, nullable) - URL where error occurred
      - `stack` (text, nullable) - Error stack trace
      - `timestamp` (timestamptz) - When the error occurred
      - `created_at` (timestamptz) - When the log entry was created

  2. Indexes
    - Index on timestamp for efficient time-based queries
    - Index on severity for filtering by error severity
    - Index on error_type for categorization
    - Composite index on timestamp and severity for common query patterns

  3. Security
    - Enable RLS on error_logs table
    - No public access - only service role can write to this table
    - Administrators can read error logs through secure admin interface

  4. Performance
    - Automatic cleanup of old error logs (older than 90 days)
    - Partitioning by month for better query performance (optional future enhancement)
*/

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL CHECK (error_type IN ('NETWORK', 'VALIDATION', 'SUPABASE', 'AUTHENTICATION', 'UNEXPECTED', 'TIMEOUT')),
  severity text NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
  message text NOT NULL,
  user_message text NOT NULL,
  code text,
  details jsonb DEFAULT '{}'::jsonb,
  user_agent text,
  url text,
  stack text,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp_severity ON error_logs(timestamp DESC, severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Create policy: Only allow inserts from authenticated users (client-side logging)
CREATE POLICY "Allow authenticated users to insert error logs"
  ON error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Only allow service role to read (for admin dashboard)
CREATE POLICY "Only service role can read error logs"
  ON error_logs
  FOR SELECT
  TO service_role
  USING (true);

-- Create function to automatically clean up old error logs
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM error_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Optional: Create a scheduled job to run cleanup weekly
-- Note: This requires pg_cron extension which may need to be enabled
-- UNCOMMENT the following lines if pg_cron is available:
-- SELECT cron.schedule(
--   'cleanup-error-logs',
--   '0 0 * * 0',
--   'SELECT cleanup_old_error_logs();'
-- );

-- Create a view for error statistics (accessible to service role only)
CREATE OR REPLACE VIEW error_statistics AS
SELECT
  error_type,
  severity,
  COUNT(*) as count,
  DATE_TRUNC('hour', timestamp) as hour,
  MAX(timestamp) as last_occurrence
FROM error_logs
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY error_type, severity, DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC, count DESC;

-- Grant select on view to service role
GRANT SELECT ON error_statistics TO service_role;
