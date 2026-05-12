# BeingMomen Dashboard

لوحة تحكم عربية RTL مبنية على [my-base-layer](../my-base-layer) كـ Nuxt Layer.

## ما يوفره الـ Base Layer

- نظام المصادقة (تسجيل دخول، تسجيل حساب، نسيت كلمة المرور)
- التخطيطات (Dashboard + Auth layouts)
- المكونات الأساسية (Table, Form, Card, Input, Select, Calendar, ...)
- الـ Composables (useAPI, useGlobal, useBaseService, useAvatar, normalizeAvatarSrc, ...)
- إعدادات الثيم (Nuxt UI + Tailwind CSS + 16 لون أساسي)
- الـ Server API proxy (مع دعم static assets مثل الصور)
- دعم RTL والعربية

## التثبيت

```bash
# 1. استنساخ المشروع
git clone <repo-url> my-project
cd my-project

# 2. إعداد ملف البيئة
cp .env.example .env
# عدّل .env حسب السيرفر الخاص بك

# 3. تأكد من وجود الـ base layer بجانب المشروع
# ../my-base-layer يجب أن يكون موجوداً ومُثبّت الـ dependencies

# 4. تثبيت الاعتمادات
pnpm install

# 5. تشغيل السيرفر
pnpm dev
```

السيرفر يعمل على `http://localhost:9122`

## البنية

```
my-starter-kit/
├── app/
│   ├── app.config.ts              # تخصيص الثيم (الألوان)
│   ├── composables/
│   │   └── layout/sideBar/        # قائمة الـ sidebar
│   └── pages/                     # صفحات المشروع
├── scripts/
│   └── sync-deps.js               # مزامنة الـ dependencies مع الـ base layer
├── nuxt.config.ts                 # extends: ['../my-base-layer']
├── package.json
└── pnpm-workspace.yaml
```

## مزامنة الـ Dependencies

> **📖 دليل Nuxt Layers الشامل:** لفهم متى ولماذا يجب تكرار الـ dependencies، وكل قواعد الوراثة حسب نوع اللير — راجع [docs/nuxt-layers-guide.md](../my-base-layer/docs/nuxt-layers-guide.md) في البيس لير

الـ dependencies من الـ base layer **لا تُورث تلقائياً** في Nuxt layers. لذلك يجب أن تكون موجودة في `package.json` بتاع المشروع.

عند تحديث أي dependency في الـ base layer، شغّل:

```bash
pnpm sync-deps    # يزامن الـ dependencies من الـ base layer
pnpm install      # ينزل أي تحديثات جديدة
```

الـ script بيعمل:
- إضافة أي dependency جديدة من الـ base layer
- تحديث الـ versions المختلفة
- الحفاظ على أي dependencies خاصة بالمشروع فقط

## Proxy Configuration

هذا المشروع يعتمد على الـ base layer للـ proxy. التخصيص يتم عبر:

- **`server/config/proxy.ts`** — قائمة الـ API prefixes المسموحة (blogs, projects, services, ...)
- **`proxyStaticPrefixes`** — موروث من الـ base layer (default: `/images`) — للملفات الثابتة

### التعامل مع الصور

```js
// في columns.js — تحويل مسار الصورة للـ proxy
const src = normalizeAvatarSrc(row.getValue('image'));
return h(UAvatar, { src, size: 'lg' });

// في form.js — عرض preview الصورة الحالية
imagePreview.value = normalizeAvatarSrc(data.image);
```

## إضافة Module جديد

اتبع هذا الباترن لإضافة أي module جديد (مثال: الموظفين):

### 1. Service

```js
// app/composables/services/employees.js
export const useEmployeesService = () => {
  const { get, create, update, remove, loading } = useBaseService();
  const BASE_URL = '/employees';
  const CACHE_KEY = 'employees';

  return {
    BASE_URL, CACHE_KEY,
    getAll: (options) => get(BASE_URL, options),
    create: (body, options) => create(BASE_URL, body, options),
    update: (id, body, options) => update(`${BASE_URL}/${id}`, body, options),
    remove: (id) => remove(`${BASE_URL}/${id}`),
    loading
  };
};
```

### 2. Module Composables

```
app/composables/modules/employees/
├── schema.js    # Zod 4 validation (استخدم `{ message: '...' }` لتخصيص رسالة الأخطاء)
├── form.js      # Reactive state + resetForm + prepareSubmitData
├── columns.js   # TanStack table columns
├── table.js     # CRUD operations + cache management
└── index.js     # Main composable (combines all above)
```

### 3. Components

```
app/components/modules/employees/
├── EmployeesForm.vue    # يستخدم BaseForm, BaseInput, BaseCard
└── EmployeesTable.vue   # يستخدم BaseTable
```

### 4. Page + Sidebar

```vue
<!-- app/pages/employees/index.vue -->
<script setup>
definePageMeta({ title: 'الموظفون' });
const { ... } = useEmployees();
</script>
```

أضف الرابط في `app/composables/layout/sideBar/index.js`.

## تغيير مرجع الـ Layer

للتبديل من مسار محلي إلى GitHub:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // من مسار محلي:
  extends: ['../my-base-layer'],

  // إلى GitHub (عام):
  // extends: ['github:username/my-base-layer'],

  // إلى GitHub (خاص):
  // extends: [['github:username/my-base-layer', { auth: process.env.GIGET_AUTH, install: true }]],
});
```

> عند التبديل لـ GitHub، الـ `sync-deps` مش هيشتغل لأنه بيقرأ من مسار محلي.
> في الحالة دي، حدّث الـ dependencies يدوياً أو انشر الـ base layer كـ npm package.


@Nuxt UI Reviewer review app/components/modules/blog/BlogForm.vue
@Nuxt UI Reviewer audit all components in app/components/modules/
@Nuxt UI Reviewer check UButton and UTable usage across the project