'use client';

import {
  BACKDROPS,
  DEFAULT_BACKDROP,
  PREMIUM_BACKDROP_ADDON_ID,
  PREMIUM_BACKDROP_PRICE,
} from '@/lib/data/customize';

interface BackdropGridProps {
  selected: string | null;
  selectedAddOns: string[];
  onSelect: (id: string, updatedAddOns: string[]) => void;
}

export function BackdropGrid({
  selected,
  selectedAddOns,
  onSelect,
}: BackdropGridProps) {
  const activeId = selected ?? DEFAULT_BACKDROP;

  function handleClick(id: string, isPremium: boolean) {
    // Rebuild selectedAddOns based on whether new backdrop is premium
    let nextAddOns = selectedAddOns.filter(
      (a) => a !== PREMIUM_BACKDROP_ADDON_ID
    );
    if (isPremium) {
      nextAddOns = [...nextAddOns, PREMIUM_BACKDROP_ADDON_ID];
    }
    onSelect(id, nextAddOns);
  }

  return (
    <section>
      {/* Sub-section label */}
      <p
        style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-warm-gray)',
          marginBottom: '16px',
        }}
      >
        Backdrop
      </p>

      {/* 3-column swatch grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {BACKDROPS.map((bd) => {
          const isSelected = activeId === bd.id;
          return (
            <button
              key={bd.id}
              type="button"
              onClick={() => handleClick(bd.id, bd.isPremium)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '6px',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${bd.label} backdrop${bd.isPremium ? ' (premium, +$75)' : ''}`}
            >
              {/* Swatch */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '4px',
                  backgroundColor: bd.color,
                  border: isSelected
                    ? '2px solid var(--color-clay)'
                    : '0.5px solid var(--color-border-light)',
                  transition: 'border 150ms ease',
                  overflow: 'hidden',
                }}
              >
                {/* Premium badge */}
                {bd.isPremium && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'var(--color-clay)',
                      color: 'var(--color-bone)',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      lineHeight: 1.4,
                    }}
                  >
                    +${PREMIUM_BACKDROP_PRICE / 100}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '12px',
                  color: isSelected
                    ? 'var(--color-ink-soft)'
                    : 'var(--color-warm-gray)',
                  transition: 'color 150ms ease',
                }}
              >
                {bd.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
