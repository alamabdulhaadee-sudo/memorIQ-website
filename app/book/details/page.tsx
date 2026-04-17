'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useBooking } from '@/contexts/BookingContext';
import { DetailsForm } from '@/components/booking/DetailsForm';
import { Button } from '@/components/ui/Button';

export default function DetailsPage() {
  const router = useRouter();
  const { state } = useBooking();

  useEffect(() => {
    if (!state.eventDate) {
      router.replace('/book/date');
    } else if (!state.packageId) {
      router.replace('/book/package');
    }
  }, [state.eventDate, state.packageId, router]);

  const [isFormValid, setIsFormValid] = useState(false);

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
            Step 03 / 05
          </p>

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
            Where&rsquo;s the event?
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-warm-gray-soft)',
              lineHeight: 1.6,
              maxWidth: '360px',
            }}
          >
            Just the essentials. We&rsquo;ll grab anything else we need in our
            pre-event call.
          </p>
        </div>

        {/* ── Right column — form + navigation ──────────────────── */}
        <div>
          <DetailsForm onValidityChange={setIsFormValid} />

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
            }}
          >
            <Button
              variant="secondary"
              surface="light"
              onClick={() => router.push('/book/package')}
            >
              ← Back
            </Button>

            <Button
              variant="primary"
              disabled={!isFormValid}
              onClick={() => router.push('/book/customize')}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
