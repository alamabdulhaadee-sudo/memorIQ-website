// ============================================================
// PackageCard — shared between:
//   - components/home/Pricing.tsx  (mode="homepage")
//   - app/book/package/page.tsx    (mode="booking")
// ============================================================

import { Button } from '@/components/ui/Button';
import type { HomepagePackage } from '@/lib/data/packages';

// ── Homepage mode ─────────────────────────────────────────────
// Renders the full card with a CTA button that links to /book/date.
// Adjacent cards collapse shared seam borders via the `position` prop.

interface HomepageProps {
  mode: 'homepage';
  pkg: HomepagePackage;
  position: 'left' | 'center' | 'right';
}

// ── Booking mode ──────────────────────────────────────────────
// Renders the card as a radio-style selector. No CTA button.
// Selected card shows a 2px clay border on all sides.

interface BookingProps {
  mode: 'booking';
  pkg: HomepagePackage;
  selected: boolean;
  onSelect: () => void;
}

type PackageCardProps = HomepageProps | BookingProps;

export function PackageCard(props: PackageCardProps) {
  const { pkg } = props;
  const isElevated = pkg.elevated;

  // ── Border style ────────────────────────────────────────────
  let borderStyle: React.CSSProperties;

  if (props.mode === 'booking') {
    if (props.selected) {
      // Selected: 2px clay on all sides
      borderStyle = {
        border: '2px solid var(--color-clay)',
        background: isElevated ? 'var(--color-ink)' : 'transparent',
      };
    } else {
      // Unselected: uniform 0.5px border (no seam collapsing needed — stacked layout)
      borderStyle = {
        border: '0.5px solid var(--color-border-light)',
        background: isElevated ? 'var(--color-ink)' : 'transparent',
      };
    }
  } else {
    // Homepage: collapse adjacent seams
    const pos = props.position;
    borderStyle = {
      borderTop: '0.5px solid var(--color-border-light)',
      borderBottom: '0.5px solid var(--color-border-light)',
      borderLeft: pos === 'right' ? 'none' : '0.5px solid var(--color-border-light)',
      borderRight: pos === 'left' ? 'none' : '0.5px solid var(--color-border-light)',
      background: isElevated ? 'var(--color-ink)' : 'transparent',
    };
  }

  // ── Interaction props (booking mode only) ────────────────────
  const interactionProps =
    props.mode === 'booking'
      ? {
          role: 'radio' as const,
          'aria-checked': props.selected,
          tabIndex: 0,
          onClick: props.onSelect,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              props.onSelect();
            }
          },
          style: {
            ...borderStyle,
            cursor: 'pointer',
            transition: 'border-color 150ms ease',
          },
        }
      : { style: borderStyle };

  return (
    <div
      className={[
        'relative flex flex-col rounded-[4px] p-[28px] lg:p-[40px]',
        props.mode === 'homepage' && isElevated ? 'z-10 lg:-my-[8px]' : 'z-0',
      ]
        .filter(Boolean)
        .join(' ')}
      {...interactionProps}
    >
      {/* Badge */}
      {pkg.badge && (
        <span className="absolute top-[-1px] left-[-1px] text-[10px] font-medium tracking-[0.2em] uppercase bg-clay text-ink px-[10px] py-[6px] rounded-tl-[4px] rounded-br-[4px]">
          {pkg.badge.toUpperCase()}
        </span>
      )}

      {/* Micro-label */}
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray leading-none"
        style={{ marginTop: pkg.badge ? '24px' : '0' }}
      >
        {pkg.index} / {pkg.label.toUpperCase()}
      </p>

      {/* Price */}
      <p
        className={[
          'font-medium leading-none mt-[16px]',
          isElevated ? 'text-bone' : 'text-ink-soft',
        ].join(' ')}
        style={{
          fontSize: 'var(--text-section)',
          letterSpacing: 'var(--text-section-tracking)',
        }}
      >
        {pkg.price}
      </p>

      {/* Meta */}
      <p className="text-[13px] leading-[1.6] text-warm-gray mt-[8px]">{pkg.meta}</p>

      {/* Divider */}
      <div
        className="mt-[24px]"
        style={{
          borderTop: isElevated
            ? '0.5px solid var(--color-border-dark)'
            : '0.5px solid var(--color-border-light)',
        }}
      />

      {/* Features */}
      <ul className="mt-[24px] flex flex-col gap-[12px] list-none">
        {pkg.features.map((feature) => (
          <li
            key={feature}
            className={[
              'text-[14px] leading-[1.5] flex gap-[8px]',
              isElevated ? 'text-bone opacity-90' : 'text-warm-gray-soft',
            ].join(' ')}
          >
            <span
              className={[
                'shrink-0 leading-[1.5]',
                isElevated ? 'text-clay' : 'text-warm-gray',
              ].join(' ')}
              aria-hidden="true"
            >
              —
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA — homepage mode only */}
      {props.mode === 'homepage' && (
        <div className="mt-[32px]">
          {isElevated ? (
            <Button
              href={`/book/date?package=${pkg.slug}`}
              variant="primary"
              className="w-full justify-center"
            >
              {pkg.cta}
            </Button>
          ) : (
            <Button
              href={`/book/date?package=${pkg.slug}`}
              variant="secondary"
              surface="light"
              className="w-full justify-center"
            >
              {pkg.cta}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
