# دور المشروع وأدواته + صفحة تفاصيل المشروع (DB Dashboard)

> 🔗 جزء من ميزة «دور المشروع وأدواته + صفحة تفاصيل المشروع» بتشمل كمان: client و server.
> الملفات المرتبطة:
> - [../../client/Plan/2026-07-14-project-role-and-tools.md](../../client/Plan/2026-07-14-project-role-and-tools.md)
> - [../../server/Plan/2026-07-14-project-role-and-tools.md](../../server/Plan/2026-07-14-project-role-and-tools.md)

- **التاريخ:** 2026-07-14
- **المشروع:** apps/db (Nuxt 4 dashboard، بيمدّ my-base-layer)
- **الحالة العامة:** قيد المراجعة — 10 جولات (1: 2🔴+6🟠 · 2: 1🔴+3🟠 · 3: 0🔴+2🟠 · 4: 0🔴+2🟠 · 5: 1🔴+1🟠 · 6: 1🔴+1🟠 · 7: نظيفة ✅ · 8: 1🟠 · 9: نظيفة ✅ · **10: 1🔴+2🟠 اتصلحت**) — العدّاد النظيف رجع لصفر، محتاج جولتين نظاف متتاليتين للقفل ([سجل المراجعة](../../client/Plan/2026-07-14-project-role-and-tools.review-log.md))

## نظرة عامة

جزء الـ dashboard هو **الجسر** بين الـ schema والمحتوى: بيفتح الحقول الجديدة في فورم المشاريع، وبعدين بيتملّي بيها الـ 4 مشاريع الموجودين — وده الشرط المسبق لكل من صفحة الـ client والتضييق في الـ server.

الشغل هنا **أصغر مما يبان في معظمه**: `toolIds` بيعيد استخدام نفس الـ `skillsList` المتجابة أصلاً مرة واحدة من `/skills/all` عشان `skillIds` — مفيش fetch تاني، مفيش composable جديد. و4 ملفات من اللي كانوا متوقعين مش محتاجين تغيير خالص.

**بس فيه حتة واحدة مش تافهة:** الميزة دي بتخلّي الفورم — لأول مرة — فيه حقول اختيارية قابلة للتفضية: **7 حقول** (`url` اللي بقى اختياري + `repoUrl`/`enSlug`/`role`/`origin`/`process` الجداد + `toolIds`) — وكل حقول الفورم قبل كده مجبرة. والـ `toFormData` مبيعرفش يعبّر عن «حقل اتفضّى»، فمسح أي واحد من السبعة محتاج sentinel صريح (تفاصيله في Milestone 1).

ترتيب التنفيذ العام: server M1 → client M1 → server M2 → **db M1** → **db M2 (محتوى)** → client M2 → server M3 + **db M3**.

## الـ Scope

- **داخل الـ scope:**
  - `app/composables/modules/projects/schema.js` — قواعد Zod للحقول الجديدة + `refine` متقاطع لـ `url`/`repoUrl`.
  - `app/composables/modules/projects/form.js` — `INITIAL_STATE` + `populateForm` + `prepareSubmitData`.
  - `app/components/modules/projects/ProjectsForm.vue` — الحقول الجديدة + إعادة تسمية label الـ `skillIds`.
  - **ملء الـ 4 مشاريع الموجودين** (محتوى، مفيش كود).
  - التضييق النهائي (`role`/`enSlug` مجبرين) — متزامن مع server M3.
