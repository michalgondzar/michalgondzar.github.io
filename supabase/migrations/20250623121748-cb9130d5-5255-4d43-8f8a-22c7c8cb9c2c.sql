
-- Create email_logs table for tracking email delivery
CREATE TABLE public.email_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email text NOT NULL,
  email_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  booking_id uuid REFERENCES public.bookings(id),
  error_message text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies for email_logs (admin only access)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users (for admin panel)
CREATE POLICY "Allow read access to email logs" ON public.email_logs
  FOR SELECT USING (true);

-- Allow insert access to all authenticated users (for logging emails)
CREATE POLICY "Allow insert access to email logs" ON public.email_logs
  FOR INSERT WITH CHECK (true);
