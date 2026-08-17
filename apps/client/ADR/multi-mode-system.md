# Mode System — نظام الأوضاع

**الحالة: مُنفَّذ — أُعيد تصميمه جزئياً أثناء البناء بعد مراجعة داخلية**

## Overview

النظام بيخدم نوعين من الجهات: **شركات خاصة (private)** و**جهات عامة (public)**، بفورمات وحقول وسلوكيات مختلفة. الـ mode بيتحدد **runtime** بعد تسجيل الدخول (من بيانات الـ session)، ومش build-time. المبدأ الأساسي: **build واحد يخدم النوعين** — كل فرق حقيقي بين الوضعين بيتعزل في ملف "variant" نظيف، بدل شروط متناثرة في الكود.

**المبادئ الحاكمة:**
- الـ mode هوية شجرة المكونات، مش state متقلّب — يتحدد مرة واحدة، وأي تغيير فيه يعني إعادة بناء الشجرة من الصفر (Keyed Remount)، مش تحديث تفاعلي.
- ملف الـ variant يتعمل بس لو فيه فرق فعلي — موديول من غير فروقات = ملفات عادية، من غير أي أثر لنظام الـ mode خالص.
- كل حجم فرق بين الوضعين له أداة واحدة محددة (نص → مفتاح ترجمة، حقل واحد → مكوّن شرطي، هيكل مختلف → ملف variant مستقل) — مفيش اجتهاد حر.
- الـ mode أداة عرض (UX) بس — أي قاعدة على مستوى البيانات مسؤولية الـ backend حصرياً.

---

## Mode Resolution — `useMode`

**الملف:** `composables/core/useMode.js`

بيقرأ الـ mode من بيانات الـ session ويوحّد الصيغة لقيمة واحدة (`private` أو `public`):

```
session.privateCompanyMode === true   →  'private'
session.privateCompanyMode === false  →  'public'
session.mode === 1                    →  'private'
session.mode === 2                    →  'public'
شكل غير متعارف عليه                    →  'public' (مع تحذير في الكونسول يوضّح السبب)
```

لو شكل بيانات الـ session جه بصيغة مش متوقعة، النظام بيرجع لـ `public` كـ fallback آمن بدل ما يفشل، مع تحذير واضح في الكونسول يساعد في التشخيص السريع.

```js
export const useMode = () => {
  const { data: session } = useAuth()

  const mode = computed(() => resolveMode(session.value))

  const isMode = (...modes) => modes.includes(mode.value)

  return { mode, isMode }
}
```

---

## آلية التبديل — Keyed Remount

**الـ mode ثابت طوال حياة شجرة المكونات.** التبديل بينهم مش تحديث تفاعلي — هو هدم وإعادة بناء كاملة للشجرة، عبر `<NuxtLayout :key="mode">` في `app.vue`. تغيّر الـ `key` = Vue بيهدم الشجرة القديمة بالكامل ويبني شجرة جديدة من الصفر، وكل composable فيها بيقرأ الوضع الجديد من الأول.

مراقب مركزي واحد في `app.vue` بيلتقط أي تغيير في الـ mode (بغض النظر عن مصدره)، وبيعمل تنظيف الكاش القديم + التحقق من إن الصفحة الحالية مسموحة في الوضع الجديد (لو مش مسموحة، تحويل تلقائي للصفحة الرئيسية).

**القاعدة المعمارية:** اقرأ الـ mode في أي وقت، لكن **لا تخزّن نسخة منه** (أو من أي قيمة محسوبة منه) في مكان بيعيش برّه شجرة المكونات (زي plugin أو state عام) — أي نسخة زي كده بتنجو من عملية الهدم وبتفضل شايلة قيمة الوضع القديم.

---

## الـ Helper الرسمي — `useModeVariant`

**الملف:** `composables/core/useModeVariant.js`

بيختار الـ variant المناسب للوضع الحالي، مرة واحدة وقت بناء الـ composable:

```js
export const useModeVariant = (variants) => {
  const { mode } = useMode()
  return variants[mode.value]?.() ?? {}
}
```

**الاستخدام في موديول فيه فروقات حقيقية** (مثال حقيقي — موديول التوظيف):

