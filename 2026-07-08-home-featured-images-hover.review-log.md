# سجل مراجعات: مشاريع الهوم المميزة + إصلاح الصور + توحيد الـ hover

> يغطي (multi-project، نفس الـ slug+date، اتناقشوا معًا):
> - `apps/client/Plan/2026-07-08-home-featured-images-hover.md`
> - `apps/server/Plan/2026-07-08-home-featured-images-hover.md`
> - `apps/db/Plan/2026-07-08-home-featured-images-hover.md`

## جدول الجولات

| جولة | التاريخ | 🔴 | 🟠 | 🟡 (للـ backlog) | الحالة |
|---|---|---|---|---|---|
| 1 | 2026-07-08 | 0 | 3 | ~10 | اتصلحت |
| 2 | 2026-07-08 | 0 | 4 | 1 جديد | اتصلحت |
| 3 | 2026-07-08 | 0 | 0 | 2 جديد + 1 تحديث + 3 pre-existing | نظيفة ✅ |
| 4 | 2026-07-08 | 0 | 1 | 0 جديد | اتصلحت |
| 5 | 2026-07-08 | 0 | 0 | 1 جديد | نظيفة ✅ |
| 6 | 2026-07-08 | 0 | 0 | 2 جديد | نظيفة ✅ 🔒 |

**حالة الخطة: 🔒 مقفولة (جولتين نظاف متتاليين: 5 و6)** <!-- جولة 6 نظيفة (0🔴/0🟠) بعد جولة 5 نظيفة → جولتين متتاليتين → قفل (حساب حسابي من الجدول). الخطوة الجاية: /my-improve (اختياري، مرة واحدة، للـ 🟡 backlog) ثم /my-implement. لفتح جولة كاملة تانية على خطة مقفولة محتاج override صريح («افتح بالعافية») أو مراجعة تفاضلية لتغيير مُسمّى. -->

---

## جولة 1 — 2026-07-08

**اللي اتغيّر من الجولة اللي فاتت:** (جولة 1 — مفيش جولة قبلها. الـ review اشتغل من جذر الـ workspace على الـ 3 خطط معًا بـ 4 lenses بالتوازي: data model & lifecycle، cross-project contract، library & API syntax، security & auth.)

### النتايج والقرارات

- [x] 🟠 #1 **`GET /home-featured` controller: غموض `findOne` vs `getSingleton`** — خطة الـ server فيها تناقض بين معيار القبول («singleton doc») ومواصفة الـ controller («findOne singleton»). `getSingleton` بتنشئ سجل كـ side-effect للـ GET → `{data:[{}]}` → بيككسر الـ db empty-state branching (`if (existing.value?.data?.[0])`) وبيخلّي `isEditing` true دايمًا. — **قرار:** اتصلح. وضّح الخطة: `getHomeFeatured` (GET `/`) تستخدم `findOne()` (ترجع `null` لو مش موجود)؛ `getSingleton()` بس في POST/PATCH. عدّل معيار القبول + مواصفة الـ controller + Milestone 2. أضف edge case «GET routes عامة (بدون `protect`)» + 3 قرارات محسومة. — **دليل التحقق:** `_infoController.js:22-29` بيستخدم `Model.findOne()` (مش `getSingleton`) → `data:[null]` لو مش موجود؛ `roadmapSettingsModel.js:28-34` بتعرّف `getSingleton` بس مش مستخدمة في GET؛ خطة db السطر 49 معتمدة على `data?.[0]` تكون `null`. اللينز 2 (contract) اتأكد مستقلًا إن الـ db page logic شغّال صح بس لو الـ GET بيرجّع `[null]`.

