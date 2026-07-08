# حذف الكود غير المستخدم — apps/db

> 🔗 جزء من ميزة «حذف الكود غير المستخدم» بتشمل كمان:
> [`../server/Plan/2026-07-07-remove-dead-code.md`](../../server/Plan/2026-07-07-remove-dead-code.md)
> و[`../client/Plan/2026-07-07-remove-dead-code.md`](../../client/Plan/2026-07-07-remove-dead-code.md)

- **التاريخ:** 2026-07-07
- **المشروع:** apps/db (Nuxt 4 dashboard، بيمدّ my-base-layer)
- **الحالة العامة:** منفّذة ✅ (2026-07-08) — 5/6 معايير متحقق منها تنفيذيًا؛ معيار typecheck مُرحَّل (pre-existing failure في الـ base layer خارج الـ scope).

## نظرة عامة

حذف دوال القراءة الميّتة في كل ملفات services — الصفحات بتنادي `useAPI()` مباشرة،
فتجاوزت دوال `getAll`/`getOne`/`getBySlug`/`getAllNoPagination`/`getRoadmap`. الـ base
layer (my-base-layer) مش بيستدعيها داخليًا (تم التحقق: الـ base `Table.vue` ب يستخدم
`getAllColumns()` بتاعة TanStack، مش service). دوال `create/update/patch/remove/loading`
**مستخدمة** فبتفضل.

## الـ Scope

- **داخل الـ scope:** حذف دوال القراءة الميّتة من 11 ملف service (`getAll`, `getOne`,
  `getBySlug`, `getAllNoPagination`, `getRoadmap`) + تحقق.
- **خارج الـ scope:**
  - `getAll` في `faqs.js` — **مستخدمة** فعليًا في `FaqsForm.vue:14` (بناء dropdown
    الاقتراحات). **لا تُحذف.**
  - `create`/`update`/`patch`/`remove`/`loading` في كل services — مستخدمة من `actions.js`
    و`table.js`. **لا تُلمس.**
  - `/users` prefix في `server/config/proxy.ts` — medium confidence، ممكن placeholder
    لموديول users مخطط → قرار منفصل (مش 100%).
  - `playwright.config.ts` + `@playwright/test` + `test:e2e` script — سكافولد بلا
    `tests/` → قرار (احذف كأداة ميّتة، أو اكتب tests). مش 100% ميّت بمعنى "ولا لازمة"
    (السكافولد نواة لـ tests مستقبلية).
  - `audit/dashboard-audit-2026-03-28-12-00.md` — gitignored، scratch محلي، مش كود →
    خارج.
  - مكوّنات/modules/composables التانية — كلها موصولة (تم التحقق). **لا تُلمس.**
  - الـ base layer نفسه — يخدم مستهلكين كتير، مش dead.

## المناطق المتأثرة في الكود

دوال الحذف لكل ملف service (`apps/db/app/composables/services/`):

| الملف | دوال تُحذف | دوال تُترك |
|---|---|---|
| `blogs.js` | `getAll`, `getOne`, `getBySlug` | `create`, `update`, `remove`, `loading` |
| `clients.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `contacts.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `projects.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `resources.js` | `getAll`, `getOne`, `getAllNoPagination` | `create`, `update`, `remove`, `loading` |
| `services.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `skills.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `testimonials.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `experiences.js` | `getAll`, `getOne` | `create`, `update`, `remove`, `loading` |
| `faqs.js` | `getOne` بس | `getAll` (مستخدمة!)، `create`, `update`, `remove`, `loading` |
| `roadmap.js` | `getRoadmap` | `loading` + specialized funcs (`createPhase`/`updatePhase`/`removePhase`/`reorderPhases`/`createWeek`/.../`updateSettings`) — مفيش generic `create`/`update`/`remove` |
| `infos.js` | `getAll` | `create`, `update`, `loading` (singleton — مفيش `remove`) |

