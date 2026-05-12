# 11. Implementation Plan

## الهدف

هذا الملف يحول تصميم الـ MVP إلى خطة تنفيذ كود عملية مبنية على المشروعين الفعليين:

- Dashboard:
  `/media/beingmomen/Code/personal/Clients/Beingmomen/db-2`
- Backend:
  `/media/beingmomen/Code/personal/Clients/Beingmomen/server-2`

## قراءة سريعة للباك الحالي

الباك الحالي:

- Express.js.
- MongoDB + Mongoose.
- MVC واضح:
  - `models/`
  - `controllers/`
  - `routes/`
  - `middleware/validators/`
- auth موجود عبر JWT.
- الصلاحيات تستخدم `ROLES.ADMIN` و`ROLES.DEV`.
- `cheerio` موجود بالفعل، وهذا مناسب لـ Wuzzuf parsing.
- لا يوجد service layer كبير حاليًا، لكن ميزة الوظائف تحتاج services مخصصة لأنها ليست CRUD عادي.
- لا يوجد LLM integration حاليًا.

## قرار تنفيذي مهم

ميزة الوظائف لا يجب تنفيذها كـ CRUD عادي فقط.

نستخدم CRUD للقراءة والتحديثات البسيطة، لكن نضيف services وcontrollers مخصصة لـ:

- search runs.
- Wuzzuf extraction.
- LinkedIn import/adapter.
- matching.
- resume draft generation.

## Backend File Structure المقترح

داخل `server-2`:

```text
models/
  jobSourceModel.js
  jobSearchRunModel.js
  jobModel.js
  jobMatchModel.js
  resumeDraftModel.js
  careerProfileSettingsModel.js

controllers/
  jobSourceController.js
  jobSearchRunController.js
  jobController.js
  manualJobController.js
  careerProfileController.js
  resumeDraftController.js

routes/
  jobSourceRoutes.js
  jobSearchRunRoutes.js
  jobRoutes.js
  manualJobRoutes.js
  careerProfileRoutes.js
  resumeDraftRoutes.js

services/
  jobSearch/
    index.js
    sourceRegistry.js
    wuzzufExtractor.js
    linkedinAdapter.js
    manualImport.js
    normalizer.js
    dedupe.js
    rateLimit.js
  careerProfile/
    snapshot.js
  matching/
    skillDictionary.js
    rulesScorer.js
    llmMatcher.js
    matchJob.js
  resume/
    atsDraftGenerator.js
    templates/
      atsText.js

middleware/validators/
  job.validator.js
```

ملاحظة:

`services/` غير موجود حاليًا، لكن إضافته هنا مبررة لأن الوظائف تحتاج منطق domain مستقل عن controllers.

## App Registration

في `server-2/app.js` نضيف:

```js
const jobSourceRouter = require('./routes/jobSourceRoutes');
const jobSearchRunRouter = require('./routes/jobSearchRunRoutes');
const jobRouter = require('./routes/jobRoutes');
const manualJobRouter = require('./routes/manualJobRoutes');
const careerProfileRouter = require('./routes/careerProfileRoutes');
const resumeDraftRouter = require('./routes/resumeDraftRoutes');
```

ثم:

```js
app.use('/api/v1/job-sources', jobSourceRouter);
app.use('/api/v1/job-search-runs', jobSearchRunRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/manual-jobs', manualJobRouter);
app.use('/api/v1/career-profile', careerProfileRouter);
app.use('/api/v1/resume-drafts', resumeDraftRouter);
```

## Dashboard Proxy

في `db-2/server/config/proxy.ts` نضيف:

```ts
'/career-profile'
'/job-sources'
'/job-search-runs'
'/jobs'
'/manual-jobs'
'/resume-drafts'
```

## Backend Models

### jobSourceModel.js

الغرض:

- تعريف المصادر المتاحة.
- تفعيل/تعطيل source.
- حفظ health status.

أهم الحقول:

- `key`: `wuzzuf | linkedin`
- `name`
- `enabled`
- `mode`: `automatic | manual_import | disabled`
- `lastHealthStatus`
- `lastCheckedAt`
- `lastError`

