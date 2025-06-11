
-- Create bookings table
CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    date_from date NOT NULL,
    date_to date NOT NULL,
    guests integer NOT NULL DEFAULT 2,
    stay_type text,
    coupon text,
    status text NOT NULL DEFAULT 'Čaká na potvrdenie',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Allow authenticated users to view all bookings" ON public.bookings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert bookings" ON public.bookings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bookings" ON public.bookings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete bookings" ON public.bookings
    FOR DELETE TO authenticated USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
