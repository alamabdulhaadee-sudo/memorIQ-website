# MEMORIQ — Build Status Audit
**Date:** April 17, 2026  
**Author:** Claude Code

This document is a full audit of what has been built, what is incomplete, what is missing, and what could be improved. Cross-referenced against every spec file.

---

## Phase 1 — Foundation

| Item | Status | Notes |
|------|--------|-------|
| Next.js 16 + TypeScript + App Router | ✅ Done | Running Next.js 16.2.4 |
| Tailwind CSS v4 | ✅ Done | CSS variable tokens in globals.css |
| Design tokens mapped from `docs/02-design-system.md` | ✅ Done | All colors, spacing, type scale |
| `<Nav>` component | ✅ Done | Sticky, backdrop blur, mobile hamburger |
| `<Footer>` component | ✅ Done | Dark ink background, full nav links |
| `<Button>` component | ✅ Done | Primary clay pill + secondary ghost, both surfaces |
| `<SectionLabel>` component | ✅ Done | Em-dash, slash, letter-spaced, warm-gray |
| `<Container>` component | ✅ Done | Max-width wrapper with responsive padding |
| `<PackageCard>` component | ✅ Done | Shared between homepage and booking step 02 |
| Route group `(marketing)/layout.tsx` | ✅ Done | Nav/Footer only on marketing pages |
| Root `app/layout.tsx` | ✅ Done | Fonts, globals only — no Nav/Footer |

---

## Phase 2 — Homepage

All 9 content sections are built. Detailed notes per section:

| Section | Status | Gaps / Notes |
|---------|--------|--------------|
| **1 — Hero** | ✅ Done | Background image is a placeholder (`/images/placeholders/hero.jpg`). "See the work" secondary link present. Trust bar (4 columns) present. |
| **2 — Experience Preview** | ✅ Done | All 3 image slots are placeholders — same `hero.jpg` repeated. Real event photos needed. |
| **3 — Services Bands** | ✅ Done | 3-column grid (label/content/meta), correct copy, "See X work →" links present. |
| **4 — How It Works** | ✅ Done | 3 steps, centered CTA below. |
| **5 — Gallery** | ✅ Done | Asymmetric grid, filter tabs (All/Weddings/Corporate/Celebrations), placeholder divs instead of photos. `[PHOTO PLACEHOLDER]` text visible in rendered output. |
| **6 — Pricing** | ✅ Done | 3 cards, Signature elevated + inverted palette, "MOST BOOKED" badge, footer strip. |
| **7 — Testimonials** | ✅ Done | Hero testimonial + 2 supporting. **All 3 quotes are literal placeholder bracket text from the spec** — not real reviews. Google link is `#` (TODO in code). |
| **8 — FAQ** | ✅ Done | Accordion, 6 questions, correct copy, smooth expand. |
| **9 — Closing CTA** | ✅ Done | Dark ink background, "open" in clay, placeholder background image. |

**Homepage summary:** Structurally complete. The three main blockers before it's launch-ready are real event photos, real testimonials, and the Google reviews URL.

---

## Phase 3 — Secondary Pages

| Page | Status | Gaps / Notes |
|------|--------|--------------|
| `/work` | ✅ Done | Filter tabs + masonry grid + lightbox + mid-scroll testimonial. All gallery cells are `[PHOTO PLACEHOLDER]` text — no real images. Filter works client-side. |
| `/services` | ✅ Done | Full package cards, add-ons table, "What to expect" timeline, compact FAQ. Package CTAs link to `/book/date?package=X`. |
| `/about` | ✅ Done | Brand statement, gear list table, service area grid. **Two hard placeholders:** founder portrait (gray box labeled "Founder portrait — placeholder") and GTA map ("GTA MAP PLACEHOLDER"). Real photo + map needed. |
| `/contact` | ✅ Done | Form renders with inline validation. **Contact form does not send** — `ContactForm.tsx:38` has `// TODO Phase 4: POST to /api/contact (Resend)`. The submit button shows a success state but nothing is emailed. Phone/email/Instagram are all placeholder values. |

---

## Phase 4 — Booking Flow

