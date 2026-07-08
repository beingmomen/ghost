# مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover (Dashboard)

> 🔗 جزء من ميزة «مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover» بتشمل كمان: server و client.
> الملفات المرتبطة:
> - [../../server/Plan/2026-07-08-home-featured-images-hover.md](../../server/Plan/2026-07-08-home-featured-images-hover.md)
> - [../../client/Plan/2026-07-08-home-featured-images-hover.md](../../client/Plan/2026-07-08-home-featured-images-hover.md)

- **التاريخ:** 2026-07-08
- **المشروع:** apps/db (Nuxt 4 dashboard، بيمد my-base-layer)
- **الحالة العامة:** 🔒 مقفولة بعد المراجعة (جولتين نظاف: 5 و6) — جاهزة للتنفيذ

## نظرة عامة

جزء الـ dashboard من الميزة: موديول جديد `home-featured` (نمط `infos` — سجل إعدادات واحد) لاختيار وترتيب ≤3 مشاريع تظهر في الهوم، + إعادة رفع المشاريع الـ 4 الموجودة بعد ما الـ server يصلح resize الصور.

ترتيب التنفيذ: **server الأول** (لازم endpoints `/home-featured` + `/projects/all` fix يكونوا موجودين)، بعدها الـ db.

## الـ Scope

- **داخل الـ scope:**
  - موديول `home-featured` كامل (service + schema + form + actions + component + page) على نمط `infos`.
  - multi-select للمشاريع (max 3) + ordered list بـ up/down arrows للترتيب.
  - إضافة `/home-featured` لـ `allowedPrefixes` في الـ proxy + sidebar item.
  - إعادة رفع المشاريع الـ 4 الموجودة (2 GIF + 2 JPG) عبر flow تعديل المشاريع الموجود عشان يستفيدوا من resize الجديد.
- **خارج الـ scope:**
  - تعديل الـ server (في خطة الـ server) — الـ db بيعتمد عليه.
  - أي تغيير في صفحات `apps/client` (في خطة الـ client).
  - migration صفحات agents/skills/commands/mcp (متوقف بقرار المستخدم — لا تقترحه).

## المناطق المتأثرة في الكود

**ملفات جديدة (apps/db):**
- `apps/db/app/composables/services/homeFeatured.js` — wrap `useBaseService()`، `BASE_URL='/home-featured'`، `CACHE_KEY='home-featured'` (نسخة من `services/infos.js`).
- `apps/db/app/composables/modules/homeFeatured/schema.js` — Zod `projects: z.array(z.string()).max(3, {message:'حد أقصى 3 مشاريع'})` + `.refine(length<=3)`.
- `apps/db/app/composables/modules/homeFeatured/form.js` — `INITIAL_STATE={projects:[]}`، `populateForm`، `prepareSubmitData` (يرجع **JSON object** مش FormData — لا رفع ملفات)، `moveUp/moveDown/removeProject`.
- `apps/db/app/composables/modules/homeFeatured/actions.js` — `existingId`، `isEditing`، `loadExisting`، `handleSubmit` (create vs update)، `setProjectsList` (map لـ `{id, name, image, slug}`) (نسخة من `infos/actions.js` + `projects/actions.js` للـ setSkillsList).
- `apps/db/app/composables/modules/homeFeatured/index.js` — `useHomeFeaturedEdit()`.
- `apps/db/app/components/modules/homeFeatured/HomeFeaturedForm.vue` — `BaseCard` + `BaseForm` + `BaseSelect multiple` (value-key="id", label-key="name", items=projectsList) + ordered list بـ up/down/remove + `#actions`.
- `apps/db/app/pages/home-featured/index.vue` — `useAPI('/api/home-featured', {key, query:{limit:1}})` + `loadExisting(data[0])` + `useAPI('/api/projects/all', {key})` + `setProjectsList` + `provide('composable', ...)` (نسخة من `infos/index.vue`).

**ملفات معدّلة (apps/db):**
- `apps/db/server/config/proxy.ts` (السطر 2-16) — أضف `'/home-featured'` لـ `allowedPrefixes`. **بدونه الـ module مش هيشتغل.**
- `apps/db/app/composables/layout/sideBar/index.js` (السطر 13-30) — أضف `{ label:'مشاريع الهوم', icon:'i-lucide-star', to:'/home-featured' }` في مجموعة «المحتوى» بعد «المشاريع».

