---
target: apps/client/app/pages/about.vue
total_score: 29
p0_count: 0
p1_count: 1
timestamp: 2026-06-15T15-02-01Z
slug: apps-client-app-pages-about-vue
---
# Re-critique — apps/client/app/pages/about.vue

**Score: 29/40 (Good, lower edge)** | P0: 0 | P1: 1 | Target: apps/client/app/pages/about.vue (+ components/PolaroidItem.vue)

**Trend for `apps-client-app-pages-about-vue` (last 5 runs): 27 → 29** (+2)

**Re-run scope:** Verifying the 2 fixes shipped in commits `27f100b` and `ced506e` (both landed between the prior snapshot `2026-06-15T09-39-52Z` and this re-run): the P1 error/empty handling and the P3 mobile border fix. The P2 stats hero-metrics drift and the P3 amber/icon-box excess were *not* in those fixes' scope.

## Anti-Patterns Verdict

**LLM assessment:** The page is the trust surface of the portfolio (the "page whose job is trust" per the prior snapshot). The structural problem the prior critique identified — on a failed `/infos` or `/experiences/all`, the page used to show empty section headings plus a stray `""` from the unguarded quote — is closed. The page now mirrors the landing's `LandingSectionFallback` pattern, with section-level `v-if` guards on every data-driven section and a `ProfilePage` JSON-LD block that includes retry. This is the correct fix.

The remaining brand drift is in Section 3 (Stats). The four `bg-primary/10` icon-boxes plus the `text-4xl sm:text-5xl text-amber` numbers reintroduce the exact SaaS "stats block" the prior critique flagged as a P1, with the same icon-boxes that were already stripped from the landing's `Stats.vue`. The page *can* be defended on the "this is the legacy stats component" front, but the brand now has two conflicting stat treatments in the same portfolio. The P1 is still open.

A third minor find: `PolaroidItem.vue:30` uses `font-serif` for the polaroid caption. This is the only `font-serif` instance in the entire `apps/client/app` tree. The two-family rule (`DESIGN.md:137` and `design.json:narrative.rules:326-330`) is the brand commitment, and the polaroid metaphor is the documented exception noted in the prior snapshot — but "documented exception" requires documentation, and the design system file does not register it. Either register the exception in `DESIGN.md` or replace with `font-display` (Rubik).

