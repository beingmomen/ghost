---
target: about.vue
total_score: 30
p0_count: 0
p1_count: 2
p2_count: 1
timestamp: 2026-06-23T11-31-52Z
slug: apps-client-app-pages-about-vue
---
# Critique: apps/client/app/pages/about.vue

## Context
User invoked `/impeccable critique about.vue` with two targeted questions:
1. Are the images on this page necessary?
2. Is it correct that the "story" (bio) section is written in English?

Detector scan (`detect.mjs --json`): clean, `[]` findings.

## Question 1: Are the images necessary?

Two distinct image surfaces:

### Hero avatar (UColorModeAvatar, lines 85-90) — NECESSARY
- Portfolio for a person; the photo is the personal connection.
- Serves PRODUCT.md north star "اعرف مين هو في 3 ثواني".
- DESIGN.md confirms it as signature: "Amber Avatar Glow: The hero photo. Used once per page."
- Keep.

### Polaroid gallery in "قصتي" section (lines 192-204) — NECESSARY IF images are real
- Treatment is a documented Signature Component ("Physical-print sensation in CSS. Used exclusively on the About page").
- NOT decoration — it is a physical-print metaphor aligned with "الحضور الهادئ".
- Conditional: only earns its place if images are real (person in work context / events / office). If admin uploaded filler/stock, the section is noise.

Three issues to fix:
- **[P2]** `PolaroidItem` renders `image.alt` as a visible caption (line 30-32). This is not a technical alt — it is on-screen copy. If admin writes a weak alt, the caption reads weak. Admin must know this field is displayed.
- **[P1]** Mobile overlapping: `flex-row ... -space-x-8` (line 192). On 375px, three 96px polaroids stack into an unclear mass. PRODUCT.md: "أغلب الزوار على موبايل". Fix: `flex-col` on mobile, or cap count.
- **[P3]** Desktop size: `size-24 sm:size-32` (96-128px) feels small in a full `lg:col-span-1` column. Polaroid metaphor reads better slightly larger.

## Question 2: Should the story be in English?

**No** — English-only bio breaks consistency.

- Breaks Nielsen #4 (Consistency): rest of page is Arabic (title "نبذة عني", description, skills, experiences).
- Breaks Nielsen #2 (Match System / Real World): PRODUCT.md mandates "عربي فصحى مبسّطة"; primary audience is Arabic-speaking.
- SEO meta is all Arabic (lines 33-46); English story mismatches the SEO promise.
- Only acceptable variant: bilingual — Arabic first (primary), English as a secondary block. English-only in an Arabic page = wrong.

Note: Hero badge "Abdelmomen Elshatory - Frontend Engineer" (line 96) in English is fine — names + technical titles stay English. That is a different treatment than long-form story copy.

## Additional minor observations
- **[P3]** Skills card (line 224): `hover:border-default` is a dead class (same value as resting state). Remove or change to `hover:border-primary/40`.
- **[P3]** Experience card (lines 300-305): conditional class resolves to identical `border-default bg-elevated/40` on both branches — no visual effect. Dead conditional.
- Blockquote (line 182-189) uses full border, not a side-stripe — correct, not banned.

## Heuristic snapshot (focused)
- H2 Match Real World: 2 (English story in Arabic page)
- H4 Consistency: 2 (language mismatch, dead conditionals)
- H8 Minimalist: 3 (polaroid section risks clutter on mobile if images are weak)
- Other heuristics: solid, no findings.

Total estimated: ~30/40 (Good band, with two P1-P2 fixes to land before ship).
