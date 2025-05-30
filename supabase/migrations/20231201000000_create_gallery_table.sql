
-- Create gallery table for storing gallery data
CREATE TABLE gallery (
  id INTEGER PRIMARY KEY DEFAULT 1,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial empty gallery record
INSERT INTO gallery (id, images) VALUES (1, '[]'::jsonb);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_gallery_updated_at 
    BEFORE UPDATE ON gallery 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a single gallery)
CREATE POLICY "Allow all operations on gallery" ON gallery
    FOR ALL USING (true);
