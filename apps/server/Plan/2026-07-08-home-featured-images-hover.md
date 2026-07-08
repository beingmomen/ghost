# مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover (Server)

> 🔗 جزء من ميزة «مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover» بتشمل كمان: client و db.
> الملفات المرتبطة:
> - [../../db/Plan/2026-07-08-home-featured-images-hover.md](../../db/Plan/2026-07-08-home-featured-images-hover.md)
> - [../../client/Plan/2026-07-08-home-featured-images-hover.md](../../client/Plan/2026-07-08-home-featured-images-hover.md)

- **التاريخ:** 2026-07-08
- **المشروع:** apps/server (Express 4 + Mongoose + factory pattern)
- **الحالة العامة:** 🔒 مقفولة بعد المراجعة (جولتين نظاف: 5 و6) — جاهزة للتنفيذ

## نظرة عامة

الميزة دي ليها 3 أجزاء على مستوى الـ monorepo. جزء الـ server فيه:
1. **endpoint + model للمشاريع المميزة للهوم** — سجل إعدادات singleton بـ مصفوفة مرتبة من ≤3 مشاريع، مع cascade لما المشروع يقفل أو يتمسح، و endpoint populated للـ client.
2. **إصلاح جودة الصور** — رفع الـ resize من 400×192 لـ 1200×675 للصور الثابتة، ومعالجة الـ GIF (cap 800 + الحفاظ على التحريك).
3. **إصلاح bug في `/projects/all`** — إضافة `slug image altText` للـ selectFields عشان الـ dashboard select يعرض صورة + عنوان.

ترتيب التنفيذ بين المشاريع: **server الأول** (الـ client و db بيعتمدوا على الـ endpoints).

## الـ Scope

- **داخل الـ scope:**
  - `HomeFeatured` model + singleton pattern + max-3 validation.
  - routes + controller لـ `/api/v1/home-featured` (GET raw, GET /populated, POST, PATCH).
  - cascade hooks على `projectModel` (isActive→false و delete).
  - تعديل resize config في `project.image.js` + معالجة GIF في `cloudinary-image.image.js`.
  - إصلاح `selectFields` في `_projectController.js` للـ `/all`.
- **خارج الـ scope:**
  - إعادة رفع المشاريع الموجودة (عملية dashboard يدوية — في خطة الـ db).
  - GET by slug للمشاريع (bug منفصل، مش مطلوب).
  - الـ `buildProjectRoutes` placeholder (مش مرتبط).
  - تأثير `format: 'jpeg'` على الـ GIFs المرفوعة قبل التعديل — دي بيانات موجودة، إعادة رفعها تحلها.

## المناطق المتأثرة في الكود

**ملفات جديدة:**
- `apps/server/models/homeFeaturedModel.js` — singleton schema بـ `projects: [ObjectId ref:'Project']` + max-3 validator + `getSingleton` static (نمط `roadmapSettingsModel.js:27-34`).
- `apps/server/controllers/_homeFeaturedController.js` — `getHomeFeatured` (`findOne()` بترجع الـ doc أو `null` — **مش** `getSingleton`، عشان الـ db empty-state logic تعتمد على `[null]`)، `getHomeFeaturedPopulated` (`findOne()` populate + `match:{isActive:true}` + **`if (!doc) return res.status(200).json({ data: [] })` guard قبل أي وصول لـ `doc.projects`** — الـ singleton ممكن ما يكونش موجود على deploy جديد قبل أول POST → `null.projects` throws → 500 → الـ client بيشوف `state="error"` بدل `state="empty"`؛ بعد الـ guard بيتفلتر nulls → `{data:[Project...]}`)، `createHomeFeatured`/`updateHomeFeatured` (`getSingleton()` ← `doc.projects = req.body.projects` ← `doc.save()` عشان custom validator يشتغل).
- `apps/server/routes/homeFeaturedRoutes.js` — GET `/`، GET `/populated`، POST `/`، PATCH `/` (نمط `infoRoutes.js` بدون multer).
- `apps/server/middleware/validators/homeFeatured.validator.js` — `updateHomeFeaturedRules`: `body('projects').isArray({min:0,max:3})` + `body('projects.*').isMongoId()`.

