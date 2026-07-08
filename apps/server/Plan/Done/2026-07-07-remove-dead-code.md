# حذف الكود غير المستخدم — apps/server

> 🔗 جزء من ميزة «حذف الكود غير المستخدم» بتشمل كمان:
> [`../client/Plan/2026-07-07-remove-dead-code.md`](../../client/Plan/2026-07-07-remove-dead-code.md)
> و[`../db/Plan/2026-07-07-remove-dead-code.md`](../../db/Plan/2026-07-07-remove-dead-code.md)

- **التاريخ:** 2026-07-07
- **المشروع:** apps/server (Express.js + Mongoose)
- **الحالة العامة:** منفّذة ✅ (2026-07-08) — كل المعايير اتتحقّق منها تنفيذيًا.

## نظرة عامة

حذف الكود والـ dependencies والإعدادات المؤكَّد ميّتها 100% في الـ backend — مفيش أي
استدعاء أو لازمة ليها. الهدف تقليل السطح، وإلغاء التوثيق المضلّل اللي بيقول إن deps
شغّالة وهي مش موجودة في الكود.

## الـ Scope

- **داخل الـ scope:** حذف `exports.getMe` غير المستخدم، إزالة 7 dependencies مش مستوردة،
  إزالة override ميّت في `.eslintrc.js`، إزالة `NGROK_AUTH_TOKEN` من `.env.example`،
  وتحديث `README.md` لإلغاء الأقسام اللي بتصف deps محذوفة.
- **خارج الـ scope:**
  - `scripts/seedRoadmap.js` + `roadmapSeedData.js` + `npm run seed:roadmap` — أداة
    seed مقصودة (تتخطّى لو البيانات موجودة)، والـ roadmap feature نفسه شغّال ومستهلك
    من `apps/db`. **لا تُحذف.**
  - `controllers/buildProjectController.js` + `routes/buildProjectRoutes.js` — stub
    TODO ناقص، لكنه mounted ومستدعى (ميّت منطقيًا مش ميّت technically) → قرار منتج.
  - `public/index.html` — صفحة API explorer قديمة بس live (تُ served عند `/`) →
    قرار منفصل (تحديث/إعادة توليد)، مش حذف.
  - `utils/sendMail.js` mismatch بين `STAMP_*` و`EMAIL_*` env vars — مشكلة صحة
    محتملة، بس مش كود ميّت → جلسة تحقيق منفصلة.
  - `package.json` build script no-op — سطر مش كود source.
  - مفيش tests موجودة فمخاطرة "كود مستخدم بس في test" معدومة.

## المناطق المتأثرة في الكود

- `apps/server/controllers/_userController.js:16-19` — حذف `exports.getMe` (zero call sites).
- `apps/server/package.json` `dependencies` — إزالة: `@ngrok/ngrok`, `ngrok`, `qs`,
  `express-oauth2-jwt-bearer`, `connect-history-api-fallback`, `form-data`, `slugify`
  (صفر `require` hits في كل `apps/server/**/*.js` خارج `node_modules`).
- `apps/server/.eslintrc.js` — حذف override block الخاص بـ `files: ['netlify/**/*.js']`
  (مجلد `netlify/` مش موجود).
- `apps/server/.env.example` — تأكيد إن `NGROK_AUTH_TOKEN` مش موجود (تحقّق بس — اتشال قبلاً).
- `apps/server/README.md` — تحديث الأقسام (~lines 210, 224-239) اللي بتوصف ngrok /
  `express-oauth2-jwt-bearer` / `connect-history-api-fallback` كأنهم شغّالين، **+ إزالة
  سطر `NGROK_AUTH_TOKEN=your_ngrok_token` عند line 112** (sample `.env` block تحت Installation).
- **لا يُلمس:** أي route/controller/model/imageService — كلها موصولة من `app.js`.
- **ملف الـ lockfile:** `pnpm-lock.yaml` في روت الـ monorepo هيتحدّث بعد `pnpm install`.

## الـ Edge cases

- `qs` و`form-data` deps نقلية عبر `express` أصلاً → إزالة التصريح المباشر آمنة
  (express هيجيبهم).
- `slugify`: الكود بيستخدم `utils/slug.js` (regex مكتوب بإيد) بدل الحزمة → آمن.
- مفيش tests framework في الـ server → مفيش كود مستخدم بس في tests.
- حذف `getMe` لوحدها من غير ما لمس `userRoutes.js` آمن لأن الـ route بيستخدم
  `getMyProfile` مش `getMe`.

## معايير القبول

