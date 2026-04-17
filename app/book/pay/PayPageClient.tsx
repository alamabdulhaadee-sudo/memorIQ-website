'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripePaymentElementChangeEvent } from '@stripe/stripe-js';

import { stripePromise } from '@/lib/stripe/client';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/Button';
import {
  buildOrderLines,
  formatCents,
  formatBalanceDueDate,
} from '@/lib/utils/orderSummary';

// ── Stripe appearance — mirrors design system tokens.
// CSS variables cannot be used here; must use literal values.
const stripeAppearance = {
  theme: 'flat' as const,
  variables: {
    colorBackground:    '#F4F1EA',
    colorText:          '#1A1613',
    colorTextPlaceholder: '#8A7B68',
    colorDanger:        '#C65D3F',
    fontSizeBase:       '15px',
    fontFamily:         'Inter, DM Sans, system-ui, sans-serif',
    borderRadius:       '4px',
    spacingUnit:        '4px',
  },
  rules: {
    '.Input': {
      border:     '0.5px solid rgba(26,22,19,0.18)',
      boxShadow:  'none',
      padding:    '11px 14px',
    },
    '.Input:focus': {
      border:     '0.5px solid #C65D3F',
      boxShadow:  'none',
      outline:    'none',
    },
    '.Label': {
      fontSize:      '11px',
      fontWeight:    '500',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color:         '#8A7B68',
      marginBottom:  '6px',
    },
  },
};


// ── Inner payment form — must live inside <Elements> ─────────

interface PaymentFormProps {
  clientSecret: string;
  bookingState: ReturnType<typeof useBooking>['state'];
}

