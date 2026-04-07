-- ============================================
-- VelocityCRM — Supabase Setup Script
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('agent', 'manager');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'converted', 'cancelled');
CREATE TYPE public.order_status AS ENUM ('confirmed', 'dispatched', 'delivered', 'rto', 'cancelled');

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  monthly_target NUMERIC DEFAULT 100000,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. USER ROLES TABLE (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 4. LEADS TABLE
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT,
  source TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status lead_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT DEFAULT '',
  language TEXT DEFAULT 'tamil'
);

-- 5. ORDERS TABLE
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  products JSONB DEFAULT '[]',
  total_amount NUMERIC DEFAULT 0,
  address JSONB DEFAULT '{}',
  status order_status DEFAULT 'confirmed',
  agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  timeline JSONB DEFAULT '[]'
);

-- 6. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 7. SECURITY DEFINER FUNCTIONS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_my_agent_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE id = auth.uid()
$$;

-- 8. RLS POLICIES — PROFILES
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Managers can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

-- 9. RLS POLICIES — USER ROLES
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 10. RLS POLICIES — LEADS
CREATE POLICY "Agents see assigned leads"
  ON public.leads FOR SELECT
  USING (assigned_to = public.get_my_agent_id());

CREATE POLICY "Managers see all leads"
  ON public.leads FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Agents can update own leads"
  ON public.leads FOR UPDATE
  USING (assigned_to = public.get_my_agent_id());

CREATE POLICY "Managers can do all on leads"
  ON public.leads FOR ALL
  USING (public.has_role(auth.uid(), 'manager'));

-- 11. RLS POLICIES — ORDERS
CREATE POLICY "Agents see own orders"
  ON public.orders FOR SELECT
  USING (agent_id = public.get_my_agent_id());

CREATE POLICY "Managers see all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Agents can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (agent_id = public.get_my_agent_id());

CREATE POLICY "Agents can update own orders"
  ON public.orders FOR UPDATE
  USING (agent_id = public.get_my_agent_id());

CREATE POLICY "Managers can do all on orders"
  ON public.orders FOR ALL
  USING (public.has_role(auth.uid(), 'manager'));

-- 12. AUTO-CREATE PROFILE ON SIGNUP (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, agent_id, name, email, monthly_target, active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'agent_id', 'A' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0')),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'monthly_target')::numeric, 100000),
    true
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'agent'));

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA: Create users via Supabase Auth Dashboard
-- ============================================
-- After running this SQL, go to your Supabase Dashboard > Authentication > Users
-- and create the following users:
--
-- Agent 1:
--   Email: arjun@velocity.com
--   Password: agent123
--   User Metadata: {"agent_id": "A001", "name": "Arjun Mehta", "role": "agent", "monthly_target": 150000}
--
-- Agent 2:
--   Email: neha@velocity.com
--   Password: agent123
--   User Metadata: {"agent_id": "A002", "name": "Neha Gupta", "role": "agent", "monthly_target": 120000}
--
-- Manager:
--   Email: vikash@velocity.com
--   Password: manager123
--   User Metadata: {"agent_id": "M001", "name": "Vikash Manager", "role": "manager", "monthly_target": 0}
--
-- Then insert seed leads & orders below:

-- SEED LEADS (run after creating users above)
INSERT INTO public.leads (name, phone, email, city, source, assigned_to, status, notes, language)
SELECT 'Rahul Sharma', '9876543210', 'rahul@email.com', 'Bengaluru', 'meta', id, 'new', 'Interested in premium combos', 'tamil' FROM public.profiles WHERE agent_id = 'A001'
UNION ALL
SELECT 'Priya Patel', '9876543211', 'priya@email.com', 'Mumbai', 'taboola', id, 'new', 'Repeat customer', 'tamil' FROM public.profiles WHERE agent_id = 'A001'
UNION ALL
SELECT 'Amit Kumar', '9876543212', 'amit@email.com', 'Delhi', 'trafficstars', id, 'contacted', 'Wants COD only', 'tamil' FROM public.profiles WHERE agent_id = 'A001';

