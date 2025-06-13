
-- Temporarily disable RLS for bookings table to allow anonymous inserts
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Or alternatively, if we want to keep RLS enabled, create a completely permissive policy
-- DROP POLICY IF EXISTS "public_bookings_insert" ON public.bookings;
-- CREATE POLICY "allow_all_inserts" ON public.bookings FOR INSERT WITH CHECK (true);
-- CREATE POLICY "allow_all_selects" ON public.bookings FOR SELECT USING (true);
