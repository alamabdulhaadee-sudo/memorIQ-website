# 05 — Booking Flow

The booking flow is the conversion engine. Every detail matters. Implemented as a 5-step modal or dedicated route (see `docs/07-tech-stack.md` for the architecture decision).

## Step indicator

Always visible at the top of the flow. Hairline horizontal arrangement:

```
01 / DATE  —  02 / PACKAGE  —  03 / DETAILS  —  04 / CUSTOMIZE  —  05 / PAY
```

- Current step in `--color-ink-soft`, others in `--color-warm-gray`
- Em-dash separators in a lighter gray
- Small caps, letter-spaced, 11px
- On mobile: show only current step + total ("STEP 02 OF 05")

## Global rules across all steps

- Left column (~40%): context — step number, headline, sub-copy, helper info
- Right column (~60%): the interactive element for that step
- On mobile: stacked single column, context on top
- Persistent "Back" and "Continue" affordances at the bottom of the right column
- Continue button disabled until step requirements are met
- "Close ×" in top right — triggers a confirm dialog if any step has been completed

## Step 01 — Date

**Headline:** "When's the big day?"
**Sub-copy:** "Pick your event date. We'll hold it for 15 minutes while you finish booking. Dates in orange are available, grey is taken."

**Interactive element:** Monthly calendar view with:
- Month/year label + prev/next chevrons
- 7-column day grid, starting Sunday
- Each date styled by status:
  - **Available:** clay (#C65D3F) background, ink text, medium weight
  - **Limited (daytime only):** ink background with diagonal hatching, bone text
  - **Booked:** muted gray background, muted gray text
  - **Past:** no background, very light gray text
  - **Selected:** ink background with 2px clay border, bone text
- Legend below the calendar (or in the left column)
- Helper callout: "June through October books 6–8 weeks out" in a clay-tinted box with left border

**On date select:** A black bar slides in below the calendar showing the selected date + a "Continue" button in clay.

**Validation:** Must select a date to continue.

## Step 02 — Package

**Headline:** "Which package fits the night?"
**Sub-copy:** "Most events book Signature. Start there unless you've got a specific reason to go smaller or bigger."

**Interactive element:** Three pricing cards, identical to the homepage pricing section but with radio-style selection behavior:
- Click a card to select it
- Selected card gets a 2px clay border
- Continue button enables once any card is selected
- Signature card is pre-selected by default (remove if this feels too pushy in testing)

**Below cards:** Small link — "Not sure? Contact us for a quick consult →"

## Step 03 — Details

**Headline:** "Where's the event?"
**Sub-copy:** "Just the essentials. We'll grab anything else we need in our pre-event call."

**Form fields (vertically stacked):**
1. Your name (text, required)
2. Email (email, required, inline validation)
3. Phone (tel, required, auto-format)
4. Event type (select: Wedding / Corporate / Birthday / Other, required)
5. Venue name (text, optional)
6. Venue address (text, required — drives our travel calc)
7. Expected guest count (number, optional)
8. Anything else we should know? (textarea, optional, max 500 chars)

**Validation:**
- Inline as user types, not all-at-once on submit
- Green check appears on the right of each valid field
- Red error below field only after blur, never while typing

## Step 04 — Customize

**Headline:** "Make it yours."
**Sub-copy:** "Pick a template and backdrop. Add anything extra. The total updates as you go."

**Layout:** Three subsections, stacked:

### 4a. Template style
- 4 thumbnail options, each ~160px wide
- Click to select, selected gets a 2px clay border
- Default: our most popular template, pre-selected
- Below: "Full custom template included in Signature and Full Takeover"

### 4b. Backdrop
- Photo-swatch grid, 3 columns, ~100px each
- Premium backdrops (marked with a small "+$50" badge) cost extra
- Default: our most popular backdrop, pre-selected

### 4c. Add-ons (toggles)
- GIF + boomerang mode (+$50, or included in Signature+)
- Premium prop collection (+$40)
- Guest book with prints (+$60)
- Extra hour (+$125/hr)
- Second photographer (+$150)

**Live summary sidebar (desktop) or sticky bottom bar (mobile):**
- Package name
- List of selected add-ons with prices
- Subtotal
- Deposit due today: $100
- Remaining balance: calculated, due 2 weeks before event

## Step 05 — Pay

**Headline:** "Lock in the date."
**Sub-copy:** "A $100 deposit holds your date. The remaining balance is due 2 weeks before the event."

**Layout:**
- Left column: order summary (line items, deposit, balance, due dates)
- Right column: Stripe payment element

**Order summary shows:**
```
Package: Signature (3 hours)          $550
Premium backdrop                       $50
GIF + boomerang mode                    included
─────────────────────────────────────
Subtotal                              $600
Deposit due today                     $100
Remaining balance due May 20, 2026    $500
```

**Trust signals around payment:**
- Small lock icon
- "Secure payment powered by Stripe"
- Accepted cards (Visa, Mastercard, Amex icons)
- Link to refund/reschedule policy (opens in modal, not new page)

**Below payment:**
- Checkbox: "I agree to the booking terms" (required)
- Primary CTA: "Pay $100 deposit and confirm booking"

## Step 06 — Confirmation (not a "step" but the success state)

**Background:** Full-height celebration screen

**Content:**
- Display headline: "You're all set."
- Sub-copy: "Confirmation's headed to your inbox. We'll reach out 2 weeks before to lock in the final details."

**Booking summary:**
```
Date:     Friday, June 19 · 2026
Package:  Signature (3 hours)
Venue:    [Venue name, address]
Paid:     $100 deposit
Balance:  $500 due May 20, 2026
```

**What happens next:**
- Confirmation email within 5 minutes
- Pre-event call 2 weeks before
- Our team arrives 1 hour before start time

**Actions:**
- "Add to calendar" (generates .ics + Google Calendar link)
- "Share with your planner" (opens email modal to forward booking summary)
- Social links — "Follow us for event inspiration" with Instagram prominent

## Drop-off recovery

### Email capture at step 01
If user picks a date but doesn't complete step 02, show a small inline field: "Save your date for 24 hours. We'll email you a link to continue." Capture email only — no marketing consent required at this stage.

### Follow-up email automation
24 hours after abandonment, send one email:
- Subject: "Your date on [date] is still available"
- Body: Brief, direct, link back to pre-filled step 02
- No more than one follow-up. No drip sequences. No guilt-tripping copy.

### 15-minute date hold
When user selects a date in step 01, soft-reserve it for 15 minutes with a visible countdown in the flow: "Your date is held for 14:38 more." This creates urgency without being fake.

## Edge cases to handle

- **User selects an unavailable date:** Not possible by default (disabled). But if they try via URL params, show error + suggest nearest available dates.
- **Payment fails:** Keep form state, show clear error, allow retry without losing form data.
- **User refreshes mid-flow:** Persist state to sessionStorage so they can resume. Clear on successful booking.
- **Two users select the same date simultaneously:** First to complete payment wins. Second user sees: "This date was just booked. Here are the next 3 available dates." and can re-enter flow.

## Integration points

- **Calendar availability:** Backend API. Could be Google Calendar API, Calendly API, or custom. Decision in `docs/07-tech-stack.md`.
- **Payment:** Stripe Checkout or Stripe Elements. Elements gives more design control — preferred.
- **Email automation:** Postmark, Resend, or SendGrid. Needs: confirmation email, follow-up email, internal notification to MEMORIQ team.
- **Internal notification:** When a booking completes, send a Slack/email alert to MEMORIQ with the full booking summary.
