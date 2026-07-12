<div dir="rtl">

# تدقيق وتنظيف المحتوى — نطاق السيرفر (apps/server)

> 🔗 جزء من ميزة «تدقيق وتنظيف المحتوى» اللي بتمتد كمان على: **apps/client** و**apps/db**.
> الملفات المرتبطة:
> - ../../client/Plan/2026-07-09-content-accuracy-cleanup.md
> - ../../db/Plan/2026-07-09-content-accuracy-cleanup.md

- **التاريخ:** 2026-07-09
- **المشروع:** apps/server (Express.js + Mongoose/MongoDB)
- **الحالة العامة:** ✅ **مُنفَّذة** (2026-07-12، branch `feat/content-accuracy-cleanup`، بدون commit) ومنقولة لـ `Plan/Done/`. اتراجعت بـ `/my-audit` (2026-07-13) — الكود مطابق للخطة (lint + node --check + grep؛ قيام السيرفر و«الفحص أخضر» مُرحَّلين لوقت النشر لأن مفيش DB محلي). كانت 🔒 مقفولة بعد المراجعة.

## نظرة عامة

الهدف العام للميزة: كل المحتوى المعروض على الموقع يبقى **صادق ودقيق — بدون مبالغة ولا أرقام وهمية** — ويشجّع الزائر يتواصل (وظيفة أو فريلانس). نطاق السيرفر تحديداً بيغطّي ٣ حاجات:

1. **حواجز طول** على حقول الوصف (`Project.description` و`Blog.description`) عشان الداتا الجاية من الـ dashboard تفضل مضبوطة.
2. **حذف الكود/الداتا الميتة** (موديول `Service` بالكامل، حقل `Info.stats`، ومفتاحَي `services`/`skills` من payload الـ `/landing`).
3. **تحديث وثائق السيرفر** اللي هتبقى قديمة بعد الحذف.

## الـ Scope

- **داخل الـ scope:**
  - إضافة `minlength`/`maxlength` لـ `Project.description` (60–200) و`Blog.description` (60–160) عبر **٣ طبقات** (Mongoose schema + express-validator).
  - فحص الداتا الحالية إنها بتعدّي الحدود **قبل** التفعيل.
  - حذف موديول `Service` end-to-end (model + controller + routes + image service + validator + تسجيله في `app.js`).
  - حذف حقل `Info.stats` من الموديل ومن الـ `select` في `landingController`.
  - إزالة مفتاحَي `services` و`skills` من استجابة `/landing` (query + response keys).
  - تحديث `API_DOCUMENTATION.md` و`DATABASE_CONTENT.md` و`public/index.html`.
- **خارج الـ scope:**
  - **موديل `Skill` نفسه وراوتس `/api/v1/skills`** — دي **حيّة ومستخدمة** (في `Project.skillIds` والـ populated virtual والـ skill-picker في dashboard). بنشيل بس ظهورها في `/landing`.
  - راوت `GET /projects/:id` — بيفضل زي ما هو.
  - أي منطق أعمال تاني، أو التوصيات (Testimonials).

## المناطق المتأثرة في الكود

- `controllers/landingController.js` — إزالة `Service`/`Skill` requires + queries + مفاتيح `services`/`skills`، وإزالة `stats` من `Info.findOne().select(...)`.
- `models/projectModel.js` — إضافة `minlength:[60,…]` و`maxlength:[200,…]` على `description`.
- `models/blogModel.js` — إضافة `minlength:[60,…]` و`maxlength:[160,…]` على `description`.
- `middleware/validators/project.validator.js` — تعديل `isLength` من 10–1000 إلى 60–200 (قاعدتَي create وupdate).
- `middleware/validators/blog.validator.js` — تعديل `isLength` من 10–500 إلى 60–160 (قاعدتَي create وupdate).
- `models/infoModel.js` — حذف حقل `stats` الميت.
- `models/serviceModel.js`، `controllers/_serviceController.js`، `routes/serviceRoutes.js`، `imageServices/service.image.js`، `middleware/validators/service.validator.js` — **حذف**.
- `middleware/validators/index.js` — إزالة import الـ service + الـ exports بتاعته.
- `app.js` — إزالة `serviceRouter` (require + mount على `/api/v1/services`).
- `controllers/errorController.js` — (اختياري) وسم `ValidationError` كـ operational/400 في الإنتاج زي `CastError`.
- `API_DOCUMENTATION.md`، `DATABASE_CONTENT.md`، `public/index.html` — إزالة أقسام Service + تحديث حدود الوصف.

