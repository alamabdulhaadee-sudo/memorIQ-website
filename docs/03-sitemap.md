# 03 — Sitemap

The site is intentionally lean. Every page has a clear purpose tied to conversion. Five pages total, plus the booking flow.

## Pages

### 1. Homepage (`/`)
**Purpose:** Establish credibility, showcase work, drive to booking.
**Primary action:** Click "Check availability."
**Detailed spec:** `docs/04-homepage.md`

### 2. Work (`/work`)
**Purpose:** Full portfolio. The soul of the site in Bold Contemporary direction.
**Primary action:** Browse, then click "Check availability" in sticky header.
**Content:**
- Single continuous gallery, not three separate albums
- Filterable by event type (All / Weddings / Corporate / Celebrations)
- Mixed aspect ratios, full-bleed edge-to-edge
- Lightbox for individual photo views
- 2–3 short embedded video clips (muted autoplay loops)
- One testimonial placed mid-scroll as a visual rhythm break

### 3. Services & Pricing (`/services`)
**Purpose:** Detailed service info for visitors who want more than the homepage snapshot.
**Primary action:** Choose a package, click "Check availability" for that tier.
**Content:**
- Expanded version of the homepage pricing section
- Detailed "what's included" for each tier
- Add-ons menu with clear pricing
- Custom corporate quote CTA
- A "What to expect" timeline (booking → event day → delivery)
- Compact FAQ specific to services

### 4. About (`/about`)
**Purpose:** Humanize the brand. But stay on-voice — this is editorial, not a personal bio.
**Primary action:** Feel connected, then click "Check availability."
**Content:**
- Short statement on what MEMORIQ is and why it exists (3–4 sentences max)
- One strong portrait photo of the founder/team
- A service area map (GTA, highlighted)
- The gear list (DSLR body, lighting, printer — this is a trust signal)
- Any partnerships or vendor features

### 5. Contact (`/contact`)
**Purpose:** Catch visitors not ready to book but want to ask a question.
**Primary action:** Send a message or find Instagram.
**Content:**
- Simple form: name, email, event date (optional), message
- Direct email + phone
- Instagram link (prioritized)
- Response time promise ("We reply within 4 hours")

## Booking flow (`/book`)

Not a page but a 5-step modal/flow. Detailed spec in `docs/05-booking-flow.md`.

## Pages deliberately NOT included

- **Blog** — not at launch. Add later once conversion baseline is established.
- **Separate Testimonials page** — weave throughout the site instead.
- **Separate FAQ page** — compact FAQ lives on homepage and services page.
- **Separate "How It Works" page** — integrated into homepage section 4.

## Navigation

### Top nav (desktop)
```
MEMORIQ.    Work   Services   About   Contact           [Check availability →]
```

- Logo on far left
- Primary nav items centered (Work, Services, About, Contact)
- Persistent "Check availability" CTA on far right, pill style
- Sticky: yes, with a subtle backdrop blur when scrolled past hero

### Mobile nav
- Hamburger menu (top-right)
- Logo top-left
- "Check availability" button always visible in header, smaller
- Menu opens as full-screen overlay with large type

### Footer

Single, consistent footer across all pages:

```
MEMORIQ.
[Short tagline]

Navigation           Contact              Follow
Work                 hello@memoriq.co     Instagram
Services             (XXX) XXX-XXXX
About
Contact

Proudly serving Toronto & the GTA
© 2026 MEMORIQ Photo Booth
```

- Dark background (--color-ink)
- Instagram is the visually most prominent social link
- No legal boilerplate unless legally required (privacy policy link when we add one)

## URL structure

Flat. No nested routes. No trailing slashes.

- `/`
- `/work`
- `/services`
- `/about`
- `/contact`
- `/book` (booking flow — could be modal or dedicated route, decided in `docs/07-tech-stack.md`)

## SEO priorities

Primary keywords to own:
1. "photo booth rental Toronto"
2. "photo booth GTA"
3. "Toronto photo booth"
4. "wedding photo booth Toronto"
5. "corporate photo booth Toronto"

Every page needs:
- Unique `<title>` — keyword + brand
- Unique meta description — benefit-led, not feature list
- Proper H1 per page
- Schema.org LocalBusiness markup on homepage
- Schema.org Service markup on services page
- Open Graph images for every page
