---
name: Elshatory Portfolio
description: Arabic-first Frontend Engineer portfolio — amber identity on warm-stone canvas
colors:
  honey-light: "#fbbf24"
  honey-warm: "#fcd34d"
  honey-deep: "#d97706"
  ink-deep: "#0c0a09"
  ink-medium: "#44403c"
  stone-muted: "#78716c"
  stone-subtle: "#a8a29e"
  surface-base: "#fafaf9"
  surface-elevated: "#f5f5f4"
  surface-dark: "#1c1917"
  surface-dark-elevated: "#292524"
typography:
  display:
    fontFamily: "Rubik, Tajawal, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Rubik, Tajawal, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Tajawal, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Tajawal, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.625
rounded:
  pill: "9999px"
  card: "1rem"
  avatar: "2rem"
  sm: "0.5rem"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "2rem"
  lg: "3rem"
  section: "clamp(5rem, 10vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.honey-light}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.honey-deep}"
    textColor: "{colors.ink-deep}"
  button-neutral-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink-medium}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  nav-pill:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  footer-cta:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.card}"
    padding: "2rem 3rem"
---

# Design System: Elshatory Portfolio

## 1. Overview

**Creative North Star: "الحضور الهادئ" (The Quiet Presence)**

A portfolio that earns trust through execution quality, not declaration. The visual system is confident without being loud — amber warmth set against a warm-stone canvas, generous Arabic line-heights that respect the letterform, minimal decorative noise. Every element serves evidence: evidence of craft, reliability, and five-plus years of deliberate frontend engineering.

Arabic-first is not a localization layer but the design foundation. Line-height begins at 1.8, base font size scales to 1.125rem, and Tajawal shapes every reading experience from the opening glyph. RTL is the grid direction, not a mirror applied on top of an LTR layout.

This system explicitly rejects the SaaS gradient template (hero metrics → icon-grid features → testimonial → CTA), the "passionate developer" portfolio trope (name in gradient, project tiles with hover-glow, animated blobs), and the 2026 cream/warm-neutral AI reflex (off-white body + saturated primary accent + decorative glassmorphism). If the page looks like it came from a template, start over.

**Key Characteristics:**
- Amber as mark, not as mood — appears on three brand moments per page, maximum
- Arabic readability baked into the type scale, not retrofitted
- Staggered motion with purpose — reveal sequences for list items, not a uniform entrance reflex on every section
- Surfaces layered by tone (base / elevated / muted), shadows reserved for state

## 2. Colors: The Honey Light Palette

One warm amber signal against a near-neutral stone ramp. Stone is the canvas; amber is the signature — the thing a visitor notices and carries away.

### Primary

- **Honey Light** (`#fbbf24`, amber-400): The brand accent. The designer's name in the hero, the footer brand headline, active link state. Its rarity is the point — amber means this matters.
- **Honey Warm** (`#fcd34d`, amber-300): Atmospheric only. Hero mesh gradient, avatar glow blur. Never used for text.
- **Honey Deep** (`#d97706`, amber-600): Text-use variant in light mode. Required when amber text sits on light backgrounds to hit 4.5:1 contrast. Dark mode reverts to Honey Light (`#fbbf24`).

### Neutral

- **Ink Deep** (`#0c0a09`, stone-950): Headings, primary text, button text on solid amber. The anchor of the scale.
- **Ink Medium** (`#44403c`, stone-700): Body text at rest.
- **Stone Muted** (`#78716c`, stone-500): Supporting text, descriptions, meta. The `text-muted` semantic role.
- **Stone Subtle** (`#a8a29e`, stone-400): Dimmed text, timestamps, placeholder context. The `text-dimmed` semantic role.
- **Surface Base** (`#fafaf9`, stone-50): Page background (light mode).
- **Surface Elevated** (`#f5f5f4`, stone-100): Elevated surfaces — nav, cards, footer band.
- **Surface Dark** (`#1c1917`, stone-900): Page background (dark mode).
- **Surface Dark Elevated** (`#292524`, stone-800): Elevated surfaces in dark mode.

