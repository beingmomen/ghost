# إعادة هيكلة صفحة المشاريع — الحقول الجديدة (Server)

> 🔗 جزء من ميزة «إعادة هيكلة صفحة المشاريع» بتشمل كمان: db و client.
> الملفات المرتبطة:
> - [../../../db/Plan/Done/2026-08-19-projects-restructure.md](../../../db/Plan/Done/2026-08-19-projects-restructure.md)
> - [../../../client/Plan/Done/2026-08-19-projects-restructure.md](../../../client/Plan/Done/2026-08-19-projects-restructure.md)
>
> صفحتا دراسة الحالة (ورّاق وترابط) خطط منفصلة تعتمد على هذه الخطة (المسار + الحقول) بعد نزولها:
> - [../../../client/Plan/Done/2026-08-19-projects-warraq.md](../../../client/Plan/Done/2026-08-19-projects-warraq.md)
> - [../../../client/Plan/Done/2026-08-19-projects-tarabot.md](../../../client/Plan/Done/2026-08-19-projects-tarabot.md)

- **التاريخ:** 2026-08-19
- **المشروع:** apps/server (Express.js 4 + Mongoose/MongoDB، factory pattern)
- **الحالة العامة:** ✅ مُنفَّذ بالكامل ومنشور على الإنتاج (11 جولة، [سجل المراجعة](../../../client/Plan/Done/2026-08-19-projects-restructure.review-log.md))

## نظرة عامة

`/projects` دلوقتي قائمة مسطّحة واحدة. الهدف يبقى قسمين — «أعمال الإنتاج» و«مفتوح المصدر» — وكارت لكل مشروع إنتاج يقدر يودّي لصفحة تفاصيل داخلية (دراسة حالة) بدل اللينك الخارجي بس. جزء الـ server هو الأساس اللي باقي الخطتين (db، client) معتمدين عليه: **3 حقول اختيارية جديدة** على `Project`، بدون أي تعديل على الـ routes أو الـ controllers — الفلترة والترتيب عامة بالفعل عبر `apiFeatures.js` (نفس آلية `isActive` الحالية)، فأي حقل جديد قابل للفلترة/الترتيب من غير كود إضافي.

**ترتيب النشر (إلزامي، مُفصَّل في قسم المخاطر):** server (هنا) ← تأكيد إنه حيّ فعلاً ← db ← client، في pushes منفصلة.

## الـ Scope

**داخل الـ scope:**
- `models/projectModel.js` — 3 حقول جديدة: `detailSlug` (نص اختياري فريد)، `isProductionWork` (Boolean)، `productionOrder` (رقم).
- `middleware/validators/project.validator.js` — قواعد الحقول الجديدة في `createProjectRules` و`updateProjectRules`.
- **`controllers/_homeFeaturedController.js`** — إصلاح باج نسيان الـ nested populate لـ`skills` virtual (تفاصيل تحت). مش عن الحقول الجديدة، بس **إتمام** لالتزام خطة الكلاينت المرتبطة بإصلاح باج الوسوم الفاضية على السطحين — بدون الإصلاح ده، السطح التاني (الصفحة الرئيسية) مستحيل يتصلح مهما اتغيّر في الكلاينت.

**خارج الـ scope:**
- `routes/projectRoutes.js`, `controllers/_projectController.js` — **بدون أي تعديل**. الفلترة (`?isProductionWork=true`) والترتيب (`?sort=productionOrder`) بيشتغلوا من غير كود إضافي عبر `utils/apiFeatures.js` (نفس اللي بيخدم `?isActive=true` النهاردة من `apps/client/app/pages/projects.vue:7`).
- إصلاح باج `tags`/`skills` في كروت الكلاينت — الـ API فعلاً بيرجّع `skills` مليانة (اتحقق مباشرة من `GET https://api.beingmomen.com/api/v1/projects` وقت التخطيط: كل مشروع فيه `skills: [{title:...}]` صحيحة). الباج في الكلاينت بس (بيقرا `project.tags` اللي مش موجود في الاستجابة)، مفيش حاجة تتغيّر هنا. مسجّل في خطة الكلاينت.
- محتوى صفحات ورّاق وترابط — استاتيك بالكامل في `apps/client`، صفر تخزين في قاعدة البيانات.
- مسح مشروع «دريم تي في بلاير» — لسه موجود في القاعدة (`isActive: false`, اتحقق مباشرة من الـ API وقت التخطيط)، بس المسح فعل بيانات عبر زرار المسح الموجود فعلاً في `apps/db`، مش تعديل كود. مسجّل كبند في خطة الـ db.

