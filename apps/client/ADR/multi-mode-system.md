# Multi-Mode System Architecture

## Overview

النظام يدعم أوضاع تشغيل متعددة (خاص، حكومي، مختلط...) تُحدد **runtime** بعد تسجيل الدخول. الـ mode يؤثر على:

- **الصفحات المتاحة** — بعض الصفحات خاصة بنظام معين
- **عناصر الـ Sidebar** — تظهر/تختفي حسب النظام
- **محتوى الصفحات** — نفس الصفحة بحقول/سكيمة/state مختلف لكل نظام

**المبدأ الأساسي:** فصل كامل — كل ملف نظيف 100% بدون شروط. الـ mode logic موجود في **4 أماكن فقط** في النظام بأكمله.

---

## Mode Detection — `useMode.js`

**الملف:** `app/composables/core/useMode.js`

يقرأ الـ mode من session data ويوحد الصيغة:

```
session.privateCompanyMode === true   →  'private'
session.privateCompanyMode === false  →  'government'
session.mode === 1                    →  'private'
session.mode === 2                    →  'government'
session.mode === 3                    →  'mixed'
fallback                              →  'private'
```

### Implementation

```js
export const MODES = {
  PRIVATE: 'private',
  GOVERNMENT: 'government',
  MIXED: 'mixed'
}

export const useMode = () => {
  const { data: session } = useAuth()

  const mode = computed(() => {
    const raw = session.value
    if (raw?.mode !== undefined) {
      return { 1: MODES.PRIVATE, 2: MODES.GOVERNMENT, 3: MODES.MIXED }[raw.mode] || MODES.PRIVATE
    }
    if (raw?.privateCompanyMode !== undefined) {
      return raw.privateCompanyMode ? MODES.PRIVATE : MODES.GOVERNMENT
    }
    return MODES.PRIVATE
  })

  const isMode = (...modes) => modes.includes(mode.value)

  const filterByMode = (items) => items.filter(item => {
    if (!item.modes || item.modes.length === 0) return true
    return item.modes.includes(mode.value)
  })

  return { mode, isMode, filterByMode, MODES }
}
```

---

## API Reference

### `MODES`

ثوابت أسماء الأنظمة:

```js
import { MODES } from '~/composables/core/useMode'

MODES.PRIVATE     // 'private'
MODES.GOVERNMENT  // 'government'
MODES.MIXED       // 'mixed'
```

### `mode`

**Type:** `ComputedRef<string>`

الـ mode الحالي كـ string.

```js
const { mode } = useMode()
console.log(mode.value) // 'private' | 'government' | 'mixed'
```

### `isMode(...modes)`

**Type:** `(...modes: string[]) => boolean`

يتحقق هل النظام الحالي ضمن القائمة المحددة.

```js
const { isMode } = useMode()

isMode('private')                    // true لو النظام خاص
isMode('private', 'mixed')           // true لو خاص أو مختلط
isMode('government')                 // true لو حكومي
```

### `filterByMode(items)`

**Type:** `(items: Array<{ modes?: string[] }>) => Array`

يصفي array من العناصر حسب خاصية `modes` الاختيارية.

| حالة العنصر | النتيجة |
|-------------|---------|
| بدون `modes` | يظهر دائماً |
| `modes: []` (فارغ) | يظهر دائماً |
| `modes: ['private']` | يظهر فقط لو النظام `private` |
| `modes: ['private', 'government']` | يظهر لو النظام `private` أو `government` |

```js
const { filterByMode } = useMode()

const items = [
  { label: 'Dashboard' },                        // يظهر دائماً
  { label: 'Invoices', modes: ['private'] },      // خاص فقط
  { label: 'Tenders', modes: ['government'] },    // حكومي فقط
]

filterByMode(items) // يرجع العناصر المناسبة للنظام الحالي
```

---

## Components

### `BaseModeSwitch`

**الملف:** `app/components/base/ModeSwitch.vue`

يستقبل map من الكمبوننتات ويرسم الصحيح تلقائياً حسب الـ mode. يمرر `$attrs` و `$slots` للكمبوننت المختار.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `is` | `Object` | Yes | Map من mode → component |