## الـ Edge cases

- **نسيان `/home-featured` في الـ proxy:** كل `useAPI('/api/home-featured')` هترجع 404. أول حاجة تتأكد منها قبل الـ UI.
- **`/projects/all` bug (dependency على server):** قبل إصلاحه (server M2)، الـ select هيرسم عناوين بس (لا صورة). الإصلاح في server M2 مطلوب عشان الـ ordered list يعرض صورة.
- **Empty state (لا سجل موجود):** الـ server `GET /` بيرجّع `{data:[doc]}` ولو مش موجود `[null]` — الـ page بتعمل `if (existing.value?.data?.[0]) loadExisting(...)` فبتتخطى → form فاضية + `isEditing=false` → زر «حفظ» → أول submit بيعمل create/upsert. متوافق مع نمط infos.
- **ترتيب الـ select:** `BaseSelect multiple` بيرجّع ids بترتيب الاختيار بس، مش reusable للترتيب. الـ ordered list بـ up/down هو الـ source of truth. لو deselect من الـ select، الـ list بينقص تلقائيًا (v-for على `state.projects`).
- **تجاوز 3 مشاريع:** Zod `.max(3)` بيكشف عند submit. التزم بالنمط (زي `ProjectsForm` ما بيعملش guard على `skillIds`) — Zod فقط.
- **`populateForm` بـ ids قديمة (مشروع اتمسح):** الـ ordered list هيرسم row بـ lookup fail. أضف fallback «مشروع محذوف» في الـ template لو الـ lookup رجع undefined.
- **`prepareSubmitData` JSON مش FormData:** الـ route ما فيهوش multer. لو استخدمت `toFormData` الـ backend مش هيقراه. رجّع object JSON مباشر — انحراف مقصود عن نمط `infos` (اللي فيه صور).

## معايير القبول

- صفحة `/home-featured` بتفتح، بتجيب السجل الحالي + قائمة كل المشاريع (بصورة + عنوان).
- الـ multi-select بيسمح باختيار ≤3 مشاريع؛ لو حاولت تختار رابع، Zod بيرفض عند submit برسالة «حد أقصى 3 مشاريع».
- الـ ordered list بـ up/down arrows بيغيّر ترتيب `state.projects`، والترتيب ده اللي بيتسجّل.
- submit بـ 3 مشاريع → `PATCH /api/home-featured` → toast success → reload بيحافظ على الاختيار والترتيب.
- submit بـ array فاضي → بيقبل (إخلاء الهوم).
- sidebar فيه «مشاريع الهوم» بـ icon star، بيودّي على `/home-featured`.
- `pnpm typecheck` و `pnpm build` (NUXT_IGNORE_LOCK=1) بيمشوا بدون أخطاء.
- بعد server M4: إعادة رفع الـ 4 مشاريع الموجودة عبر تعديلها → الصور الجديدة بـ dimensions الجديدة (1200×675 / 800 للـ GIF متحرّك).

## الـ Dependencies والمخاطر

- **dependency رئيسي على server:** endpoints `/home-featured` (M1+M2) + `/projects/all` fix (M2) لازم يتعملوا الأول. لو اشتغلت بالـ db قبلهم، الـ form هتظهر فاضية/بأخطاء (آمن، مش crash).
- **`prepareSubmitData` JSON vs FormData:** رجّع JSON مباشر، لا `toFormData` (لا multer على الـ route).
- **RAM عند `pnpm build`:** ~4GB heap — شغّله لوحده بدون client build بالتوازي (CLAUDE.md).
- **BaseSelect ما بيوفرش reorder:** الترتيب بـ ordered list منفصل بـ up/down arrows (متوافق مع الـ base layer، ما بطلبش مكوّن جديد).
- **الـ sidebar override:** `sideBar/index.js` بيـ shadow الـ layer — لو الـ layer أضاف items، لازم تعيد إضافتها يدويًا (مش مرتبط هنا).
- **migration constraint:** الـ module ده في `apps/db` لوحده، ما بيمسّش `apps/client` ولا صفحات الـ migration المتوقفة.