### jobSearchRunModel.js

الغرض:

- تسجيل كل عملية بحث.
- حفظ query وstats.
- عزل فشل LinkedIn عن Wuzzuf.

أهم الحقول:

- `source`: `wuzzuf | linkedin | all`
- `status`
- `query`
- `sourceStats`
- `stats`
- `errorMessage`
- `startedAt`
- `completedAt`
- `user`

### jobModel.js

الغرض:

- تخزين الوظائف normalized.

أهم الحقول:

- `source`
- `sourceJobId`
- `title`
- `company`
- `location`
- `workplace`
- `seniority`
- `jobUrl`
- `applyUrl`
- `postedAt`
- `description`
- `requirements`
- `skills`
- `tags`
- `salary`
- `status`
- `rawText`
- `rawPayload`
- `firstSeenAt`
- `lastSeenAt`
- `user`

Indexes:

- `{ source: 1, sourceJobId: 1 }`
- `{ source: 1, jobUrl: 1 }`
- `{ status: 1, createdAt: -1 }`
- `{ source: 1, status: 1 }`
- text index على `title`, `company`, `description`, `skills`

### jobMatchModel.js

الغرض:

- حفظ نتيجة analysis لكل وظيفة.

أهم الحقول:

- `job`
- `profileVersion`
- `score`
- `level`
- `matchedSkills`
- `missingSkills`
- `reasons`
- `risks`
- `recommendations`
- `generatedBy`
- `user`

### resumeDraftModel.js

الغرض:

- حفظ CV draft الخاص بوظيفة.

أهم الحقول:

- `job`
- `profileVersion`
- `format`
- `content`
- `warnings`
- `user`

### careerProfileSettingsModel.js

الغرض:

- إعدادات مهنية فوق بيانات `Info`, `Skill`, `Experience`, `Project`.

أهم الحقول:

- `targetRoles`
- `targetSeniority`
- `defaultStacks`
- `optionalStacks`
- `locationPreferences`
- `workplacePreferences`
- `user`

## Backend Services

### Wuzzuf Extractor

الملف:

```text
services/jobSearch/wuzzufExtractor.js
```

المسؤوليات:

- بناء search URL.
- fetch صفحات البحث.
- parse job cards عبر `cheerio`.
- fetch صفحة التفاصيل.
- parse description/requirements/tags.
- إرجاع raw jobs بدون حفظ.

لا يقوم بـ:

- حفظ في DB.
- تحليل الملاءمة.
- توليد CV.

### LinkedIn Adapter

الملف:

```text
services/jobSearch/linkedinAdapter.js
```

المسؤوليات:

- encapsulate أي طريقة آلية لجلب LinkedIn.
- يمكن في أول نسخة أن يكون placeholder يرجع `degraded` إذا لم ننفذ adapter.
- لاحقًا يمكن ربطه بـ JobSpy-style worker.

القاعدة:

- لا login.
- لا cookies.
- لا bypass.
- لا proxy rotation.

### Manual Import

الملف:

```text
services/jobSearch/manualImport.js
```

المسؤوليات:

- قبول LinkedIn URL أو raw job description.
- محاولة fetch URL لو متاح.
- fallback إلى rawText.
- استخراج normalized job.

هذه خطوة مهمة لأن LinkedIn قد لا يكون مستقرًا آليًا.

### Normalizer

الملف:

```text
services/jobSearch/normalizer.js
```

المسؤوليات:

- تحويل Wuzzuf/LinkedIn raw data إلى `Job` موحد.
- استخراج seniority.
- استخراج workplace.
- استخراج skills.
- تنظيف النصوص.

### Dedupe

الملف:

```text
services/jobSearch/dedupe.js
```

الأولوية:

1. `source + sourceJobId`
2. `source + jobUrl`
3. `source + company + title + location`

### Career Profile Snapshot

الملف:

```text
services/careerProfile/snapshot.js
```

يجمع من:

- `Info`
- `Skill`
- `Experience`
- `Project`
- `careerProfileSettings`

ويخرج snapshot مختصر يستخدم في matching وresume.

### Rules Scorer