**ملفات معدّلة:**
- `apps/server/app.js` (السطر 34 area + قبل السطر 160) — require + `app.use('/api/v1/home-featured', homeFeaturedRouter)` **قبل** `app.all('/api/*', ...)`.
- `apps/server/middleware/validators/index.js` (السطر 14 + 62) — require + export `updateHomeFeaturedRules`.
- `apps/server/models/projectModel.js` (بعد السطر 102) — `post('findOneAndUpdate')` hook: لو **الـ update نفسه لمس `isActive`** (افحص `this.getUpdate()` على `$set.isActive` / `isActive` top-level) **و** `doc.isActive === false` اعمل `$pull` (filter+save) من `HomeFeatured.projects`. التضييق ده بيتجنب no-op re-saves + VersionError على admin sessions متزامنة لما يتم تعديل مشروع inactive من غير ما يتلمس `isActive`. `post('findOneAndDelete')` hook: اعمل pull برضو (من غير شرط — المسح دايمًا إزالة). استخدم `mongoose.model('HomeFeatured')` lazy عشان تتجنب circular import.
- `apps/server/controllers/_projectController.js` (السطر 4) — `getAllNoPagination = factory.getAllNoPagination(Model, { selectFields: 'title slug image altText' })`.
- `apps/server/routes/projectRoutes.js` (السطر 22) — أضف `authController.protect` على `router.route('/all').get(...)` (حاليًا عام بلا auth بيتسرب لكل المشاريع incl. inactive/draft). الـ dashboard بيبعت `Authorization: Bearer` عبر الـ proxy فمش هيتكسر؛ الـ client مش بيستخدم `/all` (بيستخدم `/projects` paginated + `/home-featured/populated`).
- `apps/server/imageServices/project.image.js` (السطر 9) — resize config: static `{width:1200,height:675,fit:'cover',quality:85}` + `gifResize:{width:800,height:450,fit:'cover',quality:85}`.
- `apps/server/imageServices/config/cloudinary-image.image.js` (السطور 53-136) — helper `buildUploadOptions(file, findField, folderName)`: لو `file.mimetype === 'image/gif'` استخدم `findField.gifResize` **لو موجود** (projects)، **غير كده fallback** لـ `findField.resize` (blog/client/experience/service/testimonial — الـ services اللي معندهاش `gifResize`)؛ وفي الحالتين **شيل `format:'jpeg'`** للـ GIF (خلّي الـ GIF متحرّك). غير gif استخدم `resize` + `format:'jpeg'` كالعادة. الـ fallback ضروري عشان الـ factory ده shared بين كل الـ cloudinary services وميخسرش رفع GIF في service عشان نصلحه في service تانية.

## الـ Edge cases

