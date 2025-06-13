
-- First, drop any existing duplicate policies
DROP POLICY IF EXISTS "Allow anonymous users to create bookings" ON public.bookings;

-- Now create the policy with a unique name
CREATE POLICY "Enable anonymous bookings insert" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);
