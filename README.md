# MEMORIQ Website — Start here

This folder is the complete spec bundle for rebuilding the MEMORIQ Photo Booth website. It's designed to be opened in an IDE with Claude Code so you can build the site progressively, one piece at a time.

## What's in here

```
memoriq-website/
├── CLAUDE.md          ← Claude Code auto-loads this every session
├── README.md          ← You are here
└── docs/
    ├── 01-brand.md              ← Voice, personality, principles
    ├── 02-design-system.md      ← Colors, type, spacing, components
    ├── 03-sitemap.md            ← Pages and navigation structure
    ├── 04-homepage.md           ← Full homepage spec
    ├── 05-booking-flow.md       ← 5-step booking flow spec
    ├── 06-content.md            ← All copy, ready to paste
    └── 07-tech-stack.md         ← Platform, libraries, build order
```

## Get set up in 10 minutes

### 1. Install prerequisites
If you don't have them:
- **Node.js** (20 or newer) — https://nodejs.org
- **Git** — https://git-scm.com
- An IDE — either **Cursor** (https://cursor.sh) or **VS Code** with the Claude Code extension, or the **Claude Code CLI** directly

### 2. Put this folder somewhere permanent
```bash
# Move this folder to wherever you keep projects, e.g.
mv ~/Downloads/memoriq-website ~/Projects/memoriq-website
cd ~/Projects/memoriq-website
```

### 3. Initialize git
```bash
git init
git add .
git commit -m "Initial spec bundle"
```
You'll thank yourself later when you can see exactly what changed between sessions.

### 4. Open the folder in your IDE
- **Cursor / VS Code:** `File → Open Folder` → select `memoriq-website`
- **Claude Code CLI:** `cd memoriq-website && claude`

### 5. Verify Claude Code can see the context
Ask Claude Code:
> "Read CLAUDE.md and summarize what this project is and what the non-negotiable rules are."

If it describes Bold Contemporary, the oxblood accent, the booking flow as the conversion engine, and the no-champagne-gold rule — you're wired up correctly. If it gives a generic answer or ignores CLAUDE.md, something's wrong with your Claude Code setup.

## Your first session — recommended prompt

Once Claude Code is working, start with this:

> "Read CLAUDE.md and docs/07-tech-stack.md. Then initialize a new Next.js 15 project with TypeScript, Tailwind CSS v4, and the App Router in this folder. Set up the Tailwind config with all the design tokens from docs/02-design-system.md. Create a basic app/layout.tsx with the fonts loaded but don't build any components yet — just get the foundation running."

That's Phase 1, step 1–2 from the tech stack doc. After that session, you'll have a working Next.js project wired up with your design system. Every subsequent session builds one section at a time.

## How to work with Claude Code effectively

**Always reference the spec files in your prompts.**
Good: "Build the Hero component per docs/04-homepage.md section 1, using copy from docs/06-content.md."
Bad: "Build the hero section."

**Work in small sessions.**
One section, one component, one feature at a time. Don't ask Claude Code to build the entire homepage in one go — it'll make decisions you can't easily unwind.

**Review before committing.**
Use git. After each session, review the diff, test the result in the browser, then commit. If something's off, you can always revert.

**Update the specs when you make changes.**
If you decide mid-build that the Signature package should be $595 instead of $550, update `docs/06-content.md` before changing the code. The specs are the source of truth — keep them accurate.

**Load only what you need.**
If you're working on the booking flow, you don't need the homepage spec loaded. Tell Claude Code which files to read, and it'll stay focused.

## Phased build, at a glance

Full details in `docs/07-tech-stack.md`. Rough timeline:

1. **Foundation** (1–2 sessions) — Next.js setup, design tokens, base UI components
2. **Homepage** (2–3 sessions) — One section per session, in order
3. **Secondary pages** (1–2 sessions) — Work, Services, About, Contact
4. **Booking flow** (3–4 sessions) — The hardest and highest-value piece
5. **Backend & polish** (2–3 sessions) — Supabase, Stripe, email, SEO
6. **Launch** (1 session) — Domain, DNS, Stripe production keys

Plan for ~15–20 Claude Code sessions total, spread across a few weeks. Don't rush it — the booking flow especially benefits from building, testing, sleeping on it, and refining.

## Assets you need to gather before launch

The design direction depends on strong photography. Before you can launch:

- **8–10 genuinely excellent event photos** across weddings, corporate, and celebrations. Full-bleed quality.
- **2–3 short video clips** (10–20 seconds each) of the booth in action
- **Real testimonials** — pull 3 strongest from Google reviews
- **Final pricing** — the tiers in the spec ($400 / $550 / $700) are placeholders, confirm your real numbers
- **Contact info** — real email, phone, Instagram handle
- **Domain name** — buy `memoriqbooth.com`, `getmemoriq.com`, or similar, today

If any of these aren't ready, the build can still start — you'll use placeholders. But don't launch with placeholders.

## When you're stuck

If Claude Code gets something wrong:
1. Point to the specific spec file and section it should have followed
2. Ask it to re-read that file and try again
3. If the spec itself is ambiguous, update the spec first, then re-prompt

If the spec is missing something you need:
1. Pause the build
2. Come back to the chat with me (or a new Claude conversation) to decide
3. Update the relevant spec file
4. Resume the build with the updated spec

Good luck. The direction is locked, the specs are thorough, and the hardest decisions are already made. The rest is execution.
