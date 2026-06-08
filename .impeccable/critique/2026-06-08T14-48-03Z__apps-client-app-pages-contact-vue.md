---
target: apps/client/app/pages/contact.vue
total_score: 28
p0_count: 0
p1_count: 0
timestamp: 2026-06-08T14-48-03Z
slug: apps-client-app-pages-contact-vue
---
# Critique — apps/client/app/pages/contact.vue

**Score: 28/40 (Good, lower edge)** | P0: 0 | P1: 0 | Target: apps/client/app/pages/contact.vue

## Anti-Patterns Verdict

**LLM assessment:** Mostly clean, but it drifts from the project's own DESIGN.md in three documented ways: repeated tiny `uppercase tracking-widest` eyebrows (a banned kicker pattern), decorative `backdrop-blur-sm` glassmorphism on the form card and pills (banned), and a resting `shadow-lg` on the form card (the system is flat-by-default). The form mechanics themselves are strong and not slop; the styling slipped back toward generic SaaS-contact conventions.

**Deterministic scan:** `detect.mjs` exit 0, 0 findings. Vue SFC skips Tier 2 page-level checks; the tracking/glass/eyebrow issues are project-rule violations the generic detector does not encode.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Loading + success states are clear; submit failure relies on a toast (no inline message) |
| 2 | Match System / Real World | 3/4 | Arabic fluent, but `tracking-widest` on Arabic eyebrows breaks letter-joining (see P2) |
| 3 | User Control and Freedom | 3/4 | Success state offers "send another" + "home"; fields editable; no explicit clear-all |
| 4 | Consistency and Standards | 2/4 | Violates several of the project's own DESIGN.md rules (eyebrows, glassmorphism, flat-by-default, amber budget) |
| 5 | Error Prevention | 3/4 | Solid Zod validation, Arabic messages, phone regex, `inputmode`/`autocomplete` |
| 6 | Recognition Rather Than Recall | 3/4 | Clear labels/placeholders/icons; copy button is hover-only (hidden on touch) |
| 7 | Flexibility and Efficiency | 3/4 | Multiple contact methods, copy email, meeting link, autocomplete |
| 8 | Aesthetic and Minimalist Design | 2/4 | Full-width desktop form, glassmorphism, resting shadow, amber overuse |
| 9 | Error Recovery | 3/4 | Inline field errors + toast on submit failure; success panel is polished |
| 10 | Help and Documentation | 3/4 | Helpful `hint` on the description field, guiding placeholders, contact alternatives |
| **Total** | | **28/40** | **Good (lower edge) — strong form, brand-discipline cleanup needed** |

## Overall Impression

The form is genuinely well-built: Zod validation with clear Arabic messages, an RTL-aware phone input, loading and success states, and a polished confirmation panel. The gap is brand discipline. This page reaches back for generic SaaS-contact styling (tracked uppercase eyebrows, glassmorphism, a resting shadow, heavy amber) that the project's DESIGN.md explicitly rules out, and on an Arabic-first brand the `tracking-widest` on Arabic labels is not just off-brand, it visibly breaks the script.

## What's Working

1. **Form mechanics are excellent.** Zod schema with specific Arabic error messages, `required` fields, phone regex, optional email, plus `type="tel"`, `inputmode="tel"`, `autocomplete="tel"`, and `dir="ltr"` on the phone field. This is careful, RTL-aware form engineering.
2. **The success state is polished and accessible.** `role="alert"`, a clear confirmation, and two sensible next actions ("إرسال رسالة أخرى" / "العودة للرئيسية"), with a smooth `out-in` transition from the form.
3. **Submit feedback is wired end to end.** `useApiRequest` shows a success toast on `2xx` and an error toast via `handleError` on failure, and inputs are disabled during `loading`.

## Priority Issues

### [P2] `tracking-widest` on Arabic eyebrows breaks letter-joining
- **File:** contact.vue:156 ("راسلني"), :317 ("تواصل مباشرة"), :404 ("تابعني على") — all `text-xs font-semibold uppercase tracking-widest`
- Arabic is a connected (cursive) script. `letter-spacing` (`tracking-widest`) inserts gaps between glyphs that should join, so "راسلني" renders visibly disconnected, which reads as broken to an Arabic reader. `uppercase` is a no-op on Arabic, a tell that the class was carried over from an LTR template. On top of the rendering bug, three repeated tiny tracked kickers are exactly the eyebrow anti-pattern the project's DESIGN.md and the brand reference ban.
- **Fix:** Remove `uppercase tracking-widest` from Arabic labels. Then decide whether the three eyebrows should exist at all; if kept, style them as plain small labels without tracking.
- **Suggested command:** `/impeccable typeset`

