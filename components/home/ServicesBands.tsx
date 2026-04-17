import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Band {
  index: string;
  category: string;
  subHeadline: string;
  body: string;
  meta: string;
  linkLabel: string;
  link: string;
  warmBg: boolean;
}

const BANDS: Band[] = [
  {
    index: "01",
    category: "Weddings",
    subHeadline: "For the couple who won't settle for a cliché reception.",
    body: "Custom templates matched to your palette. A setup that looks like part of the design, not an afterthought near the bathroom. Prints your guests actually take home.",
    meta: "From $400",
    linkLabel: "See wedding work →",
    link: "/work?filter=weddings",
    warmBg: false,
  },
  {
    index: "02",
    category: "Corporate",
    subHeadline: "For the brand that wants guests sharing, not scrolling.",
    body: "Branded overlays, logo integration, QR-code sharing, and a digital gallery your marketing team can actually use. Activations, product launches, holiday parties, conferences.",
    meta: "Custom quote",
    linkLabel: "See brand work →",
    link: "/work?filter=corporate",
    warmBg: true,
  },
  {
    index: "03",
    category: "Celebrations",
    subHeadline: "For the birthday that deserves better than an iPad on a stick.",
    body: "Milestone birthdays, graduations, anniversaries, engagements. DSLR-quality prints your mom will actually frame. No cheap plastic props.",
    meta: "From $400",
    linkLabel: "See celebration work →",
    link: "/work?filter=celebrations",
    warmBg: false,
  },
];

function BandRow({ band }: { band: Band }) {
  return (
    <div
      style={{
        background: band.warmBg ? "var(--color-bone-warm)" : "transparent",
        borderBottom: "0.5px solid var(--color-border-light)",
      }}
    >
      <Container>
        {/* Desktop: 3-column grid. Mobile: single column stack. */}
        <div
          className={[
            "flex flex-col gap-[24px] py-[32px]",
            "lg:grid lg:gap-[48px] lg:py-[40px]",
          ].join(" ")}
          style={{ gridTemplateColumns: "180px 1fr 220px" }}
        >
          {/* Column 1 — Label */}
          <div className="flex flex-row items-center gap-[12px] lg:flex-col lg:items-start lg:gap-0">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray leading-none">
              {band.index}
            </span>
            <span className="text-[13px] font-medium text-ink-soft tracking-[0.05em] uppercase lg:mt-[8px] leading-none">
              {band.category}
            </span>
          </div>

          {/* Column 2 — Content */}
          <div>
            <h3
              className="font-medium text-ink-soft"
              style={{
                fontSize: "var(--text-sub)",
                letterSpacing: "var(--text-sub-tracking)",
                lineHeight: "var(--text-sub-leading)",
              }}
            >
              {band.subHeadline}
            </h3>
            <p
              className="text-warm-gray-soft mt-[16px]"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--text-body-leading)",
                maxWidth: "60ch",
              }}
            >
              {band.body}
            </p>
          </div>

          {/* Column 3 — Meta */}
          <div className="flex flex-row items-center gap-[16px] lg:flex-col lg:items-start lg:gap-0">
            <p
              className="font-medium text-ink-soft"
              style={{
                fontSize: "var(--text-sub)",
                letterSpacing: "var(--text-sub-tracking)",
                lineHeight: "var(--text-sub-leading)",
              }}
            >
              {band.meta}
            </p>
            <a
              href={band.link}
              className="text-[13px] text-warm-gray leading-none lg:mt-[12px] transition-colors duration-150 hover:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 rounded-[2px]"
            >
              {band.linkLabel}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function ServicesBands() {
  return (
    <section className="bg-bone">
      {/* Section header */}
      <Container className="pt-[56px] sm:pt-[80px] lg:pt-[96px] pb-[48px]">
        <SectionLabel index="02" label="Who we build for" surface="light" />
        <h2
          className="font-medium text-ink-soft mt-[24px]"
          style={{
            fontSize: "var(--text-section)",
            letterSpacing: "var(--text-section-tracking)",
            lineHeight: "var(--text-section-leading)",
          }}
        >
          We don&apos;t do &ldquo;fun for all ages.&rdquo; We do{" "}
          <span className="text-clay">specific.</span>
        </h2>
      </Container>

      {/* Bands */}
      <div style={{ borderTop: "0.5px solid var(--color-border-light)" }}>
        {BANDS.map((band) => (
          <BandRow key={band.index} band={band} />
        ))}
      </div>

      {/* Bottom breathing room */}
      <div className="pb-[56px] sm:pb-[80px] lg:pb-[96px]" />
    </section>
  );
}
