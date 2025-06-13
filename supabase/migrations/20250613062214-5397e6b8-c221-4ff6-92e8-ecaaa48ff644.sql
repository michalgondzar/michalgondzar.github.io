
-- Create a table for availability calendar
CREATE TABLE public.availability_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.availability_calendar
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create index for faster date queries
CREATE INDEX idx_availability_calendar_date ON public.availability_calendar (date);
