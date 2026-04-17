"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

const FILTER_TABS = ["All", "Weddings", "Corporate", "Celebrations"] as const;

interface GridItem {
  id: string;
  label: string;
  desktopCol: string;
  desktopRow: string;
  mobileCol: string;
  mobileRow: string;
  videoBadge: boolean;
}

const GRID_ITEMS: GridItem[] = [
  {
    id: "hero",
    label: "3:2 · Wedding reception",
    desktopCol: "span 3",
    desktopRow: "span 3",
    mobileCol: "span 2",
    mobileRow: "span 2",
    videoBadge: false,
  },
  {
    id: "wide",
    label: "3:1 · Corporate event",
    desktopCol: "span 3",
    desktopRow: "span 2",
    mobileCol: "span 2",
    mobileRow: "span 1",
    videoBadge: false,
  },
  {
    id: "portrait-1",
    label: "3:4 · Candid reaction",
    desktopCol: "span 1",
    desktopRow: "span 2",
    mobileCol: "span 1",
    mobileRow: "span 2",
    videoBadge: false,
  },
  {
    id: "square-1",
    label: "1:1 · Print close-up",
    desktopCol: "span 1",
    desktopRow: "span 1",
    mobileCol: "span 1",
    mobileRow: "span 1",
    videoBadge: false,
  },
  {
    id: "square-2",
    label: "1:1 · Booth setup",
    desktopCol: "span 1",
    desktopRow: "span 1",
    mobileCol: "span 1",
    mobileRow: "span 1",
    videoBadge: false,
  },
  {
    id: "landscape-1",
    label: "4:3 · Venue context",
    desktopCol: "span 2",
    desktopRow: "span 2",
    mobileCol: "span 2",
    mobileRow: "span 2",
    videoBadge: false,
  },
  {
    id: "portrait-2",
    label: "3:4 · Guest moment",
    desktopCol: "span 1",
    desktopRow: "span 2",
    mobileCol: "span 1",
    mobileRow: "span 2",
    videoBadge: false,
  },
  {
    id: "video",
    label: "4:3 · Event highlight",
    desktopCol: "span 2",
    desktopRow: "span 1",
    mobileCol: "span 2",
    mobileRow: "span 1",
    videoBadge: true,
  },
  {
    id: "square-3",
    label: "1:1 · Celebration",
    desktopCol: "span 1",
    desktopRow: "span 1",
    mobileCol: "span 1",
    mobileRow: "span 1",
    videoBadge: false,
  },
];

function GalleryFrame({ item }: { item: GridItem }) {
  return (
    <div
      className="relative overflow-hidden rounded-[4px]"
      style={{
        gridColumn: item.desktopCol,
        gridRow: item.desktopRow,
        background: "var(--color-ink-soft)",
        border: "0.5px solid var(--color-border-dark)",
      }}
    >
      {/* Placeholder label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-warm-gray font-medium uppercase tracking-[0.18em] text-center px-[8px]"
          style={{ fontSize: "11px" }}
        >
          {item.label}
        </span>
      </div>

      {/* Video badge */}
      {item.videoBadge && (
        <span
          className="absolute top-[10px] left-[10px] text-[10px] font-medium tracking-[0.2em] uppercase bg-clay text-ink px-[10px] py-[6px] rounded-[3px]"
        >
          Video
        </span>
      )}
    </div>
  );
}

export function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  return (
    <section
      className="pt-[56px] sm:pt-[80px] lg:pt-[96px] pb-[56px] sm:pb-[80px] lg:pb-[96px]"
      style={{ background: "var(--color-ink)" }}
    >
      {/* Section header */}
      <Container>
        <div className="flex flex-col gap-[24px] lg:flex-row lg:items-end lg:justify-between">
          {/* Left — label + headline */}
          <div>
            <SectionLabel index="04" label="The work" surface="dark" />
            <h2
              className="font-medium text-bone mt-[16px]"
              style={{
                fontSize: "var(--text-section)",
                letterSpacing: "var(--text-section-tracking)",
                lineHeight: "var(--text-section-leading)",
              }}
            >
              Evidence<span className="text-clay">,</span> not adjectives.
            </h2>
          </div>

          {/* Right — filter tabs */}
          <div className="flex gap-[2px] flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                aria-pressed={activeFilter === tab}
                className={[
                  "text-[11px] font-medium tracking-[0.18em] uppercase px-[14px] py-[8px] rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2",
                  activeFilter === tab
                    ? "bg-bone text-ink"
                    : "text-warm-gray hover:text-bone",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* Bento grid */}
      <Container className="mt-[48px] lg:mt-[64px]">
        <div
          className="grid grid-cols-2 auto-rows-[140px] gap-[8px] lg:grid-cols-3 lg:auto-rows-[160px]"
        >
          {GRID_ITEMS.map((item) => (
            <GalleryFrame key={item.id} item={item} />
          ))}
        </div>
      </Container>

      {/* Meta line + ghost CTA */}
      <Container className="mt-[32px]">
        <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-warm-gray">
            200+ events&nbsp;·&nbsp;2024–2026&nbsp;·&nbsp;Greater Toronto Area
          </p>
          <Button href="/work" variant="secondary" surface="dark">
            See the full archive →
          </Button>
        </div>
      </Container>
    </section>
  );
}