- [x] 🟠 #2 **كاب الـ GIF بـ `w_800`: root-cause غير متحقّق منه، الـ fix بيمزج متغيرين** — الخطة مسجّلة كـ «قرار محسوم» إن «Cloudinary بترفض GIF أكتر من ~800px». اللينز 3 لقى إن ده مش موثّق في Cloudinary docs، وإن الـ fix بيمزج شيل `f_auto` + كاب width من غير عزل. — **قرار:** اتصلح بعد **executable verification**. شغّلت 4 curl variants على الـ GIF المكسور فعلاً (`.../v1739631594/.../iv8rhzoktiaswedzt9ez.gif`):
  - `f_auto,q_auto,w_1152` → **400**
  - `q_auto,w_1152` (بدون `f_auto`) → **400** + `X-Cld-Error: Maximum total number of pixels in all frames/pages is 50 Megapixels. Requested 84.35 Megapixels`
  - `f_auto,q_auto,w_800` → **200** (5,371,897 bytes)
  - `q_auto,w_800` (بدون `f_auto`) → **200** (5,371,897 bytes — مطابق لـ variant 3)
  
  **الـ root cause الفعلي = حد 50MP إجمالي pixels في كل الـ frames** (مش «حد 800px»). `f_auto` مش الجاني (variant 2 بدونه لسه 400). الكاب `w_800` مطلوب وصح (مش regression — الـ GIF فيزيائيًا مش ممكن بـ w_1152). صُحّح الـ rationale في «القرارات المحسومة» (client + server) + أضيف edge case للـ many-frame GIF (ممكن يفشل حتى عند 800×450 لو frames > ~138). — **دليل التحقق:** 4 curl variants فوق + [Cloudinary animated images docs](https://cloudinary.com/documentation/animated_images) (مفيش حد 800px موثّق). الكاب المحافظ: max width للـ GIF ده ≈ `1152 × √(50/84.35)` ≈ 887px، فـ 800 safe بهامش ~10%.

- [x] 🟠 #3 **الـ cascade hook بيشتغل على كل تعديل مشروع inactive** — الـ `post('findOneAndUpdate')` hook بيبص على `doc.isActive === false` من غير ما يتأكد إن الـ update لمس `isActive`. → no-op re-saves + `updatedAt` churn على الـ singleton + VersionError محتمل (500 على تعديل مشروع) لو admin sessions متزامنة. — **قرار:** اتصلح. ضيّق الـ hook بـ فلتر `this.getUpdate()`: شيل بس لما الـ update نفسه يحوي `isActive` (top-level أو تحت `$set`/`$unset`) **و** `doc.isActive === false`. الـ delete hook (`post('findOneAndDelete')`) من غير شرط (المسح دايمًا إزالة). عدّل مواصفة الـ hook (المناطق المتأثرة + Milestone 3) + أضف قرار محسوم. — **دليل التحقق:** `handlerFactory.js:37-58` (`updateOne` بيستخدم `findByIdAndUpdate({new:true})` على كل تعديل، من غير فلترة fields)؛ `projectRoutes.js:35-43` (PATCH `/:id` → `controller.updateOne`).

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **شكل `tags`/`skills` في الـ contract:** خطة client السطر 56 بتطلّب إن `/home-featured/populated` يرجّع نفس شكل `/projects` بما فيهم `tags` — بس `projectModel.js` مفيهوش `tags` (فيه virtual اسمه `skills`). ده pre-existing bug في الـ template بيستخدم `project.tags` (undefined). كمان خطة الـ server مش بتحدد nested populate للـ `skills` virtual على الـ populated Projects، فالشكل مش هيتطابق مع `/projects` (اللي بيستخدم `popOptions:['skills']`). مفيش regression (الـ template مكسور أصلاً)، بس الـ contract claim مضلّل. عند الـ implementation: إما نزّل `tags` من الـ claim، أو صلّح الـ template لـ `project.skills` + ضيف nested populate في الـ server.
- **`setProjectsList` mapping ضمني:** خطة db بتقول map لـ `{id, name, image, slug}` وبتشير لـ `setSkillsList` كـ pattern، بس ما بتكتبش صراحة `id: p._id, name: p.title` (الـ server بيرجّع `_id` + `title`). لو المنفّذ عمل spread `{...p}` بدل remap → `value-key="id"` / `label-key="name"` هيرسموا قيم undefined. الخلّي يكتب الـ mapping صراحة في الخطة.
- **`/projects/all` bare array (مش enveloped):** `getAllNoPagination` بيرجّع array مباشر (مش `{data:[...]}`). الـ db page logic بتفرّق بين `existing.value?.data?.[0]` (لـ home-featured enveloped) و`projectsData.value` (لـ /projects/all bare). الخطة بتتعامل صح بس ما بتقولّش الفرق صراحة — سطر توضيحي يمنع غلطة wrap بالـ `.data`.
- **تبرير `runValidators` غير دقيق:** خطة server السطر 58 بتقول إن `findOneAndUpdate({runValidators:true})` مش هيشتغل للـ custom array validator. ده مش دقيق — Mongoose 8 بيشغل array-level `validate` لما الـ array كله يتـ `$set`. اختيار `doc.save()` safe وبس، بس التبرير غلط. ممكن نوحّد الـ PATCH مع نمط `infos` (`findOneAndUpdate` upsert) بدل getSingleton+save.
- **تكرار validators:** `express-validator` `isArray({max:3})` + Mongoose `validate: v.length<=3` متكررين. غير ضار، بس خلّي واحد كـ source of truth.
- **M1 executable check cleanup:** `getSingleton` بتنشئ doc على أول call، فdoc متبقّي من run سابق يخلي الـ check non-deterministic. الخطة بتذكر cleanup بس لازم تحذف كل docs `HomeFeatured` قبل assertions الـ 4-ref/3-ref.
- **`crop:'fill'` للـ GIF:** ممكن يعمل crop مش resize لو الـ aspect ratio مش 16:9. اختبار فعلي مطلوب بعد الـ implementation (البديل `crop:'limit'`).
- **`NuxtImg @error` characterization:** الـ `@error` emitted event مش «native event» بالظبط (NuxtImg بتعمل `defineEmits` + synthetic `emit('error')` in `onMounted` للـ SSR-broken). المقارب شغّال، بس فيه brief flash قبل ما `failed` يتقلب. يُفضّل reset `failed` على تغيير `src` لو `ProjectImage` اتُعاد استخدامها بدون `:key` (الـ v-for `:key="project._id"` بيحمي حاليًا). *(اتصحّح في جولة 3: ده re-emitted native `<img>` error event مش synthetic — انظر تحديث الـ backlog في جولة 3.)*
- **`Zod message` deprecated alias:** `.max(3, {message:'...'})` — `message` deprecated في Zod 4 لصالح `error`. شغّال ومطابق لـ convention الـ codebase. للـ forward-compat: `.max(3, {error:'...'})` أو `.max(3, '...')`.
- **(مدمج في #1) «GET عام» implicit:** اتعمل كـ settled decision + edge case ضمن fix #1.

### قرارات محسومة اتضافت للخطط

- **(server)** `getHomeFeatured` (GET `/`) تستخدم `findOne()` مش `getSingleton()` — السبب: `findOne` بترجع `null` → `{data:[null]}` وده اللي الـ db empty-state بيعتمد عليه.
- **(server)** `getSingleton()` تُستخدم بس في POST/PATCH — السبب: الـ upsert-side-effect يحصل بس لما الأدمن يعمل save.
- **(server)** GET `/` و GET `/populated` عامة (بدون `protect`) — السبب: الـ client landing cross-origin من غير auth؛ `protect` على POST/PATCH بس.
- **(server)** الـ cascade hook `post('findOneAndUpdate')` بيتضيّق بـ `this.getUpdate()` فلتر — السبب: شيل بس لما الـ update يلمس `isActive` (تجنّب no-op re-saves + VersionError).
- **(client + server)** تصحيح rationale كاب الـ GIF: حد Cloudinary **50MP إجمالي frames-pixels** (مش «حد 800px»)؛ `f_auto` مش الجاني؛ الكاب `w_800` مطلوب وصح.

---

## جولة 2 — 2026-07-08

**اللي اتغيّر من الجولة اللي فاتت (دifferential pass):** إصلاحات جولة 1 التلاتة اتإكلت في الخطط:
1. `getHomeFeatured` (GET `/`) بقت `findOne()` مش `getSingleton()` (server controller + معيار القبول + M2 + edge case «GET عامة»).
2. rationale كاب الـ GIF اتصحّح لـ «50MP إجمالي frames-pixels» في القرارات المحسومة (client + server) + edge case للـ many-frame GIF.
3. cascade hook `post('findOneAndUpdate')` اتعملله تضييق بـ `this.getUpdate()` فلتر (server hook + M3 + قرار محسوم).

**طريقة الجولة:** 4 lenses بالتوازي على الـ 3 خطط معًا — data model & lifecycle، cross-project contract، library & API syntax، security & auth. الـ differential pass اتأكد إن إصلاحات جولة 1 سليمة (مفيش regression في الإصلاحات نفسها). lenses 2 + 3 طلعت 0 findings. lenses 1 + 4 طلعوا 4 🟠 جديدة (كلها في خطة الـ server).

### النتايج والقرارات

- [x] 🟠 #1 **cascade hooks بتعمل 500 لو الـ HomeFeatured singleton مش موجود** — الترتيب الواقعي: الأدمن بيتظبط المشاريع قبل ما يـ POST لـ `/home-featured` → `HomeFeatured.findOne()` بترجع `null` → `null.projects.filter` throws → 500 على تعديل/مسح مشروع. — **قرار:** اتصلح. ضيف `if (!featured) return;` early return في الـ update hook والـ delete hook الإتنين قبل أي filter. عدّل M3 + أضاف قرار محسوم. — **دليل التحقق:** لينز 1 قرأ `roadmapSettingsModel.js:29` (`findOne()` بترجع null لما مفيش doc)؛ خطّة server M3 كانت بتكتب `HomeFeatured.findOne() → featured.projects.filter` من غير guard.

- [x] 🟠 #2 **delete hook مفيهوش `doc === null` guard → 500 بدل 404** — `findByIdAndDelete` بترجع `null` لو المشروع مش موجود (طلبين متزامنين / مسح مكرر) → الـ post hook بيشغّل بـ `doc=null` → `doc._id.toString()` throws → 500، والـ controller's `if (!doc) → 404` ما بيشغلش لأن الـ hook بيسبقه. — **قرار:** اتصلح. ضيف `if (!doc) return;` في أول الـ delete hook. **مش بيقلب قرار «بدون شرط isActive»** — ده guard على وجود `doc` نفسه، مش على `isActive` (نفس نمط `doc && doc.isActive === false` في الـ update hook). عدّل M3 + أضاف قرار محسوم. — **دليل التحقق:** لينز 1 قرأ `handlerFactory.js:19-23` (`findByIdAndDelete` + null check بعد الـ query)؛ Mongoose `post('findOneAndDelete')` بيشغّل بـ `doc=null` لما مفيش match.

- [x] 🟠 #3 **`buildUploadOptions` GIF branch بيكسر رفع GIF لـ 5 services تانية (regression)** — `cloudinary-image.image.js` factory shared بين كل الـ cloudinary services. `gifResize` بيتضاف لـ `project.image.js` بس. باقي services (blog/client/experience/service/testimonial) معندهاش `gifResize` → `findField.gifResize` undefined → `undefined.width` throws → 500 على رفع GIF. **regression** لرفع GIF كان شغّال (بيرجّع static JPEG قبل كده). — **قرار:** اتصلح. الـ GIF branch بيعمل fallback `findField.gifResize ?? findField.resize` + شيل `format:'jpeg'` للـ GIF في الحالتين. عدّل المناطق المتأثرة + M4 + أضاف edge case للـ shared factory + قرار محسوم. — **دليل التحقق:** لينز 1 قرأ `imageService.js:3` + عمل grep على blog/client/experience/service/testimonial image services (كلها cloudinary، مع `resize` بس، من غير `gifResize`)؛ `cloudinary-image.image.js:12` `multerFilter` بيقبل `image/gif`.

- [x] 🟠 #4 **`/projects/all` عام بلا auth بيتسرب لكل المشاريع (incl. inactive) — الخطة بتوسّع التسرب** — `projectRoutes.js:22` مركّب بدون `protect`، و`getAllNoPagination` ما بتعملش فلتر `isActive` → كل المشاريع (incl. drafts) لأي حد مجهول. الخطة بتضيف `slug image altText` فبتوسّع التسرب. — **قرار:** اتصلح بناءً على قرار المستخدم. ضيف `authController.protect` على `/all` route. تأكد إن `/projects/all` بيستخدمه بس الـ db (الـ client بيستخدم `/projects` + `/home-featured/populated` جديد)، وإن الـ db proxy بيوصل `Bearer` token → مش هيتكسر الـ dashboard. عدّل المناطق المتأثرة + M2 + edge case + معيار القبول + قرار محسوم. — **دليل التحقق:** لينز 4 قرأ `projectRoutes.js:22` (لا protect) + `handlerFactory.js:156-173` (لا isActive filter)؛ تأكد إن `/projects/all` مش مستخدم في الـ client (grep على `apps/`)؛ `proxyToBackend.ts:16-25` بيوصل `Authorization: Bearer`.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **(جديد جولة 2)** **«VersionError» misnomer في rationale التضييق:** لينز 1 لقى إن Mongoose مش بيفعّل `optimisticConcurrency` by default، فـ `.save()` ما بيتفحصش `__v` → VersionError ما بيحصلش فعليًا. التضييق بـ `this.getUpdate()` لسه ممارسة كويسة (بيتجنّب no-op re-saves)، بس التبرير «تجنّب VersionError» غلط. للـ improve: صحّح التبرير لـ «تجنّب no-op re-saves على admin sessions متزامنة» (شيل كلمة VersionError) في القرار المحسوم (server) + edge case جولة 1.
- (باقي بنود جولة 1 الـ ~10 لسه في الـ backlog فوق — مش متكررة هنا)

### قرارات محسومة اتضافت للخطط (جولة 2 — كلها في خطة server)

- **null guard `!featured` early return في الإتنين cascade hooks** — السبب: الـ singleton ممكن ما يكونش موجود على deploy جديد قبل أول POST؛ الـ guard بيتجنّب 500 على تعديل/مسح مشروع.
- **`!doc` early return في الـ delete hook** — السبب: `findByIdAndDelete` بترجع `null` على المسح المكرر/المتزامن؛ ده guard على وجود `doc` (مش بيقلب قرار «بدون شرط isActive»).
- **`buildUploadOptions` GIF branch fallback `gifResize ?? resize`** — السبب: الـ factory shared بين كل الـ cloudinary services؛ الـ fallback بيتجنّب regression لرفع GIF في 5 services تانية.
- **`/projects/all` خلف `protect`** — السبب: الـ route كان عام بلا auth بيتسرب لكل المشاريع incl. inactive؛ الـ dashboard (اللي بيستخدمه بس) عنده `Bearer` عبر الـ proxy فمش هيتأثر.

**اللي اتغيّر في الخطط من جولة 2 (مدخل جولة 3 التفاضلية):** خطة server بس — 4 إصلاحات: (1) M3 update hook + delete hook ضافوا `!featured` guard، (2) M3 delete hook ضاف `!doc` guard، (3) المناطق المتأثرة + M4 + edge case لـ `buildUploadOptions` GIF fallback، (4) المناطق المتأثرة + M2 + edge case + معيار قبول لـ `/projects/all` protect. 4 قرارات محسومة اتضافوا. خطط client + db ما اتلمسوش في جولة 2.

---

## جولة 3 — 2026-07-08

**اللي اتغيّر من الجولة اللي فاتت (دifferential pass):** إصلاحات جولة 2 الـ 4 اتإكلت في خطة server بس (خطط client + db ما اتلمسوش):
1. M3 update hook + delete hook ضافوا `!featured` early return guard.
2. M3 delete hook ضاف `!doc` early return guard.
3. `buildUploadOptions` GIF branch fallback `gifResize ?? resize` (المناطق المتأثرة + M4 + edge case للـ shared factory).
4. `/projects/all` خلف `protect` (المناطق المتأثرة + M2 + edge case + معيار قبول + قرار محسوم).

**طريقة الجولة:** 4 lenses بالتوازي على الـ 3 خطط معًا — data model & lifecycle، cross-project contract، library & API syntax، security & auth. كل لينز عمل differential pass على إصلاحات جولة 2 (الـ 4 في خطة server) + فحص شامل. التحقق بقراءة الكود الفعلي + المصادر المرجعية (context7 لـ Mongoose 8.24.0 + Zod 4 + Tailwind v4 + Nuxt Image؛ MCP `nuxt-ui-remote` لـ `UPageCard`/`USeparator`؛ base layer source لـ `BaseSelect`/`BaseForm`/`BaseCard`/`proxyToBackend`).

### النتايج والقرارات

**0 findings 🔴/🟠** — الجولة نظيفة عبر الـ 4 lenses كلهم. مفيش نقاط للنقاش ولا إصلاحات على الخطة.

**الـ differential pass (إصلاحات جولة 2 — كلها سليمة، مفيش regression):**
- **لينز 1 (data model):** الـ `!featured` guard سليم (`findOne()` بترجع null → الـ guard بيتجنّب 500). الـ `!doc` guard سليم ومش بيقلب قرار «بدون شرط isActive» (تحقق من Mongoose `lib/model.js:2585` + `lib/query.js:4642`: `post('findOneAndDelete')` بيتـ fire بـ `doc=null` لما مفيش match → الـ guard بيسمح للـ 404 الطبيعي يشتغل). الـ `gifResize ?? resize` fallback سليم (قرأ الـ 5 services التانية — كلها `resize` بس). الـ `/projects/all` protect سليم.
- **لينز 2 (contract):** إصلاح `/projects/all` متوافق مع client + db. الـ db proxy (`proxyToBackend.ts:16-25`) بيوصل `Bearer` → الـ dashboard مش هيتكسر؛ الـ client مش بيستخدم `/all` (grep → 0 matches في كود التطبيق).
- **لينز 3 (library syntax):** `buildUploadOptions` GIF fallback بـ syntax صحيح (`gifResize` config property مش Cloudinary API option، نفس نمط `resize`). الـ `/projects/all` `.get(authController.protect, handler)` chaining صحيح (نفس النمط في `projectRoutes.js:14-19`).
- **لينز 4 (security):** الـ `protect` محطوط على الـ route الصح (`router.route('/all').get(authController.protect, controller.getAllNoPagination)` — M2 السطر 120). الـ db proxy بيوصل Bearer من sealed session. مفيش routes تانية اتأثرت بطريق الخطأ.

**الفحص الشامل (full hunt) — 0 findings 🔴/🟠:**
- **لينز 1:** `HomeFeatured` schema + `getSingleton` + max-3 validator متوافقين مع نمط `roadmapSettingsModel.js`. Singleton lifecycle (`findOne` null → `{data:[null]}` في GET؛ `getSingleton` upsert بس في POST/PATCH) سليم. الـ cascade hook `this.getUpdate()` filter سليم (`findByIdAndUpdate` alias لـ `findOneAndUpdate` → الـ hook بيشتغل؛ `castUpdate.js:107` بيلفّ plain fields في `$set` فـ `$set.isActive` هو الـ path الفعلي). مفيش حقول بتعتمد عليها بدون model.
- **لينز 2:** كل الـ contracts بين الخطط التلاتة سليمة — URL prefixes (`client useAPI` بيبني `${baseURL}/home-featured/populated` = `http://localhost:3001/api/v1/...`، `db useAPI` عبر proxy `/api/home-featured`)؛ envelopes (`client` بتفكّ `.data`؛ `db` بتدخل `.data?.[0]` يدويًا)؛ bare vs enveloped (`/projects/all` bare، `/home-featured` enveloped — الـ db plan بيفرّق صح)؛ field names؛ status codes (404 → `state="error"`، 200 فاضي → `state="empty"`)؛ `useAPI` key + caching.
- **لينز 3:** كل library/API claims متحققة — `UPageCard` + `class="group"` (مؤكد بـ `projects.vue:114`)؛ `NuxtImg @error` re-emitted native event (context7)؛ `BaseSelect`/`BaseForm`/`BaseCard`/`USeparator` props كلها من source؛ Mongoose 8 `post` hooks + `this.getUpdate()` + array-level `validate` (مش بيشتغل على `findOneAndUpdate` → `doc.save()` في PATCH ضروري وصح)؛ express-validator `isArray({min,max})` + `isMongoId` wildcard؛ `scale-[1.03]` Tailwind v4 arbitrary syntax صحيح.
- **لينز 4:** guard coverage على `homeFeaturedRoutes` سليم (GET عامة بالـ نية + POST/PATCH بـ `protect` + `restrictTo(ADMIN,DEV)`). `/populated` بيرجّع بيانات عرض مفلترة بـ `match:{isActive:true}` — مفيش تسرب. الـ client `$api` مبيعتش credentials (cross-origin، GET عام، مفيش CSRF). الـ db proxy بـ inject Bearer من sealed session. `selectFields` على `/all` بيانات عرض بس.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **(جديد جولة 3، لينز 1)** **اثنان من تلاتة checks في الـ update hook unreachable dead code:** تحقق من Mongoose `castUpdate.js:107-118` أوضح إن plain `{isActive:false}` بيتلف دايمًا في `{$set:{isActive:false}}` قبل الـ post hook، و`mongoSanitize` بيشيل أي `$`-key من `req.body`. فـ في `this.getUpdate()`: top-level `isActive` مش بيحصل (دائمًا تحت `$set`)، و`$unset.isActive` unreachable من client. الـ check `$set.isActive` هو الوحيد الفعلي. الـ top-level + `$unset` checks dead code دفاعي (مضّرش). للـ improve: بسّط الـ hook لـ `$set.isActive` check بس.
- **(جديد جولة 3، لينز 3)** **`scale-103` rationale مضلّل لـ Tailwind v4:** الـ plan (client السطر 38 + 54) بيقول «`scale-103` مش default Tailwind» كـ rationale لاستخدام `scale-[1.03]`. في Tailwind v4، `scale-103` dynamic utility بيشتغل (`scale: 103%` ≡ `scale: 1.03`). `scale-[1.03]` صحيح برضو (arbitrary value → `scale: 1.03`). الـ chosen syntax شغّال، بس الـ rationale v3 mindset. للـ improve: شيل الـ rationale أو صحّحه لـ «أنظف explicit arbitrary value».
- **(تحديث جولة 3، لينز 3)** **`NuxtImg @error` characterization — تصحيح لبند جولة 1:** بند جولة 1 فوق بيقول «synthetic `emit('error')`». context7 (`/nuxt/image`) بيقول صراحة إن native events من `<img>` بتـ re-emitted — ده **re-emitted native `<img>` error event** مش synthetic. الـ approach (`@error` → `failed = true`) شغّال صح، بس الـ characterization في الـ backlog اتعدّل.
- **(جديد جولة 3، لينز 4 — pre-existing، مش من الميزة)** **3 بنود defense-in-depth للـ security مستقبلاً:**
  1. `GET /api/v1/projects/:id` عام بلا `protect` وبدون فلتر `isActive` (`projectRoutes.js:33-34` → `handlerFactory.js:80-96`) — أي حد بـ ID معروف يقدر ياخد تفاصيل مشروع inactive/draft. pre-existing، الخطة مش بتلمسه.
  2. `/projects/all` بـ `protect` بس من غير `restrictTo(ADMIN, DEV)` — أي مستخدم authenticated (أي role) يقدر يقرا كل المشاريع. البيانات display-only والـ dashboard admin-gated، بس `restrictTo` كانت تكون طبقة حماية إضافية متوافقة مع `POST/PATCH /:id` في نفس الـ router.
  3. `GET /home-featured` raw بيرجّع ObjectIds للعامة — ممكن يشمل inactive مؤقتًا قبل ما الـ cascade hook يشتغل (race window). ObjectIds مش حساسة لوحدها، بس لو مقترنة بـ `GET /:id` العام (بند 1) ممكن تكشف inactive مؤقتًا. للـ improve: اعمل filter للـ inactive IDs في `getHomeFeatured` raw برضو.
- (باقي بنود جولة 1 + جولة 2 الـ 🟡 لسه في الـ backlog فوق — مش متكررة هنا)

### قرارات محسومة اتضافت للخطط

مفيش قرارات جديدة (جولة 3 = نظيفة، 0 findings 🔴/🟠).

**اللي اتغيّر في الخطط من جولة 3 (مدخل جولة 4 التفاضلية):** مفيش تغيير — 0 findings. الخطط التلاتة سليمة من كل اللينزات الـ 4. إصلاحات جولة 2 الـ 4 كلها مكتوبة صح ومحطوطة على الـ routes/الـ hooks الصح، ومتوافقة مع الـ client + db. الجولة دي أول جولة نظيفة → محتاج جولة 4 نظيفة كمان للقفل.

---

## جولة 4 — 2026-07-08

**اللي اتغيّر من الجولة اللي فاتت (دifferential pass):** مفيش تغيير من جولة 3 (جولة 3 = نظيفة، 0 findings). الجولة دي جولة تقارب (convergence) — محتاجة نظافة كمان للقفل. التركيز: تأكيد إن مفيش regression + fresh hunt في كل بُعد، من غير إعادة تحقق من الصفر في اللي الـ log سجّله كـ verified (rule 3).

**طريقة الجولة:** 4 lenses بالتوازي على الـ 3 خطط معًا — data model & lifecycle، cross-project contract، library & API syntax، security & auth. lenses 2 + 3 + 4 طلعتوا 0 findings. lens 1 طلعت 🟠 واحدة جديدة في خطة server بس.

### النتايج والقرارات

- [x] 🟠 #1 **`getHomeFeaturedPopulated` مفيهاش `!doc` guard → 500 على deploy جديد** — الخطة حرست الـ raw `GET /` (`findOne()` → `{data:[null]}`) و الـ cascade hooks (`!featured`، `!doc`)، بس ملحوظش نفس الـ guard لـ `GET /populated`. مواصفة الـ controller بتقول «populate + `match:{isActive:true}` + filter nulls» والـ "filter nulls" بتفلتر nulls جوّه المصفوفة (refs inactive) مش الـ singleton doc نفسه لو `null`. — **سيناريو الفشل:** deploy جديد قبل أول POST من الأدمن → `HomeFeatured.findOne()` بترجع `null` → `doc.projects.filter` throws → 500 → الـ client `LandingSectionFallback state="error"` بدل `state="empty"` المتوقعة (client plan السطر 50). ده نفس الـ bug class اللي اتصلاح في جولة 1 (raw GET) و جولة 2 (cascade hooks) — الـ populated GET هو المكان الوحيد اللي اتبقى بلا guard متسق. — **قرار:** اتصلح (موافقة المستخدم). أضيف `if (!doc) return res.status(200).json({ data: [] })` guard صريح قبل أي وصول لـ `doc.projects` في: مواصفة الـ controller (المناطق المتأثرة السطر 39 + M2 السطر 116) + edge case «deploy جديد، singleton مش موجود → populated بترجع `{data:[]}`» + معيار قبول «GET /populated على DB فاضي بيرجع `{data:[]} (مش 500)`» + قرار محسوم. **مش بيعكس قرار محسوم** — بيتسقّى مع نمط الـ guards اللي الخطة بنته (raw GET findOne→`{data:[null]}`، cascade hooks `!featured`/`!doc`؛ `getSingleton` بس في POST/PATCH). — **دليل التحقق:** `_infoController.js:22-29` (`findOne()` بترجع null لما مفيش doc)؛ الخطة قرّرت `getSingleton()` بس في POST/PATCH → GET `/populated` على DB فاضي حيصل على null؛ client plan السطر 50 بتتوقع `{data:[]}` → empty مش 500 → error. lens 1 شغّل fresh hunt كامل على الـ data model و ده الـ finding الوحيد اللي نجى (باقي اللي اتفحص كله سليم — انظر تحت).

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

مفيش بنود 🟡 جديدة في جولة 4. (باقي بنود جولة 1 + 2 + 3 الـ 🟡 لسه في الـ backlog فوق — مش متكررة هنا.)

### قرارات محسومة اتضافت للخطط (جولة 4 — في خطة server)

- **`getHomeFeaturedPopulated` بـ `!doc` guard + `findOne()` (مش `getSingleton`)** — السبب: الـ singleton مش موجود على deploy جديد قبل أول POST → `findOne()` بترجع `null` → `null.projects` throws → 500 → الـ client `state="error"` بدل `state="empty"`. نفس نمط الـ guards اللي في الـ raw GET و الـ cascade hooks. الـ guard بيرجع `{data:[]}` بـ 200.

**اللي اتغيّر في الخطط من جولة 4 (مدخل جولة 5 التفاضلية):** خطة server بس — إصلاح واحد: `getHomeFeaturedPopulated` ضاف `!doc` guard (مواصفة الـ controller السطر 39 + M2 السطر 116 + edge case + معيار قبول + قرار محسوم). خطط client + db ما اتلمسوش.

---

## جولة 5 — 2026-07-08

**اللي اتغيّر من الجولة اللي فاتت (دifferential pass):** إصلاح جولة 4 الوحيد اتإكل في خطة server بس (خطط client + db ما اتلمسوش):
- `getHomeFeaturedPopulated` ضاف `if (!doc) return res.status(200).json({ data: [] })` guard قبل أي وصول لـ `doc.projects` (مواصفة الـ controller + M2 + edge case + معيار قبول + قرار محسوم).

**طريقة الجولة:** 4 lenses بالتوازي على الـ 3 خطط معًا — data model & lifecycle، cross-project contract، library & API syntax، security & auth. كل لينز عمل differential pass على إصلاح جولة 4 + fresh full hunt. التحقق بقراءة الكود الفعلي + المصادر المرجعية (context7 لـ Mongoose populate/null semantics + base-layer source لـ `Select.vue`). الـ 4 lenses كلهم طلعوا 0 findings 🔴/🟠.

### النتايج والقرارات

**0 findings 🔴/🟠** — الجولة نظيفة عبر الـ 4 lenses كلهم. مفيش نقاط للنقاش ولا إصلاحات على الخطة.

**الـ differential pass (إصلاح جولة 4 — سليم، مفيش regression):**
- **لينز 1 (data model):** الـ `!doc` guard محطوط بعد `await findOne().populate(...)` وقبل أي وصول لـ `doc.projects`. `findOne()` بترجع `null` لما مفيش singleton (مطابق لـ `_infoController.js:23` + `roadmapSettingsModel.js:29`). على الـ non-null path مفيش regression — Mongoose بيـ default الـ unset array لـ `[]` فـ `doc.projects` دايمًا `[]` على الأقل بعد `getSingleton` create. الشكل `{data:[]}` @ 200 صح للـ consumer (client بيتوقع `.data === []` → `state="empty"`).
- **لينز 2 (contract):** الشكل الجديد `{data:[]}` متسق مع الـ client — `useAPI.ts:46` بيعمل `res?.data ?? res` → `[] ?? res` = `[]` (array فاضي مش nullish) → `featuredProjects=[]` → `v-else-if="!featuredProjects?.length"` → `state="empty"`. الـ 404 path محفوظ (`error.value` → `state="error"`). الـ db مش متأثر (بيستهلك raw `/home-featured` + `/projects/all`، مش `/populated`).
- **لينز 3 (library syntax):** مؤكّد بـ context7 (`/automattic/mongoose`, populate.md): `findOne()` بلا match بترجع `null`؛ `.populate({path,match})` على query بترجع `null` هي no-op (populate مش بيقدر يبعث doc مفقود) → `doc=null` → الـ guard بيشتغل قبل أي وصول لـ `doc.projects`. `res.status(200).json(...)` Express chaining صحيح. الـ array-populate `match` بيستبعد الـ refs غير المطابقة (array فاضي مش null-filled) فالـ `.filter()` الدفاعي غير ضار.
- **لينز 4 (security):** الـ guard بيرجّع array فاضي بـ 200 على GET عام غير مُصادَق — array فاضي مبيسربش حاجة، **مفيش auth/leak surface جديد**. تغيير availability/error-shape بحت، مش أمني.

**الفحص الشامل (full hunt) — 0 findings 🔴/🟠:**
- **لينز 1:** max-3 validator بيشتغل على `create()` (M1) و`doc.save()` (PATCH) — سليم. cascade `post('findOneAndUpdate')`: `handlerFactory.js:39-42` بيستخدم `findByIdAndUpdate({new:true})` فالـ `doc` في الـ post hook بيعكس `isActive` الجديدة → check `doc.isActive===false` صحيح؛ مفيش تعارض مع الـ `pre('findOneAndUpdate')` slug hook (`projectModel.js:96-102`). cascade `post('findOneAndDelete')`: `handlerFactory.js:19` `findByIdAndDelete` → `!doc`/`!featured` guards صحيحة، `id.toString()` comparison على raw ObjectId سليم. الترتيب محفوظ عبر التخزين/populate/`$pull`. كل الحقول اللي الـ flows بتلمسها معرّفة.
- **لينز 2:** URL prefixes سليمة (`/home-featured` مطلوب في `allowedPrefixes` — مخطّط في db M1، مش عيب). envelopes: `getAllNoPagination` bare (`handlerFactory.js:173` `res.json(doc)`) — db بيفرّق صح بين bare (`/projects/all`) و enveloped (`/home-featured`). الـ populated Project shape مطابق لـ `/projects` (full docs بلا `.select()`) → مفيش regression في التبديل.
- **لينز 3:** `BaseSelect multiple` + `value-key="id"`/`label-key="name"`/`items` مؤكّد من source (`Select.vue:13-33`: valueKey default `'id'`، labelKey default `'name'`). `UPageCard` + `class="group"` مؤكّد (`projects.vue:114`). `cloudinaryTransformFor` بيتحقن في `optimizeCloudinary` كـ 2nd arg بشكل صحيح (`cloudinary.ts:25-27`). البنود اللي الـ log سجّلها verified في جولة 3 (NuxtImg @error، Mongoose post hooks + getUpdate + array validate، express-validator، Zod 4، `USeparator label`، Tailwind arbitrary scale) ما اتعادش تحققها (rule 3 — السياق ما اتغيّرش).
- **لينز 4:** verb-level guards على `homeFeaturedRoutes` صحيحة (POST/PATCH بـ `protect`+`restrictTo([ADMIN,DEV])`؛ GET `/` + `/populated` عامة — مطابق `infoRoutes.js:10-30`). `/projects/all` بـ `protect` صحيح وغير كاسر (الـ route عام حاليًا `projectRoutes.js:22` + `getAllNoPagination` بلا isActive filter `handlerFactory.js:156-174` → بيتسرب فعلًا؛ الـ db proxy بيوصل Bearer `proxyToBackend.ts:16-25` → الـ dashboard مش هيتكسر؛ الـ client مش بيستخدم `/all`). `/populated` بـ `match:{isActive:true}` → مفيش تسرب inactive. الـ client `$api` (`plugins/api.ts`) بيبعت `Content-Type` بس — مفيش credentials/cookie/Authorization → مفيش CSRF surface على الـ GETs العامة.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **(جديد جولة 5، لينز 1)** **`deleteMany` (`/delete-all`) بيتجاوز الـ cascade hook:** `projectRoutes.js:24-30` → `factory.deleteAll` → `Model.deleteMany({})` مبيـ trigger‑ش `post('findOneAndDelete')`. bulk delete بيسيب refs مشاريع stale في `HomeFeatured.projects`. الأثر محدود: الـ populated endpoint `match:{isActive:true}` بيفلتر الـ dangling refs لـ `null`→بتتشال (آمن للـ client)، والـ db form عنده fallback «مشروع محذوف» مخطّط (db plan السطر 52). DEV-only ونادر. للـ improve: سطر واحد يوضّح إن ضمان الـ cascade مقصور على `findByIdAndUpdate`/`findByIdAndDelete` المفرد، والـ bulk delete مستثنى.
- **(جولة 5، لينز 1 — مغطّى بقرار محسوم موجود)** race على الـ singleton من deactivations متزامنة (last-write-wins ممكن يسيب ref inactive في الـ raw array) — الـ display صح (populate match بيفلتره)؛ مغطّى بقرار «singleton race مقبول — admin واحد» (server edge case السطر 57). مش بند جديد فعلي.
- (باقي بنود جولة 1 + 2 + 3 الـ 🟡 لسه في الـ backlog فوق — مش متكررة هنا.)

### قرارات محسومة اتضافت للخطط

مفيش قرارات جديدة (جولة 5 = نظيفة، 0 findings 🔴/🟠).

**اللي اتغيّر في الخطط من جولة 5 (مدخل جولة 6 التفاضلية):** مفيش تغيير — 0 findings. الخطط التلاتة سليمة من كل اللينزات الـ 4. إصلاح جولة 4 (`!doc` guard على `getHomeFeaturedPopulated`) مكتوب صح ومتسق مع الـ client + db. الجولة دي أول جولة نظيفة في الستريك الجديد → محتاج جولة 6 نظيفة كمان للقفل.

---

## جولة 6 — 2026-07-08

**اللي اتغيّر من الجولة اللي فاتت (دifferential pass):** مفيش تغيير من جولة 5 (جولة 5 = نظيفة، 0 findings؛ مدخلها كان «مفيش تغيير»). الجولة دي جولة تقارب (convergence) نهائية — لو نظيفة → جولتين متتاليتين (5 و6) → قفل. التركيز: fresh full hunt في كل بُعد + تأكيد إن إصلاح جولة 4 (`!doc` guard على `getHomeFeaturedPopulated`) لسه سليم، من غير إعادة تحقق من الصفر لللي الـ log سجّله verified (rule 3).

**طريقة الجولة:** 4 lenses بالتوازي على الـ 3 خطط معًا — data model & lifecycle، cross-project contract، library & API syntax، security & auth. الـ 4 lenses كلهم طلعوا **0 findings 🔴/🟠**. التحقق بقراءة الكود الفعلي + المصادر المرجعية (Zod 4.4.3 المثبت للـ `{message}` alias runtime، base-layer `Select.vue` source للـ props، `handlerFactory.js` للـ `selectFields`/bare-array، Mongoose null/populate + castUpdate semantics، `mongoSanitize` interaction).

### النتايج والقرارات

**0 findings 🔴/🟠** — الجولة نظيفة عبر الـ 4 lenses كلهم. مفيش نقاط للنقاش ولا إصلاحات على الخطة.

**الـ differential pass (إصلاح جولة 4 — سليم، مفيش regression):**
- **لينز 1 (data model):** الـ 4 null guards على `doc.projects` كلها موجودة وصحيحة (raw GET `findOne`→`[doc]`/`[null]` بلا deref؛ populated `if(!doc) return {data:[]}` قبل أي وصول؛ update hook `!featured`+`doc && isActive===false`؛ delete hook `!doc`+`!featured`). إصلاح جولة 4 ثابت.
- **لينز 2 (contract):** الشكل `{data:[]}`@200 من إصلاح جولة 4 لسه متسق مع الـ client (`res?.data ?? res` → `[]` → `state="empty"`، مش nullish). مفيش regression.
- **لينز 3 (library):** الحاجات اللي الـ log سجّلها verified في جولات 3+5 ما اتعادش تحققها (rule 3 — السياق ما اتغيّرش).
- **لينز 4 (security):** guard coverage على `homeFeaturedRoutes` + `/projects/all` protect لسه سليمين.

**الفحص الشامل (full hunt) — 0 findings 🔴/🟠:**
- **لينز 1:** max-3 validator بيشتغل على `create()` (`getSingleton` create بيـ default `projects=[]`→`0<=3`) و`doc.save()` (PATCH — array-level `validate` بيشتغل على document validation بلا شرط، نمط `projectModel.js:48-53` لـ `skillIds`). cascade `post('findOneAndUpdate')`: `findByIdAndUpdate({new:true})` → الـ post-hook `doc` بيعكس `isActive` الجديدة؛ الـ `isActive`-via-PATCH flow reachable (express-validator ما بيشيلش fields غير مدرجة)؛ مفيش تعارض مع slug pre-hook ولا `counterPlugin` (بيهوك `pre('save')` بس + `$inc` على `Counter` model منفصل، ما بيلمسش `getUpdate()`). ObjectId compare بـ `.toString()` صح على raw ObjectIds.
- **لينز 2:** URL prefixes + envelopes + field names + status→state mapping كلها متسقة على الجانبين. cache key `landing-projects` مستخدم في مكان واحد بس (مفيش stale-shape collision عند إعادة توجيهه لـ `/populated`). mutation body (`{projects:[stringId]}`) → validator `isMongoId` → `doc.save()` سليم.
- **لينز 3:** `cloudinaryTransformFor`/`isGif` نقاط الحقن مطابقة بالظبط (`projects.vue:12-15` = `'f_auto,q_auto,w_1152'`؛ `landing/Projects.vue:18-23` = `'f_auto,q_auto,w_192,h_128,c_fill'`؛ الـ non-gif returns byte-identical → صفر تغيير للـ JPG، الـ GIF بس بيتغيّر). `ProjectImage` props كلها live على `NuxtImg` الحالي. `BaseSelect` props من `Select.vue` source (`multiple`/`items`/`valueKey='id'`/`labelKey='name'`). `getAllNoPagination({selectFields})` مفتاح حقيقي (`handlerFactory.js:161`)؛ `_id` دايمًا مضمّن. Zod `.max(3,{message})` runtime-confirmed على Zod 4.4.3.
- **لينز 4:** `homeFeaturedRoutes` guards مطابقة لـ `infoRoutes.js:10-30` (GET عام + POST/PATCH `protect`+`restrictTo([ADMIN,DEV])`)؛ مفيش DELETE ولا `/:id` مقدَّمة (مفيش verb كتابة بلا حماية ولا خطر تظليل `/:id` لـ `/populated`). `/projects/all` public→protected تضييق حقيقي (بيتسرب فعلًا: `handlerFactory.js:156-174` بلا isActive filter)؛ الـ db proxy بيوصل Bearer من sealed session (مش هيتكسر)؛ الـ client مش بيستخدم `/all`. `selectFields` widening مبيكشفش حاجة جديدة (نفس الحقول متاحة أصلًا للعامة عبر `/projects` + `/:id`). `/populated` بـ `match:{isActive:true}` → مفيش تسرب inactive. `mongoSanitize` (`app.js:100`) بيشيل أي `$`-key من `req.body` قبل الـ routes → الـ `$set.isActive` check بيقرا الـ Mongoose-generated `$set` مش client input.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **(جديد جولة 6، لينز 1)** **no-op save على deactivation لمشروع مش مميّز:** التضييق (جولة 1) بيبوّب على «الـ update لمس `isActive`» بس مش على «المشروع كان فعلًا في `featured.projects`». تعطيل أي مشروع (حتى واحد مش مميّز أبدًا) لسه بيشغّل `HomeFeatured.findOne()` + no-op `filter` + `save()` (updatedAt churn). مفيش failure scenario (الـ filter ما بيزوّدش length فالـ max-3 ما بيتكسرش، ومغطّى بقرار «singleton race — admin واحد»). تحسين اختياري: اعمل `save()` بس لما `featured.projects.length` يتغيّر فعلًا. *(implementation reminder: استخدم optional chaining على `$set` عند قراءة الـ update — `update.$set?.isActive` مش `update.$set.isActive`؛ الـ plan wording بيوحي بده أصلًا.)*
- **(جديد جولة 6، لينز 2)** **صياغة edge-case في خطة db (404 vs 403):** الخطة (db edge case السطر 47) بتقول لو `/home-featured` ناقص من الـ proxy `allowedPrefixes` كل `useAPI('/api/home-featured')` هترجع **404**، بس الـ base-layer catch-all بيرمي **403** `Forbidden proxy path` (`[...].ts:16-18`). تصحيح صياغة بحت (مفيش failure scenario — M1 بيضيف الـ prefix). للـ improve: صحّح «404» لـ «403».
- (باقي بنود جولات 1–5 الـ 🟡 لسه في الـ backlog فوق — مش متكررة هنا.)

### قرارات محسومة اتضافت للخطط

مفيش قرارات جديدة (جولة 6 = نظيفة، 0 findings 🔴/🟠).

**اللي اتغيّر في الخطط من جولة 6:** مفيش تغيير — 0 findings. الخطط التلاتة سليمة من كل اللينزات الـ 4. **جولة 5 + جولة 6 نظاف متتاليين → الخطة اتقفلت 🔒.** الخطوة الجاية: `/my-improve` (اختياري، مرة واحدة، للـ 🟡 backlog المتراكم) ثم `/my-implement`.