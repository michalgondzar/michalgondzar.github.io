
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs daily at 23:00 (11 PM)
SELECT cron.schedule(
  'daily-calendar-sync',
  '0 23 * * *', -- daily at 23:00
  $$
  SELECT
    net.http_post(
        url:='https://chifftwhhzklnauykhcg.supabase.co/functions/v1/fetch-ical',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaWZmdHdoaHprbG5hdXlraGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDMwODYsImV4cCI6MjA2NDE3OTA4Nn0.VE38ZjxAf9H4fGR2Ot1WIz13zbvEg4C0aaL74AtT5bA"}'::jsonb,
        body:='{"url": "https://ical.booking.com/v1/export?t=38af27a7-67ee-4b15-b329-505a369d9ea4", "auto_sync": true}'::jsonb
    ) as request_id;
  $$
);
