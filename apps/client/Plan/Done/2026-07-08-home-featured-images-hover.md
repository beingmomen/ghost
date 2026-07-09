# مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover (Client)

> 🔗 جزء من ميزة «مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover» بتشمل كمان: server و db.
> الملفات المرتبطة:
> - [../../server/Plan/2026-07-08-home-featured-images-hover.md](../../server/Plan/2026-07-08-home-featured-images-hover.md)
> - [../../db/Plan/2026-07-08-home-featured-images-hover.md](../../db/Plan/2026-07-08-home-featured-images-hover.md)

- **التاريخ:** 2026-07-08
- **المشروع:** apps/client (Nuxt 4 portfolio، عربي RTL، SSR)
- **الحالة العامة:** 🔒 مقفولة بعد المراجعة (جولتين نظاف: 5 و6) — جاهزة للتنفيذ

## نظرة عامة

جزء الـ client من الميزة فيه 3 أجزاء:
1. **إصلاح الصور المكسورة** — الـ 2 مشاريع اللي صورهم GIF بتكسر في `/projects` لأن الصفحة بتطلب `w_1152` (تكبير) وCloudinary بترفض GIF أكتر من ~800px. الحل: format-aware transform (gif→`w_800` بدون `f_auto`، ثابت→`w_1152`) + fallback للصورة المكسورة.
2. **الهوم يجيب المشاريع المميزة** من endpoint `/home-featured/populated` الجديد بدل أول 3 مشاريع، ولو رجع أقل من 3 الـ grid يتقلّص.
3. **توحيد الـ hover** — استخراج تعريف hover مشترك (zoom + سهم + تلوين أمبر) يطبّق على `/projects` (مع حفظ الـ layout الكبير) و`landing/Projects.vue`.

ترتيب التنفيذ: **server الأول** (endpoint `/home-featured/populated`)، بعدها الـ client (الجزء 2 معتمد عليه).

## الـ Scope

- **داخل الـ scope:**
  - helper `cloudinaryTransformFor(url, size)` + `isGif(url)` في `app/utils/cloudinary.ts`.
  - `app/utils/projectHover.ts` — تعريف hover مشترك (class strings + static scale map).
  - `app/components/common/ProjectImage.vue` — wrapper حوالين `NuxtImg` بـ `@error` → placeholder.
  - تطبيق على `app/pages/projects.vue` (transform + fallback + hover) و `app/components/landing/Projects.vue` (endpoint + transform + fallback + hover + empty branch).
- **خارج الـ scope:**
  - تغيير layout صفحة `/projects` (الكبير المتعرّج) أو layout الهوم (الـ thumbnail) — بنطبّق نفس التأثيرات بس.
  - server endpoints (في خطة الـ server).
  - إعادة رفع الصور (في خطة الـ db).
  - migration صفحات agents/skills/commands/mcp (متوقف — لا تقترحه).
  - skeletons/lazy loading للـ landing (block navigation عمدًا — لا تقترحه).

## المناطق المتأثرة في الكود

**ملفات جديدة:**
- `apps/client/app/utils/projectHover.ts` — `projectHover(opts?:{imageScale:'103'|'105'})` بيرجّع `{card, image, arrow}` strings. static class map للـ scale (`scale-[1.03]` / `scale-[1.05]` arbitrary — `scale-103` مش default Tailwind).
- `apps/client/app/components/common/ProjectImage.vue` — wrapper بـ `failed: ref(false)` + `@error` → placeholder SVG data URI (amber-tinted، متوافق مع DESIGN.md). props: `src, alt, width, height, loading, fetchpriority, imageClass`.

**ملفات معدّلة:**
- `apps/client/app/utils/cloudinary.ts` — أضف `isGif(url)` (parse extension قبل `?`) + `cloudinaryTransformFor(url, size)`: `'full'` → gif `'w_800'` / غير gif `'f_auto,q_auto,w_1152'`؛ `'thumb'` → gif `'w_192,h_128,c_fill'` / غير gif `'f_auto,q_auto,w_192,h_128,c_fill'`. `optimizeCloudinary` يفضل زي ما هو.
- `apps/client/app/pages/projects.vue` (السطر 14) — استبدل `'f_auto,q_auto,w_1152'` بـ `cloudinaryTransformFor(project.image, 'full')`. (السطور 147-157) استبدل `NuxtImg` بـ `ProjectImage`. (السطر 114 + الصورة) أضف `projectHover({imageScale:'103'})` على الـ `UPageCard` + الصورة + سهم `i-lucide-arrow-left`.
- `apps/client/app/components/landing/Projects.vue` (السطور 5-12) — استبدل `useAPI('/projects', {query:{isActive:true,limit:3}})` بـ `useAPI('/home-featured/populated', {key:'landing-projects'})`. (السطور 14-25) تبسيط الـ computed (شيل `slice(0,3)` — الـ endpoint بيرجّع ≤3) + استخدم `cloudinaryTransformFor(project.image, 'thumb')`. (السطر 40) أضف `v-else-if="!featuredProjects?.length"` → `LandingSectionFallback state="empty"`. (السطور 60/94/100) استبدل inline hover بـ `projectHover({imageScale:'105'})`. (السطور 86-96) استبدل `NuxtImg` بـ `ProjectImage`.

