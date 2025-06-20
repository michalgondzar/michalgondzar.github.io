
-- Add country column to page_visits table
ALTER TABLE public.page_visits 
ADD COLUMN country TEXT;

-- Add index for better performance when querying by country
CREATE INDEX idx_page_visits_country ON public.page_visits(country);