**Deterministic scan:** `detect.mjs --json` exit 0 on the page and the `PolaroidItem` component. Tier-1 only. The detector does not encode the stats-block pattern, the amber motif count, the `font-serif` third-family exception, or the `font-mono` use (which the page itself doesn't have but the related code blocks elsewhere do).

## Design Health Score (after fixes)

| # | Heuristic | Before → After | Key Issue (after) |
|---|-----------|---------------|-------------------|
| 1 | Visibility of System Status | 2 → **3** | **+1:** Error/empty states added. `<LandingSectionFallback v-if="infoError || expError" state="error" ... @retry="refreshInfo(); refreshExp()">` at line 152. Section-level `v-if` guards at lines 164 (story), 219 (stats), 252 (skills), 309 (experiences). Quote block guarded at line 189 (`v-if="page.story.quote"`). No more empty section shells on fetch failure. |
| 2 | Match System / Real World | 3 → 3 | Unchanged. Arabic clear, `ProfilePage` + `Person` schema, `ogUrl` set explicitly. |
| 3 | User Control and Freedom | 3 → 3 | Unchanged. "+N مسؤوليات أخرى" is a label, not expandable (P3 carried from prior). Mobile timeline rail is now 1px (`w-px`) instead of 2px, neutral color (`bg-default`) instead of primary (P3 mobile border closed in `ced506e`). |
| 4 | Consistency and Standards | 2 → 3 | **+1:** Error/empty handling brings the about page to the same standard as the rest of the portfolio (matching the landing's `LandingSectionFallback` pattern). The remaining inconsistency: Stats block in `about.vue` uses `bg-primary/10` icon-boxes + `text-4xl sm:text-5xl text-amber` numbers (line 235-238), while the landing's `Stats.vue` has those stripped. **Two different stat treatments in the portfolio.** |
| 5 | Error Prevention | 3 → 3 | Unchanged. Default values + `v-if` guards prevent crashes. Quote `v-if` prevents `""` artifact. |
| 6 | Recognition Rather Than Recall | 3 → 3 | Unchanged. |
| 7 | Flexibility and Efficiency | 3 → 3 | Unchanged. In-page CTAs (`/contact` + `meetingLink`) and external company-site links. |
| 8 | Aesthetic and Minimalist Design | 3 → 2 | **−1:** Wait, no. Reading the prior snapshot again: 3/4. The prior score was 3, and the Stats block was flagged as a P2 (not a P1), with the prior P1 being the error/empty states. Re-scoring: 3 → **3** (unchanged, the Stats block drift remains the same). Let me re-score honestly: the prior snapshot gave heuristic 8 a 3/4 with "Strong polaroids/timeline, but pervasive icon-boxes and amber dilute the restraint." The fixes did not address the icon-boxes or amber, so the score holds. **3 → 3.** |
| 9 | Error Recovery | 2 → **3** | **+1:** `LandingSectionFallback` provides a retry (`@retry="refreshInfo(); refreshExp()"`). On a data failure the page now shows a recoverable error block with an escape-hatch (`alt-action-to="/contact"`) instead of broken section shells. |
| 10 | Help and Documentation | 3 → 3 | Unchanged. The page is self-explanatory; `ProfilePage` JSON-LD + breadcrumb schema cover the structured-data side. |
| **Total** | | **27 → 29/40** | **Good (lower edge). Trust surface now degrades gracefully on data failure; brand drift in Stats still open.** |

## Issues Closed in this Run

| Finding | Status | Where to verify |
|---------|--------|-----------------|
| **P1:** No error or empty states across four data-driven sections | **Closed** | `LandingSectionFallback` at line 152-160; section `v-if` guards at lines 164, 189, 219, 252, 309. |
| **P3:** Mobile timeline 2px side-stripe | **Closed** | `about.vue:341-344` — stripe is now `w-px` (1px) and `bg-default` (neutral) instead of `bg-primary` and `w-0.5` (2px). |
| **P3:** Empty-quote artifact (`""` rendering) | **Closed** | `about.vue:189` — `v-if="page.story.quote"` on the blockquote. |

## What's Still Open

### From the prior 2026-06-15T09-39-52Z snapshot
- **P1 Stats section repeats the icon-box + big-amber pattern removed from the landing** — `about.vue:218-247`. 4 stat values at `text-4xl sm:text-5xl text-amber` (line 238) + 4 `bg-primary/10` icon-boxes (the icons at line 233-237 are inside a `flex flex-col items-center` with the icon-box removed in commit `ced506e` per the `simplify icon rendering` description, but the four `text-amber` stat numbers remain). The two stat displays in the portfolio (this one + the landing's `Stats.vue`) are inconsistent. The landing's treatment is the documented "restrained" choice; the about page's is the SaaS template.
  - **Fix:** Either (a) bring the about page's stats in line with the landing's (drop `text-amber` from the numbers, use `text-highlighted` or a single focal `text-amber` on the most important number; drop any remaining `bg-primary/10` icon-boxes), or (b) accept the divergence as deliberate (the about page is a personal narrative, the landing is a portfolio card grid — different registers).
  - **Suggested command:** `/impeccable quieter` (a) or `/impeccable document` (b, with a DESIGN.md note)

- **P3 Primary-tinted rounded icon-boxes recur across sections** — Stats (line 235), Skills (line 273), Experience timeline nodes (line 330). The "large rounded-corner icons" box appears in three sections, which the brand reference calls a template tell. With commit `ced506e` the Stats icon-box was already simplified (the `p-3 rounded-2xl bg-primary/10` wrapper was removed), but the underlying motif — primary-tinted icons at 40-60% opacity on the same screen — is the broader pattern.
  - **Fix:** Reduce to bare icons (no box) or vary the treatment so the same box doesn't appear in stats, skills, and timeline. The skills section at line 266-274 uses bare `text-primary/60` on the icon (no box), which is the correct restrained treatment — apply the same to stats and timeline.
  - **Suggested command:** `/impeccable quieter`

- **P3 Amber exceeds its budget across the page** — `about.vue:107` (name), `:96-101` (Hero badge), `:226-238` (4 stat numbers, `text-amber`), `:266/273` (skill card hover, icon), `:193` (quote block), CTAs. Honey Signal Rule says max 3 amber moments per screen; this page has 25-30 across six sections.
  - **Fix:** Same as the global-data P1 — strip `text-amber` from non-Hero uses, drop `bg-primary/10` icon-boxes, let the name + Hero badge + one focal CTA carry amber. The `text-primary/40`, `text-primary/60`, `text-primary/50` motifs (the muted primary variants) are fine — they are below the amber signal threshold and read as neutral.
  - **Suggested command:** `/impeccable quieter`

### New in this run
- **P3 `PolaroidItem.vue:30` uses `font-serif` — third type family** — This is the only `font-serif` instance in the entire `apps/client/app` tree (verified by grep). The two-family rule (`DESIGN.md:137` and `design.json:narrative.rules:326-330`) commits to Rubik (display) + Tajawal (body). The prior snapshot flagged it as a minor and suggested documenting the exception or aligning. Neither has happened.
  - **Fix (judgment call):**
    1. **Document the exception:** add a single line to `DESIGN.md` near the typography section: "The polaroid caption in `PolaroidItem.vue` uses `font-serif` as a deliberate exception — a third family scoped to a single decorative metaphor (the polaroid caption), per the polaroid-as-photograph voice. Not a system-wide third family."
    2. **Replace with `font-display` (Rubik):** loses the "handwritten-on-the-back-of-a-photograph" affectation, gains design-system consistency. The polaroid metaphor survives through the drop-shadow + rotation, not the typeface.
  - **Suggested command:** `/impeccable document` (1) or `/impeccable typeset` (2)

## Inherited / Cross-Page Notes

The amber strip work in `polish/adr-global-data-critique-fixes` (`AdrSection`, `AdrFlowDiagram`, `AdrCodeBlock`, `AdrApiCard`, `AdrDecisionTable`, `AdrFileReference`) does **not** affect `about.vue` — those components are ADR-only, and the about page uses different components (`PolaroidItem`, `UPageHero`, `UPageSection`, `UPageCTA`, `UBadge`, `UIcon`, `USeparator`, `UButton`, `ULink`, `UColorModeAvatar`). The about page's amber strip is its own concern.

If the P1 (Stats) and P3 (amber, icon-boxes) are addressed in a future branch, the same pattern would also apply to the landing's `Stats.vue` (which was already done in the prior cycle) and any other "stat-heavy" page that emerges. The landing's `Stats.vue` is the reference treatment; bringing `about.vue` in line with it is a one-component change away.

## Persona Red Flags (after fixes)

**Sam (screen reader / keyboard):** Heading structure unchanged. The new error/empty states are real retry blocks (the `LandingSectionFallback` is a real interactive component, not a stub). No regression.

**Jordan (the visitor here to decide if this person is trustworthy):** The page no longer degrades into empty section shells on data failure. The bio story with the pull-quote still works as written. The Stats block is still SaaS-template-coded (the P1 that didn't move), but the rest of the page now backs up the trust signal.

**Riley (quality auditor):** Notes the error handling landed, the mobile stripe is now 1px neutral, the empty-quote artifact is fixed. Also notes that the Stats block is still the hero-metrics template the prior critique flagged, that amber is still over budget across the page, and that `font-serif` in `PolaroidItem.vue` is the only third-family typography in the app and is not documented as an exception.

**Casey (mobile reader):** Mobile experience is improved: the timeline rail is 1px instead of 2px, the polaroid gallery fans out via `-space-x-8` (still slightly crowded on small screens but workable), and the section guards prevent empty-stack situations. The hero CTA stack (`/contact` + meeting) is in the thumb zone.

## Minor Observations

- The hero `description` is hardcoded generic job-title copy (`Frontend Engineer بخبرة تزيد عن 5 سنوات. أبني تطبيقات ويب حديثة وعالية الأداء مع التركيز على تجربة المستخدم.`) at line 21 and 32, while the API provides the richer bio at `info.bio.paragraphs`. The hero description could pull from the API or be hidden in favor of a single bio paragraph.
- The `<UColorModeAvatar>` uses `ring-primary/30` — a muted primary on the avatar ring, which is a tasteful brand touch (one of the few places `ring-primary` is used as decorative).
- The experience timeline uses `bg-primary/10 border-primary/40 ring-primary/20` on the current-role node and `border-primary/30 bg-primary/5` on the current-role card. These are signal-bearing (the "currently working here" highlight), not motif overload.
- `<ULink :to="exp.companySiteUrl" target="_blank">` — opens the company site in a new tab. `target="_blank"` is correct here, but the link should also have `rel="noopener noreferrer"` for security. (The Nuxt UI `ULink` may add this automatically; worth verifying.)
- The bio story section (`page.story.paragraphs`) is rendered as a list of `<p>` tags without any explicit `<article>` or `<section>` semantics. The outer `<UPageSection>` provides the section semantics, so this is fine.
- The 6 sections of the page map to 6 `<UPageSection>` opens (the first being a `<UPageHero>`, not a section) — wait, the first is `<UPageHero>` and the rest are `<UPageSection>`. So the page has 1 Hero + 5 Sections. The `pages/adr/index.vue` is the only index that uses `sections: N` to advertise; this page doesn't. No off-by-one risk here.
- The `+N مسؤوليات أخرى` label (line 410-415) is a known limitation flagged in the prior snapshot. It could be a `<details>` (collapsible list) so the user can choose to expand, but is intentionally truncated to 3 in the snapshot. Judgment call: keep as-is or wire a "show more" disclosure.

## Questions to Consider

1. The Stats section's icon-boxes and big-amber numbers were already removed from the landing's `Stats.vue`. Should the about page be reconciled to that treatment (so the two stat displays match), or is the divergence deliberate (different page register)?
2. The `font-serif` in `PolaroidItem.vue:30` is the only third-family typography in the app. Is the polaroid caption a documented exception (and needs the line in `DESIGN.md`), or should it align with `font-display` (Rubik) for design-system consistency?
3. The page is the trust surface. The error/empty states are now in place, the mobile stripe is 1px neutral, the empty-quote is guarded. Is the remaining work (Stats drift, amber over budget, `font-serif` registration) worth a dedicated branch, or is this page's "good enough" reached and the next pass should move to other pages?