```js
// composables/modules/administration/employees/_employment/schema/index.js
export const useEmployeeEmploymentSchema = () => {
  const modeSpecific = useModeVariant({
    private: useEmployeeEmploymentSchemaPrivate,
    public: useEmployeeEmploymentSchemaPublic
  })

  const baseSchema = z.object({ /* الحقول المشتركة */ })

  const schema = computed(() =>
    modeSpecific.extension
      ? baseSchema.extend(modeSpecific.extension.shape)
      : baseSchema
  )

  return { schema }
}
```

**موديول من غير فروقات** — ملف عادي، من غير أي أثر لنظام الـ mode:

```js
export const useQualificationsSchema = () => {
  const schema = z.object({ /* ... */ })
  return { schema }
}
```

---

## فلسفة الدمج — مش قاعدة واحدة شاملة

المبدأ الحاكم: **"هل الترتيب/التكوين الكامل جزء من العقد المرئي؟"** — الإجابة بتفرّق شكل كل artifact:

| الـ Artifact | الفلسفة | الشكل |
|---|---|---|
| **Schema / Form State** | base + extension | ملف الـ variant يصدّر `extension` بحقول الفرق (delta) بس — المشترك مُعرَّف مرة واحدة، فمستحيل ينسى تعديل حقل مشترك في وضع وينساه في التاني |
| **Columns** | تعريف كامل لكل وضع | ترتيب الأعمدة عقد مرئي مع العميل — الـ merge بيخفي الترتيب النهائي، فكل variant بيعرّف الأعمدة كاملة |
| **Sidebar** | تعريف كامل عند ظهور فرق حقيقي | نفس منطق الـ Columns — الترتيب والتجميع مرئيين |
| **Components** | فصل كامل بالملفات | هيكل مختلف بين الوضعين (مجلدات `private/` و`public/` و`shared/`) يستحق ملفات مستقلة، عبر `componentsMap` في الأوركسترا |

---

## المكوّن الرسمي للفروقات الصغيرة — `BaseModeShow`

**الملف:** `components/base/ModeShow.vue`

للحالات البسيطة جداً — إظهار/إخفاء عنصر أو حقل واحد حسب الوضع، بدون فصل ملف كامل:

```vue
<!-- إظهار للوضع الخاص فقط -->
<BaseModeShow :modes="['private']">
  <BaseInput v-model="state.someField" label="حقل خاص بالوضع الخاص" />
</BaseModeShow>
```

سلّم الفروقات: **نص فقط** → مفتاح ترجمة بلاحقة الوضع · **حقل واحد** → `BaseModeShow` · **هيكل مختلف** → ملف variant مستقل عبر `componentsMap`.

---

## حماية الصفحات — Middleware

**الملف:** `middleware/mode.global.js`

بيحمي الصفحات المقيدة بوضع معين عبر `definePageMeta({ modes })`:

```js
export default defineNuxtRouteMiddleware((to) => {
  const allowedModes = to.meta?.modes
  if (!allowedModes || !Array.isArray(allowedModes) || allowedModes.length === 0) return
  const { isMode } = useMode()
  if (!isMode(...allowedModes)) return navigateTo('/')
})
```

```js
// صفحة متاحة لكل الأوضاع (بدون modes)
definePageMeta({ title: 'pages.qualifications' })

// صفحة خاصة بالوضع الخاص فقط
definePageMeta({ title: 'pages.employment', modes: ['private'] })
```

> ملاحظة مهمة: الـ mode في الواجهة أداة عرض (UX) فقط — الحماية دي بتنظّم التنقل، مش بديل عن أي تحقق أمني حقيقي على مستوى الـ backend.

---

## نمط الموديول — مثال حقيقي (Employment)

موديول التوظيف (`_employment`) فيه فروقات حقيقية بين الوضعين، فبيستخدم نمط الـ variant الكامل:

```
composables/modules/administration/employees/_employment/
├── schema/
│   ├── index.js                    ← الأوركسترا (useModeVariant)
│   ├── schema.private.js           ← extension الوضع الخاص
│   └── schema.public.js            ← extension الوضع العام
├── form/
│   ├── index.js
│   ├── form.private.js
│   └── form.public.js
└── lists/
    └── index.js                    ← مشترك، بدون فروقات
```

