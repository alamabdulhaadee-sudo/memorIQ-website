import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About — MEMORIQ Photo Booth Toronto",
  description:
    "MEMORIQ is a premium photo booth company based in Toronto, serving weddings, corporate events, and celebrations across the Greater Toronto Area.",
};

// ---------------------------------------------------------------------------
// Gear list data
// ---------------------------------------------------------------------------

const GEAR = [
  { category: "Camera", items: ["Canon DSLR body", "Prime lens (50mm equivalent)", "Backup body on-site"] },
  { category: "Lighting", items: ["Studio strobe (not ring flash)", "Diffused softbox", "Consistent exposure across sessions"] },
  { category: "Print", items: ["Dye-sublimation printer", "Archival-grade media", "Under 10-second print time"] },
  { category: "Software", items: ["Custom template engine", "Real-time QR delivery", "Private digital gallery"] },
];

const SERVICE_AREAS = [
  "Toronto", "Mississauga", "Brampton", "Vaughan",
  "Markham", "Richmond Hill", "Oakville", "Burlington",
  "Ajax", "Pickering", "Oshawa", "Milton",
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AboutPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="bg-ink py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="ABOUT" label="Who we are" surface="dark" />
          <h1
            className="mt-[20px] text-[clamp(44px,7vw,72px)] font-medium tracking-[-0.035em] leading-[0.98] text-bone"
          >
            Built by people who{" "}
            <br className="hidden sm:block" />
            actually <span className="text-clay">care</span> about events.
          </h1>
        </Container>
      </section>

      {/* ── Brand statement + founder portrait ── */}
      <section className="bg-bone py-[80px] lg:py-[96px]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[64px] items-start">
            {/* Text */}
            <div>
              <p className="text-[clamp(18px,2vw,22px)] font-medium text-ink-soft tracking-[-0.02em] leading-[1.35] mb-[28px]">
                MEMORIQ started because too many photo booths feel like an afterthought.
              </p>
              <div className="flex flex-col gap-[18px] text-[15px] text-warm-gray-soft leading-[1.6] max-w-[58ch]">
                <p>
                  An iPad on a stand in the corner. Blurry prints that go straight in the trash.
                  Props that look like they came from a dollar store. We built something different
                  — studio-quality gear, considered design, and a team that shows up early and
                  stays until the job is done.
                </p>
                <p>
                  We only serve the GTA because we think doing one region exceptionally well
                  beats spreading ourselves thin. Every event gets the same attention. Every
                  client gets direct communication and a team that actually picks up the phone.
                </p>
                <p>
                  We&rsquo;re based in Toronto. Available seven days a week, most weekends of the
                  year — though the good dates book out fast.
                </p>
              </div>

              <div className="mt-[40px]">
                <Button variant="primary" href="/book/date">
                  Check availability →
                </Button>
              </div>
            </div>

            {/* Founder portrait placeholder */}
            <div>
              <div
                className="w-full aspect-[3/4] max-w-[420px] rounded-[4px] bg-bone-warm flex flex-col items-center justify-center gap-[8px]"
                style={{ border: "0.5px solid var(--color-border-light)" }}
                aria-label="Founder portrait — placeholder"
              >
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray opacity-60">
                  [FOUNDER PORTRAIT]
                </span>
                <span className="text-[11px] text-warm-gray opacity-40">
                  Replace in Phase 5
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Gear list ── */}
      <section className="bg-bone-warm py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="GEAR" label="The equipment" surface="light" />
          <h2
            className="mt-[20px] text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-ink-soft mb-[48px]"
          >
            Studio hardware.<br />Event reliability.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            {GEAR.map((cat) => (
              <div
                key={cat.category}
                className="bg-bone rounded-[4px] p-[24px]"
                style={{ border: "0.5px solid var(--color-border-light)" }}
              >
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[16px]">
                  {cat.category}
                </p>
                <ul className="flex flex-col gap-[8px]">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-[8px] text-[13px] text-warm-gray-soft leading-[1.4]">
                      <span className="text-clay flex-shrink-0">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-[32px] text-[12px] text-warm-gray max-w-[52ch] leading-[1.5]">
            We don&rsquo;t rent the booth out to other operators. The same setup that showed up
            at last weekend&rsquo;s wedding shows up at your event.
          </p>
        </Container>
      </section>

      {/* ── Service area ── */}
      <section className="bg-ink py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="AREA" label="Where we work" surface="dark" />
          <h2
            className="mt-[20px] text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.035em] leading-[1] text-bone mb-[12px]"
          >
            Proudly serving the GTA.
          </h2>
          <p className="text-[14px] text-bone/60 mb-[48px] max-w-[52ch]">
            Within a 50km radius of Toronto. Events outside 30km may include a small
            travel fee — we&rsquo;ll confirm before you book.
          </p>

          {/* Area tags */}
          <div className="flex flex-wrap gap-[8px] mb-[48px]">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="px-[14px] py-[8px] rounded-[2px] text-[12px] font-medium tracking-[0.05em] text-bone/70"
                style={{ border: "0.5px solid var(--color-border-dark)" }}
              >
                {area}
              </span>
            ))}
            <span
              className="px-[14px] py-[8px] rounded-[2px] text-[12px] text-bone/40"
              style={{ border: "0.5px solid var(--color-border-dark)" }}
            >
              + surrounding areas
            </span>
          </div>

          {/* Map placeholder */}
          <div
            className="w-full h-[300px] lg:h-[400px] rounded-[4px] bg-ink flex items-center justify-center"
            style={{ border: "0.5px solid var(--color-border-dark-strong)" }}
            aria-label="GTA service area map — placeholder"
          >
            <div className="flex flex-col items-center gap-[8px]">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray opacity-60">
                [GTA MAP PLACEHOLDER]
              </span>
              <span className="text-[11px] text-warm-gray opacity-40">
                Replace with embedded map in Phase 5
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
