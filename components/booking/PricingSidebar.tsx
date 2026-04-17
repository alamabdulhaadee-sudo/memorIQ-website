'use client';

import { ADD_ONS, PACKAGE_LABELS } from '@/lib/data/customize';
import type { PackageId } from '@/types/booking';

interface PricingSidebarProps {
  packageId: PackageId | null;
  packageBasePrice: number;  // cents
  selectedAddOns: string[];
  subtotal: number;           // cents
  depositAmount: number;      // cents — always 10000
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;
}

export function PricingSidebar({
  packageId,
  packageBasePrice,
  selectedAddOns,
  subtotal,
  depositAmount,
}: PricingSidebarProps) {
  const packageLabel = packageId ? PACKAGE_LABELS[packageId] : 'No package selected';
  const remaining = Math.max(0, subtotal - depositAmount);

  // Resolve add-on details for display
  const activeAddOns = selectedAddOns
    .map((id) => ADD_ONS.find((a) => a.id === id))
    .filter(Boolean) as typeof ADD_ONS;

  return (
    <aside
      style={{
        position: 'sticky',
        top: '64px', // clears step-indicator bar (~52px) + some breathing room
        background: 'var(--color-bone-warm)',
        border: '0.5px solid var(--color-border-light)',
        borderRadius: '6px',
        padding: '28px 24px',
        fontSize: '14px',
        color: 'var(--color-ink-soft)',
      }}
      aria-label="Booking summary"
    >
      {/* Package row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: activeAddOns.length > 0 ? '12px' : '0',
        }}
      >
        <span style={{ fontWeight: 500 }}>{packageLabel}</span>
        <span style={{ color: 'var(--color-warm-gray-soft)' }}>
          {formatDollars(packageBasePrice)}
        </span>
      </div>

      {/* Add-on rows */}
      {activeAddOns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeAddOns.map((addOn) => {
            const included =
              addOn.included_in?.includes(packageId ?? '') ?? false;
            return (
              <div
                key={addOn.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    color: 'var(--color-warm-gray-soft)',
                    fontSize: '13px',
                  }}
                >
                  {addOn.name}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: included ? '#4A9B6F' : 'var(--color-warm-gray-soft)',
                    fontWeight: included ? 500 : 400,
                  }}
                >
                  {included
                    ? 'Included'
                    : addOn.price === 0
                    ? 'TBD'
                    : formatDollars(addOn.price)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Hairline divider */}
      <hr
        style={{
          border: 'none',
          borderTop: '0.5px solid var(--color-border-light)',
          margin: '20px 0',
        }}
      />

      {/* Subtotal */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontWeight: 500,
          marginBottom: '14px',
        }}
      >
        <span>Subtotal</span>
        <span>{formatDollars(subtotal)}</span>
      </div>

      {/* Deposit */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          color: 'var(--color-warm-gray-soft)',
          fontSize: '13px',
          marginBottom: '8px',
        }}
      >
        <span>Deposit due today</span>
        <span>{formatDollars(depositAmount)}</span>
      </div>

      {/* Remaining balance */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          color: 'var(--color-warm-gray-soft)',
          fontSize: '13px',
        }}
      >
        <span>Remaining balance</span>
        <span>{formatDollars(remaining)}</span>
      </div>

      {/* Due date note */}
      <p
        style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'var(--color-warm-gray)',
          letterSpacing: '0.01em',
        }}
      >
        Due 2 weeks before your event.
      </p>
    </aside>
  );
}
