// ============================================================
// Mock availability data for the booking calendar.
// Mirrors the shape that the Supabase `blocked_dates` table will return,
// so the swap to a real API call is a one-line change.
// ============================================================

import type { DateStatus } from '@/types/booking';

/** Availability map for a single month: ISO date string → DateStatus */
export type MonthAvailability = Record<string, DateStatus>;

// ---------------------------------------------------------------------------
// Hardcoded blocked dates (seed data pattern from supabase/schema.sql)
// All dates NOT listed here are treated as 'available'.
// ---------------------------------------------------------------------------

interface RawBlockedDate {
  date: string; // ISO date string "YYYY-MM-DD"
  status: 'booked' | 'limited';
}

const BLOCKED_DATES: RawBlockedDate[] = [
  // June 2026
  { date: '2026-06-06', status: 'booked'  },
  { date: '2026-06-07', status: 'booked'  },
  { date: '2026-06-13', status: 'booked'  },
  { date: '2026-06-14', status: 'limited' },
  { date: '2026-06-20', status: 'booked'  },
  { date: '2026-06-21', status: 'booked'  },
  { date: '2026-06-27', status: 'limited' },
  { date: '2026-06-28', status: 'booked'  },

  // July 2026
  { date: '2026-07-04', status: 'booked'  },
  { date: '2026-07-05', status: 'booked'  },
  { date: '2026-07-11', status: 'limited' },
  { date: '2026-07-12', status: 'booked'  },
  { date: '2026-07-18', status: 'booked'  },
  { date: '2026-07-19', status: 'booked'  },
  { date: '2026-07-25', status: 'booked'  },
  { date: '2026-07-26', status: 'limited' },

  // August 2026
  { date: '2026-08-01', status: 'booked'  },
  { date: '2026-08-02', status: 'limited' },
  { date: '2026-08-08', status: 'booked'  },
  { date: '2026-08-09', status: 'booked'  },
  { date: '2026-08-15', status: 'limited' },
  { date: '2026-08-16', status: 'booked'  },
  { date: '2026-08-22', status: 'booked'  },
  { date: '2026-08-23', status: 'booked'  },
  { date: '2026-08-29', status: 'booked'  },
  { date: '2026-08-30', status: 'limited' },

  // September 2026
  { date: '2026-09-05', status: 'booked'  },
  { date: '2026-09-06', status: 'booked'  },
  { date: '2026-09-12', status: 'limited' },
  { date: '2026-09-13', status: 'booked'  },
  { date: '2026-09-19', status: 'booked'  },
  { date: '2026-09-20', status: 'booked'  },
  { date: '2026-09-26', status: 'limited' },
  { date: '2026-09-27', status: 'booked'  },

  // October 2026
  { date: '2026-10-03', status: 'booked'  },
  { date: '2026-10-04', status: 'booked'  },
  { date: '2026-10-10', status: 'booked'  },
  { date: '2026-10-11', status: 'limited' },
  { date: '2026-10-17', status: 'booked'  },
  { date: '2026-10-18', status: 'booked'  },
  { date: '2026-10-24', status: 'limited' },
  { date: '2026-10-25', status: 'booked'  },
  { date: '2026-10-31', status: 'booked'  },
];

// Build a lookup map once at module load time
const BLOCKED_LOOKUP = new Map<string, DateStatus>(
  BLOCKED_DATES.map(({ date, status }) => [date, status]),
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the availability map for every day in the given month.
 * - month is 0-indexed (0 = January, 11 = December) to match JS Date.
 * - Past dates are intentionally omitted; the Calendar component handles them
 *   by comparing against today.
 * - Designed to be async-ready: wrapping this in a Promise is trivial when
 *   swapping to a real Supabase call.
 */
export function getMonthAvailability(
  year: number,
  month: number,
): MonthAvailability {
  const result: MonthAvailability = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const iso = `${year}-${mm}-${dd}`;

    const blocked = BLOCKED_LOOKUP.get(iso);
    result[iso] = blocked ?? 'available';
  }

  return result;
}
