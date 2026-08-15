# دور المشروع وأدواته + صفحة تفاصيل المشروع (Server)

> 🔗 جزء من ميزة «دور المشروع وأدواته + صفحة تفاصيل المشروع» بتشمل كمان: client و db.
> الملفات المرتبطة:
> - [../../client/Plan/2026-07-14-project-role-and-tools.md](../../client/Plan/2026-07-14-project-role-and-tools.md)
> - [../../db/Plan/2026-07-14-project-role-and-tools.md](../../db/Plan/2026-07-14-project-role-and-tools.md)

- **التاريخ:** 2026-07-14
- **المشروع:** apps/server (Express.js 4 + Mongoose/MongoDB، factory pattern)
- **الحالة العامة:** قيد المراجعة — 10 جولات (1: 2🔴+6🟠 · 2: 1🔴+3🟠 · 3: 0🔴+2🟠 · 4: 0🔴+2🟠 · 5: 1🔴+1🟠 · 6: 1🔴+1🟠 · 7: نظيفة ✅ · 8: 1🟠 · 9: نظيفة ✅ · **10: 1🔴+2🟠 اتصلحت**) — العدّاد النظيف رجع لصفر، محتاج جولتين نظاف متتاليتين للقفل ([سجل المراجعة](../../client/Plan/2026-07-14-project-role-and-tools.review-log.md))

## نظرة عامة

الموقع دلوقتي بيعرض المشاريع كـ **نواتج** (عنوان + وصف + صورة + لينك خارجي) من غير أي أثر لمساهمة صاحبها. الميزة دي بتخلّي كل مشروع يجاوب على نفس السؤالين — **«دوري»** و**«الأدوات»** — بمسطرة واحدة لكل المشاريع، مع سردية اختيارية أعمق.

جزء الـ server هو **الأساس** — كل باقي الميزة معتمد عليه:

1. **إصلاح bug مؤكَّد**: `_homeFeaturedController.js` مش بيعمل nested populate للـ `skills` virtual → كروت الهوم بترجع `skills: undefined` دايماً.
2. **حقول جديدة** على الـ `Project`: `role` · `origin` · `process` · `enSlug` · `repoUrl` · `toolIds`، و`url` يبقى اختياري.
3. **route جديد** `GET /projects/slug/:enSlug` (نظير `blogRoutes.js:33`) عشان صفحة التفاصيل في الـ client.
4. **تضييق متأخّر**: `role` و`enSlug` يبقوا `required` **بعد** ما الـ 4 مشاريع الموجودين يتملّوا.

ترتيب التنفيذ العام: **server M1 → client M1 → server M2 → db M1 → db M2 (محتوى) → client M2 → server M3 + db M3**.

## الـ Scope

- **داخل الـ scope:**
  - `models/projectModel.js` — الحقول الجديدة + `tools` virtual + hooks للتحقق المتقاطع `url`/`repoUrl`.
  - `middleware/validators/project.validator.js` — قواعد الحقول الجديدة.
  - `controllers/_projectController.js` — `getOneBySlug` + populate `tools`.
  - `routes/projectRoutes.js` — `GET /slug/:enSlug`.
  - `controllers/_homeFeaturedController.js` — إصلاح الـ nested populate.
