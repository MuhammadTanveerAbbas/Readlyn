-- =============================================================================
-- Readlyn — Complete Database Schema
-- Idempotent: run via Supabase SQL Editor at any time.
-- =============================================================================

-- ── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Trigger: auto-set updated_at ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- ── 1. Projects ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL DEFAULT 'Untitled Project',
  canvas_json     JSONB,
  canvas_width    INTEGER,
  canvas_height   INTEGER,
  thumbnail_url   TEXT,
  archetype       TEXT,
  theme           TEXT,
  tool_type       TEXT NOT NULL DEFAULT 'infographic'
                    CHECK (tool_type IN ('infographic', 'parallax')),
  is_pinned       BOOLEAN NOT NULL DEFAULT false,
  is_trashed      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent migration columns (for existing deployments)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS canvas_width    INTEGER;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS canvas_height   INTEGER;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tool_type       TEXT NOT NULL DEFAULT 'infographic';

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ── 2. Generation History ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.generation_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  canvas_json     JSONB NOT NULL,
  prompt          TEXT,
  archetype       TEXT,
  theme           TEXT,
  model           TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile',
  thumbnail_url   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generation_history ADD COLUMN IF NOT EXISTS model         TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile';
ALTER TABLE public.generation_history ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.generation_history ADD COLUMN IF NOT EXISTS created_at    TIMESTAMPTZ NOT NULL DEFAULT now();

-- ── 3. Templates ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  archetype       TEXT,
  theme           TEXT,
  tool_type       TEXT NOT NULL DEFAULT 'infographic'
                    CHECK (tool_type IN ('infographic', 'parallax')),
  thumbnail_url   TEXT,
  canvas_json     JSONB,
  is_public       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS tool_type  TEXT NOT NULL DEFAULT 'infographic';

-- ── 4. Subscriptions (Stripe billing) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT,
  stripe_customer_id      TEXT,
  status                  TEXT NOT NULL DEFAULT 'incomplete',
  plan_id                 TEXT NOT NULL DEFAULT 'free',
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ── 5. Invoices (billing history) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invoices (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id       TEXT UNIQUE,
  stripe_subscription_id  TEXT,
  amount_paid             BIGINT,
  currency                TEXT DEFAULT 'usd',
  status                  TEXT NOT NULL,
  attempt_count           INT DEFAULT 1,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT UNIQUE;

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_projects_user_updated
  ON public.projects(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_user_trashed
  ON public.projects(user_id, is_trashed)
  WHERE is_trashed = false;

CREATE INDEX IF NOT EXISTS idx_generation_history_project_created
  ON public.generation_history(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generation_history_user
  ON public.generation_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_templates_public
  ON public.templates(is_public, created_at DESC)
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_templates_user
  ON public.templates(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON public.subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON public.subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON public.subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON public.subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id
  ON public.invoices(user_id);

CREATE INDEX IF NOT EXISTS idx_invoices_stripe_subscription
  ON public.invoices(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_invoices_created_at
  ON public.invoices(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- ── Projects ─────────────────────────────────────────────────────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own projects" ON public.projects;
CREATE POLICY "Users own projects"
  ON public.projects
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Generation History ───────────────────────────────────────────────────
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own history" ON public.generation_history;
CREATE POLICY "Users own history"
  ON public.generation_history
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Templates ────────────────────────────────────────────────────────────
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone read public templates" ON public.templates;
CREATE POLICY "Anyone read public templates"
  ON public.templates
  FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users manage own templates" ON public.templates;
CREATE POLICY "Users manage own templates"
  ON public.templates
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Subscriptions ────────────────────────────────────────────────────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own subscription" ON public.subscriptions;
CREATE POLICY "Users read own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admin upsert (service_role) bypasses RLS — no policy needed for insert/update.

-- ── Invoices ─────────────────────────────────────────────────────────────
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own invoices" ON public.invoices;
CREATE POLICY "Users read own invoices"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Webhook inserts use service_role — bypasses RLS.

-- =============================================================================
-- STORAGE (parallax-images bucket)
-- =============================================================================
-- Create the bucket (run once via Supabase Dashboard OR uncomment below).
-- Supabase storage buckets can also be created via SQL in newer versions:
--
--   INSERT INTO storage.buckets (id, name, public, avif_autodetection)
--   VALUES ('parallax-images', 'parallax-images', true, false)
--   ON CONFLICT (id) DO NOTHING;

-- Storage RLS: only authenticated users can manage their own files.
DROP POLICY IF EXISTS "Users upload own parallax images" ON storage.objects;
CREATE POLICY "Users upload own parallax images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'parallax-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users read own parallax images" ON storage.objects;
CREATE POLICY "Users read own parallax images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'parallax-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own parallax images" ON storage.objects;
CREATE POLICY "Users delete own parallax images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'parallax-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read for rendered images (needed for preview)
DROP POLICY IF EXISTS "Public read parallax images" ON storage.objects;
CREATE POLICY "Public read parallax images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'parallax-images');

-- =============================================================================
-- SUMMARY: Tables created
--   public.projects            — User projects (infographics + parallax)
--   public.generation_history  — AI generation snapshots per project
--   public.templates           — Public & user-created templates
--   public.subscriptions       — Stripe subscription sync
--   public.invoices            — Stripe invoice payment records
--   storage.objects (RLS)      — parallax-images bucket policies
-- =============================================================================
