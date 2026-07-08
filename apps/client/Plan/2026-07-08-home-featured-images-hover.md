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
- **عدم تطابق contract:** لازم `/home-featured/populated` بيرجّع نفس شكل `Project` (`_id, title, description, image, url, tag, tags, altText`) زي `/projects` عشان الـ template ما يتكسرش.

## معايير القبول

- `/projects`: الـ 2 مشاريع الـ GIF صورهم بتظهر (متركة)، والـ 2 JPG بتظهر crisp. لو URL اتنكسر مستقبلاً → placeholder بيظهر بدل مساحة فاضية.
- `/projects`: hover على بطاقة → الصورة تعمل zoom (scale-[1.03]) + سهم يظهر + البطاقة تتلوّن بالأمبر — نفس لغة التفاعل بتاعة الهوم.
- الهوم: بيعمل `useAPI('/home-featured/populated')` ويعرض المشاريع المميزة بالترتيب اللي اتحدد من الـ dashboard.
- الهوم: لو المميزة <3 → الـ grid يتقلّص ويعرض اللي موجود بس. لو 0 → `LandingSectionFallback state="empty"`.
- الهوم: hover بنفس التأثيرات (scale-[1.05] للـ thumbnail صغير + سهم + تلوين).
- `landing/Projects.vue` و `pages/projects.vue` بيستخدموا نفس `projectHover` و `ProjectImage` (تعريف مشترك، مفيش تكرار).
- `pnpm typecheck` + `pnpm lint` + `pnpm build` بيمشوا بدون أخطاء.
- مراجعة بصرية: المستخدم يشوف render الـ hover قبل الـ commit ويظبط الـ scale لو الزووم طلع مبالغ فيه.

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
- [ ] عدّل `apps/client/app/utils/cloudinary.ts`: أضف `isGif(url)` + `cloudinaryTransformFor(url, 'full'|'thumb')`.
- [ ] أنشئ `apps/client/app/utils/projectHover.ts`: `projectHover({imageScale})` بيرجّع `{card, image, arrow}` + static scale map (`scale-[1.03]`/`scale-[1.05]` arbitrary).
- [ ] أنشئ `apps/client/app/components/common/ProjectImage.vue`: wrapper بـ `failed: ref(false)` + `@error` → placeholder SVG data URI (amber-tinted). props: `src, alt, width, height, loading, fetchpriority, imageClass`.
- [ ] **executable check:** `cd apps/client && pnpm typecheck` (vue-tsc) — يتحقق من signatures الـ helpers و props الـ component. `in-progress`

### Milestone 2: تطبيق /projects (format-aware + fallback + hover)
- [ ] `app/pages/projects.vue`: استبدل transform string بـ `cloudinaryTransformFor(project.image, 'full')` (السطر 14). استبدل `NuxtImg` بـ `ProjectImage` (السطور 147-157). أضف `projectHover({imageScale:'103'})` على الـ `UPageCard` + الصورة + سهم `i-lucide-arrow-left` (السطر 114+).
- [ ] **executable check:** `pnpm typecheck` + `pnpm lint` + `pnpm build` (SSR). ثم `pnpm dev` + مراجعة بصرية: الـ 2 GIF بيظهروا متركة، الـ 2 JPG crisp، hover شغّال، placeholder لو URL مكسور. `in-progress`

### Milestone 3: تطبيق landing/Projects (endpoint + transform + fallback + hover + empty)
- [ ] `app/components/landing/Projects.vue`: استبدل endpoint بـ `useAPI('/home-featured/populated', {key:'landing-projects'})` (السطور 5-12). تبسيط الـ computed (شيل `slice(0,3)`) + `cloudinaryTransformFor(project.image, 'thumb')` (السطور 14-25). أضف empty branch `LandingSectionFallback state="empty"` (السطر 40). استبدل `NuxtImg` بـ `ProjectImage` (السطور 86-96). استبدل inline hover بـ `projectHover({imageScale:'105'})` (السطور 60/94/100).
- [ ] `blocked` — السبب: محتاج server M2 (`/home-featured/populated`) يكون موجود.
- [ ] **executable check:** `pnpm typecheck` + `pnpm build`. ثم `pnpm dev` + مراجعة بصرية: الهوم بيعرض المشاريع المميزة بالترتيب، hover بنفس التأثيرات، لو <3 الـ grid يتقلّص، لو 0 → empty fallback. `in-progress`