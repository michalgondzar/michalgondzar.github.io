
-- Allow anonymous users to insert bookings (public booking form)
CREATE POLICY "Allow anonymous users to create bookings" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);

-- Keep existing policies for authenticated users (admin access)
-- The existing policies already handle SELECT, UPDATE, DELETE for authenticated users