- **لا يُلمس:** أي module composables (`modules/*/`)، أي component (`components/**`)
  بما فيها `components/layout/Sidebar.vue` (path-based override شرعي للـ base layer)،
  أي page، `server/config/proxy.ts` (باستثناء بند `/users` الخارج من الـ scope)، أي
  dependency في `package.json` (كلها مستخدمة إما هنا أو في الـ base layer عبر sync-deps).
- **ملاحظة:** `apps/db/app/utils/` مش موجود أصلاً (_UTILS بتيجي من الـ base layer).

## الـ Edge cases

- `faqs.js getAll` مستخدمة في `FaqsForm.vue:14` → **استثناء**، تُترك.
- لو فيه service method اسمها `getAll` مستخدمة في مكان تاني مخفي — تم التحقق بـ grep على
  كل `apps/db/app/**`: الـ hit الوحيد هو `FaqsForm.vue:14`. صفر non-faqs.
- الـ base layer ممكن يكون بيستدعي service methods داخليًا — تم التحقق: grep على
  `my-base-layer/app` لـ `\.(getAll|getOne|getBySlug)\(` رجع صفر (hit `Table.vue:104`
  هو `getAllColumns()` بتاعة TanStack، مش service).
- `Sidebar.vue` (override) مش ميّت — بيتستدعى من `my-base-layer/app/layouts/default.vue:7`
  كـ `<LayoutSidebar>`. **لا تُحذف.**
- مفيش tests directory → مفيش كود مستخدم بس في tests.

## معايير القبول

- [x] `pnpm lint` يمرّ بدون أخطاء جديدة. ✔️ `eslint app/composables/services/` exit 0 (الـ services اللي عدّلتها نضيفة). الـ 11 error الـ pre-existing في `FaqsTable.vue`/`InfosForm.vue`/`scripts/sync-deps.js` (ملفات ما لمستهاش) — تأكدت بـ stash إنهم موجودين على main النظيف بنفس العدد (ERROR_COUNT_ON_MAIN=11).
- [ ] `pnpm typecheck` (vue-tsc) يمرّ — بيكشف لو فيه call site نسيته. — **مُرحَّل:** typecheck فاشل **pre-existing** بخطأ واحد في الـ base layer `node_modules/.c12/.../useAPI.ts:4` (TS2769) — تأكدت بـ stash إنه موجود على main النظيف. خارج الـ scope (الـ base layer ما بيتلمسش). الحذف ماضافش أي error جديد. نية المعيار (كشف call site منسي) متحققة: grep رجع hit واحد بس (+ build مرّ).
- [x] `pnpm build` (مع `NODE_OPTIONS=--max-old-space-size=4096`) يمرّ بدون missing
      module/asset. ✔️ `BUILD_EXIT=0` — "✨ Build complete!" + nitro output كامل.
- [x] grep تحقّق نهائي: `grep -rn "\.getAll(\|\.getOne(\|\.getBySlug(\|\.getAllNoPagination(\|\.getRoadmap("
      apps/db/app` يرجع hit واحد بس: `FaqsForm.vue:14` (`useFaqsService().getAll`). ✔️ hit واحد بالظبط: `apps/db/app/components/modules/faqs/FaqsForm.vue:14: () => useFaqsService().getAll({ limit: 200 })`.
- [x] كل ملف service لسه بيصدّر `create`/`update`/`patch`/`remove`/`loading` (تأكد إن
      exports الـ actions ما اتلمستش). ✔️ diff بيظهر إن الـ action definitions (`create:`/`update:`/`remove:`/specialized funcs) ما اتلمستش؛ بس `get` اتشال من الـ destructuring (11 ملف) عشان ما يبقاش unused. `faqs.js` فضّل `get` (لأن `getAll` مستخدمة).
