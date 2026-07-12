<div dir="rtl">

# تدقيق وتنظيف المحتوى — نطاق الـ Dashboard (apps/db)

> 🔗 جزء من ميزة «تدقيق وتنظيف المحتوى» اللي بتمتد كمان على: **apps/client** و**apps/server**.
> الملفات المرتبطة:
> - ../../client/Plan/2026-07-09-content-accuracy-cleanup.md
> - ../../server/Plan/2026-07-09-content-accuracy-cleanup.md

- **التاريخ:** 2026-07-09
- **المشروع:** apps/db (Nuxt 4 dashboard — بيمدّ my-base-layer)
- **الحالة العامة:** ✅ **مُنفَّذة جزئياً** (2026-07-12، branch `feat/content-accuracy-cleanup`، بدون commit) ومنقولة لـ `Plan/Done/`. الكود (M1 حذف + M2 حواجز) اتنفّذ؛ **M3 (تأليف المحتوى) مُرحَّل بالكامل — عمليات runtime على الـ dashboard يعملها المستخدم**، وهي شرط مسبق لنشر حدود السيرفر. اتراجعت بـ `/my-audit` (2026-07-13). كانت 🔒 مقفولة بعد المراجعة.

## نظرة عامة

نطاق الـ dashboard بيغطّي ٣ حاجات:

1. **مطابقة الحذف** اللي بيحصل في السيرفر (موديول `Services`، وحقل `Info.stats`) عشان الـ dashboard مايفضلش فيه شاشات لداتا اتشالت.
2. **حواجز طول الوصف في الـ UI** — عدّاد حروف + `maxlength` + قيود Zod + placeholder/help أوضح في فورمات المشاريع والمقالات.
3. **تأليف/تصحيح المحتوى** (بدون كود): أسئلة FAQ الجديدة، وتطبيق مسودّات أوصاف المشاريع الأربعة (النصوص نفسها في خطة الـ client)، وتقصير وصف مقال المدونة الوحيد المنشور اللي متجاوز الحد.

## الـ Scope

- **داخل الـ scope:**
  - حذف موديول `Services` بالكامل من الـ dashboard (pages + components + composables + عنصر السايدبار).
  - إزالة قسم `stats` من فورم/سكيمة `Infos`.
  - إضافة `useCharacterCounter` + `:maxlength` + قيود Zod (`.min(60).max(...)`) + عدّاد في slot الـ `#hint` + placeholder/help أوضح في `ProjectsForm.vue` و`BlogForm.vue`.
  - **تقصير وصف «ورّاق» (322→≤200)** ووصف مقال «تحليل عميق لـ JavaScript Hoisting» (206→≤160)، عبر الـ UI الحالي، **قبل** ما السيرفر يفعّل الحد.
  - تأليف صفوف FAQ الجديدة (توفّر/تعاون) عبر صفحة `/faqs`.
  - تطبيق مسودّات إعادة صياغة أوصاف المشاريع الأربعة (المسودّات في خطة الـ client).
- **خارج الـ scope:**
  - أي تعديل على my-base-layer (بنستعمل `Base*` زي ما هي — العدّاد عبر slot موجود، بدون تعديل الطبقة).
  - موديول `Skills` في الـ dashboard — **يفضل زي ما هو** (Skill حيّة).
  - التوصيات (كلام العملاء).

## المناطق المتأثرة في الكود

- **حذف:** `pages/services/index.vue`، `pages/services/[id]/index.vue`، `components/modules/services/{ServicesForm,ServicesTable}.vue`، `composables/modules/services/{schema,form,columns,table,actions,index}.js`، `composables/services/services.js`.
- `composables/layout/sideBar/index.js` — إزالة عنصر «الخدمات».
- `composables/modules/infos/schema.js` — إزالة حقل `stats`.
- `composables/modules/infos/form.js` — إزالة `stats` من `INITIAL_STATE`/`populateForm`/`prepareSubmitData`.
- `components/modules/infos/InfosForm.vue` — إزالة بلوك «Stats Section» + دوال `addStat`/`removeStat`.
- `composables/modules/projects/schema.js` — `description: z.string().min(60,'…').max(200,'…')`.
- `composables/modules/blog/schema.js` — `description: z.string().min(60,'…').max(160,'…')`.
- `components/modules/projects/ProjectsForm.vue` — `:maxlength="200"` + عدّاد `#hint` + placeholder/help.
- `components/modules/blog/BlogForm.vue` — `:maxlength="160"` + عدّاد `#hint` + placeholder/help.
- **إنشاء:** `composables/useCharacterCounter.js` (auto-import عبر `composables/**`).