## المناطق المتأثرة في الكود

**ملفات معدّلة (3):**

- **`models/projectModel.js`** — إضافة 3 حقول بعد `isActive` (السطور 57-60 الحالية):
  - `detailSlug`: `{ type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true, match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, 'detailSlug must be lowercase letters, numbers, and hyphens only'] }` — نفس أسلوب `title` (`unique: true, index: true`، السطور 7-13) زائد `sparse: true` لأنه هنا اختياري.
  - `isProductionWork`: `{ type: Boolean, default: false }` — بدون قاعدة validator صريحة، نفس معاملة `isActive` الحالية بالظبط (مفيهاش قاعدة في `project.validator.js` أصلاً، الـ Mongoose cast كافي).
  - `productionOrder`: `{ type: Number, default: 0 }` — نفس شكل `order` في `models/faqModel.js:21-24` حرفياً.
- **`controllers/_homeFeaturedController.js`** — `getHomeFeaturedPopulated` (السطور 17-21 الحالية) بتعمل `Model.findOne().populate({ path: 'projects', match: { isActive: true } })` — من غير nested populate لـ`skills`. `skills` **virtual populate** على `Project` (`projectModel.js:143-149`)، وvirtual populates عمرها ما بتتحل تلقائياً — محتاجة `populate` متداخل صريح. **التصحيح:** `populate({ path: 'projects', match: { isActive: true }, populate: [{ path: 'skills' }] })`.
- **`middleware/validators/project.validator.js`** — قاعدة لـ `detailSlug`: **بالحرف** `.optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }).withMessage('detailSlug must be between 2 and 50 characters.').matches(/^[a-z0-9]+(-[a-z0-9]+)*$/).withMessage('detailSlug must be lowercase letters, numbers, and hyphens only.')` — نفس الـ regex المستخدَم في الموديل بالضبط (لازم يتطابقوا حرفياً، وإلا قيمة تعدّي الـ validator وترفضها الـ model، أو العكس، وتكسر معيار القبول "رفض نضيف 400 مش 500"). ⛔ **مش** `.isSlug()` — الدالة المدمجة دي بتقبل حروف كبيرة وunderscore وأنماط أوسع من الـ regex المطلوب هنا، فبتفتح فجوة بين الطبقتين. وقاعدة خفيفة لـ `productionOrder` (`.optional()` عادية + رقم صحيح — مفيش قيد `unique` عليه فمفيش داعي لحماية الفاضي الخاصة) في الاتنين `createProjectRules` و`updateProjectRules`. `isProductionWork` من غير قاعدة (يتبع نفس غياب قاعدة `isActive`).
  > ⚠️ **تصحيح وقت التنفيذ (مُتحقَّق live ضد الـ Atlas الحقيقي، مش نظري):** `.optional({ values: 'falsy' })` بعد `.customSanitizer()` **بيمنع الـ sanitizer نفسه من الشغل خالص** — `optional()` في express-validator 7.3.2 مش خطوة موضعية في السلسلة، هو flag عام على الحقل بيتفحص ضد القيمة **الخام الحالية وقت كل خطوة**، فلما القيمة الخام لسه `''` (قبل ما الـ sanitizer يلمسها)، الفحص `values:'falsy'` بيعتبرها "غايبة" ويـ skip كل حاجة — **بما فيها الـ sanitizer نفسه**. النتيجة الفعلية (مُتحقَّقة بطلب `PATCH` حي): `detailSlug: ''` بيتخزّن حرفياً زي ما هو، بالظبط الباج اللي القاعدة العامة فوق بتحذّر منه. **الإصلاح المُتحقَّق (4 حالات، سكريبت مباشر ضد `express-validator@7.3.2` المثبت):** استبدال `.optional({ values: 'falsy' })` بـ `.optional()` العادية (فحص `undefined` الافتراضي) — بما إن الـ sanitizer بيحوّل `''` لـ `undefined` **قبل** ما `optional()` يتفحص في التكرار التاني، الفحص الافتراضي (`undefined`) بيمسك الحالة دي صح. الأربع حالات اتفحصت مباشرة: `''` → sanitized لـ undefined، غايب تماماً من الـ payload ✅ / غايب أصلاً → يفضل غايب ✅ / قيمة صحيحة (`'warraq'`) → تعدي زي ما هي ✅ / صيغة غلط (`'Warraq X'`) → مرفوضة 400 ✅. **السلسلة النهائية الفعلية:** `.customSanitizer(v => (v === '' ? undefined : v)).optional().trim().isLength(...).matches(...)`.

