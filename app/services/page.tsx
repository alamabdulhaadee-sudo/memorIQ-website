import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services & Pricing — MEMORIQ Photo Booth Toronto",
  description:
    "Detailed packages, add-ons, and pricing for MEMORIQ photo booth rentals across the Greater Toronto Area. Three tiers, transparent pricing, no quote-gated nonsense.",
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PACKAGES = [
  {
    index: "01",
    name: "Essential",
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
    href: "/book/date?package=essential",
    elevated: false,
  },
  {
    index: "02",
    name: "Signature",
    price: "$550",
    meta: "3 hours · the one most people want",
    badge: "MOST BOOKED",
    features: [
      "Everything in Essential",
      "Custom template design",
      "Premium backdrop library",
      "Digital gallery post-event",
      "GIF + boomerang mode",
    ],
    cta: "Select signature →",
    href: "/book/date?package=signature",
    elevated: true,
  },
  {
    index: "03",
    name: "Full Takeover",
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
    href: "/book/date?package=full-takeover",
    elevated: false,
  },
] as const;

const ADD_ONS = [
  { name: "Extra hour",            price: "$100 / hr",  description: "Extend your booking in one-hour increments." },
  { name: "Custom backdrop",       price: "$75",         description: "We source or build a backdrop matched to your color story." },
  { name: "Second attendant",      price: "$80",         description: "For larger events (200+ guests) where the line needs managing." },
  { name: "QR code sharing",       price: "Included",    description: "Every guest can text or scan to get their digital copy instantly." },
  { name: "Branded overlay",       price: "$50",         description: "Logo, tagline, or color-matched frame for corporate activations." },
  { name: "Guest book with prints",price: "Incl. in FT", description: "Printed copies placed in a high-quality keepsake book on-site." },
  { name: "Video/boomerang mode",  price: "Incl. in SIG+",description: "GIF and boomerang loops delivered to digital gallery." },
  { name: "Travel (outside 30km)", price: "TBD",          description: "We serve the full GTA. Travel fee confirmed before booking." },
];

const TIMELINE = [
  {
    step: "01",
    title: "You book online.",
    body: "Pick your date, choose a package, drop a $100 deposit. Takes under five minutes. We confirm within the hour.",
  },
  {
    step: "02",
    title: "We do the pre-event work.",
    body: "Two weeks out, we lock in your template design, backdrop choice, and any add-ons. One call, thirty minutes.",
  },
  {
    step: "03",
    title: "We arrive early.",
    body: "Our team shows up one hour before your event start time. Full setup, test shots, clean layout — before a single guest walks in.",
  },
  {
    step: "04",
    title: "The booth runs all night.",
    body: "Unlimited sessions, instant prints, QR sharing — all managed by a dedicated on-site attendant.",
  },
  {
    step: "05",
    title: "We pack out. You get the gallery.",
    body: "We teardown without drama. Your private digital gallery goes live within 24 hours. Every shot, full resolution.",
  },
];