**Usage:**

```vue
<script setup>
import FormPrivate from '~/components/modules/settings/signatures/SignaturesFormPrivate.vue'
import FormGovernment from '~/components/modules/settings/signatures/SignaturesFormGovernment.vue'

const formComponents = {
  private: FormPrivate,
  government: FormGovernment
}
</script>

<template>
  <BaseModeSwitch :is="formComponents" />
</template>
```

**Implementation:**

```vue
<script setup>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  is: { type: Object, required: true }
})

const { mode } = useMode()
const current = computed(() => props.is[mode.value])
</script>

<template>
  <component :is="current" v-bind="$attrs">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </component>
</template>
```

---

### `BaseModeShow`

**الملف:** `app/components/base/ModeShow.vue`

للحالات البسيطة — إظهار/إخفاء محتوى حسب الـ mode. يُستخدم **خارج الفورمات** فقط (للفورمات يُفضل الفصل بالملفات).

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modes` | `Array` | Yes | — | الأنظمة المسموحة |
| `except` | `Array` | No | `[]` | الأنظمة المستثناة |

**Usage:**

```vue
<!-- إظهار للنظام الخاص فقط -->
<BaseModeShow :modes="['private']">
  <div>محتوى خاص بالنظام الخاص</div>
</BaseModeShow>

<!-- إظهار للجميع ما عدا الحكومي -->
<BaseModeShow :except="['government']">
  <div>يظهر لكل الأنظمة إلا الحكومي</div>
</BaseModeShow>
```

**Implementation:**

```vue
<script setup>
const props = defineProps({
  modes: { type: Array, required: true },
  except: { type: Array, default: () => [] }
})
const { isMode } = useMode()
const visible = computed(() => {
  if (props.except.length > 0) return !isMode(...props.except)
  return isMode(...props.modes)
})
</script>

<template>
  <template v-if="visible">
    <slot />
  </template>
</template>
```

---

## Middleware — حماية الصفحات

**الملف:** `app/middleware/mode.global.js`

يحمي الصفحات المقيدة بنظام معين. يقرأ `to.meta.modes` ويحول المستخدم لـ `/` لو النظام غير مسموح.

**القواعد:**
- صفحة بدون `modes` في meta → مسموحة لكل الأنظمة
- صفحة مع `modes` → مسموحة فقط للأنظمة المحددة

**Implementation:**

```js
export default defineNuxtRouteMiddleware((to) => {
  const allowedModes = to.meta?.modes
  if (!allowedModes || !Array.isArray(allowedModes) || allowedModes.length === 0) return
  const { isMode } = useMode()
  if (!isMode(...allowedModes)) return navigateTo('/')
})
```

**Usage — في الصفحة:**

```js
// صفحة متاحة لكل الأنظمة (لا تحتاج modes)
definePageMeta({
  title: 'pages.activities'
})

// صفحة خاصة بالنظام الخاص فقط
definePageMeta({
  title: 'pages.invoices',
  modes: ['private']
})

