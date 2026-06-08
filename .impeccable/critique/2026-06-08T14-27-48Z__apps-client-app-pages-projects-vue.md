---
target: apps/client/app/pages/projects.vue
total_score: 25
p0_count: 0
p1_count: 1
timestamp: 2026-06-08T14-27-48Z
slug: apps-client-app-pages-projects-vue
---
# Critique — apps/client/app/pages/projects.vue

**Score: 25/40 (Acceptable)** | P0: 0 | P1: 1 | Target: apps/client/app/pages/projects.vue

## Anti-Patterns Verdict

**LLM assessment:** Not AI-slop. The alternating zigzag of horizontal `naked` cards (reverse on odd index) avoids the identical-card-grid tell, reads editorial, and fits the brand's flat-by-default elevation. No gradient text, no eyebrow-per-section, no SaaS-metrics. Clean and on-brand.

**Deterministic scan:** `detect.mjs` exit 0, 0 findings. Vue SFC skips Tier 2 page-level checks; confirms absence of Tier 1 tells.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | On API failure or zero projects the page is silently empty (hero + blank section), no feedback |
| 2 | Match System / Real World | 3/4 | Arabic fluent; hero's only actions are contact CTAs, slightly off-purpose for a projects page |
| 3 | User Control and Freedom | 3/4 | Project links + contact reachable; no filter/sort (fine for small set), no back-to-top |
| 4 | Consistency and Standards | 2/4 | Hero CTAs diverge from the global pattern; redundant card-link + inner link; no fallback while landing has one |
| 5 | Error Prevention | 3/4 | Minimal input surface; inner link `target="_blank"` lacks `rel="noopener"` |
| 6 | Recognition Rather Than Recall | 3/4 | Labels clear and visible; "عرض المشروع" arrow is hover-only (invisible on touch) |
| 7 | Flexibility and Efficiency | 3/4 | Contact CTAs in hero, external project links; no on-site project depth |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean alternating layout, naked cards, correct RTL |
| 9 | Error Recovery | 1/4 | No error handling at all: failure shows nothing, no message, no retry |
| 10 | Help and Documentation | 2/4 | Contact reachable; no empty-state guidance |
| **Total** | | **25/40** | **Acceptable — needs an empty/error state before it's solid** |

## Overall Impression

A clean, well-built showcase with strong SEO and an editorial layout, but it lacks the one thing the landing page does best: graceful failure. This is the destination of the primary "عرض أعمالي" CTA, yet on an API error or an empty result it renders a hero over blank space with no explanation. The biggest opportunity is to bring the landing's `SectionFallback` discipline to the page that matters most for converting a visitor into a lead.

## What's Working

1. **SEO is thorough.** `CollectionPage` + `ItemList` JSON-LD, breadcrumb schema, full `useSeoMeta` with OG/Twitter. Better than most portfolio project pages.
2. **Alternating zigzag layout** (horizontal naked cards, reversed on odd index) avoids the monotonous card grid and reads editorial, on-brand for flat-by-default.
3. **RTL is correct** throughout: forced `text-right` on hero, `justify-start` links, `i-lucide-arrow-left` as the forward arrow, `max-sm:order-last` to keep image after text on mobile.

## Priority Issues

### [P1] No empty or error state on the projects page
- **File:** projects.vue:5-14 (no `default`, no error branch), :99-154 (only `v-for`, no fallback)
- The page's entire purpose is showing projects. `useAPI` has no `default` and the template has no error/empty branch. On API failure or zero active projects, the visitor sees the "المشاريع" hero over blank space with no message and no retry. This is the destination of the landing's primary CTA, and it is the one page that should never look broken. The landing already solves this with `LandingSectionFallback`; this page ignores it.
- **Fix:** Add error and empty states (reuse the SectionFallback pattern): retry on error, a "لا توجد مشاريع حالياً" + contact escape-hatch on empty. Add `default: () => []`.
- **Suggested command:** `/impeccable harden`

### [P2] Redundant link: whole card AND inner "عرض المشروع" point to the same URL
- **File:** projects.vue:104-107 (UPageCard `to`) + :132-142 (inner ULink to same `project.url`)
- UPageCard with `to` uses a stretched link (the entire card is clickable). The inner "عرض المشروع" link targets the same URL, so there are two links to one destination: a double tab-stop and a double screen-reader announcement, and the inner link may sit under the stretched overlay.
- **Fix:** Keep the whole-card link and turn "عرض المشروع" into a non-link visual cue (a `<span>` with the arrow), or drop the card `to` and keep only the explicit link.
- **Suggested command:** `/impeccable polish`

### [P2] First project image is lazy-loaded (LCP)
- **File:** projects.vue:144-151 — every `NuxtImg` has `loading="lazy"`
- The first project's image is above the fold and is the likely LCP element, but it is lazy-loaded, which defers the largest paint. (Contrast the hero avatar, which is correctly `eager` + `fetchpriority="high"`.)
- **Fix:** Make the first card's image `loading="eager"` with `fetchpriority="high"` (e.g. `:loading="index === 0 ? 'eager' : 'lazy'"`); keep the rest lazy.
- **Suggested command:** `/impeccable optimize`

### [P3] Inconsistent new-tab behavior + missing rel
- **File:** projects.vue:104-107 (card `to`, no target → same tab) vs :132-134 (inner link `target="_blank"`, no `rel`)
- The card link opens in the same tab while the inner link opens a new tab to the same URL, and the inner `target="_blank"` lacks `rel="noopener noreferrer"` (the landing's Projects.vue sets it).
- **Fix:** Unify the external-link behavior and add `rel="noopener noreferrer"`.
- **Suggested command:** `/impeccable polish`

### [P3] Hero CTAs diverge from the site's CTA pattern
- **File:** projects.vue:77-92 — "تواصل معي" (primary) + "أرسل بريد" (outline)
- The landing/global pattern is "عرض أعمالي" + "تواصل معي" (`global.links`). Here the labels, targets, and intent differ, so the primary action language is inconsistent across pages.
- **Fix:** Align with the established CTA vocabulary or justify the divergence.
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Jordan (first visit, arriving from the "عرض أعمالي" CTA):** If the API hiccups, lands on "المشاريع" over empty space with no explanation. Concludes the site is broken and leaves. The single highest-stakes failure on the page.

**Casey (mobile, one-handed):** The "عرض المشروع" arrow is `opacity-0` until `group-hover`, so it never appears on touch (the text still shows, so survivable). First project image is lazy, so it may pop in late on a slow connection.

**Riley (developer auditing quality):** Throttles the network or forces an error and sees a blank page with no fallback, directly inconsistent with the landing's polished `SectionFallback`. Inspects the DOM and finds two links to the same URL per card, a lazy-loaded LCP image, and `target="_blank"` without `rel`. Reads as less finished than the landing.

## Minor Observations

- `useAPI` here lacks `default: () => []` that the landing's Projects.vue has; fold it into the empty-state fix.
- The reveal arrow is hover-only, so it is invisible on touch devices.
- Inconsistent target between the card link (same tab) and the inner link (new tab) to the same destination.

## Questions to Consider

1. The landing's projects section fails gracefully (SectionFallback), but the dedicated /projects page, the destination of the primary CTA, does not. Should the page reuse the exact same fallback so the most-clicked destination never looks broken?
2. Every project links straight off-site (`target="_blank"`). What would a real on-site project detail page (`/projects/[slug]`) do for SEO depth and for keeping a deciding visitor on the site?
3. The hero's only actions are "contact me" and "email". On a page a visitor opened specifically to judge the work, is contact the right primary action, or should the work itself be the focus first?
