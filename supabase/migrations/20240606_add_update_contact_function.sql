
-- Vytvorenie funkcie pre aktualizáciu kontaktných údajov
CREATE OR REPLACE FUNCTION public.update_contact_info(
  p_address text,
  p_postal_code text,
  p_phone text,
  p_email text,
  p_checkin_time text,
  p_checkout_time text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.contact_info 
  SET 
    address = p_address,
    postal_code = p_postal_code,
    phone = p_phone,
    email = p_email,
    checkin_time = p_checkin_time,
    checkout_time = p_checkout_time,
    updated_at = now()
  WHERE id = 1;
END;
$$;
