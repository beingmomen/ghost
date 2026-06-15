---
target: apps/client/app/pages/blog/[slug].vue
total_score: 29
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T09-55-53Z
slug: apps-client-app-pages-blog-slug-vue
---
# Critique — apps/client/app/pages/blog/[slug].vue

**Score: 29/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/blog/[slug].vue

## Anti-Patterns Verdict

**LLM assessment:** Not slop, and the most technically careful page in the project. The article rendering is security-conscious (DOMPurify on the `v-html`), the SEO is the most complete anywhere (Article JSON-LD, canonical, full OG/Twitter, article published/modified/author/tags), and the table of contents is a real scroll-spy with throttled (`requestAnimationFrame`) scroll handling. The visible drift is small: a couple of stale color tokens and a hardcoded avatar.

**Deterministic scan:** `detect.mjs` exit 0, 0 findings. Vue SFC skips Tier 2 checks; the soft-404 and the TOC guard are logic issues the markup detector does not encode.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Date + read-time + a real not-found state; no loading (block-nav, intentional) |
| 2 | Match System / Real World | 3/4 | Arabic, `ar-EG` date formatting, read-time |
| 3 | User Control and Freedom | 3/4 | Back link, scroll-spy TOC, share buttons (desktop) |
| 4 | Consistency and Standards | 3/4 | TOC uses `color="gray"` (not valid in Nuxt UI 4) and raw `text-gray-900`; hardcoded avatar URL |
| 5 | Error Prevention | 2/4 | DOMPurify is great, but the TOC calls `.map` on a possibly-undefined `tableOfContents` |
| 6 | Recognition Rather Than Recall | 3/4 | TOC makes structure visible |
| 7 | Flexibility and Efficiency | 3/4 | TOC + 6-network share, but both are desktop-only |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean centered header + article; nested container is a minor smell |
| 9 | Error Recovery | 2/4 | Not-found UI exists, but it is a soft 404 (HTTP 200) and also swallows real errors |
| 10 | Help and Documentation | 3/4 | TOC is the in-page guide |
| **Total** | | **29/40** | **Good — strong reading page; fix the soft-404 and the TOC guard** |

## Overall Impression

This is the best-engineered page in the project: thorough SEO, XSS-safe content rendering, a genuine scroll-spy TOC, share buttons, and a real not-found screen. Two issues keep it from being airtight. First, a missing article renders the "not found" screen with an HTTP 200, a soft 404 that search engines will index. Second, the TOC maps over `tableOfContents` without guarding for it being absent, so a post without that field would throw on mount. Both are quick and high-value on a content page meant to rank and to read cleanly.

## What's Working

1. **The SEO is the most complete in the project.** `Article` JSON-LD with author/publisher/dates, a canonical link, and full OG/Twitter article tags. This is exactly what a blog post needs to rank and to share well.
2. **Content rendering is secure.** `DOMPurify.sanitize` on the `v-html` content protects against XSS from stored HTML, with the eslint disable scoped tightly around the one `v-html`.
3. **The table of contents is a real component.** Scroll-spy active-heading tracking, smooth scroll on click, throttled with `requestAnimationFrame`, and proper `aria-label`. Plus six-network share buttons in the sidebar.

## Priority Issues

### [P2] Missing article is a soft 404 (HTTP 200)
- **File:** blog/[slug].vue:7-11 (fetch with `default: () => ({})`), :180-200 (`v-else` not-found UI)
- When the slug does not resolve, the page renders the "المقال غير موجود" screen but still returns HTTP 200. Search engines treat this as a real page and may index it, diluting crawl quality, and it hides genuine 404s from analytics.
- **Fix:** When `!singleBlog.value?.title`, set the response status to 404 (`setResponseStatus(useRequestEvent(), 404)` on the server, or `throw createError({ statusCode: 404 })` if you prefer Nuxt's error page). Keep the inline UI if you set the status manually.
- **Suggested command:** `/impeccable harden`

### [P2] TOC maps over a possibly-undefined `tableOfContents`
- **File:** BlogSidebarTableOfContents.vue:37 (`computed(() => singleBlog.value.tableOfContents)`), :54 (`table.value.map(...)` in `updateActiveHeading`, called on mount and scroll)
- If a post has no `tableOfContents` (for example a short post with no headings, or an older record), `table.value` is `undefined` and `updateActiveHeading` throws `Cannot read properties of undefined (reading 'map')` on mount, breaking the page client-side.
- **Fix:** Default the computed to an array: `computed(() => singleBlog.value.tableOfContents || [])`.
- **Suggested command:** `/impeccable harden`

### [P3] The TOC and share buttons are desktop-only
- **File:** blog/[slug].vue:175-177 (`#right` slot) → BlogSidebar
- The sidebar lives in `UPage`'s right slot, which collapses on smaller screens, so the mobile-majority audience loses both the table of contents and the share buttons on the page where reading and sharing matter most.
- **Fix:** Surface a collapsed TOC (a disclosure at the top) and a share row inline for mobile.
- **Suggested command:** `/impeccable adapt`

### [P3] Stale color tokens in the TOC
- **File:** BlogSidebarTableOfContents.vue:3 (`text-gray-900 dark:text-white`), :15 (`color="gray"`)
- `color="gray"` is not a valid Nuxt UI 4 color (the neutral role is `neutral`), and raw `text-gray-900` bypasses the semantic tokens (`text-highlighted`) the rest of the app uses.
- **Fix:** Use `color="neutral"` and `text-highlighted`.
- **Suggested command:** `/impeccable polish`

### [P3] Article hero image lacks dimensions and eager loading
- **File:** blog/[slug].vue:142-147 — `NuxtImg` with `h-75 object-cover`, no `width`/`height`, default lazy
- The hero image is the article's LCP candidate but has no intrinsic dimensions (layout shift as it loads) and is not eager/high-priority.
- **Fix:** Add `width`/`height` (or an aspect ratio) and `loading="eager"` `fetchpriority="high"`.
- **Suggested command:** `/impeccable optimize`

## Persona Red Flags

**Jordan (arriving on a post from search to judge the writing):** Gets a clean, well-formatted article with a TOC, so the impression is strong, as long as the post actually has a `tableOfContents`; if it does not, the page errors out client-side.

**Casey (mobile reader):** Reads the article fine but has no table of contents and no share buttons (the sidebar is desktop-only), so a long post is harder to navigate and harder to pass along from the phone where most reading happens.

**Riley (quality / SEO auditor):** Immediately flags the soft 404 (200 status on a missing slug), the unguarded `.map` on `tableOfContents`, the invalid `color="gray"`, and the dimensionless lazy hero image.

## Minor Observations

- The author avatar URL is hardcoded in the `UUser` (line 163) instead of using `global.picture` / config.
- The page nests its own `UContainer` inside the default layout's container, a minor double-container smell.
- A genuine API error and a real 404 both render "المقال غير موجود"; acceptable as a catch-all, but they are not distinguished.

## Questions to Consider

1. A missing slug returns HTTP 200 with a "not found" screen. On a blog built to rank, should that be a true 404 so search engines treat it correctly?
2. The TOC and share buttons only exist on desktop, but most reading happens on mobile. What would a collapsed mobile TOC and an inline share row do for navigation and distribution?
3. The TOC assumes every post has a `tableOfContents`. Should the component be defensive so a heading-less post still renders, rather than relying on the backend always supplying the field?
