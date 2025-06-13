
-- Drop all existing policies for bookings table
DROP POLICY IF EXISTS "Allow anonymous users to create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Enable anonymous bookings insert" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to delete bookings" ON public.bookings;

-- Create a simple policy that allows anyone to insert bookings
CREATE POLICY "public_bookings_insert" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- Keep existing policies for authenticated users (admin access)
CREATE POLICY "authenticated_bookings_select" ON public.bookings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_bookings_update" ON public.bookings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "authenticated_bookings_delete" ON public.bookings
    FOR DELETE TO authenticated USING (true);