## الـ Edge cases

- **GIF بدون extension واضح:** `isGif` بترجع false → تستخدم `f_auto,q_auto,w_1152` → ممكن تكسر. الـ placeholder fallback بيشغل. مقبول (الـ backend بيرفع بصيغة معروفة).
- **URL مش Cloudinary:** `optimizeCloudinary` بترجعه as-is لو مفيهوش `/upload/`. آمن.
- **endpoint `/home-featured/populated` رجع فاضي `[]`:** `featuredProjects=[]` → `LandingSectionFallback state="empty"`.
- **endpoint رجع null/شبك خطأ:** `error.value` فعّال → `LandingSectionFallback state="error"` + retry (موجود).
- **endpoint رجع 1 أو 2:** الـ grid (`space-y-4`) بيتقلّص طبيعيًا.
- **hover على touch devices:** `group-hover` بيتفعل بعد tap. مقبول (مش ضروري `@media (hover:hover)`).
- **`scale-103` مش default Tailwind:** استخدم `scale-[1.03]` arbitrary (أو أضفه لـ `@theme` — الـ arbitrary أنظف).
- **الـ hover على `UPageCard`:** الـ `group` class لازم يوصل للـ wrapper اللي بيلف الأطفال عشان `group-hover:` يشتغل. تحقق إن `class="group"` بيوصل للمكوّن الصح.
- **عدم تطابق contract:** `/home-featured/populated` بيرجّع Project docs كاملة (بلا `.select()`) زي `/projects`، **باستثناء** إن `/projects` بيـ populate الـ `skills` virtual (`popOptions:['skills']`) و`/home-featured/populated` مش بيعمل nested populate ليها. كمان `tags` المشروحة هنا **مش موجودة** على الـ model (فيه `tag` مفرد + `skills` virtual) — وده pre-existing bug في الـ template (`project.tags` undefined في الحالتين → الـ badges ما بتظهرش، بس ما بتكسرش). مفيش regression (انحراف مقصود وموثّق في سجل المراجعة 🟡 جولة 1).

## معايير القبول

- [x] `/projects`: الـ GIF متركة، الـ JPG crisp، وURL مكسور → placeholder. — ✔️ **فحص بصري** (2026-07-09): الـ 4 صور مرفوعة 200 OK من Cloudinary — 2 GIF + 2 JPG، الصور ظهرت في الـ DOM. الـ `@error` fallback **ما اتأكدش بصريًا** (Cloudinary يحوّل الـ 404 لـ blur placeholder تلقائياً، فالـ raw `@error` نادر ما يتطلق). مفيش regression.
- [x] `/projects`: hover → zoom `scale-[1.03]` + سهم + تلوين أمبر. — ✔️ **فحص بصري**: `evaluate_script` أكّد `group` + `hover:border-primary/40 hover:bg-primary/5` + `group-hover:scale-[1.03]` مطبّقة على كرت Warraq.
- [x] الهوم: `useAPI('/home-featured/populated')` بيعرض المميزة بالترتيب. — ✔️ **فحص بصري**: الـ DOM فيه 3 مشاريع بالترتيب: ترابط → عصام فهمي → Warraq (مطابق `HomeFeatured.projects` array). الصور بـ `w_192,h_128,c_fill` (thumb).
- [x] الهوم: <3 → الـ grid يتقلّص؛ 0 → `LandingSectionFallback state="empty"`. — ✔️ **كود**: `v-else` empty branch مضاف (السطر 108-116). (سيناريو 0 محتاج DB فارغ — لسه مُرحَّل كتحقّق نهائي، لكن الكود موجود + الشرط صحيح.)
- [x] الهوم: hover بنفس التأثيرات (`scale-[1.05]` + سهم + تلوين). — ✔️ **فحص بصري**: classes مطبّقة — `group` + `hover:border-primary/40 hover:bg-primary/5` + `group-hover:scale-[1.05]` على كل كرت مميز.
- [x] `landing/Projects.vue` و `pages/projects.vue` بيستخدموا نفس `projectHover` و `ProjectImage` (مفيش تكرار). — ✔️ **تحقّق بالكود**: الاتنين بيستوردوا نفس الـ util + الـ component (تعريف واحد مشترك).
- [x] `pnpm typecheck` + `pnpm lint` + `pnpm build` بدون أخطاء. — ✔️ `lint` نظيف + `build` نجح (exit 0) + ملفاتي **صفر أخطاء typecheck**. ⚠️ typecheck المشروع فيه خطأين **pre-existing** في `useAPI.ts` (خارج الميزة، ملمستوش).
- [ ] مراجعة بصرية: المستخدم يشوف render الـ hover قبل الـ commit ويظبط الـ scale. — **مُرحَّل**: قياسات الـ `scale-[1.03]`/`[1.05]` شغّالة، لكن الإدراك البصري النهائي للزووم («مبالغ ولا تمام؟») قرار المستخدم. (المستخدم شغّال الكود حاليًا على `localhost:3000`.)

