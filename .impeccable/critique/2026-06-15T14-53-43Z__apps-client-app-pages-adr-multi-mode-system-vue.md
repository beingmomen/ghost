---
target: apps/client/app/pages/adr/multi-mode-system.vue
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T14-53-43Z
slug: apps-client-app-pages-adr-multi-mode-system-vue
---
# Re-critique — apps/client/app/pages/adr/multi-mode-system.vue

**Score: 32/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/adr/multi-mode-system.vue (+ components/adr/*)

**Trend for `apps-client-app-pages-adr-multi-mode-system-vue` (last 5 runs): 30 → 32** (+2)

**Re-run scope:** Verifying the inherited wins from commit `08e392b` (the `polish/adr-global-data-critique-fixes` branch). Six shared components (`AdrSection`, `AdrFlowDiagram`, `AdrCodeBlock`, `AdrApiCard`, `AdrDecisionTable`, `AdrFileReference`) had their amber motifs stripped; both ADR detail pages (`multi-mode-system.vue` and `global-data.vue`) consume those components, so the multi-mode page inherits the cleanup without a dedicated branch. The mobile TOC and off-by-one fix from that branch are *not* inherited (those are page-level in `global-data.vue` only).

## Anti-Patterns Verdict

**LLM assessment:** The component-level amber strip that landed in `polish/adr-global-data-critique-fixes` is the quiet structural win of this cycle. By fixing the components rather than the pages, the change applies portfolio-wide for any ADR that uses them. `multi-mode-system.vue` — the deepest, longest ADR in the portfolio (908 lines, 12 `<AdrSection>` blocks, 4 `<AdrCodeBlock>` blocks, 4 `<AdrApiCard>` blocks, 2 `<AdrDecisionTable>` blocks, 1 `<AdrFileReference>` block, 3 `<AdrFlowDiagram>` blocks) — picks up the cleanup automatically.

No new anti-patterns were introduced. The page was already clean of glassmorphism, gradient text, side-stripe card borders, and dynamic Tailwind classes. The remaining amber motifs are page-level inline `<code>` highlights and callout boxes — these are focal content, not motif overload.

**Deterministic scan:** `detect.mjs --json` exits 0 across the page and all 8 components. The detector does not encode the amber motif count, the mobile TOC absence (still present here), or the new off-by-two in the index (was off-by-one on `global-data`; here it's off-by-two).

## Design Health Score (after inherited fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 3 → 3 | Unchanged. Scroll-spy TOC + active highlight. |
| 2 | Match System / Real World | 3 → 3 | Unchanged. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. |
| 4 | Consistency and Standards | 3 → **4** | **+1:** Six shared components now have their amber stripped (icons muted, code names muted, headers plain, file paths muted, step boxes bare). The page itself was already on-brand. The new finding in this run is the **off-by-two in `adr/index.vue:154`** (`sections: 14` vs. 12 actual `<AdrSection>` blocks and 12 `tocSections` entries) — same shape of bug as `global-data`, slightly bigger gap. Worth a one-character fix. |
| 5 | Error Prevention | 3 → 3 | Unchanged. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. |
| 7 | Flexibility and Efficiency | 3 → 3 | **Unchanged.** Mobile TOC is desktop-only (`hidden lg:block` at line 13). The mobile-TOC pattern from `global-data.vue` was not extended to this page. On a 908-line, 12-section page, this is the same Casey-hostile gap. |
| 8 | Aesthetic and Minimalist Design | 3 → **4** | **+1:** Amber motifs dropped at the component level. Estimated page-level amber count: ~50 (down from ~70+ before). The remaining motifs are page-level: 1 overview callout (`border-primary/30 bg-primary/5`), 1 overview icon-box (`bg-primary/10`), 2 inline icon-boxes (lines 114, 149 in the page), 1 mode-detection callout (`border-primary/30 bg-primary/5`), 7 inline `text-primary` `<code>` highlights, 1 `text-primary/30` decorative icon. All focal content or signal-bearing. |
| 9 | Error Recovery | 3 → 3 | Unchanged. |
| 10 | Help and Documentation | 3 → 3 | Unchanged (JSON-LD was already present from the prior `897c402` fix). |
| **Total** | | **30 → 32/40** | **Good.** |

## Inherited Wins (from `polish/adr-global-data-critique-fixes` commit `08e392b`)

| Component | What was stripped | Effect on `multi-mode-system.vue` |
|-----------|-------------------|-----------------------------------|
| `AdrSection.vue:38-44` | `bg-primary/10` icon-box wrapper | 12 sections × 1 motif = **-12** |
| `AdrFlowDiagram.vue:38-45` | `bg-primary/10` step-box wrapper | 3 flow diagrams × 4 steps = **-12** |
| `AdrCodeBlock.vue:13-17` | `bg-elevated/20` header divider + `text-primary` icon | 4 code blocks × 2 motifs = **-8** |
| `AdrApiCard.vue:15` | `text-primary` code name | 4 API cards × 1 = **-4** |
| `AdrDecisionTable.vue:14, 26` | `text-primary` icon + `bg-primary/5 text-primary` headers | 2 tables × ~2.5 motifs = **-5** |
| `AdrFileReference.vue:17, 28` | `text-primary` icon + `bg-primary/5` on paths | 1 block × 7 paths + 1 icon = **-8** |
| **Total component motifs removed** | | **~49 motifs** |

Plus the page-level decorative boxes and inline codes (which were never the amber overload — those are focal content and are kept).

## Issues Closed in this Run

- **P3 dynamic Tailwind classes in `AdrFlowDiagram`** (from the 2026-06-15T10-50 snapshot) — was already closed by the static `COLOR_CLASSES` map fix in commit `897c402`. The current state still has the static map; the comment in line 12 documents the prohibition.
- **P3 missing JSON-LD** (from the same snapshot) — was already closed by `897c402`. The current `multi-mode-system.vue:482-510` has the full `TechArticle` schema with `headline`, `description`, `url`, `inLanguage: 'ar'`, two `author` entries, and `publisher`.
- **Component-level amber motif overload** — closed by the inherited `08e392b` fix.

## What's Still Open (carried over + new from this run)

### Carried over (not in scope of the amber strip branch)
- **P2 mobile TOC absent on `multi-mode-system.vue`** — `hidden lg:block` at line 13, same as `global-data.vue` before the fix. The mobile-TOC `<details>` pattern from `global-data.vue:17-37` is page-level, not component-level, so it has to be added to this page (or extracted to a shared `<AdrMobileToc>` component and reused).
- **P2 code-block highlighting** — `AdrCodeBlock.vue` and `AdrApiCard.vue` still render plain `<pre>`. This page ships 4 `<AdrCodeBlock>` (js, vue, etc.) and 4 `<AdrApiCard>` (each with a code example) = ~8 code blocks. Shiki one-time wiring benefits this page, `global-data.vue`, and `blog/[slug].vue`.
- **Minor:** `AdrCodeBlock.vue` and `AdrApiCard.vue` no longer have the redundant `style="text-align: left;"` (closed in the inherited fix). `multi-mode-system.vue` itself doesn't appear to have inline `dir="ltr"` + `style="direction: ltr;"` redundancies on its own content.

### New in this run
- **P3 off-by-two in `adr/index.vue:154`** — `sections: 14` vs. 12 actual `<AdrSection>` blocks (counted: lines 20, 67, 88, 113, 142, 171, 200, 229, 258, 287, 316, 345) and 12 `tocSections` entries (lines 510-523). The off-by-one on `global-data` was fixed in the same branch; the off-by-two on `multi-mode-system` was not. Same shape of bug, bigger gap. Riley would notice.
  - **Fix:** Change `adr/index.vue:154` from `sections: 14` to `sections: 12`.
  - **Suggested command:** `/impeccable polish`
- **Minor:** The page is 908 lines, the largest in the portfolio. The `app/data/` extraction conversation is the same as the one flagged on `global-data.vue`; both ADRs are candidates for a future data-module split.

## Persona Red Flags (after inherited fixes)

**Sam (screen reader / keyboard):** No regression. Mobile TOC still missing on this page (the same gap Casey faces). Code blocks still announce as one paragraph each.

**Jordan (peer judging engineering depth):** The page is the closing argument of the portfolio for a peer technical reviewer. With the amber strip inherited, the icons and callouts read as signal again, not fill. The 12-section, 3-flow-diagram structure is intact.

**Riley (quality / SEO / consistency auditor):** Notes the inherited cleanup (the page is materially cleaner), and the new off-by-two on the index (the same shape of bug as `global-data`, larger gap). Would also note that the same mobile-TOC pattern from `global-data` is not yet extended to this page.

**Casey (mobile reader):** Still the same mobile-hostile gap as before. The `<details>` mobile TOC is in `global-data.vue` but not here. Casey would have to scroll 908 lines to find a section, lose their place, and start over.

## Inherited Wins Recap (portfolio-wide)

The amber strip on the 6 shared components is a portfolio-wide structural win. The same components are also used in:
- `global-data.vue` — re-critiqued at 28 → 31 (+3) in this cycle
- `multi-mode-system.vue` — re-critiqued at 30 → 32 (+2) in this run

The score delta is smaller on `multi-mode-system` because the page had less of its own amber to begin with (more of its motifs were already in the shared components, which moved together). Both ADRs are now in the 30+ band.

A re-critique of `blog/[slug].vue` is also worth doing (the same `bg-primary/10` icon-box motif is used in `BlogSidebar.vue` per the handoff §6, though it's a different component, not the shared `adr/*` set).

## Questions to Consider

1. The off-by-two in `adr/index.vue:154` is the same shape of bug as the off-by-one on `global-data` (which was fixed in this cycle). One-character fix, same priority. Worth a small polish branch now, or do you prefer to bundle it with a future ADR index overhaul?
2. The mobile-TOC pattern from `global-data.vue` is in scope to extend to this page (12 sections, 908 lines, same mobile-hostile gap). Per-page fix or extract to a shared `<AdrMobileToc>` component?
3. The page-level inline `text-primary` on `<code>` (lines 133, 136, 225, 228, 327) — these are focal content (specific tokens in the running text), not motif overload. Worth keeping as-is, or is there a less-amber treatment that preserves the readability?