All 5 steps plus confirmation are built and wired end-to-end.

| Step | Status | Gaps / Notes |
|------|--------|--------------|
| **Layout + step indicator** | ✅ Done | Step bar, mobile "STEP 02 OF 05", booking group outside marketing layout, no Nav/Footer |
| **`/book` redirect** | ✅ Done | `app/book/page.tsx` server-redirects to `/book/date` |
| **Step 01 — Date** | ✅ Done | Calendar with availability states, legend, confirmation bar, callout. Uses **mock data** (`lib/mock/availability.ts`) — not real Supabase. |
| **Step 02 — Package** | ✅ Done | Stacked cards, radio selection, Signature pre-selected, "Not sure?" link |
| **Step 03 — Details** | ✅ Done | All 8 form fields, inline validation, green check on valid, red error on blur |
| **Step 04 — Customize** | ✅ Done | Template grid, backdrop grid, add-on toggles, live sidebar (desktop) + sticky bar (mobile) |
| **Step 05 — Pay** | ✅ Done | Stripe Elements embedded, order summary, trust signals, terms checkbox, payment error handling |
| **Confirmation** | ✅ Done | Booking summary, "What happens next" list, Add to calendar (.ics), Share with planner (mailto) |
| **Session persistence** | ✅ Done | SessionStorage save on every state change, restore on mount, clear on confirmed |
| **Close × confirm dialog** | ✅ Done | `hasProgress()` check, `confirm()` dialog if data entered, sessionStorage cleared on confirm |
| **Route guards** | ✅ Done | All 5 steps guard against skipped steps, use `router.replace()` |
| **15-minute date hold** | ❌ Not built | Spec §"Drop-off recovery" calls for a visible countdown ("Your date is held for 14:38 more"). Copy mentions it but the countdown timer component doesn't exist. |
| **Drop-off email capture** | ❌ Not built | Spec §"Drop-off recovery": small inline field after date selection asking "Save your date for 24 hours." Not implemented. |
| **Abandonment follow-up email** | ❌ Not built | 24-hour follow-up email (Resend) after step 01 dropout. No API route, no template. |

---

## Phase 5 — Backend & Polish

| Item | Status | Notes |
|------|--------|-------|
| **Supabase client (server)** | ✅ Done | `lib/supabase/server.ts` with service role key |
| **Supabase — booking creation** | ✅ Done | Webhook `payment_intent.succeeded` writes to `bookings` table |
| **Supabase — schema / migrations** | ❌ Not built | No `supabase/schema.sql` or migration files. Table must be created manually in Supabase dashboard before the webhook will work. |
| **Supabase — real calendar availability** | ❌ Not built | Calendar uses `lib/mock/availability.ts`. No `/api/availability` route. No query against `blocked_dates` table. |
| **Stripe webhook secret** | ⚠️ Partially done | `STRIPE_WEBHOOK_SECRET` is in `.env.local` but the value is empty. Webhook signature verification will fail until this is filled in. |
| **Stripe metadata — full booking state** | ⚠️ Partial | `create-payment-intent` only passes `package`, `event_date`, `customer_email` as metadata. The webhook tries to extract name, phone, venue, add-ons, etc. from metadata but those fields are never written to the PaymentIntent. The Supabase insert will have mostly null values for those fields. |
| **Email — booking confirmation to customer** | ❌ Not built | No Resend API call anywhere after payment. `lib/email/` directory exists but is empty. No React Email templates. |
| **Email — booking notification to MEMORIQ team** | ❌ Not built | Same — no internal notification email. |
| **Email — contact form** | ❌ Not built | ContactForm has a TODO comment; the form submission fires nothing. No `/api/contact` route exists. |
| **Email — abandonment follow-up** | ❌ Not built | See Phase 4 above. |
| **Analytics** | ❌ Not built | No Plausible or PostHog installed. No funnel tracking. |
| **SEO — per-page metadata** | ⚠️ Partial | `/work`, `/services`, `/about`, `/contact`, `/book/pay` all have `<title>` and `<description>`. Homepage metadata is in root layout. **Missing:** unique Open Graph images for every page (only a generic og object in root layout, no `og:image` URL). |
| **SEO — Schema.org markup** | ❌ Not built | Spec requires `LocalBusiness` on homepage and `Service` on services page. Neither exists. |
| **SEO — `sitemap.xml`** | ❌ Not built | No `app/sitemap.ts` file. |
| **SEO — `robots.txt`** | ❌ Not built | No `app/robots.ts` file. |
| **404 page** | ❌ Not built | Spec has custom 404 copy ("This page pulled a disappearing act..."). No `app/not-found.tsx`. Currently falls back to Next.js default. |
| **Performance audit** | ❌ Not done | No Lighthouse run. |
| **Accessibility audit** | ❌ Not done | ARIA labels are present in booking components but no formal audit. |
| **Real event photos** | ❌ Not provided | All image slots use a single placeholder JPEG. This is a hard blocker for launch. |
| **Real testimonials** | ❌ Not provided | Bracket placeholder text in `Testimonials.tsx`. |
| **Real contact info** | ❌ Not provided | Phone, email, Instagram handle all say "update with real X". |

