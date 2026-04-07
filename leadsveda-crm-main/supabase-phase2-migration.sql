-- ============================================
-- Phase 2 Migration: Lead Capture System
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Make assigned_agent nullable (for unassigned leads)
ALTER TABLE public.leads ALTER COLUMN assigned_agent DROP NOT NULL;

-- 2. Add language column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'tamil';

-- 3. Allow the edge function (service_role) to insert leads
-- The service_role key bypasses RLS, so no extra policy needed.

-- 4. Add RLS policy so managers can update leads (for assignment)
-- (Already covered by "Managers can do all on leads" policy)

-- 5. Insert some unassigned seed leads for testing
INSERT INTO public.leads (id, name, phone, email, city, source, assigned_agent, status, language, notes) VALUES
  ('L009', 'Murugan K', '9849012345', 'murugan.k@gmail.com', 'Chennai', 'meta', NULL, 'new', 'tamil', 'From Meta campaign'),
  ('L010', 'Lakshmi S', '9850123456', 'lakshmi.s@gmail.com', 'Madurai', 'taboola', NULL, 'new', 'tamil', 'Landing page lead'),
  ('L011', 'Senthil R', '9851234567', 'senthil.r@gmail.com', 'Coimbatore', 'trafficstars', NULL, 'new', 'tamil', ''),
  ('L012', 'Kavitha M', '9852345678', 'kavitha.m@gmail.com', 'Trichy', 'meta', NULL, 'new', 'tamil', 'Interested in combo packs'),
  ('L013', 'Rajan P', '9853456789', 'rajan.p@gmail.com', 'Salem', 'taboola', NULL, 'new', 'tamil', '');
