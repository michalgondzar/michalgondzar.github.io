
-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images', 
  'gallery-images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
);

-- Create policy to allow public access to gallery images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update images
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