## الـ Edge cases

- **الداتا الموجودة أطول من الحد:** فحص تنفيذي فعلي (جولة مراجعة 1، 2026-07-09) على `/api/v1/projects` و`/api/v1/blogs` كشف: مشروع **«ورّاق» = 322 حرف** (فوق حد الـ200؛ الرقم اتحدّث من فحص سابق كان موثّق 467 — المحتوى اتغيّر من وقت التخطيط)، «ترابط» = 147 (سليم)، والمقالة الوحيدة المنشورة **«تحليل عميق لـ JavaScript Hoisting وتأثيره على الكود» = 206 حرف** (فوق حد الـ160 المقترح للمقالات — ده كان ناقص من الفحص الأصلي). لازم **الاتنين (ورّاق + المقالة) يتقصّروا من الـ dashboard قبل** تفعيل `minlength`/`maxlength`، وإلا أي حفظ لاحق ليهم هيفشل — حتى لو التعديل مالوش علاقة بالوصف نفسه (`handlerFactory.updateOne` بيستخدم `findByIdAndUpdate(..., {runValidators:true})` وفورمات الـ dashboard بتبعت الحالة كاملة عند أي حفظ).
- **`ValidationError` بيرجع 500 مبهم في الإنتاج:** `errorController.js` مابيعاملش `ValidationError` كـ operational (بيخصّص `CastError` بس)، فتجاوز الحد على مستوى Mongoose بيرجع «Something went wrong!» من غير رسالة حقل. عشان كده بنشدّ **طبقة express-validator كمان** (اللي بترجع 400 واضحة) مش الـ Mongoose بس.
- **مفيش DB محلي (Atlas إنتاج بس):** الفحص بيتعمل على المحتوى الحقيقي عبر API عام read-only (مفيش سكربت أو credentials).
- **التمييز الحرج Skill≠Service:** لازم يتأكّد في الكود إن `landing.skills` (قائمة `Skill` العليا) غير `Project.skills`/`skillIds` قبل أي حذف.

## معايير القبول

- [ ] `GET /api/v1/projects?fields=title,description&limit=100` و`/blogs?...` مفيش فيهم وصف < 60 أو > الحد (200/160) — الفحص أخضر. — **مُرحَّل: الفحص شغّال ورصد ورّاق=322 و Hoisting=206 (خارج الحد)؛ «أخضر» يتحقّق بعد تقصيرهم من الـ dashboard (runtime).**
- [ ] تجاوز الحد على أي حقل وصف بيرجّع **400 برسالة حقل واضحة** (مش 500). — **مُرحَّل: فحص وقت النشر (يحتاج طلب auth على سيرفر شغّال). الكود مطبَّق: express-validator (60–200/60–160) + errorController بيوسم ValidationError كـ 400 operational.**
- [x] `GET /api/v1/landing` مابيرجّعش مفتاح `services` ولا `skills`، ولسه بيرجّع `projects`/`info`/`experiences`/`faqs`/`testimonials`/`clients` سليمة. ✔️ الكود: الـ response object اتشال منه `services`/`skills` واحتفظ بـ testimonials/projects/projectsTotal/clients/info/experiences/faqs.
- [x] `GET /api/v1/services` بقى 404 (الراوت اتشال)، و`GET /api/v1/skills` **لسه شغّال** (Skill حيّة). ✔️ الكود: mount `/api/v1/services` اتشال من app.js؛ skillRouter + skillModel لم يُمسّا.
- [ ] `/projects` في الـ dashboard لسه بيفتح وبيعرض شارات الـ skills عادي (إثبات إن حذف Skill-في-landing ماكسرش حاجة). — **مُرحَّل: فحص بصري على الـ dashboard.**
- [x] السيرفر بيقوم من غير أخطاء، و`pnpm lint` أخضر، ومفيش `require` مكسور لموديول Service. ✔️ `pnpm lint` أخضر + `node --check` على كل الملفات المتغيّرة + grep = صفر مراجع Service. (قيام السيرفر الفعلي مُرحَّل — بيتّصل بـ Atlas إنتاج، مفيش DB محلي.)
- [x] وثائق السيرفر مافيهاش أي أثر لـ Service ولا لحدود الوصف القديمة. ✔️ اتشال قسم Services من API_DOCUMENTATION.md (+ TOC + مثال landing) و DATABASE_CONTENT.md (+ إعادة ترقيم) و public/index.html (4 مدخلات)؛ حدود الوصف اتحدّثت (60-200/60-160).

