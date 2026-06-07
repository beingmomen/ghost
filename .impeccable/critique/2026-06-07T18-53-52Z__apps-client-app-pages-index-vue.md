---
target: apps/client/app/pages/index.vue
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-07T18-53-52Z
slug: apps-client-app-pages-index-vue
---
# Critique — apps/client/app/pages/index.vue

**Score: 30/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/index.vue

## Anti-Patterns Verdict

**LLM assessment:** Does not read as AI-generated. The page actively refuses the tells documented in DESIGN.md: no gradient text (`.text-amber` solid replacement), no side-stripe borders, no SaaS hero-metrics gradient template, no cream/warm-neutral background (stone canvas at chroma ~0). The fixes since the last pass held: testimonials no longer leak client emails, About tells a journey instead of repeating the hero, carousel paces for Arabic reading. The one recurring device — an amber section label ("eyebrow") with a short dash — appears on 3 asymmetric sections (Projects, Blog, FAQ) via a deliberate sticky-heading component. In Arabic (no uppercase, no tracking) and on separate folds, this reads as a coherent system, not AI scaffolding.

**Deterministic scan:** `detect.mjs` exit 0, 0 findings across index.vue + landing components. Vue SFCs skip Tier 2 full-page checks (those need `<!doctype` HTML), so this confirms the absence of Tier 1 tells (gradient text, side-stripe borders, broken images) rather than a full page-level pass.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Availability badge + count-up + fallbacks strong; no NuxtLoadingIndicator for internal navigation feedback |
| 2 | Match System / Real World | 3/4 | Arabic-first excellent; Stats round numbers (+50 عميل, +10 مشروع) unproven on page |
| 3 | User Control and Freedom | 3/4 | Carousel now pauses on touch/hover/focus; no anchor links or back-to-top |
| 4 | Consistency and Standards | 3/4 | Coherent visual system; Blog uses useFetch, Projects useAPI (code-level only) |
| 5 | Error Prevention | 3/4 | SectionFallback solid; minimal input surface on a landing page |
| 6 | Recognition Rather Than Recall | 3/4 | CTAs clear; FAQ behind tabs still forces category guessing |
| 7 | Flexibility and Efficiency | 3/4 | Fixed nav + footer CTA on every page = contact always reachable; no anchors |
| 8 | Aesthetic and Minimalist Design | 3/4 | Mostly clean; Hero stacks 4 atmospheric layers (mesh + grid + grain + glow) on a "quiet presence" brief |
| 9 | Error Recovery | 4/4 | SectionFallback is exemplary: aria-live, non-alarming Arabic copy, retry + escape-hatch links |
| 10 | Help and Documentation | 2/4 | FAQ exists but buried at bottom, not searchable/contextual; mobile tab labels truncate |
| **Total** | | **30/40** | **Good — solid foundation, P2/P3 refinements remain** |

## Overall Impression

The page graduated from "Acceptable (24)" to "Good (30)". The P0 (email privacy) and both P2 content issues are resolved, and the two P1s were correctly reframed as intentional architecture (block navigation) or already-covered (footer CTA) and documented so they won't resurface. What remains is genuinely minor: a few credibility and mobile-polish details, plus the standing question of whether the Hero's atmospheric density matches the "quiet presence" north star. No blocking or major issues remain.

## What's Working

1. **SectionFallback is exemplary error recovery.** aria-live, non-alarming Arabic copy, retry button, and escape-hatch links (e.g. "كل المشاريع" → /projects). This is well above the portfolio norm and is why heuristic 9 scores 4/4.
2. **The fixes since last pass are clean and correct.** Email removed at both server select() and frontend mapping; About now tells a frontend → design-systems → performance journey; carousel paced at 6s with stopOnInteraction for touch. No regressions introduced.
3. **The asymmetric 4+8 sticky-heading layout** gives Projects/Blog/FAQ a genuine browse rhythm, distinct from the centered-heading SaaS template the brand explicitly rejects.

