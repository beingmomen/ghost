---
target: apps/client/app/pages/adr/index.vue
total_score: 29
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T10-31-51Z
slug: apps-client-app-pages-adr-index-vue
---
# Critique — apps/client/app/pages/adr/index.vue

**Score: 29/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/adr/index.vue

## Anti-Patterns Verdict

**LLM assessment:** Not slop. A clean, static two-card index for Architecture Decision Records with strong, specific content (real patterns, alternatives, outcomes), which is exactly the kind of authority-building material the audience values. No gradient text, no eyebrow-on-every-section. The one structural problem is semantic, not stylistic: the cards put non-interactive labels inside the card link as `<button>` elements.

**Deterministic scan:** `detect.mjs` exit 0. Vue SFC skips Tier 2 checks; the nested-interactive issue is a semantic/HTML matter the markup detector does not encode here.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Static content; cards show section count + read time |
| 2 | Match System / Real World | 3/4 | Arabic + technical terms; clear ADR framing |
| 3 | User Control and Freedom | 3/4 | Whole card links to the ADR |
| 4 | Consistency and Standards | 2/4 | Topic/section/read-time labels are `<button>`s nested inside the card `<a>` |
| 5 | Error Prevention | 3/4 | Static data, nothing to fail |
| 6 | Recognition Rather Than Recall | 3/4 | Cards are clear and scannable |
| 7 | Flexibility and Efficiency | 3/4 | Direct links to each ADR |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean cards; the `size-14` icon-box is a touch template-y |
| 9 | Error Recovery | 3/4 | n/a (static) |
| 10 | Help and Documentation | 3/4 | The page is itself documentation |
| **Total** | | **29/40** | **Good — clean index; fix the nested buttons** |

## Overall Impression

A tidy, well-SEO'd index for a genuinely valuable section: documenting real architecture decisions (the composable pattern, the multi-mode system) is strong proof of seniority. The content and the schema are right. The one thing to fix is structural: the topic tags, the "{n} قسم" count, and the read time are rendered as `UButton`s sitting inside the card's `NuxtLink`, so the markup nests interactive elements inside an anchor, which is invalid and can swallow the card click.

## What's Working

1. **The SEO is thorough for a list page.** `CollectionPage` + `ItemList` + `TechArticle` JSON-LD plus a breadcrumb; each ADR is marked up as a tech article with its own URL.
2. **The content is the right kind of authority.** Real decisions with the topics, the alternatives considered, and outcomes; this is what a peer evaluating depth wants to see, far better than generic "skills".
3. **The cards are clean and scannable.** Icon, title, mono subtitle, description, topic tags, and effort signals (section count, read time), all inside one clear hover-elevating card.

## Priority Issues

### [P2] Non-interactive labels are buttons nested inside the card link
- **File:** adr/index.vue:43-101 — the card is a `NuxtLink` (`<a>`), and inside it the topic tags (:72-81), the "{n} قسم" (:84-91), and the read time (:92-99) are `UButton`s with `cursor-default`
- A `UButton` with no `to` renders a `<button>`, so the card nests `<button>` elements inside an `<a>`. That is invalid HTML (interactive content cannot be nested in an anchor), it adds extra tab stops that go nowhere, screen readers announce decorative labels as buttons, and a click on one can intercept the card navigation.
- **Fix:** Render these as non-interactive elements: `UBadge` for the topic tags, and a `UBadge` or an icon-plus-text span for the section count and read time. The `cursor-default` already signals they were never meant to be buttons.
- **Suggested command:** `/impeccable polish`

### [P3] Large rounded icon-box on each card
- **File:** adr/index.vue:48 — `size-14 rounded-xl bg-primary/10 ring-1 ring-primary/20`
- This is the same large-rounded-icon-box motif being toned down elsewhere (landing/about stats). In a card header with a title beside it, it is more defensible, but it still reads slightly template-y.
- **Fix:** Optional. A smaller or bare icon would match the lighter treatment used after the stats fixes.
- **Suggested command:** `/impeccable quieter`

## Persona Red Flags

**Sam (screen reader / keyboard):** Tabbing through a card lands on the topic tags, the section count, and the read time as buttons that do nothing, then the card link itself, so each card has several dead focus stops and the labels are mis-announced as actionable.

**Riley (quality auditor):** Inspects a card and sees `<button>` elements inside the `<a>`; flags the invalid nesting and notes that clicking a "topic" can hijack the card navigation.

**Jordan (peer judging depth):** Reads the two ADRs' framing (pattern, alternatives, outcomes) and is impressed; the content does its job, the interaction nit is invisible to a mouse user.

## Minor Observations

- There are two separate `useHead` calls (the meta block and the ld+json block) plus `useSeoMeta`; they merge fine but could be consolidated.
- `<UPage dir="rtl">` re-declares RTL that the app already sets globally; harmless but redundant.
- The ADR list is a hardcoded array of two; fine as static content, but it will need a home (CMS or file convention) if the set grows.

## Questions to Consider

1. The topic tags and effort labels are buttons that do nothing. Should they be badges, so the only interactive thing in a card is the card itself?
2. The real substance lives in the ADR detail pages (`/adr/[...]`), which use the eight Adr components (code blocks, decision tables, flow diagrams, a TOC). Is that reading experience worth its own critique next, the way the blog post page was?
3. The index hardcodes two ADRs. As the set grows, where should these live so the index and the detail pages stay in sync without manual edits?
