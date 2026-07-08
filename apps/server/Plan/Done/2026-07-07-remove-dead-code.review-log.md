# سجل مراجعات: حذف الكود غير المستخدم (متعدد المشاريع)

> يغطي: `apps/server/Plan/2026-07-07-remove-dead-code.md` +
> `apps/client/Plan/2026-07-07-remove-dead-code.md` +
> `apps/db/Plan/2026-07-07-remove-dead-code.md`
> (3 خطط أشقاء مربوطة بـ slug+date `2026-07-07-remove-dead-code`)
> السجل موجود جنب خطة الـ server (المكان اللي المراجعة اتشغّلت منه / اللي فيه النتيجة الوحيدة).

## جدول الجولات

| جولة | التاريخ | 🔴 | 🟠 | 🟡 (للـ backlog) | الحالة |
|---|---|---|---|---|---|
| 1 | 2026-07-07 | 0 | 1 | 4 | اتصلحت (ننتظر جولة 2 نظيفة) |
| 2 | 2026-07-07 | 0 | 0 | 2 | نظيفة ✅ (أول جولة نظيفة — ننتظر جولة 3 نظيفة للقفل) |
| 3 | 2026-07-07 | 0 | 0 | 0 | نظيفة ✅ (تاني جولة نظيفة متتالية → 🔒 مقفولة) |

**حالة الخطة: 🔒 مقفولة** (جولتين نظافتين متتاليتين: 2 و 3)

## جولة 1 — 2026-07-07

**اللي اتغيّر من الجولة اللي فاتت:** (جولة 1 — مفيش قبله) الخطة جديدة كليًا، المراجعة دي differential
على الـ scope الأصلي. التعديلات اللي اتطبّقت في الجولة دي (مدخل الجولة الجاية للمراجعة التفاضلية):
- خطة server: نطاق تنظيف NGROK اتوسّع ليشمل `README.md:112`، وبند `.env.example` اتحوّل لـ
  تحقّق بس (مش تعديل)، ومعيار القبول اتحدّث لـ grep على `README.md` + `.env.example` معًا.

### النتايج والقرارات

- [x] 🟠 **خطة server: تنظيف NGROK موجه غلط وناقص** — **قرار:** اتصلح. بند "إزالة `NGROK_AUTH_TOKEN`
  من `.env.example` كان no-op (الملف نظيف أصلاً)، والمرجع الحقيقي الميّت في `README.md:112`
  (sample `.env` block تحت Installation) كان مفوّت بره نطاق السطور (210, 224-239). اتعدّل
  الـ scope + Milestone 1 (بند .env.example → تحقّق) + Milestone 2 (إضافة README:112) +
  معيار القبول (grep على الاتنين) + اتضاف قرار محسوم جديد للخطة. — **دليل التحقق:** grep تنفيذي
  على `apps/server/.env.example` (lines 1-34: صفر NGROK) + `apps/server/README.md:112`
  (`NGROK_AUTH_TOKEN=your_ngrok_token`) — 4 عدسات parallel (Explore agents) في الجولة دي.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **`apps/db/CLAUDE.md:9,26,148`** قسم الـ deploy ميّت/غلط: بيقول "Deployed via Coolify
  (Docker)" و"Production URL: https://elshatory-db.beingmomen.com" و`apps/db/Dockerfile`،
  بينما الـ live deploy هو CloudPanel + PM2 على `db.beingmomen.com:9122` (حسب root
  `CLAUDE.md` + `docs/DEPLOYMENT.md` + `ecosystem.config.cjs:21-26`). مش ناتج عن حذف الخطة
  (الـ db plan مفيهوش Milestone للتوثيق أصلاً)، بسدها تعارض docs-vs-infra مستقل. مناسب
  لجلسة تنظيف توثيق منفصلة أو لإضافته لـ scope لو المستخدم قرّر.
- **db plan table inaccuracy:** جدول الخطة (السطر 55) بيقول `infos.js` بيحتفظ بـ `remove`، بس
  `infos.js` مش بيصدّر `remove` أصلًا (singleton). wording بس — ما بكسرش حاجة (الخطة بتقول
  "اترك" حاجة مش موجودة = no-op).
- **db plan `patch` wording:** الـ kept list بيقول `patch`، بس مفيش service file بيعمل
  re-export لـ `patch` تحت الاسم ده (كله aliased كـ `update`). wording بس.
