# 02b. LinkedIn Source Design

## الهدف

دعم LinkedIn كمصدر وظائف مهم داخل الـ MVP، مع عزل مخاطره عن باقي النظام.

LinkedIn يجب أن يكون source adapter مستقل، وليس منطقًا منتشرًا داخل الـ jobs module.

## القرار

ندعم LinkedIn بطريقتين:

1. **Adapter اختياري** شبيه بفكرة JobOps عبر مكتبة خارجية مثل `python-jobspy` إذا أثبتت أنها مناسبة في بيئتنا.
2. **Manual URL Import fallback** لإدخال وظيفة LinkedIn من رابط أو نص منسوخ عندما يفشل الجلب الآلي أو يكون غير مناسب.

## لماذا ليس scraper مباشر؟

LinkedIn أعلى مخاطرة من Wuzzuf.

robots.txt الخاص بـ LinkedIn يذكر أن استخدام robots أو وسائل آلية للوصول إلى LinkedIn بدون إذن صريح محظور.

اتفاقية الاستخدام تحظر استخدام scripts أو robots أو crawlers أو browser plugins لعمل scrape أو copy للخدمات والبيانات بدون إذن.

المصادر:

- https://www.linkedin.com/robots.txt
- https://www.linkedin.com/legal/user-agreement

## Implementation Modes

### Mode A: JobSpy-style adapter

نفس الفكرة الموجودة في JobOps:

- backend يستدعي worker خارجي.
- worker يجرب جلب الوظائف من LinkedIn jobs.
- النتائج تكتب كـ JSON.
- backend يقرأ JSON.
- normalizer يحولها إلى `Job`.

المهم:

- لا login.
- لا cookies.
- لا session reuse.
- لا bypass.
- لا proxy rotation.
- قابل للتعطيل من settings.

### Mode B: Manual URL Import

المستخدم يضع:

- LinkedIn job URL.
- أو job description منسوخ.

النظام يحاول:

- fetch public page إن أمكن.
- أو يقبل النص مباشرة.
- ثم يستخدم LLM لاستخراج:
  - title.
  - company.
  - location.
  - description.
  - requirements.
  - skills.

هذا ضروري لأن LinkedIn قد يفشل في الجلب الآلي كثيرًا.

## Search Inputs

```json
{
  "source": "linkedin",
  "terms": [
    "Frontend Developer",
    "Vue Developer",
    "Nuxt Developer"
  ],
  "location": "Egypt",
  "workplace": ["remote", "hybrid"],
  "maxJobs": 50
}
```

## Normalized Fields

```ts
type LinkedInJob = {
  source: 'linkedin'
  sourceJobId?: string
  title: string
  company: string
  location?: string
  workplace?: 'remote' | 'hybrid' | 'onsite' | 'unknown'
  seniority?: 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'manager' | 'unknown'
  jobUrl: string
  applyUrl?: string
  postedAt?: string
  description?: string
  requirements?: string[]
  skills?: string[]
  rawText?: string
  fetchedAt: string
}
```

## UX Behavior

في الداشبورد:

- LinkedIn يظهر كمصدر مستقل بجانب Wuzzuf.
- إذا فشل LinkedIn adapter، تظهر رسالة واضحة.
- يتم عرض زر `Import LinkedIn Job URL`.
- يتم عرض خيار `Paste Job Description`.

## Failure Behavior

LinkedIn failures لا يجب أن تفشل search run بالكامل.

إذا كان run يحتوي Wuzzuf وLinkedIn:

- Wuzzuf يكمل.
- LinkedIn يسجل فشل المصدر فقط.
- تظهر النتيجة: Wuzzuf completed وLinkedIn failed/degraded.

## Rate Limiting

اقتراح مبدئي:

- max jobs: 50.
- no scheduled background runs.
- on-demand only.
- run واحد فقط في نفس الوقت.
- no aggressive retries.

## ما لا نفعله الآن

- لا login.
- لا استخدام حسابك.
- لا profile scraping.
- لا jobs apply automation.
- لا bypass access controls.
- لا حفظ cookies.
- لا تشغيل LinkedIn كل ساعة.

## معيار قبول LinkedIn في الـ MVP

LinkedIn مقبول في الـ MVP إذا:

- يمكننا الحصول على نتائج كافية أو إدخالها يدويًا.
- كل نتيجة تتحول إلى normalized job.
- failures معزولة ولا تكسر Wuzzuf.
- النظام يظل مفيدًا حتى إذا LinkedIn adapter فشل.
