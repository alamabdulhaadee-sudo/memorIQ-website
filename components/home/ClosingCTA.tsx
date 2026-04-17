import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ClosingCTA() {
  return (
    <section
      className="relative overflow-hidden py-[80px] lg:py-[120px]"
      style={{ background: "var(--color-ink)" }}
    >
      {/* Background image at low opacity */}
      <div className="absolute inset-0 z-0">
        {/* [PLACEHOLDER — real event photo needed] */}
        <Image
          src="/images/placeholders/hero.jpg"
          alt=""
          fill
          priority={false}
          className="object-cover opacity-[0.15]"
          sizes="100vw"
        />
        {/* Gradient — fades ink in at top and bottom, photo shows through center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-ink) 0%, transparent 40%, transparent 60%, var(--color-ink) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Container>
          <div className="flex flex-col items-center">
            <h2
              className="font-medium text-bone text-center"
              style={{
                fontSize: "var(--text-display)",
                letterSpacing: "var(--text-display-tracking)",
                lineHeight: "var(--text-display-leading)",
              }}
            >
              Your date might still be{" "}
              <span className="text-clay">open.</span>
            </h2>

            <p
              className="text-warm-gray text-center mt-[24px]"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--text-body-leading)",
                maxWidth: "480px",
              }}
            >
              Weekends in peak season book 6–8 weeks out. Check the calendar —
              it&apos;s faster than a DM.
            </p>

            <div className="mt-[40px]">
              <Button
                href="/book/date"
                variant="primary"
                className="px-[40px] py-[18px] text-[14px]"
              >
                Check availability →
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