- **Dead Dockerfiles:** `apps/server/Dockerfile`، `apps/db/Dockerfile`، `apps/client/Dockerfile`
  لسه موجودة رغم إن الـ live deploy هو PM2 (لا Docker). الخطة مش بتلمسهم (خارج scope
  المعلَن). ممكن ينفع حذفهم كـ dead artifacts في عملية منفصلة لو المستخدم قرّر.

### قرارات محسومة اتضافت للخطة

- **نطاق تنظيف NGROK = `README.md:112` + `.env.example` (تحقّق بس)** — السبب: `.env.example`
  نظيف أصلاً (البند الأصلي كان no-op)، والمرجع الحقيقي الميّت في `README.md:112` (sample
  `.env` block تحت Installation). اتأكد تنفيذيًا في الجولة دي. اتضاف لخطة server تحت
  "القرارات المحسومة".

## جولة 2 — 2026-07-07

**اللي اتغيّر من الجولة اللي فاتت:** تعديل جولة 1 على خطة server (توسيع نطاق NGROK
لـ `README.md:112` + تحويل بند `.env.example` لتحقّق بس + تحديث معيار القبول). المراجعة
التفاضلية أكّدت إن التعديل ات captured صح في الخطة.

### المراجعة التفاضلية (differential)

- ✅ `apps/server/README.md:112` → فيه `NGROK_AUTH_TOKEN=your_ngrok_token` (تأكد تنفيذي).
- ✅ `apps/server/README.md:210, 231, 237-239` → بتصف ngrok / express-oauth2-jwt-bearer /
  connect-history-api-fallback / slugify كأنهم شغّالين (تأكد).
- ✅ `apps/server/.env.example` → صفر NGROK (تأكد — بند "تحقّق بس" صحيح).

### النتايج والقرارات

مفيش 🔴/🟠 findings بعد الـ merge + severity gate. كل الـ 4 عدسات رجعت **نظيف**:

- **Data model & lifecycle:** 0 🔴 / 0 🟠 (مرشّح 🟠 واحد اتنزّل لـ 🟡 —见 الأسفل). كل أرقام
  الـ services (10/10) متطابقة، `roadmap.js` بيصدّر `getRoadmap` بس، `blogs.js getBySlug`
  و`resources.js getAllNoPagination` موجودين، `getMe` صفر call sites والـ route بيستخدم
  `getMyProfile`.
- **Cross-project contract:** 0 🔴 / 0 🟠. حذف `getMe` آمن (الـ route على `getMyProfile`)،
  الـ 7 deps صفر imports في الـ monorepo كله، إزالة `express-oauth2-jwt-bearer` ما بتعملش
  auth gap (الـ auth عبر `jsonwebtoken` + `authController.protect`)، حذف دوال قراءة db آمن
  (hit واحد بس = `FaqsForm.vue:14`)، سلسلة الـ lockfile متسقة بين الخطط التلاتة.
- **Library & API syntax:** 0 🔴 / 0 🟠. كل claims الـ deps/المكوّنات/الدوال تأكدت تنفيذيًا
  (grep صفر للـ 7 server deps، صفر imports للـ 5 client deps، hit واحد بس في db، الـ 5 deps
  موجودة فعلاً في package.jsons، `@nuxt/fonts`/`@nuxtjs/fontaine` مش مسجّلين في nuxt.config).
- **Security & auth:** 0 🔴 / 0 🟠. `express-oauth2-jwt-bearer` ميّت 100% (صفر require)،
  كل routes الـ CRUD محمية بـ `protect + restrictTo`، `ngrok` صفر استخدام، حذف `dotenv`
  من client آمن (Nitro بيحمّل `.env` داخليًا)، صفحات db كلها بتستخدم `useAPI()` مباشرة.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

- **(من عدسة Cross-project) إضافة cross-reference note لخطة db — `getBySlug` و`/users/me`:**
  خطة db بتقول إن `getBySlug` ميّتة في الـ db app (صح)، بس الـ wrapper اللي بتتحذفه قاعد
  على server endpoint حي `GET /api/v1/blogs/slug/:slug` (`blogRoutes.js:33` +
  `_blogController.js:17` `getOneBySlug`) مستهلك من `apps/client/app/pages/blog/[slug].vue:8`.
  كمان `useGlobal()` في `apps/db/app/pages/index.vue:6` (من الـ base layer) بيوصل لـ
  `GET /api/v1/users/me` (`getMyProfile` — اللي بيفضل). الاقتراح: إضافة سطر note في
  "الـ Edge cases" بخطة db بيوثّق إن الـ server endpoints دي حية ومش لازم تُلمس في خطة server.
  ده documentation-completeness بس (مش active defect) — التنفيذ زي ما هو مخطط آمن.