- [x] `git diff apps/db/app/composables/services/` بيظهر حذف دوال القراءة بس، ولا أي
      دالة `create`/`update`/`remove` اتلمست. ✔️ 23 سطر دالة قراءة محذوفة (getAll/getOne/getBySlug/getAllNoPagination/getRoadmap) + 11 سطر destructuring (إزالة `get` بس) — صفر action definitions اتلمست.

## الـ Dependencies والمخاطر

- **Dep:** مستقل عن server/client (الاتصال عبر HTTP للـ server بس).
- **Dep على الـ base layer:** الحذف ما بيلمس الـ base layer، بس الـ typecheck/build بيقرا
  الـ base layer via `extends`. لو الـ base layer فيه استدعاء لدالة محذوفة (مستحيل بعد
  التحقق) typecheck هيفشّه.
- **Risk — lockfile:** مفيش deps بتتلمس هنا → `pnpm-lock.yaml` ما هيتغيّرش بسبب db.
  (هيتغيّر بس بسبب حذف deps في server/client).
- **Risk — build RAM:** `pnpm build` محتاج ~4GB. **لا يشغّل build لـ db وclient في نفس
  الوقت** — sequential.

## القرارات المحسومة

- **نطاق الحذف = دوال القراءة الميّتة 100% بس** — السبب: طلب المستخدم، والتحقق أكّد
  صفر call sites (المصدر: مقابلة + استكشاف).
- **استثناء `faqs.js getAll`** — السبب: مستخدمة فعليًا في `FaqsForm.vue:14` (المصدر:
  استكشاف code-explorer).
- **`/users` proxy وplaywright سكافولد خارج الـ scope** — السبب: medium confidence /
  محتاجة قرار، مش 100% ميّت (المصدر: مقابلة).
- **معيار القبول = lint + typecheck + build** — السبب: typecheck بيكشف call site منسي，
  build بيأكد (المصدر: مقابلة).
- **3 branches منفصلة، بدون commit** — السبب: workflow المستخدم (المصدر: ذاكرة
  `feedback_git_workflow`).

---

## Milestones

### Milestone 1: حذف دوال القراءة الميّتة من services + تحقق فوري
- [x] حذف `getOne` من كل الـ services الـ 10 اللي بتعرّفه: `blogs.js`, `clients.js`,
      `contacts.js`, `projects.js`, `resources.js`, `services.js`, `skills.js`,
      `testimonials.js`, `experiences.js`, `faqs.js`.
- [x] حذف `getAll` من 10 services (كلها ما عدا `faqs.js`): `blogs.js`, `clients.js`,
      `contacts.js`, `projects.js`, `resources.js`, `services.js`, `skills.js`,
      `testimonials.js`, `experiences.js`, `infos.js`.
- [x] حذف `getBySlug` من `blogs.js`.
- [x] حذف `getAllNoPagination` من `resources.js`.
- [x] حذف `getRoadmap` من `roadmap.js`.
- [x] **تأكيد:** `faqs.js getAll` تُترك كما هي (مستخدمة في `FaqsForm.vue:14`).
- [x] تأكيد إن كل ملف لسه بيصدّر `create`/`update`/`patch`/`remove`/`loading`.
- [x] تشغيل `pnpm lint` (من `apps/db/`) — لازم يمرّ. ✔️ services نضيفة (exit 0)؛ 11 error pre-existing في ملفات ما لمستهاش.
- [ ] تشغيل `pnpm typecheck` — لازم يمرّ (يكشف أي call site منسي). — **مُرحَّل:** فاشل pre-existing في base layer `useAPI.ts:4` (خارج scope).
- [x] grep تحقّق نهائي: hit واحد بس (`FaqsForm.vue:14`). ✔️

### Milestone 2: build كامل
- [x] تشغيل `pnpm build` من `apps/db/` مع `NODE_OPTIONS=--max-old-space-size=4096`.
- [x] تأكيد إن الـ build خلص بدون missing module/asset. **لا يشغّل ده بالتوازي مع
      build الـ client** (RAM) — sequential. ✔️ BUILD_EXIT=0.