const FAQ = [
  {
    q: "What's included in every package?",
    a: "Pro setup, a dedicated on-site attendant, unlimited sessions during your booking window, instant digital sharing, and teardown. The DSLR, studio lighting, and at least one standard backdrop are always included.",
  },
  {
    q: "Can I extend on the day?",
    a: "If our calendar allows, yes — at $100 per additional hour. Message us when you book so we block the option for your date.",
  },
  {
    q: "How far in advance should I book?",
    a: "Peak season (June–October) books 6–8 weeks out. Off-peak, two to three weeks is usually fine. Check the live calendar — if a date is open, you can lock it right now.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free rescheduling up to 14 days before your event, subject to availability. Cancellations forfeit the $100 deposit.",
  },
  {
    q: "Do you handle corporate invoicing?",
    a: "Yes. Email us before booking and we'll set up a custom quote with an invoice workflow instead of the standard deposit flow.",
  },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function PackageCard({ pkg }: { pkg: (typeof PACKAGES)[number] }) {
  if (pkg.elevated) {
    return (
      <div
        className="relative rounded-[4px] bg-ink p-[32px] lg:p-[40px] flex flex-col lg:-mt-[24px] lg:-mb-[24px]"
        style={{ border: "0.5px solid var(--color-border-dark)" }}
      >
        {"badge" in pkg && pkg.badge && (
          <span className="self-start mb-[20px] bg-clay text-ink text-[9px] font-medium tracking-[0.15em] uppercase px-[8px] py-[4px] rounded-[2px]">
            {pkg.badge}
          </span>
        )}
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[8px]">
          {pkg.index} / {pkg.name.toUpperCase()}
        </p>
        <p className="text-[clamp(36px,4vw,48px)] font-medium tracking-[-0.03em] leading-[1] text-bone mb-[4px]">
          {pkg.price}
        </p>
        <p className="text-[12px] text-warm-gray mb-[28px]">{pkg.meta}</p>
        <ul className="flex flex-col gap-[12px] mb-[32px] flex-1">
          {pkg.features.map((f) => (
            <li key={f} className="flex items-start gap-[10px] text-[14px] text-bone/80 leading-[1.4]">
              <span className="text-clay mt-[1px] flex-shrink-0">–</span>
              {f}
            </li>
          ))}
        </ul>
        <Button variant="primary" href={pkg.href} className="w-full justify-center">
          {pkg.cta}
        </Button>
      </div>
    );
  }

  return (
    <div
      className="rounded-[4px] bg-bone p-[32px] lg:p-[40px] flex flex-col"
      style={{ border: "0.5px solid var(--color-border-light)" }}
    >
      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[8px]">
        {pkg.index} / {pkg.name.toUpperCase()}
      </p>
      <p className="text-[clamp(36px,4vw,48px)] font-medium tracking-[-0.03em] leading-[1] text-ink-soft mb-[4px]">
        {pkg.price}
      </p>
      <p className="text-[12px] text-warm-gray mb-[28px]">{pkg.meta}</p>
      <ul className="flex flex-col gap-[12px] mb-[32px] flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-[10px] text-[14px] text-warm-gray-soft leading-[1.4]">
            <span className="text-clay mt-[1px] flex-shrink-0">–</span>
            {f}
          </li>
        ))}
      </ul>
      <Button variant="secondary" surface="light" href={pkg.href} className="w-full justify-center">
        {pkg.cta}
      </Button>
    </div>
  );
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  return (
    <details
      className="group [border-bottom:0.5px_solid_var(--color-border-light)] last:border-b-0"
    >
      <summary className="flex items-center justify-between gap-[16px] py-[20px] cursor-pointer list-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded">
        <span className="text-[15px] font-medium text-ink-soft leading-[1.3]">{q}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="flex-shrink-0 text-warm-gray transition-transform duration-150 group-open:rotate-180"
          aria-hidden="true"
        >
          <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <p className="pb-[20px] text-[14px] text-warm-gray-soft leading-[1.55] max-w-[60ch]">
        {a}
      </p>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ServicesPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="bg-bone py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="SERVICES" label="What we offer" surface="light" />
          <h1
            className="mt-[20px] text-[clamp(44px,7vw,72px)] font-medium tracking-[-0.035em] leading-[0.98] text-ink-soft"
          >
            Three ways to book us.{" "}
            <br />
            No <span className="text-clay">hidden math.</span>
          </h1>
          <p className="mt-[24px] text-[15px] text-warm-gray-soft leading-[1.55] max-w-[52ch]">
            Every package includes pro setup, a dedicated attendant, unlimited sessions,
            and instant digital sharing. What changes is how long we stay and how far we
            push the details.
          </p>
        </Container>
      </section>

      {/* ── Pricing cards ── */}
      <section className="bg-bone-warm py-[80px] lg:py-[96px]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[12px] items-start">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.index} pkg={pkg} />
            ))}
          </div>

          {/* Footer strip */}
          <div
            className="mt-[32px] lg:mt-[56px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] rounded-[4px] px-[24px] py-[18px]"
            style={{ border: "0.5px solid var(--color-border-light)" }}
          >
            <p className="text-[13px] text-warm-gray-soft">
              Corporate or large event?{" "}
              <a href="/contact" className="text-clay hover:underline">
                Build a custom package →
              </a>
            </p>
            <p className="text-[12px] text-warm-gray">
              Free rescheduling · 14 days &nbsp;·&nbsp; $100 deposit locks your date
            </p>
          </div>
        </Container>
      </section>

      {/* ── Add-ons ── */}
      <section className="bg-bone py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="ADD-ONS" label="Extras" surface="light" />
          <h2
            className="mt-[20px] text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-ink-soft mb-[48px]"
          >
            Build it exactly right.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] [background:var(--color-border-light)]">
            {ADD_ONS.map((addon) => (
              <div
                key={addon.name}
                className="bg-bone p-[24px] lg:p-[28px]"
              >
                <div className="flex items-start justify-between gap-[16px] mb-[8px]">
                  <p className="text-[14px] font-medium text-ink-soft">{addon.name}</p>
                  <p className="text-[13px] font-medium text-clay flex-shrink-0">{addon.price}</p>
                </div>
                <p className="text-[13px] text-warm-gray-soft leading-[1.5]">{addon.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── What to expect timeline ── */}
      <section className="bg-ink py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="PROCESS" label="What to expect" surface="dark" />
          <h2
            className="mt-[20px] text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-bone mb-[56px]"
          >
            Booking to booth in five steps.
          </h2>

          <div className="flex flex-col gap-0">
            {TIMELINE.map((item, i) => (
              <div
                key={item.step}
                className={[
                  "grid grid-cols-[64px_1fr] gap-[24px] py-[28px]",
                  i < TIMELINE.length - 1
                    ? "[border-bottom:0.5px_solid_var(--color-border-dark)]"
                    : "",
                ].join(" ")}
              >
                <p className="text-[clamp(28px,3vw,36px)] font-medium tracking-[-0.03em] text-warm-gray leading-[1] self-start pt-[2px]">
                  {item.step}
                </p>
                <div>
                  <p className="text-[16px] font-medium text-bone mb-[8px]">{item.title}</p>
                  <p className="text-[14px] text-bone/60 leading-[1.55] max-w-[52ch]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[56px]">
            <Button variant="primary" href="/book/date">
              Check availability →
            </Button>
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-bone-warm py-[80px] lg:py-[96px]">
        <Container size="narrow">
          <SectionLabel index="FAQ" label="Common questions" surface="light" />
          <h2
            className="mt-[20px] text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-ink-soft mb-[48px]"
          >
            Before you book.
          </h2>

          <div style={{ border: "0.5px solid var(--color-border-light)" }} className="rounded-[4px] px-[24px] divide-y-0">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>

          <p className="mt-[32px] text-[13px] text-warm-gray">
            Still have questions?{" "}
            <a href="/contact" className="text-clay hover:underline">
              Contact us →
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
