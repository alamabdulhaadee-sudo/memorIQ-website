# 08 — Booking Flow Visual Implementation Notes

These notes supplement docs/05-booking-flow.md with specific visual decisions from the design mockups. Read BOTH files when building booking flow components.

---

## Step 01 — Date: Calendar Visual Spec

### Layout
- Two-column on desktop: left column (~40%) has context, right column (~60%) has the calendar
- Mobile: single column, context on top, calendar below

### Left column content (top to bottom)
1. Step label: `STEP 01 / 05` — 10px, letter-spacing 0.2em, color warm-gray
2. Display headline: `When's the big day?` — 44px, font-weight 500, letter-spacing -0.035em, color ink-soft
3. Sub-copy paragraph — 14px, color warm-gray-soft, max-width 360px
4. Legend with three items, each with a 14×14px colored square:
   - Clay (#C65D3F) square → "Available — book instantly"
   - Ink (#0E0E10) square with diagonal hatching → "Limited — daytime only"
   - Muted gray square → "Booked — try a nearby date"
5. Callout box: clay-tinted background (rgba(198,93,63,0.08)), 2px left border in clay, contains "Heads up." bold + urgency message

### Right column: Calendar
- Month/year header: `June 2026` at 22px font-weight 500, with prev/next chevrons in 32px pill-shaped ghost buttons
- Day-of-week row: SUN MON TUE WED THU FRI SAT — 10px, letter-spacing 0.15em, warm-gray
- Date grid: 7 columns, each cell is square (aspect-ratio: 1), 4px gap between cells
- Cell styling by status:
  - **Available:** background clay (#C65D3F), text ink (#0E0E10), font-weight 500, border-radius 4px
  - **Limited:** background ink (#0E0E10) with diagonal stripe overlay (repeating-linear-gradient 135deg, bone lines), text bone, border-radius 4px
  - **Booked:** background rgba(26,22,19,0.06), text rgba(26,22,19,0.4), border-radius 4px
  - **Past:** no background, text very light gray
  - **Selected:** background ink (#0E0E10), 2px border clay, text bone, border-radius 4px
  - **Today (if visible):** no special treatment beyond its availability status

### Selection confirmation bar
- Appears below the calendar grid when a date is selected
- Background ink (#0E0E10), text bone, border-radius 4px, padding 16px 20px
- Left side: label "SELECTED" at 11px letter-spacing 0.15em warm-gray-50 + date formatted as "Friday, June 19 · 2026" at 15px font-weight 500
- Right side: primary CTA "Continue →" in clay pill button

---

## Step 02 — Package: Card Visual Spec

### Layout
- Same two-column pattern: left context, right interactive

### Right column: Package cards
- Three cards identical to homepage Pricing section cards
- Radio-style selection: clicking a card selects it
- Selected card: 2px clay border on all four sides (overrides the seam-collapsing border logic used on the homepage)
- Signature card pre-selected by default
- "Not sure? Contact us for a quick consult →" link below cards

### Card layout in the right column
- Cards stack **vertically** (single column), not in a 3-column grid.
- Rationale: the right column is ~60% viewport width. A 3-column mini-grid at that width produces cramped cards. Stacked full-width cards are more readable and thumb-friendly on mobile.
- This differs from the homepage Pricing section, which uses a 3-column grid at full container width.

### Component reuse
- `PackageCard` (`components/ui/PackageCard.tsx`) is the shared component used by both the homepage and this step.
- Pass `mode="booking"` here; `mode="homepage"` on the homepage. The `position` prop (seam collapsing) only applies in homepage mode.

---

## Step 04 — Customize: Live Summary Spec

### Desktop
- Content area + sticky sidebar on the right
- Sidebar shows: selected package name, list of selected add-ons with prices, subtotal, deposit due today ($100), remaining balance

### Mobile
- Sticky bottom bar (not sidebar) showing: package name + running total + "View details" expandable

---

## Step 05 — Pay: Trust Signal Placement

### Payment area
- Left column: order summary with line items
- Right column: Stripe Elements card input
- Below Stripe input: small lock icon SVG + "Secure payment powered by Stripe" in 12px warm-gray
- Accepted card icons (Visa, Mastercard, Amex) as small SVGs
- Link to refund/reschedule policy (opens modal, not new page)

---

## Confirmation screen

### Not a "step" — separate visual treatment
- No step indicator, no close button
- Display headline: "You're all set." — large, centered
- Sub-copy below
- Booking summary in a card (date, package, venue, paid, balance)
- "What happens next" as a 3-item vertical list with numbers
- Action buttons: "Add to calendar" (primary) + "Share with your planner" (secondary)
- Instagram link at bottom

---

## Component reuse notes

- The pricing cards in Step 02 should import or duplicate the exact same card component used in components/home/Pricing.tsx. If the homepage cards aren't already extracted as a reusable component, extract them first.
- The Button component from components/ui/Button.tsx should be used for all Back/Continue/CTA buttons throughout the flow.
- The SectionLabel component is NOT used in the booking flow — the step labels use a different, simpler format.

---

## State persistence

- All booking state lives in BookingContext (useReducer)
- On browser refresh: persist state to sessionStorage, restore on mount
- On successful booking completion: clear sessionStorage
- On "Close ×": if any step has data entered, show a confirm dialog before navigating away. Clear sessionStorage on confirm.
