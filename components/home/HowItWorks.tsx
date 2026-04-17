import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

interface Step {
  numeral: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    numeral: "01",
    title: "Pick your date.",
    description: "Check the live calendar. If it's open, it's bookable.",
  },
  {
    numeral: "02",
    title: "Choose your package.",
    description: "Three tiers, transparent pricing, no quote-gated nonsense.",
  },
  {
    numeral: "03",
    title: "Lock it in.",
    description:
      "A $100 deposit reserves your date. We handle everything else.",
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const isLast = index === STEPS.length - 1;

  return (
    <div
      className={[
        // Mobile: stack with bottom border on all but last
        "flex flex-col py-[32px]",
        !isLast
          ? "[border-bottom:0.5px_solid_var(--color-border-light)] lg:border-b-0"
          : "",
        // Desktop: right border on all but last, offset padding per column
        index === 0 ? "lg:pr-[40px]" : "",
        index === 1
          ? "lg:px-[40px] lg:[border-right:0.5px_solid_var(--color-border-light)]"
          : "",
        index === 2 ? "lg:pl-[40px]" : "",
        "lg:pt-[40px] lg:pb-[48px]",
      ].join(" ")}
    >
      {/* Numeral */}
      <span
        className="font-medium leading-none block"
        style={{
          fontSize: "var(--text-display)",
          letterSpacing: "var(--text-display-tracking)",
          color: "var(--color-border-light)",
        }}
        aria-hidden="true"
      >
        {step.numeral}
      </span>

      {/* Step title */}
      <h3
        className="font-medium text-ink-soft mt-[20px]"
        style={{
          fontSize: "var(--text-sub)",
          letterSpacing: "var(--text-sub-tracking)",
          lineHeight: "var(--text-sub-leading)",
        }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p
        className="text-warm-gray-soft mt-[12px]"
        style={{
          fontSize: "var(--text-body)",
          lineHeight: "var(--text-body-leading)",
          maxWidth: "40ch",
        }}
      >
        {step.description}
      </p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-bone pt-[56px] sm:pt-[80px] lg:pt-[96px] pb-[56px] sm:pb-[80px] lg:pb-[96px]">
      <Container>
        {/* Section header */}
        <SectionLabel index="03" label="How it works" surface="light" />
        <h2
          className="font-medium text-ink-soft mt-[24px]"
          style={{
            fontSize: "var(--text-section)",
            letterSpacing: "var(--text-section-tracking)",
            lineHeight: "var(--text-section-leading)",
          }}
        >
          Book the booth in under 5 minutes.
        </h2>

        {/* Steps grid */}
        <div
          className="mt-[48px] lg:mt-[64px]"
          style={{ borderTop: "0.5px solid var(--color-border-light)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <StepCard key={step.numeral} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-[56px] lg:mt-[64px]">
          <Button href="/book/date" variant="primary">
            Check availability →
          </Button>
        </div>
      </Container>
    </section>
  );
}
