# Handoff — Beingmomen `apps/client` UI critique & polish

**For:** a fresh agent continuing in **OpenCode**, at the same rigor/scale as the Claude Code `/impeccable` skill.
**Repo:** `f:\Code\personal\Clients\Beingmomen` (pnpm monorepo). Work has been exclusively in **`apps/client`** (Nuxt 4 + Nuxt UI 4, Arabic-first RTL portfolio).
**Date of handoff:** 2026-06-15.

---

## 1. Mission for the next session

Continue the page-by-page **critique → fix** loop on `apps/client`, matching the depth that has been applied so far. Every primary page has already had one critique pass; what remains is a **deferred-P3 backlog** (§6) and optional re-critiques to verify score improvements. OpenCode does not have the `/impeccable` skill, so the **methodology must be followed manually** — it is fully documented in-repo (§3).

---

## 2. Two rules that override everything

1. **Git workflow (non-negotiable).** Every change goes on its **own branch** (`fix/…`, `feat/…`, `harden/…`, `polish/…`, `docs/…`, `style/…`). **Do NOT commit and do NOT `git add`.** Make the edits, leave them **unstaged**, report the changed files + a summary, and **stop**. The user reviews the diff visually and does the commit/merge/branch-delete themselves. Only commit/merge if the user **explicitly** says so (they sometimes do — e.g. "اعمل كوميت وميرج"). Watch for the mistake of editing on `main` by accident — if it happens, `git checkout -b <branch>` carries the uncommitted changes onto a branch and leaves `main` clean.
2. **Don't reflex-strip things the user values.** Decorative/atmospheric layers, brand choices, and "looks like a minor issue" elements are often intentional. When a change is a judgment/voice call (copy, removing visual layers, CTA strategy), **propose and ask** rather than imposing; the user reviews before commit. Past lesson: a confident "remove the Hero dot-grid" recommendation was wrong and reverted.

The user works in **Arabic**; reply in Arabic (technical terms in English). Plan-mode/doc outputs that are user-facing should be Arabic.

---

## 3. The methodology to replicate (so OpenCode matches scale)

The full method lives in-repo — **read these before starting**:
- `apps/client/.claude/skills/impeccable/SKILL.md` (or repo-root `.claude/skills/impeccable/`) — the skill overview + absolute bans + the "AI slop" tests.
- `.claude/skills/impeccable/reference/critique.md` — the critique flow: Nielsen 10-heuristic scoring (0–4 each, **/40**), anti-pattern verdict, **P0–P3** priority issues, persona red flags (Jordan/Casey/Riley/Sam), cognitive-load checklist.
- `.claude/skills/impeccable/reference/brand.md` — this is a **brand** register (design IS the product); read it for the slop/aesthetic lane tests.
- `.claude/skills/impeccable/scripts/detect.mjs` — a local deterministic anti-pattern scanner. Run `node …/detect.mjs --json <files>`; **note:** it exits 0 on `.vue` SFCs (it only does Tier-1 checks on them), so a clean exit ≠ fully clean.

**Per-page loop that has been applied (replicate it):**
1. Resolve the target file; read the page + its components (the real UI usually lives in child components, not the thin page).
2. Assessment A (design review, the heuristic table + issues) and Assessment B (run `detect.mjs`). Do them yourself — **do not spawn sub-agents** (heavy on this plan; you already hold the context).
3. **Verify claims before asserting** (read the actual component / Nuxt UI prop / Tailwind behaviour). Several findings this cycle were corrected after checking (e.g. UPageCard uses a stretched link; `color="gray"` invalid in Nuxt UI 4; CLS already handled by a fixed height).
4. Present the full structured report **in Arabic**, then ask the user (single `AskUserQuestion`) which items to fix.
5. Fix on a branch per rule §2.1; re-verify with a diff; stop for the user to commit.

**Critique snapshots** (heuristic tables + full findings, do not re-derive — read them) are archived at `apps/client/.impeccable/critique/*.md`, one per page, named `<ISO-timestamp>__<slug>.md`. The Claude Code helper was `critique-storage.mjs write|trend <slug>`; if OpenCode can't run it, just write a markdown snapshot into that folder manually to keep the archive going.

---

## 4. What's already done (all critiqued once; all fixes merged to `main`)

Scores are out of 40. Full reports in the snapshot files (§3).

| Page | Score | Notable fixes already shipped |
|------|-------|-------------------------------|
| `index.vue` (landing) | 31→24→**30** | P0 client-email leak removed; Hero CTA; Stats de-iconboxed + copy; Testimonials 6s; About copy rewrite |
| `projects.vue` | 25 | empty/error fallback; nested-link → stretched card; LCP eager; CTA → /contact |
| `contact.vue` | 28 | **Arabic `tracking-widest` removed** (breaks letter-joining); 2-col layout; de-glassmorphism; amber budget; email overflow `break-all` |
| `blog/index.vue` | 29 | error≠empty state; dead skeleton removed; Blog/ItemList JSON-LD |
| `testimonial.vue` | 29 | latent email ref removed; carousel 6s+pause; amber; trust-badges removed; **extracted shared `components/TestimonialCarousel.vue`** |
| `about.vue` | 27 | error/empty states (4 sections) + retry; Stats unified w/ landing; skills icon-box → bare; 2px side-stripe → 1px |
| `blog/[slug].vue` | 29 | soft-404 → real 404 (`setResponseStatus`); TOC `|| []` guard; `color="gray"`→`neutral`; LCP; avatar from config |
| `learning-roadmap.vue` | 29 | stats hero hidden when empty + error/retry |
| `adr/index.vue` | 29 | nested `<button>`-in-`<a>` → `UBadge`/spans |
| `adr/multi-mode-system.vue` (detail) | 30 | static color map for `AdrFlowDiagram`; **TechArticle JSON-LD** on both detail pages; redundant `dir` cleanup |
| `sdlc.vue` | 30 | role list `<li @click>` → `<button>` (keyboard a11y), same fix in `sdlc-ar` mirror |