الملف:

```text
services/matching/rulesScorer.js
```

يحسب score أولي بدون LLM:

- role match.
- stack match.
- seniority distance.
- workplace/location.
- missing core skills.

### LLM Matcher

الملف:

```text
services/matching/llmMatcher.js
```

يضاف بعد rules scorer.

متطلبات:

- استخدام `fetch` native في Node 18+.
- إعداد env:
  - `LLM_PROVIDER`
  - `LLM_API_KEY`
  - `LLM_BASE_URL`
  - `LLM_MODEL`
- structured JSON output.
- fallback إذا فشل LLM.

### Resume Draft Generator

الملف:

```text
services/resume/atsDraftGenerator.js
```

ينتج:

- headline.
- summary.
- skills.
- experience bullets.
- selected projects.
- warnings.

لا ينتج PDF في أول milestone إلا إذا قررنا ذلك.

## Backend Endpoints

### Phase 1 Endpoints

```text
GET    /api/v1/job-sources
GET    /api/v1/job-sources/wuzzuf/health
GET    /api/v1/job-sources/linkedin/health
POST   /api/v1/job-search-runs
GET    /api/v1/job-search-runs
GET    /api/v1/job-search-runs/:id
GET    /api/v1/jobs
GET    /api/v1/jobs/:id
PATCH  /api/v1/jobs/:id
POST   /api/v1/manual-jobs/import
GET    /api/v1/career-profile
PATCH  /api/v1/career-profile/settings
POST   /api/v1/jobs/:id/analyze
POST   /api/v1/jobs/:id/resume-drafts
GET    /api/v1/jobs/:id/resume-drafts
```

### Auth Rules

كل write/action endpoints تحتاج:

```js
authController.protect
authController.restrictTo([ROLES.ADMIN, ROLES.DEV])
```

قراءة الوظائف داخل الداشبورد يمكن أن تكون protected أيضًا لأن هذه بيانات شخصية.

اقتراح:

- كل endpoints الخاصة بالوظائف تكون protected.
- لا تعرض jobs APIs للعامة.

## Dashboard File Structure

داخل `db-2`:

```text
app/composables/services/
  jobSources.js
  jobSearchRuns.js
  jobs.js
  manualJobs.js
  careerProfile.js
  resumeDrafts.js

app/composables/modules/jobs/
  index.js
  table.js
  filters.js
  actions.js
  columns.js

app/composables/modules/job-search/
  index.js
  form.js
  schema.js

app/composables/modules/career-profile/
  index.js
  form.js
  schema.js

app/components/modules/jobs/
  JobsTable.vue
  JobFilters.vue
  JobScoreBadge.vue
  JobStatusBadge.vue
  JobSourceBadge.vue
  JobDetailPanel.vue
  ResumeDraftPreview.vue

app/components/modules/job-search/
  JobSearchForm.vue
  SearchRunStatus.vue

app/components/modules/career-profile/
  CareerProfileForm.vue

app/pages/
  job-search/index.vue
  jobs/index.vue
  jobs/[id]/index.vue
  career-profile/index.vue
```

## Dashboard Sidebar

في:

```text
app/composables/layout/sideBar/index.js
```

نضيف قسم:

```js
[
  {
    label: 'بحث الوظائف',
    icon: 'i-lucide-search',
    to: '/job-search'
  },
  {
    label: 'الوظائف',
    icon: 'i-lucide-briefcase-business',
    to: '/jobs'
  },
  {
    label: 'البروفايل المهني',
    icon: 'i-lucide-user-round-cog',
    to: '/career-profile'
  }
]
```

## Implementation Milestones

### Milestone 1: Backend Models And Routes Skeleton

الهدف:

- إضافة models.
- إضافة routes.
- تسجيل routes في `app.js`.
- إضافة validators مبدئية.
- endpoints ترجع بيانات فارغة/أساسية.

اختبار:

- `GET /api/v1/job-sources`
- `GET /api/v1/jobs`

### Milestone 2: Career Profile Snapshot

الهدف:

- قراءة `Info`, `Skill`, `Experience`, `Project`.
- إضافة `careerProfileSettings`.
- إخراج snapshot usable.

