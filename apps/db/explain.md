باختصار: الريبو **لا يسحب من LinkedIn مباشرة بكود خاص به**، بل يمر عبر dependency خارجي اسمه `python-jobspy`.

المسار الفعلي داخل الريبو هو:

- عند اختيار مصدر `linkedin`، الـ extractor المستخدم هو `jobspy` كما هو ظاهر في [manifest.ts](/tmp/job-ops/extractors/jobspy/manifest.ts#L15).
- هذا الـ manifest يمرر `selectedSources` إلى `runJobSpy(...)` في [run.ts](/tmp/job-ops/extractors/jobspy/src/run.ts#L154).
- `runJobSpy` لا يكلم LinkedIn بنفسه، بل يشغّل سكربت Python اسمه [scrape_jobs.py](/tmp/job-ops/extractors/jobspy/scrape_jobs.py#L115) عن طريق `spawn(...)` في [run.ts](/tmp/job-ops/extractors/jobspy/src/run.ts#L192).
- سكربت Python يستدعي الدالة `scrape_jobs(...)` من مكتبة خارجية اسمها `jobspy` كما في [scrape_jobs.py](/tmp/job-ops/extractors/jobspy/scrape_jobs.py#L7) و[requirements.txt](/tmp/job-ops/extractors/jobspy/requirements.txt#L1).
- عند تشغيله يرسل له بارامترات مثل:
  `site_name=["linkedin"]`
  `search_term`
  `location`
  `results_wanted`
  `hours_old`
  و`linkedin_fetch_description`
  كما في [scrape_jobs.py](/tmp/job-ops/extractors/jobspy/scrape_jobs.py#L90).
- بعد ذلك السكربت يكتب النتائج إلى JSON/CSV محليًا في [scrape_jobs.py](/tmp/job-ops/extractors/jobspy/scrape_jobs.py#L202).
- ثم TypeScript يقرأ ملف JSON ويحوّل كل صف إلى job داخلي موحد عبر `mapJobSpyRows(...)` في [run.ts](/tmp/job-ops/extractors/jobspy/src/run.ts#L358).
- بعدها يعمل `de-duplication` حسب `jobUrl` في [run.ts](/tmp/job-ops/extractors/jobspy/src/run.ts#L278).

المهم هنا:

- `JobOps` لا يستخدم `LinkedIn official API`.
- ولا يوجد في الريبو scraper TypeScript مخصص لـ LinkedIn.
- الجزء الحقيقي الذي “يعرف كيف يجلب من LinkedIn” موجود داخل مكتبة `python-jobspy` الخارجية، وليس داخل هذا الريبو.

وفيه إشارة مهمة أيضًا:
- يوجد option اسمه `JOBSPY_LINKEDIN_FETCH_DESCRIPTION` في [run.ts](/tmp/job-ops/extractors/jobspy/src/run.ts#L230) و[scrape_jobs.py](/tmp/job-ops/extractors/jobspy/scrape_jobs.py#L122)، وهذا يعني أن المكتبة يمكنها محاولة جلب وصف الوظيفة من LinkedIn أيضًا، وليس فقط عنوان/رابط الوظيفة.

إذا تريد، أقدر الآن أشرح لك الخطوة التالية عمليًا:
`كيف نأخذ نفس الفكرة لكن نطبقها على Wuzzuf داخل مشروعك بدون ربط مباشر بـ LinkedIn`.