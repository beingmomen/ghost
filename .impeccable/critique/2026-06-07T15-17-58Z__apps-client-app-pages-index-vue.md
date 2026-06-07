---
target: apps/client/app/pages/index.vue
total_score: 24
p0_count: 1
p1_count: 2
timestamp: 2026-06-07T15-17-58Z
slug: apps-client-app-pages-index-vue
---
# Critique — apps/client/app/pages/index.vue

**Score: 24/40** | P0: 1 | P1: 2 | Target: apps/client/app/pages/index.vue

## Heuristic Scores

| # | Heuristic | Score | Finding |
|---|-----------|-------|---------|
| 1 | Visibility of System Status | 3/4 | Availability badge excellent; no loading state for API-driven sections |
| 2 | Match System / Real World | 3/4 | Arabic-first correct; +50 عميل claim has no supporting evidence on page |
| 3 | User Control and Freedom | 2/4 | Carousel no touch-pause; no back-to-top; no anchor links |
| 4 | Consistency and Standards | 3/4 | Visually consistent; SectionHeading pattern repeated on every section |
| 5 | Error Prevention | 2/4 | SectionFallback present; no loading state to prevent confusion on slow connections |
| 6 | Recognition Rather Than Recall | 3/4 | CTAs clear; FAQ behind tabs forces users to guess category |
| 7 | Flexibility and Efficiency | 2/4 | No anchor links; no persistent CTA at page bottom |
| 8 | Aesthetic and Minimalist Design | 2/4 | Hero layers 4 simultaneous atmospheric effects on a "الحضور الهادئ" page |
| 9 | Error Recovery | 3/4 | SectionFallback tight; Testimonials shows email as attribution |
| 10 | Help and Documentation | 1/4 | FAQ buried at page bottom; no contact path after it |
| **Total** | | **24/40** | |

## Priority Issues

### P0 — Testimonials renders client email as public attribution
- **File:** Testimonials.vue:19 — `description: item.email`
- UUser shows item.email as visible subtitle under client name. Publishing client emails without consent is a privacy violation and makes testimonials look like test data.
- **Fix:** Use `role + company` ("مدير منتج، شركة X") or omit description field.

### P1 — No loading states for API-driven sections
- **Files:** Projects.vue, Testimonials.vue, FAQ.vue, WorkExperience.vue
- All use `v-else-if` with no `v-if="pending"` branch. On slow connections, sections are silently absent — indistinguishable from empty/error state.
- **Fix:** Add skeleton placeholder or subtle spinner per section awaiting API.

### P1 — Page ends with FAQ, no closing CTA
- **File:** index.vue:63-66 — LazyLandingFAQ is the last element
- The user who reaches FAQ is at peak intent. No "تواصل معي" or "احجز اجتماع" follows it. Highest-intent moment has no conversion path.
- **Fix:** Add a closing CTA section after LazyLandingFAQ.

### P2 — About section duplicates Hero description verbatim
- **File:** app.config.ts:6 vs :39-40
- "من أنا؟" promises a human answer and delivers the same job title copy. No story, no stack, no personality.
- **Fix:** Replace with 2-3 sentences that add new information — a stance, working style, or real specialization.

### P2 — Testimonials carousel 4-second delay too fast for Arabic reading
- **File:** Testimonials.vue:48 — `delay: 4000`
- Full Arabic quotes need 6–10s for comfortable reading. No touch-pause on mobile.
- **Fix:** Raise delay to 6000ms; add `stopOnTouchStart: true`.

## What Works Well

- SectionFallback system is exceptionally considered: aria-live, non-alarming Arabic copy, retry button, escape-hatch links. Rare at this level in a portfolio.
- 4+8 grid with sticky section headings creates genuine browse UX; better than centered headings.
- Accessibility baseline strong: prefers-reduced-motion in CSS and JS, correct aria-hidden on decorative elements, consistent contrast overrides.

## Anti-Pattern Verdict

No gradient text, no side-stripe borders, no hero-metrics template, no bounce easing. Confirmed by deterministic detector (exit 0) and manual assessment. Previous anti-pattern work held.

One active tell: eyebrow label on every single section (`LandingSectionHeading` with eyebrow prop in Hero, About, WorkExperience, Projects, Testimonials, Blog, FAQ). This is the 2024 AI-portfolio grammar. Reducing to 3–4 selective uses would sharpen the brand voice.

## Persona Red Flags

**Jordan (first visit, referral, deciding to reach out):** Reads Hero → About (same copy, trust dips) → Testimonials (sees email, looks like dev data) → FAQ (finds answers) → no CTA → has to scroll back to nav.

**Casey (mobile, 60 seconds):** Carousel advances before finishing Arabic quote. FAQ tabs with truncated Arabic labels on 375px. No bottom CTA means upward scroll to contact.

**Riley (developer, auditing technical quality):** On throttled connection, API sections are silently absent with no loading indicator. Testimonials show email addresses. Both read as incomplete work.

## Detector Findings

Exit 0 — 0 findings. Note: Vue SFCs skip Tier 2 full-page checks (requires `<!doctype` HTML). Confirms Tier 1 (gradient text, side-stripe borders, broken images) are genuinely absent.