### Named Rules

**The Honey Signal Rule.** Amber appears on three brand moments maximum per screen: the designer's name, one focal CTA, one availability badge. Amber is a signature, not a fill color. If a fourth amber element appears, remove one.

**The Stone Canvas Rule.** The warm-neutral danger zone (cream, sand, linen, parchment) is avoided. Stone-50 reads as near-white, not warm beige — its character comes from the amber context around it, not from boosted chroma in the background itself.

## 3. Typography

**Display Font:** Rubik (Google Fonts, 600–700 weight), Tajawal as Arabic fallback
**Body Font:** Tajawal (Arabic, self-hosted at `app/assets/css/fonts.css`)

**Character:** Rubik carries confident authority on headings — slightly rounded letterforms that feel deliberate, not borrowed from a template. Tajawal handles all Arabic body text with proper Arabic proportions. The pairing works because Rubik's geometric structure contrasts cleanly with Tajawal's humanist Arabic warmth; they share enough warmth to coexist without competing.

### Hierarchy

- **Display** (700, `clamp(2.25rem, 6vw, 3.75rem)`, line-height 1.15, tracking -0.01em): Hero heading — the designer's name. One instance per page. Use `text-wrap: balance`.
- **Headline** (600, `clamp(1.5rem, 4vw, 2.25rem)`, line-height 1.3): Section titles, footer CTA heading. Font family via `font-display` (Rubik).
- **Title** (600, 1.25rem / 2rem line-height): Sub-section labels, navigation headings in the footer.
- **Body** (400, 1.125rem / 1.8 line-height): All paragraph content. Max line length 65ch. The 1.8 line-height is non-negotiable for Arabic.
- **Label** (500, 1rem / 1.625rem line-height): Navigation items, badge text, meta fields. No all-caps at this scale.

### Named Rules

**The Arabic Baseline Rule.** Body font size is 1.125rem. Line-height is 1.8. These are not adjustable defaults — Arabic letterforms fail readability at Latin-designed baselines. Any new text element must be verified at these minimums before shipping.

**The Two-Family Rule.** Rubik for headings and display; Tajawal for Arabic body. The monospace in ProseMirror code blocks is scoped to blog content rendering and is not a global third family.

## 4. Elevation

This system is flat by default. Surfaces are differentiated by tonal layering (base → elevated → muted), not by stacked shadows. Shadows appear in three specific contexts and nowhere else.

### Shadow Vocabulary

- **Amber Avatar Glow** (`shadow-2xl shadow-primary/20`): The hero photo. The amber tint makes it brand-specific. Used once per page.
- **Nav Surface Lift** (`shadow-sm`): The floating navigation pill. Signals stickiness and separation from page content. Functional, not decorative.
- **Polaroid Drop** (`drop-shadow-2xl`): Photography items in the About page gallery. Reinforces the physical-print metaphor inherent to the polaroid component.

### Named Rules

**The Flat-By-Default Rule.** Surfaces at rest carry no shadow. A new shadow is permitted only if it communicates a specific state (stickiness, hover, interactive priority) or belongs to an existing metaphor (polaroid). Decorative shadows are banned.

## 5. Components

### Buttons

Direct and spacious. Amber primary makes the intent clear without urgency. Dark-ink text on amber is not a design choice but a contrast requirement.

- **Shape:** 0.5rem radius (`rounded-lg`). Not pill-shaped (reserved for nav and badges), not sharp (that reads editorial).
- **Primary:** `#fbbf24` background, `#0c0a09` text, 12px 24px padding. The stone-950 text override is required — Nuxt UI's default white text fails WCAG on amber-400.
- **Hover / Active:** Transitions to Honey Deep (`#d97706`), text remains stone-950. Transition: `color 200ms ease-out, background-color 200ms ease-out`.
- **Neutral Outline:** Transparent background, stone border, stone-700 text. Paired with primary for dual-CTA layouts (تواصل / احجز اجتماع).
- **Availability Badge:** `rounded-full`, soft color variant (success / error). The animated ping dot signals live status — this is not a static chip.

