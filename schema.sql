-- Create Providers Table
CREATE TABLE public.providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    description TEXT,
    creator_id UUID, -- References auth.users if possible, but kept loose for now
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reviews Table
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    user_id UUID, -- References auth.users
    user_name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'POSITIVE' or 'NEGATIVE'
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for Providers
CREATE POLICY "Public providers are viewable by everyone" ON public.providers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert providers" ON public.providers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only admin can delete providers (restricted by email)
CREATE POLICY "Only admin can delete providers" ON public.providers
    FOR DELETE USING (auth.jwt() ->> 'email' = 'diego.uss@gmail.com');

-- Policies for Reviews
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only admin can delete reviews (restricted by email)
CREATE POLICY "Only admin can delete reviews" ON public.reviews
    FOR DELETE USING (auth.jwt() ->> 'email' = 'diego.uss@gmail.com');


-- Seed Data (Initial)
INSERT INTO public.providers (name, phone, category, tags, description) VALUES
('Carlos Silva', '11999991234', 'Reformas e Reparos', ARRAY['eletricista', 'chuveiro', 'tomada'], 'Eletricista residencial com 10 anos de experiência.'),
('Diarista Maria', '11988885678', 'Limpeza e Higiene', ARRAY['faxina', 'limpeza de vidros'], 'Especialista em limpeza pesada.');

-- Note: We can't easily seed connected reviews via simple SQL without knowing the generated IDs using CTEs, but this is enough to start.