موديولات تانية بلا فروقات حقيقية (زي `qualifications`) — ملفات عادية بلا أي variant، بلا `useModeVariant`، وكأن نظام الـ mode مش موجود خالص.

---

## القرارات التصميمية

### لماذا ليس Config-Driven (حقول كـ array)؟

يفقد مرونة الـ template — لا slots مخصصة، لا layouts معقدة، لا تصميم مختلف لكل وضع. كل نوع حقل جديد (date, file, switch) يحتاج case جديد في الـ renderer.

### لماذا ليس Nuxt Layers (طبقة منفصلة لكل وضع)؟

الـ mode بييجي **runtime** من بيانات الـ session بعد تسجيل الدخول. Nuxt Layers بتشتغل **build-time** بس — مش مناسبة للسيناريو ده أصلاً.

---

## ما تغيّر أثناء البناء

القسم ده بيوثّق حاجتين اتبنوا بالكود فعلاً، اتراجعوا أثناء المراجعة الداخلية للبناء نفسه — قبل أي استخدام إنتاج حقيقي.

### من 3 أوضاع لوضعين

**كان مصمَّم:** نظام بتلات أوضاع منفصلة — خاص (private)، حكومي (government)، ومختلط (mixed) — كل واحد بملفات ومنطق مستقل خاص بيه.

**اتضح في المراجعة:** الوضع "المختلط" ما كانش له تمايز فعلي كافي يستاهل مسار كامل مستقل، والفرق الحقيقي بين "الحكومي" وباقي الحالات كان بيتلخص عملياً في نفس المنطق المطلوب لوضع "عام" (public) بمعناه الأوسع.

**التعديل وليه:** تقليص النظام لوضعين بس — private وpublic. تبسيط حقيقي في عدد المسارات المطلوب صيانتها، مش فقدان قدرة فعلية كانت مستخدَمة.

### حذف ModeSwitch وfilterByMode

**كان مصمَّم:** مكوّن `ModeSwitch` (Dynamic component يختار الشكل المناسب حسب الوضع تلقائياً) ودالة `filterByMode` (تصفية عناصر قائمة حسب الوضع الحالي) — الاتنين كأدوات مساعدة عامة للتعامل مع فروقات الأوضاع.

**اتضح في المراجعة:** `ModeSwitch` كان بيكرر بالظبط نفس وظيفة نمط `componentsMap` المستخدَم أصلاً في كل أوركسترا — أداتان لوظيفة واحدة، بيسببوا حيرة مش وضوح. أما `filterByMode`، فطلعت dead code فعلياً — صفر استخدامات حقيقية في الكود كله وقت المراجعة.

**التعديل وليه:** الاتنين اتشالوا بالكامل. `ModeSwitch` استُبدل بـ `componentsMap` مباشرة داخل الأوركسترا (نفس الوظيفة، أداة واحدة بدل اتنين). `filterByMode` اتشالت من غير أي بديل — مكنش ليها استخدام حقيقي أصلاً.

---

## Related Files

### Core

| الملف | الوصف |
|-------|-------|
| `composables/core/useMode.js` | قراءة الـ mode من الـ session وتوحيد الصيغة |
| `composables/core/useModeVariant.js` | اختيار الـ variant المناسب للوضع الحالي |
| `components/base/ModeShow.vue` | إظهار/إخفاء شرطي للفروقات الصغيرة |
| `middleware/mode.global.js` | حماية الصفحات المقيدة بوضع معين |
| `app.vue` | الـ `<NuxtLayout :key="mode">` + المراقب المركزي |

### Module Example (Employment)

| الملف | الوصف |
|-------|-------|
| `composables/modules/administration/employees/_employment/schema/index.js` | الأوركسترا (`useModeVariant`) |
| `composables/modules/administration/employees/_employment/schema/schema.private.js` | Extension الوضع الخاص |
| `composables/modules/administration/employees/_employment/schema/schema.public.js` | Extension الوضع العام |
| `composables/modules/administration/employees/_employment/form/index.js` | الأوركسترا (`useModeVariant`) |
| `composables/modules/administration/employees/_employment/lists/index.js` | مشترك، بدون فروقات |