## الـ Edge cases

- **🔴 مبدأ عام: أي حقل نصي اختياري عليه unique index لازم يطبّع الفاضي لـ"غايب تماماً"، مش بس يتخطى فحص الصيغة.** ده نفس فئة الباج اللي حصل فعلاً مع حقل `phone` في `contactModel.js` (موثّق ومُنفَّذ في `apps/server/Plan/Done/2026-08-16-portfolio-repositioning-quick-wins.md`) — بفارق إن هناك الحقل مش `unique`. هنا الخطورة أكبر: لو `detailSlug` وصل السيرفر كسلسلة فاضية (`''`) وسُمح لها تتخزّن حرفياً، أول مشروعين من غير `detailSlug` هيتصادموا على قيد الـ `unique` (الـ sparse index بيستثني القيم **الغايبة تماماً** بس، مش القيم الفاضية الموجودة فعلياً كحقل).
  ⚠️ **تصحيح مهم (جولة مراجعة 6):** الوصف الأصلي هنا زعم إن `.optional({values:'falsy'})` + `match:` "كافيين" — ده غلط جزئياً. الاتنين دول بيمنعوا **الرفض** (400) بس، مش بيمنعوا **التخزين الحرفي**. لو `detailSlug: ''` وصلت **صراحةً** (مش غايبة، حالة واقعية جداً هنا لأن طريقة الفحص الوحيدة في هذا المشروع هي curl/Postman يدوي — قرار مستخدم سابق 2026-08-05) هي بتعدّي الطبقتين وتتخزّن حرفياً كقيمة حقيقية في المستند، وتتصادم مع ثاني مستند فاضي بالضبط زي الخطر الموصوف فوق — بس بـ **500 عامة** (مش 400) لأن `errorController.js` مبيحوّلش `E11000` لـ 400 صراحةً. الحل الكامل ثلاثة أجزاء:
  1. **`.customSanitizer(v => (v === '' ? undefined : v))`** — **قبل** أي حاجة تانية في السلسلة. الفرق الحاسم عن `.optional()`: الـ sanitizer بيعيد كتابة `req.body` فعلياً (متحقَّق من `express-validator/lib/chain/context-runner-impl.js:52-54`)، يعني `''` بتتحول لـ `undefined` **قبل** ما توصل Mongoose خالص — مش بس "تتخطى فحص"، بل "تتحوّل لغايبة فعلاً".
  2. **`.optional({ values: 'falsy' })`** — **مش** `.optional()` العادية (بتتخطى `undefined` بس) **ومش** `.optional({ checkFalsy: true })` (الأخيرة `@deprecated` في express-validator **7.3.2** المثبت فعلياً هنا — نفس النسخة المستخدمة في إصلاح `phone` — والاسم البديل غير المُهمَل فيها هو `values: 'falsy'`). دفاع إضافي بعد الـ sanitizer، مش بديل عنه.
  3. **الـ model:** استخدم `match:` (schema type)، مش `minlength`/`maxlength` ومش `validate:` function مخصّصة. مُتحقَّق مباشرة من `node_modules/mongoose/lib/schema/string.js:547` في هذا الريبو: الـ `match` validator بيرجّع `true` تلقائياً لأي قيمة `null`/`undefined`/`''`. دفاع أخير لو أي مسار كتابة تاني (مش عبر الـ validator middleware) وصل يوماً ما.
  - **التلاتة مع بعض، مش واحد بس** — الـ sanitizer هو اللي بيحقق "غايب تماماً" فعلياً؛ الاتنين الباقيين حماية إضافية لو الترتيب اتغيّر أو مسار كتابة تاني اتضاف مستقبلاً.
