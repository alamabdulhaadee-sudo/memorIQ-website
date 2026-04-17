// ============================================================
// Step 04 — Customize: static data for templates, backdrops,
// and add-ons. Prices in cents to match Supabase schema.
// ============================================================

import type { AddOn } from '@/types/booking';

// ── Package base prices (cents) ───────────────────────────────
// Mirror of supabase/schema.sql seed data.

export const PACKAGE_PRICES: Record<string, number> = {
  essential:     40000,  // $400
  signature:     55000,  // $550
  full_takeover: 70000,  // $700
};

export const PACKAGE_LABELS: Record<string, string> = {
  essential:     'Essential',
  signature:     'Signature',
  full_takeover: 'Full Takeover',
};


// ── Templates ─────────────────────────────────────────────────

export interface Template {
  id: string;
  label: string;
  /** Placeholder background color (CSS variable-safe value) */
  color: string;
}

export const TEMPLATES: Template[] = [
  { id: 'elegant',    label: 'Elegant',    color: '#2C2825' },
  { id: 'playful',    label: 'Playful',    color: '#C65D3F' },
  { id: 'corporate',  label: 'Corporate',  color: '#3A4A5C' },
  { id: 'minimal',    label: 'Minimal',    color: '#D6D0C4' },
];

export const DEFAULT_TEMPLATE = 'elegant';


// ── Backdrops ─────────────────────────────────────────────────

export interface Backdrop {
  id: string;
  label: string;
  /** Placeholder swatch color */
  color: string;
  isPremium: boolean;
}

export const BACKDROPS: Backdrop[] = [
  { id: 'classic_white',   label: 'Classic White',   color: '#F4F1EA', isPremium: false },
  { id: 'soft_black',      label: 'Soft Black',      color: '#1A1613', isPremium: false },
  { id: 'warm_linen',      label: 'Warm Linen',      color: '#D6C9B0', isPremium: false },
  { id: 'slate_grey',      label: 'Slate Grey',      color: '#7A7A82', isPremium: false },
  { id: 'terracotta_arch', label: 'Terracotta Arch', color: '#B5533C', isPremium: true  },
  { id: 'botanical',       label: 'Botanical',       color: '#3D5A3E', isPremium: true  },
];

export const DEFAULT_BACKDROP = 'classic_white';

/** The add-on id auto-added when a premium backdrop is selected */
export const PREMIUM_BACKDROP_ADDON_ID = 'custom_backdrop';

/** Price of the premium backdrop add-on in cents (matches schema seed) */
export const PREMIUM_BACKDROP_PRICE = 7500;


// ── Add-ons ───────────────────────────────────────────────────
// Exact data from supabase/schema.sql seed. IDs must match.

export const ADD_ONS: AddOn[] = [
  {
    id:          'extra_hour',
    name:        'Extra hour',
    price:       10000,
    description: 'Extend your booking in one-hour increments.',
    included_in: null,
    sort_order:  1,
  },
  {
    id:          'custom_backdrop',
    name:        'Custom backdrop',
    price:       7500,
    description: 'We source or build a backdrop matched to your color story.',
    included_in: null,
    sort_order:  2,
  },
  {
    id:          'second_attendant',
    name:        'Second attendant',
    price:       8000,
    description: 'For larger events (200+ guests) where the line needs managing.',
    included_in: null,
    sort_order:  3,
  },
  {
    id:          'qr_code_sharing',
    name:        'QR code sharing',
    price:       0,
    description: 'Every guest can text or scan to get their digital copy instantly.',
    included_in: ['essential', 'signature', 'full_takeover'],
    sort_order:  4,
  },
  {
    id:          'branded_overlay',
    name:        'Branded overlay',
    price:       5000,
    description: 'Logo, tagline, or color-matched frame for corporate activations.',
    included_in: null,
    sort_order:  5,
  },
  {
    id:          'guest_book',
    name:        'Guest book with prints',
    price:       0,
    description: 'Printed copies placed in a high-quality keepsake book on-site.',
    included_in: ['full_takeover'],
    sort_order:  6,
  },
  {
    id:          'video_boomerang',
    name:        'Video / boomerang mode',
    price:       0,
    description: 'GIF and boomerang loops delivered to digital gallery.',
    included_in: ['signature', 'full_takeover'],
    sort_order:  7,
  },
  {
    id:          'travel_fee',
    name:        'Travel (outside 30km)',
    price:       0,
    description: 'We serve the full GTA. Travel fee confirmed before booking.',
    included_in: null,
    sort_order:  8,
  },
];
