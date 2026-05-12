# Global Data Management

## Overview

`useGlobal` هو composable مركزي يوفر وصولاً موحداً لبيانات الـ session (بيانات المستخدم + lookup lists) في أي مكان بالتطبيق — سواء components أو composables أو render functions.

**المبدأ الأساسي:** يقرأ مباشرة من `useAuth().data` عبر `computed` — بدون نسخ البيانات أو sync يدوي.

**الملف:** `app/composables/core/useGlobal.js`

---

## Architecture — Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     تسجيل الدخول                          │
│  useLogin → signIn(credentials) → POST /api/auth/login  │
│  → API يرجع { access_token }                            │
│  → nuxt-auth يحفظ الـ token في cookie                    │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Session Fetch                          │
│  nuxt-auth → getSession() → GET /api/auth/profile       │
│  → server proxy → GET /global (External API)             │
│  → النتيجة تتخزن في useAuth().data (reactive ref)       │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                useGlobal() Composable                     │
│                                                         │
│  يقرأ مباشرة من useAuth().data عبر computed             │
│  لا نسخ — لا sync — لا ازدواجية                          │
│                                                         │
│  Exports:                                               │
│  ├── user          { loginName, name }                  │
│  ├── lists         { employees, departments, ... }      │
│  ├── employees     shortcut لـ lists.employees           │
│  ├── findInList    (list, id, idKey?) → item | null     │
│  ├── refreshGlobal () → void                            │
│  └── session       raw session data                     │
└────────────────────────┬────────────────────────────────┘
                         ▼
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
      Components    Composables    Render Functions
      (Navbar,      (form.js,      (columns.js
       GlobalSelect) schema.js)    h() render)
```

---

## Session Data Structure

البيانات التي يرجعها الـ API `/global` بعد تسجيل الدخول:

```js
{
  loginName: "ahmed",
  name: "أحمد محمد",
  privateCompanyMode: true,
  list: {
    employees: [
      { id: 1, name: "أحمد" },
      { id: 2, name: "محمد" },
      // ...
    ],
    departments: [
      { id: 1, name: "IT" },
      // ...
    ],
    categories: [...],
    // ... قوائم أخرى
  }
}
```

هذه البيانات تصل عبر:
1. `POST /api/auth/login` → يرجع `access_token`
2. `GET /api/auth/profile` → server proxy يضرب `GET /global` بالـ token
3. النتيجة تتخزن في `useAuth().data`

---

## API Reference

### `useGlobal()`

```js
const { user, lists, employees, findInList, refreshGlobal, session } = useGlobal()
```

---

### `user`

**Type:** `ComputedRef<{ loginName: string, name: string }>`

بيانات المستخدم الحالي.

```js
const { user } = useGlobal()

// في template
{{ user.loginName }}  // → "ahmed"
{{ user.name }}       // → "أحمد محمد"
```

---

### `lists`

**Type:** `ComputedRef<Record<string, Array>>`

كل الـ lookup lists التي يرجعها الـ API.

```js
const { lists } = useGlobal()

// الوصول لقائمة معينة
const departments = computed(() => lists.value.departments || [])
const categories = computed(() => lists.value.categories || [])
```

---

### `employees`

**Type:** `ComputedRef<Array<{ id: number, name: string }>>`

اختصار مباشر لـ `lists.value.employees`. يوفر الكتابة المتكررة لأن قائمة الموظفين هي الأكثر استخداماً.

```js
const { employees } = useGlobal()

// بدلاً من:
const employees = computed(() => lists.value.employees || [])
```

---

### `findInList(list, id, idKey?)`

**Type:** `(list: Ref<Array>, id: any, idKey?: string) => Object | null`

يبحث عن عنصر بالـ ID في أي قائمة.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `list` | `Ref<Array>` | — | القائمة المراد البحث فيها (reactive ref) |
| `id` | `any` | — | القيمة المراد البحث عنها |
| `idKey` | `string` | `'id'` | اسم الحقل المستخدم للمقارنة |

```js
const { employees, findInList } = useGlobal()

// البحث عن موظف بالـ ID
const emp = findInList(employees, 5)
// → { id: 5, name: "أحمد" }

// البحث بحقل مخصص
const dept = findInList(departments, 'IT', 'code')
```

---

### `refreshGlobal()`

**Type:** `() => void`

يحدث كل البيانات العامة عبر إعادة استدعاء `getSession()`.

```js
const { refreshGlobal } = useGlobal()

// بعد إضافة موظف جديد — تحديث الـ lookup lists
await service.create(newEmployee)
await refreshNuxtData(service.CACHE_KEY)  // تحديث الجدول
refreshGlobal()                           // تحديث الـ lookup lists
```

**متى تستخدمها:**
- بعد إضافة/تعديل/حذف عنصر يظهر في الـ lookup lists (مثل إضافة موظف)
- عند الحاجة لإعادة تحميل بيانات المستخدم

---

### `session`

**Type:** `Ref<Object>`

البيانات الخام للـ session كما هي من `useAuth().data`. للحالات التي تحتاج وصول مباشر لحقول غير موجودة في الـ computed properties.

```js
const { session } = useGlobal()

// الوصول لحقل مخصص
const privateCompanyMode = computed(() => session.value?.privateCompanyMode)
```

---

## Usage Examples

### في Component (Navbar)

```vue
<script setup>
const { user } = useGlobal()
</script>