- **🔴 القيد الفريد (`unique + sparse`) لازم ينزل في نفس اللحظة اللي الحقل بينضاف فيها، مش على مرحلتين.** فخ موثّق سابقاً بالتفصيل في `apps/server/Plan/2026-07-14-project-role-and-tools.md` (قسم المخاطر، حقل `enSlug`): لو حقل جديد اتضاف الأول من غير `unique` وبعدين اتحوّل لـ `unique` في تعديل لاحق، اسم الـ index التلقائي (`detailSlug_1`) بيتكرر بنفس الاسم وoptions مختلفة، MongoDB **مبيغيّرش القيد الموجود ولا يعيد إنشاءه**، وMongoose **بيبلع الخطأ ده بصمت تماماً** (مفيش log، مفيش crash). النتيجة: قيد `unique` مش موجود فعلياً ومحدش واخد باله. بما إن `detailSlug` حقل جديد كل الأول (صفر index سابق باسمه)، إضافته بـ `unique: true, sparse: true` من أول لحظة **آمنة** — بس **ممنوع** الفصل لمرحلتين في أي تعديل مستقبلي على نفس الحقل.
- **مفيش `autoIndex: false`** في `server.js` — القيد بيتبني فعلياً عند كل `mongoose.connect` (كل PM2 restart)، يعني تعديل الموديل لوحده (من غير نزول فعلي على الـ VPS) مبيبنيش القيد. الفحص القاطع تحت لازم يتعمل بعد تأكيد إن الكود نزل فعلاً، مش بعد `git push` بس.
- **`productionOrder` مفيهوش قيد تفرّد** — ترتيبين بنفس الرقم مقبول (تعادل بترتيب الإدراج)، مفيش داعي لقيد إضافي على حقل عرض بحت.
- **🟠 باج الوسوم الفاضية على الصفحة الرئيسية سببه مختلف تماماً عن `/projects` — إصلاح الكلاينت وحده (تسمية الحقل `tags`→`skills`) مش كافي.** `/projects` بيستخدم `GET /projects`، اللي بيعمل populate مباشر لـ`skills` (`_projectController.js`، `popOptions: ['skills']`) — البيانات فعلاً موجودة في الاستجابة، فتصحيح اسم الحقل في الكلاينت كافي هناك. الصفحة الرئيسية بتستخدم `GET /home-featured/populated` — endpoint مختلف تماماً، بيعمل populate لمصفوفة `projects` بس **من غير** nested populate لـ`skills` جوّه كل مشروع. **مُتحقَّق مباشرة من استجابة حية وقت المراجعة:** كل مشروع في `/home-featured/populated` عنده `skillIds` (الخام) بس **بدون أي `skills` خالص** — مش فاضية، غايبة تماماً. يعني حتى لو الكلاينت اتصحح لقراءة `project.skills`، القيمة هتفضل `undefined` على الصفحة الرئيسية تحديداً، ومعيار قبول خطة الكلاينت (الوسوم تظهر في الصفحتين) مستحيل يتحقق من غير هذا الإصلاح. **ملاحظة:** نفس الباج بالحرف كان موثّق ومُخطَّط له في `apps/server/Plan/2026-07-14-project-role-and-tools.md` (Milestone 1)، بس الخطة دي عمرها ما اتنفذت — الباج لسه حي.
- **مشروع بدون `isProductionWork` أصلاً (مشاريع قديمة قبل هذه الخطة)** — الـ `default: false` بيغطّيها تلقائياً، مش هتظهر في «أعمال الإنتاج» لحد ما حد يفعّلها من الداشبورد عمداً. هيك نفس فلسفة "إظهار مقصود" اللي طلبها صاحب الموقع، مش "أي isActive:true بيظهر تلقائي".

