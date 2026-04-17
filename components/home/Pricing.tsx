import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PackageCard } from '@/components/ui/PackageCard';
import { PACKAGES } from '@/lib/data/packages';

export function Pricing() {
  return (
    <section className="bg-bone pt-[56px] sm:pt-[80px] lg:pt-[96px]">
      {/* Section header */}
      <Container>
        <SectionLabel index="05" label="Pricing" surface="light" />
        <h2
          className="font-medium text-ink-soft mt-[24px]"
          style={{
            fontSize: 'var(--text-section)',
            letterSpacing: 'var(--text-section-tracking)',
            lineHeight: 'var(--text-section-leading)',
          }}
        >
          Three ways to book us. No{' '}
          <span className="text-clay">hidden math.</span>
        </h2>
        <p
          className="text-warm-gray-soft mt-[16px]"
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 'var(--text-body-leading)',
            maxWidth: '60ch',
          }}
        >
          Every package includes pro setup, a dedicated attendant, unlimited
          sessions, and instant digital sharing. What changes is how long we
          stay and how far we push the details.
        </p>
      </Container>

      {/* Cards grid */}
      <Container className="mt-[48px] lg:mt-[64px]">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => {
            const position =
              i === 0 ? 'left' : i === PACKAGES.length - 1 ? 'right' : 'center';
            return (
              <PackageCard
                key={pkg.slug}
                mode="homepage"
                pkg={pkg}
                position={position}
              />
            );
          })}
        </div>
      </Container>

      {/* Footer strip */}
      <div
        className="mt-[24px] lg:mt-[24px]"
        style={{
          background: 'var(--color-bone-warm)',
          borderTop: '0.5px solid var(--color-border-light)',
        }}
      >
        <Container>
          <div className="flex flex-col gap-[12px] py-[20px] sm:flex-row sm:items-center sm:justify-between sm:gap-[24px]">
            {/* Left — custom quote link */}
            <a
              href="/contact"
              className="text-[13px] text-warm-gray transition-colors duration-150 hover:text-ink-soft"
            >
              Corporate or large event? Build a custom package
            </a>

            {/* Right — policy meta */}
            <div className="flex items-center gap-[16px]">
              <span className="text-[13px] text-warm-gray">
                Free rescheduling · 14 days
              </span>
              <span
                className="text-warm-gray"
                style={{
                  borderLeft: '0.5px solid var(--color-border-light)',
                  paddingLeft: '16px',
                  fontSize: '13px',
                }}
              >
                $100 deposit locks your date
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Section bottom padding */}
      <div className="pb-[56px] sm:pb-[80px] lg:pb-[96px]" />
    </section>
  );
}
