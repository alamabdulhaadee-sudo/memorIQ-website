# 07 — Tech Stack

## Recommended stack

### Framework: Next.js 15 (App Router) + TypeScript

**Why:**
- Server components for fast initial loads (critical for SEO — Google needs to crawl the content, not wait for JS)
- Built-in image optimization — important since photography carries this design direction
- File-based routing matches the flat sitemap
- First-class Stripe and form handling via Server Actions
- Vercel deploys are essentially one-click

**Alternative considered:** Astro. Slightly better for mostly-static content, but Next is better for the interactive booking flow.

### Styling: Tailwind CSS v4

**Why:**
- Design tokens (colors, spacing, type scale) map cleanly to Tailwind config
- Utility-first keeps component files compact
- v4 uses CSS variables natively, which matches our design system approach

**Setup:** Map every CSS variable from `docs/02-design-system.md` into `tailwind.config.js` so classes like `bg-ink`, `text-clay`, `border-border-light` just work.

### Database & booking backend

Two paths — choose based on time and complexity tolerance.

**Path A (recommended for launch): Lightweight cloud backend**
- **Supabase** for database + auth (Postgres under the hood)
- Tables: `bookings`, `packages`, `add_ons`, `blocked_dates`
- Realtime updates for calendar availability
- Built-in edge functions for booking-completion workflow

**Path B (maximum simplicity): Calendar + forms SaaS**
- **Cal.com** (self-hosted or cloud) for calendar + booking
- Custom frontend calls their API
- Faster to launch, less flexibility in the booking flow design

Recommendation: **Path A (Supabase).** The booking flow is too custom for Cal.com to match without heavy overrides.

### Payments: Stripe Elements

- Not Stripe Checkout — Checkout is a Stripe-branded redirect and breaks the design language
- Elements lets you embed fully-styled payment fields inside step 05 of the booking flow
- Use Payment Intents for the deposit, save card for the remaining balance (optional: Setup Intent + manual capture closer to event date)

### Email: Resend

- Developer-friendly API, generous free tier
- Use React Email for templating — email templates stay in the codebase next to the rest of the components
- Three email templates needed:
  1. Booking confirmation (to customer)
  2. Booking notification (to MEMORIQ team)
  3. Abandoned-booking follow-up (to customer, 24h after dropout)

### Hosting: Vercel

- Tight Next.js integration
- Edge functions for the booking endpoints
- Preview deployments for every branch (useful for reviewing changes before merging)

### Analytics: Plausible or PostHog

- Plausible if you just want traffic and conversion basics (simpler, privacy-friendly, no cookie banner needed)
- PostHog if you want funnel analysis on the booking flow (recommended — you will want to see exactly where people drop off)

### Image hosting: Cloudinary or Next Image + Vercel

- For a gallery-heavy site, Cloudinary is worth the cost — automatic format conversion, responsive sizing, and a CDN optimized for images
- Alternative: store images in the Next.js public folder and let `next/image` + Vercel handle optimization. Cheaper, works fine up to ~100 images.

---

## Project structure

```
memoriq-website/
├── app/
│   ├── layout.tsx                 # Root layout, fonts, nav, footer
│   ├── page.tsx                   # Homepage
│   ├── work/page.tsx              # Full gallery
│   ├── services/page.tsx          # Pricing + details
│   ├── about/page.tsx             # About
│   ├── contact/page.tsx           # Contact
│   ├── book/
│   │   ├── layout.tsx             # Booking flow shell + step indicator
│   │   ├── date/page.tsx          # Step 01
│   │   ├── package/page.tsx       # Step 02
│   │   ├── details/page.tsx       # Step 03
│   │   ├── customize/page.tsx     # Step 04
│   │   ├── pay/page.tsx           # Step 05
│   │   └── confirmed/page.tsx     # Confirmation
│   └── api/
│       ├── bookings/route.ts      # Create booking
│       ├── availability/route.ts  # Calendar availability
│       └── webhooks/stripe/route.ts
├── components/
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── ExperiencePreview.tsx
│   │   ├── ServicesBands.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── ClosingCTA.tsx
│   ├── booking/
│   │   ├── StepIndicator.tsx
│   │   ├── Calendar.tsx
│   │   ├── PackageCard.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── SectionLabel.tsx
│       └── ...
├── lib/
│   ├── supabase/
│   ├── stripe/
│   ├── email/
│   └── content.ts                 # Exports copy from docs/06-content.md
├── public/
│   ├── images/                    # Event photos
│   └── favicon
├── styles/
│   └── globals.css                # CSS variables, base styles
├── docs/                          # All the spec files
├── CLAUDE.md
└── tailwind.config.ts
```

## Environment variables needed

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Misc
NEXT_PUBLIC_SITE_URL=
```

## Build order (priority sequence for Claude Code sessions)

Do not try to build everything at once. Work in this order:

### Phase 1 — Foundation (1–2 sessions)
1. Initialize Next.js + TypeScript + Tailwind
2. Set up design tokens in `tailwind.config.ts` from `docs/02-design-system.md`
3. Build the `<Nav>` and `<Footer>` layout components
4. Build the `<Button>`, `<SectionLabel>`, and other base UI components
5. Build one homepage section end-to-end (start with Hero) as a proof of concept

### Phase 2 — Homepage (2–3 sessions)
Build each homepage section as its own component, in order:
1. ExperiencePreview
2. ServicesBands
3. HowItWorks
4. GalleryGrid (use placeholder images)
5. Pricing
6. Testimonials (hardcoded for now)
7. FAQ
8. ClosingCTA

### Phase 3 — Secondary pages (1–2 sessions)
- `/work` (expanded gallery)
- `/services` (expanded pricing + FAQ)
- `/about`
- `/contact` (with functional form → email via Resend)

### Phase 4 — Booking flow (3–4 sessions)
This is the hardest part. Build in sub-steps:
1. Booking layout + step indicator
2. Step 01 (calendar) with mock availability data
3. Step 02 (package selection)
4. Step 03 (details form) with validation
5. Step 04 (customize) with live total calculation
6. Step 05 (Stripe Elements integration)
7. Confirmation screen + email sending
8. Abandonment email follow-up

### Phase 5 — Backend & polish (2–3 sessions)
1. Supabase schema + seeds
2. Real calendar availability integration
3. Booking creation + Stripe webhook
4. Email templates
5. Analytics
6. SEO meta, Open Graph, sitemap
7. Performance audit (Lighthouse)
8. Accessibility audit

### Phase 6 — Launch
1. Custom domain setup (buy `memoriqbooth.com` or similar)
2. DNS + SSL
3. Production Stripe keys
4. Production Resend domain
5. 301 redirect from Square site
6. Submit sitemap to Google Search Console

---

## Things to defer, not skip

- **CMS for gallery images.** Start with images in `/public`. Move to a CMS (Sanity or Payload) only when uploading new photos becomes painful.
- **Blog.** Not at launch. Content marketing can come once the conversion engine is proven.
- **Multi-language.** English only at launch.
- **Accounts / user logins.** Not needed. Bookings are guest-checkout style.
- **Mobile app.** Never.

## Things NOT to do

- **Don't use a page builder** (Webflow, Framer, Squarespace). You'll hit their limits on the booking flow and the design nuance.
- **Don't use shadcn/ui as-is.** Its default aesthetic fights Bold Contemporary. Write custom components from scratch — the design system is specific enough that shadcn creates more work than it saves.
- **Don't skip TypeScript.** The booking flow has enough state management that types will save you hours.
- **Don't use animated scroll libraries** (AOS, Framer Motion for every element). Motion is restrained in this brand — see `docs/02-design-system.md`.
