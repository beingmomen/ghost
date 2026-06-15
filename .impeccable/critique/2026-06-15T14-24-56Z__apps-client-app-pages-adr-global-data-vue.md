---
target: apps/client/app/pages/adr/global-data.vue
total_score: 28
p0_count: 0
p1_count: 1
timestamp: 2026-06-15T14-24-56Z
slug: apps-client-app-pages-adr-global-data-vue
---
# Critique — apps/client/app/pages/adr/global-data.vue

**Score: 28/40 (Good, lower edge)** | P0: 0 | P1: 1 | Target: apps/client/app/pages/adr/global-data.vue (+ components/adr/*)

**Trend for `apps-client-app-pages-adr-global-data-vue` (last 5 runs):** First run for this target, no trend yet.

## Anti-Patterns Verdict

**LLM assessment:** Not slop — no glassmorphism, no gradient text, no side-stripe card borders, no SaaS hero-metrics template, no AI tell. The page is a deep Arabic technical ADR composed from 8 focused, reusable components (Hero, Section, TOC, CodeBlock, DecisionTable, FlowDiagram, ApiCard, FileReference), with a real scroll-spy TOC (IntersectionObserver), semantic `<table>` for decision matrices, and code rendered as escaped text (XSS-safe). It reads as part of the system.

Since the 2026-06-15 multi-mode-system snapshot, two of the three P3 issues flagged there have been addressed: **`AdrFlowDiagram.vue:13-21` now uses a static `COLOR_CLASSES` map** (the `bg-${color}` purge-unsafe pattern is gone, only a comment in line 12 references it as a prohibition), and **`global-data.vue:274-298` now carries a `TechArticle` JSON-LD** with `author` + `publisher`. Both are the correct fix. The remaining open P3s from the multi-mode snapshot — plain `<pre>` code blocks and desktop-only TOC — are still present here, as expected (they were never fixed at the component level).

**The new tell is amber overload at scale.** The page is the deepest content surface in the portfolio. It composes 9 `<AdrSection>` blocks, 5 `<AdrCodeBlock>` blocks, 6 `<AdrApiCard>` blocks, 3 `<AdrDecisionTable>` blocks, 1 `<AdrFileReference>` block, 2 `<AdrFlowDiagram>` blocks, plus the overview callout — and every single block reuses primary-amber as its accent. The Hero already burns 2 of the 3 amber moments allowed by `design.json:narrative.rules:311-315` (text-amber title highlight + primary `Architecture Decision Record` badge). The body then adds 50+ primary-amber motifs (icon-box tints, code-header icons, table header backgrounds, code-name foregrounds, file-path tints, step icons). By the time a reader reaches the third section, amber has stopped being a signal and become a fill color.

**Deterministic scan:** `node .claude/skills/impeccable/scripts/detect.mjs --json` exits 0 across the page and all 8 components. Expected for `.vue` SFCs (Tier-1 only). The detector would not have caught the amber overload, the mobile-TOC absence, the plain-`<pre>` blocks, the off-by-one in `adr/index.vue:144` (`sections: 10` vs. 9 actual `<AdrSection>`s), or the redundant `dir="ltr"` + `style="text-align: left;"` pair in `AdrCodeBlock.vue:31-32` and `AdrApiCard.vue:54-55`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Scroll-spy TOC with IntersectionObserver (`AdrTableOfContents.vue:13-22`) + active highlight (`bg-primary/10 text-primary` line 47-49). Static content; no loading state needed. |
| 2 | Match System / Real World | 3/4 | Arabic prose + LTR code/tables (idiomatic for the audience). Bilingual convention (English `Architecture Decision Record` badge) is conventional in Arabic tech writing. |
| 3 | User Control and Freedom | 3/4 | Anchored TOC + a back link (`AdrHero.vue:48-55` to `/adr`). No related-ADR navigation at the bottom (minor). |
| 4 | Consistency and Standards | 3/4 | Clean component set. `AdrFlowDiagram` now uses a static color map. `TechArticle` JSON-LD on the page. **Inconsistency**: `adr/index.vue:144` advertises 10 sections for this ADR but the page ships 9 `<AdrSection>` blocks (the `tocSections` array has 9). Off-by-one, and the index is the marketing surface for the ADR. |
| 5 | Error Prevention | 3/4 | Static content, code is text-interpolated (no XSS). |
| 6 | Recognition Rather Than Recall | 3/4 | TOC + sectioned layout make a long doc navigable. Section icons give quick visual differentiation. |
| 7 | Flexibility and Efficiency | 2/4 | **Drop.** No mobile TOC (`hidden lg:block` at `global-data.vue:13` — same as the multi-mode page). On a 556-line, 9-section, code-heavy page, mobile readers have **no in-page navigation** beyond scrolling. No back-to-top. No keyboard shortcut. |
| 8 | Aesthetic and Minimalist Design | 2/4 | **Drop.** Honey Signal Rule broken at scale: 2 amber in Hero + 9 `bg-primary/10` AdrSection icon-boxes + 5 `text-primary` AdrCodeBlock icons + 6 `text-primary` AdrApiCard names + 3 decision tables × ~2.5 `text-primary bg-primary/5` headers + 7 `text-primary bg-primary/5` AdrFileReference paths + 2 flow diagrams × 4 default-primary step icons + overview callout `border-primary/30 bg-primary/5` + 3 inline `text-primary` on `<code>` = **~50 amber moments**. The biggest single-page amber overload in the portfolio. |
| 9 | Error Recovery | 3/4 | n/a (static). |
| 10 | Help and Documentation | 3/4 | The page is documentation. `TechArticle` JSON-LD present with `headline`, `description`, `url`, `inLanguage: 'ar'`, `author`, `publisher`. Breadcrumb schema present. |
| **Total** | | **28/40** | **Good (lower edge). Deep technical doc, schema-fixed and color-map-fixed since the sibling critique. The remaining gaps: amber overload, mobile TOC, plain-`<pre>` code, sections-count drift, redundant LTR attrs.** |

## What's Working

1. **It is the deepest technical surface on the site, and the structure carries it.** Eight focused, reusable `Adr*` components compose the page. The TOC is real — anchored `<a href="#id">` plus an IntersectionObserver for active-section highlighting plus `scroll-mt` offsets — so it works for keyboard and screen-reader users, not just mouse. The decision table is a real `<thead>/<tbody>`; code is escaped text (no `v-html`, no XSS surface).
2. **Two of three P3s from the multi-mode snapshot are already fixed here.** The dynamic-class purge bug in `AdrFlowDiagram` is gone (static `COLOR_CLASSES` map at `AdrFlowDiagram.vue:13-21`, with an explicit comment in line 12 documenting the prohibition). The missing JSON-LD is fixed (`global-data.vue:274-298` with `TechArticle` + `author` + `publisher`). The pattern is now consistent with the multi-mode sibling (which got the same fix in commit `897c402`).
3. **The content carries the page.** `useGlobal` is a real composable with a real justification (computed over `useAuth().data`, no duplication), and the page proves it: a 4-step architecture flow, a 3-step refresh cycle, a 3-decision-table comparison (Pinia/useState vs useGlobal; provide/inject vs useGlobal; when-to-use), and 6 API reference cards with live code. This is exactly the engineering-judgment content the audience values.

## Priority Issues

### [P1] Honey Signal Rule broken at scale — ~50 amber moments on one page
- **Files (count of primary-tinted motifs on this page):**
  - `AdrHero.vue:24` (primary badge) + `AdrHero.vue:35` (`text-amber` title highlight) — 2 in Hero alone
  - `global-data.vue:25` `border-primary/30 bg-primary/5` (overview callout) + line 27 `bg-primary/10` icon-box + line 30 `text-primary` icon
  - `global-data.vue:39, 44, 49` — 3 inline `text-primary` on `<code>` in the overview
  - `AdrSection.vue:38` — 9 `bg-primary/10` icon-boxes (one per section, rendered from the component)
  - `AdrCodeBlock.vue:17` — 5 `text-primary` code-header icons + 5 `bg-elevated/20` code-block frames
  - `AdrApiCard.vue:15` — 6 `text-primary` API-name codes (one per API card)
  - `AdrDecisionTable.vue:14` (icon) + `:26` (headers, 2-3 per table × 3 tables) — 7-10 `text-primary`/`bg-primary/5`
  - `AdrFileReference.vue:17` (icon) + `:28` (path, 7 files) — 8 `text-primary`/`bg-primary/5`
  - `AdrFlowDiagram.vue:38-45` — 2 diagrams × 4 default-color step icons = 8 `bg-primary/10 text-primary`
  - `global-data.vue:99` `<UBadge color="primary">` on step numbers × 3
- `design.json:narrative.rules:311-315` and `DESIGN.md:114` set the budget at max 3 amber moments per screen. The Hero already meets the budget, the body adds ~50 more. The page does not need to be monochrome; the repeated `bg-primary/10` icon-boxes and `text-primary` code-headers are the most fixable (one template change per component reduces the count by half without changing the page's character).
- **Fix (judgment call, two-step):**
  1. **Cheap (P2→P1 once applied at scale):** Strip the `bg-primary/10` tint from the icon-boxes in `AdrSection.vue:38` and `AdrFlowDiagram.vue:38` (keep `text-primary` on the icon, drop the rounded box). Strip `text-primary` from `<code>` foregrounds in `AdrApiCard.vue:15` and `AdrFileReference.vue:28` (default to `text-highlighted` or `text-muted`). Strip `bg-primary/5` from `AdrDecisionTable.vue:26` headers and `AdrCodeBlock.vue:13` header. Net: amber count drops to ~10-15, within striking distance of the budget. The page's structure and accent on the Hero do not change.
  2. **Bigger (separate branch):** Restructure so amber is reserved for the *signal* moments (e.g. one amber per section: the most important callout), and the rest is muted. This is a design system conversation, not a one-file fix.
- **Suggested command:** `/impeccable quieter` (cheap) or `/impeccable colorize` (bigger)

### [P2] Mobile TOC absent — the same P3 from the multi-mode snapshot, still open
- **File:** `global-data.vue:13` — `<div class="hidden lg:block">` wrapping the `<AdrTableOfContents>`. The TOC is invisible below the `lg` breakpoint (1024px).
- For a 556-line, 9-section, code-heavy document, mobile readers have no in-page navigation. They have to scroll the entire document to find a section, then scroll back. This is the same gap the multi-mode snapshot flagged as P3; the per-page fix was not landed.
- **Fix:** Add a mobile entry point. Options, in order of effort:
  1. **Cheapest:** Add a collapsed `<details>` (or a custom disclosure) above the first section that lists the same `tocSections` and jumps to each `#id`. Hidden on `lg+` where the sticky TOC is already visible.
  2. **Better:** Add a floating "TOC" button bottom-right (or top-right) on mobile that opens a sheet/drawer with the same links, with the same active highlighting.
  3. **Best:** Extract the mobile-TOC component, reuse in `multi-mode-system.vue` and `blog/[slug].vue` (the blog page has the same gap per the handoff §6).
- **Suggested command:** `/impeccable adapt`

### [P2] Code blocks have no syntax highlighting
- **File:** `AdrCodeBlock.vue:29-33` and `AdrApiCard.vue:52-56` — both render plain `<pre class="...overflow-x-auto"><code>{{ code }}</code></pre>` (escaped text). This page ships 5 `<AdrCodeBlock>` instances (JSON, JS, Vue, JS, JS) plus 6 `<AdrApiCard>` instances (each with a code example) — ~11 code blocks of mixed language. For a deep technical doc where the code is the point, unhighlighted monospace is harder to read than it needs to be.
- **Fix:** Add Shiki (already in the Nuxt ecosystem) or `prismjs` to the build, render the highlighted HTML at build time, and pass it to `AdrCodeBlock` as a `code` prop. Would also benefit `blog/[slug]` (Tiptap) if the syntax-highlight extension is wired.
- **Suggested command:** `/impeccable adapt` (or a `/impeccable typeset` flavor)

### [P3] `adr/index.vue:144` advertises `sections: 10` but the page ships 9 `<AdrSection>`s
- **File:** `adr/index.vue:144` — `sections: 10` for `global-data`. `global-data.vue` has 9 `<AdrSection>` opens/closes (counted: lines 20/65, 68/75, 78/110, 113/131, 134/149, 152/188, 191/198, 201/225, 228/234) and `tocSections` (lines 300-310) has 9 entries.
- The off-by-one is in the index page that markets the ADR, so it is the first thing a visitor sees about this content. Riley would catch it instantly.
- **Fix:** Change `adr/index.vue:144` to `sections: 9` to match.
- **Suggested command:** `/impeccable polish`

### [P3] Redundant `dir="ltr"` + `style="text-align: left;"` in code blocks
- **Files:** `AdrCodeBlock.vue:31-32` and `AdrApiCard.vue:54-55` — both set `dir="ltr"` on the `<pre>` *and* an inline `style="text-align: left;"`. The first already implies the second.
- Minor; the snapshot of `multi-mode-system` flagged this on `AdrCodeBlock` only. `AdrApiCard` is the same pattern (added later) and the redundancy doubled.
- **Fix:** Drop `style="text-align: left;"` from both, keep `dir="ltr"`. One-line change per file.
- **Suggested command:** `/impeccable polish`

## Persona Red Flags

**Sam (screen reader / keyboard):** Well served overall — the TOC is real anchor links with an observer, the table is semantic, headings are real. Two gaps: (1) the TOC disappears on mobile (`hidden lg:block`), so on a phone a screen-reader user has no section navigator; (2) the code blocks are monospace text with no semantic tokens, so a screen reader announces the entire code as one paragraph with no code-fence role.

**Jordan (peer judging engineering depth):** This is the page that closes the deal for a peer technical reviewer. Real decisions, decision tables, code, and tradeoffs. The only thing that would soften the impact is the visual sameness of every section header and every code block — Jordan is reading for signal, and amber-on-amber-on-amber stops being a signal.

**Riley (quality / SEO / consistency auditor):** Notes (1) the amber overload (~50 moments on a single page, vs. the 3-per-screen budget), (2) the off-by-one `sections: 10` vs. 9 actual sections, (3) the redundant LTR attrs, (4) the missing mobile TOC, (5) the missing code-block highlighting. Also notes that the page *does* have JSON-LD and *does* use a static color map — both the multi-mode fixes carried over correctly.

**Casey (mobile reader):** The page is unusable on a phone in any practical sense. 556 lines, 9 sections, no in-page nav, the TOC is desktop-only. Casey would have to scroll the whole document, lose their place, and start over.

## Minor Observations

- `global-data.vue:172` sets both `dir="ltr"` and `style="direction: ltr;"` on the `useAuth().data ──computed──→ useGlobal ──read──→ أي مكان` line. Same redundancy pattern as the code blocks; the inline `style` is unnecessary.
- `AdrDecisionTable.vue:42` bolds the first column with `font-medium text-highlighted` for every row. Works for the comparison tables; for the "when-to-use" table (which has only 2 columns: الحالة / الحل المناسب) the second column stays muted, which is correct (the solution is the answer, the case is the question). This is intentional and good.
- `AdrFlowDiagram.vue:13-21` documents the static-map pattern as an *in-code* prohibition (`// strings, so colors must not be built dynamically (bg-${color} would be purged).`) — this is the correct way to capture a "don't" in code: near the code, not in a separate doc. A model for other components.
- The `architectureSteps` and `refreshSteps` data in `global-data.vue:312-337, 500-521` are well-structured; the detail text in `architectureSteps` is dense (one-liner + details sentence per step). `refreshSteps` is more terse (no details field). Inconsistent depth between the two flow diagrams on the same page — could be intentional (the refresh is conceptually simpler) or an oversight.
- The page is one 556-line SFC; same observation as the multi-mode snapshot. As the ADR set grows, markdown/MDC or a data module would help. The `app/data/` directory is the conventional place.

## Questions to Consider

1. The page is at ~50 amber moments. Stripping the icon-box tints and code-header accents is one template change away (covers ~30 of the 50). Is amber overload a budget you want enforced here, or is the current state a deliberate "every section is equally important" choice?
2. The TOC is desktop-only, and the page is mobile-hostile at 556 lines. Is a mobile TOC (collapsed at top, or floating button opening a sheet) worth shipping now, before the third ADR lands and the problem compounds?
3. Code-block highlighting via Shiki would benefit this page, `multi-mode-system`, and `blog/[slug]`. Is a one-time wiring acceptable, or do you prefer a smaller-scope fix (e.g. a per-page opt-in)?
4. `adr/index.vue:144` says 10 sections, the page has 9. The off-by-one is in the marketing surface. Worth a 1-character fix now, or do you prefer to bump the page to 10 sections to match?
