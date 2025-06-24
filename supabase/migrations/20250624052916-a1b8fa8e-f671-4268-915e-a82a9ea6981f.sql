
-- Update the tourist tax to 2.00 euros in the pricing table
UPDATE public.pricing 
SET tourist_tax = '2.00', 
    updated_at = now() 
WHERE id = 1;
