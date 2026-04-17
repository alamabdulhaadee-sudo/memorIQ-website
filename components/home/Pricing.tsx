import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

interface Package {
  index: string;
  slug: string;
  label: string;
  price: string;
  meta: string;
  features: string[];
  cta: string;
  elevated: boolean;
  badge: string | null;
}

const PACKAGES: Package[] = [
  {
    index: "01",
    slug: "essential",
    label: "Essential",
    price: "$400",
    meta: "2 hours · starts here",
    features: [
      "DSLR booth + studio lighting",
      "Standard backdrop",
      "Unlimited prints + digital",
      "Dedicated attendant",
      "Setup + teardown",
    ],
    cta: "Select essential →",
    elevated: false,
    badge: null,
  },
  {
    index: "02",
    slug: "signature",
    label: "Signature",
    price: "$550",
    meta: "3 hours · the one most people want",
    features: [
      "Everything in Essential",
      "Custom template design",
      "Premium backdrop library",
      "Digital gallery post-event",
      "GIF + boomerang mode",
    ],
    cta: "Select signature →",
    elevated: true,
    badge: "Most booked",
  },
  {
    index: "03",
    slug: "full-takeover",
    label: "Full Takeover",
    price: "$700",
    meta: "4 hours · no limits",
    features: [
      "Everything in Signature",
      "Premium prop collection",
      "Guest book with prints",
      "Priority weekend slots",
      "Second photographer option",
    ],
    cta: "Select full takeover →",
    elevated: false,
    badge: null,
  },
];

function PricingCard({
  pkg,
  position,
}: {
  pkg: Package;
  position: "left" | "center" | "right";
}) {
  const isElevated = pkg.elevated;

  // Border: all cards share a 0.5px border, but adjacent seams are removed
  // to avoid double borders. Left card: no right border. Right card: no left border.
  const borderStyle: React.CSSProperties = {
    borderTop: "0.5px solid var(--color-border-light)",
    borderBottom: "0.5px solid var(--color-border-light)",
    borderLeft:
      position === "right"
        ? "none"
        : "0.5px solid var(--color-border-light)",
    borderRight:
      position === "left"
        ? "none"
        : "0.5px solid var(--color-border-light)",
    background: isElevated ? "var(--color-ink)" : "transparent",
  };

  return (
    <div
      className={[
        "relative flex flex-col rounded-[4px] p-[28px] lg:p-[40px]",
        isElevated ? "z-10 lg:-my-[8px]" : "z-0",
      ].join(" ")}
      style={borderStyle}
    >
      {/* Badge */}
      {pkg.badge && (
        <span
          className="absolute top-[-1px] left-[-1px] text-[10px] font-medium tracking-[0.2em] uppercase bg-clay text-ink px-[10px] py-[6px] rounded-tl-[4px] rounded-br-[4px]"
        >
          {pkg.badge.toUpperCase()}
        </span>
      )}

      {/* Micro-label */}
      <p
        className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray leading-none"
        style={{ marginTop: pkg.badge ? "24px" : "0" }}
      >
        {pkg.index} / {pkg.label.toUpperCase()}
      </p>

      {/* Price */}
      <p
        className={["font-medium leading-none mt-[16px]", isElevated ? "text-bone" : "text-ink-soft"].join(" ")}
        style={{
          fontSize: "var(--text-section)",
          letterSpacing: "var(--text-section-tracking)",
        }}
      >
        {pkg.price}
      </p>

      {/* Meta */}
      <p className="text-[13px] leading-[1.6] text-warm-gray mt-[8px]">
        {pkg.meta}
      </p>

      {/* Divider */}
      <div
        className="mt-[24px]"
        style={{
          borderTop: isElevated
            ? "0.5px solid var(--color-border-dark)"
            : "0.5px solid var(--color-border-light)",
        }}
      />

      {/* Features */}
      <ul className="mt-[24px] flex flex-col gap-[12px] list-none">
        {pkg.features.map((feature) => (
          <li
            key={feature}
            className={[
              "text-[14px] leading-[1.5] flex gap-[8px]",
              isElevated ? "text-bone opacity-90" : "text-warm-gray-soft",
            ].join(" ")}
          >
            <span
              className={["shrink-0 leading-[1.5]", isElevated ? "text-clay" : "text-warm-gray"].join(" ")}
              aria-hidden="true"
            >
              —
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
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
    </div>
  );
}

export function Pricing() {
  return (
    <section className="bg-bone pt-[56px] sm:pt-[80px] lg:pt-[96px]">
      {/* Section header */}
      <Container>
        <SectionLabel index="05" label="Pricing" surface="light" />
        <h2
          className="font-medium text-ink-soft mt-[24px]"
          style={{
            fontSize: "var(--text-section)",
            letterSpacing: "var(--text-section-tracking)",
            lineHeight: "var(--text-section-leading)",
          }}
        >
          Three ways to book us. No{" "}
          <span className="text-clay">hidden math.</span>
        </h2>
        <p
          className="text-warm-gray-soft mt-[16px]"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--text-body-leading)",
            maxWidth: "60ch",
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
              i === 0 ? "left" : i === PACKAGES.length - 1 ? "right" : "center";
            return (
              <PricingCard key={pkg.slug} pkg={pkg} position={position} />
            );
          })}
        </div>
      </Container>

      {/* Footer strip */}
      <div
        className="mt-[24px] lg:mt-[24px]"
        style={{
          background: "var(--color-bone-warm)",
          borderTop: "0.5px solid var(--color-border-light)",
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
                  borderLeft: "0.5px solid var(--color-border-light)",
                  paddingLeft: "16px",
                  fontSize: "13px",
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
