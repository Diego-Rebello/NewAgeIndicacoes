-- =====================================================
-- MIGRATION: Fix RLS Delete Policies (Admin Only)
-- Run this in Supabase SQL Editor to apply the fix
-- =====================================================

-- Step 1: Drop the old permissive delete policies
DROP POLICY IF EXISTS "Authenticated users can delete providers" ON public.providers;
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;

-- Step 2: Create new restricted delete policies (admin email only)
CREATE POLICY "Only admin can delete providers" ON public.providers
    FOR DELETE USING (auth.jwt() ->> 'email' = 'diego.uss@gmail.com');

CREATE POLICY "Only admin can delete reviews" ON public.reviews
    FOR DELETE USING (auth.jwt() ->> 'email' = 'diego.uss@gmail.com');

-- Done! Now only diego.uss@gmail.com can delete providers and reviews.
