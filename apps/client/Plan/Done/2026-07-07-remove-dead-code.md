# حذف الكود غير المستخدم — apps/client

> 🔗 جزء من ميزة «حذف الكود غير المستخدم» بتشمل كمان:
> [`../server/Plan/2026-07-07-remove-dead-code.md`](../../server/Plan/2026-07-07-remove-dead-code.md)
> و[`../db/Plan/2026-07-07-remove-dead-code.md`](../../db/Plan/2026-07-07-remove-dead-code.md)

- **التاريخ:** 2026-07-07
- **المشروع:** apps/client (Nuxt 4 + Nuxt UI 4، SSR)
- **الحالة العامة:** منفّذة ✅ (2026-07-08) — 7/8 معايير متحقق منها تنفيذيًا؛ معيار typecheck مُرحَّل (pre-existing failure خارج الـ scope).

## نظرة عامة

حذف المكوّنات والـ dependencies والإعدادات المؤكَّد ميّتها 100% في الـ frontend،
وتصحيح التوثيق اللي بيقول إن حاجات شغّالة وهي مش موجودة (صفحات agents/skills/commands/mcp
متحذفة خلاص، `motion-v/nuxt` مش متثبت، `@nuxt/fonts` و`fontaine` مش مسجّلين).

## الـ Scope

- **داخل الـ scope:** حذف `SdlcTasks.vue` و`SdlcArTasks.vue` (مش مستخدمين)، إزالة 5
  dependencies مش مستوردة (`dotenv`, `@nuxt/fonts`, `@nuxtjs/fontaine`, `@playwright/test`,
  `playwright`)، إزالة سطر `better-sqlite3` من `pnpm-workspace.yaml`، وتصحيح التوثيق
  (root `CLAUDE.md` + `apps/client/CLAUDE.md`).
- **خارج الـ scope:**
  - صفحات `/agents`, `/skills`, `/commands`, `/mcp` وملفاتها المساعدة — **متحذفة
    خلاص**، مفيش كود ليها أصلاً. بس التوثيق قديم → بند توثيق بس، مش حذف كود.
  - `ADR/*.md` (الملفات الـ markdown في روت الـ app) — مصدر مرجعي متنسخ منه في
    `AdrSection`، مش shipped → قرار repo-hygiene منفصل.
  - كل المكوّنات/الـ composables/الـ utils/الـ server routes التانية — كلها live (تم
    التحقق واحد واحد). **لا تُلمس.**
  - `nuxt.config.ts` modules وrouteRules — نضيفة، مفيش dead module/Route.

## المناطق المتأثرة في الكود

- `apps/client/app/components/sdlc/SdlcTasks.vue` — حذف (zero `<SdlcTasks>` usage؛
  `pages/sdlc.vue` بيرسم Hero/Timeline/PhaseSection/Workflow/Decisions بس).
- `apps/client/app/components/sdlc-ar/SdlcArTasks.vue` — حذف (zero usage؛
  `pages/sdlc-ar.vue` ما بيوصّفهوش).
- `apps/client/package.json` — إزالة: `dotenv` (deps)، `@nuxt/fonts` (deps)，
  `@nuxtjs/fontaine` (deps)، `@playwright/test` (devDeps)، `playwright` (devDeps).
  التحقق: ظاهرة بس في `package.json` + `CLAUDE.md`، صفر imports في أي source.
- `apps/client/pnpm-workspace.yaml` — إزالة `better-sqlite3` من `onlyBuiltDependencies`
  (مش في `package.json`؛ بقايا حقبة Nuxt Content). **إبقاء `sharp`** (transitive لـ
  `@nuxt/image`).
- `CLAUDE.md` (روت الـ monorepo) — تحديث جدول الهجرة: صفحات agents/skills/commands/mcp
  **اتحذفت**، مش "معطّلة مؤقتاً".
- `apps/client/CLAUDE.md` — إزالة سطر `motion-v/nuxt` "(replaced GSAP)" (الحزمة مش
  متثبتة ولا مسجّلة)، وإزالة `@nuxt/fonts` و`@nuxtjs/fontaine` من قائمة الـ modules
  (مش مسجّلين في `nuxt.config.ts`).