## معايير القبول

- [x] ✔️ `POST /projects` بمشروع كامل **من غير** `detailSlug` (الحقل متبعتش أصلاً) → **201** بنجاح، والمستند المُنشأ من غير `detailSlug` خالص (مش `''`). فُحص live (سيرفر محلي على نفس Atlas الإنتاج): مشروعين تجريبيين اتعملوا بدون الحقل، الاتنين 201، صفر `detailSlug` في الاستجابة.
- [x] ✔️ تعديل (`PATCH`) على مشروعين مختلفين، الاتنين من غير `detailSlug` → **الاتنين ينجحوا** بدون تصادم `E11000`. فُحص live: PATCH على مشروعين مختلفين بدون الحقل، الاتنين 200 بنجاح.
- [x] ✔️ `PATCH` بـ `detailSlug: ""` **صراحةً** على مشروعين مختلفين → **الاتنين ينجحوا بدون تصادم**، والمستند المُحدَّث من غير `detailSlug` خالص. **فُحص live واكتشف باج حقيقي** في السلسلة الأصلية (`.optional({values:'falsy'})` كان بيمنع الـ `customSanitizer` من الشغل خالص — راجع التصحيح في "المناطق المتأثرة" فوق) — اتصلح لـ `.optional()` عادية، واتأكد بعد الإصلاح: مشروعين تجريبيين جداد، الاتنين نجحوا 200، صفر `detailSlug` مخزّن.
- [x] ✔️ `POST /projects` بمشروع كامل بـ `detailSlug: ""` **صراحةً** على مشروعين مختلفين → **الاتنين ينجحوا بدون تصادم**. فُحص live بعد نفس الإصلاح: مشروعين جداد بـ `detailSlug=''` صريحة في الـ multipart body، الاتنين 201، صفر `detailSlug` مخزّن.
- [x] ✔️ `POST`/`PATCH` بـ `detailSlug: 'warraq'`-مثل (حروف صغيرة، بدون مسافات) → ينجح، والقيمة تترجع كما هي. فُحص live بقيمة `'test-detail-slug'` — رجعت كما هي في استجابة الـ PATCH.
- [x] ✔️ `POST`/`PATCH` بـ `detailSlug` يحتوي حرف كبير أو مسافة (`'Test Slug X'`) → **رفض** برسالة واضحة (400)، مش 500. فُحص live: `400` بالظبط مع رسالة `detailSlug must be lowercase letters, numbers, and hyphens only.`
- [x] ✔️ `POST`/`PATCH` بـ `detailSlug` مكرر (نفس القيمة على مشروعين) → **رفض**. فُحص live: تاني مشروع بنفس القيمة (`'test-detail-slug'`) رجع رفض (500 — خطأ E11000 خام، `errorController.js` مبيحوّلهوش لـ 400 صراحةً، سلوك موثّق ومقبول مسبقاً في الخطة، مش جزء من معيار القبول ده).
- [x] ✔️ `db.projects.getIndexes()` على قاعدة `beingmomen` (مش `beingmomen-demo`) تُظهر `{ name: 'detailSlug_1', unique: true, sparse: true }`. **مُتحقَّق مباشرة على الـ Atlas الحقيقي** (الاتصال المحلي بيشاور على نفس قاعدة `beingmomen` اللي `.env` الحيّ بيشاور عليها؛ الـ index بيتبني عند أي `mongoose.connect` بنفس السكيما، بصرف النظر مين اتصل — لسه بيتطلب push فعلي للسيرفر عشان **كود** الـ VPS الحيّ (مش الـ DB) يبقى محدَّث).
- [x] ✔️ `POST`/`PATCH` بـ `isProductionWork: true` و`productionOrder: 1` → ينجحوا ويترجعوا صح. فُحص live: PATCH نجح، `isProductionWork:true`، `productionOrder:1` في الاستجابة.
- [x] ✔️ `GET /projects?isProductionWork=true&sort=productionOrder` يرجّع بس المشاريع المفعّلة، مرتبة تصاعدياً — **بدون أي تعديل كود إضافي**. فُحص live: نتيجة واحدة بالظبط (المشروع اللي اتفعّل)، صفر كود إضافي.
- [x] ✔️ مشروع قديم (من قبل هذه الخطة) بدون `isProductionWork` أصلاً → `isProductionWork: false` تلقائياً. فُحص live على مشروعي "Warraq" و"ترابط" الحقيقيين (سابقين لهذه الخطة): الاتنين `isProductionWork: false`, `productionOrder: 0`, `detailSlug: null` — الـ default شغال على مستندات قديمة فعلاً.
- [x] ✔️ `GET /home-featured/populated` بترجع `skills` مليانة (مش `undefined`) لكل مشروع. فُحص live على الـ singleton الحقيقي: كل مشروع (Warraq، ترابط) رجع `skills: [{_id, title}, ...]` مليانة بدل غايبة.

