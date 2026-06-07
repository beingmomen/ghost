# Audit Report — apps/client
**التاريخ:** 2026-06-07 (تحديث ما بعد إصلاحات الجلسة)
**النطاق:** `apps/client/app`
**المُنفِّذ:** `/impeccable audit apps/client`

---

## درجة الصحة التقنية (بعد الإصلاحات)

| # | البُعد | الدرجة | أبرز نتيجة |
|---|--------|-------|------------|
| 1 | Accessibility | **3/4** | `eyebrow` prop غير معرّف في `defineProps` (P1 regression) |
| 2 | Performance | **4/4** | SWR caching ✓، will-change ✓، reduced-motion ✓ |
| 3 | Responsive Design | **4/4** | text-balance ✓، breakpoints كاملة ✓ |
| 4 | Theming | **4/4** | token system ✓، dark mode كامل ✓ |
| 5 | Anti-Patterns | **4/4** | لا gradient text، glow ≤18% ✓، blockquote موثّق ✓ |
| **المجموع** | | **19/20** | **Excellent — polish طفيف متبقٍّ** |

*الدرجة السابقة (قبل الإصلاحات): 14/20*

---

## حكم الـ Anti-Patterns

**النجاح: لا يبدو AI-generated.** التصميم واثق ومميز. القرارات المتعمدة (amber scarcity، atmospheric layers، polaroid metaphor، flat elevation) تعكس POV حقيقي وليس reflex template.

- `border-s-4` في ProseMirror blockquote: موثَّق كاستثناء editorial مقصود في `typography.css` — ليس UI chrome
- Hero glow عند 18% effective peak (40% color-mix × 0.45 opacity) — ضمن حد DESIGN.md (≤30%)
- Stats section: amber-branded, no gradient accent، ليس hero-metrics template كلاسيكي

---

## الملخص التنفيذي

- **Audit Health Score: 19/20** (Excellent)
- **إجمالي المشاكل المتبقية**: P0: 0 — P1: 1 — P2: 1 — P3: 1
- **الإصلاح المطلوب فوراً**: `eyebrow` prop regression في `SectionFallback.vue`

---

## المشاكل المتبقية

### P1 — Major

**[P1] Missing `eyebrow` prop في `defineProps` — regression**
- **الموقع**: `apps/client/app/components/landing/SectionFallback.vue:11-37`
- **الفئة**: Accessibility / HTML Validity
- **التأثير**: `defineProps` لا يحتوي على `eyebrow`. عند استدعاء `<LandingSectionFallback eyebrow="آراء العملاء">` من Testimonials/Blog/FAQ، يصبح `eyebrow` fallthrough attribute يُكتب على `<section>` كـ invalid HTML attribute، ولا يُمرَّر لـ `LandingSectionHeading`. عنوان السياق لا يظهر في حالات الخطأ.
- **السبب**: الجلسة السابقة أضافت `:eyebrow="eyebrow"` في الـ template لكن نسيت إضافة الـ prop لـ `defineProps`.
- **الحل**:
  ```js
  eyebrow: {
    type: String,
    default: ''
  }
  ```
- **الأمر المقترح**: `/impeccable polish`

---

### P2 — Minor

**[P2] `ColorModeButton` aria-label بالإنجليزية**
- **الموقع**: `apps/client/app/components/ColorModeButton.vue`
- **الفئة**: Accessibility / i18n
- **التأثير**: الموقع عربي بالكامل. Screen readers عربية ستقرأ "Switch to dark mode" بالإنجليزية. WCAG 4.1.2.
- **الحل**: `{ dark: 'التبديل إلى الوضع الليلي', light: 'التبديل إلى الوضع النهاري' }[nextTheme]`
- **الأمر المقترح**: `/impeccable polish`

---

### P3 — Polish

**[P3] تعارض copy: Stats.vue vs og:title**
- **الموقع**: `apps/client/app/components/landing/Stats.vue:8` vs `apps/client/nuxt.config.ts:34`
- **الفئة**: Copy consistency
- **التأثير**: `Stats.vue` يعرض "22 عملاء" بينما og:title يقول "+50 عميل". زائر من محرك البحث سيلاحظ التعارض.
- **الحل**: توحيد الرقمين.
- **الأمر المقترح**: `/impeccable clarify`

---

## الإصلاحات المُنجَزة ✓

الإصلاحات التالية تمّت في الجلسة السابقة:

| الملف | الإصلاح |
|-------|---------|
| `main.css` | `--ui-text-muted` → neutral-600 (7.07:1)، `--ui-text-dimmed` → neutral-500، dark mode restore، `animate-fade-in` حذف `opacity:0` واستبدال `forwards` بـ `both` |
| `WorkExperience.vue` | `text-dimmed` → `text-muted` للتواريخ |
| `AppFooter.vue` | إزالة `<span>` المحيطة بـ `<h2>/<p>/<div>` |
| `SectionFallback.vue` | إضافة `:eyebrow="eyebrow"` للـ template (**لكن تبقّى إضافته في defineProps**) |
| `Testimonials.vue` | `stopOnMouseEnter: true, stopOnFocusIn: true` — WCAG 2.2.2 |
| `nuxt.config.ts` | تفعيل SWR caching للـ routes الرئيسية |
| `app.vue` | `theme-color` dark → `#1c1917` (stone-900) |
| `Hero.vue` | `text-balance` على h1، `will-change`، glow من 47% → 18% effective |
| `typography.css` | كل `gray-*` → `stone-*`، `text-blue-600` → `text-sky-600`، `::selection` → amber |

---

## ما يعمل بشكل ممتاز ✓

- **Skip-to-content link** في `default.vue`
- **`lang="ar" dir="rtl"` + `UApp :locale="ar"`** — RTL أصيل
- **Prefers-reduced-motion** شامل في `main.css`
- **Button contrast override** (`text-stone-950` على amber)
- **Hero image: `loading="eager"` + `fetchpriority="high"`** — LCP مثالي
- **`aria-hidden`** على كل العناصر الزخرفية
- **Lazy loading** على كل الأقسام غير الحيوية (`LazyLanding*`)
- **SectionFallback** لكل section يعتمد على API
- **Full-bleed negative margin pattern** مُطبَّق باتساق
- **Stats IntersectionObserver** + reduced-motion check
- **`animate-fade-in`**: محتوى مرئي في headless renderers (لا opacity:0 على العنصر)

---

## الإجراءات المقترحة

1. **[P1] `/impeccable polish`** — إضافة `eyebrow` لـ `defineProps` + تعريب aria-label في ColorModeButton
2. **[P3] `/impeccable clarify`** — توحيد رقم العملاء

---

*أعِد تشغيل `/impeccable audit apps/client` بعد الإصلاحات لتأكيد وصول الدرجة لـ 20/20.*
