# 02. Wuzzuf Source Design

## الهدف

بناء extractor واحد لموقع Wuzzuf يجلب الوظائف ويحفظها في normalized model داخل الباك اند.

## مصدر البيانات

المصدر الأول:

- صفحات بحث Wuzzuf.
- صفحات تفاصيل الوظائف العامة.

مثال URL من نتائج البحث:

```text
https://wuzzuf.net/jobs/p/<job-id-and-slug>
```

## Guardrails

لأن Wuzzuf User Agreement يسمح بالاستخدام الشخصي غير التجاري والمعلوماتي، يجب الالتزام بالتالي:

- استخدام داخلي داخل الداشبورد فقط.
- عدم عرض الوظائف في الموقع العام.
- عدم إعادة نشر محتوى الوظائف.
- تخزين أقل قدر كافٍ للتحليل.
- إضافة rate limit.
- احترام أخطاء الحظر أو الضغط وعدم محاولة الالتفاف عليها.
- وضع user agent واضح للتطبيق.

المصدر:
https://wuzzuf.net/user_agreement/

## Search Strategy

في الـ MVP نستخدم search runs يدويًا من الداشبورد.

المدخلات:

- search terms.
- location.
- stack filters.
- max pages.
- max jobs.
- posted date إن أمكن.

القيم الافتراضية:

```json
{
  "source": "wuzzuf",
  "terms": [
    "Frontend Developer",
    "Vue Developer",
    "Nuxt Developer"
  ],
  "location": "Egypt",
  "maxPages": 3,
  "maxJobs": 60
}
```

## Extractor Flow

1. إنشاء `job_search_run`.
2. بناء search URLs لكل term.
3. تحميل صفحات النتائج page by page.
4. استخراج cards:
   - title.
   - company.
   - location.
   - job URL.
   - posted date إن وجدت.
   - tags إن وجدت.
5. تحميل صفحة التفاصيل لكل وظيفة عند الحاجة.
6. استخراج الوصف والمتطلبات.
7. تحويل البيانات إلى normalized job.
8. dedupe.
9. حفظ النتائج.
10. تشغيل fit analysis async أو on-demand.

## Rate Limiting

اقتراح مبدئي:

- delay بين requests: من 2 إلى 5 ثوانٍ.
- max pages في أول نسخة: 3.
- max jobs لكل run: 60.
- عدم تشغيل أكثر من run واحد في نفس الوقت.
- retry مرة واحدة فقط عند أخطاء مؤقتة.

## Normalized Fields

الحد الأدنى المطلوب:

```ts
type NormalizedJob = {
  source: 'wuzzuf'
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

## Dedupe Rules

الأولوية:

1. `source + sourceJobId`
2. `source + normalized jobUrl`
3. `source + company + title + location`

## Parser Strategy

لا نربط النظام كله بـ HTML selectors مباشرة.

نقسم extractor إلى:

- fetcher.
- list parser.
- detail parser.
- normalizer.
- persistence adapter.

بهذا إذا تغير HTML في Wuzzuf، نعدل parser فقط.

## Failure Behavior

عند الفشل:

- لا يسقط الـ run بالكامل بسبب وظيفة واحدة.
- الوظائف التي فشلت تفاصيلها تحفظ كـ partial.
- نحفظ error summary داخل `job_search_run`.
- نعرض في UI عدد:
  - fetched.
  - parsed.
  - failed.
  - duplicated.

## Health Check

endpoint بسيط:

```text
GET /job-sources/wuzzuf/health
```

يرجع:

- هل الصفحة قابلة للتحميل؟
- هل parser وجد job card واحد على الأقل؟
- آخر نجاح.
- آخر خطأ.

## ما لا نفعله الآن

- لا login.
- لا apply.
- لا scraping لصفحات غير عامة.
- لا bypass.
- لا proxy rotation.
- لا high-volume crawling.
