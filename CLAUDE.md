# MEMORIQ Website — Project Context

You are helping build the MEMORIQ Photo Booth website. This file is your always-loaded context. The `docs/` folder contains detailed specs — load them as needed, not all at once.

## What this project is

A conversion-focused website for MEMORIQ Photo Booth, a premium photo booth rental service in the Greater Toronto Area. The current site is on Square's free tier and needs to be rebuilt as a custom site that matches the brand's actual quality level.

Primary business goal: convert visitors into paid bookings via a live 5-step booking flow with Stripe deposit.

## The brand in one paragraph

MEMORIQ is "Bold Contemporary" — near-black canvas, bone/cream surfaces, one oxblood-clay accent. Oversized sans-serif display typography. The voice is confident, current, and a little direct. Think design studio or contemporary fashion brand, not wedding magazine. The tagline energy is "Events are loud. Your memories should be louder."

## Non-negotiable rules

1. **Never use champagne gold, wedding-magazine serifs, or "elegant" ornament.** The brand is contemporary, not traditional.
2. **Never soften the copy into generic vendor language.** No "capture the moment," "say cheese," "fun props," or exclamation marks in headlines.
3. **Always use CSS variables from the design system.** Never hardcode hex values outside of the tokens defined in `docs/02-design-system.md`.
4. **The booking flow is the conversion engine.** Every decision that affects it is high-stakes. Cross-check against `docs/05-booking-flow.md`.
5. **Mobile-first.** Over 60% of visitors are on phones. Every component must be designed mobile-first and scale up.
6. **No stock photos, ever.** All imagery is real events. Placeholders during dev should be clearly marked.

## Where to find what

| If you need... | Read this file |
|----------------|----------------|
| Brand voice, tone, principles | `docs/01-brand.md` |
| Colors, fonts, spacing, component tokens | `docs/02-design-system.md` |
| Full sitemap, page-by-page purpose | `docs/03-sitemap.md` |
| Homepage section specs, layouts, copy | `docs/04-homepage.md` |
| 5-step booking flow detailed spec | `docs/05-booking-flow.md` |
| All website copy, ready to paste | `docs/06-content.md` |
| Tech stack, libraries, deployment | `docs/07-tech-stack.md` |

## How to work in this project

- When starting a new feature, re-read the relevant spec file first. Do not build from memory of previous conversations.
- When I give you a task, confirm which spec file(s) you are working from before writing code.
- If you find ambiguity in a spec, ask before assuming. Do not invent design decisions.
- When you make a design decision that isn't covered in the specs, update the relevant spec file so it's documented for future sessions.
- Prefer small, focused components over large monolithic ones. Each homepage section should be its own component.

## Current project status

The specs have been written and the brand direction is locked. Implementation has not started. Next step is choosing the tech stack (see `docs/07-tech-stack.md`) and scaffolding the project.
