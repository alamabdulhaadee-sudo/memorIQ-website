'use client';

import { ADD_ONS, PREMIUM_BACKDROP_ADDON_ID } from '@/lib/data/customize';
import type { PackageId } from '@/types/booking';

interface AddOnListProps {
  packageId: PackageId | null;
  selectedAddOns: string[];
  backdropChoice: string | null;
  onChange: (updatedAddOns: string[]) => void;
}

function formatPrice(cents: number): string {
  return `+$${(cents / 100).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;
}

export function AddOnList({
  packageId,
  selectedAddOns,
  backdropChoice,
  onChange,
}: AddOnListProps) {
  // Determine if the selected backdrop is premium by checking if
  // custom_backdrop is currently in selectedAddOns (managed by BackdropGrid)
  const premiumBackdropActive = selectedAddOns.includes(PREMIUM_BACKDROP_ADDON_ID);

  function isIncluded(includedIn: string[] | null): boolean {
    if (!includedIn || !packageId) return false;
    return includedIn.includes(packageId);
  }

  function handleToggle(id: string, currentlyOn: boolean) {
    if (currentlyOn) {
      onChange(selectedAddOns.filter((a) => a !== id));
    } else {
      onChange([...selectedAddOns, id]);
    }
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
        Add-ons
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {ADD_ONS.map((addOn) => {
          const included = isIncluded(addOn.included_in);
          const isOn = included || selectedAddOns.includes(addOn.id);

          // custom_backdrop toggle is driven by backdrop selection — disable manual toggle
          const isExternallyControlled =
            addOn.id === PREMIUM_BACKDROP_ADDON_ID;

          // travel_fee has price 0 and no included_in — show as toggle-able info row
          const isTravelFee = addOn.id === 'travel_fee';

          const disabled = included || isExternallyControlled;

          return (
            <div
              key={addOn.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '14px 0',
                borderBottom: '0.5px solid var(--color-border-light)',
                opacity: disabled && !included ? 0.55 : 1,
              }}
            >
              {/* Left: name + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-ink-soft)',
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {addOn.name}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-warm-gray)',
                    margin: '3px 0 0',
                    lineHeight: 1.5,
                  }}
                >
                  {isExternallyControlled && premiumBackdropActive
                    ? 'Added with your premium backdrop selection.'
                    : addOn.description}
                </p>
              </div>

              {/* Right: price label + toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                }}
              >
                {/* Price label */}
                {included ? (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#4A9B6F',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Included
                  </span>
                ) : isTravelFee ? (
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-warm-gray)',
                    }}
                  >
                    TBD
                  </span>
                ) : addOn.price > 0 ? (
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-warm-gray-soft)',
                    }}
                  >
                    {formatPrice(addOn.price)}
                  </span>
                ) : null}

                {/* Toggle switch */}
                <ToggleSwitch
                  on={isOn}
                  disabled={disabled}
                  onChange={() => handleToggle(addOn.id, isOn)}
                  ariaLabel={`Toggle ${addOn.name}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


// ── Toggle switch ─────────────────────────────────────────────

interface ToggleSwitchProps {
  on: boolean;
  disabled: boolean;
  onChange: () => void;
  ariaLabel: string;
}

function ToggleSwitch({ on, disabled, onChange, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '40px',
        height: '22px',
        borderRadius: '999px',
        border: 'none',
        padding: '2px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: on ? 'var(--color-clay)' : 'var(--color-border-light)',
        transition: 'background 150ms ease',
        flexShrink: 0,
        // Override any UA button styles
        outline: 'none',
      }}
    >
      {/* Knob */}
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: on ? 'calc(100% - 20px)' : '2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: on ? 'var(--color-bone)' : 'var(--color-warm-gray)',
          transition: 'left 150ms ease, background 150ms ease',
        }}
      />
    </button>
  );
}
