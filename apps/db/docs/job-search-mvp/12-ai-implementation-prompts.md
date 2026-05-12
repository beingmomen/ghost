# 12. AI Implementation Prompts

هذا الملف يحتوي على prompts جاهزة لتنفيذ الـ MVP على مراحل.

استخدم كل prompt وحده. لا تطلب من الـ AI تنفيذ كل المراحل مرة واحدة.

## تعليمات عامة لأي Prompt

أضف هذه التعليمات في بداية أي prompt إذا كان الـ AI لا يعرف سياق المشروع:

```text
أنت تعمل على مشروعين محليين:

Backend:
/media/beingmomen/Code/personal/Clients/Beingmomen/server-2

Dashboard:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ أولًا:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md

اتبع أسلوب الكود الحالي في كل مشروع.
لا تغيّر أو تعيد كتابة أجزاء غير مرتبطة بالمهمة.
لا تنفذ مراحل غير مطلوبة في هذا prompt.
بعد التنفيذ شغّل الفحوصات المتاحة مثل lint إن أمكن، واذكر ما نفذته وما لم تستطع اختباره.
```

## Prompt 1: Backend Skeleton

```text
أنت تعمل على مشروعين محليين:

Backend:
/media/beingmomen/Code/personal/Clients/Beingmomen/server-2

Dashboard:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ أولًا:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md

المطلوب تنفيذ Milestone 1 فقط: Backend Models And Routes Skeleton.

نفذ الآتي في الباك:
- أضف Mongoose models:
  - jobSourceModel.js
  - jobSearchRunModel.js
  - jobModel.js
  - jobMatchModel.js
  - resumeDraftModel.js
  - careerProfileSettingsModel.js
- أضف controllers أساسية:
  - jobSourceController.js
  - jobSearchRunController.js
  - jobController.js
  - manualJobController.js
  - careerProfileController.js
  - resumeDraftController.js
- أضف routes:
  - jobSourceRoutes.js
  - jobSearchRunRoutes.js
  - jobRoutes.js
  - manualJobRoutes.js
  - careerProfileRoutes.js
  - resumeDraftRoutes.js
- سجل الـ routes في app.js تحت /api/v1.
- أضف validators مبدئية في middleware/validators/job.validator.js وصدّرها من middleware/validators/index.js عند الحاجة.
- استخدم authController.protect وrestrictTo([ROLES.ADMIN, ROLES.DEV]) للـ write/action endpoints.

نفذ الآتي في الداشبورد:
- أضف prefixes المطلوبة في server/config/proxy.ts:
  - /career-profile
  - /job-sources
  - /job-search-runs
  - /jobs
  - /manual-jobs
  - /resume-drafts

لا تنفذ:
- Wuzzuf extractor.
- LinkedIn adapter.
- LLM.
- Resume generation.
- UI pages.

النتيجة المتوقعة:
- endpoints الأساسية موجودة ولا تكسر app startup.
- GET /api/v1/jobs يرجع قائمة فارغة أو بيانات موجودة.
- GET /api/v1/job-sources يعمل.
```

## Prompt 2: Career Profile Snapshot

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md

المطلوب تنفيذ Milestone 2 فقط: Career Profile Snapshot.

نفذ في الباك:
- أضف service:
  services/careerProfile/snapshot.js
- اجمع البيانات من:
  - Info
  - Skill
  - Experience
  - Project
  - CareerProfileSettings
- أخرج snapshot مختصر يستخدم في matching وresume generation.
- أضف endpoints:
  - GET /api/v1/career-profile
  - PATCH /api/v1/career-profile/settings
- اجعل PATCH protected ومتاحًا لـ ADMIN/DEV فقط.

نفذ في الداشبورد فقط إذا كان بسيطًا:
- أضف service composable:
  app/composables/services/careerProfile.js

لا تنفذ:
- UI page كاملة.
- Wuzzuf extractor.
- LinkedIn adapter.
- Matching.
- Resume draft.