## Priority Issues

### [P2] Mobile FAQ tab labels truncate
- **File:** FAQ.vue:73 — `label: 'truncate'` on UTabs
- On a 375px screen with the mobile-majority Arabic audience, long category names truncate and become hard to distinguish. The user can't tell tabs apart at a glance.
- **Fix:** Allow wrapping or horizontal scroll for the tab list on small screens, or shorten category labels.
- **Suggested command:** `/impeccable adapt`

### [P2] Stats present unproven round numbers
- **File:** Stats.vue:4-9 — "+50 عميل", "+10 مشروع", "+5 سنوات", "3 شركات"
- PRODUCT.md's brand values are "مفيش وعود فارغة" / "عارض اللي عنده بصراحة". Round, evidence-free counters sit in mild tension with that honesty stance — they read as template filler rather than proof.
- **Fix:** Either tie the numbers to something concrete (link projects count to the real DB count, name the 3 companies via the WorkExperience section), or soften the framing.
- **Suggested command:** `/impeccable clarify`

### [P3] Hero stacks four atmospheric layers
- **File:** Hero.vue:10-21, 110-119 — mesh + dot grid + film grain + animated avatar glow
- All four run simultaneously on a page whose north star is "الحضور الهادئ" (the quiet presence). Opacities are mostly within the 14-30% spec and reduced-motion is handled, so this is well-executed, not broken — but it's the densest moment on an otherwise restrained page.
- **Fix:** Consider dropping one layer (the grain or the grid) and letting the amber mesh + glow carry the atmosphere.
- **Suggested command:** `/impeccable quieter`

### [P3] UColorModeAvatar serves identical light/dark image
- **File:** Hero.vue:120-127 + app.config.ts:12-14 — picture.light === picture.dark (same Cloudinary URL)
- The color-mode-aware avatar component does extra work for no visible difference. Either provide a real dark-mode variant or use a plain NuxtImg.
- **Suggested command:** `/impeccable polish`

## Persona Red Flags

**Jordan (first visit, referral, deciding whether to reach out):** Reads Hero → About now adds a real story (fixed) → Testimonials show name + photo, no leaked emails (fixed) → FAQ answers questions → footer CTA gives a clear "تواصل معي / احجز اجتماع". The friction path from the last pass is largely closed. Remaining doubt: the round Stats numbers with no backing.

**Casey (mobile, one-handed, 60 seconds):** Carousel now waits 6s and pauses on touch (fixed). Remaining snag: FAQ category tabs truncate on 375px, so she can't tell categories apart. Footer CTA is reachable but requires a full scroll.

**Riley (developer auditing quality):** No leaked emails, fallback states recover gracefully, reduced-motion respected, contrast overrides documented. WorkExperience has no empty-state branch (only error + content), but its data is static so it can't actually be empty. Notes the useFetch/useAPI split as a code-consistency nit, not a user issue.

## Minor Observations

- WorkExperience.vue has only error + content branches (no empty state); safe today because data is static, but brittle if it ever moves to the API.
- Blog.vue uses `useFetch` while Projects.vue uses `useAPI` for the same kind of call — harmless but worth unifying.
- The amber section-label dash appears on 3 folds; fine as a system, but if a 4th amber element joins any single fold, check it against the Honey Signal Rule (3 amber moments max per screen).

## Questions to Consider

1. The Stats section asserts "+50 عميل" with no evidence on the page. On a portfolio whose stated value is "no empty promises", what would happen to trust if those numbers were replaced with one concrete, verifiable proof (a named client, a live project count)?
2. The Hero runs four atmospheric layers at once. If "الحضور الهادئ" were taken literally, which single layer would you keep?
3. Every section still routes the visitor outward (projects → external, blog → /blog, contact → /contact). What would one fully-contained case study on this page do for someone deciding in 30 seconds?