- **خارج الـ scope:**
  - `app/composables/services/projects.js` — **مفيش تغيير**. generic بالكامل (`create`/`update`/`remove` proxy)، مش شايف الحقول أصلاً.
  - `app/composables/modules/projects/{actions,table,index}.js` — **مفيش تغيير**.
  - `app/pages/projects/**` — **مفيش تغيير**.
  - **إضافة مشاريع الـ AI الجديدة** — خارج الخطة بقرار صريح (قرار #7). أول ما الحقول تبقى موجودة، بتتضاف من الفورم في أي وقت من غير ما حد يكتب سطر كود.
  - أي تعديل على موديول الـ skills نفسه — `Skill` model ما اتغيرش.

## المناطق المتأثرة في الكود

**ملفات معدّلة (3 + 1 اختياري):**

- **`app/composables/modules/projects/schema.js`** — `url` يبقى `.optional().or(z.literal(''))`؛ إضافة `repoUrl` · `enSlug` (بـ regex) · `role` · `origin` · `process` · `toolIds`؛ و`.refine()` على الـ object للتحقق المتقاطع مع `path: ['url']` (نفس فكرة الـ cross-field error عبر `path` المستخدمة في `middleware/validators/common.js` → `passwordConfirmRule`، بس بـ Zod).
- **`app/composables/modules/projects/form.js`** — توسيع `INITIAL_STATE` و`populateForm` و`prepareSubmitData` + **منطق الـ sentinel للحقول الاختيارية**. `toolIds` مطابق هيكلياً لـ `skillIds` (array من Mongo ID strings) فبيمشي في الـ `toFormData()` الموجودة **للكتابة** — بس **مش للمسح**: `toFormData` بيتخطى الـ `[]` والـ `undefined` تماماً، فتفضية أي حقل اختياري محتاجة sentinel صريح (تفاصيله في الـ Milestone والـ edge cases).
- **`app/components/modules/projects/ProjectsForm.vue`** — الحقول الجديدة + إعادة تسمية.
- **`app/composables/modules/projects/columns.js`** (اختياري، موصى به) — عمود مؤشّر «الدور متملّي؟» (أيقونة ✓ / —). بيخدم workflow الـ backfill في Milestone 2 مباشرةً: تشوف بنظرة مين لسه ناقص.

## الـ Edge cases

- **`url` و`repoUrl` الاتنين فاضيين** → الـ `.refine()` بترفض، والرسالة بتتعلّق على حقل `url` (`path: ['url']`) عشان تظهر inline جنبه مش فوق الفورم.
- **`enSlug` بحروف كبيرة أو مسافات** → الـ regex `/^[a-z0-9]+(-[a-z0-9]+)*$/` بترفض. الـ server بيعمل `lowercase: true` كمان كخط دفاع تاني.
- **`enSlug` مكرر** → الـ dashboard **مش** هيمسكها (مفيش تحقق تفرّد client-side)، والـ server هيرجّع **500 «حصل خطأ ما» غامضة** — مش 400 على الحقل. السبب: `errorController.js:140-142` بيحط `err.isHandled = true` بس **مش** `isOperational`، والسطر 137 بيسيب `statusCode = 500`، فـ `sendErrorProd` بيقع على الـ `else` العام. (الـ `ValidationError` بيتحوّل لـ 400 صح في `errorController.js:156-162` — الـ E11000 هو اللي مااتعاملش معاه بنفس الطريقة.) **وده كله بس بعد Milestone 3** — قبلها مفيش `unique` أصلاً فالتكرار بيتقبل في صمت. في Milestone 2 المسؤولية عليك: **4 قيم مختلفة ومش فاضية**، بالعين — من `GET /projects` مش من جدول الداشبورد (مفيش عمود `enSlug` فيه). ⚠️ الـ `''` بتعدّي شرط «مختلفة» حرفياً، فسهو واحد في الـ backfill بيدّي 4 قيم «مختلفة» فيهم فاضية.
  > 🟡 إصلاح `errorController` عشان E11000 يرجّع 400 اتأجّل للـ backlog عن قصد — سطر واحد، بس بيغيّر سلوك **كل** الـ models (تكرار `title` في Blog وSkill وProject)، وده ملف مشترك خارج نطاق مراجعة الميزة دي.
- **حقول اختيارية بتتبعت كـ string فاضية** → `.or(z.literal(''))` بتسمح بيها في الـ Zod. وعلى السيرفر لازم **طبقتين** يقبلوها: `.optional({ values: 'falsy' })` في الـ express-validator (بيشتغل الأول) **و** validator محروس بـ `!v ||` في الـ Mongoose model. خطة الـ server بتنص على الاتنين لكل الحقول الجديدة. متبعتش `null`.
- **`toolIds` بيسحب من نفس قايمة `skillIds`** → الـ فصل في الـ **labels** («مبني بـ» vs «اتبنى إزاي») مش في الداتا. مفيش حاجة بتمنعك تحط `Nuxt` في الـ tools بالغلط — الاتساق مسؤوليتك أنت وقت الإدخال.
- **🔴 مسح أي حقل اختياري (نص أو array)** → لازم يعدّي على الـ sentinel. من غيره الحقل **مبيتغيّرش أبداً**: **toast نجاح، الفورم بيبان فاضي، والموقع لسه بيوري القديم**.
  - **النصوص** (`url`/`repoUrl`/`enSlug`/`role`/`origin`/`process`): `BaseInput`/`BaseTextarea` بيبعتوا `undefined` للفاضي (`Textarea.vue:61`, `Input.vue:67`)، و`toFormData.js:9` بيعمل `return` على الـ `undefined`.
  - **الـ arrays** (`toolIds`): `toFormData` بيعمل `forEach` والـ `[]` بتلف صفر مرات.
  - **مثال حي:** ورّاق بيقع → تمسح `url` وتحط `repoUrl` → الـ `url` مبيتمسحش → الموقع لسه بيوري «زيارة الموقع المباشر» على دومين ميت. ودي بالظبط القدرة اللي قرار «`url` اختياري + `repoUrl`» موجود عشانها.
  - **ليه ده مكانش باين قبل الميزة:** كل حقول الفورم القديمة **مجبرة** — مفيش حقل شرعي ينفع يتفضّى. `skillIds` محمي بـ `min 3`. الميزة دي بتضيف أول 6 حقول اختيارية دفعة واحدة.
- **`Claude Code`/`MCP` لازم يتعملوا كـ `Skill` docs الأول** → لو مش موجودين في `/skills`، مش هيظهروا في الـ dropdown. لاحظ إن `Skill.icon` عليه validator `/^i(-[a-z0-9]+)+$/` — فمحتاجين أيقونة بالفورمات ده.

## معايير القبول

- [ ] `pnpm lint && pnpm typecheck` نضاف في كل milestone.
- [ ] فورم المشاريع بيفتح ويحفظ **من غير** `url` طالما `repoUrl` متملّي — والعكس.
- [ ] الفورم بيرفض حفظ مشروع لو الاتنين فاضيين، والرسالة بتظهر **جنب حقل `url`** مش فوق الفورم.
- [ ] `enSlug` بحروف كبيرة/مسافات بيترفض inline قبل ما يوصل للسيرفر.
- [ ] تعديل بسيط (مثلاً `title`) على مشروع قديم **بينجح** وهو لسه من غير `role` — مفيش error مقفّل.
- [ ] الـ 4 مشاريع كلهم عندهم `role` مش فاضي + **4 قيم `enSlug` مختلفة ومش فاضية** (⚠️ الـ `''` بتعدّي شرط «مختلفة» حرفياً لو slug واحد بس اتمسح/اتنسي — «مش فاضية» جزء من المعيار، مطابق للبوابة في Milestone 2). **التأكيد عبر `GET /projects` حصرياً** — جدول الـ dashboard **مش** مصدر دليل هنا: أعمدته `documentNumber`/`image`/`title`/`tag`/`isActive`/`actions` بس (`columns.js`)، مفهوش `enSlug` ولا `role`.
- [ ] `toolIds` بيتحفظ وبيرجع في `GET /projects` جوّه `tools` مليانة.
- [ ] **مسح كل الأدوات بيشتغل فعلاً:** حط أداتين على مشروع → احفظ → شيل الاتنين → احفظ → `GET /projects` بيوري `tools: []`. (من غير الـ sentinel ده بيفشل بصمت مع toast نجاح.)
- [ ] **مسح النصوص بيشتغل فعلاً:** حط `origin` على مشروع → احفظ → امسحه → احفظ → `GET /projects` بيوري `origin: ''`. نفس الفحص لـ `url` (مع `repoUrl` متملّي) — الحقل بيتفضّى فعلاً مش بيرجع بقيمته القديمة.
- [ ] **مسح الـ `enSlug` بيشتغل فعلاً (سحب صفحة داخلية):** مشروع عنده `role` + `enSlug` → امسح الـ `enSlug` → احفظ → `GET /projects` بيوري `enSlug: ''`، والكارت في الـ client يرجع يودّي برّه. (في M3 المسح بيترفض inline — `enSlug` بقى مجبر، وده السلوك الصح.)
- [ ] **حفظ مشروع من غير أدوات خالص بينجح** — مش 400. (ده مسار الـ backfill في Milestone 2 نفسه: الأدوات فاضية بالفطرة وقتها.)
- [ ] بعد Milestone 3: الفورم بيرفض إنشاء مشروع من غير `role` أو `enSlug`.

## الـ Dependencies والمخاطر

- 🔴 **Milestone 1 معتمد على server M2** — الحقول لازم تكون موجودة في الـ API قبل ما الفورم يبعتها.
- 🔴 **Milestone 2 (المحتوى) هو عنق الزجاجة للميزة كلها.** client M2 و server M3 الاتنين مستنيينه. ومش شغل مبرمج — ده **إنت** اللي هتكتب «دوري» و«الفكرة» و«طريقة التنفيذ» لكل مشروع.
- 🔴 **متعملش مشروع خامس قبل Milestone 3** — قرار #7 بيقول المشاريع الجديدة بعدين أصلاً، بس الأهم إن كل doc جديد من غير `enSlug` بيزوّد فرصة إن قيد الـ `unique` **يفشل في صمت** وقت بناء الـ index. ⚠️ **مش E11000** — الفشل صامت تماماً (مفيش log ولا crash)، والتفاصيل في خطة الـ server → قسم المخاطر.
- ⚠️ **مفيش DB محلي** — الفورم بيكتب على Atlas الإنتاج مباشرةً. أي حاجة تحفظها = حاجة على الموقع الحقيقي.
- ⚠️ **الـ deploy انتقائي**: `apps/db/**` بيعمل rebuild للـ dashboard (port 9122). متبنيش مع `apps/client` في نفس الوقت — الـ RAM بتخلص.
- ⚠️ **`my-base-layer` هو مصدر الحقيقة** لأي `Base*` component (`F:\Code\personal\Temp\my-base-layer`) — اقرا المصدر الفعلي قبل استخدام `BaseTextarea`/`BaseSelect`، منصوص عليه في `apps/db/CLAUDE.md`.

## القرارات المحسومة

- **مسطرة واحدة لكل المشاريع: «دوري» + «الأدوات»** — مفيش تصنيف «AI ولا لأ». الشفافية من **محتوى** الحقلين مش من تصنيف فوقهم. (المصدر: مقابلة)
- **السردية = حقول منظمة، فقرة لكل سؤال** — 3 `BaseTextarea` بحدود دنيا وعليا، مش rich editor. السبب: الاتساق بيدّي المصداقية. (المصدر: مقابلة)
- **`toolIds` منفصل عن `skillIds`، بس من نفس الـ `Skill` collection** — `Skill` model **ما اتغيرش خالص** (لا `category` ولا حاجة). السبب: `category` كان هيحتاج migration للـ 4 skills الموجودين على Atlas الإنتاج، ولسه مكانش هيصلّح إن `min 3` بتعدّ حاجتين مختلفين. حقلين منفصلين على الـ `Project` بيحلوا الاتنين بصفر migration. (المصدر: مقابلة + مراجعة معمارية)
- **مسح أي حقل اختياري محتاج sentinel صريح (`''`) — لكل الحقول الاختيارية السبعة (`url`/`repoUrl`/`enSlug`/`role`/`origin`/`process` + `toolIds`)، مش الأدوات بس** — الـ FormData مبيعرفش يفرّق بين «الحقل مبعتش» و«الحقل اتبعت فاضي»، والمعلومة بتضيع قبل ما توصل للسيرفر. آليتين مختلفتين بتوصّلوا لنفس النتيجة: النصوص بتتبعت `undefined` من `BaseInput`/`BaseTextarea` و`toFormData` بيتخطاها؛ والـ arrays الفاضية `forEach` عليها بيلف صفر مرات. **جولة 1 سجّلت المبدأ العام ده وبعدين صلّحت حقل واحد (`toolIds`)، جولة 2 عمّمته لستة، وجولة 3 كمّلت `enSlug` اللي كان ساقط من التعميم.** البدائل اتفحصت واترفضت: تعديل `toFormData` نفسه (هو في `my-base-layer`، ريبو تاني بيخدم مشاريع تانية — مخاطرة في حتة مش مراجعينها)، وتحويل الفورم لـ JSON (الـ route بيستقبل صور فمحتاج multipart). (المصدر: مراجعة جولة 1 + 2 + 3 — مثبت بالتشغيل)
- **بوابة الـ 4 مصاغة «مختلفة ومش فاضية» في كل مواضعها، ودليلها `GET /projects` حصرياً** — جولة 3 شدّدت الصياغة في البوابة (`M2`) وشرط server M3، وسابت معيار القبول وedge case الـ `enSlug` المكرر بـ«مختلف» المجرّدة — والـ `''` بتعدّي شرط «مختلفة» حرفياً، فسهو واحد في الـ backfill بيدّي «4 قيم مختلفة» فيهم فاضية، ومعيار القبول (الأرتيفاكت اللي الـ audit بيقراه) بياخد ✓ بينما البوابة بتفشل. وجدول الداشبورد **مش** مصدر دليل: أعمدته `documentNumber`/`image`/`title`/`tag`/`isActive`/`actions` بس — مفيش `enSlug` ولا `role` (والعمود المقترح «الدور متملّي؟» اختياري وبيغطي `role` بس). (المصدر: مراجعة جولة 10)
- **إعادة تسمية label الـ `skillIds`** من «المهارات (3 على الأقل)» لـ «مبني بـ (3 على الأقل)» — عشان مفردات الـ dashboard تطابق اللي الزائر بيشوفه. تغيير نصّي منخفض المخاطر. (المصدر: مراجعة معمارية)
- **`role` مجبر · `origin`/`process` اختياريين** — بس التضييق متأخّر لـ Milestone 3. (المصدر: مقابلة)
- **الخطة = المعمار + محتوى الـ 4 الموجودين بس** — مشاريع الـ AI الجديدة محتوى مش كود، بتتضاف من الفورم بعدين. (المصدر: مقابلة)

---

## Milestones

### Milestone 1: فتح الحقول الجديدة في الفورم
- [ ] ⛔ **شرط مسبق:** خطة الـ server → Milestone 2 نزلت (الحقول موجودة في الـ API)
- [ ] شغّل `pnpm lint && pnpm typecheck` على الكود زي ما هو وتأكد إنهم نضاف — ده الـ gate اللي كل milestone بعده بيعيد تشغيله
- [ ] `app/composables/modules/projects/schema.js` — `url`: `.optional().or(z.literal(''))`
- [ ] `app/composables/modules/projects/schema.js` — أضف `repoUrl` (URL، اختياري) · `enSlug` (regex `/^[a-z0-9]+(-[a-z0-9]+)*$/`، اختياري دلوقتي) · `role` (20-300، اختياري دلوقتي) · `origin` (40-600، اختياري) · `process` (40-600، اختياري) · `toolIds` (array، اختياري)
- [ ] `app/composables/modules/projects/schema.js` — أضف `.refine(d => Boolean(d.url) || Boolean(d.repoUrl), { message: 'أدخل رابط الموقع المباشر أو رابط المستودع (واحد منهما على الأقل)', path: ['url'] })` على الـ object
- [ ] `app/composables/modules/projects/form.js` — وسّع `INITIAL_STATE` بـ `enSlug`/`repoUrl`/`role`/`origin`/`process` (`undefined`) و`toolIds` (`[]`)
- [ ] `app/composables/modules/projects/form.js` — وسّع `populateForm` و`prepareSubmitData` عشان يمرّروا الحقول الجديدة جوّه `toFormData()`
- [ ] `app/composables/modules/projects/form.js` — 🔴 في `prepareSubmitData`، حوّل **كل** الحقول الاختيارية الفاضية لـ **sentinel** قبل `toFormData()`:
      ```js
      // الحقول الاختيارية: undefined = نية مسح صريحة.
      // BaseInput/BaseTextarea بيبعتوا undefined للفاضي (مش '')، وtoFormData بيتخطى الـ undefined —
      // فالمسح لازم يتحوّل لـ '' عشان يتبعت أصلاً.
      for (const f of ['url', 'repoUrl', 'enSlug', 'role', 'origin', 'process']) {
        if (data[f] === undefined) data[f] = ''
      }
      if (!data.toolIds?.length) data.toolIds = ''
      ```
      **السبب (آليتين مختلفتين، نفس النتيجة):** (1) للـ **نصوص** — `Textarea.vue:61` و`Input.vue:67` بيعملوا `emit(..., $event || $event === 0 ? $event : undefined)`، و`toFormData.js:9` بيعمل `return` فوراً على الـ `undefined`. (2) للـ **arrays** — `toFormData` بيعمل `data.forEach(...)` والـ `[]` بتلف صفر مرات. في الحالتين: مفيش مفتاح بيتبعت → `findByIdAndUpdate` **مبيلمسش الحقل** → **toast نجاح، الفورم بيبان فاضي، والموقع لسه بيوري القديم**.
      ⚠️ **`role` و`enSlug` في القايمة عن قصد:** في M1/M2 الاتنين اختياريين فالمسح شرعي (مسح الـ `enSlug` = سحب الصفحة الداخلية — الكارت يرجع يودّي برّه والصفحة تخرج من الـ sitemap)؛ وفي M3 لما يبقوا `required`، الـ `''` بتترفض («Role is required» / «enSlug is required») — وده السلوك الصح.
      (خطة الـ server بتستقبل الـ `''` في طبقتين: `.optional({values:'falsy'})` في الـ validator، وvalidator محروس في الـ model؛ و`normalizeToolIds` بيحوّل `toolIds: ''` لـ `[]`)
- [ ] `app/components/modules/projects/ProjectsForm.vue` — شيل `required` من `BaseInput` بتاع `url` + أضف `help` بيشرح قاعدة «واحد منهم على الأقل»
- [ ] `app/components/modules/projects/ProjectsForm.vue` — أضف `BaseInput` لـ `repoUrl` و`BaseInput` لـ `enSlug` (بـ help: «بيبني رابط صفحة المشروع /projects/...»)
- [ ] `app/components/modules/projects/ProjectsForm.vue` — غيّر label الـ `skillIds` من «المهارات (3 على الأقل)» لـ **«مبني بـ (3 على الأقل)»**
- [ ] `app/components/modules/projects/ProjectsForm.vue` — أضف `BaseSelect` تاني لـ `toolIds`: **نفس `skillsList`** (مفيش fetch جديد)، `value-key="id"`, `label-key="name"`, `multiple`, **بدون `required`**، بـ label «اتبنى إزاي (أدوات التنفيذ، اختياري)»
- [ ] `app/components/modules/projects/ProjectsForm.vue` — أضف 3 `BaseTextarea` (`role` / `origin` / `process`)، كل واحد بـ `useCharacterCounter(() => state.field, { min, max })` في `#hint` slot (نفس نمط `descCounter`/`descCounterClass` المستخدم لـ `description`). اقتراح labels: «دوري» / «الفكرة (اختياري)» / «طريقة التنفيذ (اختياري)»
- [ ] (اختياري) `app/composables/modules/projects/columns.js` — عمود «الدور متملّي؟» (✓ / —) عشان يسهّل Milestone 2
- [ ] `pnpm lint && pnpm typecheck` نضاف
- [ ] فحص يدوي: افتح مشروع قديم، عدّل `title` بس، احفظ → **بينجح** وهو لسه من غير `role`
- [ ] فحص يدوي: فضّي `url` وحط `repoUrl` → بيحفظ. فضّي الاتنين → بيترفض والرسالة جنب `url`
- [ ] **انزل لوحده** (متبنيش مع `apps/client`)

### Milestone 2: ملء الـ 4 مشاريع الموجودين (محتوى — مفيش كود)
- [ ] ⛔ **شرط مسبق:** Milestone 1 نزل على `db.beingmomen.com`
- [ ] أنشئ `Skill` docs لأدوات التنفيذ اللي هتستخدمها (مثلاً Claude Code · MCP · الـ workflow بتاعك) — **لاحظ**: `Skill.icon` عليه validator `/^i(-[a-z0-9]+)+$/`، فجهّز أيقونة بالفورمات ده لكل واحد
- [ ] **Warraq — ورّاق**: `enSlug: warraq` + «دوري» + (اختياري) الفكرة/طريقة التنفيذ/الأدوات/`repoUrl`
- [ ] **ترابط | Tarabot**: `enSlug: tarabot` + «دوري» + (اختياري) الباقي
- [ ] **موقع المهندس عصام فهمي**: `enSlug: essam-fahmy` + «دوري» + (اختياري) الباقي
- [ ] **دريم تي في بلاير**: `enSlug: dream-player` + «دوري» + (اختياري) الباقي
- [ ] ✅ **تحقق قاطع قبل ما تكمل:** `GET /projects` بيوري إن الـ 4 كلهم عندهم `role` **مش فاضي** و**4 قيم `enSlug` مختلفة ومش فاضية** (⚠️ الـ `''` بتعدّي شرط «مختلفة» حرفياً لو slug واحد بس اتمسح — عشان كده «مش فاضية» جزء من البوابة). ده الشرط المسبق الحرفي لـ client M2 و server M3 — ومن غيره بناء الـ unique index في server M3 **بيفشل بصمت** عند أول restart (مفيش E11000 ظاهر — Mongoose بيبلعه) والقيد عمره ما يتوجد؛ الكشف في server M3 بالبوابة المزدوجة (`getIndexes` + الفحص الوظيفي)، مش باللوج
- [ ] ⛔ **متعملش مشروع خامس** لحد ما Milestone 3 ينزل

### Milestone 3: التضييق — `role` و`enSlug` مجبرين
- [ ] ⛔ **شرط مسبق صارم:** Milestone 2 خلص والتحقق القاطع عدّى
- [ ] `app/composables/modules/projects/schema.js` — `role`: شيل `.optional().or(z.literal(''))` → `z.string({ message: 'الدور مطلوب' }).min(20).max(300)`
- [ ] `app/composables/modules/projects/schema.js` — `enSlug`: شيل `.optional().or(z.literal(''))`
- [ ] `app/components/modules/projects/ProjectsForm.vue` — أضف `required` على `BaseTextarea` بتاع `role` و`BaseInput` بتاع `enSlug`
- [ ] `pnpm lint && pnpm typecheck` نضاف
- [ ] فحص يدوي: محاولة إنشاء مشروع من غير `role` بتترفض inline
- [ ] فحص يدوي: تعديل أي مشروع من الـ 4 لسه بينجح
- [ ] ⛔ **النزول مشترك — commit واحد بيلمس `apps/db/**` و`apps/server/**` مع بعض** (نفس التضييق في الـ Mongoose schema، خطة الـ server → Milestone 3). **مفيش نزول منفصل للـ db هنا:** `scripts/deploy.sh` بيبني db الأول وبيعمل restart للسيرفر آخر خطوة، فالـ push المشترك بينزّل الفورم قبل الموديل (الاتجاه الآمن) **وبيخلي كود server M3 حيّ قبل بوابة الـ index بتاعته** — وهي بتقيس كود مش منزّل لو النزول اتقسم. تفاصيل البوابة: خطة الـ server → M3 → بند النزول المشترك
