# دور المشروع وأدواته + صفحة تفاصيل المشروع (Client)

> 🔗 جزء من ميزة «دور المشروع وأدواته + صفحة تفاصيل المشروع» بتشمل كمان: server و db.
> الملفات المرتبطة:
> - [../../server/Plan/2026-07-14-project-role-and-tools.md](../../server/Plan/2026-07-14-project-role-and-tools.md)
> - [../../db/Plan/2026-07-14-project-role-and-tools.md](../../db/Plan/2026-07-14-project-role-and-tools.md)

- **التاريخ:** 2026-07-14
- **المشروع:** apps/client (Nuxt 4 portfolio، عربي RTL، SSR + block navigation)
- **الحالة العامة:** قيد المراجعة — 10 جولات (1: 2🔴+6🟠 · 2: 1🔴+3🟠 · 3: 0🔴+2🟠 · 4: 0🔴+2🟠 · 5: 1🔴+1🟠 · 6: 1🔴+1🟠 · 7: نظيفة ✅ · 8: 1🟠 · 9: نظيفة ✅ · **10: 1🔴+2🟠 اتصلحت — كلها في خطتي server/db، الكلاينت ما اتلمستش**) — العدّاد النظيف رجع لصفر، محتاج جولتين نظاف متتاليتين للقفل ([سجل المراجعة](2026-07-14-project-role-and-tools.review-log.md))

## نظرة عامة

الموقع دلوقتي بيعرض المشاريع كـ **نواتج** — والكارت بيطرد الزائر برّه الموقع فوراً (`:to="project.url"` + `target="_blank"`). الميزة دي بتخلّي كل مشروع يجاوب على **«دوري»** و**«الأدوات»**، وبتدّي اللي عنده سردية صفحة داخلية بدل ما يخرج على طول.

جزء الـ client فيه حتّتين:

1. **إصلاح bug مؤكَّد** — الكروت بتقرا `project.tags`، والـ API بيرجّع `skills`. تحققت من الـ API الحي: `tags` **مش موجود** في الـ 4 مشاريع كلهم. يعني badges التقنيات **عمرها ما اترسمت في الإنتاج** — الـ `v-if` بيبلعها في صمت.
2. **صفحة `/projects/[slug]`** — الكارت يعرض «دوري» + badges ويودّي جوّه، والصفحة تشيل السردية والـ CTAs.

ترتيب التنفيذ العام: server M1 → **client M1** → server M2 → db M1 → db M2 (محتوى) → **client M2** → server M3 + db M3.

## الـ Scope

- **داخل الـ scope:**
  - إصلاح `project.tags` → `project.skills` في `pages/projects.vue` و`components/landing/Projects.vue`.
  - `app/utils/projectLink.ts` — مصدر حقيقة واحد لـ «المشروع ده يستاهل صفحة داخلية؟».
  - `app/components/common/ProjectStackBadges.vue` — قسمين منفصلين («مبني بـ» / «اتبنى إزاي»).
  - نقل `pages/projects.vue` → `pages/projects/index.vue` + `pages/projects/[slug].vue` جديدة.
  - `server/api/__sitemap__/urls.get.ts` + `nuxt.config.ts` (routeRules).