-- SEED ORDERS
INSERT INTO public.orders (id, lead_id, customer_name, customer_phone, products, total_amount, address, status, agent_id, agent_name, created_at, updated_at, timeline) VALUES
  ('ORD-20240301-001', 'L010', 'Rajesh Khanna', '9800000001',
    '[{"id":"P001","name":"Slim Fit Combo","price":1499,"combo":"A","description":"2x Shirts + 1x Trouser"}]',
    1499, '{"area":"Koramangala","postOffice":"Koramangala PO","pincode":"560034","state":"Karnataka","city":"Bengaluru"}',
    'delivered', 'A001', 'Arjun Mehta', now() - interval '3 days', now() - interval '1 hour',
    '[{"status":"confirmed","timestamp":"2024-03-01T10:00:00Z"},{"status":"dispatched","timestamp":"2024-03-02T10:00:00Z"},{"status":"delivered","timestamp":"2024-03-03T10:00:00Z"}]'),
  ('ORD-20240301-002', 'L011', 'Meena Kumari', '9800000002',
    '[{"id":"P003","name":"Premium Bundle","price":2499,"combo":"C","description":"2x Shirts + 2x Trousers + Belt"}]',
    2499, '{"area":"Bandra West","postOffice":"Bandra PO","pincode":"400050","state":"Maharashtra","city":"Mumbai"}',
    'dispatched', 'A001', 'Arjun Mehta', now() - interval '2 days', now() - interval '12 hours',
    '[{"status":"confirmed","timestamp":"2024-03-01T10:00:00Z"},{"status":"dispatched","timestamp":"2024-03-02T10:00:00Z"}]'),
  ('ORD-20240302-003', 'L012', 'Sunil Gavaskar', '9800000003',
    '[{"id":"P002","name":"Classic Pack","price":999,"combo":"B","description":"3x T-Shirts"},{"id":"P004","name":"Summer Essentials","price":799,"combo":"D","description":"4x Cotton T-Shirts"}]',
    1798, '{"area":"Connaught Place","postOffice":"CP PO","pincode":"110001","state":"Delhi","city":"New Delhi"}',
    'rto', 'A002', 'Neha Gupta', now() - interval '4 days', now() - interval '1 day',
    '[{"status":"confirmed","timestamp":"2024-03-01T10:00:00Z"},{"status":"dispatched","timestamp":"2024-03-02T10:00:00Z"},{"status":"rto","timestamp":"2024-03-03T10:00:00Z"}]'),
  ('ORD-20240303-004', 'L013', 'Lata Mangeshkar', '9800000004',
    '[{"id":"P005","name":"Formal Set","price":1999,"combo":"E","description":"2x Formal Shirts + 1x Blazer"}]',
    1999, '{"area":"Salt Lake","postOffice":"Salt Lake PO","pincode":"700091","state":"West Bengal","city":"Kolkata"}',
    'confirmed', 'A001', 'Arjun Mehta', now() - interval '2 hours', now() - interval '2 hours',
    '[{"status":"confirmed","timestamp":"2024-03-03T10:00:00Z"}]'),
  ('ORD-20240303-005', 'L014', 'Sachin Tendulkar', '9800000005',
    '[{"id":"P006","name":"Sports Kit","price":1299,"combo":"F","description":"2x Track Pants + 2x Dry-Fit Tees"}]',
    1299, '{"area":"Powai","postOffice":"Powai PO","pincode":"400076","state":"Maharashtra","city":"Mumbai"}',
    'cancelled', 'A002', 'Neha Gupta', now() - interval '3 hours', now() - interval '1 hour',
    '[{"status":"confirmed","timestamp":"2024-03-03T10:00:00Z"},{"status":"cancelled","timestamp":"2024-03-03T12:00:00Z"}]');