## الـ Edge cases

- **`maxlength` كـ attribute بيشتغل، `minlength` لأ:** الـ `Base*` بتمرّر الـ attrs للـ native input فالـ `maxlength` بيمنع الكتابة الزيادة؛ لكن الحد الأدنى (60) لازم يتفرض عبر **Zod** لأن `minlength` بيتفحص بس عند submit أصلي واللي `UForm` بيعترضه.
- **مفيش عدّاد جاهز في Nuxt UI 4:** بنعمل عدّاد يدوي في slot الـ `#hint` (اللي `BaseTextarea` بيمرّره).
- **تقصير قبل التفعيل:** «ورّاق» (322 حرف) ومقال «تحليل عميق لـ JavaScript Hoisting» (206 حرف) لازم يتقصّروا من هنا **قبل** ما السيرفر يفعّل `minlength`/`maxlength` — وإلا حفظهم بعد التفعيل هيفشل، حتى لو التعديل مش على الوصف نفسه (الفورم بيبعت الحالة كاملة).
- **الفئة (category) في FAQ نص حر** — مفيش تعديل schema مطلوب لإضافة فئة «عام/طريقة العمل».

## معايير القبول

- [x] مفيش صفحة/عنصر سايدبار لـ «الخدمات» في الـ dashboard، والبناء أخضر (`pnpm build:db`/`lint`). ✔️ حُذف الموديول (11 ملف) + عنصر السايدبار + `lint` أخضر على الملفات المتغيّرة. (`pnpm build:db` مُرحَّل: يحتاج جلب base-layer/GIGET_AUTH — قيد بيئي.)
- [x] فورم `Infos` مفيهوش قسم «الإحصائيات» ولا بيرسل `stats`. ✔️ الكود: stats اتشال من schema + INITIAL_STATE/populateForm/prepareSubmitData + بلوك الـ template + دوال addStat/removeStat.
- [ ] كتابة وصف مشروع أطول من 200 (أو مقال أطول من 160) **متمنوعة أثناء الكتابة**، والعدّاد بيبان (مثلاً «42/200»). — **مُرحَّل: فحص بصري (dashboard شغّال). الكود: `:maxlength` + عدّاد `#hint` مطبَّقين.**
- [ ] حفظ وصف أقصر من 60 بيتمنع برسالة Zod واضحة تحت الحقل. — **مُرحَّل: فحص بصري. الكود: Zod `.min(60, '...')` مطبَّق برسالة عربية.**
- [ ] وصف «ورّاق» بقى ≤ 200 حرف (اتطبّقت مسودّة الـ client). — **مُرحَّل: runtime (المستخدم على الـ dashboard).**
- [ ] وصف مقال «تحليل عميق لـ JavaScript Hoisting» بقى ≤ 160 حرف. — **مُرحَّل: runtime (المستخدم).**
- [ ] أوصاف المشاريع الأربعة اتراجعت واتطبّقت مسودّاتها. — **مُرحَّل: runtime (المستخدم).**
- [ ] أسئلة FAQ الجديدة (توفّر/تعاون، بدون سعر) اتضافت وظاهرة على الموقع. — **مُرحَّل: runtime (المستخدم).**
- [x] موديول `Skills` في الـ dashboard لسه شغّال (إثبات إن Skill ماتمستش). ✔️ الكود: موديول skills لم يُمسّ (الحذف اقتصر على services + stats).

## الـ Dependencies والمخاطر

- **الترتيب:** حذف موديول Services في الـ db **بعد** حذف راوتس Service في السيرفر (Milestone 2 في خطة السيرفر).
- **اتساق الحدود:** قيم `maxlength`/Zod لازم تطابق حدود السيرفر (200/160/60) — يُفضّل تنزل بعد Milestone 1 في خطة السيرفر.
- **تقصير «ورّاق» ومقال «Hoisting»** شرط مسبق لتفعيل حدود السيرفر (مشاريع ومقالات) — اعتماد متبادل موثّق في خطة السيرفر.

## القرارات المحسومة

