'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useBooking } from '@/contexts/BookingContext';
import { Calendar } from '@/components/booking/Calendar';
import { Button } from '@/components/ui/Button';
import type { MonthAvailability } from '@/lib/mock/availability';
import type { AvailabilityDate } from '@/app/api/availability/route';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseISOMonth(isoDate: string): { year: number; month: number } {
  const [y, m] = isoDate.split('-').map(Number);
  return { year: y, month: m - 1 };
}

function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date    = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-CA', { weekday: 'long' });
  const month   = date.toLocaleDateString('en-CA', { month: 'long' });
  return `${weekday}, ${month} ${d} · ${y}`;
}

// Diagonal stripe pattern — matches Calendar.tsx limited cell
const STRIPE_BG =
  'repeating-linear-gradient(135deg, rgba(244,241,234,0.15) 0px, rgba(244,241,234,0.15) 1px, transparent 1px, transparent 6px)';

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

function Legend() {
  const items = [
    {
      label: 'Available — book instantly',
      style: { background: 'var(--color-clay)', borderRadius: '2px' } as React.CSSProperties,
    },
    {
      label: 'Limited — daytime only',
      style: {
        background: `${STRIPE_BG}, var(--color-ink)`,
        borderRadius: '2px',
      } as React.CSSProperties,
    },
    {
      label: 'Booked — try a nearby date',
      style: {
        background: 'rgba(26,22,19,0.12)',
        borderRadius: '2px',
      } as React.CSSProperties,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '32px',
      }}
    >
      {items.map(({ label, style }) => (
        <div
          key={label}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ width: '14px', height: '14px', flexShrink: 0, ...style }} />
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-warm-gray-soft)',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Selection confirmation bar
// ---------------------------------------------------------------------------

function ConfirmationBar({
  isoDate,
  onContinue,
}: {
  isoDate: string;
  onContinue: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-ink)',
        color: 'var(--color-bone)',
        borderRadius: '4px',
        padding: '16px 20px',
        marginTop: '16px',
        gap: '16px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            color: 'rgba(244,241,234,0.5)',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}
        >
          Selected
        </p>
        <p
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--color-bone)',
          }}
        >
          {formatDisplayDate(isoDate)}
        </p>
      </div>

      <Button variant="primary" onClick={onContinue}>
        Continue →
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const VALID_PACKAGES = ['essential', 'signature', 'full_takeover'] as const;
type ValidPackage = typeof VALID_PACKAGES[number];

export default function DatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, dispatch } = useBooking();

  // Apply ?package= URL param on first mount if context still holds the default
  useEffect(() => {
    const param = searchParams.get('package') as ValidPackage | null;
    if (param && (VALID_PACKAGES as readonly string[]).includes(param) && state.packageId === 'signature') {
      dispatch({ type: 'SET_PACKAGE_ID', payload: param });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine initial month: use pre-selected date from context (back-nav),
  // or default to today's month.
  function getInitialMonth(): { year: number; month: number } {
    if (state.eventDate) return parseISOMonth(state.eventDate);
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }

  const [displayYear,  setDisplayYear]  = useState(() => getInitialMonth().year);
  const [displayMonth, setDisplayMonth] = useState(() => getInitialMonth().month);
  const [availability, setAvailability] = useState<MonthAvailability>({});
  const [availLoading, setAvailLoading] = useState(true);
  const [availError,   setAvailError]   = useState(false);

  // Fetch real availability from /api/availability when the displayed month changes.
  // month + 1 because the API uses 1-indexed months; JS Date uses 0-indexed.
  useEffect(() => {
    let cancelled = false;
    setAvailLoading(true);
    setAvailError(false);

    fetch(`/api/availability?year=${displayYear}&month=${displayMonth + 1}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ dates: AvailabilityDate[] }>;
      })
      .then(({ dates }) => {
        if (cancelled) return;
        // Build MonthAvailability map: all dates default to 'available',
        // then overlay whatever the API returned as blocked/limited.
        const map: MonthAvailability = {};
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const iso = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          map[iso] = 'available';
        }
        for (const { date, status } of dates) {
          map[date] = status;
        }
        setAvailability(map);
        setAvailLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[DatePage] availability fetch failed:', err);
        setAvailError(true);
        setAvailLoading(false);
        // Treat all dates as available so the flow isn't blocked
        const map: MonthAvailability = {};
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const iso = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          map[iso] = 'available';
        }
        setAvailability(map);
      });

    return () => { cancelled = true; };
  }, [displayYear, displayMonth]);

  function handleMonthChange(year: number, month: number) {
    setDisplayYear(year);
    setDisplayMonth(month);
  }

  function handleDateSelect(isoDate: string) {
    dispatch({ type: 'SET_EVENT_DATE', payload: isoDate });
  }

  function handleContinue() {
    router.push('/book/package');
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] items-start"
        style={{
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(40px, 5vw, 80px) clamp(20px, 4vw, 48px)',
          gap: 'clamp(40px, 6vw, 80px)',
        }}
      >
        {/* ── Left column — context ─────────────────────────────── */}
        <div>
          {/* Step label */}
          <p
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-warm-gray)',
              marginBottom: '20px',
            }}
          >
            Step 01 / 05
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              color: 'var(--color-ink-soft)',
              marginBottom: '16px',
            }}
          >
            When&rsquo;s the big day?
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-warm-gray-soft)',
              lineHeight: 1.6,
              maxWidth: '360px',
            }}
          >
            Pick your event date. We&rsquo;ll hold it for 15 minutes while you
            finish booking. Dates in orange are available, grey is taken.
          </p>

          {/* Legend */}
          <Legend />

          {/* Callout box */}
          <div
            style={{
              marginTop: '32px',
              padding: '16px 20px',
              background: 'var(--color-clay-soft)',
              borderLeft: '2px solid var(--color-clay)',
              borderRadius: '0 4px 4px 0',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-warm-gray-soft)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: 'var(--color-ink-soft)' }}>Heads up.</strong>{' '}
              June through October books 6–8 weeks out. If your date&rsquo;s open,
              don&rsquo;t sleep on it.
            </p>
          </div>
        </div>

        {/* ── Right column — calendar ───────────────────────────── */}
        <div>
          {/* Availability error notice */}
          {availError && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                background: 'rgba(198,93,63,0.08)',
                borderLeft: '2px solid var(--color-clay)',
                borderRadius: '0 4px 4px 0',
                fontSize: '13px',
                color: 'var(--color-warm-gray-soft)',
                lineHeight: 1.5,
              }}
            >
              Live availability couldn&rsquo;t load — please{' '}
              <a
                href="/contact"
                style={{ color: 'var(--color-clay)', textDecoration: 'underline' }}
              >
                contact us
              </a>{' '}
              to confirm your date before booking.
            </div>
          )}

          {/* Loading skeleton — subtle opacity pulse on the calendar area */}
          <div style={{ position: 'relative' }}>
            {availLoading && (
              <div
                aria-label="Loading availability…"
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(10,8,6,0.35)',
                  borderRadius: '6px',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(244,241,234,0.2)',
                    borderTopColor: 'var(--color-clay)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

          <Calendar
            year={displayYear}
            month={displayMonth}
            availability={availability}
            selectedDate={state.eventDate}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
          </div>

          {/* Confirmation bar — slides in when a date is selected */}
          {state.eventDate && (
            <ConfirmationBar
              isoDate={state.eventDate}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>
    </div>
  );
}
