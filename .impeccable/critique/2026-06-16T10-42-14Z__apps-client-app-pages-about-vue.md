---
target: apps/client/app/pages/about.vue
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-06-16T10-42-14Z
slug: apps-client-app-pages-about-vue
---
# Re-critique — apps/client/app/pages/about.vue (post-polish)

**Score: 32/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/about.vue (+ components/PolaroidItem.vue)

**Trend for `apps-client-app-pages-about-vue` (last 5 runs): 27 → 29 → 32** (+5 cumulative; +3 in this re-run)

**Re-run scope:** Verifying the 4 fixes shipped in commit `aa6d5dd` from branch `polish/about-stats-and-amber-polish` (which bundled `fix(PolaroidItem)` + `fix(about)` + `add(critique)`). The P1 Stats drift, the P3 amber over budget, the P3 icon-boxes, and the P3 `font-serif` third-family exception are all addressed.

## Anti-Patterns Verdict

**LLM assessment:** The page is now materially closer to the brand discipline than at any point in the cycle. The Stats block is no longer the SaaS hero-metrics template — its numbers are `text-highlighted` and its icons are bare `text-muted`, matching the landing's `Stats.vue` restrained treatment. The blockquote is no longer an amber motif (`border-default bg-elevated/40 text-muted` instead of `border-primary/30 bg-primary/5 text-primary-600/400`). The current-role signal is no longer duplicated on the card — the timeline node alone carries it, with `bg-primary/10 border-primary/40 ring-primary/20` + `text-primary` zap icon, while the card itself is neutral. And the `font-serif` in `PolaroidItem.vue:30` is gone — replaced with `font-display` (Rubik) — so the two-family rule (`DESIGN.md:137`) holds across the entire `apps/client/app` tree with no third-family exceptions to register.

