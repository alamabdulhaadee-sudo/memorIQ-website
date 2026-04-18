'use client';

import { useState, useEffect, useRef } from 'react';
import { useBooking } from '@/contexts/BookingContext';

const HOLD_KEY      = 'memoriq-hold-start';
const HOLD_DURATION = 15 * 60 * 1000; // 15 minutes in ms

function formatCountdown(ms: number): string {
  const total   = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface HoldTimerProps {
  /** The currently-selected ISO date (YYYY-MM-DD). */
  isoDate: string;
}

/**
 * Counts down 15 minutes from when the user first selected their date.
 * Hold start timestamp persists in sessionStorage so refresh doesn't reset it.
 * When the hold expires the selected date is cleared in BookingContext.
 */
export function HoldTimer({ isoDate }: HoldTimerProps) {
  const { dispatch } = useBooking();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [expired, setExpired]     = useState(false);

  // Track the date for which we started the hold so we can reset on change
  const activeDateRef = useRef<string | null>(null);

  useEffect(() => {
    // If the selected date changed, start a fresh hold
    if (activeDateRef.current !== isoDate) {
      activeDateRef.current = isoDate;
      const now = Date.now();
      try {
        sessionStorage.setItem(HOLD_KEY, String(now));
      } catch { /* unavailable */ }
      setExpired(false);
      setRemaining(HOLD_DURATION);
    }

    // Compute remaining from sessionStorage on every mount / date-change
    function getRemainingMs(): number {
      try {
        const raw = sessionStorage.getItem(HOLD_KEY);
        if (!raw) return HOLD_DURATION;
        const elapsed = Date.now() - Number(raw);
        return Math.max(0, HOLD_DURATION - elapsed);
      } catch {
        return HOLD_DURATION;
      }
    }

    const rem = getRemainingMs();
    if (rem === 0) {
      setExpired(true);
      setRemaining(0);
      return;
    }

    setRemaining(rem);
    setExpired(false);

    const id = setInterval(() => {
      const r = getRemainingMs();
      setRemaining(r);
      if (r === 0) {
        clearInterval(id);
        setExpired(true);
        // Clear the hold key and deselect the date
        try { sessionStorage.removeItem(HOLD_KEY); } catch { /* unavailable */ }
        dispatch({ type: 'SET_EVENT_DATE', payload: null });
      }
    }, 1000);

    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isoDate]);

  if (expired) {
    return (
      <p
        style={{
          fontSize: '12px',
          color: 'var(--color-clay)',
          lineHeight: 1.4,
        }}
      >
        Your hold has expired. Select a date to start a new hold.
      </p>
    );
  }

  if (remaining === null) return null;

  return (
    <p
      style={{
        fontSize: '12px',
        color: 'rgba(244,241,234,0.55)',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      Your date is held for{' '}
      <span style={{ color: 'var(--color-bone)', fontVariantNumeric: 'tabular-nums' }}>
        {formatCountdown(remaining)}
      </span>{' '}
      more
    </p>
  );
}

/**
 * Small inline indicator for use outside the confirmation bar (e.g. step header).
 * Returns null if no hold is currently active.
 */
export function HoldTimerMini() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    function getRemainingMs(): number | null {
      try {
        const raw = sessionStorage.getItem(HOLD_KEY);
        if (!raw) return null;
        const r = HOLD_DURATION - (Date.now() - Number(raw));
        return r > 0 ? r : null;
      } catch {
        return null;
      }
    }

    const initial = getRemainingMs();
    setRemaining(initial);
    if (initial === null) return;

    const id = setInterval(() => {
      const r = getRemainingMs();
      setRemaining(r);
      if (r === null) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  return (
    <span
      style={{
        fontSize: '11px',
        color: 'var(--color-warm-gray)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      Hold: {formatCountdown(remaining)}
    </span>
  );
}