---

## Phase 6 — Launch

| Item | Status |
|------|--------|
| Custom domain | ❌ Not done |
| DNS + SSL | ❌ Not done |
| Production Stripe keys | ❌ Not done — test keys in `.env.local` |
| Production Resend domain | ❌ Not done |
| 301 redirect from Square site | ❌ Not done |
| Google Search Console submission | ❌ Not done |

---

## Known Bugs & Inconsistencies

1. **Stripe metadata mismatch.** `create-payment-intent` writes only 3 metadata fields (`package`, `event_date`, `customer_email`) but the webhook handler reads 13 fields. When a booking completes, the Supabase row will have null for name, phone, venue, add-ons, subtotal, etc. The full `BookingState` needs to be serialized into the PaymentIntent metadata at payment creation time.

2. **`/book/date?package=X` query param is ignored.** The services page links to `/book/date?package=essential` etc., but the date page and BookingContext do not read `searchParams` on mount. A visitor who clicks "Select essential →" on the services page will land on the date step with Signature pre-selected, silently discarding their choice.

3. **Testimonials are spec placeholder text.** The rendered homepage shows bracket text visible to visitors: `"[Longer quote that mentions specific detail about the experience...]"`. This must be replaced before any real traffic hits the site.

4. **Contact form is silent.** Submitting the contact form shows a success state but sends nothing. A real visitor would think their message was received.

5. **`/work` and `/` gallery sections have `[PHOTO PLACEHOLDER]` and `[PLACEHOLDER]` text rendered in gray boxes.** This is visually obvious to anyone who visits.

6. **About page has two gray placeholder boxes** (founder portrait and GTA map) with visible label text.

7. **`STRIPE_WEBHOOK_SECRET` is empty.** Every webhook event from Stripe will be rejected with a 400 signature verification error until this is set.

8. **`RESEND_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` are all empty.** The backend is wired but has no credentials to run against.

---

## Improvement Ideas

These are not in the spec but would meaningfully lift conversion or quality:

### High impact

1. **15-minute countdown timer.** The spec explicitly calls for this ("Your date is held for 14:38 more.") and it's missing. Real urgency signal — not fake scarcity, an actual soft reservation. Build with `useEffect` + `setInterval`, store the hold start time in sessionStorage alongside booking state.

2. **Pre-fill package from URL param.** The services page already links with `?package=essential` etc. Reading this on the date page mount and dispatching `SET_PACKAGE_ID` would create a much smoother funnel from "Services → Book" — the visitor feels like the site remembered their choice.

3. **Two users / race condition handling.** Spec §"Edge cases" covers this: "First to complete payment wins. Second user sees: 'This date was just booked.'" This requires real-time Supabase, not the mock availability layer.

4. **Booking admin view.** There is no way for the MEMORIQ team to see their bookings outside of Supabase's dashboard. Even a simple `/admin` page (password-protected or Supabase auth-gated) listing upcoming bookings with date/package/name/contact would dramatically improve operations.