## الـ Dependencies والمخاطر

- **dependency رئيسي على server:** endpoint `/home-featured/populated` لازم يتعمل الأول (server M2). لو الـ client اشتغل قبله: `useAPI('/home-featured/populated')` هترجع 404 → `error.value` فعّال → `LandingSectionFallback state="error"` (آمن، مش crash، بس الـ feature مش هتشتغل).
- **contract match:** الـ endpoint لازم يرجّع نفس شكل `Project`. (مكتوب في خطة الـ server.)
- **`nuxt build` RAM:** ~4GB heap — شغّله لوحده بدون `apps/db` build بالتوازي (CLAUDE.md).
- **قيد بصري:** لا أوصي بتغيير بصري بدون رؤيته مرندرًا. التنفيذ بيعمل render والمستخدم يراجع الـ diff قبل الـ commit. لو الـ zoom على الصورة الكبيرة مبالغ فيه، نتسطّره (`scale-[1.02]` مثلاً).
- **block navigation:** الـ landing بستخدم SSR بدون lazy — ممنوع تقترح skeletons/lazy/loading states.

## القرارات المحسومة

- **Level 1+2 (client format-aware + fallback + server resize + إعادة رفع)** — السبب: قرار المستخدم (المصدر: مقابلة).
- **format-aware transform: gif→`w_800` (بدون f_auto)، ثابت→`w_1152`** — السبب: حد Cloudinary **50MP إجمالي pixels في كل الـ frames** (مش «حد 800px»): الـ GIF بـ `w_1152` بيوصل 84.35MP فيفشل (HTTP 400)، والكاب `w_800` بيوصله تحت 50MP (~40MP). `f_auto` مش الجاني (اتحقّق: `w_1152` بدون `f_auto` لسه 400)؛ شيله client-side للـ GIF no-op نظيف (المصدر: تشخيص فعلي بـ 4 curl variants في جولة 1).
- **`@error` fallback على NuxtImg عبر wrapper `ProjectImage`** — السبب: NuxtImg مفيهاش placeholder reliable للـ error state؛ `@error` native event أنظف (المصدر: code-architect).
- **`projectHover` utils (class strings مش composable) + static scale map** — السبب: الـ classes ثابتة مفيهاش reactive logic (المصدر: code-architect).
- **`scale-[1.03]` للـ /projects (صورة كبيرة) + `scale-[1.05]` للهوم (thumbnail)** — السبب: نفس التعريف المشترك بقيم configurable (المصدر: مقابلة + code-architect).
- **الهوم يجيب من `/home-featured/populated`** — السبب: endpoint populated + isActive-filtered بدل first-3 (المصدر: مقابلة + code-architect).
- **لو <3 → اعرض اللي موجود + empty branch لو 0** — السبب: قرار المستخدم (المصدر: مقابلة).
- **نفس تأثيرات الهوم على `/projects` مع حفظ الـ layout** — السبب: قرار المستخدم (المصدر: مقابلة).

---

## Milestones