النتيجة المتوقعة:
- GET /api/v1/career-profile يرجع profile snapshot من البيانات الحالية.
- PATCH settings يحدث إعدادات target roles/default stacks/seniority.
```

## Prompt 3: Wuzzuf Extractor

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/02-wuzzuf-source-design.md

المطلوب تنفيذ Milestone 3 فقط: Wuzzuf Extractor.

نفذ في الباك:
- أضف services/jobSearch/wuzzufExtractor.js.
- أضف services/jobSearch/normalizer.js.
- أضف services/jobSearch/dedupe.js.
- أضف services/jobSearch/sourceRegistry.js إذا احتجته.
- استخدم cheerio الموجود في dependencies.
- اجعل Wuzzuf extractor:
  - يبني search URLs.
  - يجلب صفحات النتائج.
  - يستخرج job cards.
  - يجلب detail pages للوظائف عند الحاجة.
  - يرجع raw jobs.
- normalizer يحول النتائج إلى Job schema.
- dedupe يمنع التكرار حسب sourceJobId أو jobUrl.
- POST /api/v1/job-search-runs يشغل بحث Wuzzuf ويحفظ jobs.
- سجل stats في jobSearchRun.
- أضف rate limit داخلي بسيط: delay بين requests.

قيود مهمة:
- لا high-volume crawling.
- لا scheduled crawling.
- لا LinkedIn.
- لا LLM.
- لا resume generation.

النتيجة المتوقعة:
- POST /api/v1/job-search-runs مع source=wuzzuf يرجع run مكتمل أو running/completed حسب التنفيذ.
- يتم حفظ 10-20 وظيفة في dev عند maxJobs صغير.
- فشل detail page لوظيفة واحدة لا يفشل run كله.
```

## Prompt 4: LinkedIn Manual Import

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/02b-linkedin-source-design.md

المطلوب تنفيذ Milestone 4 فقط: LinkedIn Manual Import.

نفذ في الباك:
- أضف services/jobSearch/manualImport.js.
- endpoint:
  POST /api/v1/manual-jobs/import
- يدعم body:
  {
    "source": "linkedin",
    "jobUrl": "https://www.linkedin.com/jobs/view/...",
    "rawText": "Pasted job description..."
  }
- إذا rawText موجود استخدمه كمصدر أساسي.
- إذا jobUrl موجود يمكن محاولة fetch public page، لكن لا تعتمد عليه وحده.
- لا تستخدم login/cookies/session.
- لا bypass.
- حول البيانات إلى Job normalized واحفظها.
- استخدم dedupe.

اختياري:
- إذا لا يوجد rawText وfetch فشل، أرجع error واضح يطلب لصق Job Description.

لا تنفذ:
- LinkedIn automatic adapter.
- LLM extraction المعقد إذا لم يكن LLM جاهزًا.
- UI كامل.

النتيجة المتوقعة:
- يمكن إدخال وظيفة LinkedIn يدويًا.
- الوظيفة تظهر في GET /api/v1/jobs.
- source يكون linkedin.
```

## Prompt 5: Jobs Dashboard

```text
أنت تعمل على:
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/06-dashboard-ux.md

المطلوب تنفيذ Milestone 5 فقط: Jobs Dashboard.

نفذ في الداشبورد:
- app/composables/services:
  - jobSources.js
  - jobSearchRuns.js
  - jobs.js
  - manualJobs.js
  - careerProfile.js
  - resumeDrafts.js إذا احتجته لاحقًا، ويمكن تأجيله.
- app/composables/modules/jobs:
  - index.js
  - table.js
  - filters.js
  - actions.js
  - columns.js
- app/composables/modules/job-search:
  - index.js
  - form.js
  - schema.js
- app/pages:
  - job-search/index.vue
  - jobs/index.vue
  - jobs/[id]/index.vue
- components:
  - JobsTable.vue
  - JobFilters.vue
  - JobScoreBadge.vue
  - JobStatusBadge.vue
  - JobSourceBadge.vue
  - JobSearchForm.vue
  - SearchRunStatus.vue
- أضف روابط sidebar:
  - بحث الوظائف
  - الوظائف

التزم بأسلوب المشروع الحالي:
- useBaseService.
- useAPI.
- BaseCard/BaseTable/BaseForm إن أمكن.
- Nuxt UI.
- RTL/Arabic labels.

لا تنفذ:
- Matching UI المتقدم.
- Resume draft preview.
- LinkedIn automatic adapter.

النتيجة المتوقعة:
- يمكن تشغيل search run من /job-search.
- يمكن رؤية الوظائف في /jobs.
- يمكن فتح /jobs/:id.
- يمكن فلترة source/status/stack بشكل أولي.
```

## Prompt 6: Matching And Gap Analysis

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/07-matching-and-gap-analysis.md

المطلوب تنفيذ Milestone 6 فقط: Matching.

نفذ في الباك:
- services/matching/skillDictionary.js
- services/matching/rulesScorer.js
- services/matching/matchJob.js
- استخدم careerProfile snapshot.
- احسب:
  - score
  - level
  - matchedSkills
  - missingSkills
  - reasons
  - risks
  - recommendations مبدئية
- احفظ النتيجة في JobMatch.
- endpoint:
  POST /api/v1/jobs/:id/analyze

اختياري فقط إذا كان مناسبًا:
- أضف llmMatcher.js لكن اجعله fallback-safe.
- إذا فشل LLM استخدم rules فقط.

نفذ في الداشبورد:
- اعرض latest match في صفحة job details.
- أضف زر Analyze.
- أضف badges للـ score والـ level.

لا تنفذ:
- resume draft.
- analytics dashboard.
- tracking.

النتيجة المتوقعة:
- Vue/Nuxt jobs تأخذ score أعلى.
- Senior jobs تظهر stretch بدل إخفائها.
- كل analysis له reasons واضحة.
```