<template>
  <UUser :name="user.loginName" :description="user.name" />
</template>
```

### في Module Composable (form.js)

```js
export const useEmployeesForm = () => {
  const { lists, findInList } = useGlobal()
  const departments = computed(() => lists.value.departments || [])

  // ...
  return { departments }
}
```

### في Columns (h() render)

```js
export const useEmployeesColumns = () => {
  const { findInList, employees } = useGlobal()

  const createColumns = () => {
    return computed(() => [
      {
        accessorKey: 'departmentId',
        header: 'القسم',
        cell: ({ row }) => {
          const dept = findInList(departments, row.original.departmentId)
          return dept?.name || '—'
        }
      }
    ])
  }

  return { createColumns }
}
```

### عبر GlobalSelect Component

`GlobalSelect` هو wrapper يقرأ من `useGlobal().lists` تلقائياً:

```vue
<!-- يكفي تحديد اسم القائمة -->
<GlobalSelect list="employees" label="الموظف" v-model="state.employeeId" />
```

**ملف الكمبوننت:** `app/components/global/GlobalSelect.vue`

```vue
<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  list: { type: String, required: true }
})

const { lists } = useGlobal()
</script>

<template>
  <BaseSelect v-bind="$attrs" :items="lists[list] || []" />
</template>
```

---

## How It Works — الآلية الداخلية

```js
export const useGlobal = () => {
  // يقرأ مباشرة من useAuth — المصدر الوحيد للحقيقة
  const { data: session, getSession } = useAuth()

  // computed properties — تتحدث تلقائياً عند تغيير session
  const user = computed(() => ({
    loginName: session.value?.loginName || '',
    name: session.value?.name || ''
  }))

  const lists = computed(() => session.value?.list || {})
  const employees = computed(() => lists.value.employees || [])

  const refreshGlobal = () => getSession()

  const findInList = (list, id, idKey = 'id') =>
    list.value?.find(item => item[idKey] === id) || null

  return { user, lists, employees, refreshGlobal, findInList, session }
}
```

**لماذا computed وليس نسخ؟**

```
useAuth().data ──computed──→ useGlobal ──read──→ أي مكان
                 (تلقائي)                (تلقائي)
```

- لو `session` تتحدث (بعد `getSession()`) → كل مكان يتحدث **فوراً**
- لا watchers، لا actions، لا manual sync
- مستحيل تكون البيانات قديمة — لأنها تُقرأ من المصدر مباشرة

---

## Refreshing Data — دورة تحديث البيانات

```
1. المستخدم يضيف موظف جديد
   → service.create(data) → POST /api/employees

2. تحديث الجدول المحلي
   → await refreshNuxtData(service.CACHE_KEY)

3. تحديث الـ lookup lists (لو الموظف يظهر في selects أخرى)
   → refreshGlobal()
   → getSession()
   → GET /api/auth/profile → GET /global
   → useAuth().data يتحدث
   → كل computed في useGlobal يتحدث تلقائياً
   → كل component/composable يستخدم useGlobal يتحدث
```

---

## Design Decisions

### لماذا ليس Pinia أو useState؟

| المعيار | Pinia / useState | useGlobal (computed) |
|---------|-----------------|---------------------|
| مصدر البيانات | نسخة منفصلة (sync مطلوب) | قراءة مباشرة من useAuth |
| تحديث البيانات | يدوي (action/watcher) | تلقائي (computed) |
| خطر بيانات قديمة | ممكن — لو نسيت الـ sync | مستحيل — لا sync أصلاً |
| Dependencies | @pinia/nuxt + setup | صفر |
| SSR | يحتاج إعداد | يعمل تلقائياً (يرث من useAuth) |
| يعمل في composables | نعم | نعم |
| يعمل في h() render | نعم | نعم |

**القاعدة:** لو البيانات **موجودة أصلاً** في مصدر reactive — لا تنسخها. اقرأ منها مباشرة عبر computed.

### لماذا ليس provide/inject؟

- `provide/inject` يعتمد على component tree — لا يعمل في composables مستقلة (مثل `form.js`، `columns.js`)
- `useGlobal` يعمل في **أي مكان** — components، composables، render functions

### متى تستخدم Pinia فعلاً؟

| الحالة | الحل |
|--------|------|
| بيانات من مصدر reactive موجود (useAuth) | **computed + composable** |
| بيانات ينشئها الكلاينت (shopping cart, wizard) | **Pinia** |
| بيانات معقدة مع mutations كثيرة | **Pinia** |
| بيانات بسيطة مشتركة بين صفحتين | **useState** |

---

## Related Files

| الملف | الوصف |
|-------|-------|
| `app/composables/core/useGlobal.js` | الـ composable الرئيسي |
| `app/components/global/GlobalSelect.vue` | Select يقرأ من useGlobal تلقائياً |
| `app/components/layout/Navbar.vue` | يستخدم `useGlobal().user` لعرض بيانات المستخدم |
| `app/composables/auth/useLogin.js` | عملية تسجيل الدخول (تبدأ دورة الـ session) |
| `app/plugins/api.ts` | $api plugin — يحقن Bearer token تلقائياً |
| `server/api/auth/profile.get.ts` | Server proxy — يضرب /global API |
| `app/composables/core/useErrorHandler.js` | معالجة أخطاء الـ API |