// صفحة متاحة للخاص والمختلط
definePageMeta({
  title: 'pages.tax',
  modes: ['private', 'mixed']
})
```

---

## Sidebar Filtering

**الملف:** `app/composables/layout/useSidebar.js`

إضافة خاصية `modes` اختيارية لعناصر الـ sidebar + تصفية تلقائية عبر `filterByMode`.

**القاعدة:** عنصر بدون `modes` = يظهر في كل الأنظمة. عنصر مع `modes` = يظهر فقط في الأنظمة المحددة.

```js
export const useSidebar = () => {
  const open = ref(false)
  const { t } = useI18n()
  const localePath = useLocalePath()
  const { filterByMode } = useMode()

  // تصفية العناصر + أبناءها + حذف المجموعات الفارغة
  const filterLinks = (items) => {
    return filterByMode(items).map(item => {
      if (item.children) return { ...item, children: filterByMode(item.children) }
      return item
    }).filter(item => !(item.children?.length === 0))
  }

  const rawLinks = computed(() => [
    {
      label: t('sidebar.dashboard'),
      icon: 'i-lucide-house',
      to: localePath('/')
      // بدون modes → يظهر دائماً
    },
    {
      label: t('sidebar.invoices'),
      icon: 'i-lucide-file-text',
      to: localePath('/invoices'),
      modes: ['private']              // ← خاص فقط
    },
    {
      label: t('sidebar.settings'),
      icon: 'i-lucide-settings',
      children: [
        {
          label: t('sidebar.permissions'),
          icon: 'i-lucide-shield',
          to: localePath('/settings/permissions')
          // بدون modes → يظهر دائماً
        },
        {
          label: t('sidebar.tax'),
          icon: 'i-lucide-receipt',
          to: localePath('/settings/tax'),
          modes: ['private']          // ← خاص فقط
        }
      ]
    }
  ])

  const links = computed(() => [filterLinks(rawLinks.value), []])

  return { open, links }
}
```

---

## Module Pattern — الفصل الكامل

### المبدأ

للموديولات التي تختلف بين الأنظمة:
- **Template** → ملف منفصل لكل نظام (نظيف بدون شروط)
- **Schema** → ملف منفصل لكل نظام (نظيف بدون شروط)
- **Form State** → ملف منفصل لكل نظام (نظيف بدون شروط)
- **Orchestrator** (`index.js`) → **المكان الوحيد** فيه mode logic
- **Table, Columns, Service** → مشتركة (لا تتغير)

للموديولات المشتركة 100%: لا يتغير شيء — ملفات عادية بدون بديل.

---

### هيكل الملفات — موديول مختلف بين الأنظمة

```
composables/modules/settings/signatures/
├── index.js                    ← الأوركسترا (الشرط الوحيد هنا)
├── schema.private.js           ← سكيمة نظيفة 100%
├── schema.government.js        ← سكيمة نظيفة 100%
├── form.private.js             ← state نظيف 100%
├── form.government.js          ← state نظيف 100%
├── table.js                    ← مشترك
└── columns.js                  ← مشترك

components/modules/settings/signatures/
├── SignaturesFormPrivate.vue    ← template نظيف بدون شروط
├── SignaturesFormGovernment.vue ← template نظيف بدون شروط
└── SignaturesTable.vue          ← مشترك
```

### هيكل الملفات — موديول مشترك 100%

```
composables/modules/settings/activities/
├── index.js
├── schema.js                   ← ملف واحد (بدون .private/.government)
├── form.js                     ← ملف واحد
├── table.js
└── columns.js

components/modules/settings/activities/
├── ActivitiesForm.vue           ← ملف واحد
└── ActivitiesTable.vue
```

---

### Naming Conventions

| النوع | المشترك | الخاص بنظام |
|-------|---------|-------------|
| Schema composable | `schema.js` | `schema.private.js` / `schema.government.js` |
| Form composable | `form.js` | `form.private.js` / `form.government.js` |
| Columns composable | `columns.js` | `columns.private.js` / `columns.government.js` |
| Vue Component | `SignaturesForm.vue` | `SignaturesFormPrivate.vue` / `SignaturesFormGovernment.vue` |
| Export function | `useSignaturesSchema()` | `useSignaturesSchemaPrivate()` / `useSignaturesSchemaGovernment()` |

**القاعدة:** mode names بحروف صغيرة في الملفات (`schema.private.js`)، PascalCase في الكمبوننتات (`SignaturesFormPrivate.vue`).

---

### Orchestrator Pattern — `index.js`

المكان الوحيد في الموديول فيه mode logic. يستخدم map بسيط لاختيار الملفات الصحيحة:

```js
export const useSignatures = () => {
  const { mode } = useMode()

  // ← الشرط الوحيد: اختيار النسخة الصحيحة
  const schemaMap = {
    private: useSignaturesSchemaPrivate,
    government: useSignaturesSchemaGovernment
  }
  const formMap = {
    private: useSignaturesFormPrivate,
    government: useSignaturesFormGovernment
  }

  const { schema } = schemaMap[mode.value]()
  const form = formMap[mode.value]()

  // ← مشترك — بدون أي شرط
  const table = useSignaturesTable()
  const { createColumns } = useSignaturesColumns()

  const editHandler = (item) => {
    form.state.id = item.id
  }

  const columns = createColumns({ onEdit: editHandler })

  const resetState = () => {
    form.resetForm()
  }

  const submitHandler = async () => {
    table.loadingSave.value = true
    try {
      const body = form.prepareSubmitData()
      await table.updateSignature(form.state.id, body)
      form.resetForm()
    } catch {
      // handled by base service
    } finally {
      table.loadingSave.value = false
    }
  }

  return {
    schema,
    state: form.state,
    reportsList: form.reportsList,
    items: table.items,
    loadingSave: table.loadingSave,
    columns,
    resetState,
    submitHandler
  }
}
```

---

### Schema — ملفات منفصلة

كل سكيمة ملف نظيف كامل بدون أي شرط:

**`schema.private.js`:**

```js
import * as z from 'zod'

