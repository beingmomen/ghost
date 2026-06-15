---
target: apps/client/app/pages/adr/multi-mode-system.vue
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T10-50-29Z
slug: apps-client-app-pages-adr-multi-mode-system-vue
---
# Critique — apps/client/app/pages/adr/multi-mode-system.vue (ADR detail)

**Score: 30/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/adr/multi-mode-system.vue (+ components/adr/*)

## Anti-Patterns Verdict

**LLM assessment:** Not slop, and the deepest technical surface on the site. A sticky scroll-spy table of contents (real `<a href="#id">` anchors plus an IntersectionObserver), a semantic `<table>` for decision matrices, code blocks rendered as escaped text (XSS-safe), API cards, and a flow-diagram component, all composed from a clean set of eight reusable `Adr*` components. This is exactly the "show your engineering judgment" content the audience values, and the build quality matches the intent.

**Deterministic scan:** `detect.mjs` exit 0 across the page and all eight components. Vue SFC skips Tier 2 checks; the dynamic-class and schema issues below are logic/SEO matters the markup detector does not encode.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Scroll-spy TOC shows reading position; static content needs no loading |
| 2 | Match System / Real World | 3/4 | Arabic prose with LTR code/tables; clear technical framing |
| 3 | User Control and Freedom | 3/4 | Anchored TOC navigation + a back link |
| 4 | Consistency and Standards | 3/4 | Clean component set; `AdrFlowDiagram` builds Tailwind classes dynamically |
| 5 | Error Prevention | 3/4 | Static content, code is text-interpolated (no XSS) |
| 6 | Recognition Rather Than Recall | 3/4 | TOC + sectioned layout make a long doc navigable |
| 7 | Flexibility and Efficiency | 3/4 | Scroll-spy + jump links |
| 8 | Aesthetic and Minimalist Design | 3/4 | Organized and rich; icon-boxes recur, code has no highlighting |
| 9 | Error Recovery | 3/4 | n/a (static) |
| 10 | Help and Documentation | 3/4 | The page is deep documentation with its own TOC |
| **Total** | | **30/40** | **Good — strong technical doc; small SEO and robustness gaps** |

## What's Working

1. **The component set is clean and reusable.** Eight focused `Adr*` components (hero, section, TOC, code block, decision table, flow diagram, API card, file reference) compose the page, so the long document stays consistent and each block has one job.
2. **The TOC is done right.** Real anchor links (`<a href="#id">`) with an IntersectionObserver for active-section highlighting and `scroll-mt` offsets, so it works for keyboard and screen-reader users, not just mouse. This is the correct version of what the roadmap toggle only approximated.
3. **The decision table and code blocks are semantic and safe.** A real `<thead>/<tbody>` table for the decision matrix, and code rendered as escaped text inside `<pre dir="ltr">` (no `v-html`, no XSS surface), with horizontal scroll for long lines.

## Priority Issues

### [P3] AdrFlowDiagram builds Tailwind classes dynamically (purge-unsafe)
- **File:** AdrFlowDiagram.vue:27,32 — `` :class="step.color ? `bg-${step.color}/10` : 'bg-primary/10'" `` and `` `text-${step.color}` ``
- Tailwind only emits classes it can find as complete literal strings, so a constructed `bg-success/10` is purged from the production build and the color silently does not apply. It is currently latent (no step passes `color`, so the `bg-primary/10` default is always used), but the moment someone sets `color` on a step it will break in production while looking fine in dev.
- **Fix:** Map colors to full static class strings (a lookup object), or safelist the handful of `bg-{color}/10` / `text-{color}` classes.
- **Suggested command:** `/impeccable harden`

### [P3] The ADR detail page has no Article/TechArticle structured data
- **File:** multi-mode-system.vue:456-466 — `useHead` + `useSeoMeta` only, no JSON-LD
- The `/adr` index marks each ADR as a `TechArticle` in its `ItemList`, and the blog post page emits full `Article` schema, but the actual ADR detail page (the richest, most rank-worthy content) emits none. The deepest content has the weakest schema.
- **Fix:** Add a `TechArticle` JSON-LD block (headline, description, author, dates, mainEntityOfPage) mirroring the blog post page; a breadcrumb schema would help too.
- **Suggested command:** `/impeccable harden`

### [P3] Code blocks have no syntax highlighting, and the TOC is desktop-only
- **File:** AdrCodeBlock.vue:29-33 (plain `<pre><code>{{ code }}</code></pre>`); multi-mode-system.vue:13 (`hidden lg:block` TOC)
- For a document this code-heavy, unhighlighted monospace is harder to read than it needs to be; Shiki (already common in Nuxt) would help. And the TOC is hidden below `lg`, so mobile readers of a very long article get no in-page navigation.
- **Fix:** Optionally render code through Shiki; surface a collapsed TOC on mobile.
- **Suggested command:** `/impeccable adapt`

## Persona Red Flags

**Sam (screen reader / keyboard):** Well served here, the TOC is real links with an observer, the table is semantic, headings are real. The only gap is mobile, where the TOC disappears entirely.

**Jordan (peer judging engineering depth):** This is the page that closes the deal, real decisions, decision tables, code, and tradeoffs. The risk is invisible to them: if a future flow-diagram step uses a color, it will quietly render gray in production.

**Riley (quality / SEO auditor):** Notes the dynamic Tailwind classes in the flow diagram, and that the deepest content page ships no structured data while the index advertises it as a TechArticle.

## Minor Observations

- Icon-boxes (`rounded-xl bg-primary/10`) recur across the hero, sections, impact cards, and flow steps; fine in a dense technical doc, but it is the same motif being reduced elsewhere.
- The entire ADR (prose, code strings, table data) is inlined in an 880-line `.vue` file; it works as static content, but as the ADR set grows, markdown/MDC or a data module would be easier to maintain.
- `AdrCodeBlock` sets both `dir="ltr"` and an inline `style="direction: ltr"`, which is redundant.

## Questions to Consider

1. The flow diagram constructs `bg-${color}` classes that Tailwind will purge. Should the component use a static color map now, before a future step quietly renders colorless in production?
2. The index advertises each ADR as a `TechArticle`, but the detail pages emit no schema. Should the detail pages carry the structured data, since they are the pages that should actually rank?
3. The whole ADR is an 880-line SFC. As you add more ADRs, is inlining each one sustainable, or should the content move to markdown/MDC with these components as renderers?
