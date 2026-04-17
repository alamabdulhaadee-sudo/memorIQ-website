"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterTab = "All" | "Weddings" | "Corporate" | "Celebrations";

interface GalleryItem {
  id: number;
  category: Exclude<FilterTab, "All">;
  aspect: "portrait" | "landscape" | "square";
  label: string;
  isVideo?: boolean;
}

// ---------------------------------------------------------------------------
// Placeholder data — swap with real photos in Phase 5
// ---------------------------------------------------------------------------

const ITEMS: GalleryItem[] = [
  { id: 1,  category: "Weddings",      aspect: "portrait",   label: "Wedding · The Pearle, Burlington" },
  { id: 2,  category: "Corporate",     aspect: "landscape",  label: "Brand activation · Toronto" },
  { id: 3,  category: "Celebrations",  aspect: "square",     label: "30th birthday · Mississauga" },
  { id: 4,  category: "Weddings",      aspect: "landscape",  label: "Wedding · Waterfall Estate, Vaughan" },
  { id: 5,  category: "Corporate",     aspect: "portrait",   label: "Product launch · Liberty Village" },
  { id: 6,  category: "Celebrations",  aspect: "landscape",  label: "Graduation · Markham" },
  { id: 7,  category: "Weddings",      aspect: "square",     label: "Wedding · Casa Loma, Toronto" },
  { id: 8,  category: "Corporate",     aspect: "landscape",  label: "Holiday party · Bay Street", isVideo: true },
  { id: 9,  category: "Celebrations",  aspect: "portrait",   label: "Anniversary · Oakville" },
  { id: 10, category: "Weddings",      aspect: "landscape",  label: "Wedding · Hacienda Sarria, Kitchener" },
  { id: 11, category: "Corporate",     aspect: "square",     label: "Conference · Metro Toronto Convention Centre" },
  { id: 12, category: "Celebrations",  aspect: "landscape",  label: "Sweet 16 · Brampton" },
];

function aspectClass(aspect: GalleryItem["aspect"]) {
  if (aspect === "portrait")  return "aspect-[3/4]";
  if (aspect === "landscape") return "aspect-[4/3]";
  return "aspect-square";
}

// ---------------------------------------------------------------------------
// Mid-scroll testimonial
// ---------------------------------------------------------------------------

function MidScrollTestimonial() {
  return (
    <div className="py-[80px] lg:py-[96px] border-y [border-color:var(--color-border-light)]">
      <Container size="narrow">
        <p
          className="text-[clamp(20px,2.5vw,28px)] font-medium tracking-[-0.02em] leading-[1.25] text-ink-soft"
        >
          &ldquo;I&rsquo;ve seen a lot of photo booths at events. This was the first one
          that actually looked like it belonged there. Our guests wouldn&rsquo;t leave it
          alone all night.&rdquo;
        </p>
        <p className="mt-[20px] text-[13px] text-warm-gray tracking-[0.02em]">
          — Sarah M., Wedding · ★★★★★
        </p>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery card
// ---------------------------------------------------------------------------

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}) {
  return (
    <button
      onClick={() => onClick(item)}
      className={[
        "group relative w-full overflow-hidden bg-bone-warm",
        "[border:0.5px_solid_var(--color-border-light)]",
        "rounded-[4px]",
        aspectClass(item.aspect),
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50",
      ].join(" ")}
      aria-label={`View ${item.label}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[8px]">
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray opacity-60">
          [PLACEHOLDER]
        </span>
        <span className="text-[11px] text-warm-gray opacity-50 px-[12px] text-center leading-[1.4]">
          {item.label}
        </span>
      </div>

      {item.isVideo && (
        <span
          className="absolute top-[10px] left-[10px] bg-clay text-ink text-[9px] font-medium tracking-[0.15em] uppercase px-[8px] py-[4px] rounded-[2px]"
          aria-label="Video clip"
        >
          VIDEO
        </span>
      )}

      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-150" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-[24px]"
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
      onClick={onClose}
    >
      <div
        className="relative max-w-[900px] w-full bg-bone-warm rounded-[4px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={[
            "w-full flex items-center justify-center bg-bone-warm",
            aspectClass(item.aspect),
            "max-h-[80vh]",
          ].join(" ")}
        >
          <div className="flex flex-col items-center gap-[8px]">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-warm-gray opacity-60">
              [PHOTO PLACEHOLDER]
            </span>
            <span className="text-[11px] text-warm-gray opacity-50">{item.label}</span>
          </div>
        </div>

        <div className="px-[24px] py-[16px] flex items-center justify-between [border-top:0.5px_solid_var(--color-border-light)]">
          <span className="text-[12px] text-warm-gray">{item.label}</span>
          <button
            onClick={onClose}
            className="text-[12px] text-warm-gray hover:text-ink-soft transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded"
          >
            Close ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter tabs + gallery (exported — used by the server page)
// ---------------------------------------------------------------------------

const TABS: FilterTab[] = ["All", "Weddings", "Corporate", "Celebrations"];

export function WorkGallery() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered =
    activeTab === "All"
      ? ITEMS
      : ITEMS.filter((i) => i.category === activeTab);

  const firstHalf  = filtered.slice(0, 6);
  const secondHalf = filtered.slice(6);

  return (
    <>
      {/* ── Filter tabs ── */}
      <div className="bg-bone sticky top-[60px] sm:top-[68px] z-20 [border-bottom:0.5px_solid_var(--color-border-light)]">
        <Container>
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  "flex-shrink-0 px-[20px] py-[16px] text-[12px] font-medium tracking-[0.1em] uppercase transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-inset",
                  activeTab === tab
                    ? "text-clay [border-bottom:1.5px_solid_var(--color-clay)]"
                    : "text-warm-gray hover:text-ink-soft [border-bottom:1.5px_solid_transparent]",
                ].join(" ")}
                aria-pressed={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Gallery first half ── */}
      <section className="bg-bone py-[64px] lg:py-[80px]">
        <Container size="wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {firstHalf.map((item) => (
              <GalleryCard key={item.id} item={item} onClick={setLightboxItem} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mid-scroll testimonial ── */}
      <MidScrollTestimonial />

      {/* ── Gallery second half ── */}
      {secondHalf.length > 0 && (
        <section className="bg-bone py-[64px] lg:py-[80px]">
          <Container size="wide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
              {secondHalf.map((item) => (
                <GalleryCard key={item.id} item={item} onClick={setLightboxItem} />
              ))}
            </div>

            <div className="mt-[48px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
              <p className="text-[12px] text-warm-gray tracking-[0.05em]">
                200+ events · 2024–2026 · Greater Toronto Area
              </p>
              <Button variant="secondary" surface="light" href="/">
                Back to homepage →
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* ── Lightbox ── */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </>
  );
}
