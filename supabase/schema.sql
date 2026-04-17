-- ============================================================
-- MEMORIQ Photo Booth — Supabase schema
-- Run this in the Supabase SQL editor or via the CLI:
--   supabase db reset  (if using local dev)
--   paste into Dashboard > SQL editor  (if using cloud)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── Tables ───────────────────────────────────────────────────

-- packages: seeded at deploy time, not editable by customers
CREATE TABLE IF NOT EXISTS packages (
  id          text        PRIMARY KEY,                        -- 'essential' | 'signature' | 'full_takeover'
  name        text        NOT NULL,
  price       integer     NOT NULL,                           -- cents, e.g. 55000 = $550
  hours       integer,
  features    jsonb,                                          -- string[]
  sort_order  integer
);

-- add_ons: seeded at deploy time
CREATE TABLE IF NOT EXISTS add_ons (
  id           text    PRIMARY KEY,
  name         text    NOT NULL,
  price        integer NOT NULL,                              -- cents; 0 = included / TBD
  description  text,
  included_in  text[],                                        -- package ids where this is free
  sort_order   integer
);

-- blocked_dates: managed by admin
CREATE TABLE IF NOT EXISTS blocked_dates (
  id      uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  date    date  NOT NULL UNIQUE,
  status  text  NOT NULL CHECK (status IN ('booked', 'limited')),
  reason  text
);

-- bookings: created by anon users during the booking flow
CREATE TABLE IF NOT EXISTS bookings (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  status                   text        NOT NULL DEFAULT 'pending'
                                       CHECK (status IN ('pending', 'confirmed', 'cancelled')),

  -- Event
  event_date               date        NOT NULL,
  package_id               text        NOT NULL
                                       REFERENCES packages (id),

  -- Customer
  customer_name            text        NOT NULL,
  customer_email           text        NOT NULL,
  customer_phone           text,

  -- Event details
  event_type               text        CHECK (event_type IN ('wedding', 'corporate', 'birthday', 'other')),
  venue_name               text,
  venue_address            text,
  guest_count              integer,
  notes                    text,

  -- Customisation
  template_choice          text,
  backdrop_choice          text,
  add_ons                  jsonb       NOT NULL DEFAULT '[]',  -- array of add_on ids

  -- Financials (all in cents)
  subtotal                 integer,
  deposit_amount           integer     NOT NULL DEFAULT 10000, -- always $100
  deposit_paid             boolean     NOT NULL DEFAULT false,
  stripe_payment_intent_id text
);


-- ── updated_at auto-trigger ───────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_set_updated_at ON bookings;
CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- bookings: anon can insert; authenticated (admin) can select + update
CREATE POLICY "anon can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated can read bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- packages, add_ons, blocked_dates: public read-only
CREATE POLICY "public can read packages"
  ON packages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public can read add_ons"
  ON add_ons FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public can read blocked_dates"
  ON blocked_dates FOR SELECT
  TO anon, authenticated
  USING (true);


-- ── Seed: packages ────────────────────────────────────────────

INSERT INTO packages (id, name, price, hours, features, sort_order) VALUES
  (
    'essential',
    'Essential',
    40000,
    2,
    '["DSLR booth + studio lighting","Standard backdrop","Unlimited prints + digital","Dedicated attendant","Setup + teardown"]',
    1
  ),
  (
    'signature',
    'Signature',
    55000,
    3,
    '["Everything in Essential","Custom template design","Premium backdrop library","Digital gallery post-event","GIF + boomerang mode"]',
    2
  ),
  (
    'full_takeover',
    'Full Takeover',
    70000,
    4,
    '["Everything in Signature","Premium prop collection","Guest book with prints","Priority weekend slots","Second photographer option"]',
    3
  )
ON CONFLICT (id) DO NOTHING;


-- ── Seed: add_ons ─────────────────────────────────────────────
-- Names match exactly what is shown in app/services/page.tsx ADD_ONS array.

INSERT INTO add_ons (id, name, price, description, included_in, sort_order) VALUES
  (
    'extra_hour',
    'Extra hour',
    10000,
    'Extend your booking in one-hour increments.',
    NULL,
    1
  ),
  (
    'custom_backdrop',
    'Custom backdrop',
    7500,
    'We source or build a backdrop matched to your color story.',
    NULL,
    2
  ),
  (
    'second_attendant',
    'Second attendant',
    8000,
    'For larger events (200+ guests) where the line needs managing.',
    NULL,
    3
  ),
  (
    'qr_code_sharing',
    'QR code sharing',
    0,
    'Every guest can text or scan to get their digital copy instantly.',
    ARRAY['essential', 'signature', 'full_takeover'],
    4
  ),
  (
    'branded_overlay',
    'Branded overlay',
    5000,
    'Logo, tagline, or color-matched frame for corporate activations.',
    NULL,
    5
  ),
  (
    'guest_book',
    'Guest book with prints',
    0,
    'Printed copies placed in a high-quality keepsake book on-site.',
    ARRAY['full_takeover'],
    6
  ),
  (
    'video_boomerang',
    'Video/boomerang mode',
    0,
    'GIF and boomerang loops delivered to digital gallery.',
    ARRAY['signature', 'full_takeover'],
    7
  ),
  (
    'travel_fee',
    'Travel (outside 30km)',
    0,
    'We serve the full GTA. Travel fee confirmed before booking.',
    NULL,
    8
  )
ON CONFLICT (id) DO NOTHING;


-- ── Seed: blocked_dates ───────────────────────────────────────
-- Seeded with dates in April–May 2026 for local dev.
-- Clear and re-seed as needed; production dates are managed via the admin UI.

INSERT INTO blocked_dates (date, status, reason) VALUES
  ('2026-04-19', 'booked',   'Wedding — Pearle Hotel, Burlington'),
  ('2026-04-25', 'limited',  'Corporate — afternoon only'),
  ('2026-04-26', 'booked',   'Birthday — Mississauga'),
  ('2026-05-02', 'booked',   'Wedding — Casa Loma'),
  ('2026-05-09', 'limited',  'Corporate — morning only'),
  ('2026-05-17', 'booked',   'Wedding — Hacienda Sarria')
ON CONFLICT (date) DO NOTHING;