Honey Signal Rule count on this page dropped from ~25-30 instances to ~8 instances, and the 8 are all signal-bearing (Hero `text-amber` for the designer's name per `design.json:narrative.rules:312`; the "currently working here" timeline node; muted `text-primary/40|50|60` signals on icons and bullets; hover states). The page is now in the same restrained register as the rest of the portfolio.

**Deterministic scan:** `detect.mjs --json` exit 0 on the page and the `PolaroidItem` component. The detector does not encode the amber motif count or the typeface rule, but a clean Tier-1 pass plus a clean grep (`font-serif` → 0 matches across the tree) confirms the consolidation.

## Design Health Score (after polish)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 3 → 3 | Unchanged. Error/empty states landed in the prior run. |
| 2 | Match System / Real World | 3 → 3 | Unchanged. Arabic clear, `ProfilePage` + `Person` schema, `ogUrl` explicit. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. Mobile timeline rail 1px neutral; "+N مسؤوليات أخرى" label is a known minor. |
| 4 | Consistency and Standards | 3 → **4** | **+1:** Two stat displays in the portfolio now reconciled (about matches landing's `Stats.vue`). `font-serif` third-family eliminated — two-family rule holds tree-wide. |
| 5 | Error Prevention | 3 → 3 | Unchanged. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. |
| 7 | Flexibility and Efficiency | 3 → 3 | Unchanged. |
| 8 | Aesthetic and Minimalist Design | 3 → **4** | **+1:** Amber motifs dropped from ~25-30 to ~8 instances. Stats block is no longer the SaaS hero-metrics template. Blockquote is neutral. Current experience card no longer duplicates the "currently here" signal. |
| 9 | Error Recovery | 3 → 3 | Unchanged. `LandingSectionFallback` with retry. |
| 10 | Help and Documentation | 3 → 3 | Unchanged. |
| **Total** | | **29 → 32/40** | **Good.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P1:** Stats section repeats icon-box + big-amber pattern removed from landing | **Closed** | `about.vue:232-244` — stat icon now `text-muted` (was `text-primary/40`), stat value now `text-highlighted` (was `text-amber`). The two stat treatments in the portfolio are now consistent. |
| **P3:** Amber exceeds its budget across the page | **Closed (significant)** | `about.vue:107` `text-amber` retained (Hero name, brand signal). `text-amber` removed from stat values (4×). `bg-primary/5` + `border-primary/30` + `text-primary-600/400` removed from the blockquote. `border-primary/30 bg-primary/5` removed from the current experience card. Net: ~25-30 amber motifs → ~8 (all signal-bearing). |
| **P3:** Primary-tinted icon-boxes recur across sections | **Closed (partial)** | Stats icon-box removed (the wrapper was already gone in `ced506e`; the icon is now `text-muted` bare). Experience timeline current-role node still has `bg-primary/10 border-primary/40 ring-primary/20` — that is the signal for "currently working here," a single focal accent, not a recurring motif. Skills section already used the restrained bare-icon treatment (`text-primary/60`). |
| **P3:** `PolaroidItem.vue:30` uses `font-serif` — third type family | **Closed** | `PolaroidItem.vue:30` `font-serif` → `font-display`. Grep confirms 0 matches for `font-serif` across `apps/client/app`. The two-family rule holds tree-wide. |

## What's Still Open

The page is now in the Good band. Nothing is P0 or P1. The remaining open items are minor / judgment calls:

- **Minor:** `+N مسؤوليات أخرى` (line 410-415 in the prior snapshot) is a label, not an expandable. Wiring it as a `<details>` would lift heuristic 7 a notch but the user explicitly kept it as a truncation in the prior critique.
- **Minor:** Hero `description` is hardcoded generic job-title copy (line 21, 32). The API provides the richer bio at `info.bio.paragraphs`. Could be replaced or hidden.
- **Minor:** `<ULink :to="exp.companySiteUrl" target="_blank">` — `target="_blank"` is correct, but worth verifying that `rel="noopener noreferrer"` is added (Nuxt UI's `ULink` may add this automatically).
- **Minor:** `<UColorModeAvatar>` uses `ring-primary/30` — tasteful brand touch, not an issue.

These are all small enough to be folded into a future routine pass or left as-is. The page is at the same "good enough" point that the `sdlc-ar` and `multi-mode-system` re-critiques reached in earlier runs.

## Inherited / Cross-Page Notes

- The two stat treatments are now consistent. The landing's `Stats.vue` is still the reference (it had this treatment first via the prior `fix(landing/Stats)` work). If a third stat display ever appears, it should follow the landing.
- The `font-display` (Rubik) treatment on the polaroid caption loses the "handwritten-on-the-back-of-a-photograph" affectation, but the polaroid metaphor survives through the drop-shadow + alternating rotation. The DESIGN.md does not need an exception note (the question of whether to register one is now moot — there is no third family).
- The amber strip in `polish/adr-global-data-critique-fixes` (the 6 shared components) is unrelated to the about page; the two fixes did not interact. Both inherit their own discipline.

## Persona Red Flags (after polish)

**Sam (screen reader / keyboard):** No regression. Heading structure and the `LandingSectionFallback` retry block unchanged.

**Jordan (the visitor here to decide if this person is trustworthy):** The page is now coherent in register. The Stats block matches the landing's stats (a page Riley would audit and find consistent). The blockquote is a neutral pull-quote, not a primary-tinted callout. The current-role highlight is on the timeline node, not duplicated on the card. The page reads as one piece.

**Riley (quality auditor):** All 4 P-items from the 2026-06-15T15-02-01 re-critique are closed. The minor items left are explicitly minor and not in any P-grade. Riley would likely score this page at 32-33 on a fresh pass.

**Casey (mobile reader):** No regression. The mobile timeline rail is 1px neutral; the polaroid gallery fans out cleanly; the experience cards stack. The Stat block has 2 columns on mobile (`grid-cols-2`) and 4 on `sm+`, with no overflow risk.

## Summary for the cycle

| Run | Score | Delta | Notes |
|-----|-------|-------|-------|
| 2026-06-15T09-39-52Z | 27/40 | baseline | First critique. P1 error states, P2 stats drift, P3 amber/icon-box, P3 mobile stripe, P3 font-serif, P3 empty-quote. |
| 2026-06-15T15-02-01Z | 29/40 | +2 | P1 + P3 mobile stripe + P3 empty-quote closed (`27f100b` + `ced506e`). |
| **2026-06-15T17-30-00Z (this)** | **32/40** | **+3** | P1 stats drift + P3 amber + P3 icon-boxes + P3 font-serif closed (`aa6d5dd`). |

Cumulative: **+5 over 3 runs on the same target**, with two branches that closed all 4 P-grade items. The page is now in the same Good band as the rest of the portfolio (28-32).

## Questions to Consider

1. The page is at 32/40 and Good. The remaining minor items (Hero description API, `+N مسؤوليات` details, ULink rel) are below P3. Is this the natural "good enough" point, or is there a next pass worth shipping?
2. The `font-display` (Rubik) treatment on the polaroid caption lost the "handwritten" affectation. Does the polaroid metaphor still read as a polaroid (drop-shadow + rotation), or does it now look more like a "card with a slight tilt"? If the latter, a follow-up pass could add a font that better matches (or document why Rubik is the deliberate choice for the caption).
3. The about page is now consistent with the landing's stat treatment. If a third stat display ever appears elsewhere (a project page, a learning-roadmap page), it should follow the same restraint.
