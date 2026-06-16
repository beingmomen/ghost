---
target: apps/client/app/pages/projects.vue
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-16T11-07-17Z
slug: apps-client-app-pages-projects-vue
---
# Re-critique — apps/client/app/pages/projects.vue

**Score: 30/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/projects.vue

**Trend for `apps-client-app-pages-projects-vue` (last 5 runs): 25 → 30** (+5)

**Re-run scope:** Verifying the 2 fixes shipped in commits `4a58bf8` and `2217f27` from the prior cycle: P1 error/empty state (landing's `LandingSectionFallback` pattern reused) and P2 redundant link + LCP eager. The P3 hero CTA divergence and the P3 missing `rel="noopener noreferrer"` were not in the fix scope.

## Anti-Patterns Verdict

**LLM assessment:** The page is no longer the destination that "looks broken" on data failure. The `LandingSectionFallback` pattern from the landing's projects section is now reused here, with the same aria-live, retry, and escape-hatch discipline. The `LandingSectionFallback` x2 instances (error + empty) close the page's biggest gap. The redundant-link issue is also closed: the inner "عرض المشروع" is now a `<span>` (not an `<a>`), and the whole-card `<UPageCard :to>` is the single, stretched link. The LCP fix (`:loading="index === 0 ? 'eager' : 'lazy'"`) is correct.

The page is now in the same Good band as the rest of the portfolio (28-32). Two minor items remain: the missing `rel="noopener noreferrer"` on the stretched-link card (the landing's variant has it; this one doesn't — a 1-line consistency fix), and the hero CTAs ("تواصل معي" + "أرسل بريد") diverge from the landing's "عرض أعمالي" + "تواصل معي" pattern. Both are below P3.

**Deterministic scan:** `detect.mjs --json` exit 0 on the page. Tier-1 only.

## Design Health Score (after fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 2 → **3** | **+1:** `LandingSectionFallback` × 2 (error + empty) at lines 94-110, with `default: () => []` on `useAPI`. On API failure, the page shows a retry-able error block. On zero projects, the page shows a contact escape-hatch. |
| 2 | Match System / Real World | 3 → 3 | Unchanged. Arabic fluent. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. Project links + contact. |
| 4 | Consistency and Standards | 2 → **3** | **+1:** Landing's `LandingSectionFallback` pattern reused. The redundant link is closed: the inner "عرض المشروع" is now a `<span>` (line 151), and the whole-card `<UPageCard :to="project.url">` is the single link. The hero CTAs still diverge from the landing's pattern (P3 carried). |
| 5 | Error Prevention | 3 → 3 | Unchanged. `default: () => []` on `useAPI`. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. "عرض المشروع" arrow is hover-only (P3 minor). |
| 7 | Flexibility and Efficiency | 3 → 3 | Unchanged. |
| 8 | Aesthetic and Minimalist Design | 3 → 3 | Unchanged. Zigzag layout intact. |
| 9 | Error Recovery | 1 → **3** | **+2:** The page no longer silently fails. `LandingSectionFallback` provides aria-live, retry, and a contact escape-hatch on both error and empty. This is the same exemplary pattern as the landing. |
| 10 | Help and Documentation | 2 → **3** | **+1:** Empty state provides a contact escape-hatch ("تواصل معي" → `/contact`). |
| **Total** | | **25 → 30/40** | **Good.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P1** No empty or error state on the projects page | **Closed** | `projects.vue:94-110` — `<LandingSectionFallback v-if="projectsError" ...>` (line 94) and `<LandingSectionFallback v-else-if="!projects?.length" ...>` (line 103). Plus `default: () => []` on the `useAPI` call (line 8). |
| **P2** Redundant link: whole card AND inner "عرض المشروع" point to the same URL | **Closed** | `projects.vue:151` — the inner "عرض المشروع" is now a `<span>` (not an `<a>`); the whole-card `<UPageCard :to="project.url">` is the single, stretched link. |
| **P2** First project image is lazy-loaded (LCP) | **Closed** | `projects.vue:164-165` — `:loading="index === 0 ? 'eager' : 'lazy'"` and `:fetchpriority="index === 0 ? 'high' : 'auto'"`. |

## What's Still Open

### From the prior 2026-06-08T14-27-48Z snapshot

- **P3 Inconsistent new-tab behavior + missing `rel`** — `projects.vue:122-127` — `<UPageCard :to="project.url" target="_blank">` lacks `rel="noopener noreferrer"`. The landing's `Projects.vue:48-54` has it on the `<NuxtLink>` instances. This is a 1-line consistency fix.
  - **Suggested command:** `/impeccable polish`

- **P3 Hero CTAs diverge from the site's CTA pattern** — `projects.vue:78-92` — "تواصل معي" (primary) + "أرسل بريد" (outline). The landing/global pattern is "عرض أعمالي" + "تواصل معي" (`global.links`). Here the labels, targets, and intent differ. *Was in the prior P3 list; the project's two main fixes targeted the higher-priority items, so this is still open.*
  - **Suggested command:** `/impeccable clarify`

### Minor (carried from prior)

- The reveal arrow is hover-only (`opacity-0` until `group-hover`), so it is invisible on touch devices. The text "عرض المشروع" still shows, so survivable, but the arrow is missed.

## Persona Red Flags (after fixes)

**Sam (screen reader / keyboard):** The whole-card `<UPageCard :to>` is now the single focusable link per project (the inner "عرض المشروع" is decorative). No more double tab-stop, no more double screen-reader announcement. The `LandingSectionFallback` is real interactive content (the retry button is focusable).

**Jordan (first visit, arriving from the "عرض أعمالي" CTA):** The page no longer fails silently. On a data error, the page shows a recoverable error block. On zero projects, the page shows a contact escape-hatch. The single highest-stakes failure on the page is closed.

**Casey (mobile, one-handed):** The hero CTAs are reachable (`تواصل معي` + `أرسل بريد`). The project cards have `max-sm:order-last` so the image stacks after the text on mobile. The first project image is now eager + high-priority, so it loads quickly. The reveal arrow is still hover-only, but the text label is visible.

**Riley (quality auditor):** Notes the empty/error landing, the single-link-per-card, and the LCP fix. Also notes the missing `rel="noopener noreferrer"` on the stretched card link — a 1-line consistency fix that the landing's `Projects.vue` has but this page doesn't. The hero CTAs diverge from the landing's pattern.

## Inherited / Cross-Page Notes

- The `LandingSectionFallback` pattern is now consistent across the landing (Projects, Blog, FAQ, Testimonials, WorkExperience), `about.vue`, `learning-roadmap.vue`, and now `projects.vue`. The pattern is portfolio-wide.
- The whole-card `<UPageCard :to>` as a stretched link is the same pattern as `landing/Projects.vue:48-54` — but `landing/Projects.vue` has `rel="noopener noreferrer"`, this page doesn't. 1-line consistency fix.
- The hero CTAs divergence is the one place this page has not converged with the landing. The label set is intentional here (this page is the *destination* of "عرض أعمالي", so the visitor is already seeing the work — contact is the right next step), but the divergence from the landing's CTA vocabulary is worth a doc note.

## Questions to Consider

1. The missing `rel="noopener noreferrer"` is a 1-line security/best-practice fix. Worth a small polish branch with the same commit message style as the prior `polish/blog-sidebar-raw-color-and-uppercase`?
2. The hero CTAs ("تواصل معي" + "أرسل بريد") diverge from the landing's "عرض أعمالي" + "تواصل معي" pattern. The divergence is defensible (this is the destination of the landing's CTA, so the visitor is already engaged with the work), but the labels and the use of `global.links` could be brought in line with the landing. Worth a `clarify` pass, or a doc note explaining the divergence?
3. The page is at 30/40 and Good. The remaining open items (missing `rel`, hero CTA divergence, hover-only arrow) are below P3. Is this the natural "good enough" point, or is there a next pass worth shipping?