## الـ Dependencies والمخاطر

- **ترتيب النشر:** حذف موديول Service في السيرفر لازم **يسبق** حذف موديوله في الـ db (النشر مش ذرّي — كل app بينشر لوحده). الاتجاه ده بيفشل بأمان (الـ dashboard بيطلّع toast خطأ على صفحة رايحة تتشال أصلاً).
- **خطر كسر Skill:** لو اتعامل مع `Skill` زي `Service` بالغلط هتتكسر شارات المشاريع وفورم الـ dashboard. التخفيف: الحذف في `landingController` بس، والتأكيد بالاختبار.
- **إعادة البناء:** تغييرات الموديل بتتفعّل مع إعادة تشغيل السيرفر (PM2) — لا build خاص.

## القرارات المحسومة

<!-- سجل الحقيقة الحالية — أي جلسة لاحقة تقرأه قبل ما تقترح عكسه. -->

- **الأرقام تتصلّح للحقيقة** — «منذ 2021» بدل «+5 سنوات»، «شركتين» بدل «ثلاث»، حذف «+50 عميل» و«استشارة مجانية». السبب: هدف الصدق. (المصدر: مقابلة)
- **حدود الوصف: مشروع 60–200، مقال 60–160** — المقال متوافق مع مساحة الـ meta description المثلى. السبب: منع أوصاف مقتضبة/مبالغ فيها. (المصدر: مقابلة)
- **الحواجز على ٣ طبقات** (Mongoose + express-validator + Zod في db) تتحرّك مع بعض، والحد الأدنى في Zod (لأن `minlength` كـ HTML attribute غير فعّال في فورمات الـ db). السبب: منع 500 مبهم وتوحيد التحقق. (المصدر: مراجعة معمارية)
- **`Service` يتحذف بالكامل؛ `Skill` يتحذف من `/landing` فقط** — Skill حيّة (skillIds/virtual/dashboard picker). السبب: تجنّب كسر المشاريع. (المصدر: مراجعة معمارية)
- **`Info.stats` و`Info.resumeUrl`:** stats تتحذف (ميتة)؛ resumeUrl **يتبقى** (هيتستخدم في زرار CV في الـ client). السبب: resumeUrl مؤجّل-للاستخدام مش ميت. (المصدر: مقابلة)
- **الفحص قبل التفعيل** — تقصير «ورّاق» (322 حرف) **ومقال «تحليل عميق لـ JavaScript Hoisting» (206 حرف)** قبل تفعيل الحدود. السبب: تفعيل الحد على داتا أطول بيكسر الحفظ. (المصدر: فحص فعلي على API — تأكّد في جولة مراجعة 1، شمل المقالات كمان)
- **دليل الكتابة** بيتعمل في نطاق الـ client (`docs/CONTENT_GUIDELINES.md`) — السيرفر بيشير له بس. (المصدر: مقابلة)