## الـ Dependencies والمخاطر

- 🔴 **مفيش DB محلي — Atlas إنتاج بس** (نفس القيد المسجّل في `apps/server/CLAUDE.md` والخطة القديمة `2026-07-14-project-role-and-tools.md`). كل تغيير سكيما بيتفحص على الإنتاج مباشرة وقت النزول.
- 🔴 **لازم ينزل ويتأكد حيّ فعلاً قبل db وقبل client.** خطة الـ db بتضيف حقول فورم تبعت `detailSlug`/`isProductionWork`/`productionOrder`. Mongoose (`strict` الافتراضي) بيتجاهل أي حقل مش معرّف في السكيما **بصمت** (مش error) — لو السيرفر لسه بالكود القديم وقت ما الفورم تبعت، الحفظ هيبان ناجح بينما القيم الجديدة مش بتتخزن فعلاً. **الفحص القاطع إن الكود حيّ**: `POST /projects` بـ `detailSlug` صالح لازم يرجّع نفس القيمة في الاستجابة، مش يختفي.
- ⚠️ **الديبلوي انتقائي**: `apps/server/**` بيعمل PM2 restart للسيرفر بس (بورت 3001). المسار المتوقع: commit بيلمس `apps/server/**` بس، push لوحده، تأكيد حي، بعدين الانتقال لخطة الـ db.
- ⚠️ **مفيش test framework** في `apps/server` — الفحوص كلها يدوية بطلبات حقيقية (curl/Postman)، مفيش سكريبت اختبار آلي (قرار مستخدم سابق 2026-08-05).

## القرارات المحسومة

