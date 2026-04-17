'use client';

// TODO: If the final design calls for suppressing the site Nav/Footer on /book/*
// routes, that change must happen in app/layout.tsx (e.g. by reading the pathname
// there and conditionally rendering Nav/Footer). This nested layout does NOT
// duplicate Nav/Footer — it only adds the step indicator bar and BookingProvider.

import { usePathname } from 'next/navigation';
import { BookingProvider } from '@/contexts/BookingContext';

// ── Step metadata ─────────────────────────────────────────────

const STEPS = [
  { number: 1, slug: 'date',      label: 'DATE'     },
  { number: 2, slug: 'package',   label: 'PACKAGE'  },
  { number: 3, slug: 'details',   label: 'DETAILS'  },
  { number: 4, slug: 'customize', label: 'CUSTOMIZE'},
  { number: 5, slug: 'pay',       label: 'PAY'      },
] as const;

const TOTAL_STEPS = STEPS.length;

function getCurrentStep(pathname: string): number | null {
  for (const step of STEPS) {
    if (pathname.includes(`/book/${step.slug}`)) return step.number;
  }
  return null; // confirmed page, or unknown
}

function zeroPad(n: number): string {
  return String(n).padStart(2, '0');
}


// ── Step indicator ────────────────────────────────────────────

function StepIndicator() {
  const pathname  = usePathname();
  const current   = getCurrentStep(pathname);
  const isConfirmed = pathname.includes('/book/confirmed');

  if (isConfirmed || current === null) return null;

  return (
    <div
      className="w-full bg-bone [border-bottom:0.5px_solid_var(--color-border-light)] px-md sm:px-lg lg:px-xl"
      aria-label={`Booking step ${current} of ${TOTAL_STEPS}`}
    >
      {/* Mobile: "STEP 02 OF 05" */}
      <div className="flex sm:hidden items-center justify-between h-[44px]">
        <p
          className="text-[11px] font-medium tracking-[0.18em] uppercase text-ink-soft"
          aria-current="step"
        >
          STEP {zeroPad(current)} OF {zeroPad(TOTAL_STEPS)}
        </p>
        {/* Close link — mobile */}
        <CloseButton />
      </div>

      {/* Desktop: full step rail */}
      <div className="hidden sm:flex items-center h-[48px]">
        <ol className="flex items-center gap-0 flex-1" role="list">
          {STEPS.map((step, i) => {
            const isCurrent = step.number === current;
            const isLast    = i === STEPS.length - 1;

            return (
              <li key={step.slug} className="flex items-center">
                <span
                  className={[
                    'text-[11px] font-medium tracking-[0.18em] uppercase leading-none whitespace-nowrap',
                    isCurrent
                      ? 'text-ink-soft'
                      : 'text-warm-gray',
                  ].join(' ')}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {zeroPad(step.number)}&nbsp;/&nbsp;{step.label}
                </span>

                {/* Em-dash separator — not after the last step */}
                {!isLast && (
                  <span
                    className="mx-[14px] text-[11px] leading-none select-none"
                    style={{ color: 'var(--color-border-light)' }}
                    aria-hidden="true"
                  >
                    —
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* Close link — desktop */}
        <CloseButton />
      </div>
    </div>
  );
}


// ── Close button ──────────────────────────────────────────────
// TODO: Replace with a confirm dialog ("Are you sure? Your progress will be lost.")
// when any booking step has been completed. For now it links directly to homepage.

function CloseButton() {
  return (
    <a
      href="/"
      className={[
        'flex-shrink-0 text-[12px] font-medium text-warm-gray hover:text-ink-soft',
        'transition-colors duration-150 leading-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded',
      ].join(' ')}
      aria-label="Close booking and return to homepage"
    >
      Close&nbsp;×
    </a>
  );
}


// ── Layout ────────────────────────────────────────────────────

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <StepIndicator />
      <div className="flex-1 bg-bone">
        {children}
      </div>
    </BookingProvider>
  );
}