### Navigation

- **Style:** Floating island, `position: fixed`, centered via `left-1/2 -translate-x-1/2`, `rounded-full`, `bg-elevated/95`, `border border-default`, `shadow-sm`.
- **Typography:** Tajawal label (1rem, 500 weight), neutral link color.
- **Trailing:** Dark mode toggle inline at the trailing edge.

### Cards / Containers

- **Footer CTA:** `rounded-2xl`, `border border-default/60`, `bg-muted/40`. A contained invitation — the softness of the background signals approachability, not urgency.
- **Testimonial band:** Full-bleed (`-mx-4 sm:-mx-12 lg:-mx-16`), `bg-elevated/50`, no card border. Content floats in a tonal band without a hard boundary.
- **Elevation pattern:** `bg-elevated/50` for secondary sections, `bg-elevated/95` for sticky UI, `bg-muted/40` for CTA blocks.

### Polaroid Gallery (Signature Component)

White-framed photo cards (`bg-white dark:bg-neutral-800`), uniform 0.5rem padding, `drop-shadow-2xl`, alternating ±5° tilt by index. On hover: straightens to 0°, scales to 1.05, shifts laterally (−4px or +4px by index). Physical-print sensation in CSS. Used exclusively on the About page.

### Inputs / Fields

- **Style:** Nuxt UI UInput, stone-neutral, `rounded-sm` radius, visible stroke border.
- **Focus:** Amber focus ring (inherits primary color from Nuxt UI). On-brand and immediately legible.
- **Validation:** UForm + Zod. Error state uses semantic `error` color. Never use raw red.

## 6. Do's and Don'ts

### Do:

- **Do** apply `.text-amber` only to the designer's name and one or two other focal brand moments per screen. Amber earns its power from scarcity.
- **Do** keep body line-height at 1.8 and base font size at 1.125rem everywhere Arabic text appears. These are hard minimums.
- **Do** use `rounded-full` exclusively for pills (nav, availability badge) and `rounded-sm` (0.5rem) for interactive controls (buttons, inputs).
- **Do** stagger `animation-delay` increments on list items to reflect reading order. 0.1s steps, beginning at 0.1s.
- **Do** check contrast before adding any amber text on a light surface. Honey Light (`#fbbf24`) fails 4.5:1 against white; use Honey Deep (`#d97706`) for body-scale text in light mode.
- **Do** keep hero atmospheric amber (mesh gradients, avatar glow) at 14–30% opacity maximum. Above that it reads as a mistake, not an atmosphere.

### Don't:

- **Don't** use gradient text (`background-clip: text` with a gradient fill). `.text-amber` is the committed replacement. The gradient pattern is an absolute ban and a primary AI tell.
- **Don't** replicate the SaaS landing template: hero → stats block (big numbers, small labels) → icon-grid features → testimonials → CTA. The evidence on this portfolio comes from content (projects, work history, blog posts), not from metric widgets.
- **Don't** use the "passionate developer" structure: name in gradient, generic tagline, project card grid with hover-glow. These are listed anti-references in PRODUCT.md.
- **Don't** use cream, sand, linen, or any warm-tinted near-white as a page background. The stone ramp at chroma ≈ 0 is the canvas. Adding warmth to the background itself is the 2026 AI reflex.
- **Don't** apply entrance animations to every section. The fade-in pattern belongs to list items within a section. Sections themselves appear at rest.
- **Don't** place `border-left` or `border-right` greater than 1px as a colored stripe on UI components. The ProseMirror blockquote border is scoped to blog-content rendering only, not a precedent for UI chrome.
- **Don't** use glassmorphism decoratively. The nav's `bg-elevated/95` is functional (readability over the hero background), not an aesthetic choice.
- **Don't** override the Arabic baseline: 1.125rem body and 1.8 line-height are non-negotiable. Any deviation requires a documented accessibility justification.