- **`detailSlug` حقل سكيما حقيقي في `apps/server`، مش جدول مطابقة في الكلاينت** — البديل (مطابقة على `title`) كان بيكسر بصمت عند أي تعديل على العنوان الحرفي (اللينك الخارجي يفضل شغال، بينما الصفحة الداخلية تفضل موجودة ومحدش يوصلها). القاعدة الأصلية في مسودة الخطة ("ممنوع أي سكيما... لمحتوى الصفحات دي") بتخص **محتوى** الصفحة (المشكلة/القرار/النتيجة — استاتيك في `.md`/`.vue` زي ما هي)، مش **وجود** الصفحة من عدمه — وده خاصية من خصائص المشروع، مكانها الطبيعي مع باقي بياناته. (المصدر: مقابلة — قرار مستخدم صريح يراجع نطاق قاعدة المسودة الأصلية)
- **`isProductionWork` + `productionOrder`، مش `productionFeatured`** — أي اسم فيه "featured" هيتلخبط مع موديل `HomeFeatured` القايم فعلاً (تجميعة يدوية منفصلة تماماً لأبرز مشاريع الصفحة الرئيسية). `isProductionWork` معناه "شغل إنتاج لعميل" (تصنيف نوع)، `HomeFeatured` معناها "مختار للرئيسية" (تجميعة يدوية) — مفهومان مختلفان تماماً. (المصدر: مقابلة)
- **إظهار قسم «أعمال الإنتاج» مقصود عبر حقل صريح، مش استنتاج من `isActive`** — "أي مشروع `isActive:true` بيظهر تلقائي" مخاطرة لا ميزة (نفس السبب اللي «دريم تي في بلاير» كان لازم يتعطّل يدوياً بسببه). القسم بيعرض بس اللي `isProductionWork:true`، والترتيب محكوم بـ`productionOrder` من الداشبورد. (المصدر: مقابلة)
- **موقع عصام فهمي: `isProductionWork:true` دائم، `productionOrder:3`، بدون `detailSlug` أبداً** — قرار نهائي دائم (دراسة حالة عن موقع تعريفي هتطلع رفيعة)، **مش** حالة مؤقتة تُخفى لحد ما تجهز. (المصدر: مقابلة — تصحيح مباشر لاقتراح سابق بإخفائه مؤقتاً)
- **ورّاق وترابط: `detailSlug` يفضل فاضي في هذه الخطة، يتملى لاحقاً من الداشبورد لما صفحاتهم تجهز** — بدون أي نزول إضافي من `apps/server`. القيمتين النهائيتين (`warraq`, `tarabot`) موثّقتين في خطتي الكلاينت المرتبطتين. (المصدر: مقابلة)
- **الفلترة/الترتيب على الحقلين الجديدين بدون أي تعديل على `routes`/`controllers`** — `utils/apiFeatures.js` عام بالكامل، أي حقل في السكيما قابل للفلترة عبر query param بصفر كود إضافي (نفس آلية `isActive` القائمة). (المصدر: قراءة كود مباشرة)

---

## Milestones

