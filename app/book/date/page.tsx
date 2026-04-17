import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Select Date | Book MEMORIQ',
};

export default function DatePage() {
  return (
    <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-68px)] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_3fr] max-w-[1200px] mx-auto w-full px-md sm:px-lg lg:px-xl py-[56px] lg:py-[80px] gap-[48px] lg:gap-[80px]">

        {/* Left column — context */}
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray mb-[20px]">
            01&nbsp;/&nbsp;DATE
          </p>
          <h1
            className="text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-ink-soft mb-[16px]"
          >
            When&rsquo;s the big day?
          </h1>
          <p className="text-[14px] text-warm-gray-soft leading-[1.6] max-w-[38ch]">
            Pick your event date. We&rsquo;ll hold it for 15 minutes while you finish
            booking. Dates in orange are available, grey is taken.
          </p>

          {/* Helper callout */}
          <div
            className="mt-[32px] p-[16px] rounded-[4px]"
            style={{
              background: 'var(--color-clay-soft)',
              borderLeft: '3px solid var(--color-clay)',
            }}
          >
            <p className="text-[13px] text-ink-soft leading-[1.5]">
              <strong>Heads up.</strong> June through October books 6–8 weeks out.
              If your date&rsquo;s open, don&rsquo;t sleep on it.
            </p>
          </div>
        </div>

        {/* Right column — placeholder */}
        <div className="flex flex-col gap-[32px]">
          <div
            className="flex-1 min-h-[360px] rounded-[4px] bg-bone-warm flex items-center justify-center"
            style={{ border: '0.5px solid var(--color-border-light)' }}
          >
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray opacity-60">
              [Calendar — built in Prompt 2]
            </p>
          </div>

          {/* Navigation */}
          <StepNav showBack={false} />
        </div>

      </div>
    </div>
  );
}

// Shared nav used across all stubs (inlined to avoid a client component)
function StepNav({ showBack }: { showBack: boolean }) {
  return (
    <div className="flex items-center justify-between gap-[12px]">
      {showBack ? (
        <Button variant="secondary" surface="light" href="#" aria-disabled="true">
          ← Back
        </Button>
      ) : (
        <span />
      )}
      <Button variant="primary" href="#" aria-disabled="true">
        Continue →
      </Button>
    </div>
  );
}
