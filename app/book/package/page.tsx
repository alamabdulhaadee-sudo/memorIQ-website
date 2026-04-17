import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Choose Package | Book MEMORIQ',
};

export default function PackagePage() {
  return (
    <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-68px)] flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_3fr] max-w-[1200px] mx-auto w-full px-md sm:px-lg lg:px-xl py-[56px] lg:py-[80px] gap-[48px] lg:gap-[80px]">

        {/* Left column — context */}
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray mb-[20px]">
            02&nbsp;/&nbsp;PACKAGE
          </p>
          <h1
            className="text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-ink-soft mb-[16px]"
          >
            Which package fits the night?
          </h1>
          <p className="text-[14px] text-warm-gray-soft leading-[1.6] max-w-[38ch]">
            Most events book Signature. Start there unless you&rsquo;ve got a specific
            reason to go smaller or bigger.
          </p>

          <a
            href="/contact"
            className="mt-[24px] inline-block text-[13px] text-clay hover:underline transition-colors duration-150"
          >
            Not sure? Contact us for a quick consult →
          </a>
        </div>

        {/* Right column — placeholder */}
        <div className="flex flex-col gap-[32px]">
          <div
            className="flex-1 min-h-[360px] rounded-[4px] bg-bone-warm flex items-center justify-center"
            style={{ border: '0.5px solid var(--color-border-light)' }}
          >
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray opacity-60">
              [Package cards — built in Prompt 3]
            </p>
          </div>

          <div className="flex items-center justify-between gap-[12px]">
            <Button variant="secondary" surface="light" href="/book/date">
              ← Back
            </Button>
            <Button variant="primary" href="#" aria-disabled="true">
              Continue →
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
