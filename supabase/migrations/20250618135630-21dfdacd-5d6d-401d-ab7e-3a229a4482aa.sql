
-- Create a table for pricing information
CREATE TABLE public.pricing (
  id INTEGER NOT NULL DEFAULT 1 PRIMARY KEY,
  low_season_weekday TEXT NOT NULL DEFAULT '45',
  low_season_weekend TEXT NOT NULL DEFAULT '55',
  high_season_weekday TEXT NOT NULL DEFAULT '65',
  high_season_weekend TEXT NOT NULL DEFAULT '75',
  cleaning_fee TEXT NOT NULL DEFAULT '25',
  tourist_tax TEXT NOT NULL DEFAULT '1.50',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default pricing data
INSERT INTO public.pricing (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE TRIGGER update_pricing_updated_at
  BEFORE UPDATE ON public.pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
