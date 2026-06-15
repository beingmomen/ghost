---
target: apps/client/app/pages/sdlc-ar.vue
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T14-46-49Z
slug: apps-client-app-pages-sdlc-ar-vue
---
# Re-critique — apps/client/app/pages/sdlc-ar.vue

**Score: 30/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/sdlc-ar.vue (+ components/sdlc-ar/*)

**Trend for `apps-client-app-pages-sdlc-ar-vue` (last 5 runs): 27 → 30** (+3)

**Re-run scope:** Verifying the 5 fixes shipped in commit `718834f` from branch `polish/sdlc-ar-critique-fixes`: JSON-LD + `useRuntimeConfig`, 6 dead `color` fields removed, SdlcArDiagrams English→Arabic + Lucide icons, `bg-primary/10` icon-box wrappers stripped from PhaseSection/Tasks/Diagrams.

## Anti-Patterns Verdict

**LLM assessment:** All 5 P1/P2/P3 issues from the 2026-06-15T15-30 critique have been closed. The page now matches the brand discipline of the rest of the portfolio and matches the English `sdlc.vue` mirror structurally and semantically (both ship `TechArticle` JSON-LD, both use the `text-amber` title highlight, both have 6 phases, both have role modals).

`SdlcArDiagrams` is no longer the lone English section in an Arabic page. The icon register is unified (8 Lucide icons vs. 8 emoji). The page's information density is preserved; the visual register is consistent.

**Deterministic scan:** `node .claude/skills/impeccable/scripts/detect.mjs --json` exits 0 across the page and all 7 components. Tier-1 only; the detector does not catch the still-open P3s (mobile TOC, ogUrl).

## Design Health Score (after fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 3 → 3 | Unchanged. |
| 2 | Match System / Real World | 3 → **4** | **+1:** `SdlcArDiagrams` no longer breaks the language register (was the only English section in the page; 8 labels and section title are now Arabic with English technical terms in brackets). |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. |
| 4 | Consistency and Standards | 3 → 3 | Unchanged (was already good). |
| 5 | Error Prevention | 3 → 3 | Unchanged. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. |
| 7 | Flexibility and Efficiency | 2 → 2 | **Unchanged** (mobile TOC and back-to-top still not added — these were *not* in the fix scope). |
| 8 | Aesthetic and Minimalist Design | 2 → **3** | **+1:** `bg-primary/10` icon-box wrappers stripped from `SdlcArPhaseSection` (3× per phase × 6 = 18 motifs), `SdlcArTasks` (4 motifs), `SdlcArDiagrams` (8 motifs). Total: -30 motifs. Honey Signal Rule count drops from ~50 to ~30 on this page; the remaining ~30 are all signal-bearing (phase layer icons, "المخرج الأساسي" callouts, hover states, section accents, workflow stage bullets). |
| 9 | Error Recovery | 3 → 3 | Unchanged. |
| 10 | Help and Documentation | 2 → **3** | **+1:** `TechArticle` JSON-LD added with `headline`, `description`, `author`, `url`, `inLanguage: 'ar'`. `sdlc-ar.vue` is no longer the only content page in the portfolio without structured data. |
| **Total** | | **27 → 30/40** | **Good.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P1 #1:** No JSON-LD schema on sdlc-ar.vue (only content page missing it) | **Closed** | `apps/client/app/pages/sdlc-ar.vue:45-63` — `useHead` with `TechArticle` + `useRuntimeConfig` block added. |
| **P1 #2 cheap:** Honey Signal Rule broken — amber motifs well over budget | **Closed (partial)** | `bg-primary/10` icon-boxes removed from `SdlcArPhaseSection.vue:31-37, 55-61, 88-94` (3 layers), `SdlcArTasks.vue:44`, `SdlcArDiagrams.vue:31-37`. Amber count ~50 → ~30. |
| **P2:** `SdlcArDiagrams` English-only labels + emoji icons | **Closed** | Section title "المخططات" + description added; 8 labels translated; 8 emoji → 8 Lucide icons. |
| **P3:** 6 dead `color` fields on phases | **Closed** | All 6 `color: 'cyan'\|'violet'\|'emerald'\|'amber'\|'orange'\|'pink'` removed from `sdlc-ar.vue:65-285`. Grep confirms 0 matches. |
| **P3:** Em-dash split pattern in titles | **Unchanged (intentional)** | Still uses ` — ` as separator in `SdlcArPhaseSection.vue:76-81` and title format. Mirrored from the English `sdlc.vue`; not a regression. |

## What's Still Open (carried over from the 2026-06-15T15-30 snapshot)

These were *not* in the fix scope of the `polish/sdlc-ar-critique-fixes` branch. Worth tracking for a future pass:

- **P3 mobile TOC / back-to-top** — heuristic 7 still at 2/4. The page is long (287 lines) and a long-content reader on mobile has no in-page navigation beyond the Hero's "استكشف المراحل" CTA to `#analysis`.
- **P3 `ogUrl` / `ogImage`** — `useSeoMeta` block declares `ogType`, `ogLocale`, `twitterCard`, but no `ogUrl` and no `ogImage`. The English `sdlc.vue` has the same gap. (The `@nuxtjs/seo` module auto-derives `ogUrl` from the route, so this is non-blocking, but explicit is better.)
- **Minor:** `SdlcArTimeline.vue:50` uses Arabic-Indic digit "٦" for the section title "٦ مراحل · الأدوار في لمحة" while the rest of the page uses Western digits in `num: '01' | '02' | ...`. Typographic inconsistency.
- **Minor:** `useHead` + `useSeoMeta` both declared separately (lines 19-39). `useSeoMeta` already covers title and description, so the `useHead` block is partially redundant. Mirrored from the English `sdlc.vue`; not a regression.
- **P3 amber budget residual:** the ~30 remaining amber motifs include 6 "المخرج الأساسي" callouts (`bg-primary/5 border-primary/20`), 18 `text-primary/50` bullets in the layerB/layerC lists, 25 `bg-primary/50` workflow stage bullets, and the 9 phase layer icons. Each is signal-bearing, but the cumulative count on a single content page is still above the strict 3-per-screen budget. The cheap fix landed; the bigger restructure (per-phase accent via static color map) was not in scope.

## Persona Red Flags (after fixes)

**Sam (screen reader / keyboard):** The role modal remains correctly accessible (`<button>` + dismissible UModal). Heading structure unchanged. No regression. Mobile navigation gap remains.

**Jordan (peer judging depth on the Arabic mirror):** Now reads a fully unified Arabic page, no register break. The Diagrams section no longer breaks the immersion.

**Riley (quality / consistency auditor):** All 5 P-items from the prior run are closed. Remaining open issues are minor (mobile TOC, ogUrl, digit typographic inconsistency) and out of scope for this branch.

## Questions to Consider

1. The `bg-primary/5` and `bg-primary/50` motifs in `SdlcArPhaseSection` (the "المخرج الأساسي" callouts × 6) and `SdlcArWorkflow` (the bullet list × 25) are the next-largest amber surface. Worth a follow-up pass?
2. The page is now structurally and semantically identical to `sdlc.vue` in all the ways that matter. Does the symmetric treatment feel right (both pages ship JSON-LD, both use the same icon register, both have the same role modal), or did the earlier divergence reflect an intentional choice to differentiate the Arabic mirror?
3. Heuristic 7 (flexibility / efficiency) is still at 2/4. A 2-minute back-to-top button on this 287-line page would lift it to 3/4. Is the surface cost worth the score improvement?