- **لا يُلمس:** أي composable (`useApiRequest`, `useAPI`, `useExperiences`,
  `useErrorHandler`, `useBreadcrumbSchema`)، أي util، أي server route/plugin، باقي
  مكوّنات `sdlc/`/`sdlc-ar/`/`adr/`/`landing/`/`blog/`/`common/`/`form/`.
- **ملف الـ lockfile:** `pnpm-lock.yaml` في الروت هيتحدّث بعد `pnpm install`.

## الـ Edge cases

- Nuxt auto-import: تم التحقق من كل مكوّن بالاسم (بما فيه `Lazy*` prefix اللي
  grep العادي بيفوّته). الـ `SdlcTasks`/`SdlcArTasks` الوحيدين اللي صفر استخدام بأي
  صيغة.
- `dotenv`: Nuxt/Nitro بيحمّل `.env` داخليًا؛ الحزمة مش مستوردة → آمن.
- `@nuxt/fonts` و`@nuxtjs/fontaine`: الخطوط self-hosted عبر `app/assets/css/fonts.css`
  و`app/assets/fonts/*.woff2` (يدويًا)، مش مسجّلين في `nuxt.config.ts` modules → آمن.
- مفيش test infrastructure (لا `playwright.config`, لا `*.spec.ts`) → الـ playwright
  deps ميّتة.
- حذف مكوّن مش بيأثر على routing (مفيش route بيشاور عليه).

## معايير القبول

- [x] `pnpm lint` يمرّ بدون أخطاء جديدة. ✔️ `pnpm lint` exit 0 (eslint .).
- [ ] `pnpm typecheck` (vue-tsc) يمرّ — ده اللي بيكشف "حذفت component لسه مستخدم في
      template" و"حذفت import لسه متسدعى". — **مُرحَّل:** typecheck فاشل **pre-existing** على `main` النظيف (قبل أي تعديل) بخطأين في `app/composables/useAPI.ts:50,51` (TS2769/TS7031) — مكوّن خارج الـ scope (الخطة بتقول "لا يُلمس useAPI"). الحذف ماضافش أي error جديد (خطأي-قبل = خطأي-بعد). نية المعيار (كشف حذف مكسور) متحققة عبر الـ build بدل ده. ده شغل `/code-review` أو إصلاح منفصل لـ useAPI.ts.
- [x] `pnpm build` (مع `NODE_OPTIONS=--max-old-space-size=4096`) يمرّ بدون missing
      asset/module. ✔️ `BUILD_EXIT=0` — "✨ Build complete!" + nitro output كامل + sharp binaries included.
- [x] `git diff apps/client/package.json` بيظهر بس الـ 5 deps المحذوفة. ✔️ diff بيعرض بالظبط `@nuxt/fonts`, `@nuxtjs/fontaine`, `dotenv`, `@playwright/test`, `playwright` — ولا dep مستخدمة اتلمست.
- [x] `apps/client/app/components/sdlc/SdlcTasks.vue` و`SdlcArTasks.vue` مش موجودين. ✔️ `git status` بيعرض `D` للاتنين.
- [x] `apps/client/pnpm-workspace.yaml` ما عادش فيه `better-sqlite3` (و`sharp` لسه موجود). ✔️ diff بيظهر حذف `better-sqlite3` بس؛ `sharp` لسه موجود.
- [x] grep تحقّق: `grep -rn "SdlcTasks\|SdlcArTasks" apps/client/app` يرجع صفر. ✔️ `ZERO_HITS_IN_APP`.
- [x] root `CLAUDE.md` و`apps/client/CLAUDE.md` ما عادش يذكروا deps/modules محذوفة كأنهم
      شغّالة. ✔️ grep --ignore-case صفر في الاتنين لـ `motion-v`/`@nuxt/fonts`/`@nuxtjs/fontaine`/`dotenv`/`playwright`/`better-sqlite3`.

