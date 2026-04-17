'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/Button';
import type { BookingState } from '@/types/booking';


// ── Helpers ───────────────────────────────────────────────────

function formatEventDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  }).formatToParts(date);

  const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';
  const month   = parts.find(p => p.type === 'month')?.value   ?? '';
  const day     = parts.find(p => p.type === 'day')?.value     ?? '';
  const year    = parts.find(p => p.type === 'year')?.value    ?? '';

  return `${weekday}, ${month} ${day} · ${year}`;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// Format a Date as YYYYMMDD for iCalendar
function toICSDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

interface ICSParams {
  eventDate:    Date;
  eventType:    string | null;
  venueAddress: string;
  venueName:    string;
  packageLabel: string;
}

function generateICS(p: ICSParams): string {
  const dtStart  = toICSDate(p.eventDate);
  const dtEnd    = toICSDate(addDays(p.eventDate, 1));
  const uid      = `${Date.now()}@memoriq.ca`;
  const summary  = `MEMORIQ Photo Booth — ${p.eventType ?? 'Event'}`;
  const location = [p.venueName, p.venueAddress].filter(Boolean).join(', ');
  const description = `Package: ${p.packageLabel}\\nVenue: ${location}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MEMORIQ//Photo Booth//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICS(icsString: string): void {
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'memoriq-booking.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildMailtoHref(opts: {
  formattedDate:    string;
  packageLabel:     string;
  venueDisplay:     string;
  formattedBalance: string;
  balanceDueDate:   string;
}): string {
  const subject = 'MEMORIQ Photo Booth — Booking Summary';
  const body = [
    'Here are my MEMORIQ Photo Booth booking details:',
    '',
    `Date:     ${opts.formattedDate}`,
    `Package:  ${opts.packageLabel}`,
    `Venue:    ${opts.venueDisplay}`,
    `Paid:     $100 deposit`,
    `Balance:  ${opts.formattedBalance} due ${opts.balanceDueDate}`,
    '',
    'Booked via memoriq.ca',
  ].join('\n');

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const PACKAGE_LABELS: Record<string, string> = {
  'essential':     'Essential (2 hours)',
  'signature':     'Signature (3 hours)',
  'full_takeover': 'Full Takeover (5 hours)',
};


// ── Page ──────────────────────────────────────────────────────

export default function ConfirmedPage() {
  const router    = useRouter();
  const { state } = useBooking();

  // After a Stripe redirect the context is fresh — restore from sessionStorage.
  // null  = still checking  |  false = not found (need redirect)  |  BookingState = restored
  const [restored, setRestored] = useState<BookingState | null | false>(null);

  useEffect(() => {
    // Context already has data (in-flow navigation, no redirect)
    if (state.eventDate) {
      // Clear sessionStorage — booking is complete
      try { sessionStorage.removeItem('memoriq-booking'); } catch { /* unavailable */ }
      setRestored(state);
      return;
    }

    // Try sessionStorage (written by pay page before Stripe redirect)
    try {
      const raw = sessionStorage.getItem('memoriq-booking');
      if (raw) {
        const parsed = JSON.parse(raw) as BookingState;
        if (parsed.eventDate) {
          sessionStorage.removeItem('memoriq-booking');
          setRestored(parsed);
          return;
        }
      }
    } catch {
      // sessionStorage unavailable or corrupt
    }

    // Nothing — user navigated here directly
    setRestored(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally runs once

  useEffect(() => {
    if (restored === false) {
      router.replace('/book/date');
    }
  }, [restored, router]);

  // Use restored state if context is empty (post-Stripe-redirect case)
  const effectiveState = (state.eventDate ? state : (restored || null)) as BookingState | null;
  const eventDate = effectiveState?.eventDate ?? null;

  // Derived values — computed once, stable references
  const derived = useMemo(() => {
    if (!eventDate || !effectiveState) return null;
    const state = effectiveState;

    const date           = new Date(eventDate);
    const formattedDate  = formatEventDate(date);
    const balanceDue     = addDays(date, -14);
    const balanceDueDate = formatEventDate(balanceDue);
    const packageLabel   = (state.packageId ? PACKAGE_LABELS[state.packageId] : null) ?? state.packageId ?? '';
    // subtotal is in cents; deposit is 10000 cents ($100)
    const balanceCents   = Math.max(0, state.subtotal - state.depositAmount);
    const formattedBalance = `$${Math.round(balanceCents / 100)}`;
    const venueDisplay   = [state.venueName, state.venueAddress]
      .filter(Boolean)
      .join(', ');

    const mailtoHref = buildMailtoHref({
      formattedDate,
      packageLabel,
      venueDisplay,
      formattedBalance,
      balanceDueDate,
    });

    const icsParams: ICSParams = {
      eventDate:    date,
      eventType:    state.eventType,
      venueAddress: state.venueAddress,
      venueName:    state.venueName,
      packageLabel,
    };

    return {
      formattedDate,
      balanceDueDate,
      packageLabel,
      formattedBalance,
      venueDisplay,
      mailtoHref,
      icsParams,
    };
  }, [eventDate, effectiveState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render nothing while checking sessionStorage or while redirect is in flight
  if (restored === null || restored === false || !eventDate || !derived) return null;

  const SUMMARY_ROWS = [
    { label: 'Date',    value: derived.formattedDate  },
    { label: 'Package', value: derived.packageLabel   },
    { label: 'Venue',   value: derived.venueDisplay   },
    { label: 'Paid',    value: '$100 deposit'          },
    {
      label: 'Balance',
      value: `${derived.formattedBalance} due ${derived.balanceDueDate}`,
    },
  ] as const;

  const NEXT_STEPS = [
    'Confirmation email within 5 minutes',
    'Pre-event call 2 weeks before',
    'Our team arrives 1 hour before start time',
  ] as const;

  return (
    <main className="min-h-screen bg-bone flex flex-col items-center px-md py-[96px] sm:py-[120px]">
      <div className="w-full max-w-[640px] flex flex-col gap-[56px]">

        {/* ── 1. Hero text ─────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <h1
            className="font-medium tracking-[-0.035em] leading-[0.98] text-ink-soft"
            style={{ fontSize: 'clamp(44px, 7vw, 72px)' }}
          >
            You&rsquo;re all set.
          </h1>
          <p className="mt-[16px] text-[15px] leading-[1.55] text-warm-gray-soft max-w-[480px]">
            Confirmation&rsquo;s headed to your inbox. We&rsquo;ll reach out 2 weeks before
            to lock in the final details.
          </p>
        </div>

        {/* ── 2. Booking summary card ──────────────────────────── */}
        <div
          className="bg-white rounded-[6px] px-[32px] py-[8px] sm:px-[40px]"
          style={{ border: '0.5px solid var(--color-border-light)' }}
        >
          <dl>
            {SUMMARY_ROWS.map(({ label, value }, i) => (
              <div
                key={label}
                className="flex justify-between items-baseline gap-[16px] py-[14px]"
                style={
                  i < SUMMARY_ROWS.length - 1
                    ? { borderBottom: '0.5px solid var(--color-border-light-soft)' }
                    : undefined
                }
              >
                <dt className="text-[13px] font-medium tracking-[0.01em] text-warm-gray flex-shrink-0">
                  {label}
                </dt>
                <dd className="text-[15px] font-medium text-ink-soft text-right">
                  {value || (
                    <span className="text-warm-gray italic font-normal">Not provided</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── 3. What happens next ─────────────────────────────── */}
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray mb-[28px]">
            What happens next
          </p>
          <ol>
            {NEXT_STEPS.map((text, i) => (
              <li key={i} className="flex items-start gap-[20px] pb-[24px] last:pb-0">
                <span
                  className="font-medium tracking-[-0.035em] leading-[1] text-clay flex-shrink-0 w-[48px]"
                  style={{ fontSize: 'clamp(36px, 5vw, 54px)' }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] text-ink-soft leading-[1.55] pt-[8px]">
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── 4. Action buttons ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-[12px] justify-center items-center">
          <Button
            variant="primary"
            surface="light"
            onClick={() => downloadICS(generateICS(derived.icsParams))}
          >
            Add to calendar
          </Button>
          <Button
            variant="secondary"
            surface="light"
            href={derived.mailtoHref}
          >
            Share with your planner
          </Button>
        </div>

        {/* ── 5. Instagram link ────────────────────────────────── */}
        <p className="text-center text-[13px] text-warm-gray leading-[1.6]">
          Follow us for event inspiration{' '}
          <a
            href="https://instagram.com/memoriq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft underline underline-offset-2 hover:text-clay transition-colors duration-150"
          >
            @memoriq
          </a>
        </p>

      </div>
    </main>
  );
}
