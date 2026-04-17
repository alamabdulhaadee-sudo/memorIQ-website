'use client';

import { TEMPLATES, DEFAULT_TEMPLATE } from '@/lib/data/customize';
import type { PackageId } from '@/types/booking';

interface TemplateGridProps {
  selected: string | null;
  packageId: PackageId | null;
  onSelect: (id: string) => void;
}

export function TemplateGrid({ selected, packageId, onSelect }: TemplateGridProps) {
  const activeId = selected ?? DEFAULT_TEMPLATE;

  const customIncluded =
    packageId === 'signature' || packageId === 'full_takeover';

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
        Template style
      </p>

      {/* 2×2 grid — 4 columns on wide screens */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
        className="sm:grid-cols-4"
      >
        {TEMPLATES.map((tpl) => {
          const isSelected = activeId === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '8px',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${tpl.label} template`}
            >
              {/* Placeholder card */}
              <div
                style={{
                  aspectRatio: '4 / 3',
                  borderRadius: '4px',
                  backgroundColor: tpl.color,
                  border: isSelected
                    ? '2px solid var(--color-clay)'
                    : '0.5px solid var(--color-border-light)',
                  transition: 'border 150ms ease',
                }}
              />
              {/* Label */}
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: isSelected ? 500 : 400,
                  color: isSelected
                    ? 'var(--color-ink-soft)'
                    : 'var(--color-warm-gray-soft)',
                  transition: 'color 150ms ease',
                }}
              >
                {tpl.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Note about custom template */}
      <p
        style={{
          marginTop: '14px',
          fontSize: '13px',
          color: customIncluded
            ? 'var(--color-warm-gray-soft)'
            : 'var(--color-warm-gray)',
        }}
      >
        {customIncluded
          ? '✓ Full custom template included in your package.'
          : 'Full custom template included in Signature and Full Takeover.'}
      </p>
    </section>
  );
}
