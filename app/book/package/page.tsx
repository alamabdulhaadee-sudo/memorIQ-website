'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useBooking } from '@/contexts/BookingContext';
import { PackageCard } from '@/components/ui/PackageCard';
import { Button } from '@/components/ui/Button';
import { PACKAGES } from '@/lib/data/packages';
import type { PackageId } from '@/types/booking';

export default function PackagePage() {
  const router = useRouter();
  const { state, dispatch } = useBooking();

  useEffect(() => {
    if (!state.eventDate) {
      router.replace('/book/date');
    }
  }, [state.eventDate, router]);

  function handleSelect(id: PackageId) {
    dispatch({ type: 'SET_PACKAGE_ID', payload: id });
  }

  function handleBack() {
    router.push('/book/date');
  }

  function handleContinue() {
    router.push('/book/details');
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
            Step 02 / 05
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
            Which package fits the night?
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
            Most events book Signature. Start there unless you&rsquo;ve got a
            specific reason to go smaller or bigger.
          </p>
        </div>

        {/* ── Right column — package cards ──────────────────────── */}
        <div role="radiogroup" aria-label="Select a package">
          {/* Cards — stacked vertically in the 60% column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PACKAGES.map((pkg) => (
              <PackageCard
                key={pkg.id}
                mode="booking"
                pkg={pkg}
                selected={state.packageId === pkg.id}
                onSelect={() => handleSelect(pkg.id)}
              />
            ))}
          </div>

          {/* "Not sure?" link */}
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              fontSize: '13px',
              color: 'var(--color-warm-gray)',
              textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                'var(--color-ink-soft)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                'var(--color-warm-gray)')
            }
          >
            Not sure? Contact us for a quick consult →
          </a>

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
            }}
          >
            <Button variant="secondary" surface="light" onClick={handleBack}>
              ← Back
            </Button>
            {/* Always enabled — Signature is pre-selected by default */}
            <Button variant="primary" onClick={handleContinue}>
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
