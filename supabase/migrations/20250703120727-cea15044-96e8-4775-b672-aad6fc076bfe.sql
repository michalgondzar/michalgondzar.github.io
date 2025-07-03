-- Add bilingual fields to apartment_content table
ALTER TABLE public.apartment_content 
ADD COLUMN title_sk TEXT,
ADD COLUMN title_pl TEXT,
ADD COLUMN subtitle_sk TEXT,
ADD COLUMN subtitle_pl TEXT,
ADD COLUMN paragraph1_sk TEXT,
ADD COLUMN paragraph1_pl TEXT,
ADD COLUMN paragraph2_sk TEXT,
ADD COLUMN paragraph2_pl TEXT,
ADD COLUMN features_sk JSONB,
ADD COLUMN features_pl JSONB;

-- Migrate existing data to Slovak fields
UPDATE public.apartment_content 
SET 
  title_sk = title,
  subtitle_sk = subtitle,
  paragraph1_sk = paragraph1,
  paragraph2_sk = paragraph2,
  features_sk = features;

-- Set default Polish content
UPDATE public.apartment_content 
SET 
  title_pl = 'Apartament Tília - Bešeňová',
  subtitle_pl = 'Komfortowy apartament w pobliżu aquaparku',
  paragraph1_pl = 'Nasz apartament oferuje doskonałe warunki do wypoczynku w sercu Bešeňovej. Z łatwym dostępem do aquaparku i pięknych widoków na góry.',
  paragraph2_pl = 'Przestronny apartament wyposażony we wszystkie niezbędne udogodnienia zapewni Państwu komfortowy pobyt na Słowacji.',
  features_pl = '["Blisko aquaparku", "Wi-Fi", "Parking", "Widok na góry", "Kuchnia", "Balkon"]';