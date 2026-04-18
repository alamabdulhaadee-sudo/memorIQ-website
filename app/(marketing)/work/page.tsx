import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WorkGallery } from "@/components/work/WorkGallery";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memoriq.ca";

export const metadata: Metadata = {
  title: "Work — MEMORIQ Photo Booth Toronto",
  description:
    "Portfolio of MEMORIQ photo booth events across the Greater Toronto Area — weddings, corporate activations, and celebrations. Real events, no stock photos.",
  openGraph: {
    title: "Work — MEMORIQ Photo Booth Toronto",
    description:
      "Portfolio of MEMORIQ photo booth events across the Greater Toronto Area — weddings, corporate activations, and celebrations. Real events, no stock photos.",
    type: "website",
    url: `${BASE_URL}/work`,
    siteName: "MEMORIQ",
    locale: "en_CA",
    // TODO: Replace with a unique OG image (1200×630) for the work page before launch
    images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
  },
};

export default function WorkPage() {
  return (
    <>
      {/* ── Page header ── */}
      <section className="bg-bone py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="WORK" label="The archive" surface="light" />
          <h1
            className="mt-[20px] text-[clamp(44px,7vw,72px)] font-medium tracking-[-0.035em] leading-[0.98] text-ink-soft"
          >
            Evidence,<br />
            not adjectives.
          </h1>
          <p className="mt-[24px] text-[15px] text-warm-gray-soft leading-[1.55] max-w-[52ch]">
            Every photo here is a real event. No staged shots, no stock images,
            no studio fluff. Scroll, filter, and see what we actually produce.
          </p>
        </Container>
      </section>

      {/* ── Interactive gallery (client component) ── */}
      <WorkGallery />
    </>
  );
}