export const useSignaturesSchemaPrivate = () => {
  const { t } = useI18n()

  const schema = computed(() =>
    z.object({
      id: z.union([z.string(), z.number()], { message: t('signatures.reportRequired') }),
      firstSign: z.string().nullish(),
      secondSign: z.string().nullish(),
      thirdSign: z.string().nullish(),
      taxRef: z.string().optional()       // خاص بالنظام الخاص
    })
  )

  return { schema }
}
```

**`schema.government.js`:**

```js
import * as z from 'zod'

export const useSignaturesSchemaGovernment = () => {
  const { t } = useI18n()

  const schema = computed(() =>
    z.object({
      id: z.union([z.string(), z.number()], { message: t('signatures.reportRequired') }),
      firstSign: z.string().nullish(),
      secondSign: z.string().nullish(),
      thirdSign: z.string().nullish(),
      govCode: z.string().min(1, t('signatures.govCodeRequired')),  // خاص بالحكومي
      ministry: z.string().optional()                                // خاص بالحكومي
    })
  )

  return { schema }
}
```

---

### Form State — ملفات منفصلة

كل state ملف نظيف يحتوي على: `INITIAL_STATE`، `state`، `setFormData`، `resetForm`، `prepareSubmitData`.

**`form.private.js`:**

```js
const INITIAL_STATE = {
  id: undefined,
  firstSign: undefined,
  secondSign: undefined,
  thirdSign: undefined,
  taxRef: undefined          // خاص بالنظام الخاص
}

export const useSignaturesFormPrivate = () => {
  const service = useSignaturesService()
  const { data: signaturesRaw } = useNuxtData(service.CACHE_KEY)

  const state = reactive({ ...INITIAL_STATE })
  const reportsList = computed(() => signaturesRaw.value?.data || [])

  const setFormData = (item) => {
    state.id = item.id
    state.firstSign = item.firstSign
    state.secondSign = item.secondSign
    state.thirdSign = item.thirdSign
    state.taxRef = item.taxRef
  }

  const resetForm = () => Object.assign(state, { ...INITIAL_STATE })

  const prepareSubmitData = () => ({
    firstSign: state.firstSign,
    secondSign: state.secondSign,
    thirdSign: state.thirdSign,
    taxRef: state.taxRef
  })

  watch(() => state.id, (newValue) => {
    if (newValue) {
      const report = reportsList.value.find(item => item.id === newValue)
      if (report) setFormData(report)
    } else {
      resetForm()
    }
  })

  return { state, reportsList, setFormData, resetForm, prepareSubmitData }
}
```

---

### Component — ملفات منفصلة

كل component ملف Vue نظيف يستخدم `inject('composable')`:

**`SignaturesFormPrivate.vue`:**

```vue
<script setup>
const { state, schema, loadingSave, submitHandler, resetState, reportsList } = inject('composable')
const form = useTemplateRef('form')
const onNew = () => { resetState(); form.value?.clear() }
</script>

