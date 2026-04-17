import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmed | MEMORIQ',
};

export default function ConfirmedPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-md sm:px-lg py-[80px]">
      <div className="max-w-[560px] w-full">

        {/* Headline */}
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray mb-[20px]">
          CONFIRMED
        </p>
        <h1
          className="text-[clamp(44px,6vw,64px)] font-medium tracking-[-0.035em] leading-[0.98] text-ink-soft mb-[16px]"
        >
          You&rsquo;re all set.
        </h1>
        <p className="text-[15px] text-warm-gray-soft leading-[1.6] mb-[48px]">
          Confirmation&rsquo;s headed to your inbox. We&rsquo;ll reach out 2 weeks before
          to lock in the final details.
        </p>

        {/* Booking summary placeholder */}
        <div
          className="rounded-[4px] p-[24px] mb-[40px]"
          style={{ border: '0.5px solid var(--color-border-light)' }}
        >
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[16px]">
            Your booking
          </p>
          <div className="flex flex-col gap-[10px]">
            {[
              ['Date',    '[Event date]'],
              ['Package', '[Package name + hours]'],
              ['Venue',   '[Venue name, address]'],
              ['Paid',    '$100 deposit'],
              ['Balance', '[Remaining balance + due date]'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-[16px] text-[13px]">
                <span className="text-warm-gray">{label}</span>
                <span className="text-ink-soft text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="mb-[40px]">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[16px]">
            What happens next
          </p>
          <ol className="flex flex-col gap-[10px]">
            {[
              'Confirmation email within 5 minutes',
              'Pre-event call 2 weeks before',
              'Our team arrives 1 hour before start time',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-[12px] text-[13px] text-warm-gray-soft leading-[1.5]">
                <span className="text-clay font-medium flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* Actions placeholder — built in Prompt 7 */}
        <div
          className="rounded-[4px] bg-bone-warm p-[20px] flex items-center justify-center"
          style={{ border: '0.5px solid var(--color-border-light)' }}
        >
          <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray opacity-60">
            [Add to calendar · Share with planner — built in Prompt 7]
          </p>
        </div>

      </div>
    </div>
  );
}
