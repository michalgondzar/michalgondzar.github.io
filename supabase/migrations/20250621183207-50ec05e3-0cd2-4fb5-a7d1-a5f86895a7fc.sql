
-- Add is_admin column to page_visits table
ALTER TABLE public.page_visits 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
