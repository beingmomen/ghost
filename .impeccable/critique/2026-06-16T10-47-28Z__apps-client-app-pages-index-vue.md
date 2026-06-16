---
target: apps/client/app/pages/index.vue
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-06-16T10-47-28Z
slug: apps-client-app-pages-index-vue
---
# Re-critique — apps/client/app/pages/index.vue (landing)

**Score: 32/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/index.vue (+ components/landing/*)

**Trend for `apps-client-app-pages-index-vue` (last 5 runs): 31 → 24 → 30 → 32** (the 24 was a deliberate re-baseline after the P0 email leak was discovered; 30 was the post-fix score; this run lands at 32 with two heuristic improvements)

**Re-run scope:** Verifying the post-2026-06-07 fixes (`cd40e06` mobile FAQ, `c4c7eca` Stats labels, `4a58bf8` Projects error/empty states, `266b414` hero atmosphere docs) and re-scoring against the 4 P2/P3 items the prior snapshot flagged.

## Anti-Patterns Verdict

**LLM assessment:** The page is structurally and visually solid. The mobile FAQ truncation (the prior P2) is closed by commit `cd40e06`: the category row now scrolls horizontally on mobile (`overflow-x-auto`) and stacks full-width above the content (`flex-col lg:flex-row`). Casey no longer has to guess which category tab a truncated label belongs to. The Projects section now uses `LandingSectionFallback` (commit `4a58bf8`) — same exemplary error/empty pattern as the other landing sections, with a `useAPI` failure triggering the same retry + escape-hatch flow.

The Hero still runs four atmospheric layers (mesh + dot grid + grain + glow) on the "الحضور الهادئ" north star, but the commit `266b414` adds documentation to `DESIGN.md` clarifying that the four-layer stack is intentional and reduced-motion is respected. So the "Hero atmosphere" P3 stays open in spirit but is now documented as deliberate.

The new tell worth tracking: **the landing's `Stats.vue` is now the outlier for the "text-amber on stat values" treatment.** The about page's stats were reconciled in `aa6d5dd` to `text-highlighted` (matching the brand's restrained register and the page's own design system note), but the landing's stats still carry `text-amber` on the four values. The two stat displays in the portfolio are now inconsistent in the *other* direction. The landing was the original source of the "restrained stat treatment" the about page was reconciled to — but the landing itself still has the SaaS-coded `text-amber` numbers the brand's `DESIGN.md` cautions against. This is a new P3 in this run.

**Deterministic scan:** `detect.mjs --json` exits 0 across the page and all 9 `landing/*` components. Tier-1 only.

## Design Health Score (after fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 3 → 3 | Unchanged. Availability badge + count-up + `LandingSectionFallback` fallbacks. Still no `<NuxtLoadingIndicator>` (minor, `app.vue` could add it). |
| 2 | Match System / Real World | 3 → 3 | Unchanged. Round Stats numbers (`+50 عميل`, `+10 مشروع`, `+5 سنوات`, `3 شركات`) still unproven on the page (P2 carried). Labels are now clearer (commit `c4c7eca`) but the underlying claim is the same. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. Carousel pauses on touch/hover/focus. No anchors / back-to-top. |
| 4 | Consistency and Standards | 3 → 3 | Unchanged. Coherent visual system. Code-level: `Blog.vue` uses `useFetch`, `Projects.vue` uses `useAPI` for the same kind of call (P3 minor from the prior snapshot, harmless but worth a refactor). |
| 5 | Error Prevention | 3 → 3 | Unchanged. `LandingSectionFallback` solid. |
| 6 | Recognition Rather Than Recall | 3 → **4** | **+1:** FAQ mobile truncation fixed (commit `cd40e06`). The category row now scrolls horizontally on mobile (`overflow-x-auto`, `min-w-0`) and stacks full-width above the content (`flex-col lg:flex-row`). Mobile users can read all category labels and the layout is no longer squeezing the list beside the content. The "FAQ behind tabs still forces category guessing" finding is now closed. |
| 7 | Flexibility and Efficiency | 3 → 3 | Unchanged. Fixed nav + footer CTA keeps contact always reachable; no anchors on this long page. |
| 8 | Aesthetic and Minimalist Design | 3 → 3 | Unchanged. Hero still runs 4 atmospheric layers; `DESIGN.md` now documents the choice (commit `266b414`). Reduced-motion respected (`.hero-glow { animation: none; }` at the `prefers-reduced-motion: reduce` breakpoint in `Hero.vue:243-251`). |
| 9 | Error Recovery | 4 → 4 | Unchanged. `LandingSectionFallback` is still exemplary (aria-live, non-alarming Arabic copy, retry + escape-hatch). |
| 10 | Help and Documentation | 2 → **3** | **+1:** Mobile FAQ fix + `LandingSectionFallback` aria-live. The "FAQ exists but buried at bottom" minor persists, but the discoverability of the FAQ (now mobile-friendly) and the quality of the recovery across the landing lifts the score. |
| **Total** | | **30 → 32/40** | **Good.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P2** Mobile FAQ tab labels truncate | **Closed** | `FAQ.vue:67-78` — `root: 'flex flex-col lg:flex-row lg:items-center gap-4 w-full'` (mobile stacks the category row above the content, full width), `list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0 min-w-0 overflow-x-auto'` (category nav scrolls horizontally on overflow). `cd40e06` fix. |
| **P3** Projects section has no error/empty state | **Closed** | `Projects.vue:22-32` — `<LandingSectionFallback v-if="projectsError" ... @retry="refreshProjects()">`. Same pattern as the other landing sections. `4a58bf8` fix. |

## What's Still Open

### From the prior 2026-06-07T18-53-52Z snapshot

- **P2 Stats present unproven round numbers** — `Stats.vue:4-9` still asserts `+50 عميل`, `+10 مشروع`, `+5 سنوات`, `3 شركات` with no evidence on the page. The labels are now clearer (commit `c4c7eca`); the underlying claim is unchanged. The page's stated brand value is "مفيش وعود فارغة" / "عارض اللي عنده بصراحة" — round, evidence-free counters sit in mild tension with that stance. *The about page's stats were reconciled to `text-highlighted` in `aa6d5dd` to drop the SaaS hero-metrics template, but this is a content claim, not a styling one; the styling fix on the about page did not address the content question here.*
  - **Fix:** Tie the numbers to something concrete (link projects count to the real DB count, name the 3 companies via the WorkExperience section), or soften the framing. Optional, low priority — the page is at Good.
  - **Suggested command:** `/impeccable clarify`

- **P3 Hero stacks four atmospheric layers** — `Hero.vue:10-21, 110-119`. The four-layer stack is now documented in `DESIGN.md` (commit `266b414`) as deliberate, with `prefers-reduced-motion` respected. So this is *closed in spirit* — the choice is on the record. The atmospheric density remains the densest moment on an otherwise restrained page; if a future pass drops one layer (the grain or the grid), the page would feel closer to "quiet presence." Optional.
  - **Suggested command:** `/impeccable quieter`

- **P3 `UColorModeAvatar` serves identical light/dark image** — `Hero.vue:120-127 + app.config.ts:12-14`. `picture.light === picture.dark` (same Cloudinary URL). The color-mode-aware component does extra work for no visible difference. Either provide a real dark-mode variant or use a plain `<NuxtImg>`.
  - **Suggested command:** `/impeccable polish`

- **Minor (carried):** `Blog.vue` uses `useFetch` while `Projects.vue` uses `useAPI` for the same kind of call — code-level consistency. Worth a small refactor.
- **Minor (carried):** `WorkExperience.vue` has only error + content branches (no empty state). Safe today because data is static, but brittle if it ever moves to the API.
- **Minor (carried):** No `<NuxtLoadingIndicator>` in `app.vue` for internal navigation feedback.

### New in this run

- **P3 `Stats.vue:85` uses `text-amber` on stat values, but `about.vue`'s reconciled stats are now `text-highlighted`** — the two stat displays in the portfolio are inconsistent in the *other* direction. The about page was reconciled to a restrained treatment to match the landing; the landing itself still carries the SaaS-coded `text-amber` numbers the brand's `DESIGN.md` cautions against. The same fix (`text-amber` → `text-highlighted` on the stat values) that landed in `aa6d5dd` for `about.vue` would also apply here.
  - **Fix:** `Stats.vue:85` `text-amber` → `text-highlighted`. Two-character change. The count-up animation and `aria-label` stay; the landing's `text-primary/40` icon stays (it's a muted signal, not amber overload).
  - **Suggested command:** `/impeccable quieter`

## Inherited / Cross-Page Notes

- The mobile-FAQ fix in `cd40e06` is landing-specific. The same `UTabs` component is also used in admin pages (`agents/commands/mcp/skills/index.vue` use a similar pattern for selection toolbars); the fix pattern would apply there too, but those are dev-only.
- The `LandingSectionFallback` pattern in `Projects.vue` is now identical to the other landing sections. The pattern is consistent across the landing. Out of 5 lazy-loaded sections (Stats, Projects, Blog, Testimonials, FAQ), 4 use `LandingSectionFallback` (Stats is static data so no fallback needed; Testimonials delegates to `TestimonialCarousel`).
- The `text-amber` → `text-highlighted` flip on `Stats.vue:85` would make the landing consistent with the about page after `aa6d5dd`, and the rationale in the about snapshot ("the SaaS hero-metrics template" → "the brand's restrained register") applies symmetrically.

## Persona Red Flags (after fixes)

**Sam (screen reader / keyboard):** No regression. The FAQ tabs are now mobile-friendly; tab labels are no longer truncated. The `aria-live` on the SectionFallback is real (state-aware). The count-up animation is decorative-only (aria-hidden on the icon, real `aria-label` on the stat cell).

**Jordan (first visit, deciding whether to reach out):** The page's friction path is now in good shape: Hero → About (real story) → Testimonials (no leaked emails, fixed in `a4f09bf` and `e8f35d6`) → FAQ (now mobile-friendly) → footer CTA. Remaining doubt: the round Stats numbers with no backing. The about page's stats reconciliation made the numbers less SaaS-coded, but the underlying claim is unchanged.

**Casey (mobile, 60 seconds):** FAQ category tabs are no longer truncated. Carousel still pauses on touch. The polaroid-style polaroid gallery in the about page is the closest cousin in the portfolio to the kind of restraint this page needs, but the landing is structurally different (it's a grid of sections, not a personal narrative).

**Riley (quality auditor):** Notes the mobile FAQ fix and the Projects error/empty landing. Also notes the inverse of the about-page finding: the landing's `Stats.vue` is now the SaaS-coded outlier (`text-amber` on stat values), where the about page's stats are now restrained (`text-highlighted`). The fix is the same two-character change.

## Summary for the cycle

| Run | Score | Delta | Notes |
|-----|-------|-------|-------|
| 2026-06-07T14-19-28Z | 31/40 | baseline | First critique. P0 client-email leak. |
| 2026-06-07T15-17-58Z | 24/40 | −7 | P0 email leak surfaced mid-cycle. |
| 2026-06-07T18-53-52Z | 30/40 | +6 | P0 + P2 closed. |
| **2026-06-16T11-00-00Z (this)** | **32/40** | **+2** | P2 mobile FAQ + P3 Projects error/empty closed. |

Cumulative: **+1 over 4 runs on the same target** (the page lost 7 then gained 8). The page is now in the same Good band as the rest of the portfolio (28-32).

## Questions to Consider

1. The landing's `Stats.vue` is now the SaaS-coded outlier for stat-value styling, where the about page was the outlier a moment ago. The two-character `text-amber` → `text-highlighted` fix would close the loop. Is the landing's `text-amber` on stat values a deliberate "the landing is the hero, the about is restrained" choice, or an accidental holdover from before the design system was tightened?
2. The Hero still runs 4 atmospheric layers at 14-30% opacity. The documentation now records the choice. Is there a future pass where the page would feel more on-brand by dropping one layer (e.g. the film grain), or is the current density the right ceiling?
3. The page is at 32/40 and Good. The remaining open items are content questions (Stats numbers, UColorModeAvatar parity) and code-style nits (useFetch vs useAPI split). Is this the natural "good enough" point, or is there a next pass worth shipping?
