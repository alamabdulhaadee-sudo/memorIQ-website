import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const TRUST_ITEMS = [
  { label: "Rated", value: "5.0 / Google" },
  { label: "Events", value: "200+ served" },
  { label: "Hardware", value: "DSLR · Pro lighting" },
  { label: "Area", value: "Greater Toronto" },
] as const;

export function Hero() {
  return (
    <section
      className={[
        "relative overflow-hidden bg-ink",
        // Bleed behind sticky nav (counteracts layout.tsx wrapper padding)
        "-mt-[60px] sm:-mt-[68px]",
        // Height: natural on mobile, 85vh minimum on desktop
        "flex flex-col justify-between",
        "min-h-[100svh] lg:min-h-[85vh]",
      ].join(" ")}
    >
      {/* ── Background image (low-opacity overlay) ──────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* [PLACEHOLDER — real event photo needed] */}
        <Image
          src="/images/placeholders/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.18]"
          sizes="100vw"
        />
        {/* Gradient fade at bottom so trust bar text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, var(--color-ink) 100%)",
          }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1">
        <Container className="flex flex-col gap-2xl pt-[calc(60px+48px)] sm:pt-[calc(68px+56px)] lg:pt-[calc(68px+80px)] pb-4xl">

          {/* Category label */}
          <p
            className="text-[11px] font-medium tracking-[0.18em] uppercase text-warm-gray leading-none"
            aria-label="MEMORIQ — Photo Booth, Greater Toronto Area, established 2024"
          >
            — PHOTO BOOTH&nbsp;/&nbsp;GTA&nbsp;/&nbsp;EST.&nbsp;2024
          </p>

          {/* Display headline */}
          <h1
            className="font-medium text-bone"
            style={{
              fontSize: "var(--text-display)",
              letterSpacing: "var(--text-display-tracking)",
              lineHeight: "var(--text-display-leading)",
            }}
          >
            Events are loud.
            <br />
            Your memories
            <br />
            should be{" "}
            <span className="text-clay">louder.</span>
          </h1>

          {/* Subline */}
          <p
            className="text-warm-gray-soft leading-[1.55]"
            style={{
              fontSize: "var(--text-body)",
              maxWidth: "480px",
            }}
          >
            A photo booth engineered for the moment. DSLR optics, studio
            lighting, instant prints — built for weddings, brands, and
            everything worth remembering across the GTA.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-lg flex-wrap">
            <Button href="/book" variant="primary">
              Check availability →
            </Button>
            <Button href="/work" variant="secondary" surface="dark">
              See the work
            </Button>
          </div>

        </Container>
      </div>

      {/* ── Trust bar (pinned to bottom) ─────────────────────────────── */}
      <div
        className="relative z-10 w-full"
        style={{ borderTop: "0.5px solid var(--color-border-dark-strong)" }}
      >
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {TRUST_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className={[
                  "flex flex-col gap-[6px] py-lg",
                  // Hairline right border on all except the last column
                  i < TRUST_ITEMS.length - 1
                    ? "[border-right:0.5px_solid_var(--color-border-dark-strong)] pr-lg"
                    : "",
                  // Left padding on every cell except the first
                  i > 0 ? "pl-lg" : "",
                  // On mobile (2-col): bottom border on the first row
                  i < 2
                    ? "[border-bottom:0.5px_solid_var(--color-border-dark-strong)] sm:border-b-0"
                    : "",
                ].join(" ")}
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-warm-gray leading-none">
                  {item.label}
                </span>
                <span className="text-[13px] font-medium text-bone leading-none">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
