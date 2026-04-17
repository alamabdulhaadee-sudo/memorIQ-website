// ============================================================
// MEMORIQ booking flow — shared type definitions
// Used by: BookingContext, all /book/* step pages, API routes
// ============================================================

// ── Primitive union types ─────────────────────────────────────

export type PackageId = 'essential' | 'signature' | 'full_takeover';

export type EventType = 'wedding' | 'corporate' | 'birthday' | 'other';

/** Status of a calendar date as returned from the availability API */
export type DateStatus = 'available' | 'limited' | 'booked';


// ── Booking state (held in context across all 5 steps) ────────

export interface BookingState {
  // Step 01 — Date
  eventDate: string | null;           // ISO date string, e.g. "2026-06-14"

  // Step 02 — Package
  packageId: PackageId | null;

  // Step 03 — Customer details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: EventType | null;
  venueName: string;
  venueAddress: string;
  guestCount: number | null;
  notes: string;

  // Step 04 — Customise
  templateChoice: string | null;
  backdropChoice: string | null;
  selectedAddOns: string[];           // array of add_on ids

  // Financials (cents)
  subtotal: number;
  depositAmount: number;              // always 10000 ($100 fixed deposit)
}


// ── Actions (discriminated union) ─────────────────────────────
// One action type per BookingState field, plus RESET.

export type BookingAction =
  | { type: 'SET_EVENT_DATE';     payload: string | null }
  | { type: 'SET_PACKAGE_ID';     payload: PackageId | null }
  | { type: 'SET_CUSTOMER_NAME';  payload: string }
  | { type: 'SET_CUSTOMER_EMAIL'; payload: string }
  | { type: 'SET_CUSTOMER_PHONE'; payload: string }
  | { type: 'SET_EVENT_TYPE';     payload: EventType | null }
  | { type: 'SET_VENUE_NAME';     payload: string }
  | { type: 'SET_VENUE_ADDRESS';  payload: string }
  | { type: 'SET_GUEST_COUNT';    payload: number | null }
  | { type: 'SET_NOTES';          payload: string }
  | { type: 'SET_TEMPLATE_CHOICE';  payload: string | null }
  | { type: 'SET_BACKDROP_CHOICE';  payload: string | null }
  | { type: 'SET_SELECTED_ADD_ONS'; payload: string[] }
  | { type: 'SET_SUBTOTAL';       payload: number }
  | { type: 'RESET' };


// ── Package record (matches the `packages` Supabase table) ────

export interface Package {
  id: PackageId;
  name: string;
  price: number;    // cents
  hours: number;
  features: string[];
  sort_order: number;
}


// ── Add-on record (matches the `add_ons` Supabase table) ──────

export interface AddOn {
  id: string;
  name: string;
  price: number;    // cents; 0 = included or TBD
  description: string;
  included_in: string[] | null;
  sort_order: number;
}


// ── Blocked date record (matches `blocked_dates` table) ───────

export interface BlockedDate {
  id: string;
  date: string;     // ISO date string
  status: 'booked' | 'limited';
  reason: string | null;
}
