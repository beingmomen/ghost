---
target: apps/client/app/pages/sdlc-ar.vue
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-06-15T13-50-42Z
slug: apps-client-app-pages-sdlc-ar-vue
---
# Critique — apps/client/app/pages/sdlc-ar.vue

**Score: 27/40 (Acceptable, lower edge)** | P0: 0 | P1: 2 | Target: apps/client/app/pages/sdlc-ar.vue (+ components/sdlc-ar/*)

**Trend for `apps-client-app-pages-sdlc-ar-vue` (last 5 runs):** First run for this target, no trend yet.

## Anti-Patterns Verdict

**LLM assessment:** Not slop — no glassmorphism, no gradient text, no side-stripe card borders, no SaaS hero-metrics template. The page is a clean, content-dense Arabic framework that mirrors `sdlc.vue` structurally and uses the same brand tokens (`bg-elevated/30`, `border-default/60`, `text-primary`) and the same static class maps (`SdlcArDecisions` `nodeStyles`). It reads as part of the system.

**The two tells that are present and need attention:**

1. **The Honey Signal Rule is broken.** `design.json:narrative.rules:311-315` specifies max 3 amber moments per screen. `SdlcArHero.vue:14-19` already exhausts the budget on its own (text-amber title highlight, primary badge "دليل المعماري · OOA&D", primary CTA "استكشف المراحل"). The body then **adds** 30+ `bg-primary/10` icon-boxes plus 11 more `<UBadge color="primary">` on phase/stage numbers. The dead `color` field on each phase (`sdlc-ar.vue:47,85,123,161,199,237`) is the smoking gun — it was clearly meant to provide per-phase color-coding that was never wired in. Per-phase accent (wired through a static map, as `SdlcArDecisions` `nodeStyles` already does for the decision cards) would have solved this.

2. **`SdlcArDiagrams` breaks the language and visual register.** The section sits inside an otherwise fully Arabic page but: (a) the section title is "Diagrams" not "المخططات"; (b) all 8 `name` values are English-only ("UML", "Component Diagrams", "Use-case Diagram", "Activity Diagram", "Class Diagram", "Sequence Diagram", "State Machine Diagram", "Deployment Diagram"); (c) the icons are 8 emoji glyphs (📐🔧👥🔄🧩📨⚙️🖥️) where every other section in the app uses Lucide. This is a one-component register break that the audit of the rest of the page cannot compensate for.

**Deterministic scan:** `node .claude/skills/impeccable/scripts/detect.mjs --json` exits 0 across the page and all 7 components, which is the expected outcome for `.vue` SFCs (the detector only does Tier-1 checks on them; a clean exit ≠ fully clean — see `SKILL.md`). The detector would not have caught the JSON-LD absence, the dead `color` fields, the amber budget overrun, or the mixed-language `SdlcArDiagrams`.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Static page; role modal gives on-demand detail; breadcrumb via schema. No progress indicator between phases 01–06; role modal returns no "back to grid" affordance beyond closing. |
| 2 | Match System / Real World | 3/4 | Arabic tech content; OOA&D terminology matches the target audience. Mixed-language break in `SdlcArDiagrams` (see Anti-Patterns). |
| 3 | User Control and Freedom | 3/4 | Anchor navigation, dismissible role modal, static page. Modal closes via UModal's default `close` button. |
| 4 | Consistency and Standards | 3/4 | Brand-aligned tokens, static class maps, no glassmorphism, no side-stripe borders. **Inconsistency**: emoji icons in `SdlcArDiagrams` vs Lucide everywhere else; English section title inside an Arabic page. |
| 5 | Error Prevention | 3/4 | Static content, nothing to fail. |
| 6 | Recognition Rather Than Recall | 3/4 | Phase nav + sectioned layers make the framework scannable. Role detail is on-demand via click, avoiding wall-of-text overload. |
| 7 | Flexibility and Efficiency | 2/4 | **Drop.** No keyboard shortcut to jump to a phase. No back-to-top button on a page this long. The Timeline section's role buttons are small tap targets (no min 44×44). No "jump to phase X" selector. Compare to `blog/[slug].vue` (TOC) and `adr/multi-mode-system.vue` (TOC), which both have at least a sidebar. |
| 8 | Aesthetic and Minimalist Design | 2/4 | **Drop.** Honey Signal Rule broken: 3 amber moments in Hero alone, +30+ `bg-primary/10` icon-boxes in the body, +11 `<UBadge color="primary">`. Per-phase color-coding was clearly intended (dead `color` field) but was never wired through a static map. |
| 9 | Error Recovery | 3/4 | n/a (static); modal closes cleanly. |
| 10 | Help and Documentation | 2/4 | **Drop.** Page is documentation but **lacks JSON-LD `TechArticle` schema** (the English mirror `sdlc.vue:43-61` has it; this one doesn't). No `ogUrl`. This is the only content page in the whole `apps/client` portfolio without JSON-LD — confirmed by grep across `apps/client/app/pages/*.{vue,ts}` (10 of 11 content pages have it). Without schema, the page won't surface as a rich result in Arabic search. |
| **Total** | | **27/40** | **Acceptable (lower edge). Strong content, 1 SEO/a11y P1 (JSON-LD), 1 visual P1 (amber budget), 1 register P2 (Diagrams), 2 polish P3 (dead `color` field, em-dash title split).** |

## What's Working

1. **It is the structural mirror of `sdlc.vue` and reads as part of the system.** Same token discipline, same static class maps, same Tailwind purge safety, same Arabic baseline (1.125rem / line-height 1.8 enforced throughout). The `<button>` for role items in `SdlcArTimeline.vue:81-87` correctly carries forward the a11y fix that was applied to the English `SdlcTimeline.vue` — keyboard and screen-reader users can open the role detail here, which is what the previous critique of `sdlc.vue` flagged as a P2 there.
2. **The content is stronger than the score suggests.** Six phases, each with a what/breakdown/checkpoints three-layer card plus roles, key question, next-phase trigger, and risk-if-skipped; the decision-flow recovery logic with three semantic types (warn/err/ok) pulled from a static class map; the OOA&D workflow with 5 stages; a complete role taxonomy with on-demand detail. This is exactly the senior-architect thinking the audience wants, and the Arabic is clean and consistent.
3. **The decision recovery section is a real differentiator.** Six conditional cards (`SdlcArDecisions.vue:1-105`) with proper Arabic right-alignment, semantic colors (warning/error/success via static map), and a `→` action arrow inside a `<strong>`-highlighted target phrase. It does the work the page promises without AI tell.

## Priority Issues

### [P1] No JSON-LD `TechArticle` schema (the only content page in the portfolio missing it)
- **File:** `apps/client/app/pages/sdlc-ar.vue:1-271` (the entire page, since the schema block is missing) — compare to `apps/client/app/pages/sdlc.vue:43-61` for the exact pattern.
- The English `sdlc.vue` ships a `TechArticle` JSON-LD with `headline`, `description`, `author`, `url`, `inLanguage: 'en'`. The Arabic mirror at `/sdlc-ar` ships **none**. A grep of `application/ld\+json` across `apps/client/app/pages/` confirms 10 of 11 content pages (including the English mirror) have it; `sdlc-ar.vue` is the only outlier. This breaks rich-result eligibility, dilutes internal linking schema, and leaves the Arabic URL as a dead branch in the structured-data graph.
- **Fix:** Add a `useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'TechArticle', headline, description, author, url: \`${config.public.siteUrl}/sdlc-ar\`, inLanguage: 'ar' }) }] })` block to `sdlc-ar.vue`, mirroring `sdlc.vue:43-61`. Requires adding `const config = useRuntimeConfig()` to the script (currently absent in `sdlc-ar.vue`).
- **Suggested command:** `/impeccable document`

### [P1] Honey Signal Rule broken — amber moments well over the 3-per-screen budget
- **Files:** `SdlcArHero.vue:14-19` (3 amber moments: text-amber title, primary badge, primary CTA) + `SdlcArTimeline.vue:67-72` (6 `<UBadge color="primary">` on phase nums) + `SdlcArWorkflow.vue:55-60` (5 `<UBadge color="primary">` on stage nums) + `SdlcArPhaseSection.vue:32,57,90` (18 `bg-primary/10` icon-boxes) + `SdlcArTasks.vue:44` (4 `bg-primary/10` icon-boxes) + `SdlcArWorkflow.vue:70` (1 `bg-primary/50` dot — primary-tinted) + `SdlcArDiagrams.vue:30` (8 `bg-primary/10` icon-boxes) + `SdlcArPhaseSection.vue:43-50` (6 `bg-primary/5`/`border-primary/20` "المخرج الأساسي" callout) + `SdlcArPhaseSection.vue:73,106` (24 `text-primary/50`/`text-warning/60` bullets)
- `design.json:narrative.rules:311-315` and `DESIGN.md:114` set the budget at max 3 amber moments per screen. The Hero alone meets the budget, then the body adds 30+ more amber-tinted motifs. The `color: 'cyan' | 'violet' | 'emerald' | 'amber' | 'orange' | 'pink'` dead fields on each phase (`sdlc-ar.vue:47,85,123,161,199,237`) are the smoking gun: per-phase color-coding was clearly intended but never wired in. The decision cards (`SdlcArDecisions` `nodeStyles`) already prove the static-map pattern works.
- **Fix (two-step, judgment call):**
  1. **Cheap (P3-ish):** Remove the `bg-primary/10` background from the icon-boxes in `SdlcArPhaseSection`, `SdlcArTasks`, and `SdlcArDiagrams` — keep the icon and its `text-primary` color, drop the tinted square. Brings the body close to budget.
  2. **Bigger (P1):** If per-phase color-coding is wanted, wire a static class map (`PHASE_ACCENTS: { cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600' }, violet: ..., ... }`) and apply it to the `bg-primary/10` icon-boxes + the phase num `<UBadge>` (which already accepts `color=`). This was almost certainly the original design intent; the dead `color` field is the evidence. If per-phase color-coding is not wanted, delete the dead fields (this is the P3 from the snapshot of `sdlc.vue`).
- **Suggested command:** `/impeccable quieter` (cheap fix) or `/impeccable colorize` (bigger fix)

### [P2] `SdlcArDiagrams` — English-only labels and English section title inside an Arabic page; emoji icons break the visual register
- **File:** `apps/client/app/components/sdlc-ar/SdlcArDiagrams.vue:3-39`
- All 8 `name` values are English ("UML", "Component Diagrams", "Use-case Diagram", "Activity Diagram", "Class Diagram", "Sequence Diagram", "State Machine Diagram", "Deployment Diagram"). The section `<UPageSection title="Diagrams">` is also English. The icons are 8 emoji glyphs (📐🔧👥🔄🧩📨⚙️🖥️) where every other component in the app uses Lucide (`i-lucide-*`). On a content page dedicated to the Arabic-first RTL voice, this is the only register break.
- **Fix (judgment call — the labels are technical terms that may legitimately stay in English in many Arabic tech contexts):**
  - **Minimum:** change the section title to "المخططات" and either translate the 8 labels ("مخططات UML", "مخططات المكونات", "مخطط حالات الاستخدام", "مخطط النشاط", "مخطط الفئات", "مخطط التسلسل", "مخطط آلة الحالة", "مخطط النشر") or accept the English as deliberate technical terminology and add a clarifying intro line.
  - **Bigger:** replace the 8 emoji with Lucide icons (`i-lucide-shapes`, `i-lucide-component`, `i-lucide-users-round`, `i-lucide-activity`, `i-lucide-box`, `i-lucide-arrow-right-left`, `i-lucide-cog`, `i-lucide-server`) so the section matches the visual register of the rest of the page.
- **Suggested command:** `/impeccable clarify` (content) + `/impeccable shape` (icons)

### [P3] Dead `color` data on every phase
- **File:** `sdlc-ar.vue:47,85,123,161,199,237` — each of the 6 phases carries `color: 'cyan' | 'violet' | 'emerald' | 'amber' | 'orange' | 'pink'`. No component in `apps/client/app/components/sdlc-ar/` reads `phase.color` (verified by grep — only `phase.id`, `phase.num`, `phase.title`, `phase.tagline`, `phase.layerA/B/C`, `phase.meta.*` are consumed).
- Same as the finding on `sdlc.vue` (`P3` in the 2026-06-15 snapshot). Either remove the dead fields, or — better — wire them through a static class map (see P1 above) so per-phase color-coding actually shows up.
- **Suggested command:** `/impeccable polish`

### [P3] Em-dash split pattern in `SdlcArPhaseSection` titles is intentional but creates a parsing dependency on a string sentinel
- **File:** `SdlcArPhaseSection.vue:76-81` and `20` (title)
- The title uses em-dash as a structural separator (`` `${phase.num} — ${phase.title}` `` on line 20), and the layerB items split on `' — '` to bold the prefix. This works, but it locks the copy pattern to a literal em-dash. If anyone changes the separator (e.g. `:`, `—`, or `·`), every layerB item breaks silently. The pattern is mirrored from `SdlcPhaseSection.vue:76-80` (English) so it is not a regression — but a data model with explicit `{ term, definition }` objects would be safer.
- **Fix:** If touching the data anyway (per the dead `color` field cleanup), consider changing `layerB.items` from `string[]` to `{ term: string, definition: string }[]` and rendering the join in the template. Optional, low priority.
- **Suggested command:** `/impeccable typeset`

## Persona Red Flags

**Sam (screen reader / keyboard):** The page is mostly content-heavy prose with a single interactive layer (the role modal) which is correctly keyboard-accessible (button + dismissible modal). However, on a page this long, the absence of a TOC, back-to-top, or "jump to phase" mechanism is a real accessibility cost — keyboard users must `Tab` through the entire document or use the browser's find. (See heuristic 7 score 2.)

**Jordan (peer judging depth on the Arabic mirror):** Reads the same strong SDLC framework as the English page in clean Arabic, with the role detail and decision-recovery sections working as expected. The only jarring moment is `SdlcArDiagrams` — Jordan would notice the section title "Diagrams" and the English labels as the single register break.

**Riley (quality auditor):** Notes the JSON-LD absence on this one page (the rest of the portfolio ships it), the dead `color` field on every phase, the `bg-primary/10` motif recurring 30+ times in the body (over the 3-per-screen amber budget from `DESIGN.md:114`), the emoji icons in one section only, and the lack of a back-to-top / TOC on a long-content page. Riley would also note that the same dead `color` field exists in the English `sdlc.vue` and the two pages' fixes should ship together (so the per-phase accent is consistent across both).

## Minor Observations

- The page has no `useRuntimeConfig()` import at all (grep confirmed). The English mirror uses it for the JSON-LD `url` and the `ogUrl` in `useSeoMeta`. The Arabic mirror is missing both, so its `ogUrl` is unset in Open Graph (the `useSeoMeta` block on `sdlc-ar.vue:30-39` declares `ogType`, `ogLocale`, but no `ogUrl`, no `ogImage`). This compounds with the JSON-LD absence.
- `SdlcArTimeline.vue:50` — the section title uses Arabic-Indic digits "٦" (U+0666) for the number 6 ("٦ مراحل"). The rest of the page uses Western digits in the `num: '01' | '02' | ...` field. This is a minor typographic inconsistency: if Arabic-Indic is the voice, use it consistently; if Western is, use it consistently. The current state is "both".
- The phase `<UPageSection>` `:id` attributes (`analysis`, `design`, ...) make the page anchor-navigable, and the hero CTA links to `#analysis` (`SdlcHero.vue:72`). This is good. But there is no inverse navigation (no "next phase" link at the bottom of each phase section), which would help on a long scroll.
- `useHead` + `useSeoMeta` are both declared separately on `sdlc-ar.vue:19-39`. The same pattern is on `sdlc.vue`. Convention-wise, `useSeoMeta` already covers title and description, so the `useHead` block is redundant — but this is mirrored from the English page and not a regression introduced by `sdlc-ar.vue`. (Worth a separate doc/consistency check across all pages.)
- The page is static inline data (`phases` array of 270 lines). As the framework grows, this would naturally become a data module — but for 6 phases it is fine. The English `sdlc.vue` does the same; consistency is preserved.

## Questions to Consider

1. The page is missing the `TechArticle` JSON-LD that the English mirror has, and the `useRuntimeConfig` import it needs to wire it. Should the fix ship as a direct mirror of `sdlc.vue:43-61`?
2. Each phase declares a distinct `color` field that nothing reads. Is per-phase color-coding a feature you want (wired through a static class map, as `SdlcArDecisions` `nodeStyles` does), or should the dead fields go? If kept, this also fixes the amber budget overrun in one move.
3. `SdlcArDiagrams` is the only English section in the Arabic page and the only place using emoji icons. Should the section be renamed + re-labeled in Arabic, and the icons swapped to Lucide to match the rest of the page, or is the current state deliberate (UML names are conventionally English even in Arabic tech writing)?
4. On a page this long, would a "back to top" button or a "jump to phase" TOC be worth the surface cost? Heuristic 7 dropped to 2/4 for that reason; it's a content-page pattern, not a regression.
