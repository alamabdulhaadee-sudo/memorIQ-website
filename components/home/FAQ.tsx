"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "service-area",
    question: "What area do you serve?",
    answer:
      "We serve the entire Greater Toronto Area. Events outside a 30km radius may include a small travel fee — we'll confirm before you book.",
  },
  {
    id: "space",
    question: "How much space do you need?",
    answer:
      "About 8×8 feet of floor space and access to a standard power outlet. We'll confirm setup details with you after booking.",
  },
  {
    id: "customization",
    question: "Can we customize the photo template?",
    answer:
      "Always. Every booking includes a template designed to match your event's theme, colors, or branding.",
  },
  {
    id: "reschedule",
    question: "What happens if we need to reschedule?",
    answer:
      "We get it — life happens. Free rescheduling up to 14 days before your event, subject to new date availability.",
  },
  {
    id: "props",
    question: "Do you provide props?",
    answer:
      "Yes. We bring a curated collection of premium props — no cheap plastic glasses, no foam cowboy hats. You can also request specific items ahead of time.",
  },
  {
    id: "photo-delivery",
    question: "How do guests get their photos?",
    answer:
      "Instantly. Guests can print on-site, text the photo to their phone, share via QR code, or access a private digital gallery after the event.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "0.5px solid var(--color-border-light)" }}>
      {/* Trigger */}
      <button
        id={`faq-btn-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-[16px] py-[20px] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 rounded-[2px]"
      >
        <span className="text-[15px] font-medium text-ink-soft leading-[1.4]">
          {item.question}
        </span>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms ease",
            stroke: "var(--color-warm-gray)",
          }}
        >
          <polyline
            points="3,6 8,11 13,6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Answer panel — grid-template-rows trick for pure-CSS height animation */}
      <div
        id={`faq-panel-${item.id}`}
        role="region"
        aria-labelledby={`faq-btn-${item.id}`}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 150ms ease",
        }}
      >
        <div className="overflow-hidden">
          <p
            className="text-warm-gray-soft pb-[20px]"
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--text-body-leading)",
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section
      className="pt-[56px] sm:pt-[80px] lg:pt-[96px] pb-[56px] sm:pb-[80px] lg:pb-[96px]"
      style={{ background: "var(--color-bone-warm)" }}
    >
      <Container>
        <SectionLabel index="07" label="Common questions" surface="light" />

        <div
          className="mt-[40px]"
          style={{ borderTop: "0.5px solid var(--color-border-light)" }}
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openIds.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
