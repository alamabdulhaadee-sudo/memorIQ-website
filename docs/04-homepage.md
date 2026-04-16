# 04 — Homepage

The homepage is 8 sections, bookended by dark hero and dark closing CTA with light sections in the middle. This creates visual rhythm and makes the CTAs at both ends unmissable.

## Section order

1. Hero (dark)
2. Experience preview / work intro (light)
3. Services bands — who we build for (light, with one alternating band)
4. How it works (light)
5. Gallery (dark)
6. Pricing (light)
7. Testimonials (light)
8. FAQ (light)
9. Closing CTA (dark)
10. Footer (dark)

---

## Section 1: Hero

**Background:** `--color-ink` (#0E0E10), full-bleed.

**Content order (top to bottom):**
1. Sticky nav bar with hairline bottom border
2. Category label: `— PHOTO BOOTH / GTA / EST. 2024`
3. Display headline (3 lines): "Events are loud. / Your memories / should be louder." with "louder." in clay
4. Subline paragraph (max-width 480px)
5. Primary CTA (clay pill) + secondary ghost link
6. Trust bar: 4-column grid with hairline dividers, showing Rating, Events, Hardware, Area

**Height:** Minimum 85vh on desktop. Mobile can be shorter — prioritize the headline and CTA fitting without scroll.

**Technical notes:**
- Background can be solid ink, or ink with a subtle hero photo at very low opacity (15–25%) if the photo is strong enough
- Trust bar stays pinned to the bottom of the hero, not floating
- The headline must be the largest text on the entire site

---

## Section 2: Experience preview

**Background:** `--color-bone` (#F4F1EA)
**Label:** `— 01 / MORE THAN A BOOTH`

**Content:**
- Asymmetric image grid (1 large + 2–3 smaller)
- Short paragraph (max 3 sentences) — what differentiates MEMORIQ
- Micro-caption below paragraph: `Shot on Canon DSLR · Studio lighting · Instant prints`

**Layout:**
- Two-column on desktop: text on left (~40% width), image grid on right (~60%)
- Single-column on mobile, image grid on top

**Copy:** See `docs/06-content.md` section 2.

---

## Section 3: Services bands — who we build for

**Background:** `--color-bone` with middle band in `--color-bone-warm`
**Label:** `— 02 / WHO WE BUILD FOR`
**Section headline:** "We don't do 'fun for all ages.' We do specific." with "specific" in clay

**Structure:** Three horizontal bands, stacked. Each band is a 3-column grid:
- Column 1 (180px): label `01` + category name
- Column 2 (flex): sub-headline + body copy
- Column 3 (220px): starting price + link to filtered gallery

**The three bands:**
1. Weddings — "For the couple who won't settle for a cliché reception."
2. Corporate — "For the brand that wants guests sharing, not scrolling."
3. Celebrations — "For the birthday that deserves better than an iPad on a stick."

Full copy in `docs/06-content.md` section 3.

---

## Section 4: How it works

**Background:** `--color-bone`
**Label:** `— 03 / HOW IT WORKS`
**Section headline:** "Book the booth in under 5 minutes."

**Structure:** Three horizontal columns, each containing:
- Large numeral (01, 02, 03) in display type
- Short step title
- One-sentence description

**The three steps:**
1. **Pick your date.** — "Check the live calendar. If it's open, it's bookable."
2. **Choose your package.** — "Three tiers, transparent pricing, no quote-gated nonsense."
3. **Lock it in.** — "A $100 deposit reserves your date. We handle everything else."

**Below:** Centered primary CTA — "Check availability →"

---

## Section 5: Gallery

**Background:** `--color-ink` — this is the one "dark island" in the middle of the light sections, and it makes the photography pop.
**Label:** `— 04 / THE WORK`
**Section headline:** "Evidence, not adjectives." with the comma in clay for visual punctuation

**Structure:**
- Filter tabs: All / Weddings / Corporate / Celebrations (top right)
- Asymmetric grid with mixed aspect ratios:
  - 1 hero frame (3:2, spans 3 cols × 3 rows)
  - 1 wide frame (3:1, spans 3 cols × 2 rows)
  - Small squares, portrait frames, and wide landscape frames filling in
  - One video slot marked with a small clay "VIDEO" badge
- Total: roughly 8–10 frames visible
- Below grid: meta line ("200+ events · 2024–2026 · GTA") + ghost CTA ("See the full archive →")

**Photography requirements:**
- Every image edited to the same preset for consistency
- Warm-toned, not cool/blue
- Mix of: booth setup shots, print close-ups, candid guest reactions, and venue context
- Minimum 1600px wide per image for retina displays

---

## Section 6: Pricing

**Background:** `--color-bone`
**Label:** `— 05 / PRICING`
**Section headline:** "Three ways to book us. No hidden math." with "hidden math" in clay

**Structure:**
- Three pricing cards, center card elevated with negative vertical margin (~8px)
- Center card uses `--color-ink` background with bone text (inverts the palette for emphasis)
- Center card has "MOST BOOKED" clay badge pinned to top-left corner
- Each card: label → price → hours → divider → features list → CTA

**The three tiers:**
1. Essential — $400 — 2 hours
2. Signature — $550 — 3 hours (most booked)
3. Full Takeover — $700 — 4 hours

Detailed card content in `docs/06-content.md` section 6.

**Below cards:** Full-width strip with custom quote CTA on left and meta info on right (free rescheduling, deposit amount).

---

## Section 7: Testimonials

**Background:** `--color-bone`
**Label:** `— 06 / WHAT CLIENTS SAY`

**Structure (Bold Contemporary treatment):**
- One hero testimonial displayed large (pull-quote style, editorial scale)
- Two smaller supporting testimonials in a 2-column grid below
- Each has: the quote (2–3 sentences max), client first name + last initial, event type, star rating

**No carousels.** All three testimonials visible at once.

**Below:** Small ghost link "Read more reviews on Google →"

---

## Section 8: FAQ

**Background:** `--color-bone-warm` — differentiates this section slightly
**Label:** `— 07 / COMMON QUESTIONS`

**Structure:**
- Accordion, all collapsed by default
- 6 questions max
- Click to expand, smooth transition

**Questions (see `docs/06-content.md` for answers):**
1. What area do you serve?
2. How much space do you need?
3. Can we customize the photo template?
4. What happens if we need to reschedule?
5. Do you provide props?
6. How do guests get their photos?

---

## Section 9: Closing CTA

**Background:** `--color-ink`, optionally with a subtle hero photo at low opacity
**No label** — this section breaks the pattern intentionally

**Content:**
- Display headline: "Your date might still be open." (with "open" in clay)
- Subline: "Weekends in peak season book 6–8 weeks out. Check the calendar — it's faster than a DM."
- Primary CTA: "Check availability →" (large, centered)

**This is the last chance to convert.** The button here should be the most visually prominent CTA on the page after the hero.

---

## Section 10: Footer

Structure documented in `docs/03-sitemap.md`.

## CTA placement audit

"Check availability" primary CTA must appear:
1. Sticky header (always visible)
2. Hero section
3. After "How it works"
4. After pricing (implicit — each tier has its own select button)
5. Closing CTA section
6. Footer

That's 6 touchpoints. No matter where a visitor is on the page, the action is one click away.