- **خارج الـ scope:**
  - `models/skillModel.js` — **مش بيتغير خالص**. `toolIds` بيعيد استخدامه زي ما هو (قرار #6).
  - `/projects/all` (`getAllNoPagination`) — محمي بـ `protect`، بيخدم الـ HomeFeatured picker في الـ dashboard. حالة استخدام منفصلة وصحيحة — بلاش تلمسها.
  - `controllers/landingController.js` — حقل `projects` بتاعه **بيانات ميتة** (محدش بيقراه في الكلاينت). إضافة `role`/`tools` ليه اختيارية بحتة، مش على المسار الحرج.
  - تتبّع مشاهدات المشاريع (زي `BlogView`) — مفيش `ProjectView` model ومحدش طلبه.
  - إضافة مشاريع جديدة — محتوى بيتحط من الـ dashboard بعدين (قرار #7).

## المناطق المتأثرة في الكود

**ملفات معدّلة (5):**

- **`models/projectModel.js`** — الحقول الجديدة (`repoUrl` · `enSlug` · `role` · `origin` · `process` · `toolIds`)، `url` يبقى `required: false` مع حراسة الـ validator (`!value || URL.canParse(value)`)، `tools` virtual جنب `skills`، وhookين للتحقق المتقاطع (تفاصيلهم في Milestone 2).
- **`middleware/validators/project.validator.js`** — قواعد الحقول الجديدة في `createProjectRules` و`updateProjectRules`، كل حقل بيتحقق من **صيغته لوحده**. **بدون أي `custom()` متقاطع في الاتنين** — لسببين مختلفين: في الـ update، `express-validator` بيشوف `req.body` بس مش الـ document المخزّن فـ PATCH جزئي هيدّي false positive؛ وفي الـ create، الـ `.optional()` بيعمل short-circuit للسلسلة فالـ `custom()` ميّت أصلاً. التحقق المتقاطع مكانه الـ Mongoose hook حصرياً.
- **`controllers/_projectController.js`** — `popOptions: ['skills', 'tools']` في `getAll`، وإضافة `getOneBySlug`.
- **`routes/projectRoutes.js`** — `router.route('/slug/:enSlug').get(controller.getOneBySlug)`.
- **`controllers/_homeFeaturedController.js`** — إصلاح الـ nested populate (Milestone 1).

## الـ Edge cases

- **مشروع من غير `url` ولا `repoUrl`** → الـ hookين بيرفضوا. الـ create بيروح على `pre('validate')` (ValidationError → 400 نضيف عبر `errorController`)، والـ update بيروح على `pre('findOneAndUpdate')` مع `AppError(msg, 400)`.
- **`AppError` مش `Error` عادي:** `Error` مجرّد ملهوش `.isOperational` → بيقع من كل فروع `errorController` ويرجع 500 "Something went wrong!" في الإنتاج ويخفي السبب الحقيقي. `AppError(msg, 400)` بيدخل فرع `isOperational` ويرجع 400 واضح.
- **PATCH جزئي مبيلمسش `url`/`repoUrl`** → الـ hook بيرجع `next()` فوراً. `runValidators: true` بيتحقق من الـ paths الموجودة في الـ payload بس، مش الـ document كله، ومبيشغّلش `pre('validate')` — فمشروع قديم من غير `role` مش هيتقفل عليه تعديل.
- **🔴 القيمة الفاضية (`''`) لازم تعدّي طبقتين، مش واحدة** — express-validator بيشتغل **قبل** Mongoose في السلسلة، فحماية الـ model لوحدها مش كفاية:
  1. **الـ validator:** `.optional()` العادية بتتخطى `undefined` بس → الـ `''` بتترفض بـ 400 قبل ما توصل للـ model أصلاً. الحل: `.optional({ values: 'falsy' })` على كل الحقول الاختيارية.
  2. **الـ model:** `minlength` و`match` **مش** بيتصرفوا زي بعض مع `''` — مثبت بالتشغيل على Mongoose 8.24.0 ومؤكَّد من المصدر (`lib/schema/string.js:547-549`): الـ `match` بيتخطى `null`/`undefined`/`''`، والـ `minlength` **بيرفضها**. الحل: validator محروس بـ `!v ||` — نفس أسلوب الـ `url` validator، فمفيش نمط جديد.
  - **الاتنين لازم مع بعض.** واحد من غير التاني = الـ `''` بتترفض في طبقة أو التانية.
- **`getOneBySlug` لمشروع `isActive: false`** → **404** (الفلتر جوّه الـ query نفسه). ده بيحافظ على معنى `isActive` = «مسحوب من الويب»، ومتسق مع الـ sitemap اللي بيفلتر `isActive=true` برضه.
- ⚠️ **`getAll` مش بيفلتر `isActive` server-side** — الفلتر جاي من الكلاينت (`projects.vue:7` بيبعت `query: { isActive: true }`)، مش من `_projectController.js:8-10`. يعني `curl https://api.beingmomen.com/api/v1/projects` من غير query بيرجّع المشاريع المعطّلة **دلوقتي، قبل الميزة دي**. سلوك قايم وخارج الـ scope — بس هو بالظبط السبب إن `getOneBySlug` لازم يفلتر بنفسه بدل ما يعتمد على أدب المستدعي.
- **`enSlug` مش موجود** → `GET /projects/slug/xyz` بترجع 404 نضيفة عبر `AppError`.
- **`toolIds` فاضي** → `default: []`، والـ `tools` virtual بترجع `[]`. مفيش validator عليه — اختياري للأبد (قرار #6).
- **حفظ مشروع من غير أدوات (أو مسح كلها)** → الداشبورد بيبعت `toolIds: ''` (sentinel)، و`normalizeToolIds` بيحوّلها `[]`. ⚠️ **لاحظ إن ده بيحصل على كل حفظ فيه أدوات فاضية، مش وقت المسح بس** — يعني الـ backfill في `db M2` نفسه بيعدّي على المسار ده (الأدوات فاضية بالفطرة وقتها). عشان كده مكان الـ middleware حرج: بعد multer وقبل الـ validator. من غير ده: `toFormData` بيتخطى الـ `[]` تماماً والحقل مبيتغيّرش أبداً — toast نجاح ومفيش تغيير فعلي.

## معايير القبول

- [ ] `npm run lint` نضيف في كل milestone.
- [ ] `curl $BASE_URL/home-featured/populated` بيرجّع `skills` **مليانة** لكل مشروع (كانت `undefined`).
- [ ] `curl $BASE_URL/projects` بيرجّع `skills` و`tools` لكل مشروع.
- [ ] `PATCH /projects/:id` بتعديل بسيط (مثلاً `title` بس) على مشروع من الـ 4 القدام **بينجح** وهو لسه من غير `role` — مفيش 500 ولا 400.
- [ ] `POST /projects` من غير `url` ومن غير `repoUrl` بترجع **400** برسالة واضحة (مش 500).
- [ ] `POST /projects` بـ `repoUrl` بس (من غير `url`) **بينجح**.
- [ ] `GET /projects/slug/warraq` بترجع المشروع بـ `skills` و`tools` مليانين — بعد الـ backfill.
- [ ] `GET /projects/slug/xyz-مش-موجود` بترجع **404** مش 500.
- [ ] `GET /projects/slug/warraq` بترجع **404** لو المشروع `isActive: false` — «التعطيل» لسه معناه «مسحوب من الويب».
- [ ] بعد Milestone 3: `POST /projects` من غير `role` بترجع 400.
- [ ] بعد Milestone 3: `POST /projects` بـ `enSlug` **مكرر** بيترفض فعلاً (فحص وظيفي — مش قراءة لوج)، و`db.projects.getIndexes()` بتوري `{ name: 'enSlug_1', unique: true }`.

## الـ Dependencies والمخاطر

- 🔴 **مفيش DB محلي — Atlas إنتاج بس.** كل تغيير في الـ schema بيتجرّب على الإنتاج مباشرةً وقت الـ deploy. ده السبب الوحيد إن الميزة اتقسمت لـ 3 milestones بدل واحدة.
- 🔴 **فخ الـ `enSlug` — الفشل صامت، مش صاخب.** `server.js:19` فيه `mongoose.connect(DB, { family: 4 })` من غير `autoIndex: false` → Mongoose بيبني الـ indexes عند كل connect (كل deploy restart). **بس الخطر مش إن البناء هيفشل بصوت — الخطر إنه هيفشل من غير أي صوت خالص:**
  1. أي `index: true` على `enSlug` في M2 بيعمل index اسمه `enSlug_1` (non-unique). و M3 لما يطلب `unique` بيطلب **نفس الاسم بـ options مختلفة** → MongoDB بالحرف: *"will not change the options nor recreate the index"*.
  2. و Mongoose **بيبلع الناتج**: `mongoose.js:670` بيعمل `model.init().catch(noop)` وقت الـ compile → `$caught = true` → `model.js:1690` (`if (err && !model.$caught)`) **مبيعملش `emit('error')` أبداً**. ومفيش أي `.on('error')` ولا `.on('index')` في `apps/server` كله (متحقَّق بالـ grep).
  3. **النتيجة: مفيش log، مفيش crash، مفيش unhandledRejection — والـ `unique` ببساطة مش موجود.** ولو `enSlug` مكرر اتكتب بعد كده، `findOne` بيرجّع أول doc يلاقيه → `/projects/warraq` بيعرض مشروع أو التاني حسب ترتيب الـ documents على القرص.
  - **عشان كده:** M2 بينزل `enSlug` **من غير أي index**، و M3 بينزل `unique: true` لوحده كأول إنشاء. والفحص **وظيفي** (POST بـ enSlug مكرر لازم يترفض)، مش قراءة لوج.
  - ⛔ **مفيش «مخرج طوارئ»**: `unique: true, sparse: true` اللي كان مقترح هنا بيولّد نفس الاسم `enSlug_1` — فهيفشل بنفس الطريقة الصامتة بالظبط. لو `M2` نزل بالغلط بـ `index: true`، الحل الوحيد هو `db.projects.dropIndex('enSlug_1')` بالإيد على Atlas الإنتاج قبل M3.
- 🔴 **`role: required` قبل الـ backfill** = أي تعديل على الـ 4 من الـ dashboard بيفشل. نفس السبب، ترتيب مختلف.
- ⚠️ **الـ deploy انتقائي**: `apps/server/**` بيعمل restart للسيرفر بس (port 3001). كل milestone بينزل لوحده.
- ⚠️ **مفيش test framework** في `apps/server` (منصوص عليه في `apps/server/CLAUDE.md`) — **متخترعش واحد**. الـ gate هو `npm run lint` + الفحوص اليدوية بالـ curl.

## القرارات المحسومة

- **مسطرة واحدة لكل المشاريع: «دوري» + «الأدوات»** — مفيش تصنيف «AI ولا لأ»، مفيش badge، مفيش filter. السبب: الـ label «ده بالـ AI» بيخلق درجتين في دماغ الزائر ويقرا التاني على إنه أقل قيمة — عكس الهدف بالظبط. الشفافية بتيجي من **محتوى** الحقلين، مش من تصنيف فوقهم. (المصدر: مقابلة)
- **السردية = حقول منظمة، فقرة لكل سؤال** — مش مقال، مش rich content، مفيش TOC، مفيش إعادة استخدام لـ editor الـ Blog. السبب: الاتساق هو اللي بيدّي المصداقية — كل مشروع بيجاوب على نفس الأسئلة بنفس الترتيب فالقارئ يقدر يقارن. (المصدر: مقابلة)
- **`url` يبقى اختياري + `repoUrl` جديد** — بعض المشاريع الجاية repo على GitHub بس من غير deployment حي. validation: واحد منهم على الأقل لازم يكون موجود. (المصدر: مقابلة)
- **`enSlug` حقل إنجليزي جديد** — الـ `slug` العربي و`original_slug` **مايتلمسوش** (صفر migration). السبب: `utils/slug.js` بيحافظ على العربي عمداً (مشترك مع الـ Blog)، وتغييره بيكسر لينكات الـ blog الموجودة ويحتاج migration + redirects على الإنتاج. ومقابل إيه؟ 4 قيم بتتكتب بالإيد في دقيقة. (المصدر: مقابلة)
- **`toolIds` منفصل عن `skillIds`** — `skillIds` = الاستاك (min 3، مجبر، معناه ما اتغيرش)، `toolIds` = أدوات التنفيذ (اختياري، بيشاور على نفس الـ `Skill` model). السبب: خلطهم بيضيّع الرسالة، وبيخلي الـ `min 3` بتعدّ حاجتين مختلفتين في نفس الرقم (`Nuxt + Claude Code + MCP` = 3 skills بس استاك واحد). (المصدر: مقابلة)
- **`role` مجبر · `origin`/`process` اختياريين** — بس التضييق **متأخّر** (Milestone 3) عشان فخ الـ Atlas. (المصدر: مقابلة)
- **`getOneBySlug` بيفلتر `isActive: true`** — بعكس نظيره في الـ blog. السبب: من غير الفلتر، الميزة **بتلغي قدرة موجودة** — النهاردة `isActive: false` بيشيل المشروع من الويب تماماً (مفيش URL له)، وبعد الميزة الصفحة تفضل 200 ومفهرسة في جوجل ومن غير `noindex`، فـ«التعطيل» يبقى معناه «مخفي من القوايم بس». مش مسألة أمنية (البيانات عامة أصلاً) — مسألة إن العميل يطلب سحب مشروعه وأنت تفتكر إنك سحبته. (المصدر: مراجعة جولة 1)
- **`getOneBySlug` مش في `handlerFactory`** — نظيره في الـ blog مش فيه كمان (متكتب باليد في الـ controller بسبب الـ view-tracking side effect). فرض abstraction مشترك على profileين مختلفين للـ side effects مش بيشتري حاجة هنا. (المصدر: مراجعة معمارية)
- **الـ `enSlug` index بينزل مرة واحدة بس، في M3، بـ `unique` من أول لحظة** — مفيش `index: true` في M2. السبب: `createIndex` بنفس الاسم و options مختلفة مبيعملش حاجة (توثيق MongoDB)، و Mongoose بيبلع الـ error بصمت (`$caught=true` وقت الـ compile)، فالنتيجة قيد تفرّد **مش موجود ومحدش واخد باله**. والفحص وظيفي (POST بـ enSlug مكرر) مش قراءة لوج — اللوج مش بيتكتب فيه حاجة أصلاً. (المصدر: مراجعة جولة 1 — مثبت بالتشغيل + مصدر Mongoose 8.24.0)
- **الـ `''` بتعدّي طبقتين: `.optional({ values: 'falsy' })` في الـ validator + validator محروس (`!v || ...`) في الـ model** — الاتنين لازم مع بعض. الـ `.optional()` العادية بتتخطى `undefined` بس فبترفض الـ `''` بـ 400 قبل الـ model؛ والـ `minlength` بيرفض الـ `''` (بعكس `match` اللي بيتخطاها). الـ validator المحروس بيدي نفس الحماية ضد النص القصير من غير ما يرفض الفاضي، وهو نفس أسلوب الـ `url` validator في نفس الملف فمفيش نمط جديد.
  ⚠️ **تصحيح لتبرير جولة 1:** كان مكتوب إن «الفورم بيبعت `''` لأي حقل فاضي، فالـ minlength بيقفل تعديل الـ 4 مشاريع». **ده غلط** — `BaseInput`/`BaseTextarea` بيبعتوا `undefined` (`Textarea.vue:61`, `Input.vue:67`) و`toFormData` بيتخطاه، فالحقل مش بيتبعت من الداشبورد أصلاً. الحماية دي **دفاعية**: بتخص أي client تاني (curl/Postman/تكامل مستقبلي) بيبعت `''` صراحةً — وبقت **مسار حقيقي** بعد ما جولة 2 خلّت الداشبورد يبعت `''` عمداً كـ sentinel للمسح. (المصدر: مراجعة جولة 1، متصحَّح في جولة 2 — مثبت بالتشغيل على Mongoose 8.24.0)
- **التحقق المتقاطع بـ `pre('findOneAndUpdate')` جراحي، مش fetch+save** — `_homeFeaturedController.js` بيحل مشكلة مطابقة بالتخلي عن `findByIdAndUpdate` لصالح `findOne` → mutate → `.save()`. **مرفوض هنا**: ده بيرقّي كل PATCH على المشاريع من partial-path validation لـ full-document validation بشكل مش باين في الـ diff، وبيرفع الرهان على اكتمال الـ backfill بطريقة خفية. الـ hook الجراحي بيشتغل **بس** لما `url`/`repoUrl` يتلمسوا فعلاً. (المصدر: مراجعة معمارية)
- **بوابة M3 مزدوجة ومحصّنة ضد الـ false pass و self-cleaning** — (أ) انضباط الـ payload: `title` جديد والحقل الوحيد المكرر هو `enSlug` (وإلا الرفض بييجي من `title_1` القايم بنفس الـ 500 الجينيريك بالظبط)، والـ `enSlug` المكرر بيتاخد **نسخاً من `GET /projects` الحي لحظة الفحص** مش من الذاكرة ولا أمثلة الخطط (قيمة مش مكررة فعلاً = 201 والقيد سليم)، و`isActive: 'false'` حروف صغيرة حرفياً؛ (ب) **البوابة مزدوجة والإشارتين الغامضتين بيتقفلوا بنفس الـ ground truth**: الـ 500 **مؤشر بيتقفل بـ `getIndexes`** (لأن فشل رفع Cloudinary [raw error مش ملفوف، والصورة مجبرة] أو عطل Atlas عابر بيدّوا نفس الـ 500 بالبايت وبيعدّوا فحص «مفيش doc» كمان)، والـ **201 كمان مؤشر بيتقفل بـ `getIndexes` قبل أي تعافي** (لو القيد موجود `unique` → الـ payload هو الغلط مش القيد — **من غير `dropIndex`**؛ من غير القفل ده، payload مش مكرر فعلاً بيودّي لمسح قيد إنتاج سليم + تشخيص كاذب + لوب مقفول)؛ أي 400 = ماتقاسش؛ و«500 مع `enSlug_1` غايبة» فرع معرّف (infra + build فاشل بصمت → التعافي من الخطوة 2)؛ (ج) فرع الفشل بيسيب أثر فالتعافي خطوات: مسح الـ doc فوراً عبر الـ API → إعادة فحص بوابة الـ 4 (السبب الأصلي غالباً) → `dropIndex` مع تفسير الـ IndexNotFound → restart. من غير (أ)+(ب) كاشف الفشل الصامت بيتهزم — بأسهل payload أو بأي عطل infra؛ ومن غير (ج) لوب مقفول. (المصدر: مراجعة جولة 4 + 5 + 6 + 8 — مثبت بالتشغيل)
- **M3 بينزل (PM2 restart) قبل بوابته — النزول بند مستقل وأول، والفحوص على `api.beingmomen.com` الإنتاج** — تعديل الموديل لوحده مبيعملش القيد: الـ index بيتبني عند `mongoose.connect` بس (`server.js:18-20`). السبب إن ده بند مستقل بدل ما يكون ضمنياً: حالة «الكود مش منزّل» بتنتج **نفس إشارتي الفشل الصامت بالبايت** (201 + `enSlug_1` غايبة) — فالبوابة المزدوجة **مش بتفرّقها**، والتعافي بيثبّت تشخيصاً كاذباً (`IndexNotFound` → «فرع البوابة المخروقة») ويقفل لوب على كود M2. وده الفرق بينها وبين كل مصادر الغموض التانية: الـ ground truth نفسه بيتخدع، مش الإشارة بس. (والـ `pnpm dev:server` المحلي مش بديل ضمني: بيوصل نفس Atlas الإنتاج وnodemon بيبني الـ index فعلاً — فبيقيس بيئة غير اللي بتخدم الزوار.) (المصدر: مراجعة جولة 10)
- **قناة الـ `getIndexes`/`dropIndex` وهدفهم محددين بالاسم: قاعدة `beingmomen` على `etqancluster` — مش `apps/server/.env.prod`** — ده الفحص الوحيد في الميزة كلها اللي مش `curl` على الـ API، فسيبه بلا قناة كان بيفتح القناة اللي البوابة المزدوجة موجودة عشان تقفلها. `.env.prod` بيشاور على `beingmomen-demo`: نسخة كاملة على **نفس الكلاستر** بنفس الـ 4 docs ونفس الـ `_id`s ونفس الـ indexes (متحقَّق بـ probe قراءة-فقط) — `getIndexes` عليها بتدّي «غايبة» بنفس الشكل بالبايت بتاع الفشل الحقيقي (→ `dropIndex` + restart على تشخيص كاذب)، وأي تشغيل محلي سابق بيها بيبني `enSlug_1 unique` فيها → **البوابتين خُضر والقيد مش موجود في الإنتاج**. عشان كده تأكيد الهدف (`updatedAt` يطابق `GET /projects` الحي) شرط قبل قراءة النتيجة. (المصدر: مراجعة جولة 10 — مثبت بـ probe)
- **التحقق المتقاطع في الـ Mongoose hooks حصرياً — مفيش نسخة في الـ express-validator** — لا في الـ create ولا في الـ update. القرار ده كان مسجّل من الأول، بس التنفيذ كان بيخالفه: نسخة `custom()` على سلسلة `.optional()` **كود ميت** (الـ `.optional()` بيعمل short-circuit للسلسلة، مثبت بالتشغيل). خطورتها إنها بتوهم إن التحقق متغطي في مكانين، فـ refactor لاحق يشيل الـ hook واثق فيها ويفتح الثغرة في صمت — ومعيار القبول يفضل أخضر لأن الـ 400 بييجي من الـ hook أصلاً. (المصدر: مراجعة جولة 1 — مثبت بالتشغيل)

---

## Milestones

### Milestone 1: خط الأساس + إصلاح الـ populate المكسور
- [ ] شغّل `npm run lint` على الكود زي ما هو وتأكد إنه نضيف — ده الـ gate اللي كل milestone بعده بيعيد تشغيله
- [ ] `controllers/_homeFeaturedController.js` (السطور 18-21) — أضف nested populate للـ `skills` جوّه populate الـ `projects`:
      `populate({ path: 'projects', match: { isActive: true }, populate: [{ path: 'skills' }] })`
      **السبب:** `skills` على الـ `Project` هو **virtual populate** (`projectModel.js:143-149`) — الـ virtual populates عمرها ما بتتحل تلقائياً، محتاجة populate متداخل صريح. `/projects` و`/landing` الاتنين بيعملوا `.populate('skills')` بنفسهم فهما سليمين — المسار المكسور هو `/home-featured/populated` بس
- [ ] `npm run lint` نضيف
- [ ] فحص يدوي: `curl "$BASE_URL/home-featured/populated"` بيرجّع `skills` مليانة لكل مشروع (كانت `undefined`)
- [ ] **انزل لوحدك** (server-only PM2 restart) — الـ milestone ده مستقل تماماً وصفر مخاطرة على الـ schema

### Milestone 2: الحقول (اختيارية) + الـ API contract الكامل
- [ ] `models/projectModel.js` — عدّل `url`: `required: false` + احرس الـ validator بـ `!value || URL.canParse(value)`
- [ ] `models/projectModel.js` — أضف `repoUrl` (اختياري، نفس الـ validator المحروس)
- [ ] `models/projectModel.js` — أضف `enSlug`: `{ type: String, trim: true, lowercase: true, match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, 'enSlug must be lowercase letters, numbers, and hyphens only'] }`
      ⛔ **من غير `index: true` ومن غير `unique: true`** — أي index بيتعمل هنا اسمه `enSlug_1`، و Milestone 3 مش هيقدر يحوّله لـ unique بعد كده: نفس الاسم + options مختلفة = MongoDB **مبيغيّرش ومبيعيدش الإنشاء**، و Mongoose **بيبلع الـ error بصمت**. التكلفة صفر (4 مشاريع، ومحدش عنده `enSlug` في M2 أصلاً)
- [ ] `models/projectModel.js` — أضف `role` (اختياري دلوقتي) بـ **validator محروس، مش `minlength`/`maxlength`**:
      `validate: { validator(v) { return !v || (v.length >= 20 && v.length <= 300); }, message: 'Role must be between 20 and 300 characters' }`
      ⛔ **متستخدمش `minlength`** — الـ Mongoose `minlength` **مبيتخطاش الـ string الفاضية** (بعكس `match`)، والفورم بيبعت `''` للحقول الفاضية، فأي تعديل على الـ 4 مشاريع القدام هيترفض بـ "at least 20 characters"
- [ ] `models/projectModel.js` — أضف `origin` و`process` (اختياريين) بنفس الـ **validator المحروس** (40-600)، لنفس السبب
- [ ] `models/projectModel.js` — أضف `toolIds: { type: [{ type: ObjectId, ref: 'Skill' }], default: [] }` — من غير أي min validator
- [ ] `models/projectModel.js` — أضف `tools` virtual جنب `skills` virtual (نفس الشكل، `localField: 'toolIds'`)
- [ ] `models/projectModel.js` — أضف `pre('validate')` للتحقق المتقاطع: لو `!this.url && !this.repoUrl` → `this.invalidate('url', '...')`
- [ ] `models/projectModel.js` — أضف `pre('findOneAndUpdate')` جراحي: يرجع `next()` فوراً لو الـ update ملمسش `url` ولا `repoUrl` (بأسلوب `$set`-aware زي hook الـ `isActive` cascade في نفس الملف، السطور 122-133)؛ وإلا يقرا الـ doc الحالي ويدمج ويرفض بـ `AppError(msg, 400)`
- [ ] `middleware/validators/project.validator.js` — `createProjectRules`: قواعد `url`/`repoUrl`/`enSlug`/`role`/`origin`/`process`/`toolIds` — كل حقل بيتحقق من **صيغته لوحده** بس
      🔴 **كلهم `.optional({ values: 'falsy' })` — مش `.optional()` العادية ومش `url` لوحده.** الـ `.optional()` العادية بتتخطى `undefined` بس، فالـ `''` بتوصل للـ format check وتترفض بـ 400 على حقل مكتوب عليه «اختياري». مثبت بالتشغيل على express-validator 7.3.2: `role .optional() + ''` → 400، و`role .optional({values:'falsy'}) + ''` → PASS. ده اللي بيخلي الـ validator المحروس في الـ model يشوف الطلب أصلاً
      ⚠️ استخدم `values: 'falsy'` مش `checkFalsy: true` — الأخيرة `@deprecated` في 7.3.2 المثبت (`lib/chain/context-handler.d.ts:33-39`)
      ⛔ **بدون `custom()` متقاطع** — الـ `.optional()` بيعمل short-circuit للسلسلة كلها، فالـ `custom()` عمره ما هيشتغل للحالة اللي هو موجود عشانها أصلاً (مثبت بالتشغيل: `both absent → PASSES`)
- [ ] `middleware/validators/project.validator.js` — `updateProjectRules`: نفس الإضافات، **كلها `.optional({ values: 'falsy' })` للأبد**، وبرضه **بدون** `custom()` متقاطع
- [ ] `controllers/_projectController.js` — `getAll`: `popOptions: ['skills', 'tools']`
- [ ] `controllers/_projectController.js` — أضف middleware تطبيع صغير للـ sentinel بتاع الحقول الفاضية:
      `exports.normalizeToolIds = (req, res, next) => { if (req.body.toolIds === '') req.body.toolIds = []; next(); }`
      **السبب:** الـ FormData مبيقدرش يعبّر عن array فاضية، فالداشبورد بيبعت `toolIds: ''` كإشارة صريحة (تفاصيلها في خطة الـ db)
- [ ] `routes/projectRoutes.js` — حط `controller.normalizeToolIds` في سلسلة الـ POST والـ PATCH — **بعد `handleImages`، وقبل قواعد الـ validator**:
      - POST: `authController.protect, authController.restrictTo([ROLES.ADMIN, ROLES.DEV]), imageService.handleImages, controller.normalizeToolIds, v.createProjectRules, v.validate, controller.createOne`
      - PATCH: `authController.protect, authController.restrictTo([ROLES.ADMIN, ROLES.DEV]), imageService.handleImages, imageService.updateImages, controller.normalizeToolIds, v.updateProjectRules, v.validate, controller.updateOne`
      ℹ️ **الأسماء دي حرفية من `projectRoutes.js` الحالي** (نفس الـ prefixes والـ arguments) — السلسلتين هما الموجودتين فعلاً + `controller.normalizeToolIds` متحشر في مكانه. عملياً: **احشر العضو الجديد في السلسلة الموجودة، متعيدش كتابتها من نص الخطة**. ⛔ بالذات `restrictTo`: لازم يتنادى بـ `([ROLES.ADMIN, ROLES.DEV])` — كتابته من غير استدعاء (`authController.restrictTo,`) تعدّي الـ lint، بس Express هيشغّل الـ factory نفسه كـ middleware ومحدش هينادي `next()` → كل POST/PATCH على `/projects` يعلّق للأبد بصمت
      ⛔ **مش «قبل `handleImages`»** — `handleImages` **هو** multer (`upload.fields()` في `imageServices/config/cloudinary-image.image.js:166`)، يعني هو نقطة الـ parse نفسها. قبله `req.body = {}` فالـ middleware بيبقى no-op، وبعدين الـ validator بيشوف `''` ويرجّع **400 «toolIds must be an array»**. ولو الـ validator اتخطّاها بـ `checkFalsy`، الـ `''` بتوصل Mongoose وتدّي `CastError: Cast to [ObjectId] failed for value "[ '' ]"`. الفرعين مكسورين.
      ⚠️ **الشرط مش «قبل Mongoose»** (ده صح بس فضفاض — Mongoose في آخر السلسلة أصلاً). الشرط: **بعد multer** عشان يشوف الحقل، و**قبل الـ validator** عشان يمنع الـ 400. (`updateImages` بيلمس `req.body.image` بس — مفيش تعارض)
- [ ] `controllers/_projectController.js` — أضف `getOneBySlug` (نظير `_blogController.js` من غير بلوك تتبّع المشاهدات) — `findOne({ enSlug: req.params.enSlug, isActive: true })` + populate `['skills','tools']` + `AppError('No document found with that slug', 404)`
      **لاحظ `isActive: true` جوّه الـ query** — من غيره `isActive: false` بيتحوّل من «مسحوب» لـ «مخفي من القوايم بس الصفحة لسه 200 ومفهرسة في جوجل». الـ blog مبيفلترش `status` — ده عيب كامن هناك، مش نمط يتقلّد
- [ ] `routes/projectRoutes.js` — `router.route('/slug/:enSlug').get(controller.getOneBySlug)` (حطها زي مكان نظيرتها في `blogRoutes.js` للقراءة، الترتيب مش فارق لـ Express)
- [ ] `controllers/_homeFeaturedController.js` — وسّع الـ nested populate لـ `[{ path: 'skills' }, { path: 'tools' }]`
- [ ] `npm run lint` نضيف
- [ ] فحص يدوي: `PATCH /projects/:id` بتعديل `title` بس على مشروع قديم **بينجح** (مفيش 500 من `role` الغايب)
- [ ] فحص يدوي: `POST /projects` من غير `url` ولا `repoUrl` بترجع **400** برسالة واضحة
- [ ] فحص يدوي: `GET /projects/slug/warraq` بترجع **404** نضيفة (لسه محدش عنده `enSlug`)
- [ ] 🔴 فحص يدوي حرج: `PATCH /projects/:id` بـ `toolIds: ''` في multipart body **بينجح** ويحفظ `toolIds: []` — مش 400 ولا CastError. ده اللي بيثبت إن مكان `normalizeToolIds` في السلسلة صح؛ لو فشل، `db M2` كله مقفول
- [ ] **انزل لوحدك**

### Milestone 3: التضييق — `role` و`enSlug` يبقوا مجبرين
- [ ] ⛔ **شرط مسبق صارم:** خطة الـ db → Milestone 2 (ملء الـ 4) خلصت بالكامل. تأكد عبر `GET /projects` إن الـ 4 كلهم عندهم `role` مش فاضي و**4 قيم `enSlug` مختلفة ومش فاضية** (الـ `''` بتعدّي شرط «مختلفة» حرفياً لو slug واحد بس فاضي). من غير ده، بناء الـ unique index **بيفشل بصمت** عند أول restart (مفيش E11000 ظاهر — Mongoose بيبلعه، زي ما قسم المخاطر شارح بالتفصيل) والقيد عمره ما يتوجد — الكشف بالبوابة المزدوجة تحت (`getIndexes` + الفحص الوظيفي)، مش باللوج
- [ ] `models/projectModel.js` — `role.required` → `[true, 'Role is required']`
- [ ] `models/projectModel.js` — `enSlug` → `required: [true, 'enSlug is required']` + `unique: true` — **من غير `index: true`**. `unique: true` لوحده بيولّد نفس الـ spec بالظبط (`[[{"enSlug":1},{"unique":true,"background":true}]]`)، وبما إن M2 مبناش أي index، ده بيبقى **أول إنشاء** فبيتنفذ فعلاً
- [ ] `middleware/validators/project.validator.js` — `createProjectRules`: `role` و`enSlug` يشيلوا `.optional()` ويضيفوا `.notEmpty()`
- [ ] `npm run lint` نضيف
- [ ] 🔴 **النزول المشترك (server M3 + db M3 في push واحد) — قبل أي فحص من اللي تحت:** الـ unique index مش بيتبني غير عند `mongoose.connect` (`server.js:18-20`)، يعني **تعديل الموديل لوحده مبيعملش القيد** — الإنتاج بيفضل شغال كود M2 (اللي بيعلن **صفر** indexes على `enSlug` — بند الـ `enSlug` في M2) لحد ما العملية تعيد الاتصال.
      ✅ **نزول واحد مشترك، مش اتنين:** اعمل commit واحد بيلمس `apps/server/**` و`apps/db/**` مع بعض. ده بيحقق شرط التزامن مع db M3 **وبند النزول ده في نفس الوقت** — `scripts/deploy.sh` بيمشي بالترتيب client → db (build) → **server (`pm2 startOrRestart … --only server`، آخر خطوة)**، فالسيرفر بيبقى حيّ بالكود الجديد قبل ما تبدأ البوابة، وdb M3 بينزل قبله (الاتجاه الآمن: الفورم أصرم من الموديل). ⛔ **متنزّلش server M3 لوحده** وتسيب db M3 لـ push تاني — ده بيكسر عقد التزامن المكتوب في آخر بند هنا وفي `db:150`.
      ⛔ **البوابة تحت لازم تتبعت على `https://api.beingmomen.com` (الإنتاج) بعد النزول** — ومتعتمدش على `pnpm dev:server` المحلي كبديل ضمني: هو بيوصل نفس Atlas الإنتاج (`server.js:16` بياخد `DATABASE_ATLAS` من غير أي فرع `NODE_ENV`) وnodemon بيعيد الاتصال عند الحفظ فبيبني الـ index فعلاً — بس ساعتها اللي اتفحص كود مش منزّل، والبوابة بتقيس بيئة غير اللي هتخدم الزوار. ⚠️ **والأخطر إن الأثر باقي:** التشغيل المحلي ده بيسيب `enSlug_1 unique` **مبنية فعلاً على قاعدة الإنتاج** — فالـ `getIndexes` تحت هتطلع خضراء حتى لو كود M3 عمره ما نزل.
      🔴 **الفحص القاطع إن الكود حيّ (observable، مش ذاكرة):** `POST /projects` **من غير `role`** لازم ترجّع **400**. ده بيفرّق M3 عن M2 قطعياً (في M2 الـ `role` اختياري → الطلب بينجح)، وهو مستقل تماماً عن حالة الـ index فمبيتلخبطش مع البوابة تحت. ⛔ **متعلّمش البند ده على «عملت push» ولا على «شغّلت `pm2 restart`»** — الاتنين مش دليل: `scripts/deploy.sh` فيه `set -euo pipefail` وبيبني db **قبل** restart السيرفر (آخر خطوة)، فأي فشل في build الـ db (الـ 4GB heap · `GIGET_AUTH` للـ base layer الخاص — «Without it the build fails» بنص `apps/db/CLAUDE.md` · سابقة الـ CRLF في env vars) بيوقف السكربت و**restart السيرفر عمره ما يتنفذ**، والكود القديم بيفضل حيّ في صمت رغم إن `apps/server/**` اتغيّر. قنوات تأكيد إضافية: الـ GitHub Actions run لازم يبقى **أخضر** (وصل `== deploy done ==`)، أو `pm2 describe server` على الـ VPS.
      **ليه ده بند مستقل وأول:** حالة «الكود مش منزّل» بتنتج **نفس إشارتي الفشل الصامت بالبايت** (201 + `enSlug_1` غايبة من `getIndexes`) — فالبوابة المزدوجة **مش بتفرّقها**، والتعافي بيثبّت تشخيصاً كاذباً ويقفل لوب (الحارس المشترك تحت). ده الفرق الوحيد بينها وبين كل مصادر الغموض التانية: الـ ground truth نفسه بيتخدع. وعشان كده البُعد ده لازم يبقى ليه **observable** زي إخواته (الـ index → `getIndexes`؛ الـ payload → `GET /projects` الحي) — «أكّد إنك نزّلت» تذكُّر فعل، مش قياس حالة.
- [ ] ✅ **البوابة المزدوجة — فحص وظيفي + `getIndexes`، الاتنين لازم يعدّوا:** `POST /projects` بـ `enSlug` موجود بالفعل لازم يترفض **بـ 500 تحديداً**، والـ 500 دي **مؤشر مش إثبات** — بتتقفل بفحص الـ `getIndexes` (البند اللي بعده). ⛔ **اللوج مش مصدر موثوق هنا** — Mongoose بيبلع أخطاء بناء الـ index بصمت (`mongoose.js:670` بيعمل `.catch(noop)` وقت الـ compile → `$caught=true` → `model.js:1690` مبيعملش `emit('error')` أبداً). فحص «شوف اللوج» بيعدّي حتى لو الـ index مااتبناش.
      🔴 **انضباط الـ payload — الـ false pass هنا أسهل من الفشل الحقيقي:**
      - **`title` جديد مش مكرر — الحقل الوحيد المكرر في الـ payload هو `enSlug`.** السبب: `title` عليه `unique: true` قايم فعلاً (`projectModel.js:7-13` — index اسمه `title_1` موجود على Atlas من زمان)، والطريقة الطبيعية لبناء «payload كامل صالح» هي نسخ مشروع موجود — وساعتها الرفض بييجي من `title_1` بـ E11000 → **نفس الـ 500 الجينيريك بالبايت** («Something went wrong!» — الـ E11000 في `errorController.js:140-142` بياخد `isHandled` من غير `isOperational` ولا اسم حقل) → الفحص يتسجّل ✓ والـ `enSlug_1` مش موجود أصلاً
      - **`isActive: false` بالحروف الصغيرة حرفياً** (`'false'` أو `'0'` — الـ cast بتاع Mongoose exact-match، مثبت بالتشغيل على 8.24.0: `FALSE` بترمي CastError → 400 مالوش علاقة بالـ index). ومن غير `isActive: false` أصلاً، الـ doc التجريبي (الافتراضي `true`) **بيعدّي فلتر الكلاينت** (`isActive=true`) ويظهر على الموقع العام فوراً لو الفحص فشل
      - **الـ `enSlug` المكرر يتاخد نسخاً من response `GET /projects` الحي لحظة الفحص** — مش من الذاكرة ولا من أمثلة الخطط (قيم db M2 المقترحة محتوى مش قيد — اللي اتكتب فعلاً وقت الـ backfill ممكن يكون مختلف). قيمة مش مكررة فعلاً بتدّي **201 والقيد سليم 100%** — وفرع الـ 201 تحت بيمسكها بالـ `getIndexes` قبل ما توصل للتعافي
      **قراءة النتيجة:**
      🔴 **حارس مشترك على العمود «`enSlug_1` غايبة» — بيتطبّق على الـ 500 والـ 201 سوا، قبل أي تعافي:** أي فرع بينتهي بـ«الـ `getIndexes` مش موراية `{name:'enSlug_1', unique:true}`» **لازم يعدّي الأول على: هل كود M3 حيّ فعلاً؟** السبب: كود M2 المنزّل بيعلن **صفر** indexes على `enSlug`، فحالة «مش منزّل» بتنتج **نفس التوقيع بالظبط** بتاع الفشل الصامت الحقيقي — من الجهتين (201 لأن مفيش قيد؛ و500 لو الرفض جه من Cloudinary/عطل عابر). والتعافي في الحالة دي بيثبّت تشخيصاً كاذباً: خطوة 2 بتعدّي (الـ 4 سليمين) والنص بيقول «ده غالباً السبب الأصلي» فبيوجّه الشك بعيد عن النزول، وخطوة 3 `dropIndex` بترجّع `IndexNotFound` واللي سطر «طبيعي ومُشخِّص» بيأكّده، وخطوة 4 `pm2 restart` **مش deploy** — بترجّع نفس كود M2 → **لوب مقفول بيلمس الإنتاج كل لفة**.
      ⛔ **«الـ push اتعمل» مش دليل إن الكود حيّ** — `scripts/deploy.sh` فيه `set -euo pipefail` وبيبني db **قبل** restart السيرفر (آخر خطوة)، فأي فشل في build الـ db (الـ 4GB heap · `GIGET_AUTH` للـ base layer الخاص · سابقة الـ CRLF) بيوقف السكربت و**restart السيرفر عمره ما يتنفذ** — الكود القديم بيفضل حيّ في صمت رغم إن `apps/server/**` اتغيّر. الفحص القاطع في بند النزول فوق.
      **الخلاصة للفرعين:** الكود حيّ مؤكَّد → كمّل قراءة الفرع تحت؛ الكود مش حيّ → **انزل وأعد الفحص من أوله، مفيش تعافي خالص** (بس امسح أي doc اتعمل عبر `DELETE /projects/:id` — مش يدوي من Atlas، الصورة بتتيتّم).
      - **500** «Something went wrong!» = مؤشر إيجابي — **اقفله فوراً بالـ `getIndexes`** (بند الـ `getIndexes` تحت). ⛔ الـ 500 لوحدها **مش إثبات**: فيه مصدرين 500 تانيين بنفس الشكل بالبايت — فشل رفع Cloudinary (الـ upload error بيترمي **raw من غير لفّ في AppError** — `cloudinary-image.image.js:39-44`؛ والصورة **مجبرة** في الـ model فمفيش طريقة تتجنب الرفع؛ وسابقة الـ CRLF في env vars بتخلي credential بايظ سيناريو حقيقي هنا) أو عطل Atlas عابر وقت الـ `create`. **والاتنين بيعدّوا فحص «مفيش doc اتعمل» برضه** — فمتعتمدش عليه كتأكيد
      - **500 + `getIndexes` من غير `enSlug_1`** = ⛔ **عدِّ الحارس المشترك فوق الأول** (الكود حيّ؟). **الكود حيّ مؤكَّد** → الـ 500 كانت infra (رجّح Cloudinary — جرّب رفع صورة من الداشبورد للتشخيص) **والـ build فشل بصمت** → مفيش doc يتمسح؛ ادخل مسار التعافي **من الخطوة 2**. **الكود مش حيّ** → التشخيص ده **غلط تماماً** (مفيش build اتحاول أصلاً، والـ 500 من Cloudinary مصادفة متلبّسة) → انزل وأعد الفحص من أوله، **من غير تعافي**
      - أي **400** = الـ payload غلط والفحص **ماتقاسش** — صلّح وأعد
      - **201** = مؤشر فشل — **اقفله هو كمان بالـ `getIndexes` قبل أي تعافي**: لو `enSlug_1` بـ `unique: true` **موجودة** → القيد سليم والـ payload هو الغلط (الـ `enSlug` المرسل مش مكرر فعلاً) — امسح الـ doc اللي اتعمل، خد القيمة نسخاً من `GET /projects` الحي، وأعد الفحص — **من غير `dropIndex`**؛ لو غايبة أو موجودة من غير `unique` → ⛔ **عدِّ الحارس المشترك فوق الأول** (الكود حيّ؟). **الكود حيّ مؤكَّد** → القيد مش موجود فعلاً → مسار التعافي من الخطوة 1. **الكود مش حيّ** → انزل وأعد الفحص من أوله، **مفيش تعافي** — بس امسح الـ doc الخامس اللي اتعمل عبر `DELETE /projects/:id` (مش يدوي من Atlas)
      وفي كل الحالات أكّد إن مفيش doc اتعمل (`GET /projects` بنفس الـ total)
- [ ] ⚠️ **مسار التعافي لو الفحص فشل** — ⛔ **مدخله مقفول بالحارس المشترك: متدخلش هنا خالص إلا لو كود M3 حيّ ومؤكَّد** (لو مش حيّ، الطريق هو «انزل وأعد الفحص»، مش التعافي — التعافي هنا بيثبّت تشخيصاً كاذباً ويقفل لوب). المدخلان المشروعان: الـ POST رجّع **201** والـ `getIndexes` أكّدت إن القيد غايب أو من غير `unique` (ابدأ من الخطوة 1)؛ أو فرع «**500 مع `enSlug_1` غايبة**» **والكود حيّ** — ساعتها ابدأ من الخطوة 2 مباشرةً، مفيش doc اتعمل: في حالة الـ 201 اتعمل مشروع خامس حقيقي على Atlas الإنتاج بـ `enSlug` مكرر (مكرر **فعلاً** — فحص الـ `getIndexes` بتاع فرع الـ 201 هو اللي حسم إن المشكلة مش في الـ payload). بالترتيب:
      1. **امسحه فوراً** — `DELETE /projects/:id` (بيمسح الـ doc + صورته من Cloudinary + مرجعه في HomeFeatured — متستخدمش مسح يدوي من Atlas، الصورة بتتيتّم)
      2. **أعد فحص بوابة الشرط المسبق** — `GET /projects` → 4 قيم `enSlug` مختلفة **ومش فاضية**. ده غالباً السبب الأصلي لفشل الـ build؛ مسح الـ doc التجريبي لوحده **مش بيشيله**، ومن غير الخطوة دي اللوب بيقفل: restart → build يفشل بصمت تاني → فحص يرجّع 201 تاني
      3. `db.projects.dropIndex('enSlug_1')` — **على نفس القاعدة المحددة في بند الـ `getIndexes` تحت (`beingmomen` على `etqancluster`، بتأكيد الهدف بالـ `updatedAt`) — مش `beingmomen-demo`**؛ ده فعل تدميري على الإنتاج، والقاعدة الغلط بتدّي `IndexNotFound` مطابقة تماماً. لو رجّعت **IndexNotFound وإنت متأكد من الهدف ده طبيعي ومُشخِّص** (الـ build فشل فمفيش index أصلاً — إنت في فرع البوابة المخروقة)؛ لو نجحت يبقى M2 كان نزل index بالغلط (فرع الفخ القديم)
      4. restart وأعد الفحص الوظيفي من أوله
      السبب العام: إعادة بناء الـ index بتفشل **بصمت تاني** طول ما أي duplicate موجود — القيد عمره ما هيتوجد مهما اتعمل restart
- [ ] **`db.projects.getIndexes()` بتوري `{ name: 'enSlug_1', unique: true }` — نُص البوابة، مش فحص تكميلي:** ده الـ **ground truth** الوحيد على وجود القيد (MongoDB مش بيقدر يرجّع الشكل ده والقيد مش مطبّق)، وهو الكاشف الوحيد اللي بيفرّق فخ M2 القديم (`enSlug_1` موجودة **من غير** `unique`) عن الغياب الكامل. الـ milestone مبيتعلمش ✓ غير بالاتنين مع بعض: الـ 500 المنضبطة + الشكل ده في `getIndexes`
      🔴 **القناة والهدف — الفحص ده الوحيد في الميزة كلها اللي مش `curl` على الـ API، فلازم يتحدد بالاسم:** شغّلها على قاعدة **`beingmomen`** على **`etqancluster`** تحديداً — إما من **Atlas UI → Data Explorer → collection `projects` → tab الـ Indexes** (دوّر على badge `UNIQUE` جنب `enSlug_1`)، أو `mongosh "<DATABASE_ATLAS>"` بالسلسلة من **`.env` الحيّ على الـ VPS** (أو repo variable `SERVER_ENV_PROD`).
      ⛔ **متجيبش السلسلة من `apps/server/.env.prod`** — بيشاور على **`beingmomen-demo`**: نسخة كاملة على **نفس الكلاستر**، بنفس الـ 4 docs ونفس الـ `_id`s ونفس قايمة الـ indexes بالظبط (متحقَّق بـ probe قراءة-فقط). `getIndexes` عليها بتدّي «`enSlug_1` غايبة» **بنفس الشكل بالبايت** بتاع الفشل الحقيقي → فرع سطر 174 → `dropIndex` + restart على تشخيص كاذب → لوب مقفول والقيد سليم في الإنتاج طول الوقت. والاتجاه العكسي أسوأ: أي تشغيل محلي سابق بـ `.env.prod` بيبني `enSlug_1 unique` في `-demo` → البوابتين خُضر والقيد **مش موجود** في الإنتاج. (الحيّ الفعلي: `.env` → `…/beingmomen`؛ و`server.js:16` بياخد `DATABASE_ATLAS` من غير أي فرع `NODE_ENV`.)
      ✅ **أكّد الهدف قبل ما تقرا النتيجة:** `updatedAt` لمشروع معروف في القاعدة اللي إنت عليها لازم يطابق اللي `GET https://api.beingmomen.com/api/v1/projects` بيرجّعه. من غير التأكيد ده، «غايبة» متلبّسة بين «القيد مش موجود» و«إنت على القاعدة الغلط»
- [ ] فحص يدوي: `PATCH` على أي مشروع من الـ 4 لسه بينجح
      (فحص «`POST /projects` من غير `role` → 400» اتنقل لبند النزول فوق — هو الـ observable القاطع إن كود M3 حيّ، ولازم يسبق البوابة مش يتبعها)
- [ ] ℹ️ **التنسيق مع خطة الـ db → Milestone 3 (نفس التضييق في الـ Zod schema) اتنفّذ خلاص في بند النزول المشترك فوق** — الاتنين نزلوا في push واحد قبل البوابة. البند ده **إحالة خلفية للتأكيد، مش أمر نزول تاني**: مفيش نزول تاني في M3، ومتأجّلش أي جزء منه لبعد البوابة (ده بيرجّع فخ «البوابة بتقيس كود مش منزّل»)