- [x] `pnpm lint` يمرّ بدون أخطاء جديدة. ✔️ `pnpm lint` exit 0 (eslint . --ext .js,.jsx,.ts,.tsx).
- [x] `node -c apps/server/server.js` (syntax check) يمرّ بدون syntax errors. ✔️ `SYNTAX OK: server.js`.
- [x] `git diff apps/server/package.json` بيظهر بس الـ 7 deps المحذوفة، ولا أي dep مستخدمة اتلمست. ✔️ diff بيظهر بالظبط الـ 7 (@ngrok/ngrok, connect-history-api-fallback, express-oauth2-jwt-bearer, form-data, ngrok, qs, slugify).
- [x] `git diff apps/server/controllers/_userController.js` بيظهر حذف `getMe` بس. ✔️ diff بيظهر حذف الـ 4 سطور بتوع `exports.getMe` بس.
- [x] grep للتأكيد: `grep -rn --exclude-dir=node_modules "require.*\(@ngrok/ngrok\|ngrok\|express-oauth2-jwt-bearer\|connect-history-api-fallback\|form-data\|'qs'\|slugify\)" apps/server --include=*.js` يرجع صفر. ✔️ `ZERO_REQUIRE_HITS` — صفر require hits في apps/server source (transitive deps جوّه node_modules مستثناة عمدًا؛ الـ grep الأصلي في الخطة كان ناقص `--exclude-dir=node_modules` فحرفيًا بيرجّع hits من express/ngrok جوّه node_modules).
- [x] `README.md` ما عادش يذكر deps محذوفة كأنهم شغّالة. ✔️ grep --ignore-case صفر لأي من الـ deps المحذوفة.
- [x] `README.md` و`.env.example` ما عادش يذكروا `NGROK_AUTH_TOKEN` إطلاقًا (grep تحقّق على الاتنين). ✔️ صفر NGROK في الاتنين.

## الـ Dependencies والمخاطر

- **Dep:** الحذف مستقل عن client/db (الـ 3 مشاريع بستدعي بعض عبر HTTP بس، مش imports
  مشتركة) → مفيش ripple بين مشاريع.
- **Risk — lockfile:** `pnpm install` هتحرّض تغيير `pnpm-lock.yaml` في الروت → حسب
  `scripts/deploy.sh`، ده بيحرّض rebuild للـ 3 apps عند الـ deploy. مقبول (هتdeploy
  الـ 3 مع بعض على أي حال) — موثّق بس مش بنقسّم التنفيذ بسببه.
- **Risk — منخفض:** لو حزمة محذوفة مستترة وراء استدعاء ديناميكي — تم التحقق: مفيش
  dynamic `require` في الكود (كل wiring static)، فده مستحيل هنا.

## القرارات المحسومة

- **نطاق الحذف = 100% confirmed بس** — السبب: طلب المستخدم حذف ما هو مؤكَّد ميّت 100%
  بدون أي لازمة (المصدر: مقابلة).
- **الـ stubs والقرارات (buildProjectController, /users proxy, public/index.html)
  خارج الـ scope** — السبب: مش ميّت technically، كل واحد محتاج قرار منتج (المصدر:
  مقابلة).
- **تحديث التوثيق داخل الـ scope** — السبب: الكود الميّت اللي بيتفشّش في الـ reviews
  الجاية بييجي من التوثيق المضلّل؛ الحذف بدون تحديث التوثيق بيخلق تعارض docs-vs-code
  (المصدر: مقابلة).
- **نطاق تنظيف NGROK = `README.md:112` + `.env.example` (تحقّق بس)** — السبب: `.env.example`
  نظيف أصلاً (البند الأصلي كان no-op)، والمرجع الحقيقي الميّت في `README.md:112` (sample
  `.env` block تحت Installation) — اتأكد تنفيذيًا في جولة 1 (المصدر: مراجعة).
- **معيار القبول = lint + syntax check (بدون boot كامل)** — السبب: boot محتاج MongoDB
  + .env، والحذف deps/ملفات مش routes منطقية فـ syntax check كافي (المصدر: مقابلة).
- **3 branches منفصلة، بدون commit** — السبب: workflow المستخدم، بيراجع الـ diff ويعمل
  commit بنفسه (المصدر: ذاكرة محفوظة `feedback_git_workflow`).

---

## Milestones

### Milestone 1: حذف الكود والـ dependencies والإعدادات الميّتة + تحقق فوري
- [x] حذف `exports.getMe` من `apps/server/controllers/_userController.js` (السطور 16-19).
- [x] إزالة من `apps/server/package.json` dependencies: `@ngrok/ngrok`, `ngrok`, `qs`,
      `express-oauth2-jwt-bearer`, `connect-history-api-fallback`, `form-data`, `slugify`.
- [x] حذف override block الـ `netlify/**/*.js` من `apps/server/.eslintrc.js`.
- [x] تأكيد إن `apps/server/.env.example` ما فيهوش `NGROK_AUTH_TOKEN` (تحقّق بس — مش تعديل).
- [x] تشغيل `pnpm install` من روت الـ monorepo لتحديث `pnpm-lock.yaml`.
- [x] تشغيل `pnpm lint` (من `apps/server/` أو `pnpm dev:server` lint equivalent) — لازم يمرّ.
- [x] تشغيل `node -c apps/server/server.js` — لازم يمرّ بدون syntax errors.
- [x] grep تحقّق نهائي: صفر `require` لأي dep محذوفة في `apps/server/**/*.js`.

### Milestone 2: تنظيف التوثيق
- [x] تحديث `apps/server/README.md`: إزالة أقسام ngrok / `express-oauth2-jwt-bearer` /
      `connect-history-api-fallback` (وكل ذِكر deps محذوفة)، **+ إزالة سطر
      `NGROK_AUTH_TOKEN=your_ngrok_token` عند line 112** (sample `.env` block تحت Installation).
- [x] مراجعة `apps/server/CLAUDE.md` للتأكد ما بذكرش deps محذوفة (لو فيه، تُحدَّث). ✔️ صفر ذِكر — ما احتاج تعديل.