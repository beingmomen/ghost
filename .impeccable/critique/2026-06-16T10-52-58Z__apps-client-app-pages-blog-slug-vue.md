---
target: apps/client/app/pages/blog/[slug].vue
total_score: 31
p0_count: 0
p1_count: 0
timestamp: 2026-06-16T10-52-58Z
slug: apps-client-app-pages-blog-slug-vue
---
# Critique — apps/client/app/pages/blog/[slug].vue

**Score: 31/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/blog/[slug].vue (+ components/blog/* + pages/blog/index.vue)

**Trend for `apps-client-app-pages-blog-slug-vue` (last 5 runs): 29 → 31** (+2)

**Re-run scope:** Verifying the 2 P2 fixes and 2 P3 fixes shipped in commit `7000bd6` from the prior cycle: soft-404 fix, TOC guard, stale `color="gray"` → `color="primary"|'neutral'`, and the hero image LCP fix. The P3 mobile TOC + mobile share is still open (was not in the fix scope).

## Anti-Patterns Verdict

**LLM assessment:** The page is the most technically careful page in the project (this held from the prior critique). The article rendering is security-conscious (`DOMPurify.sanitize` on the `v-html`, with the `eslint-disable vue/no-v-html` scoped tightly around the one `v-html`). The SEO is the most complete anywhere (`Article` JSON-LD with author + publisher + sameAs + dates + mainEntityOfPage, canonical link, full OG/Twitter article tags). The table of contents is a real scroll-spy with throttled (`requestAnimationFrame`) scroll handling. Two P2 issues from the prior critique are now closed.

The `BlogSidebarLinks.vue` still uses `text-gray-900 dark:text-white` (raw Tailwind colors, bypassing the brand's `text-highlighted`/`text-muted` semantic tokens), and `uppercase` on the button links (a no-op on Arabic, valid on English link labels — the page is bilingual by design, so this is a minor). The TOC and share buttons remain desktop-only (the `BlogSidebar` lives in `UPage`'s right slot, which collapses on mobile). The page is at 31/40 in the same Good band as the rest of the portfolio.

**Deterministic scan:** `detect.mjs --json` exits 0 on the page, the 3 `blog/*` components, and the `blog/index.vue` page. Tier-1 only.

## Design Health Score (after fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 3 → 3 | Unchanged. Date + read-time + real not-found state. No loading (block-nav, intentional per `apps/client/CLAUDE.md:38-57`). |
| 2 | Match System / Real World | 3 → 3 | Unchanged. Arabic + `ar-EG` date formatting + read-time. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. Back link (`to="/blog"`) + scroll-spy TOC + 6-network share buttons (desktop only). |
| 4 | Consistency and Standards | 3 → **4** | **+1:** `color="gray"` → `color="primary"|'neutral'` in `BlogSidebarTableOfContents.vue:15`. `text-gray-900` → `text-highlighted` in `BlogSidebarTableOfContents.vue:3`. The `BlogSidebarLinks.vue:3` still uses `text-gray-900 dark:text-white` (raw Tailwind colors) — minor remaining. |
| 5 | Error Prevention | 2 → **3** | **+1:** TOC guard `|| []` in `BlogSidebarTableOfContents.vue:37`. A heading-less post no longer throws on mount. `DOMPurify.sanitize` on the `v-html` content remains. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. TOC makes structure visible. |
| 7 | Flexibility and Efficiency | 3 → 3 | Unchanged. TOC + 6-network share, but both desktop-only (P3 mobile carried). |
| 8 | Aesthetic and Minimalist Design | 3 → 3 | Unchanged. Clean centered header + article body. |
| 9 | Error Recovery | 2 → **3** | **+1:** Soft-404 fix landed (`setResponseStatus(useRequestEvent(), 404)` at `blog/[slug].vue:19`). The inline not-found UI is preserved; the HTTP status is now correct (404 instead of 200). |
| 10 | Help and Documentation | 3 → 3 | Unchanged. TOC is the in-page guide. |
| **Total** | | **29 → 31/40** | **Good.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P2** Missing article is a soft 404 (HTTP 200) | **Closed** | `blog/[slug].vue:19` — `if (import.meta.server && !singleBlog.value?.title) { setResponseStatus(useRequestEvent(), 404) }`. Inline UI is preserved. |
| **P2** TOC maps over a possibly-undefined `tableOfContents` | **Closed** | `BlogSidebarTableOfContents.vue:37` — `computed(() => singleBlog.value.tableOfContents || [])`. A heading-less post no longer throws. |
| **P3** Stale color tokens in the TOC | **Closed (partial)** | `BlogSidebarTableOfContents.vue:3, 15` — `text-highlighted` and `color="primary"|'neutral'`. The `BlogSidebarLinks.vue:3` still uses `text-gray-900 dark:text-white` (raw Tailwind colors, minor). |
| **P3** Article hero image lacks dimensions and eager loading | **Closed** | `blog/[slug].vue:149-158` — `width="1200" height="400" loading="eager" fetchpriority="high"`. Hero image is the LCP candidate and is now eager + high-priority. |

## What's Still Open

### From the prior 2026-06-15T09-55-53Z snapshot
- **P3 The TOC and share buttons are desktop-only** — `blog/[slug].vue:186-188` (`<template #right>` slot) → `BlogSidebar`. The sidebar lives in `UPage`'s right slot, which collapses on smaller screens, so the mobile-majority audience loses both the table of contents and the share buttons on the page where reading and sharing matter most. *Not in scope of commit `7000bd6`.*
  - **Fix:** Surface a collapsed TOC (a `<details>` at the top of the article body) and a share row inline for mobile. Hidden on `lg+` where the sidebar is already visible. The same `<details class="lg:hidden">` pattern landed for `global-data.vue:17-37`; reuse the structure.
  - **Suggested command:** `/impeccable adapt`

- **Minor:** `BlogSidebarLinks.vue:3` uses raw Tailwind colors (`text-gray-900 dark:text-white`) instead of the brand's semantic tokens (`text-highlighted` or `text-muted`).
- **Minor:** `BlogSidebarLinks.vue:18` uses `uppercase` on button links. This is a no-op on Arabic labels; valid on English link labels (which the page supports by design). Worth confirming whether the link labels are English URLs (in which case `uppercase` is fine) or mixed.
- **Minor (carried from prior):** The page nests its own `UContainer` inside the default layout's container — a minor double-container smell.
- **Minor (carried from prior):** A genuine API error and a real 404 both render the "المقال غير موجود" screen; acceptable as a catch-all, but they are not distinguished. Now that the status is 404 for the latter, the user-facing copy could be made more specific per error type (e.g. "المقال قيد التحميل" for transient, "المقال غير موجود" for not-found).

## Persona Red Flags (after fixes)

**Sam (screen reader / keyboard):** Heading structure + scroll-spy TOC + smooth scroll all work. The TOC `aria-label="جدول المحتويات"` is correct. The `aria-live` on the TOC nav is not present, so screen readers won't announce the active section on scroll — minor enhancement.

**Jordan (arriving on a post from search to judge the writing):** The page no longer returns HTTP 200 on a missing slug, so search engines and analytics correctly identify not-found pages. A heading-less post no longer breaks the page on mount. SEO is the most complete in the project.

**Casey (mobile reader):** Still the same mobile-hostile gap: no TOC and no share buttons on a phone. The article is readable (centered header + body, lazy-loaded images below the fold), but Casey has no in-page navigation and no quick way to pass the article along.

**Riley (quality / SEO auditor):** Notes the soft-404 fix, the TOC guard, the color token updates, and the LCP fix. Also notes the `BlogSidebarLinks` raw-color leftover and the mobile-TOC + mobile-share gap.

## Inherited / Cross-Page Notes

- The `<details class="lg:hidden">` mobile-TOC pattern from `global-data.vue:17-37` and the implicit `hidden lg:block` / `lg:hidden` pattern from the rest of the portfolio is the natural fix here. The TOC data is already structured (`singleBlog.value.tableOfContents`) — the page-level disclosure would reuse it. The share row is already a 6-network `<SocialShare>` block in `BlogSidebar.vue:19-25`; an inline mobile version would render the same 6 networks below the article body.
- The `setResponseStatus` pattern is unique to this page in the portfolio. If a future page needs the same soft-404 → real-404 behavior, the pattern is portable: `if (import.meta.server && !data.value?.idField) { setResponseStatus(useRequestEvent(), 404) }`.
- The `Article` JSON-LD pattern with `author` + `publisher` + `sameAs` is the most complete schema in the portfolio. If a future page needs the same, the `blog/[slug].vue:84-118` block is the reference.

## Questions to Consider

1. The mobile-TOC and mobile-share gap is the same P3 that was open in the prior snapshot (and the same gap that landed a fix for `global-data.vue`). Is the same `<details class="lg:hidden">` pattern worth shipping here, given the page is the most-read surface in the portfolio?
2. The `BlogSidebarLinks.vue:3` raw-color leftover (`text-gray-900 dark:text-white`) is a 1-line fix and a small consistency win. Worth bundling with a future polish pass?
3. The page is at 31/40 and Good. The remaining open items (mobile TOC + share, raw-color leftover, double-container) are below P3. Is this the natural "good enough" point, or is there a next pass worth shipping?
