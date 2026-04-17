'use client';

import { useState } from 'react';
import { ADD_ONS, PACKAGE_LABELS } from '@/lib/data/customize';
import type { PackageId } from '@/types/booking';

interface PricingBottomBarProps {
  packageId: PackageId | null;
  packageBasePrice: number;  // cents
  selectedAddOns: string[];
  subtotal: number;           // cents
  depositAmount: number;      // cents
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;
}

export function PricingBottomBar({
  packageId,
  packageBasePrice,
  selectedAddOns,
  subtotal,
  depositAmount,
}: PricingBottomBarProps) {
  const [expanded, setExpanded] = useState(false);
  const packageLabel = packageId ? PACKAGE_LABELS[packageId] : 'No package';
  const remaining = Math.max(0, subtotal - depositAmount);

  const activeAddOns = selectedAddOns
    .map((id) => ADD_ONS.find((a) => a.id === id))
    .filter(Boolean) as typeof ADD_ONS;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--color-ink)',
        color: 'var(--color-bone)',
        boxShadow: '0 -1px 0 rgba(244,241,234,0.12)',
      }}
    >
      {/* Expanded breakdown */}
      {expanded && (
        <div
          style={{
            padding: '20px 20px 0',
            borderBottom: '0.5px solid var(--color-border-dark)',
          }}
        >
          {/* Package */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '13px',
            }}
          >
            <span style={{ fontWeight: 500 }}>{packageLabel}</span>
            <span style={{ color: 'var(--color-warm-gray)' }}>
              {formatDollars(packageBasePrice)}
            </span>
          </div>

          {/* Add-on rows */}
          {activeAddOns.map((addOn) => {
            const included =
              addOn.included_in?.includes(packageId ?? '') ?? false;
            return (
              <div
                key={addOn.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: 'var(--color-warm-gray)' }}>
                  {addOn.name}
                </span>
                <span
                  style={{
                    color: included ? '#4A9B6F' : 'var(--color-warm-gray)',
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

          <hr
            style={{
              border: 'none',
              borderTop: '0.5px solid var(--color-border-dark)',
              margin: '14px 0',
            }}
          />

          {/* Subtotal */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '10px',
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
              fontSize: '13px',
              color: 'var(--color-warm-gray)',
              marginBottom: '6px',
            }}
          >
            <span>Deposit due today</span>
            <span>{formatDollars(depositAmount)}</span>
          </div>

          {/* Remaining */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: 'var(--color-warm-gray)',
              marginBottom: '16px',
            }}
          >
            <span>Remaining balance</span>
            <span>{formatDollars(remaining)}</span>
          </div>

          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-warm-gray)',
              letterSpacing: '0.01em',
              marginBottom: '14px',
            }}
          >
            Remaining balance due 2 weeks before your event.
          </p>
        </div>
      )}

      {/* Collapsed bar — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          textAlign: 'left',
        }}
        aria-expanded={expanded}
        aria-label="View price breakdown"
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-warm-gray)',
              display: 'block',
              marginBottom: '2px',
            }}
          >
            {packageLabel}
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
            }}
          >
            {formatDollars(subtotal)}
          </span>
        </div>

        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-warm-gray)',
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {expanded ? 'Hide' : 'View breakdown'}
          <span
            style={{
              display: 'inline-block',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 150ms ease',
            }}
          >
            ↑
          </span>
        </span>
      </button>
    </div>
  );
}
