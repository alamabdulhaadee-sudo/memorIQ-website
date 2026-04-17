import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

const HEADING_ID = "experience-preview-heading";

export function ExperiencePreview() {
  return (
    <section
      className="bg-bone"
      style={{ paddingTop: "clamp(56px, 8vw, 96px)", paddingBottom: "clamp(56px, 8vw, 96px)" }}
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-[48px] lg:gap-[64px] items-start">

          {/* ── Text column (below images on mobile, left on desktop) ──── */}
          <div className="order-2 lg:order-1 flex flex-col">
            <SectionLabel index="01" label="More than a booth" surface="light" />

            <h2
              id={HEADING_ID}
              className="font-medium text-ink-soft mt-[32px]"
              style={{
                fontSize: "var(--text-section)",
                letterSpacing: "var(--text-section-tracking)",
                lineHeight: "var(--text-section-leading)",
              }}
            >
              Built like a studio.{" "}
              <br className="hidden sm:block" />
              Runs like a party.
            </h2>

            <p
              className="text-warm-gray-soft mt-[24px]"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--text-body-leading)",
                maxWidth: "60ch",
              }}
            >
              MEMORIQ delivers a studio-grade photo experience powered by a
              professional DSLR, proper studio lighting, and custom-designed
              templates that actually match the event. Every detail is
              intentional — from the print paper to the backdrop.
            </p>

            <p
              className="text-warm-gray mt-[32px] font-medium uppercase tracking-[0.18em] leading-none"
              style={{ fontSize: "11px" }}
            >
              Shot on Canon DSLR&nbsp;·&nbsp;Studio lighting&nbsp;·&nbsp;Instant prints
            </p>
          </div>

          {/* ── Image grid (top on mobile, right on desktop) ──────────── */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-[8px]">

              {/* Large frame — spans full width */}
              <div className="relative col-span-2 aspect-[4/3] rounded-[4px] overflow-hidden bg-bone-warm">
                {/* [PLACEHOLDER — real event photo needed] */}
                <Image
                  src="/images/placeholders/hero.jpg"
                  alt="MEMORIQ photo booth setup at a GTA event, showing studio lighting and DSLR rig"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              {/* Small frame 1 — portrait */}
              <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden bg-bone-warm">
                {/* [PLACEHOLDER — real event photo needed] */}
                <Image
                  src="/images/placeholders/hero.jpg"
                  alt="Guests at a MEMORIQ photo booth session"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              </div>

              {/* Small frame 2 — square */}
              <div className="relative aspect-square rounded-[4px] overflow-hidden bg-bone-warm">
                {/* [PLACEHOLDER — real event photo needed] */}
                <Image
                  src="/images/placeholders/hero.jpg"
                  alt="Close-up of an instant print from a MEMORIQ event"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              </div>

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
