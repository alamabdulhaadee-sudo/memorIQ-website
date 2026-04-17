// ============================================================
// Order summary helpers for Step 05 — Pay
// Used by PayPageClient to build line items and format dates.
// ============================================================

import type { BookingState } from '@/types/booking';
import {
  ADD_ONS,
  PACKAGE_PRICES,
  PACKAGE_LABELS,
} from '@/lib/data/customize';

export interface OrderLine {
  label: string;
  /** Price in cents, or the string 'included' for $0 add-ons */
  price: number | 'included';
}

/**
 * Build the ordered list of line items for the order summary card.
 * First line is always the package. Subsequent lines are selected add-ons.
 */
export function buildOrderLines(state: BookingState): OrderLine[] {
  const lines: OrderLine[] = [];

  if (!state.packageId) return lines;

  // Package line
  const packageHours: Record<string, number> = {
    essential: 2,
    signature: 3,
    full_takeover: 4,
  };
  const hours = packageHours[state.packageId] ?? 0;
  lines.push({
    label: `${PACKAGE_LABELS[state.packageId]} (${hours} hours)`,
    price: PACKAGE_PRICES[state.packageId] ?? 0,
  });

  // Add-on lines
  for (const addonId of state.selectedAddOns) {
    const addon = ADD_ONS.find((a) => a.id === addonId);
    if (!addon) continue;

    const includedInPackage =
      addon.included_in !== null &&
      state.packageId !== null &&
      addon.included_in.includes(state.packageId);

    lines.push({
      label: addon.name,
      price: includedInPackage || addon.price === 0 ? 'included' : addon.price,
    });
  }

  return lines;
}

/**
 * Format a price in cents as a dollar string, e.g. 55000 → "$550.00".
 * Strips trailing .00 for whole-dollar amounts to keep the UI clean.
 */
export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars.toFixed(0)}`
    : `$${dollars.toFixed(2)}`;
}

/**
 * Return the balance-due date: 14 days before the event date.
 * Input: ISO date string ("2026-06-19")
 * Output: formatted string ("May 20, 2026")
 */
export function formatBalanceDueDate(eventDate: string): string {
  const date = new Date(`${eventDate}T00:00:00`);
  date.setDate(date.getDate() - 14);
  return date.toLocaleDateString('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
