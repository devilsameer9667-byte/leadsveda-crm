-- ============================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- Adds order_code, timeline, and ensures all required columns exist
-- ============================================

-- Add order_code column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='order_code') THEN
    ALTER TABLE public.orders ADD COLUMN order_code TEXT UNIQUE;
  END IF;
END$$;

-- Add timeline column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='timeline') THEN
    ALTER TABLE public.orders ADD COLUMN timeline JSONB DEFAULT '[]'::jsonb;
  END IF;
END$$;

-- Add updated_at column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='updated_at') THEN
    ALTER TABLE public.orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END$$;

-- Add customer_name column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customer_name') THEN
    ALTER TABLE public.orders ADD COLUMN customer_name TEXT DEFAULT '';
  END IF;
END$$;

-- Add customer_phone column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customer_phone') THEN
    ALTER TABLE public.orders ADD COLUMN customer_phone TEXT DEFAULT '';
  END IF;
END$$;

-- Add products column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='products') THEN
    ALTER TABLE public.orders ADD COLUMN products JSONB DEFAULT '[]'::jsonb;
  END IF;
END$$;

-- Add total_amount column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='total_amount') THEN
    ALTER TABLE public.orders ADD COLUMN total_amount NUMERIC DEFAULT 0;
  END IF;
END$$;

-- Add address column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='address') THEN
    ALTER TABLE public.orders ADD COLUMN address JSONB DEFAULT '{}'::jsonb;
  END IF;
END$$;

-- Add agent_name column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='agent_name') THEN
    ALTER TABLE public.orders ADD COLUMN agent_name TEXT DEFAULT '';
  END IF;
END$$;

-- Backfill order_code for existing rows
UPDATE public.orders SET order_code = 'ORD-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0') WHERE order_code IS NULL;

-- Enable realtime (ignore errors if already enabled)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN OTHERS THEN NULL;
END$$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
EXCEPTION WHEN OTHERS THEN NULL;
END$$;