<template>
  <BaseCard :title="$t('signatures.title')" icon="i-lucide-pen-tool">
    <BaseForm ref="form" :schema="schema" :state="state" :cols="4" @submit="submitHandler">
      <BaseSelect v-model="state.id" :label="$t('signatures.report')" name="id"
        :items="reportsList" value-key="id" label-key="reportName" />
      <BaseInput v-model="state.firstSign" :label="$t('signatures.firstSign')" name="firstSign" />
      <BaseInput v-model="state.secondSign" :label="$t('signatures.secondSign')" name="secondSign" />
      <BaseInput v-model="state.thirdSign" :label="$t('signatures.thirdSign')" name="thirdSign" />
      <BaseInput v-model="state.taxRef" :label="$t('signatures.taxRef')" name="taxRef" />

      <template #actions>
        <div class="flex items-center justify-center gap-5 w-full">
          <UButton class="px-10" size="xl" color="primary" icon="i-lucide-plus"
            :label="$t('signatures.new')" @click="onNew" />
          <UButton class="px-10" size="xl" type="submit" color="success" icon="i-lucide-save"
            :label="$t('signatures.save')" :loading="loadingSave" />
        </div>
      </template>
    </BaseForm>
  </BaseCard>
</template>
```

---

### Page — استخدام ModeSwitch

```vue
<script setup>
import SignaturesFormPrivate from '~/components/modules/settings/signatures/SignaturesFormPrivate.vue'
import SignaturesFormGovernment from '~/components/modules/settings/signatures/SignaturesFormGovernment.vue'

definePageMeta({ title: 'pages.signatures' })

const service = useSignaturesService()
await useAPI(service.BASE_URL, { key: service.CACHE_KEY })

const signatures = useSignatures()
provide('composable', signatures)

const formComponents = {
  private: SignaturesFormPrivate,
  government: SignaturesFormGovernment
}
</script>

<template>
  <div class="space-y-8">
    <BaseModeSwitch :is="formComponents" />
    <ModulesSettingsSignaturesTable />
  </div>