Docs were also refreshed (last branch `docs/refresh-client-conventions`, merged): stale `.text-gradient` + "SDLC glassmorphism/aurora" removed from `apps/client/CLAUDE.md`; a "no dynamic Tailwind classes" Don't added to root `DESIGN.md`.

`main` is currently **clean, ahead of origin by 11 commits** (user pushes on their own cadence).

---

## 5. Conventions established (now documented — honour them, don't regress)

These are written into `apps/client/CLAUDE.md` and root `DESIGN.md`; read both. Highlights:
- **SSR + block-navigation is intentional.** `useFetch`/`useAPI` are `lazy:false`; do **not** add skeletons / `lazy:true` / loading states to landing-type pages. A critique flagging "no loading state / sections silently absent" is a **false positive** here. (Loading-strategy note in `apps/client/CLAUDE.md`.)
- **Error/empty = `LandingSectionFallback`** (retry + escape-hatch); the empty path may render nothing by design.
- **Never construct Tailwind classes dynamically** (`` `bg-${color}` ``) — purged in prod. Use a static class map (`AdrFlowDiagram` `COLOR_CLASSES`, `SdlcDecisions` `nodeStyles`).
- **Arabic text never gets `letter-spacing`/`tracking-*`** (breaks cursive joining) and `uppercase` is a no-op on it. `uppercase tracking-*` is fine only on the **English** `sdlc/` page.
- **Footer (`AppFooter.vue`) already has a global CTA on every page** — don't add a second closing CTA to individual pages.
- **Hero atmosphere (mesh + dot-grid + grain + glow) is a deliberate, documented system** in `DESIGN.md` — don't strip it.
- Brand: amber (`#fbbf24`, text-use `#d97706`) max ~3 moments/screen; Tajawal body 1.125rem / line-height 1.8 (hard minimum); Rubik display; flat-by-default (shadows only for state/metaphor); bans: gradient text, side-stripe borders, glassmorphism, hero-metric template, per-section eyebrows.

---

## 6. Remaining backlog (deferred P3s — the next work)

- **Mobile TOC + share**: `blog/[slug].vue` and `adr/[detail]` hide the TOC (and blog share) on mobile (`hidden lg:block`). Surface a collapsed mobile TOC / inline share.
- **Syntax highlighting**: `AdrCodeBlock` and SDLC code render plain `<pre>{{code}}</pre>` — optional Shiki.
- **`learning-roadmap`**: collapsible phase toggle lacks `aria-expanded`/`aria-controls` (`RoadmapPhaseSection.vue`); one em-dash separator.
- **`sdlc.vue`**: dead `color` fields on each phase (unused); recurring `bg-primary/10` icon-boxes; pervasive English em-dashes (judgment call).
- **`testimonial.vue`**: `Review`/`AggregateRating` schema needs a **rating field added to the backend testimonial model** first (out of pure-frontend scope).
- **`adr`/`about`/`sdlc`**: recurring large icon-boxes could be lightened (low priority; kept where they aid dense content).
- Not yet critiqued: `sdlc-ar.vue` (Arabic mirror — likely parallels `sdlc.vue`), and the second ADR detail `adr/global-data.vue` (got the schema fix but no full critique). Other apps untouched: **`apps/db`** (Nuxt dashboard), **`apps/server`** (Express API).

---

## 7. Suggested skills / tools for the next agent

- **Primary:** there is no drop-in `/impeccable` in OpenCode — **read `.claude/skills/impeccable/reference/critique.md` + `brand.md` in this repo and follow them manually.** They are the source of the scale you're matching.
- If OpenCode exposes a **UI/UX design-review or frontend skill**, use it as the engine but feed it the project's `DESIGN.md` + `apps/client/CLAUDE.md` so it respects the brand.
- For verifying visual/interaction claims, a **browser/devtools** capability is valuable (this cycle relied on reasoning + Nuxt UI docs because the dev stack needs `apps/server` + MongoDB running; spinning the full stack is heavy).
- Use the repo's bundled **`detect.mjs`** for the deterministic pass.
- Keep writing per-page snapshots into `apps/client/.impeccable/critique/` to preserve the archive.

---

## 8. Pointers (don't duplicate — read these)
- Project overview & deploy: repo-root `CLAUDE.md`; `apps/client/CLAUDE.md`.
- Visual system: root `DESIGN.md` + `apps/client/.impeccable/design.json`.
- Per-page critique archives: `apps/client/.impeccable/critique/*.md`.
- Live content (needs `apps/server` running): `curl "$BASE_URL/landing" | jq .data`.

No secrets in this doc. The email that appears in the codebase is the owner's own public contact address (intentionally public), not PII to redact.