function PaymentForm({ clientSecret: _clientSecret, bookingState }: PaymentFormProps) {
  const stripe   = useStripe();
  const elements = useElements();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [stripeReady,   setStripeReady]   = useState(false);
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [paymentError,  setPaymentError]  = useState<string | null>(null);

  function handlePaymentElementChange(e: StripePaymentElementChangeEvent) {
    setStripeReady(e.complete);
    if (e.complete) setPaymentError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';

    // Persist state before Stripe navigates away — context is lost on redirect
    try {
      sessionStorage.setItem('memoriq-booking', JSON.stringify(bookingState));
    } catch {
      // sessionStorage unavailable — confirmed page will handle gracefully
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${origin}/book/confirmed`,
      },
    });

    // confirmPayment only returns here on failure — success redirects
    if (error) {
      setPaymentError(
        error.message ??
          'Something went sideways with the payment. Your card wasn\'t charged. Try again, or email us at hello@memoriq.co and we\'ll sort it manually.'
      );
    }

    setIsProcessing(false);
  }

  const canPay = termsAccepted && stripeReady && !isProcessing;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
      {/* Stripe Payment Element */}
      <PaymentElement
        id="payment-element"
        onChange={handlePaymentElementChange}
        options={{ layout: 'tabs' }}
      />

      {/* Trust signals */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <LockIcon />
          <span
            className="text-[12px] leading-[1.5]"
            style={{ color: 'var(--color-warm-gray)' }}
          >
            Secure payment powered by Stripe
          </span>
        </div>

        <div className="flex items-center gap-[10px]">
          <VisaIcon />
          <MastercardIcon />
          <AmexIcon />
        </div>

        <a
          href="/contact"
          className="text-[12px] underline underline-offset-2"
          style={{ color: 'var(--color-warm-gray)' }}
        >
          View refund &amp; reschedule policy
        </a>
      </div>

      {/* Terms checkbox */}
      <label className="flex items-start gap-[10px] cursor-pointer">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-[3px] flex-shrink-0 w-[15px] h-[15px] accent-clay"
        />
        <span
          className="text-[13px] leading-[1.5]"
          style={{ color: 'var(--color-warm-gray-soft)' }}
        >
          I agree to the booking terms
        </span>
      </label>

      {/* Payment error */}
      {paymentError && (
        <div
          className="rounded-[4px] p-[14px] text-[13px] leading-[1.55]"
          style={{
            background:   'var(--color-clay-soft)',
            borderLeft:   '2px solid var(--color-clay)',
            color:        'var(--color-warm-gray-soft)',
          }}
        >
          {paymentError}
        </div>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={!canPay}
        className="inline-flex items-center justify-center gap-[8px] rounded-full text-[13px] font-medium leading-none tracking-[0.01em] cursor-pointer select-none transition-colors duration-150 ease-[ease] disabled:opacity-40 disabled:pointer-events-none"
        style={{
          background: 'var(--color-clay)',
          color:      'var(--color-ink)',
          padding:    '14px 26px',
        }}
      >
        {isProcessing ? (
          <>
            <SpinnerIcon />
            Processing…
          </>
        ) : (
          'Pay $100 deposit and confirm booking'
        )}
      </button>
    </form>
  );
}


// ── Main client component ────────────────────────────────────

export default function PayPageClient() {
  const router = useRouter();
  const { state } = useBooking();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentError,  setIntentError]  = useState<string | null>(null);
  const [fetching,     setFetching]     = useState(false);

  // Guard: redirect to the first incomplete step
  useEffect(() => {
    if (!state.eventDate) {
      router.replace('/book/date');
    } else if (!state.packageId) {
      router.replace('/book/package');
    } else if (!state.customerName.trim() || !state.customerEmail.trim() || !state.venueAddress.trim()) {
      router.replace('/book/details');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIntent = useCallback(async () => {
    setFetching(true);
    setIntentError(null);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositAmount:  10000,
          bookingDetails: {
            packageId:      state.packageId,
            eventDate:      state.eventDate,
            customerName:   state.customerName,
            customerEmail:  state.customerEmail,
            customerPhone:  state.customerPhone,
            eventType:      state.eventType,
            venueName:      state.venueName,
            venueAddress:   state.venueAddress,
            guestCount:     state.guestCount,
            notes:          state.notes,
            templateChoice: state.templateChoice,
            backdropChoice: state.backdropChoice,
            selectedAddOns: state.selectedAddOns,
            subtotal:       state.subtotal,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error ?? 'Failed to initialise payment.');
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Unknown error.');
    } finally {
      setFetching(false);
    }
  }, [state.packageId, state.eventDate, state.customerEmail]);

  useEffect(() => {
    if (state.eventDate && state.packageId) {
      fetchIntent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Build order summary
  const lines     = buildOrderLines(state);
  const subtotal  = state.subtotal; // set by Step 04 via SET_SUBTOTAL
  const remaining = subtotal - state.depositAmount;
  const dueDate   = state.eventDate ? formatBalanceDueDate(state.eventDate) : '';

  return (
    <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-68px)] flex flex-col">
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_3fr] max-w-[1200px] mx-auto w-full px-md sm:px-lg lg:px-xl py-[56px] lg:py-[80px] gap-[48px] lg:gap-[80px]"
      >

        {/* ── Left column: context + order summary ── */}
        <div className="flex flex-col gap-[40px]">
          <div>
            <p
              className="text-[10px] font-medium tracking-[0.2em] uppercase mb-[20px]"
              style={{ color: 'var(--color-warm-gray)' }}
            >
              STEP&nbsp;05&nbsp;/&nbsp;05
            </p>
            <h1
              className="font-medium tracking-[-0.035em] leading-[1] mb-[16px]"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                color:    'var(--color-ink-soft)',
              }}
            >
              Lock in the date.
            </h1>
            <p
              className="text-[14px] leading-[1.6] max-w-[38ch]"
              style={{ color: 'var(--color-warm-gray-soft)' }}
            >
              A $100 deposit holds your date. The remaining balance is due 2 weeks
              before the event.
            </p>
          </div>

          {/* Order summary card */}
          <div
            className="rounded-[4px] p-[24px]"
            style={{ border: '0.5px solid var(--color-border-light)' }}
          >
            <p
              className="text-[10px] font-medium tracking-[0.2em] uppercase mb-[20px]"
              style={{ color: 'var(--color-warm-gray)' }}
            >
              ORDER SUMMARY
            </p>

            {/* Line items */}
            <div className="flex flex-col gap-[10px] mb-[16px]">
              {lines.map((line, i) => (
                <div key={i} className="flex justify-between gap-[16px]">
                  <span
                    className="text-[13px] leading-[1.5]"
                    style={{ color: 'var(--color-warm-gray-soft)' }}
                  >
                    {line.label}
                  </span>
                  <span
                    className="text-[13px] leading-[1.5] flex-shrink-0"
                    style={{ color: 'var(--color-ink-soft)' }}
                  >
                    {line.price === 'included' ? (
                      <span style={{ color: 'var(--color-warm-gray)' }}>Included</span>
                    ) : (
                      formatCents(line.price)
                    )}
                  </span>
                </div>
              ))}
            </div>

            <hr
              className="my-[16px]"
              style={{ border: 'none', borderTop: '0.5px solid var(--color-border-light)' }}
            />

            {/* Subtotal */}
            <div className="flex justify-between gap-[16px] mb-[16px]">
              <span
                className="text-[13px]"
                style={{ color: 'var(--color-warm-gray)' }}
              >
                Subtotal
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                {formatCents(subtotal)}
              </span>
            </div>

            <hr
              className="mb-[16px]"
              style={{ border: 'none', borderTop: '0.5px solid var(--color-border-light)' }}
            />

            {/* Deposit */}
            <div className="flex justify-between gap-[16px] items-baseline mb-[10px]">
              <span
                className="text-[14px] font-medium"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                Deposit due today
              </span>
              <span
                className="text-[20px] font-medium"
                style={{ color: 'var(--color-clay)' }}
              >
                $100.00
              </span>
            </div>

            {/* Remaining */}
            <div className="flex justify-between gap-[16px] items-baseline">
              <span
                className="text-[12px]"
                style={{ color: 'var(--color-warm-gray)' }}
              >
                Remaining balance
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                {formatCents(remaining)}
              </span>
            </div>

            {dueDate && (
              <p
                className="text-[11px] mt-[8px] text-right"
                style={{ color: 'var(--color-warm-gray)' }}
              >
                Due by {dueDate}
              </p>
            )}
          </div>
        </div>

        {/* ── Right column: payment form ── */}
        <div className="flex flex-col gap-[32px]">
          {fetching && !clientSecret && (
            <div
              className="rounded-[4px] animate-pulse"
              style={{
                minHeight:  '360px',
                background: 'var(--color-bone-warm)',
                border:     '0.5px solid var(--color-border-light)',
              }}
            />
          )}

          {intentError && (
            <div
              className="rounded-[4px] p-[24px] flex flex-col gap-[16px]"
              style={{
                border:     '0.5px solid var(--color-border-light)',
                background: 'var(--color-bone-warm)',
              }}
            >
              <p
                className="text-[14px] leading-[1.6]"
                style={{ color: 'var(--color-warm-gray-soft)' }}
              >
                Something went sideways setting up the payment. Try again or{' '}
                <a
                  href="/contact"
                  className="underline underline-offset-2"
                  style={{ color: 'var(--color-clay)' }}
                >
                  contact us
                </a>{' '}
                and we&rsquo;ll sort it manually.
              </p>
              <button
                onClick={fetchIntent}
                className="self-start rounded-full text-[13px] font-medium px-[20px] py-[10px] transition-colors duration-150"
                style={{
                  background: 'var(--color-clay)',
                  color:      'var(--color-ink)',
                }}
              >
                Try again
              </button>
            </div>
          )}

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: stripeAppearance }}
            >
              <PaymentForm clientSecret={clientSecret} bookingState={state} />
            </Elements>
          )}

          {/* Back navigation */}
          <div>
            <Button variant="secondary" surface="light" href="/book/customize">
              ← Back
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}


// ── Inline SVG icons ─────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" fill="none" style={{ color: 'var(--color-warm-gray)' }} />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1" fill="none" style={{ color: 'var(--color-warm-gray)' }} />
      <circle cx="7" cy="9.5" r="1" fill="currentColor" style={{ color: 'var(--color-warm-gray)' }} />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Visa" role="img">
      <rect width="38" height="24" rx="3" fill="var(--color-bone-warm)" />
      <text x="7" y="16" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#1A1613" letterSpacing="0">
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Mastercard" role="img">
      <rect width="38" height="24" rx="3" fill="var(--color-bone-warm)" />
      <circle cx="14" cy="12" r="6" fill="#C65D3F" fillOpacity="0.8" />
      <circle cx="24" cy="12" r="6" fill="#8A7B68" fillOpacity="0.8" />
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" aria-label="American Express" role="img">
      <rect width="38" height="24" rx="3" fill="var(--color-bone-warm)" />
      <text x="5" y="16" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#1A1613" letterSpacing="0">
        AMEX
      </text>
    </svg>
  );
}
