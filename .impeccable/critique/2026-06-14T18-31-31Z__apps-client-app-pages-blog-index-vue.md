---
target: apps/client/app/pages/blog/index.vue
total_score: 29
p0_count: 0
p1_count: 0
timestamp: 2026-06-14T18-31-31Z
slug: apps-client-app-pages-blog-index-vue
---
# Critique — apps/client/app/pages/blog/index.vue

**Score: 29/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/blog/index.vue

## Anti-Patterns Verdict

**LLM assessment:** Not slop. The post list uses an alternating-tilt polaroid treatment (header rotated +/-1 degree by index, framed image with border + ring) that echoes the project's signature Polaroid component and dodges the identical-card-grid tell. The hero is clean (title + description, no eyebrow). This page is closer to the brand discipline than /contact was.

**Deterministic scan:** `detect.mjs` exit 0, 0 findings. Vue SFC skips Tier 2 page-level checks.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Empty state exists; the pending skeleton is dead under block-nav; error is not distinguished |
| 2 | Match System / Real World | 3/4 | Arabic clear; verify the post date renders Arabic-localized |
| 3 | User Control and Freedom | 3/4 | Client pagination; no search or tag filter (acceptable for a small blog) |
| 4 | Consistency and Standards | 3/4 | Consistent with the site; the dead skeleton predates the documented block-nav decision |
| 5 | Error Prevention | 3/4 | `default: () => []` prevents render crashes |
| 6 | Recognition Rather Than Recall | 3/4 | Cards show title, description, image, date |
| 7 | Flexibility and Efficiency | 3/4 | Fetches all posts then paginates client-side (fine at small scale) |
| 8 | Aesthetic and Minimalist Design | 3/4 | Distinctive polaroid-tilt cards, on-brand; image framing is a touch heavy |
| 9 | Error Recovery | 2/4 | On API error the page shows "لا توجد مقالات حالياً" (no articles), misleading, no retry |
| 10 | Help and Documentation | 3/4 | Self-explanatory list |
| **Total** | | **29/40** | **Good — one real gap (error masquerades as empty)** |

## Overall Impression

A clean, distinctive blog index: the polaroid-tilt cards give it personality without resorting to a generic grid, and it already has a real empty state and pagination. The one issue that matters: on a failed fetch the page tells the visitor "no articles," which on a page whose whole job is to prove authority reads as an empty blog rather than a temporary error. Everything else is minor.

## What's Working

1. **The polaroid-tilt post cards are distinctive and on-brand.** Alternating +/-1 degree rotation by index, framed images with border + ring, hover scale; it echoes the documented Polaroid signature and avoids the identical-card-grid cliche.
2. **States and pagination are already present.** A genuine empty state (icon + message), client-side pagination at 6 per page, and a skeleton the author clearly intended for loading.
3. **Solid SEO baseline.** Full `useSeoMeta`, breadcrumb schema, and the server route also generates an RSS feed.

## Priority Issues

### [P2] On API error the list shows "no articles" instead of an error
- **File:** blog/index.vue:4 (`{ data, status }`, no error/refresh exposed), :87-129 (content / empty branches only)
- `useFetch` has `default: () => []`, so on a failed request `posts.length === 0` and the template falls through to the `v-else` empty state, "لا توجد مقالات حالياً". The visitor cannot tell a real outage from a genuinely empty blog, there is no retry, and on the page meant to prove authority this reads as "he has no posts."
- **Fix:** Expose `refresh` and add a distinct `v-else-if="status === 'error'"` branch with a retry (the landing's `Blog.vue` already separates error via `LandingSectionFallback`); keep the empty state for the truly-empty case.
- **Suggested command:** `/impeccable harden`

### [P3] The loading skeleton is dead code under block-navigation
- **File:** blog/index.vue:69-85 — `v-if="status === 'pending'"`
- `await useFetch` without `lazy` blocks navigation until the data resolves (the project's documented, intentional architecture), so `status` is never `pending` at paint time and this skeleton never renders. It is harmless but misleading to a future reader. (This is not a request to add loading states; block-nav is deliberate per DESIGN.md.)
- **Fix:** Remove the dead `pending` branch for clarity, or leave it with a comment noting it is inert under block-nav.
- **Suggested command:** `/impeccable distill`

### [P3] No list-level structured data
- **File:** blog/index.vue:39-54 — `useSeoMeta` + breadcrumb only
- The /projects page ships `CollectionPage` + `ItemList` JSON-LD; the blog index has none. A `Blog`/`ItemList` schema would help search present the post list.
- **Fix:** Add a `Blog` or `ItemList` JSON-LD listing the posts, mirroring the projects page.
- **Suggested command:** `/impeccable harden`

### [P3] All posts are fetched, then paginated on the client
- **File:** blog/index.vue:4-11 (`/api/blog` returns everything), :29-34 (client slice)
- Fine for a personal blog with few posts; if the archive grows this ships every post on every visit. Worth server-side pagination later.
- **Suggested command:** `/impeccable optimize`

## Persona Red Flags

**Jordan (reading to judge whether this person knows their craft):** If the blog request hiccups, the page says "no articles," and Jordan concludes the blog is empty and the authority signal is gone, when in fact a retry would have shown the posts.

**Casey (mobile):** The `md:grid-cols-2` cards collapse to a single column on mobile (image then text), which is correct; pagination controls are tappable. No issues specific to mobile here.

**Riley (quality auditor):** Spots that the `pending` skeleton can never fire under the site's block-navigation, that an API error is indistinguishable from an empty blog, and that the whole archive is fetched and then sliced client-side.

## Minor Observations

- The `pending` skeleton never renders under block-navigation (dead branch).
- No `Blog`/`ItemList` JSON-LD on the list, unlike the projects page.
- The entire archive is fetched, then paginated client-side.
- Verify `UBlogPost` renders `createdAt` as an Arabic-localized date, not a raw ISO string.

## Questions to Consider

1. On a failed fetch the index is indistinguishable from a genuinely empty blog, on the one page whose job is to prove authority. Should error and empty be separated the way the landing's blog section already does?
2. The pending skeleton cannot render under the site's block-navigation. Remove it, or is there an intended lazy path for this specific list?
3. The single-article page (`/blog/[slug]`, with sidebar + table of contents) is where readers actually spend time. Is that reading experience worth its own critique next?