### Milestone 1: الحقول الثلاثة + الـ validators
- [x] `models/projectModel.js` — أضف `detailSlug` بعد `isActive`: `{ type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true, match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, 'detailSlug must be lowercase letters, numbers, and hyphens only'] }`
- [x] `models/projectModel.js` — أضف `isProductionWork: { type: Boolean, default: false }`
- [x] `models/projectModel.js` — أضف `productionOrder: { type: Number, default: 0 }`
- [x] `controllers/_homeFeaturedController.js` — `getHomeFeaturedPopulated`: وسّع الـ populate لـ `{ path: 'projects', match: { isActive: true }, populate: [{ path: 'skills' }] }` (إصلاح باج مستقل عن الحقول الثلاثة — راجع Edge cases)
- [x] `middleware/validators/project.validator.js` — `createProjectRules` و`updateProjectRules`: أضف لكل واحدة قاعدة لـ `detailSlug` و`productionOrder`. ⚠️ **السلسلة الفعلية المطبَّقة تختلف عن النص الحرفي الأصلي هنا** — `.optional({values:'falsy'})` كانت بتمنع الـ `customSanitizer` من الشغل خالص (باج مُتحقَّق live، مش نظري — راجع تفصيله في "المناطق المتأثرة" وقسم معايير القبول). السلسلة الصح المطبَّقة: `.customSanitizer(v => (v === '' ? undefined : v)).optional().trim().isLength(...).matches(...)`. `isProductionWork` بدون قاعدة صريحة (يتبع معاملة `isActive` الحالية).
- [x] فحص يدوي: كل معايير القبول أعلاه المتعلقة بالـ API — اتعملت بسيرفر محلي متصل بنفس Atlas الإنتاج (`beingmomen`)، بمشاريع تجريبية اتمسحت بعد الفحص. كل البنود ✔️ (تفاصيل الأدلة في قسم معايير القبول فوق).
- [x] مراجعة كود مستقلة (3 `code-reviewer` عبر عدسات bugs/conventions/simplicity) على الـ diff — 3 اكتشافات حقيقية (ثقة ≥80)، اتصلحوا وأُعيد الفحص live:
  1. **🐛 bugs (ثقة 80):** الـ `customSanitizer` بيطبّع `''` بس، مش `null` — لو `detailSlug: null` وصلت صراحةً (curl/Postman مباشر)، كانت بتعدّي كـ"مش غايبة" وترفض بخطأين مربكين بدل ما تتعامل كغايبة زي `''`. **اتصلح:** `v => (v === '' || v == null ? undefined : v)`. فُحص live بعد الإصلاح: `PATCH` بـ `detailSlug: null` → 200 بدون رفض.
  2. **📏 conventions (ثقة 85):** `productionOrder` validator كان `.isInt()` عادي، بينما كل حقول `order` المشابهة في الكودبيز (`faq.validator.js`, `roadmap.validator.js`) بتستخدم `.isInt({min:0})` — قيمة سالبة كانت بتعدّي. **اتصلح:** `.isInt({ min: 0 }).withMessage('productionOrder must be a non-negative integer.')`. فُحص live: `-1` → 400 مرفوضة.
  3. **📏 conventions (ثقة 82):** `productionOrder` من غير index، بينما كل حقول `order` المشابهة (`faqModel.js`, `roadmapTaskModel.js`, `experienceModel.js`) عندها index — ومعيار القبول نفسه بيستخدم `?isProductionWork=true&sort=productionOrder`. **اتصلح:** `schema.index({ isProductionWork: 1, productionOrder: 1 })`. فُحص live: الـ index `isProductionWork_1_productionOrder_1` موجود فعلاً على الـ DB الحقيقي.
  - **simplicity lens:** صفر اكتشافات.
- [x] `clean-code-guard` gate على الـ diff كامل — صفر مخالفات. تكرار الـ regex عبر 3 أماكن (الموديل + الفاليديترين) موثّق كقرار دفاع-في-عمق مقصود في الخطة نفسها، مش تكرار عرضي.
- [x] ✔️ **انزل لوحدك** (server-only PM2 restart) — نزل فعلاً وتأكد حي: `GET https://api.beingmomen.com/api/v1/projects` بيرجّع `detailSlug`/`isProductionWork`/`productionOrder` على بيانات إنتاج حقيقية (جلسة مطابقة 2026-08-21)
- [x] فحص يدوي: `db.projects.getIndexes()` على قاعدة `beingmomen` تُظهر `detailSlug_1` بـ `unique: true, sparse: true` — **الـ index موجود فعلاً على الـ DB الحقيقي** (بُني بمجرد اتصال أي عملية Mongoose بنفس السكيما، بما فيها السيرفر المحلي وقت الفحص؛ مش محتاج انتظار الـ push عشان الـ DB-level check ده، بس لسه محتاج الـ push عشان **كود** الـ VPS الحيّ يبقى محدَّث).
- [x] فحص يدوي: تعديل مشروعين مختلفين من غير `detailSlug` — الاتنين نجحوا بدون `E11000` (فُحص محلي على نفس الـ DB).
- [x] فحص يدوي: `GET /home-featured/populated` بترجع `skills` مليانة لكل مشروع (كانت `undefined`) — فُحص على الـ singleton الحقيقي (Warraq، ترابط).
