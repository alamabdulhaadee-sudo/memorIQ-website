import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://memoriq.ca";

export const metadata: Metadata = {
  title: "Contact — MEMORIQ Photo Booth Toronto",
  description:
    "Questions about booking? Contact MEMORIQ Photo Booth. We serve the Greater Toronto Area and reply within 4 hours.",
  openGraph: {
    title: "Contact — MEMORIQ Photo Booth Toronto",
    description:
      "Questions about booking? Contact MEMORIQ Photo Booth. We serve the Greater Toronto Area and reply within 4 hours.",
    type: "website",
    url: `${BASE_URL}/contact`,
    siteName: "MEMORIQ",
    locale: "en_CA",
    // TODO: Replace with a unique OG image (1200×630) for the contact page before launch
    images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="bg-bone py-[80px] lg:py-[96px]">
        <Container>
          <SectionLabel index="CONTACT" label="Get in touch" surface="light" />
          <h1
            className="mt-[20px] text-[clamp(44px,7vw,72px)] font-medium tracking-[-0.035em] leading-[0.98] text-ink-soft"
          >
            Got a question?{" "}
            <span className="text-clay">Ask.</span>
          </h1>
          <p className="mt-[24px] text-[15px] text-warm-gray-soft leading-[1.55] max-w-[48ch]">
            We reply within 4 hours, most days faster. For urgent event questions,
            the phone is fastest.
          </p>
        </Container>
      </section>

      {/* ── Form + contact info ── */}
      <section className="bg-bone pb-[96px] lg:pb-[120px]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[64px] lg:gap-[80px] items-start">
            {/* Form card */}
            <div
              className="rounded-[4px] p-[32px] lg:p-[40px]"
              style={{ border: "0.5px solid var(--color-border-light)" }}
            >
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-[40px]">
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[16px]">
                  Direct
                </p>
                <div className="flex flex-col gap-[12px]">
                  <a
                    href="mailto:hello@memoriq.co"
                    className="text-[14px] text-ink-soft hover:text-clay transition-colors duration-150"
                  >
                    hello@memoriq.co
                  </a>
                  <a
                    href="tel:+1XXXXXXXXXX"
                    className="text-[14px] text-ink-soft hover:text-clay transition-colors duration-150"
                  >
                    (XXX) XXX-XXXX
                  </a>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray mb-[16px]">
                  Follow
                </p>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-ink-soft hover:text-clay transition-colors duration-150"
                >
                  @memoriq ↗
                </a>
                <p className="mt-[8px] text-[12px] text-warm-gray leading-[1.5]">
                  DMs are open but email is faster for booking questions.
                </p>
              </div>

              <div
                className="rounded-[4px] px-[20px] py-[18px] bg-bone-warm"
                style={{ border: "0.5px solid var(--color-border-light)" }}
              >
                <p className="text-[12px] font-medium text-ink-soft mb-[4px]">Ready to book?</p>
                <p className="text-[12px] text-warm-gray leading-[1.5] mb-[16px]">
                  Skip the form — check the live calendar and lock your date directly.
                </p>
                <Button variant="primary" href="/book/date" className="w-full justify-center">
                  Check availability →
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
