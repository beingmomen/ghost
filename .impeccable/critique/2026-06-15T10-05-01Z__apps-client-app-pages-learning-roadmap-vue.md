---
target: apps/client/app/pages/learning-roadmap.vue
total_score: 29
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T10-05-01Z
slug: apps-client-app-pages-learning-roadmap-vue
---
# Critique — apps/client/app/pages/learning-roadmap.vue

**Score: 29/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/learning-roadmap.vue (+ components/roadmap/*)

## Anti-Patterns Verdict

**LLM assessment:** Not slop, and the most genuinely interactive page in the project. Collapsible phases, live progress bars (overall, per-phase, progress-to-next), a level ladder that highlights the current rung, and tasks with done/strikethrough state and type badges. Critically, the big "overallPercent %" block reads as content (it is the page's subject, live progress), not the banned decorative hero-metrics template. Clean hero, no eyebrow, no gradient.

**Deterministic scan:** `detect.mjs` exit 0 across the page and both roadmap components. Vue SFC skips Tier 2 checks; the empty-stats and a11y issues are logic/semantic matters the markup detector does not encode.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Excellent live progress; phases have an empty state, but the stats hero does not |
| 2 | Match System / Real World | 3/4 | Arabic + appropriate technical terms (Mid/Senior); clear progression |
| 3 | User Control and Freedom | 3/4 | Collapsible phases, first one open by default |
| 4 | Consistency and Standards | 3/4 | Consistent; the phase toggle is a manual button outside `UCollapsible` |
| 5 | Error Prevention | 3/4 | Defaults prevent crashes; the stats hero still renders empty values |
| 6 | Recognition Rather Than Recall | 3/4 | The level ladder makes "where am I" visible at a glance |
| 7 | Flexibility and Efficiency | 3/4 | Progressive disclosure via collapsibles |
| 8 | Aesthetic and Minimalist Design | 3/4 | Functional, restrained; stats are content not decoration |
| 9 | Error Recovery | 2/4 | No error-vs-empty distinction and no retry; the stats hero breaks on empty |
| 10 | Help and Documentation | 3/4 | The roadmap is self-documenting |
| **Total** | | **29/40** | **Good — strong interactive page; harden the empty/error path** |

## Overall Impression

This is the strongest interactive build in the project: real progressive disclosure, live progress at three levels, and a level ladder that answers "how far am I" instantly. The gap is the empty/error path. The phases list has a proper empty message, but the stats hero (`RoadmapHero`) renders unconditionally, so on a failed or empty `/roadmap` it shows a skeleton of labels with no values, "%" with no number, "/ مهمة", "~ أسبوع", which looks broken. There is also no distinction between a real error and genuinely empty data, and no retry.

## What's Working

1. **The progress system is excellent and live.** Overall percent, done/total tasks, weeks/hours remaining, an overall bar, per-phase bars with percent, and per-task done state with strikethrough. Status visibility is the page's strength.
2. **The level ladder is a clear mental model.** Mid → Senior rungs with everything up to the current level highlighted, plus a "progress to next milestone" bar or a "Senior reached" celebration. It communicates trajectory at a glance.
3. **Progressive disclosure is used well.** Phases are collapsibles with the first open by default, so the page is scannable without dumping every week and task at once.

## Priority Issues

### [P2] The stats hero renders broken values on empty/error, and there is no error/retry
- **File:** learning-roadmap.vue:45-47 (`RoadmapHero` rendered unconditionally), :4-8 (`useAPI` exposes neither `error` nor `refresh`); RoadmapHero.vue:30-46 (`{{ stats.overallPercent }}%`, `{{ stats.doneTasks }} / {{ stats.totalTasks }}`, `~{{ stats.weeksRemainingToSenior }} أسبوع`)
- The phases list has an empty state, but `RoadmapHero` always renders. When `/roadmap` fails or returns nothing, `stats` is `{}`, so the hero shows "%" with no number, "/ مهمة" with no counts, and "~ أسبوع" with no figure: a broken-looking header. A real error is also indistinguishable from empty, and there is no way to retry.
- **Fix:** Hide `RoadmapHero` when there are no stats (e.g. `v-if="stats.totalTasks"`), and expose `error` + `refresh` to show one error indicator with a retry (the landing's pattern).
- **Suggested command:** `/impeccable harden`

### [P3] The phase toggle is not announced as expandable
- **File:** RoadmapPhaseSection.vue:17-48 — a `<button>` toggles `open`, but `UCollapsible` (which carries the a11y wiring) is a separate element below it
- Because the trigger is a hand-rolled button outside `UCollapsible`, it has no `aria-expanded` / `aria-controls`, so a screen reader does not announce that it expands a section or whether it is open.
- **Fix:** Add `:aria-expanded="open"` and an `aria-controls` pointing at the content, or use `UCollapsible`'s own trigger slot so the wiring is automatic.
- **Suggested command:** `/impeccable harden`

### [P3] Em dash in the week-focus separator
- **File:** RoadmapPhaseSection.vue:72 — `— {{ week.focus }}`
- The project's copy guidance avoids em dashes. Here one separates the week title from its focus.
- **Fix:** Use a colon or a thin separator (": " or " · ").
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Jordan (a peer evaluating technical depth):** Sees a polished, live progress system that signals seriousness, as long as the data loads; if `/roadmap` hiccups, the top of the page shows a "%" with no number and "~ أسبوع" with no figure, which undercuts the credibility the page is trying to build.

**Sam (screen reader / keyboard):** Can reach the phase toggles by keyboard, but they are not announced as expandable (no `aria-expanded`), so the collapsible state is invisible to assistive tech.

**Riley (quality auditor):** Notes that the phases empty-state exists but the stats hero does not, that error and empty are conflated with no retry, and that the toggle is a manual button bypassing `UCollapsible`'s a11y.

## Minor Observations

- The week-title/focus and the badge colors rely on `levelColor` / `TASK_TYPE_META`; worth a quick check that they only return valid Nuxt UI 4 color roles (primary/neutral/success/...), not legacy names.
- No roadmap-specific structured data; a `Course`/`HowTo`-style schema is optional and niche here.
- The phase header uses `flex-wrap`, so on very narrow widths the `w-32` progress can wrap below the title; acceptable, worth a glance on mobile.

## Questions to Consider

1. The phases list fails gracefully but the stats hero does not. Should `RoadmapHero` hide when there is no data, and should a real error surface a retry rather than render empty figures?
2. The collapsible trigger is hand-rolled outside `UCollapsible`. Would using the component's own trigger (and its built-in a11y) be simpler and more correct than re-implementing the toggle?
3. This is the most interactive page on the site and it is genuinely useful. Is it discoverable enough from the main navigation, or is it buried for a page this strong?