- **ترتيب routes في `app.js`:** `/api/v1/home-featured` لازم يكون قبل `app.all('/api/*', ...)` في السطر 163. مفيش conflict مع `/projects/:id` (path مختلف).
- **`/projects/all` أمنية (load-bearing):** الـ route كان عام بلا auth (`projectRoutes.js:22`) → بيتسرب لكل المشاريع incl. inactive/draft لأي حد مجهول. الخطة بتضيف `protect` عليه. الـ dashboard بيستخدمه بس (عنده `Bearer` token عبر الـ proxy → مش هيتكسر). الـ client مش بيستخدمه (بيستخدم `/projects` + `/home-featured/populated`). **لازم `protect` على `/all` قبل إضافة `slug image altText`** — وإلا الخطة بتوسّع التسرب بدل ما تصلحه.
- **GET routes عامة (load-bearing contract):** `GET /` و `GET /populated` **بدون** `protect` middleware — الـ client landing بيستدعيهم من غير auth (cross-origin، الـ `$api` مبيعتش cookies/Authorization). `protect` بيتحط على POST/PATCH بس. لو اتضاف `protect` على GET بالغلط → الـ landing بيرجّع 401 لكل زائر و`LandingSectionFallback state="error"` بيخفي السبب. (نمط `infoRoutes.js:10-12`: GET عام بالتغاضي).
- **Singleton race condition:** `getSingleton` بيعمل `findOne()` ثم `create({})` لو مش موجود. لو طلبين متزامنين يخلقوا 2 docs — مقبول للأمان العملي (admin واحد). لو عايز أمان أكتر: `findOneAndUpdate({}, {}, {upsert:true})`.
- **Ref مكسور لو الـ cascade فشل:** الـ `getHomeFeaturedPopulated` بيعمل populate بـ `match:{isActive:true}` فالـ refs المكسورة بتظهر `null` — فلتر الـ nulls في الـ controller (defensive).
- **`getHomeFeaturedPopulated` على DB فاضي (load-bearing):** قبل أول POST من الأدمن، `HomeFeatured.findOne()` بترجع `null`. لو الـ controller وصل `doc.projects` من غير guard → `null.projects` throws → 500 → الـ client `LandingSectionFallback state="error"` بدل `state="empty"` المتوقعة. لازم `if (!doc) return res.status(200).json({ data: [] })` **قبل** أي وصول لـ `doc.projects` (نفس نمط الـ guards اللي في الـ raw GET و الـ cascade hooks).
- **PATCH بـ `projects: []`:** مقبول (admin يفضّي الهوم). الـ validator بيقبل `min:0`.
- **PATCH بـ IDs مش موجودة:** الـ validator بيفحص MongoId format بس. populate هيـ return `null` ويتفلتر. (optional: custom validator يفحص existence — موصى به.)
- **`findByIdAndUpdate` vs `save()`:** استخدم `doc.save()` في الـ PATCH عشان الـ custom array validator يشتغل بـ `runValidators:true`.
- **GIF + `crop:'fill'`:** ممكن يعمل crop مش resize لو الـ aspect ratio مش 16:9. لو فيه مشكلة، استخدم `crop:'limit'` للـ GIF. اختبار فعلي مطلوب بعد التنفيذ.
- **`format:'jpeg'` الحالي:** لسه محتاج نتأكد هل بيحوّل الـ GIFs الجديدة لـ static. التعديل بيشيله للـ GIF. الـ GIFs الموجودة (animated) محتاجة إعادة رفع من الـ dashboard عشان تشتغل مع الـ config الجديد.
- **حد 50MP للـ frames (الـ root cause الفعلي):** كاب `w_800` محافظ بس مش ضمان. GIF بـ frames كتير جدًا ممكن يفشل حتى عند 800×450 (138 frame × 0.36MP ≈ 50MP). لو حصل رفض على upload GIF جديد → نزّل الكاب (مثلاً `width:640`). التشخيص بـ 4 curl variants أكّد إن الـ mechanism هو total-frames-pixels مش حد width بحد ذاته.
- **`cloudinary-image.image.js` shared factory (load-bearing):** الملف ده بتستخدمه كل الـ cloudinary image services (blog, client, experience, project, service, testimonial) عبر `imageService.js`. الـ `gifResize` بيتضاف لـ `project.image.js` بس. لو `buildUploadOptions` استخدمت `findField.gifResize` من غير fallback → رفع GIF في أي service تانية (blog مثلاً) هيـ throw `undefined.width` → 500 (regression لرفع GIF كان شغّال). لازم fallback `findField.gifResize ?? findField.resize` + شيل `format:'jpeg'` للـ GIF في الحالتين.

## معايير القبول

- `GET /api/v1/home-featured` بيرجّع `{ data: [doc] }` (infos pattern) فيه الـ singleton doc بـ `projects: [ObjectId...]` (raw ids)، أو `{ data: [null] }` لو السجل مش موجود (الـ db بتعتمد على الشكل ده في الـ empty-state branching).
- `GET /api/v1/home-featured/populated` بيرجّع `{ data: [Project,...] }` populated، بـ isActive filter، بالترتيب، وبدون nulls. على DB فاضي (مفيش singleton لسه) بيرجّع `{ data: [] }` بـ 200 (مش 500) → الـ client `state="empty"` بدل `state="error"`.
- `PATCH /api/v1/home-featured` بـ 4 ids → بيرفض (400 + رسالة max-3). بـ 3 أو أقل → بيقبل ويحدّث/upsert.
- لما project يتحوّل `isActive:false` عبر `findByIdAndUpdate` → الـ hook بيشيله من `HomeFeatured.projects`.
- لما project يتمسح (`findByIdAndDelete`) → الـ hook بيشيله من `HomeFeatured.projects`.
- `GET /api/v1/projects/all` **محمي بـ `protect`** بيرجّع كل مشروع بـ `{ _id, title, slug, image, altText }` (مش `name title` بس). طلب بدون token بيرجّع 401 (مش التسرب العام القديم).
- رفع صورة ثابتة جديدة → Cloudinary بترجّع asset بـ dimensions ~1200×675. رفع GIF → asset متحرّك بـ width ≤800.
- السكربت الـ executable check (M1) بيطبّع `PASS 4-ref create rejected` + `PASS 3-ref create ok`.