---

## Milestones

### Milestone 1: الفحص القابل للتنفيذ + حدود الطول (يتعمل الأول)

- [x] تشغيل `curl "$BASE_URL/api/v1/projects?fields=title,description&limit=100"` و`.../blogs?...` وفلترة أي وصف طوله < 60 أو > الحد (200 للمشاريع، 160 للمقالات). ✔️ فحص تنفيذي على `api.beingmomen.com`: ورّاق=322 (>200)، ترابط=147، عصام=134، دريم=120، مقال Hoisting=206 (>160). الباقي داخل الحدود.
- [ ] لو فيه أي حقل خارج الحد (متأكَّد: «ورّاق» 322 حرف، ومقال «تحليل عميق لـ JavaScript Hoisting» 206 حرف) — يتقصّروا من فورمات الـ db الحالية (اللي لسه بدون قيد). ده **شرط** قبل أي تعديل schema. *(التقصير الفعلي مسجّل في خطة الـ db كمحتوى.)* — **مُرحَّل: runtime action على الـ dashboard (يعمله المستخدم قبل نشر حدود السيرفر).**
- [x] بعد ما الفحص يبقى أخضر: إضافة `minlength:[60,…]` + `maxlength:[200,…]` على `projectModel.description`.
- [x] إضافة `minlength:[60,…]` + `maxlength:[160,…]` على `blogModel.description`.
- [x] تعديل `project.validator.js` (60–200) و`blog.validator.js` (60–160) في قاعدتَي create/update — لازم تنزل مع تغيير الموديل.
- [x] (اختياري، مستحسن) تقوية `errorController.js` ليعامل `ValidationError` كـ 400 تشغيليّة.
- [ ] التحقق: طلب بوصف > الحد بيرجّع 400 برسالة حقل؛ وطلب سليم بيتحفظ. — **مُرحَّل: يحتاج طلب مُوثَّق (auth) على سيرفر شغّال — فحص وقت النشر.**

### Milestone 2: حذف الكود والداتا الميتة

- [x] إزالة حقل `stats` من `infoModel.js` + إزالته من `select` في `landingController.js`.
- [x] حذف موديول `Service` بالكامل: `serviceModel.js`، `_serviceController.js`، `serviceRoutes.js`، `service.image.js`، `service.validator.js`.
- [x] إزالة import/exports الـ service من `middleware/validators/index.js`، و`serviceRouter` (require + mount) من `app.js`.
- [x] إزالة query + مفتاح `services` **و** query + مفتاح `skills` من `landingController.js` — **مع إبقاء موديل/راوتس Skill سليمة**.
- [x] التحقق: `pnpm lint` أخضر + `node --check` على كل الملفات المتغيّرة + grep = صفر مراجع Service متبقّية. (قيام السيرفر + `/landing` + 404 مُرحَّلين لفحص وقت النشر — السيرفر بيتّصل بـ Atlas إنتاج، مفيش DB محلي.)

### Milestone 3: تحديث وثائق السيرفر

- [x] `API_DOCUMENTATION.md` — حذف قسم «Services» (+ TOC + مثال `/landing` + ذكر الصور) + تصحيح حد وصف Blog (10-500→60-160).
- [x] `DATABASE_CONTENT.md` — حذف قسم «Service Model» (+ إعادة ترقيم الأقسام) + تحديث صفوف حدود وصف Project (60-200) و Blog (60-160) + إشارة لـ `docs/CONTENT_GUIDELINES.md`.
- [x] `public/index.html` (المخدوم مباشرة على `GET /`) — إزالة المدخلات الأربعة الخاصة بـ Service (nav + endpoints config + exampleDocs + مثال `/landing`) + وصف endpoint الـ landing.

</div>
