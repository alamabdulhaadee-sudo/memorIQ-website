import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Testimonial {
  quote: string;
  name: string;
  eventType: string;
  stars: number;
  hero: boolean;
}

// DRAFT TESTIMONIALS — replace with real Google reviews before launch
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Our guests literally would not leave the booth. The print quality was unreal — everyone took their strips home and half of them posted to Instagram that night. Best vendor decision we made.",
    name: "Sarah M.",
    eventType: "Wedding",
    stars: 5,
    hero: true,
  },
  {
    quote:
      "MEMORIQ handled our product launch activation for 300 guests without a single hiccup. The branded overlay matched our deck perfectly and the QR sharing meant we had UGC within minutes.",
    name: "David L.",
    eventType: "Corporate Event",
    stars: 5,
    hero: false,
  },
  {
    quote:
      "My mom framed her photo strip. That tells you everything. The setup looked like it belonged at the venue and the attendant was amazing with the kids.",
    name: "Priya K.",
    eventType: "30th Birthday",
    stars: 5,
    hero: false,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div
      className="flex gap-[4px]"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="M6 0.5L7.545 4.385L11.708 4.755L8.727 7.345L9.635 11.427L6 9.2L2.365 11.427L3.273 7.345L0.292 4.755L4.455 4.385L6 0.5Z"
            fill="var(--color-clay)"
          />
        </svg>
      ))}
    </div>
  );
}

const heroTestimonial = TESTIMONIALS.find((t) => t.hero)!;
const supportingTestimonials = TESTIMONIALS.filter((t) => !t.hero);

export function Testimonials() {
  return (
    <section className="bg-bone pt-[56px] sm:pt-[80px] lg:pt-[96px] pb-[56px] sm:pb-[80px] lg:pb-[96px]">
      <Container>
        <SectionLabel index="06" label="What clients say" surface="light" />

        {/* Hero testimonial */}
        <div
          className="mt-[48px] pt-[40px]"
          style={{ borderTop: "0.5px solid var(--color-border-light)" }}
        >
          <StarRating count={heroTestimonial.stars} />
          <blockquote
            className="font-medium text-ink-soft mt-[24px]"
            style={{
              fontSize: "var(--text-section)",
              letterSpacing: "var(--text-section-tracking)",
              lineHeight: "1.1",
              maxWidth: "800px",
            }}
          >
            &ldquo;{heroTestimonial.quote}&rdquo;
          </blockquote>
          <p className="text-[13px] text-warm-gray mt-[20px]">
            {heroTestimonial.name}&nbsp;·&nbsp;{heroTestimonial.eventType}
          </p>
        </div>

        {/* Supporting testimonials */}
        <div
          className="mt-[40px]"
          style={{ borderTop: "0.5px solid var(--color-border-light)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px]">
            {supportingTestimonials.map((t, i) => (
              <div
                key={t.name}
                className={[
                  "pt-[32px] pb-[40px]",
                  i === 0 ? "sm:pr-[40px]" : "sm:pl-[40px]",
                ].join(" ")}
              >
                <StarRating count={t.stars} />
                <blockquote
                  className="font-medium text-ink-soft mt-[16px]"
                  style={{
                    fontSize: "var(--text-sub)",
                    letterSpacing: "var(--text-sub-tracking)",
                    lineHeight: "1.3",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="text-[13px] text-warm-gray mt-[16px]">
                  {t.name}&nbsp;·&nbsp;{t.eventType}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Google reviews link */}
        <div className="mt-[48px]">
          {/* TODO: replace with real Google reviews URL */}
          <a
            href="#"
            className="text-[13px] text-warm-gray transition-colors duration-150 hover:text-ink-soft"
          >
            Read more reviews on Google →
          </a>
        </div>
      </Container>
    </section>
  );
}