## Prompt 7: ATS Resume Draft

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/08-ats-resume-mvp.md

المطلوب تنفيذ Milestone 7 فقط: ATS Resume Draft.

نفذ في الباك:
- services/resume/atsDraftGenerator.js
- services/resume/templates/atsText.js
- endpoint:
  POST /api/v1/jobs/:id/resume-drafts
  GET /api/v1/jobs/:id/resume-drafts
  GET /api/v1/resume-drafts/:id
- استخدم:
  - job details
  - latest job match
  - career profile snapshot
- لا تخترع مهارات غير موجودة.
- أضف warnings إذا الوظيفة تطلب skills ناقصة.
- احفظ draft في ResumeDraft.

نفذ في الداشبورد:
- ResumeDraftPreview.vue.
- زر Create ATS CV Draft في صفحة job details.
- عرض draft وإمكانية copy.

لا تنفذ PDF إذا لم يكن ضروريًا.

النتيجة المتوقعة:
- يمكن توليد CV draft لكل وظيفة.
- draft يبرز Vue/Nuxt عند الحاجة.
- draft يحتوي warnings واضحة.
```

## Prompt 8: LinkedIn Automatic Adapter

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/02b-linkedin-source-design.md

المطلوب تنفيذ Milestone 8 فقط: LinkedIn Automatic Adapter.

قبل التنفيذ:
- راجع الوضع الحالي بعد تنفيذ المراحل السابقة.
- لا تستخدم login.
- لا تستخدم cookies.
- لا تستخدم proxy rotation.
- لا bypass.

نفذ في الباك:
- services/jobSearch/linkedinAdapter.js
- adapter منفصل يمكن تعطيله عبر LINKEDIN_SOURCE_MODE.
- إذا استخدمت worker خارجي مثل JobSpy-style، اجعله معزولًا وقابلًا للفشل بدون كسر Wuzzuf.
- source=all يجب أن يكمل Wuzzuf حتى لو LinkedIn فشل.
- health endpoint يرجع healthy/degraded/failed.

نفذ في الداشبورد:
- اعرض حالة LinkedIn degraded عند الفشل.
- حافظ على زر manual import.

لا تنفذ:
- tracking.
- auto apply.
- account/session scraping.

النتيجة المتوقعة:
- LinkedIn source يعمل إن أمكن.
- إذا فشل LinkedIn، النظام يظل مفيدًا عبر Wuzzuf وmanual import.
```

## Prompt 9: Polish And Hardening

```text
أنت تعمل على:
Backend: /media/beingmomen/Code/personal/Clients/Beingmomen/server-2
Dashboard: /media/beingmomen/Code/personal/Clients/Beingmomen/db-2

اقرأ:
/media/beingmomen/Code/personal/Clients/Beingmomen/db-2/docs/job-search-mvp/11-implementation-plan.md

المطلوب تنفيذ مرحلة Polish فقط.

راجع الميزة كاملة بعد تنفيذ المراحل السابقة:
- error states.
- loading states.
- empty states.
- validation messages.
- auth protection.
- rate limiting.
- source failure isolation.
- dedupe correctness.
- parser failure reporting.
- لا توجد endpoints حساسة public بدون auth.
- لا توجد بيانات وظائف منشورة في الموقع العام.

نفذ تحسينات صغيرة فقط.
لا تضف features جديدة.

شغّل:
- lint في الباك إن أمكن.
- lint/typecheck في الداشبورد إن أمكن.

اكتب ملخص:
- ما الذي أصلحته.
- ما الذي اختبرته.
- ما المخاطر المتبقية.
```

## ترتيب الاستخدام

استخدم prompts بهذا الترتيب:

1. Backend Skeleton.
2. Career Profile Snapshot.
3. Wuzzuf Extractor.
4. LinkedIn Manual Import.
5. Jobs Dashboard.
6. Matching And Gap Analysis.
7. ATS Resume Draft.
8. LinkedIn Automatic Adapter.
9. Polish And Hardening.

لا تنتقل إلى مرحلة إلا بعد التأكد أن المرحلة السابقة تعمل.