## الـ Dependencies والمخاطر

- **Circular import:** `projectModel.js` hooks بـ `mongoose.model('HomeFeatured')` lazy عشان تتجنبه.
- **DB connection في الـ executable check:** استخدم `DATABASE` (local) لو متاح؛ otherwise اعمل cleanup للـ docs الـ created. ما تتصلش بـ `DATABASE_ATLAS` (production) في الـ check إلا لو اضطريت وعملت cleanup.
- **Cloudinary GIF behavior:** الـ `crop:'fill'` للـ GIF محتاج اختبار. البديل `crop:'limit'`.
- **Sharp مش مستخدم:** الـ resize كله في Cloudinary via `transformation`. التعديل في config بس — مفيش إعادة هيكلة لـ Sharp.
- **No test framework:** الـ executable check المقترح هو الـ verification الوحيد المتاح قبل الـ manual testing.
- **ترتيب التنفيذ:** server الأول، بعده db و client (بيعتمدوا على الـ endpoints).

## القرارات المحسومة

- **Option B (سجل إعدادات منفصل)** لتحديد المشاريع المميزة — السبب: max-3 بنيوي، ترتيب بـ PATCH واحد، فصل نظيف (المصدر: مقابلة).
- **max 3 + الترتيب = ترتيب المصفوفة** — السبب: قرار المستخدم (المصدر: مقابلة).
- **لو أقل من 3 → اعرض اللي اتحدد بس** (no fallback بأحدث المشاريع) — السبب: التحكم الكامل من الباك إند (المصدر: مقابلة).
- **isActive→false → شيل من المصفوفة (cascade فعلي مش filter وقت query بس)** — السبب: قرار المستخدم (المصدر: مقابلة).
- **delete → cascade شيل من المصفوفة** — السبب: نفس المبدأ، ref مكسور مينفعش (المصدر: مقابلة).
- **`GET /home-featured` raw للـ dashboard + `GET /home-featured/populated` للـ client** — السبب: dashboard محتاج raw ids، client محتاج populated objects (المصدر: تسوية بين blueprints).
- **Sharp مش مستخدم — الـ resize في Cloudinary** — السبب: اكتشاف أثناء قراءة الكود (المصدر: code-architect).
- **resize 1200×675 للثابتة + 800 للـ GIF + شيل `format:'jpeg'` للـ GIF** — السبب: قرار المستخدم (Level 1+2) + حد Cloudinary **50MP إجمالي pixels في كل الـ frames** (مش «حد 800px»): الـ GIF بـ `w_1152` بيوصل 84.35MP فيفشل (HTTP 400)، والكاب `w_800` بيوصله تحت 50MP (~40MP). `f_auto` مش الجاني (اتحقّق بـ curl: `w_1152` بدون `f_auto` لسه بيرجع 400 بنفس الـ error). `format:'jpeg'` بيتشال للـ GIF عشان يحافظ على التحريك (المصدر: مقابلة + تشخيص فعلي بـ 4 curl variants في جولة 1).
- **`getHomeFeatured` (GET `/`) تستخدم `findOne()` مش `getSingleton()`** — السبب: `findOne` بترجع `null` لو السجل مش موجود (`{data:[null]}`) وده اللي الـ db empty-state logic بيعتمد عليه (`if (existing.value?.data?.[0])`); `getSingleton` بتنشئ سجل كـ side-effect للـ GET فيكسر الـ create-vs-update branching (المصدر: مراجعة جولة 1 — `_infoController.js:22-29` بتستخدم `findOne`).
- **`getSingleton()` تُستخدم بس في POST/PATCH** — السبب: عشان الـ upsert-side-effect يحصل بس لما الأدمن فعلاً يعمل save، مش على قراءة عادية (المصدر: مراجعة جولة 1).
- **GET `/` و GET `/populated` عامة (بدون `protect`)** — السبب: الـ client landing بيستدعيهم cross-origin من غير auth; `protect` على POST/PATCH بس (المصدر: مراجعة جولة 1 — نمط `infoRoutes.js:10-12`).
- **الـ cascade hook `post('findOneAndUpdate')` بيتضيّق بـ `this.getUpdate()` فلتر** — السبب: شيل بس لما الـ update نفسه يلمس `isActive` (مش على كل تعديل مشروع inactive)، عشان نتجنّب no-op re-saves + VersionError على admin sessions متزامنة (المصدر: مراجعة جولة 1).
- **null guard على `featured` في الإتنين cascade hooks (`!featured` early return)** — السبب: على deploy جديد الأدمن بيتظبط المشاريع قبل ما يعمل POST لـ `/home-featured`، فالـ singleton مش موجود لسه → `HomeFeatured.findOne()` بترجع `null` → `null.projects.filter` throws → 500 على تعديل/مسح مشروع. الـ guard بيتجنّب الـ crash (المصدر: مراجعة جولة 2).
- **`!doc` early return في الـ delete hook** — السبب: `findByIdAndDelete` بترجع `null` لو المشروع مش موجود (طلبين متزامنين / مسح مكرر) → الـ post hook بيشغّل بـ `doc=null` → `doc._id.toString()` throws → 500 بدل الـ 404 الطبيعي. ده مش بيقلب قرار "بدون شرط isActive" (ده guard على `doc`، مش على `isActive`) (المصدر: مراجعة جولة 2).
- **`buildUploadOptions` GIF branch fallback `findField.gifResize ?? findField.resize`** — السبب: `cloudinary-image.image.js` factory shared بين كل الـ cloudinary services (blog/client/experience/project/service/testimonial). `gifResize` بيتضاف لـ projects بس → أي service تانية بترفع GIF هتـ throw `undefined.width` → 500 (regression لرفع GIF كان شغّال). الـ fallback + شيل `format:'jpeg'` للـ GIF في الحالتين بيحافظ على التحريك من غير ما يكسر باقي الـ services (المصدر: مراجعة جولة 2).
- **`/projects/all` خلف `protect`** — السبب: الـ route كان عام بلا auth بيتسرب لكل المشاريع incl. inactive/draft لأي حد مجهول؛ الخطة بتضيف `slug image altText` فبتوسّع التسرب. الـ dashboard بيستخدمه بس (عنده `Bearer` عبر الـ proxy → مش هيتكسر)؛ الـ client مش بيستخدمه. `protect` قبل إضافة الحقول (المصدر: مراجعة جولة 2).
- **`getHomeFeaturedPopulated` بـ `!doc` guard + `findOne()` (مش `getSingleton`)** — السبب: الـ singleton مش موجود على deploy جديد قبل أول POST → `findOne()` بترجع `null` → `null.projects` throws → 500 → الـ client `state="error"` بدل `state="empty"`. نفس نمط الـ guards اللي في الـ raw GET (`findOne`→`{data:[null]}`) و الـ cascade hooks (`!featured`/`!doc`). الـ guard بيرجع `{data:[]}` بـ 200 (المصدر: مراجعة جولة 4).