- **(من عدسة Data model — تنزّل من 🟠 لـ 🟡) جدول `infos.js` "تُترك `remove`":** الجدول
  (سطر 55) بيقول infos.js بيحتفظ بـ `remove` بس الملف ما بيصدّرش `remove` أصلًا (وAlready
  في backlog الجولة 1 بند 2). فعل الخطة = "اترك remove" = no-op صحيح (المنفّذ مش هيلمس
  حاجة مش موجودة). مفيش wrong behaviour — doc accuracy بس. يتصلح في improve mode لو اتحت.

### قرارات محسومة اتضافت للخطة

مفيش قرارات محسومة جديدة في الجولة دي (مفيش findings 🟠/🔴 اتصلحت، ومفيش تعديلات على
الخطط). الخطة فضلت زي ما هي.

## جولة 3 — 2026-07-07

**اللي اتغيّر من الجولة اللي فاتت:** مفيش. جولة 2 ما عملتش أي تعديلات على الخطط
("الخطة فضلت زي ما هي")، والكود اللي الخطط بتلمسه ما اتعدّلش بعدها (تحقّق تنفيدي
بالـ mtimes —见 دليل التحقق تحت).

### المراجعة التفاضلية (differential)

الـ differential من جولة 2 → 3 = **فارغ**. تطبيق قواعد الـ review mode:

- **قاعدة Differential first:** مفيش تعديلات على الخطة ولا تغيير في الكود → مفيش
  text جديد unreviewed.
- **قاعدة "Never re-verify":** جولة 2 سبق اتأكدت من كل claims بـ 4 عدسات parallel
  بأدلة تنفيذية (grep صفر للـ 7 server deps / 5 client deps، `getMe` صفر call sites،
  db read functions صفر call sites ما عدا `FaqsForm.vue:14`، `express-oauth2-jwt-bearer`
  صفر require). الـ context ما اتغيّرش → ما يصحّش إعادة التحقق من الصفر.

النتيجة: صفر findings جديدة + صفر claims بطلت صحيحة = **جولة 3 نظيفة**.

### النتايج والقرارات

مفيش 🔴/🟠 findings. الجولة دي جولة تأكيد تفاضلية بحكم الـ differential الفارغ
والـ context الثابت، مش إعادة مراجعة شاملة.

### دليل التحقق (context drift check)

- **مقارنة mtimes (الـ review log لـ جولة 2 اتكتب 18:20:41):**
  - ملفات الـ source اللي الخطط بتلمسها كلها أقدم من 18:20:
    `apps/server/controllers/_userController.js` (2026-03-15)، `apps/server/package.json`
    (2026-06-06)، `apps/server/.eslintrc.js` (2026-03-15)، `apps/server/README.md`
    (2026-05-26)، `apps/client/nuxt.config.ts` (2026-07-06 14:18)،
    `apps/client/package.json` (2026-06-06)، `apps/client/pnpm-workspace.yaml`
    (2026-02-21)، `SdlcTasks.vue` (2026-06-16)، `SdlcArTasks.vue` (2026-06-15)،
    `apps/db/app/composables/services/*.js` (مارس–يونية).
  - الخطط نفسها أقدم من 18:20: server plan (18:09)، client plan (17:58)، db plan
    (17:59) → مفيش plan drift بعد جولة 2.
- **الاستنتاج:** كل claims جولة 2 المتحقّق منها لساها صحيحة (الكود اللي اتأكد منه
  ما اتغيّرش). مفيش context change يبرّر إعادة التحقق.

### 🟡 backlog (لوضع التحسين — متتناقشش هنا)

مفيش 🟡 جديدة في الجولة دي. الـ backlog المتراكم من جولتي 1 و 2 (5 بنود: توثيق
`apps/db/CLAUDE.md` الميّت، `infos.js remove` wording، `patch` wording، Dead
Dockerfiles، cross-reference note لـ endpoints حية في خطة db) لسه شاغر لـ `/my-improve`.

### قرارات محسومة اتضافت للخطة

مفيش قرارات محسومة جديدة (مفيش findings ولا تعديلات). الخطة فضلت زي ما هي.

**🔒 القفل:** دي تاني جولة نظيفة متتالية (جولة 2 + جولة 3) → الخطة مقفولة. الخطط
التلاتة (client + server + db) كلها في حالة "قيد التنفيذ" جاهزة لـ `/my-implement`.