- **خارج الـ scope:**
  - **تغيير التموضع** — `shared/identity.ts` (`Frontend Engineer`) والـ hero والـ about **مايتلمسوش**. الميزة دي بتضيف عمق للمشاريع، مش بتغيّر الرسالة.
  - **مسار freelance منفصل / صفحة خدمات** — مناقشة منفصلة تماماً.
  - **case studies / ربط بالـ blog** — اتقرر إن السردية حقول منظمة مش مقالات (قرار #2).
  - **إعادة تصميم layout `/projects`** — بنضيف عناصر جوّه الكارت الموجود، مش بنعيد بناءه.
  - **badges «اتبنى إزاي» في teaser الهوم** — الكارت ده دنس أصلاً (tag + عنوان + وصف + badges + thumbnail في صف أفقي واحد)؛ صف badges تاني معنون بيشتغل ضد «الحضور الهادئ». بياخد إصلاح الـ bug والـ routing بس.
  - skeletons / `lazy: true` / loading states — block navigation عمداً (منصوص عليه في `apps/client/CLAUDE.md`).
  - migration صفحات agents/skills/commands/mcp — متوقف بقرار المستخدم، لا تقترحه.

## المناطق المتأثرة في الكود

**ملفات جديدة (3):**

- **`app/utils/projectLink.ts`** — auto-imported زي `projectHover.ts`/`cloudinary.ts`. `getProjectLink(project)` بترجّع **`{ to, external, kind: 'site'|'live'|'repo'|null, target, rel }`**. القاعدة: المشروع بياخد صفحة داخلية **بس** لو عنده `role` **و** `enSlug`؛ غير كده الكارت بيودّي للينك الخارجي (`url` الأول، وإلا `repoUrl`). ده بيتدهور بأمان للسلوك الحالي بالظبط أثناء نافذة الحقول الاختيارية — ولا واحد من الـ 4 عنده `role`/`enSlug` لسه، فكل الكروت بتفضل توديّ برّه لحد الـ backfill.
  🔴 **`target` و`rel` لازم يطلعوا من الـ util، مش يتكتبوا في الـ template** — `external: false` → الاتنين `undefined` → Vue بيشيل الـ attributes. من غير كده، الـ `target="_blank"` الموجود دلوقتي بيفضل ثابت على لينك بقى داخلي → **الكارت بيفتح `beingmomen.com/projects/warraq` في تاب جديد**، يعني الميزة اللي غرضها تبقّي الزائر في الموقع بتطرده منه.
- **`app/components/common/ProjectStackBadges.vue`** — بيتـauto-import كـ `<CommonProjectStackBadges>` (زي `common/ProjectImage.vue` → `<CommonProjectImage>`). props: `skills`, `tools`, `size`. قسمين منفصلين بعنوان لكل واحد، مع `v-if` على كل قسم. **الألوان مقصودة:** `skills` بتحتفظ بـ `color="primary"` (الوضع الحالي، ما اتغيرش)؛ `tools` بـ `color="neutral"` — للفصل البصري، ولاحترام قاعدة «الأمبر توقيع مش حشو» (DESIGN.md) بدل مضاعفة مساحة الأمبر على كل كارت.
- **`app/pages/projects/[slug].vue`** — بتحاكي `blog/[slug].vue` (نفس نمط الجلب + 404 + breadcrumb + JSON-LD).

**ملفات معدّلة (4):**

- **`app/pages/projects.vue` → `app/pages/projects/index.vue`** (نقل + تعديل) — الـ badges، الـ routing، سطر «دوري» في `#leading`، أيقونة نوع اللينك، وإصلاح الـ JSON-LD.
- **`app/components/landing/Projects.vue`** — إصلاح الـ bug + الـ routing بس.
- **`server/api/__sitemap__/urls.get.ts`** — إضافة روابط المشاريع. ⚠️ **لاحظ: `server/` مش تحت `app/`** — في Nuxt 4 هو أخوه مش ابنه. ملف اتعمل في `app/server/...` هيتجاهله Nitro في صمت.
- **`nuxt.config.ts`** — `'/projects/**': { swr: 60 }` جنب `'/projects'` الموجودة.

## الـ Edge cases

- **🔴 فخ الـ routing:** **مينفعش** تحط `pages/projects/[slug].vue` جنب `pages/projects.vue` الموجودة. Nuxt هيسجّل `/projects/:slug` كـ **child route** لـ `projects.vue`، و`projects.vue` مفهاش `<NuxtPage />` → الـ child بيماتش بس عمره ما بيترسم (**بصمت، مش error**). النمط الصح موجود في المشروع أصلاً: `blog/index.vue` + `blog/[slug].vue` **أشقاء في مجلد**. فلازم **نقل** `projects.vue` → `projects/index.vue` (مسار `/projects` مش هيتغير) الأول.
- **🔴 فخ الـ sitemap:** **مينفعش** تعيد استخدام `/projects/all` — محمي بـ `authController.protect` (طلب sitemap عام هياخد 401)، وبيرجّع **array مجرّدة** (`getAllNoPagination`)، مش الـ envelope `{ status, total, results, data }` بتاع `/projects` العام. نسخ نمط `/blogs/all` هنا بيكسر بصمت (`(json || []).map` هتحاول تعمل map على object).
- **مشروع من غير `role`/`enSlug`** → `getProjectLink` بترجّع external → الكارت يودّي برّه زي دلوقتي. مفيش صفحة نص فاضية (قرار #8).
- **مشروع بـ `repoUrl` بس** → `kind: 'repo'` → أيقونة `i-lucide-github` بدل `i-lucide-external-link`.
- **JSON-LD لمشروع repo-only** — `'url': project.url` الحالية هتطلع `undefined`. لازم `project.url || project.repoUrl || \`${siteUrl}${getProjectLink(project).to}\``.
- **`/projects/[slug]` لـ slug مش موجود** → `setResponseStatus(useRequestEvent(), 404)` على السيرفر + بلوك fallback (نفس نمط «المقال غير موجود» في `blog/[slug].vue`).
- **`tools` فاضية** → القسم التاني في `ProjectStackBadges` مبيتـrenderش خالص (`v-if`) — مفيش خانة فاضية.
- **تكرار القاعدة في مكانين:** شرط `enSlug && role` موجود في `getProjectLink` (app util) وفي فلتر الـ sitemap (server route) — **bundles مختلفة في Nuxt، مينفعش import مشترك**. لو القاعدة اتغيرت، لازم الاتنين يتغيروا.
- **مجاور بس خارج الـ scope (تسجيل بس):** `useAPI('/projects', { query: { isActive: true } })` مبيحطش `limit` → `APIFeatures.paginate()` بيرجع لـ 10 افتراضياً. مع 4 مشاريع ده غير مرئي؛ بيبقى سقف صامت بعد العاشر.

## معايير القبول

- [ ] `pnpm lint && pnpm typecheck` نضاف في كل milestone.
- [ ] **بعد M1:** badges التقنيات **بتظهر فعلاً** على كروت `/projects` وعلى teaser الهوم — دي أول مرة في الإنتاج.
- [ ] **بعد M1:** مفيش أي regression — الكروت لسه بتودّي للينك الخارجي زي ما هي.
- [ ] `/projects` لسه بيفتح على نفس المسار بعد النقل لـ `projects/index.vue`.
- [ ] `/projects/warraq` بيرجّع **200** وبيعرض: العنوان، «دوري»، الـ badges بقسميهم، الفكرة، طريقة التنفيذ، وأزرار الـ CTA.
- [ ] `/projects/حاجة-مش-موجودة` بترجع **404** (مش 200 بصفحة فاضية).
- [ ] مشروع لسه من غير `role` → كارته بيودّي **برّه مباشرة**، مش لصفحة نص فاضية.
- [ ] **الكارت الداخلي بيفتح في نفس التاب** — مشروع عنده `role`+`enSlug`، الكليك عليه بيفتح `/projects/warraq` في نفس النافذة مش تاب جديد. (الكارت الخارجي لسه بيفتح تاب جديد.)
- [ ] **الإعلان الصوتي مطابق للسلوك** — الكارت الداخلي **مش** بينطق «يفتح في تبويب جديد» (الـ `sr-only` span مخفي)، والخارجي بينطقها. اتأكد بـ screen reader أو بفحص الـ DOM.
- [ ] مشروع بـ `repoUrl` بس → الكارت بيوري أيقونة GitHub، والصفحة بتوري زرار «عرض الكود» من غير زرار «زيارة الموقع».
- [ ] `/sitemap.xml` فيه روابط `/projects/*` **بس** للمشاريع اللي عندها `role` و`enSlug`.
- [ ] الصفحة الجديدة SSR — المحتوى في الـ HTML الأولي (`curl` عليها بيوري النص)، مفيش skeleton ولا فلاش.
- [ ] مفيش أكتر من 3 لحظات أمبر في الشاشة الواحدة (DESIGN.md).

## الـ Dependencies والمخاطر

- 🔴 **Milestone 2 معتمد كلياً على server M2** (الحقول + `GET /projects/slug/:enSlug`) **و db M2** (ملء الـ 4). من غيرهم الصفحة بترجع 404 لكل حاجة.
- ⚠️ **Milestone 1 مستقل تماماً** — مش مستني الـ schema، وينفع ينزل فوراً بعد server M1. بس **server M1 لازم يسبقه**: إصلاح الـ template لوحده **مش هيصلّح teaser الهوم**، لأن `/home-featured/populated` مش بيعمل populate للـ `skills` virtual أصلاً (تفاصيله في خطة الـ server).
- ⚠️ **`BASE_URL` متبيّك وقت البناء** في CSP — تغيير الـ env محتاج rebuild للكلاينت، مش restart.
- ⚠️ **الـ deploy انتقائي**: `apps/client/**` بيعمل rebuild للكلاينت (port 3000). ومتبنيش مع `apps/db` في نفس الوقت — الـ RAM بتخلص.
- ⚠️ **block navigation** — أي مراجعة بتقول «مفيش loading states» على الصفحة الجديدة **false positive** ضد المعمارية دي.

## القرارات المحسومة

- **مسطرة واحدة لكل المشاريع: «دوري» + «الأدوات»** — مفيش تصنيف «AI ولا لأ»، مفيش badge، مفيش filter. السبب: الـ label «ده بالـ AI» بيخلق درجتين في دماغ الزائر ويقرا التاني على إنه أقل قيمة — عكس الهدف. الشفافية من **محتوى** الحقلين. (المصدر: مقابلة)
- **السردية = حقول منظمة، فقرة لكل سؤال** — مش مقال ولا case study ولا ربط بالـ Blog. السبب: الاتساق بيدّي المصداقية — كل مشروع بيجاوب على نفس الأسئلة بنفس الترتيب فالقارئ يقارن؛ المقال الحر بيخلي كل مشروع شكل. (المصدر: مقابلة)
- **صفحة داخلية `/projects/[slug]`** — والكارت يودّي جوّه بدل برّه. السبب المزدوج: الـ 3 فقرات مش هتتحط على كارت (حائط نص يكسر «الحضور الهادئ»)، **و** الكارت دلوقتي بيطرد الزائر برّه الموقع من غير ما يقرا حاجة. (المصدر: مقابلة)
- **`enSlug` إنجليزي** — `/projects/essam-fahmy` مش `/projects/%D9%85%D9%88%D9%82%D8%B9-...`. السبب: دي بالظبط اللينكات اللي بتترمي في CV وفي رسالة لـ recruiter — الـ percent-encoding هناك كارثة. الـ `slug` العربي بيفضل في الـ model زي ما هو. (المصدر: مقابلة)
- **قسمين منفصلين، مش صف badges واحد** — «مبني بـ» (الاستاك) و«اتبنى إزاي» (أدوات التنفيذ). السبب: خلط `Nuxt` مع `Claude Code` في نفس الصف بيخلي الـ recruiter يقرا إنهم حاجة واحدة — والفصل نفسه رسالة: «أنا بفرّق». (المصدر: مقابلة)
- **teaser الهوم مبياخدش القسمين** — بياخد إصلاح الـ bug والـ routing بس. السبب: الكارت دنس أصلاً وصف badges معنون تاني بيشتغل ضد «الحضور الهادئ». الفصل بين «فين الكليك رايح» (بيتطبّق في كل مكان) و«إيه اللي متعروض» (قرار كثافة). (المصدر: مراجعة معمارية)
- **`role` مجبر · `origin`/`process` اختياريين · مشروع من غير سردية → الكارت يودّي برّه** — مش لصفحة فيها عنوان وبس. (المصدر: مقابلة)
- **`getProjectLink` بترجّع `target` و`rel` كمان، مش `{to, external, kind}` بس** — عشان مفيش حتة يتكتب فيها `target` ثابت في الـ template. من غير ده، الـ `target="_blank"` الموجود دلوقتي بيفضل على لينك بقى داخلي، فالكارت بيفتح موقعك أنت في تاب جديد — عكس غرض الميزة حرفياً. (المصدر: مراجعة جولة 1)

---

## Milestones

### Milestone 1: إصلاح الـ badges المكسورة (مستقل — ينزل بدري)
- [ ] ⛔ **شرط مسبق:** خطة الـ server → Milestone 1 نزلت (الـ nested populate). من غيرها، إصلاح teaser الهوم مش هيبان
- [ ] شغّل `pnpm lint && pnpm typecheck` على الكود زي ما هو وتأكد إنهم نضاف — ده الـ gate اللي كل milestone بعده بيعيد تشغيله
- [ ] `app/pages/projects.vue` (السطور 136-142) — `project.tags` → `project.skills` (كمان `:key="tag._id"` و`:label="tag.title"`)
- [ ] `app/components/landing/Projects.vue` (السطور 74, 78) — `project.tags?.length` → `project.skills?.length`، و`project.tags.slice(0, 3)` → `project.skills.slice(0, 3)`
- [ ] `pnpm lint && pnpm typecheck` نضاف
- [ ] فحص بصري: badges التقنيات بتظهر على كروت `/projects` **وعلى teaser الهوم** — أول مرة في الإنتاج
- [ ] **انزل لوحدك** — صفر مخاطرة، ومكسب فوري

### Milestone 2: صفحة تفاصيل المشروع + الـ routing + الـ sitemap
- [ ] ⛔ **شرط مسبق صارم:** خطة الـ server → Milestone 2 (الحقول + الـ route) **و** خطة الـ db → Milestone 2 (ملء الـ 4) خلصوا. تأكد بـ `curl "$BASE_URL/projects/slug/warraq"` بترجّع 200
- [ ] **انقل** `app/pages/projects.vue` → `app/pages/projects/index.vue` (مسار `/projects` ما بيتغيرش) — ده **لازم** يسبق إنشاء `[slug].vue`، وإلا الـ child route هيماتش ومترسمش أبداً وبصمت
- [ ] أنشئ `app/utils/projectLink.ts` — `getProjectLink(project)` → `{ to, external, kind, target, rel }`. صفحة داخلية بس لو `project.role && project.enSlug`؛ غير كده `url || repoUrl` مع `kind: 'live'|'repo'|null`. **الـ `target` (`'_blank' | undefined`) والـ `rel` (`'noopener noreferrer' | undefined`) بيطلعوا من الـ util كمان** — عشان مفيش حتة يتكتب فيها `target` ثابت في الـ template
- [ ] أنشئ `app/components/common/ProjectStackBadges.vue` — قسمين: «مبني بـ» (`skills`، `color="primary"`) و«اتبنى إزاي» (`tools`، `color="neutral"`)، كل قسم بـ `v-if` على مصفوفته
- [ ] `app/pages/projects/index.vue` — استبدل صف الـ badges بـ `<CommonProjectStackBadges :skills="project.skills" :tools="project.tools" />`
- [ ] `app/pages/projects/index.vue` — الكارت `:to`/`:target`/`:rel` **كلهم مربوطين من `getProjectLink(project)`** بدل `project.url` و`target="_blank"` المتحطين بالإيد. ⛔ متسيبش `target="_blank"` ثابت — اللينك بقى داخلي للمشاريع اللي عندها سردية
- [ ] `app/pages/projects/index.vue` — أضف سطر «دوري» في `#leading` slot (الـ slot ده مجرّب وشغّال في نفس المكوّن — أأمن من التخمين في slots مش متحققة): `<p v-if="project.role" class="line-clamp-2">` مع `<span class="font-medium text-highlighted">دوري:</span>`
- [ ] `app/pages/projects/index.vue` — أيقونة نوع اللينك في الـ footer حسب `getProjectLink(project).kind`: `i-lucide-external-link` / `i-lucide-github` / سهم عادي
- [ ] 🟠 `app/pages/projects/index.vue` (السطر 148) — `<span class="sr-only">يفتح في تبويب جديد</span>` لازم يبقى **مشروط**: `v-if="getProjectLink(project).external"`
      **السبب:** الأيقونة `aria-hidden="true"`، فالـ span ده هو **المصدر الوحيد** للمعلومة دي عند قارئ الشاشة. لو فضل ثابت بعد ما اللينك بقى داخلي، مستخدم NVDA بيسمع «ورّاق… يفتح في تبويب جديد» وبعدين الصفحة بتتبدّل في نفس النافذة — وعد كاذب للفئة اللي بتعتمد على الإعلان ده عشان متتفاجئش (WCAG 3.2.5). (`landing/Projects.vue` مفهوش الـ span ده — الفجوة هنا بس)
- [ ] `app/pages/projects/index.vue` — أصلح الـ JSON-LD `ItemList`: `'url': project.url || project.repoUrl || \`${siteUrl}${getProjectLink(project).to}\`` (كانت هتطلع `undefined` لمشروع repo-only)
- [ ] أنشئ `app/pages/projects/[slug].vue` — `useAPI(\`/projects/slug/${route.params.slug}\`, { key: \`project-${route.params.slug}\`, default: () => ({}), transform: r => r || {} })` + `setResponseStatus(useRequestEvent(), 404)` على السيرفر لو مفيش `title` (نفس نمط `blog/[slug].vue`)
- [ ] `app/pages/projects/[slug].vue` — الأقسام بالترتيب: رجوع لـ `/projects` → صورة/عنوان/tag → **«دوري»** + `role` → `<CommonProjectStackBadges>` → **«الفكرة»** (`v-if="project.origin"`) → **«طريقة التنفيذ»** (`v-if="project.process"`) → CTAs → بلوك fallback (`v-else`)
- [ ] `app/pages/projects/[slug].vue` — CTAs: `UButton` «زيارة الموقع المباشر» (`color="primary"`, `v-if="project.url"`) + `UButton` «عرض الكود» (`color="neutral" variant="outline" icon="i-lucide-github"`, `v-if="project.repoUrl"`)
- [ ] `app/pages/projects/[slug].vue` — JSON-LD `@type: CreativeWork` + `creator` Person (نظير `author` في الـ blog) + `useBreadcrumbSchema([{ name: 'المشاريع', path: '/projects' }, { name: project.title, path: ... }])`
- [ ] `app/components/landing/Projects.vue` — وصّل `getProjectLink` للـ `:to`/`:target`/`:rel` (السطور 59-61 — دلوقتي فيهم `target="_blank"` و`rel` ثابتين). **متضيفش** سطر «دوري» ولا قسم الـ tools هنا (قرار الكثافة)
- [ ] `server/api/__sitemap__/urls.get.ts` (⚠️ **مش** `app/server/...` — الـ `server/` أخو الـ `app/` في Nuxt 4، مش ابنه؛ ملف في المكان الغلط بيتجاهله Nitro في صمت) — استخدم `/projects?isActive=true&limit=100&fields=enSlug,role,updatedAt,createdAt` (العام، مش `/projects/all` المحمي)، اقرا `json?.data` (**envelope مش array مجرّدة**)، وفلتر `p.enSlug && p.role`
- [ ] `nuxt.config.ts` — أضف `'/projects/**': { swr: 60 }` جنب `'/projects': { swr: 60 }` (نفس النمط المزدوج بتاع الـ blog)
- [ ] `pnpm lint && pnpm typecheck` نضاف
- [ ] فحص يدوي: `/projects/warraq` بترسم 200؛ `/projects/xyz` بترجع 404
- [ ] فحص regression: مشروع لسه من غير `role` → كارته لسه بيودّي برّه مباشرة
- [ ] فحص بصري: الصفحة متسقة مع «الحضور الهادئ» — flat، مفيش gradient text، مفيش أكتر من 3 لحظات أمبر
- [ ] **انزل لوحدك** (متبنيش مع `apps/db` في نفس الوقت)