---

## Milestones

### Milestone 1: HomeFeatured model + max-3 validation (executable check أول)
- [ ] أنشئ `apps/server/models/homeFeaturedModel.js`: schema `{ projects: [{type:ObjectId, ref:'Project'}] }` بـ `validate: { validator: v => v.length <= 3, message: '...' }` + `getSingleton` static (نمط `roadmapSettingsModel.js`) + timestamps + toJSON/toObject virtuals.
- [ ] أنشئ `apps/server/middleware/validators/homeFeatured.validator.js`: `updateHomeFeaturedRules` (`isArray({min:0,max:3})` + `isMongoId` per item) + سجّله في `middleware/validators/index.js`.
- [ ] **executable check:** شغّل سكربت `node` يتصل بـ DB (local `DATABASE` لو متاح) ويعمل `HomeFeatured.create({ projects: [4 ids] })` (يتوقع reject) و `create({ projects: [3 ids] })` (يتوقع success) + cleanup. يطبّع `PASS 4-ref create rejected` + `PASS 3-ref create ok`. `in-progress`

### Milestone 2: home-featured routes + controller + mount + /projects/all fix
- [ ] أنشئ `apps/server/controllers/_homeFeaturedController.js`: `getHomeFeatured` (`Model.findOne()` → `{data:[doc]}` حيث `doc` ممكن `null` — **مش** `getSingleton`)، `getHomeFeaturedPopulated` (`findOne().populate({path:'projects',match:{isActive:true}})` → **`if (!doc) return res.status(200).json({ data: [] })`** (singleton مش موجود على deploy جديد) → filter nulls → `{data:[Project...]}`)، `createHomeFeatured`/`updateHomeFeatured` (`getSingleton()` → `doc.projects = req.body.projects` → `doc.save()`).
- [ ] أنشئ `apps/server/routes/homeFeaturedRoutes.js`: GET `/`، GET `/populated` (قبل أي `/:id` لو اتعمل)، POST `/` (protect+restrictTo ADMIN/DEV + validator)، PATCH `/` (protect+restrictTo + validator). لا multer.
- [ ] عدّل `apps/server/app.js`: require + `app.use('/api/v1/home-featured', homeFeaturedRouter)` قبل `app.all('/api/*', ...)`.
- [ ] عدّل `apps/server/controllers/_projectController.js:4`: أضف `{ selectFields: 'title slug image altText' }` لـ `getAllNoPagination`.
- [ ] عدّل `apps/server/routes/projectRoutes.js:22`: أضف `authController.protect` على `/all` route (`router.route('/all').get(authController.protect, controller.getAllNoPagination)`) — كان عام بلا auth بيتسرب لكل المشاريع incl. inactive. الـ dashboard بيبعت Bearer token فمش هيتأثر.
- [ ] تحقق يدوي: `pnpm dev:server` + `curl http://localhost:3001/api/v1/home-featured` (يتوقع `{data:[doc]}`) + `curl .../home-featured/populated` + `curl .../projects/all` (يتوقع fields الجديدة).