- **حواجز الطول: dashboard + server معاً** بالحدود 200/160/60. السبب: feedback فوري + ضمان حقيقي. (المصدر: مقابلة)
- **العدّاد عبر slot الـ `#hint` بدون تعديل my-base-layer.** السبب: الطبقة مصدر حقيقة مشترك، ماتتعدّلش لأجل feature. (المصدر: مراجعة معمارية)
- **`Info.stats` تتحذف من الـ dashboard؛ `resumeUrl` يتبقى.** السبب: stats ميتة، resumeUrl هيتستخدم في زرار CV. (المصدر: مقابلة)
- **موديول `Services` يتحذف؛ موديول `Skills` يتبقى.** السبب: Service ميت، Skill حيّة. (المصدر: مراجعة معمارية)
- **مراجعة أوصاف المشاريع الأربعة فعلياً** عبر الـ dashboard (النصوص من مسودّات الـ client)؛ المقالات دليل+حواجز بس؛ التوصيات خارج الـ scope. (المصدر: مقابلة)
- **FAQ رشيق** (توفّر/تعاون، بدون سعر — السعر بيتحسم في اجتماع). حقائق: عن بُعد ✓، دوام كامل + فريلانس ✓، دعم بعد التسليم ✓. (المصدر: مقابلة)
- **تقصير مقال «Hoisting» (206→≤160 حرف)** ضروري بنفس منطق «ورّاق» — الفحص التنفيذي الأصلي غطّى المشاريع بس وفاته المقال الوحيد المنشور. (المصدر: فحص تنفيذي فعلي — جولة مراجعة 1، 2026-07-09)

---

## Milestones

### Milestone 1: مطابقة الحذف (بعد Milestone 2 في السيرفر)

- [x] حذف موديول `Services` بالكامل (pages + components + composables + service). ✔️ `git rm` لـ 11 ملف (pages/services، components/modules/services، composables/modules/services، composables/services/services.js).
- [x] إزالة عنصر «الخدمات» من `sideBar/index.js`.
- [x] إزالة قسم `stats` من `infos` (schema + form + InfosForm.vue). ✔️ حُذف من schema + INITIAL_STATE/populateForm/prepareSubmitData + بلوك Stats Section + دوال addStat/removeStat.
- [x] التحقق: ✔️ `lint` أخضر على كل الملفات المتغيّرة + grep = صفر مراجع للموديول المحذوف (مطابقات `stats` كلها في موديول roadmap غير المتأثر) + السايدبار بدون «الخدمات» + موديول Skills لم يُمس. (`pnpm build:db` مُرحَّل: يحتاج جلب base-layer/GIGET_AUTH — قيد بيئي.)

### Milestone 2: حواجز طول الوصف في الـ UI

- [x] إنشاء `composables/useCharacterCounter.js` (عدّاد code-point + حالات تحت-الحد/فوق-الحد + نص hint + colorClass).
- [x] `ProjectsForm.vue`: `:maxlength="200"` + عدّاد في `#hint` + Zod `.min(60).max(200)` + placeholder/help أوضح.
- [x] `BlogForm.vue`: `:maxlength="160"` + عدّاد في `#hint` + Zod `.min(60).max(160)` + placeholder/help أوضح.
- [ ] التحقق: التجاوز ممنوع أثناء الكتابة، والأقل من الحد الأدنى بيتمنع برسالة Zod. — **مُرحَّل: فحص بصري على الـ dashboard شغّال (يحتاج base-layer + سيرفر).**

### Milestone 3: تأليف/تصحيح المحتوى (بدون كود) — ⚠️ runtime: يعمله المستخدم على الـ dashboard

> كل بنود هذا الـ milestone عمليات محتوى على قاعدة Atlas الإنتاجية عبر الـ dashboard — مش كود، ولا يقدر ينفّذها المنفّذ. **تقصير «ورّاق» و«Hoisting» شرط مسبق لنشر حدود السيرفر في الإنتاج** (وإلا أي حفظ لاحق للسجلّين هيفشل).

- [ ] تقصير وصف «ورّاق» لـ ≤ 200 (مسودّة الـ client) — **قبل** تفعيل حد السيرفر. — **مُرحَّل: runtime (المستخدم).**
- [ ] تقصير وصف مقال «تحليل عميق لـ JavaScript Hoisting وتأثيره على الكود» لـ ≤ 160 حرف — **قبل** تفعيل حد السيرفر. — **مُرحَّل: runtime (المستخدم).**
- [ ] تطبيق مسودّات إعادة صياغة المشاريع: «عصام فهمي» و«دريم تي في بلاير» (شيل اللقب الذاتي/الـ stack-أولاً) + مراجعة «ترابط». — **مُرحَّل: runtime (المستخدم).**
- [ ] إضافة صفوف FAQ الجديدة (فئة «عام/طريقة العمل») من مسودّات الـ client. — **مُرحَّل: runtime (المستخدم).**

</div>