### Milestone 1: utilities + ProjectImage component (executable check: typecheck)
- [x] عدّل `apps/client/app/utils/cloudinary.ts`: أضف `isGif(url)` + `cloudinaryTransformFor(url, 'full'|'thumb')`.
- [x] أنشئ `apps/client/app/utils/projectHover.ts`: `projectHover({imageScale})` بيرجّع `{card, image, arrow}` + static scale map (`scale-[1.03]`/`scale-[1.05]` arbitrary).
- [x] أنشئ `apps/client/app/components/common/ProjectImage.vue`: wrapper بـ `failed: ref(false)` + `@error` → placeholder SVG data URI (amber-tinted). props: `src, alt, width, height, loading, fetchpriority, imageClass`. (استخدمت `<script setup>` JS مطابقة لباقي المكوّنات + `computed(showImage)` عشان يغطّي src فاضي كمان.)

  **📌 تنبيه Naming (مُصحَّح بعد فحص بصري 2026-07-09):** Nuxt Component Scanner سمّى المكوّن **`CommonProjectImage`** في `components.d.ts` (لأنه في مجلد `common/`) — **مش** `ProjectImage`. النمط المعتمد في المشروع: `CommonSocialPart.vue` → `<CommonSocialPart>` (البادئة مُكرّرة لتطابق اسم المجلد). خانق: شِفت الـ `Failed to resolve component: ProjectImage` في الـ console لما اترفع على المتصفّح، فاستبدلت في القوالب بـ `<CommonProjectImage>`. السلوك النهائي مطابق، بس لو عُدنا لبرانش جديد اسم المكون الأفضل يبقى `CommonProjectImage.vue` (تكرار الـ prefix زي باقي المكوّنات) عشان يطابق النمط.
- [x] **executable check:** `pnpm typecheck` — ✔️ ملفاتي الـ3 (cloudinary.ts / projectHover.ts / ProjectImage.vue) **نظيفة** (vue-tsc ما بلّغش عنها أي خطأ). ⚠️ فيه خطأين TS **pre-existing** في `useAPI.ts:50-51` (من commit سابق `5c2b836`، خارج نطاق الميزة — `onResponseError` مش خيار `useAsyncData`) — **مش** من التنفيذ ده، و`nuxt build` مبيعملش typecheck فمش متأثر. (اتأكّد بـ `git diff` إن `useAPI.ts` ملمستوش.)
  **+ فحص بصري** (2026-07-09): فتحت المتصفّح على `localhost:3000/projects` + `localhost:3000/` — `<CommonProjectImage>` بيكحل صح، الـ 4 صور مرفوعة 200 OK من Cloudinary: 2 JPG بـ `f_auto,q_auto,w_1152` + 2 GIF بـ `w_800` بدون `f_auto` (مطابق للخطة). الـ hover classes مطبّقة: `group` + `hover:border-primary/40 hover:bg-primary/5` + `group-hover:scale-[1.03]` على `/projects` و`group-hover:scale-[1.05]` على الهوم.

### Milestone 2: تطبيق /projects (format-aware + fallback + hover)
- [x] `app/pages/projects.vue`: استبدل transform بـ `cloudinaryTransformFor(src, 'full')` (بعد حساب الـ `src` المطلق). استبدل `NuxtImg` بـ `ProjectImage` (بـ `:image-class` فيه `hover.image`). أضف `const hover = projectHover({imageScale:'103'})` + `hover.card` على الـ `UPageCard` + سهم `i-lucide-arrow-left` بـ `hover.arrow` في الـ footer.
- [x] **executable check:** ✔️ `pnpm lint` نظيف على `projects.vue`. ✔️ **فحص بصري** (2026-07-09): فتحت `localhost:3000/projects` — الـ 4 صور مرفوعة 200 OK، الـ `group-hover:scale-[1.03]` + `hover:border-primary/40` مطبّقين على الكروت. (الـ `typecheck` + `build` اتعملوا مجمّعين في M3.)

### Milestone 3: تطبيق landing/Projects (endpoint + transform + fallback + hover + empty)
- [x] `app/components/landing/Projects.vue`: استبدل endpoint بـ `useAPI('/home-featured/populated', {key:'landing-projects'})`. تبسيط الـ computed (شيل `slice(0,3)` — الـ endpoint بيرجّع ≤3) + `cloudinaryTransformFor(src, 'thumb')`. أضف empty branch `LandingSectionFallback v-else state="empty"`. استبدل `NuxtImg` بـ `ProjectImage`. استبدل inline hover بـ `projectHover({imageScale:'105'})` (card + image + arrow).
- [x] ~~`blocked` — محتاج server M2~~ — **اتحلّ:** server M2 (`/home-featured/populated`) اتبنى في نفس الجلسة قبل الـ client.
- [x] **executable check:** ✔️ `pnpm typecheck` — كل ملفاتي (بما فيهم `landing/Projects.vue`) صفر أخطاء (بس `useAPI.ts` الـ pre-existing). ✔️ `pnpm build` (SSR) نجح (exit 0، "Build complete!"). ✔️ `pnpm lint` نظيف. ✔️ **فحص بصري**: 3 مميزة + الترتيب + الـ hover classes مطبّقة (انظر M2 + M3 checks).