## الـ Dependencies والمخاطر

- **Dep:** مستقل عن server/db (الـ 3 مشاريع بستدعي بعض عبر HTTP بس).
- **Risk — lockfile:** `pnpm install` هتحرّض تغيير `pnpm-lock.yaml` في الروت →
  `deploy.sh` بيعمل rebuild للـ 3 apps. مقبول — موثّق بس مش بنقسّم التنفيذ.
- **Risk — منخفض:** لو حزمة/مكوّن مستتر وراء auto-import ديناميكي — تم التحقق واحد
  واحد بالاسم (بما فيه `Lazy*`)، فمستحيل هنا.
- **Risk — build RAM:** `pnpm build` محتاج ~4GB heap. **لا يشغّل build لـ client وdb
  في نفس الوقت** (حسب CLAUDE.md) — sequential بس.

## القرارات المحسومة

- **نطاق الحذف = 100% confirmed بس** — السبب: طلب المستخدم (المصدر: مقابلة).
- **صفحات agents/skills/commands/mcp = بند توثيق بس** — السبب: الكود متحذف خلاص، بس
  التوثيق قديم بيقول "معطّلة" (المصدر: استكشاف code-explorer).
- **تحديث التوثيق داخل الـ scope** — السبب: منع تعارض docs-vs-code (المصدر: مقابلة).
- **معيار القبول = lint + typecheck + build** — السبب: typecheck بيكشف حذف أصل/مكوّن
  مستخدم، build بيأكد عدم وجود أصل/موديول ناقص (المصدر: مقابلة).
- **3 branches منفصلة، بدون commit** — السبب: workflow المستخدم (المصدر: ذاكرة
  `feedback_git_workflow`).

---

## Milestones

### Milestone 1: حذف المكوّنات والـ dependencies والإعدادات الميّتة + تحقق فوري
- [x] حذف `apps/client/app/components/sdlc/SdlcTasks.vue`.
- [x] حذف `apps/client/app/components/sdlc-ar/SdlcArTasks.vue`.
- [x] إزالة من `apps/client/package.json`: `dotenv`, `@nuxt/fonts`, `@nuxtjs/fontaine`
      (deps) + `@playwright/test`, `playwright` (devDeps).
- [x] إزالة `better-sqlite3` من `apps/client/pnpm-workspace.yaml` `onlyBuiltDependencies`
      (إبقاء `sharp`).
- [x] تشغيل `pnpm install` من روت الـ monorepo لتحديث `pnpm-lock.yaml`.
- [x] تشغيل `pnpm lint` (من `apps/client/`) — لازم يمرّ.
- [ ] تشغيل `pnpm typecheck` — لازم يمرّ (يكشف أي مكوّن لسه مستخدم). — **مُرحَّل:** فاشل pre-existing على main في `useAPI.ts:50,51` (خارج scope).
- [x] grep تحقّق نهائي: صفر `SdlcTasks`/`SdlcArTasks` في `apps/client/app`.

### Milestone 2: build كامل
- [x] تشغيل `pnpm build` من `apps/client/` مع `NODE_OPTIONS=--max-old-space-size=4096`.
- [x] تأكيد إن الـ build خلص بدون missing asset/module. **لا يشغّل ده بالتوازي مع
      build الـ db** (RAM) — sequential. ✔️ BUILD_EXIT=0.

### Milestone 3: تنظيف التوثيق
- [x] تحديث روت `CLAUDE.md` جدول الهجرة: صفحات agents/skills/commands/mcp "متحذفة"
      بدل "معطّلة مؤقتاً (empty state)".
- [x] تحديث `apps/client/CLAUDE.md`: إزالة سطر `motion-v/nuxt`، إزالة `@nuxt/fonts`
      و`@nuxtjs/fontaine` من قائمة الـ Modules.
- [x] مراجعة `apps/client/CLAUDE.md` Environment Variables / Key Config Files للتأكد
      ما بذكرش deps محذوفة. ✔️ صفر ذِكر.