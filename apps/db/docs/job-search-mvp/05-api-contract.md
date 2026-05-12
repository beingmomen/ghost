# 05. API Contract

## ملاحظة

الداشبورد الحالي يتعامل مع backend خارجي عبر proxy. لذلك هذه endpoints مكانها الأساسي في الباك اند، ثم نضيف prefixes لها في `server/config/proxy.ts`.

## Prefixes مقترحة

```ts
[
  '/career-profile',
  '/job-sources',
  '/job-search-runs',
  '/jobs',
  '/manual-jobs',
  '/resume-drafts'
]
```

## Career Profile

### GET /career-profile

يرجع profile snapshot المستخدم في التحليل.

### PATCH /career-profile/settings

يحدث إعدادات البحث المهنية.

```json
{
  "targetRoles": ["Frontend Developer", "Vue Developer"],
  "targetSeniority": "mid",
  "defaultStacks": ["Vue", "Nuxt"],
  "optionalStacks": ["React", "Angular"],
  "workplacePreferences": ["remote", "hybrid"]
}
```

## Job Sources

### GET /job-sources

يرجع المصادر المتاحة.

### GET /job-sources/wuzzuf/health

health check بسيط للـ extractor.

### GET /job-sources/linkedin/health

health check للـ LinkedIn adapter.

قد يرجع `degraded` بدل `failed` إذا كان manual import متاحًا لكن adapter الآلي غير متاح.

## Search Runs

### POST /job-search-runs

يشغل بحث جديد.

```json
{
  "source": "all",
  "terms": ["Frontend Developer", "Vue Developer", "Nuxt Developer"],
  "location": "Egypt",
  "maxPages": 3,
  "maxJobs": 60
}
```

### GET /job-search-runs

يعرض آخر search runs.

### GET /job-search-runs/:id

يعرض تفاصيل run والإحصائيات.

### POST /job-search-runs/:id/cancel

اختياري في MVP. ينفع إذا كان run طويل.

## Jobs

### GET /jobs

يدعم query params:

```text
source=all
q=vue
stack=vue,nuxt
seniority=mid,senior
workplace=remote,hybrid
status=new,shortlisted
minScore=60
page=1
limit=20
sort=score_desc
```

`source` يمكن أن يكون:

```text
wuzzuf
linkedin
all
```

### GET /jobs/:id

يرجع:

- job details.
- latest match.
- latest resume draft إن وجد.

### PATCH /jobs/:id

يحدث status أو notes.

```json
{
  "status": "shortlisted"
}
```

## Matching

### POST /jobs/:id/analyze

يشغل fit analysis لوظيفة واحدة.

### POST /jobs/analyze

يشغل analysis للوظائف الجديدة بدون تحليل.

```json
{
  "jobIds": ["job_1", "job_2"]
}
```

## Resume Drafts

### POST /jobs/:id/resume-drafts

ينشئ CV draft للوظيفة.

```json
{
  "format": "ats_text"
}
```

### GET /jobs/:id/resume-drafts

يعرض drafts الخاصة بوظيفة.

### GET /resume-drafts/:id

يعرض draft محدد.

## Manual LinkedIn Import

### POST /manual-jobs/import

يستخدم لإدخال وظيفة من LinkedIn إذا فشل adapter الآلي أو أردت إضافة فرصة محددة.

```json
{
  "source": "linkedin",
  "jobUrl": "https://www.linkedin.com/jobs/view/...",
  "rawText": "Pasted job description..."
}
```

الـ backend يستخرج normalized job ثم يشغل matching.

## Realtime Progress

ليس ضروريًا في أول نسخة.

بدلًا منه:

- polling كل 3-5 ثوانٍ على `GET /job-search-runs/:id`.

## Error Shape

```json
{
  "success": false,
  "message": "Wuzzuf parser failed",
  "code": "WUZZUF_PARSER_FAILED",
  "details": {}
}
```

## Response Shape

حافظ على نفس نمط الباك الحالي إن كان موجودًا.

المهم أن تكون responses ثابتة:

```json
{
  "success": true,
  "data": {},
  "message": "Done"
}
```