5. **`/api/availability` real endpoint.** Swap the mock data for a Supabase query against `blocked_dates`. This is the most critical backend gap — if two people book the same date simultaneously, only the mock layer exists to stop it.

### Medium impact

6. **React Email confirmation templates.** The `.ics` file is already generated for the customer — a polished HTML confirmation email that mirrors the site's design system would reinforce brand quality at the exact moment the customer has highest trust.

7. **Custom 404 page.** The spec has the copy ready ("This page pulled a disappearing act."). Takes 20 minutes, noticeably elevates polish.

8. **Schema.org LocalBusiness JSON-LD.** Concrete SEO lift for "photo booth rental Toronto" searches. Structured data makes Google more likely to surface a rich result.

9. **`sitemap.xml` + `robots.txt`.** Two Next.js files, 30 minutes of work, required for proper Google crawling.

10. **Open Graph images per page.** Right now every shared URL would show no preview image. Even a simple black card with the MEMORIQ logotype and page headline would be a major improvement over the fallback.

11. **PostHog funnel analytics.** The booking flow is the conversion engine. Without funnel data (step 01 → step 02 → step 03 → step 04 → step 05 → confirmed), you can't see where people drop off, so you can't improve it. Install PostHog before any real traffic, not after.

### Lower impact / polish

12. **Mobile close button tap target.** The "Close ×" button on mobile is `12px` text with no padding. On a phone this is undersized for comfortable tapping. Minimum tap target should be 44×44px per WCAG.

13. **Keyboard navigation on booking calendar.** Arrow key navigation between dates is expected by keyboard users and screen readers. Currently only mouse/touch is handled.

14. **`/book/date` initial month.** The calendar defaults to the current month. If today is April 17, a customer with a June wedding has to click "next" twice before they reach their month. Consider defaulting to the nearest month that has available dates, or at minimum to one month ahead for peak season.

15. **Pricing numbers need confirmation.** The spec itself notes: "the tiers in the spec ($400 / $550 / $700) are placeholders, confirm your real numbers." The booking flow calculates a live subtotal against these numbers — if the real pricing is different, this needs to be updated in both `lib/data/packages.ts` and `lib/data/customize.ts` before going live.

16. **"Share with your planner" on confirmation.** The `mailto:` link works but opens the user's local email client. Many mobile users don't have a mail client configured. A copy-to-clipboard fallback would be more reliable.

17. **`/book/details` phone auto-format.** The spec says "auto-format" for the phone field. The current `DetailsForm.tsx` renders a `tel` input with a placeholder but no real-time formatting. `(416) 555-0100` format on blur would be a nice touch.

---

## Summary: What's Blocking Launch

**Must fix before any real visitor sees the site:**
- [ ] Real event photos (8–10 images across all placeholder slots)
- [ ] Real testimonials (replace bracket text)
- [ ] Real contact info (phone, email, Instagram handle)
- [ ] Contact form → Resend integration (`/api/contact`)
- [ ] Booking confirmation email (Resend, after `payment_intent.succeeded`)
- [ ] Fill `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, Supabase credentials in `.env.local`
- [ ] Fix Stripe metadata — pass full BookingState to PaymentIntent so Supabase gets complete booking records
- [ ] Create Supabase `bookings` and `blocked_dates` tables (schema SQL needed)
- [ ] Swap mock availability for real Supabase `/api/availability` query
- [ ] Custom domain + DNS + production Stripe keys

**Should fix before launch (high quality bar):**
- [ ] 15-minute countdown timer on booking date step
- [ ] `sitemap.xml` + `robots.txt`
- [ ] Schema.org LocalBusiness markup on homepage
- [ ] Custom 404 page
- [ ] Pre-fill package from `?package=X` URL param
- [ ] Open Graph images per page
- [ ] About page founder portrait + GTA map (real assets)

**Can defer to shortly after launch:**
- [ ] PostHog funnel analytics
- [ ] Abandonment email follow-up (24h after step 01 dropout)
- [ ] Drop-off email capture on date step
- [ ] MEMORIQ team admin view of bookings
- [ ] Accessibility audit + keyboard calendar navigation
- [ ] Lighthouse performance audit
- [ ] Blog (spec says: not at launch)