اختبار:

- `GET /api/v1/career-profile`

### Milestone 3: Wuzzuf Extractor

الهدف:

- تنفيذ Wuzzuf search.
- parse list/detail.
- normalize.
- dedupe.
- save jobs.

اختبار:

- `POST /api/v1/job-search-runs` مع `source=wuzzuf`.
- يرجع 10-20 وظيفة في بيئة dev.

### Milestone 4: LinkedIn Manual Import

الهدف:

- إدخال LinkedIn job URL أو rawText.
- normalize.
- save job.
- تشغيل rules score مبدئي.

اختبار:

- `POST /api/v1/manual-jobs/import`.

### Milestone 5: Jobs Dashboard

الهدف:

- إضافة proxy prefixes.
- صفحة `/job-search`.
- صفحة `/jobs`.
- صفحة `/jobs/:id`.
- filters أساسية.

اختبار:

- تشغيل search من الداشبورد.
- رؤية jobs.
- فتح job details.

### Milestone 6: Matching

الهدف:

- rules score.
- optional LLM explanation.
- حفظ `jobMatch`.
- عرض النتيجة في UI.

اختبار:

- وظيفة Vue/Nuxt تحصل score أعلى من وظيفة React-only.
- Senior job تظهر `stretch`.

### Milestone 7: ATS Resume Draft

الهدف:

- توليد draft.
- حفظه.
- preview داخل job details.
- copy/download text أو html.

اختبار:

- draft لا يخترع مهارات.
- draft يبرز Vue/Nuxt عند الحاجة.

### Milestone 8: LinkedIn Automatic Adapter

الهدف:

- إضافة adapter آلي منفصل.
- يظل optional.
- failures لا تكسر Wuzzuf.

اختبار:

- `source=all` يعمل حتى لو LinkedIn degraded.

## Package Changes

موجود بالفعل:

- `cheerio`

قد نحتاج لاحقًا:

- لا نحتاج axios لأن Node 18+ لديه `fetch`.
- لا نحتاج OpenAI SDK في البداية إذا استخدمنا HTTP مباشر.
- إذا احتجنا PDF لاحقًا نقرر بين:
  - HTML preview فقط.
  - Puppeteer/Playwright.
  - خدمة PDF خارجية.

## Environment Variables

إضافة مقترحة إلى `.env.example` في الباك:

```env
JOB_SEARCH_ENABLED=true
JOB_SEARCH_DEFAULT_SOURCE=all
JOB_SEARCH_MAX_JOBS_PER_RUN=80
JOB_SEARCH_REQUEST_DELAY_MS=2500

LINKEDIN_SOURCE_MODE=manual_import
WUZZUF_SOURCE_ENABLED=true

LLM_PROVIDER=openai_compatible
LLM_API_KEY=
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=
```

## Testing Strategy

لا يوجد test framework واضح حاليًا.

الحد الأدنى:

- unit tests لاحقًا للـ pure services:
  - `normalizer`.
  - `dedupe`.
  - `rulesScorer`.
  - `skillDictionary`.
- manual API tests عبر Postman/Thunder Client في البداية.
- حفظ HTML samples محليًا في dev فقط لاستخدامها في parser tests.

## First Coding Task المقترح

أول مهمة تنفيذية يجب أن تكون:

> إضافة backend skeleton للوظائف بدون scraping.

تشمل:

- models.
- routes.
- controllers basic.
- app.js route registration.
- dashboard proxy prefixes.

لا تبدأ بـ Wuzzuf parser قبل وجود storage وAPI واضح.

## Definition Of Done للـ MVP

الـ MVP مكتمل عندما:

- يمكن تشغيل search من Wuzzuf.
- يمكن إدخال LinkedIn job يدويًا.
- يمكن عرض وظائف Wuzzuf وLinkedIn في جدول واحد.
- يمكن فلترة الوظائف حسب stack/source/status/seniority.
- يمكن تحليل وظيفة وإظهار score/gaps.
- يمكن توليد ATS resume draft لوظيفة.
- لا توجد tracking/Gmail/auto-apply.