### Milestone 3: cascade hooks على projectModel
- [ ] أضف `schema.post('findOneAndUpdate')` في `projectModel.js`: افحص `this.getUpdate()` — لو فيه `isActive` (top-level أو تحت `$set`/`$unset`) **و** `doc && doc.isActive === false` اعمل `HomeFeatured.findOne()` → **لو `!featured` اعمل early return (مفيش singleton لسه → مفيش cascade)** → `featured.projects = featured.projects.filter(id => id.toString() !== doc._id.toString())` → `save()`. لو الـ update ما لمسش `isActive` → اخرج بـ early return (no-op re-save بيتجنّب). استخدم `mongoose.model('HomeFeatured')` lazy.
- [ ] أضف `schema.post('findOneAndDelete')`: **لو `!doc` اعمل early return** (مسح مشروع مش موجود → الـ controller بيرجّع 404، الـ hook ما يشتغلش عليه). بعدها `HomeFeatured.findOne()` → **لو `!featured` early return** → نفس الـ pull (بدون شرط isActive — المسح دايمًا إزالة).
- [ ] تحقق يدوي: حدّث مشروع مميّز لـ `isActive:false` → تأكد إنه اتشال من `HomeFeatured.projects`. امسح مشروع مميّز → تأكد إنه اتشال.

### Milestone 4: إصلاح جودة الصور (resize + GIF)
- [ ] عدّل `apps/server/imageServices/project.image.js`: `STATIC_RESIZE={width:1200,height:675,fit:'cover',quality:85}` + `GIF_RESIZE={width:800,height:450,fit:'cover',quality:85}` + مررهم للـ field config.
- [ ] عدّل `apps/server/imageServices/config/cloudinary-image.image.js`: `buildUploadOptions(file, findField, folderName)` — لو `file.mimetype==='image/gif'` استخدم `findField.gifResize ?? findField.resize` (fallback لـ `resize` لو الـ service معندهاش `gifResize` — الـ factory shared) و**شيل `format:'jpeg'`**؛ غير كده `resize` + `format:'jpeg'`. استبدل الـ inline options في السطور 81-92 و 108-119.
- [ ] تحقق يدوي: رفع صورة ثابتة عبر `POST /api/v1/projects` → asset 1200×675. رفع GIF → asset متحرّك ≤800px. (لو `crop:'fill'` كسر الـ GIF، جرّب `crop:'limit'`.)