'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useBooking } from '@/contexts/BookingContext';
import { TemplateGrid } from '@/components/booking/TemplateGrid';
import { BackdropGrid } from '@/components/booking/BackdropGrid';
import { AddOnList } from '@/components/booking/AddOnList';
import { PricingSidebar } from '@/components/booking/PricingSidebar';
import { PricingBottomBar } from '@/components/booking/PricingBottomBar';
import { Button } from '@/components/ui/Button';
import {
  ADD_ONS,
  PACKAGE_PRICES,
  DEFAULT_TEMPLATE,
  DEFAULT_BACKDROP,
} from '@/lib/data/customize';

export default function CustomizePage() {
  const router = useRouter();
  const { state, dispatch } = useBooking();

  // ── Apply defaults on mount (only if not already set — preserves
  //    back-navigation selections) ─────────────────────────────────
  useEffect(() => {
    if (!state.templateChoice) {
      dispatch({ type: 'SET_TEMPLATE_CHOICE', payload: DEFAULT_TEMPLATE });
    }
    if (!state.backdropChoice) {
      dispatch({ type: 'SET_BACKDROP_CHOICE', payload: DEFAULT_BACKDROP });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recalculate subtotal whenever selections change ────────────
  useEffect(() => {
    const packageBase = state.packageId ? PACKAGE_PRICES[state.packageId] ?? 0 : 0;

    const addOnTotal = state.selectedAddOns.reduce((sum, id) => {
      const addOn = ADD_ONS.find((a) => a.id === id);
      if (!addOn) return sum;
      // Don't charge for add-ons included in the selected package
      const included = addOn.included_in?.includes(state.packageId ?? '') ?? false;
      if (included) return sum;
      return sum + addOn.price;
    }, 0);

    dispatch({ type: 'SET_SUBTOTAL', payload: packageBase + addOnTotal });
  }, [state.packageId, state.selectedAddOns, dispatch]);

  // ── Handlers ──────────────────────────────────────────────────

  function handleTemplateSelect(id: string) {
    dispatch({ type: 'SET_TEMPLATE_CHOICE', payload: id });
  }

  function handleBackdropSelect(id: string, updatedAddOns: string[]) {
    dispatch({ type: 'SET_BACKDROP_CHOICE', payload: id });
    dispatch({ type: 'SET_SELECTED_ADD_ONS', payload: updatedAddOns });
  }

  function handleAddOnsChange(updatedAddOns: string[]) {
    dispatch({ type: 'SET_SELECTED_ADD_ONS', payload: updatedAddOns });
  }

  const packageBasePrice = state.packageId
    ? (PACKAGE_PRICES[state.packageId] ?? 0)
    : 0;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        // Extra bottom padding on mobile so content isn't hidden behind sticky bar
        paddingBottom: '80px',
      }}
      className="lg:pb-0"
    >
      <div
        style={{
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(40px, 5vw, 80px) clamp(20px, 4vw, 48px)',
        }}
      >
        {/* ── Two-column grid on desktop ─────────────────────────── */}
        {/*   Left (~65%): step context + all interactive sections   */}
        {/*   Right (~35%): sticky pricing sidebar (desktop only)    */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(40px, 6vw, 64px)',
            alignItems: 'start',
          }}
          className="lg:grid-cols-[3fr_2fr]"
        >
          {/* ── LEFT / MAIN ──────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Step header */}
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
                Step 04 / 05
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
                Make it yours.
              </h1>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-warm-gray-soft)',
                  lineHeight: 1.6,
                  maxWidth: '44ch',
                }}
              >
                Pick a template and backdrop. Add anything extra. The total
                updates as you go.
              </p>
            </div>

            {/* 4a — Template */}
            <TemplateGrid
              selected={state.templateChoice}
              packageId={state.packageId}
              onSelect={handleTemplateSelect}
            />

            {/* 4b — Backdrop */}
            <BackdropGrid
              selected={state.backdropChoice}
              selectedAddOns={state.selectedAddOns}
              onSelect={handleBackdropSelect}
            />

            {/* 4c — Add-ons */}
            <AddOnList
              packageId={state.packageId}
              selectedAddOns={state.selectedAddOns}
              backdropChoice={state.backdropChoice}
              onChange={handleAddOnsChange}
            />

            {/* Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
              }}
            >
              <Button
                variant="secondary"
                surface="light"
                onClick={() => router.push('/book/details')}
              >
                ← Back
              </Button>
              {/* Always enabled — template + backdrop have defaults */}
              <Button
                variant="primary"
                onClick={() => router.push('/book/pay')}
              >
                Continue →
              </Button>
            </div>
          </div>

          {/* ── RIGHT / SIDEBAR (desktop only) ───────────────────── */}
          <div className="hidden lg:block">
            <PricingSidebar
              packageId={state.packageId}
              packageBasePrice={packageBasePrice}
              selectedAddOns={state.selectedAddOns}
              subtotal={state.subtotal}
              depositAmount={state.depositAmount}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ──────────────────────────── */}
      <div className="lg:hidden">
        <PricingBottomBar
          packageId={state.packageId}
          packageBasePrice={packageBasePrice}
          selectedAddOns={state.selectedAddOns}
          subtotal={state.subtotal}
          depositAmount={state.depositAmount}
        />
      </div>
    </div>
  );
}
