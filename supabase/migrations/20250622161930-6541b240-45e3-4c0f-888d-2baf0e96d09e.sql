
-- Create a table for SEO settings
CREATE TABLE public.seo_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  page_title TEXT NOT NULL DEFAULT 'Apartmán Tília - Bešeňová',
  meta_description TEXT NOT NULL DEFAULT 'Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová.',
  meta_keywords TEXT NOT NULL DEFAULT 'apartmán, Bešeňová, ubytovanie, aquapark, Liptov',
  og_title TEXT NOT NULL DEFAULT 'Apartmán Tília - Bešeňová',
  og_description TEXT NOT NULL DEFAULT 'Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová.',
  og_image TEXT NOT NULL DEFAULT 'https://lovable.dev/opengraph-image-p98pqg.png',
  twitter_title TEXT NOT NULL DEFAULT 'Apartmán Tília - Bešeňová',
  twitter_description TEXT NOT NULL DEFAULT 'Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová.',
  canonical_url TEXT NOT NULL DEFAULT 'https://apartman-tilia.lovable.app',
  structured_data TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a constraint to ensure only one row exists
ALTER TABLE public.seo_settings ADD CONSTRAINT seo_settings_single_row CHECK (id = 1);

-- Insert default SEO settings
INSERT INTO public.seo_settings (id) VALUES (1);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
