-- Create a table for discount coupons
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  min_stay_nights INTEGER DEFAULT 1,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  usage_limit INTEGER DEFAULT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for coupon access
CREATE POLICY "Anyone can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all coupons" 
ON public.coupons 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster coupon code lookups
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active_dates ON public.coupons(is_active, valid_from, valid_to);