### [P2] Desktop body is a single full-width column, not the intended two columns
- **File:** contact.vue:145-149 — comment says "Two-Column Body" but the container is `flex flex-col` with no `lg:` row variant
- The form and the info panel stack full-width inside the 6xl container, so on desktop the inputs stretch to roughly 1100px. Form fields that wide are hard to scan and look unbalanced; the gap between label and the end of the field is too long.
- **Fix:** Make the body two columns on `lg` (form beside the info panel, e.g. a 3/2 split) or cap the form's max width. The comment shows this was the original intent.
- **Suggested command:** `/impeccable layout`

### [P3] Glassmorphism and a resting shadow contradict flat-by-default
- **File:** contact.vue:154 (`bg-muted/40 backdrop-blur-sm ... shadow-lg`), :132 (pills `backdrop-blur-sm`)
- DESIGN.md bans decorative glassmorphism and reserves shadows for state or metaphor. The form card carries both a decorative blur and a resting `shadow-lg`.
- **Fix:** Drop `backdrop-blur-sm`; remove the resting shadow (keep the submit button's hover shadow, which signals interactivity).
- **Suggested command:** `/impeccable quieter`

### [P3] Amber budget exceeded (Honey Signal Rule)
- **File:** contact.vue:89 (amber bold description), :156/:317 (amber eyebrows), pill icons, two amber buttons
- The Honey Signal Rule caps amber at roughly three brand moments per screen. Here amber carries a full description sentence, multiple eyebrows, icons, and buttons.
- **Fix:** Reduce amber to the focal moments (one heading accent + the primary action); let the rest be neutral.
- **Suggested command:** `/impeccable quieter`

### [P3] Copy-email button is hover-only, so it is hidden on touch
- **File:** contact.vue:354 — `opacity-0 group-hover:opacity-100 focus:opacity-100`
- On a touch device there is no hover, so the copy affordance never appears (focus helps keyboard users only). The email text is still visible, so it is survivable, but the feature is effectively desktop-only.
- **Fix:** Show the button at reduced prominence by default, or always-on for `pointer: coarse`.
- **Suggested command:** `/impeccable adapt`

## Persona Red Flags

**Jordan (first-timer filling the form):** Labels, placeholders, and the required markers are clear; validation messages are specific and in Arabic. On a failed submit they get an error toast rather than an inline message, which is easy to miss if they have scrolled.

**Sam (screen reader / keyboard):** Good bones: `UFormField` labels, `role="alert"` on success, and an `aria-label` on the copy button. But the copy button is visually hidden until hover/focus, and the tracked Arabic eyebrows, while announced fine, render visually broken for low-vision users reading the screen.

**Riley (quality auditor):** Immediately spots the project's own rules being broken: `tracking-widest` on Arabic, glassmorphism plus a resting shadow against the documented flat-by-default system, a full-width desktop form under a "Two-Column Body" comment, and amber well past its three-moment budget. Reads as drift from the disciplined DESIGN.md.

## Minor Observations

- The "Two-Column Body" comment no longer matches the single-column implementation.
- On success the user gets both a success toast and the inline success panel: mild redundancy.
- `onSubmit` calls `post` which re-throws on failure, so a failed submit throws out of the handler after the toast fires; wrapping it in try/catch would be tidier.
- The ld+json here uses `children` while other pages use `innerHTML`/function form: harmless inconsistency.

## Questions to Consider

1. Three Arabic labels are set in `uppercase tracking-widest`, which silently breaks Arabic letter-joining and repeats a kicker pattern the brand bans. Should those eyebrows exist at all, or should the brand voice be carried without them?
2. The body is one full-width column on desktop despite a "Two-Column Body" comment, stretching inputs to ~1100px. Would a real two-column split (form + info) or a capped form width read more intentional?
3. The form card uses glassmorphism and a resting shadow, both of which this project's DESIGN.md bans. Was that a deliberate exception, or drift worth correcting now that the system is documented?