</template>
```

---

## Where Mode Logic Exists

في النظام بأكمله، الـ mode logic موجود في **4 أماكن فقط**:

| الملف | الغرض |
|-------|-------|
| `app/composables/core/useMode.js` | قراءة الـ mode من session وتوحيد الصيغة |
| `app/middleware/mode.global.js` | حماية الصفحات المقيدة بنظام معين |
| `app/composables/layout/useSidebar.js` | تصفية عناصر الـ sidebar حسب النظام |
| `app/composables/modules/*/index.js` | اختيار schema/form/component الصحيح (الأوركسترا) |

**كل ملف آخر (schema, form, component, table, columns, service) = كود نظيف 100% بدون أي شرط.**

---

## Adding a New Mode

مثال: إضافة نظام جديد `mixed` (mode: 3).

### الخطوة 1 — تحديث useMode.js

```js
export const MODES = {
  PRIVATE: 'private',
  GOVERNMENT: 'government',
  MIXED: 'mixed'              // ← جديد
}

// في الـ computed:
if (raw?.mode !== undefined) {
  return {
    1: MODES.PRIVATE,
    2: MODES.GOVERNMENT,
    3: MODES.MIXED              // ← جديد
  }[raw.mode] || MODES.PRIVATE
}
```

### الخطوة 2 — إنشاء ملفات النظام الجديد (لكل موديول مختلف)

```
composables/modules/settings/signatures/
  schema.mixed.js               ← جديد
  form.mixed.js                 ← جديد

components/modules/settings/signatures/
  SignaturesFormMixed.vue        ← جديد
```

### الخطوة 3 — تحديث الأوركسترا

```js
// index.js
const schemaMap = {
  private: useSignaturesSchemaPrivate,
  government: useSignaturesSchemaGovernment,
  mixed: useSignaturesSchemaMixed          // ← جديد
}
const formMap = {
  private: useSignaturesFormPrivate,
  government: useSignaturesFormGovernment,
  mixed: useSignaturesFormMixed            // ← جديد
}
```

### الخطوة 4 — تحديث الصفحة

```vue
<script setup>
import FormMixed from '~/components/modules/settings/signatures/SignaturesFormMixed.vue'

const formComponents = {
  private: FormPrivate,
  government: FormGovernment,
  mixed: FormMixed               // ← جديد
}
</script>
```

### الخطوة 5 — تحديث Sidebar (لو في عناصر جديدة)

```js
{
  label: t('sidebar.mixedReport'),
  icon: 'i-lucide-file',
  to: localePath('/mixed-report'),
  modes: ['mixed']                // ← جديد
}
```

### الخطوة 6 — تحديث Page Meta (لو في صفحات مقيدة)

```js
definePageMeta({
  title: 'pages.mixedReport',
  modes: ['mixed']                // ← حماية بالـ middleware
})
```

**لا إعادة هيكلة. لا تعديل على ملفات الأنظمة الموجودة.**

---

## Design Decisions

### لماذا الفصل الكامل وليس ModeShow/شروط في template؟

مع واجهات فيها مئات الحقول و3+ أنظمة:
- **ModeShow wrappers** في template = نفس مشكلة if/else بشكل مختلف
- **isMode() في Schema** = مئات الشروط
- **المطور الجديد** يحتاج "فلترة ذهنية" لكل سطر لفهم نظام واحد

الفصل بالملفات يحل كل هذا: المطور يفتح `FormPrivate.vue` ويرى **كل شيء** لنظام واحد.

### التكرار الوحيد = HTML الـ template

| ما يتكرر | خطورته |
|----------|--------|
| HTML الحقول في template | **منخفضة** — تصريحي وليس لوجك |
| Labels | **صفر** — من i18n (ملف واحد مشترك) |
| سلوك الحقول | **صفر** — في Base Components (ملف واحد مشترك) |
| Schema | **صفر** — ملف مستقل لكل نظام |
| Form state | **صفر** — ملف مستقل لكل نظام |
| Services/API | **صفر** — مشترك دائماً |
| Save/Submit | **صفر** — مشترك في الأوركسترا |

### لماذا ليس Config-Driven (حقول كـ array)؟

يفقد مرونة الـ template — لا slots مخصصة، لا layouts معقدة، لا تصميم مختلف لكل نظام. كل نوع حقل جديد (date, file, switch) يحتاج case جديد في الـ renderer.

### لماذا ليس Nuxt Layers (طبقة منفصلة لكل نظام)؟

الـ mode يأتي **runtime** من API بعد تسجيل الدخول. Nuxt Layers تعمل **build-time** فقط — لا تصلح لهذا السيناريو.

---

## Related Files

### Core (موجودة / ستُنشأ)

| الملف | الوصف |
|-------|-------|
| `app/composables/core/useMode.js` | قراءة الـ mode من session |
| `app/composables/core/useGlobal.js` | يصدّر `mode` و `isMode` من useMode |
| `app/components/base/ModeSwitch.vue` | Dynamic component حسب الـ mode |
| `app/components/base/ModeShow.vue` | Conditional render حسب الـ mode |
| `app/middleware/mode.global.js` | حماية الصفحات المقيدة |
| `app/composables/layout/useSidebar.js` | تصفية عناصر الـ sidebar |

### Module Example (Signatures)

| الملف | الوصف |
|-------|-------|
| `app/composables/modules/settings/signatures/index.js` | الأوركسترا |
| `app/composables/modules/settings/signatures/schema.private.js` | سكيمة النظام الخاص |
| `app/composables/modules/settings/signatures/schema.government.js` | سكيمة النظام الحكومي |
| `app/composables/modules/settings/signatures/form.private.js` | State النظام الخاص |
| `app/composables/modules/settings/signatures/form.government.js` | State النظام الحكومي |
| `app/composables/modules/settings/signatures/table.js` | مشترك |
| `app/composables/modules/settings/signatures/columns.js` | مشترك |
| `app/components/modules/settings/signatures/SignaturesFormPrivate.vue` | Template النظام الخاص |
| `app/components/modules/settings/signatures/SignaturesFormGovernment.vue` | Template النظام الحكومي |
| `app/components/modules/settings/signatures/SignaturesTable.vue` | مشترك |