## القرارات المحسومة

- **نمط infos (single-record settings)** للموديول — السبب: سجل إعدادات واحد، مطابق للـ pattern المثبت (المصدر: مقابلة + code-architect).
- **`projects: [String]` ids في الـ form state + `value-key="id"` في BaseSelect** — السبب: مطابق لنمط `skillIds` في projects module (المصدر: code-architect).
- **الترتيب بـ ordered list + up/down arrows (مش drag)** — السبب: BaseSelect/USelectMenu ما بيوفرش reorder؛ أبسط طريقة متوافقة مع الـ base layer (المصدر: code-architect).
- **إعادة رفع المشاريع الموجودة عبر flow التعديل الموجود** — السبب: قرار المستخدم (Level 1+2)؛ الـ dashboard هو مكان الرفع (المصدر: مقابلة).
- **`prepareSubmitData` JSON مباشر (مش FormData)** — السبب: الـ route ما فيهوش multer (المصدر: code-architect).
- **`/projects/all` fix dependency على server** — السبب: الـ select محتاج صورة + slug (المصدر: code-architect).

---

## Milestones

### Milestone 1: wiring + module composables (executable check: typecheck)
- [ ] عدّل `apps/db/server/config/proxy.ts`: أضف `'/home-featured'` لـ `allowedPrefixes`.
- [ ] عدّل `apps/db/app/composables/layout/sideBar/index.js`: أضف sidebar item في مجموعة «المحتوى» بعد «المشاريع».
- [ ] أنشئ `apps/db/app/composables/services/homeFeatured.js` (نسخة من `services/infos.js` بتغيير URL/key).
- [ ] أنشئ `apps/db/app/composables/modules/homeFeatured/{schema,form,actions,index}.js` (schema بـ max-3، form بـ `prepareSubmitData` JSON + `moveUp/moveDown/removeProject`، actions بـ `loadExisting`/`handleSubmit`/`setProjectsList`).
- [ ] **executable check:** `cd apps/db && pnpm typecheck` (vue-tsc) — يتحقق من الـ auto-imports والـ schema types. لو فشل، أصلح قبل ما تكمل. `in-progress`

### Milestone 2: UI component + page (executable check: build)
- [ ] أنشئ `apps/db/app/components/modules/homeFeatured/HomeFeaturedForm.vue`: `BaseCard` (title="مشاريع الهوم المميزة" icon="i-lucide-star") + `BaseForm :schema :state :cols="1"` + `BaseSelect multiple` (value-key="id", label-key="name", items=projectsList) + `USeparator label="الترتيب"` + ordered list بـ up/down/remove + `#actions` (submit/cancel). أضف fallback «مشروع محذوف» لو lookup فشل.
- [ ] أنشئ `apps/db/app/pages/home-featured/index.vue`: `definePageMeta({title:'مشاريع الهوم'})` + `useAPI('/api/home-featured', {key, query:{limit:1}})` + `loadExisting(data[0])` + `useAPI('/api/projects/all', {key})` + `setProjectsList` + `provide('composable', ...)` + `<ModulesHomeFeaturedForm />`.
- [ ] **executable check:** `cd apps/db && pnpm typecheck` ثم `NUXT_IGNORE_LOCK=1 pnpm build` (full SSR lift check — لوحده بدون client build بالتوازي). `in-progress`
- [ ] تحقق يدوي: `pnpm dev:db` + افتح `/home-featured` → الـ select والـ ordered list بيظهروا، اختيار + ترتيب + submit يشتغل.

### Milestone 3: إعادة رفع المشاريع الموجودة (بعد server M4)
- [ ] `blocked` — السبب: محتاج server M4 (resize fix) يكون اتعمل و deployed.
- [ ] افتح كل مشروع من الـ 4 (Warraq، ترابط، عصام فهمي، دريم تي في) في `/projects/:id` (edit)، ارفع الصورة الأصلية تاني → حفظ. الصور الجديدة هتاخد resize الجديد (1200×675 للثابتة / 800 متحرّك للـ GIF).
- [ ] تحقق: افتح `/projects` في الـ client → الـ 4 صور بتظهروا (الـ GIFs متحركة، الـ JPGs crisp) وصفحة `/` → المشاريع المميزة بتظهر.