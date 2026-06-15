---
target: apps/client/app/pages/sdlc.vue
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T13-07-27Z
slug: apps-client-app-pages-sdlc-vue
---
# Critique — apps/client/app/pages/sdlc.vue

**Score: 30/40 (Good)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/sdlc.vue (+ components/sdlc/*)

## Anti-Patterns Verdict

**LLM assessment:** Not slop, and notably better aligned to the brand than its reputation suggests. The expected red flag here was glassmorphism/aurora (CLAUDE.md still warns about it), but it is gone: every SDLC component uses the standard brand tokens (`bg-elevated/30`, `border-default/60`, `text-primary`) and the state colors come from static class maps (`SdlcDecisions` `nodeStyles`, `border-warning/30 bg-warning/5`), which is the correct, purge-safe pattern. This is a clean, content-dense English framework page with real interactivity (role modals, anchor nav).

**Deterministic scan:** `detect.mjs` exit 0 across the page and all six components. A grep for `aurora` / `backdrop-blur` / dynamic `bg-${...}` / `phase.color` returned nothing, confirming the glassmorphism note in CLAUDE.md is stale.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Static page; role modal gives on-demand detail |
| 2 | Match System / Real World | 3/4 | English technical content, clear SDLC framing (Arabic mirror at /sdlc-ar) |
| 3 | User Control and Freedom | 3/4 | Anchor navigation + a dismissible role modal |
| 4 | Consistency and Standards | 3/4 | Brand-aligned tokens, static color maps; the role items are clickable `<li>`s |
| 5 | Error Prevention | 3/4 | Static content, nothing to fail |
| 6 | Recognition Rather Than Recall | 3/4 | Phase nav + sectioned layers make the framework scannable |
| 7 | Flexibility and Efficiency | 3/4 | Jump links + role detail on demand |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean and on-brand; the `bg-primary/10` icon-box recurs a lot |
| 9 | Error Recovery | 3/4 | n/a (static); modal closes cleanly |
| 10 | Help and Documentation | 3/4 | The page is itself documentation, with `TechArticle` schema |
| **Total** | | **30/40** | **Good — clean, brand-aligned; fix the keyboard a11y of the role list** |

## What's Working

1. **It is on-brand, not a separate glassmorphic world.** The components use the same tokens as the rest of the site and pull state colors from static maps, so it reads as part of the system and survives Tailwind's purge. The old glassmorphism/aurora is gone.
2. **The content is strong authority material.** Six phases, each with a what/breakdown/checkpoints three-layer card plus roles, key question, next-phase trigger, and risk-if-skipped; the decision-flow recovery logic; the OOA&D workflow. This is exactly the senior-architect thinking the audience wants, and there is a full Arabic mirror at /sdlc-ar.
3. **SEO and structure are solid.** `TechArticle` JSON-LD, breadcrumb, anchor IDs per phase, and a role modal that keeps the at-a-glance grid uncluttered while offering depth on demand.

## Priority Issues

### [P2] The role list opens modals from clickable `<li>`s (no keyboard access)
- **File:** SdlcTimeline.vue:77-84 — `<li ... class="cursor-pointer" @click="openModal(role, phase)">`
- Each role is a list item with a click handler but no `tabindex`, `role`, or key handler, so it is invisible to keyboard and screen-reader users: they cannot focus it, cannot open the modal, and the item is not announced as actionable. The role detail is effectively mouse-only.
- **Fix:** Make each role a `<button>` (or `<UButton variant="ghost">`) so it is focusable and operable by Enter/Space and announced as a control.
- **Suggested command:** `/impeccable harden`

### [P3] Dead `color` data on every phase
- **File:** sdlc.vue:67,105,143,181,219,257 — each phase carries `color: 'cyan' | 'violet' | 'emerald' | 'amber' | 'orange' | 'pink'`
- No component reads `phase.color` (the components use `text-primary` throughout), so these six fields are unused data. Either wire them into a per-phase accent (via a static class map, as `SdlcDecisions` already does) or remove them.
- **Fix:** Remove the dead `color` fields, or use them through a static color map if per-phase color-coding is wanted.
- **Suggested command:** `/impeccable polish`

### [P3] The primary-tinted icon-box recurs across every layer card
- **File:** SdlcPhaseSection.vue:32,57,90 — `size-8 rounded-xl bg-primary/10` repeated three times per phase (eighteen on the page)
- Same icon-box motif being reduced elsewhere. Defensible in a dense framework, but a bare icon would lighten it.
- **Suggested command:** `/impeccable quieter`

## Persona Red Flags

**Sam (screen reader / keyboard):** Hits a wall at the roles grid, the role items look interactive (they change color on hover and open a modal) but cannot be reached or activated without a mouse, so an entire layer of content is inaccessible.

**Jordan (peer judging depth):** Reads a genuinely strong SDLC framework, phases, roles, decision recovery, workflow, and comes away convinced; the content does its job for a mouse user.

**Riley (quality auditor):** Notes the clickable `<li>`s, the dead `color` fields, and that CLAUDE.md still documents a glassmorphism/aurora treatment that no longer exists in the components.

## Minor Observations

- Em dashes appear throughout the English content (titles, separators, list items, descriptions). The project's copy guidance avoids them; in English technical prose they are conventional, so this is a judgment call, but it is inconsistent with the Arabic copy rule applied elsewhere.
- CLAUDE.md still lists "SDLC glassmorphism and aurora animation styles"; the code no longer has them, so the doc is stale and worth updating.
- The page is static inline data (good, no fetch to fail); as with the ADRs, a growing framework might prefer a data module.

## Questions to Consider

1. The role list is mouse-only. Should those items be buttons so keyboard and screen-reader users can open the same role detail?
2. Every phase declares a distinct `color` that nothing uses. Is per-phase color-coding a feature you want (wired through a static map), or should the dead fields go?
3. CLAUDE.md still warns about SDLC glassmorphism/aurora that the components no longer contain. Should the doc be corrected so future work does not chase a constraint that is already resolved?
