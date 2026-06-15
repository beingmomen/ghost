---
target: apps/client/app/pages/adr/global-data.vue
total_score: 31
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T14-47-51Z
slug: apps-client-app-pages-adr-global-data-vue
---
# Re-critique — apps/client/app/pages/adr/global-data.vue

**Score: 31/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/adr/global-data.vue (+ components/adr/*)

**Trend for `apps-client-app-pages-adr-global-data-vue` (last 5 runs): 28 → 31** (+3)

**Re-run scope:** Verifying the 4 fixes shipped in commit `08e392b` from branch `polish/adr-global-data-critique-fixes`: amber cheap strip across 6 components (AdrSection, AdrFlowDiagram, AdrCodeBlock, AdrApiCard, AdrDecisionTable, AdrFileReference), mobile TOC via collapsed `<details>`, off-by-one in `adr/index.vue`, and redundant LTR style removal in 2 components.

## Anti-Patterns Verdict

**LLM assessment:** All 4 P-items from the 2026-06-15T15-30 critique have been closed. The page is no longer the worst single-page amber overload in the portfolio, and the off-by-one in the index is gone. The mobile TOC closes the most visible persona gap (Casey, on a phone) without changing the desktop experience.

The component-level changes are *also* a structural win for `multi-mode-system.vue`: the same components (`AdrSection`, `AdrFlowDiagram`, `AdrCodeBlock`, `AdrApiCard`, `AdrDecisionTable`, `AdrFileReference`) are used there, and the amber reduction is in those components, not in the page. So `multi-mode-system.vue` inherits the cleanup without needing its own branch.

**Deterministic scan:** `detect.mjs --json` exits 0 across the page and all 8 components. The detector does not encode the amber motif count, the mobile TOC absence (now closed), the off-by-one, or the redundant LTR style — so a clean exit does not mean "perfect," just "no Tier-1 violations."

## Design Health Score (after fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 3 → 3 | Unchanged. Scroll-spy TOC still working. |
| 2 | Match System / Real World | 3 → 3 | Unchanged. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. |
| 4 | Consistency and Standards | 3 → **4** | **+1:** Off-by-one in `adr/index.vue:144` fixed (`sections: 9` now matches the 9 actual `<AdrSection>` blocks). |
| 5 | Error Prevention | 3 → 3 | Unchanged. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. |
| 7 | Flexibility and Efficiency | 2 → **3** | **+1:** Mobile TOC added via `<details class="lg:hidden">` above the first section, listing the same `tocSections` as anchor links. Mobile readers now have in-page navigation on this 556-line, 9-section page. Hidden on `lg+` where the sticky `AdrTableOfContents` is already visible. |
| 8 | Aesthetic and Minimalist Design | 2 → **3** | **+1:** Amber motifs dropped from ~50 to ~22. Removed: 9 `bg-primary/10` AdrSection boxes, 8 `bg-primary/10` AdrFlowDiagram step boxes, 5 amber AdrCodeBlock icons + 5 header `bg-elevated/20`, 6 amber AdrApiCard code names, 7-8 amber AdrDecisionTable headers + icon, 7 amber AdrFileReference code paths + icon. The remaining ~22 motifs are all signal-bearing (Hero accents, AdrSection icons per-section, AdrFlowDiagram default-color icons, "المخرج الأساسي" callouts, `<code>` highlights in overview, step-number UBadges). |
| 9 | Error Recovery | 3 → 3 | Unchanged. |
| 10 | Help and Documentation | 3 → 3 | Unchanged (JSON-LD was already present from the prior `897c402` fix). |
| **Total** | | **28 → 31/40** | **Good.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P1:** Honey Signal Rule broken at scale — ~50 amber moments | **Closed (cheap pass)** | `bg-primary/10` stripped from `AdrSection.vue:38-44` (icon-box wrapper removed), `AdrFlowDiagram.vue:38-45` (icon-box wrapper removed). `text-primary` stripped from `AdrApiCard.vue:15` (now `text-highlighted`), `AdrFileReference.vue:17, 28` (icon muted, paths to `text-highlighted bg-elevated/60`). `bg-primary/5` stripped from `AdrDecisionTable.vue:26` (headers now plain), `AdrCodeBlock.vue:13` (header divider now plain). Amber count ~50 → ~22. |
| **P2:** Mobile TOC absent | **Closed** | `global-data.vue:17-37` — `<details class="lg:hidden mb-6 ...">` above the first section, listing the same `tocSections` as anchor links, with `group-open:rotate-180` on the chevron. |
| **P3:** `adr/index.vue:144` `sections: 10` vs. 9 actual sections | **Closed** | `adr/index.vue:144` now `sections: 9`. |
| **P3:** Redundant `dir="ltr"` + `style="text-align: left;"` | **Closed** | `style="text-align: left;"` removed from `AdrCodeBlock.vue:32` and `AdrApiCard.vue:55`. `dir="ltr"` retained (implies the alignment). Grep confirms 0 matches. |

## What's Still Open (carried over from the 2026-06-15T15-30 snapshot)

These were *not* in the fix scope of the `polish/adr-global-data-critique-fixes` branch:

- **P2 code-block highlighting** — `AdrCodeBlock.vue:29-33` and `AdrApiCard.vue:52-56` still render plain `<pre>` (no Shiki / Prism / highlight.js). This page alone ships ~11 code blocks of mixed language; the same gap exists in `multi-mode-system.vue` and `blog/[slug].vue`. The Shiki work is a one-time wiring that benefits all three.
- **P2 mobile TOC on `multi-mode-system.vue` and `blog/[slug].vue`** — only `global-data.vue` got the mobile TOC; the sibling pages still hide the TOC below `lg`. The pattern is in the page file, not the component, so it would need to be added (or extracted) per page.
- **Minor:** `global-data.vue:172` still has `dir="ltr"` + `style="direction: ltr;"` on the `useAuth().data ──computed──→ useGlobal ──read──→ أي مكان` line. Same redundancy pattern as the code blocks; the inline `style` is unnecessary.
- **Minor:** `architectureSteps` and `refreshSteps` depth is inconsistent (the first is dense, the second terse). Could be intentional (refresh is conceptually simpler) or an oversight.
- **P3 amber budget residual:** the ~22 remaining amber motifs on the page are signal-bearing, but still above the strict 3-per-screen budget. The cheap fix landed; the bigger restructure (per-section accent via static color map, or a single focal amber per section) is a design-system conversation, not a one-file fix.

## Inherited by `multi-mode-system.vue`

The 6 component-level changes (`AdrSection`, `AdrFlowDiagram`, `AdrCodeBlock`, `AdrApiCard`, `AdrDecisionTable`, `AdrFileReference`) are shared with `multi-mode-system.vue`. The amber reduction applies there too. The page is the only ADR with the mobile TOC now, but the strip cleanup is portfolio-wide for any ADR that uses these components.

This is a quiet but real win: a re-critique of `multi-mode-system.vue` would now likely land at ~31-32/40 too (it was 30 before the fix at `2026-06-15T10-50-29Z`, and the score was anchored partly on the amber motif density in those shared components).

## Persona Red Flags (after fixes)

**Sam (screen reader / keyboard):** TOC is now reachable on mobile via the new `<details>`. Headings and table semantics unchanged. Code blocks still announce as one paragraph each (no `<code>` tokenization).

**Jordan (peer judging engineering depth):** Amber is now a signal again, not a fill. Section icons, callouts, and the Hero accent are the only amber moments in the body; the rest is muted. This is what Jordan was reading for.

**Riley (quality / SEO / consistency auditor):** All 4 P-items closed. Off-by-one is gone. Mobile TOC exists. The remaining open items (code highlighting, `multi-mode-system` mobile TOC, amber residual) are tracked but not in scope for this branch.

**Casey (mobile reader):** Can now expand the TOC, jump to any of the 9 sections, and the in-page nav mirrors the desktop sticky TOC's anchors. Not a full rewrite, but the unblocked-persona change.

## Questions to Consider

1. The page is at ~22 amber moments, all signal-bearing. Is amber overload a budget you want enforced here, or is "every focal thing is amber" the deliberate system?
2. The mobile TOC is in this page. Should the same `<details>` pattern be added to `multi-mode-system.vue` and `blog/[slug].vue`, or extracted to a shared `<AdrMobileToc>` component?
3. The cheap amber strip was the right move; the bigger restructure (per-section focal amber) is a design system conversation. Worth a dedicated pass, or do the residual ~22 motifs represent the right ceiling for a dense technical doc?
