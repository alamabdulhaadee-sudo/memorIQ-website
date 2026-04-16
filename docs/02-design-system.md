# 02 — Design System

## Color palette

All colors are defined as CSS custom properties. Never hardcode hex values in components.

```css
:root {
  /* Canvas colors */
  --color-ink: #0E0E10;           /* near-black, primary dark surface */
  --color-ink-soft: #1A1613;      /* softer dark, for text on light bg */
  --color-bone: #F4F1EA;          /* primary light surface */
  --color-bone-warm: #EAE4D6;     /* alternating light surface */

  /* Accent */
  --color-clay: #C65D3F;          /* oxblood-clay accent — primary CTAs */
  --color-clay-soft: rgba(198, 93, 63, 0.08); /* accent tint for callouts */

  /* Neutrals */
  --color-warm-gray: #8A7B68;     /* labels, meta, captions */
  --color-warm-gray-soft: #5A4F42; /* body text on light bg */

  /* Borders */
  --color-border-dark: rgba(244, 241, 234, 0.12);  /* on dark bg */
  --color-border-dark-strong: rgba(244, 241, 234, 0.3);
  --color-border-light: rgba(26, 22, 19, 0.18);    /* on light bg */
  --color-border-light-soft: rgba(26, 22, 19, 0.12);
}
```

### Color usage rules

- **Ink (#0E0E10)** — hero backgrounds, footer, the booking flow selected state, closing CTA section
- **Ink-soft (#1A1613)** — all headings and primary body text on light backgrounds
- **Bone (#F4F1EA)** — default light section background, most body sections
- **Bone-warm (#EAE4D6)** — alternating section background, pricing card emphasis
- **Clay (#C65D3F)** — primary CTA buttons, "MOST BOOKED" badges, accent word highlights (one per headline max), calendar available-date fills
- **Warm gray (#8A7B68)** — section labels (— 01 / LABEL), meta text, prices on secondary cards
- **Warm gray soft (#5A4F42)** — body paragraphs on light backgrounds

### Accent discipline

The clay accent is precious. Rules:
- One clay-colored highlight word per headline, maximum. Usually the emotional payoff word.
- Every primary CTA uses clay. No exceptions, no "secondary clay buttons."
- Never use clay as a section background — it's too loud at scale.
- Never pair clay with gold, red, or orange. It has to sit alone.

## Typography

### Fonts

```css
--font-sans: 'Inter', 'DM Sans', -apple-system, system-ui, sans-serif;
/* Load Inter from Google Fonts. DM Sans is acceptable fallback. */
```

We use ONE font family across the entire site. This is intentional — the single-family commitment is a contemporary design move. All hierarchy comes from weight and size, not from mixing serifs and sans-serifs.

### Type scale

```css
/* Display — hero headlines only */
--text-display: clamp(44px, 7vw, 72px);
--text-display-weight: 500;
--text-display-tracking: -0.035em;
--text-display-leading: 0.98;

/* Section headlines */
--text-section: clamp(36px, 5vw, 54px);
--text-section-weight: 500;
--text-section-tracking: -0.035em;
--text-section-leading: 1;

/* Sub-headlines (inside sections, like "For the couple who...") */
--text-sub: clamp(20px, 2.2vw, 26px);
--text-sub-weight: 500;
--text-sub-tracking: -0.02em;
--text-sub-leading: 1.2;

/* Category labels ("— 02 / WHO WE BUILD FOR") */
--text-label: 11px;
--text-label-weight: 500;
--text-label-tracking: 0.18em;
--text-label-transform: uppercase;

/* Micro labels inside cards ("01 / ESSENTIAL") */
--text-micro-label: 10px;
--text-micro-label-tracking: 0.2em;

/* Body */
--text-body: 15px;
--text-body-leading: 1.55;

/* Small / meta */
--text-small: 13px;
--text-small-leading: 1.6;

/* Tiny / footer / badges */
--text-tiny: 12px;
--text-tiny-tracking: 0.02em;
```

### Type rules

- Body text minimum 15px, never smaller than 12px anywhere
- Sentence case everywhere. Never ALL CAPS except small-cap labels (which use letter-spacing, not capitalization transforms alone)
- Never justify text. Always left-align.
- Max line length for body: 70 characters (use `max-width: 60ch` or similar)

## Spacing system

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
--space-5xl: 120px;
```

### Spacing rules

- Section vertical padding: 96–120px on desktop, 56–80px on mobile
- Between heading and content within a section: 32–48px
- Card internal padding: 28–40px
- Button padding: 14px vertical, 26px horizontal minimum
- When in doubt: more whitespace, not less

## Components

### Buttons

Two variants only.

**Primary CTA (clay pill):**
```css
background: var(--color-clay);
color: var(--color-ink);
padding: 14px 26px;
border-radius: 999px;
font-size: 13px;
font-weight: 500;
letter-spacing: 0.01em;
/* Hover: slightly darker clay, no transform */
```

**Secondary (ghost with hairline border):**
```css
background: transparent;
color: var(--color-bone); /* or --color-ink-soft on light bg */
padding: 14px 22px;
border: 0.5px solid var(--color-border-dark-strong); /* or light equivalent */
border-radius: 999px;
font-size: 13px;
```

All CTAs use the phrase patterns from `docs/06-content.md`. Never "Learn more," "Click here," "Submit."

### Section labels

Every major section starts with a small-cap, letter-spaced, gray label:

```
— 02 / WHO WE BUILD FOR
```

The em dash, the slash-separated number, the gray color. Consistent across every section. This is the visual thread that ties the whole site together.

### Cards

Pricing cards, service bands, testimonial cards all use:
- 0.5px border (not 1px — lighter feels more contemporary)
- Small border radius (4–6px, not 12–16px — sharper feels more contemporary)
- Generous internal padding (28–40px)
- Subtle hover effects only (border color shift, no transforms)

### Grids

- Gallery: asymmetric bento-style grid with mixed aspect ratios
- Pricing: 3 columns, middle card lifted (negative vertical margin)
- Services: 3-column grid `(180px 1fr 220px)` — label / content / meta

## Motion

Motion is restrained. No page-load animations, no scroll-triggered cascades.

- Hover transitions: `150ms ease`
- Calendar date selection: instant, no transition
- Modal/overlay enter: `200ms ease-out`
- Never use spring physics, bounces, or elastic easing — those read as "playful" and break the tone

## Imagery

Detailed photography guidance is in `docs/04-homepage.md` section "Gallery." Core rules:

- All images real events, never stock
- Consistent editing treatment across every photo (one Lightroom preset applied everywhere)
- Warm tones — if photos skew cool/blue, warm them slightly
- Minimum 1920px wide for hero, 1200px wide for grid thumbnails
- WebP format with JPEG fallback, lazy-loaded below the fold
