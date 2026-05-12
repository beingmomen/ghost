# مراجعة مشروع JobOps

- رابط المشروع: https://github.com/DaKheera47/job-ops
- النسخة التي تمت مراجعتها: `d5ad679ff224ec5d354e809d72e2a9e4ad21024d`
- تاريخ المراجعة: 2026-04-10

## الخلاصة السريعة

`JobOps` هو مشروع **self-hosted** لإدارة دورة البحث عن وظيفة بشكل شبه مؤتمت، من جمع الوظائف وحتى تتبع الردود بعد التقديم.  
هو **ليس** موقع وظائف مستقل، و**ليس** بوتًا يقدّم تلقائيًا بدلًا عن المستخدم، بل هو طبقة تشغيل وتنظيم فوق مصادر الوظائف المختلفة.

بصياغة عملية: المشروع يُستخدم لكي:

- يجمع الوظائف من عدة منصات ولوحات وظائف.
- يرتّبها حسب مدى ملاءمتها لسيرتك الذاتية باستخدام LLM.
- يولّد نسخة CV مخصّصة لكل وظيفة بصيغة PDF.
- ينظم الوظائف داخل حالات واضحة مثل `discovered` و`ready` و`applied`.
- يتابع رسائل Gmail بعد التقديم ويحوّلها إلى مراحل مثل مقابلة أو رفض أو عرض.
- يعطيك Dashboard لقياس النتائج ومعدلات الرد والتحويل حسب المصدر.

## فيما يُستخدم فعليًا

من خلال مراجعة الـ README والوثائق والكود، الاستخدام الأساسي للمشروع هو:

1. **اكتشاف الوظائف** من عدة مصادر عبر مجموعة extractors.
2. **تقييم الملاءمة** بين الوظيفة وملفك المهني عبر الذكاء الاصطناعي.
3. **تفصيل السيرة الذاتية** بحسب وصف كل وظيفة.
4. **تجهيز ملف PDF** جاهز للتقديم.
5. **تتبع الطلبات** بعد التقديم عبر Gmail وربط الرسائل بالوظائف المطبّق عليها.
6. **تحليل الأداء** لمعرفة أي مصدر وظائف يعطي نتائج أفضل.

## كيف يعمل باختصار

التدفق الرئيسي داخل المشروع كالتالي:

1. تشغيل Pipeline من الواجهة.
2. الـ extractors تجمع وظائف من المصادر المفعّلة.
3. النظام يضيف الوظائف إلى قاعدة البيانات ويقيّمها بنقاط ملاءمة.
4. الوظائف الأعلى تقييمًا يمكن معالجتها تلقائيًا أو يدويًا.
5. النظام يولّد Summary وHeadline وSkills مخصّصة لكل Job Description.
6. يتم إنشاء PDF مخصص اعتمادًا على `RxResume` أو على مولّد محلي باستخدام LaTeX.
7. بعد أن تتقدم أنت يدويًا للوظيفة، تغيّر حالتها إلى `applied`.
8. لاحقًا، يقوم Tracking Inbox بقراءة Gmail ومحاولة ربط الردود بهذه الوظائف وتحديث مراحلها.

## أهم المزايا

- دعم مصادر متعددة للوظائف، منها:
  `JobSpy` (Indeed / LinkedIn / Glassdoor)،
  `Adzuna`,
  `Hiring Cafe`,
  `startup.jobs`,
  `Working Nomads`,
  `Golang Jobs`,
  `Gradcracker`,
  `UKVisaJobs`,
  بالإضافة إلى **الاستيراد اليدوي** لوظائف من رابط أو وصف منسوخ.
- نظام **AI scoring** لتقييم مدى مناسبة الوظيفة.
- نظام **resume tailoring** لتخصيص السيرة الذاتية حسب كل وظيفة.
- ميزة **Ghostwriter** لمساعدتك في كتابة cover letters أو رسائل مرتبطة بكل وظيفة.
- تتبع ما بعد التقديم عبر Gmail مع تصنيف ذكي للرسائل.
- لوحة إحصائية لقياس عدد التقديمات ومعدل الرد حسب المصدر.
- تشغيل محلي عبر Docker مع تخزين البيانات محليًا في SQLite.

## المكوّنات الرئيسية في الريبو

- `orchestrator/`
  الواجهة الأمامية والخادم الأساسي. هنا توجد الـ API والـ pipeline وقاعدة البيانات والـ UI.
- `extractors/`
  كل مصدر وظائف له extractor مستقل.
- `shared/`
  الأنواع المشتركة وتعريفات الإعدادات والمنطق المشترك بين الأجزاء.
- `docs-site/`
  وثائق المشروع الرسمية.
- `visa-sponsor-providers/`
  بيانات مساعدة مرتبطة بجهات الرعاية والتأشيرات.

## الاعتماديات والمتطلبات

المشروع يعتمد عادة على:

- **Docker / Docker Compose** للتشغيل الأسهل.
- **SQLite** كقاعدة بيانات محلية.
- مزود **LLM** واحد على الأقل. الكود يدعم:
  `OpenRouter` و`OpenAI` و`Gemini` و`Ollama` و`OpenAI-compatible`.
- تكامل اختياري مع **Gmail OAuth** لتتبع الردود.
- تكامل اختياري مع **Reactive Resume / RxResume** أو استخدام مولّد PDF محلي عبر `tectonic`.

## ما الذي لا يفعله المشروع

- لا يقدّم للوظائف تلقائيًا بدلًا عنك.
- لا يستبدل قرارك البشري في اختيار الفرص المناسبة.
- جودة التقييم والتخصيص تعتمد على جودة سيرتك الذاتية وإعدادات الـ prompts ومزوّد الـ LLM.
- بعض الـ extractors قد تتأثر بتغيّر مواقع الوظائف أو أنظمة الحماية أو الحاجة إلى credentials.

## التقييم النهائي

هذا المشروع مناسب جدًا إذا كنت تريد **مركز تشغيل شخصي للبحث عن وظيفة** بدل العمل اليدوي المشتت بين عشرات المواقع والملفات.  
أفضل وصف له هو:

> منصة محلية تجمع الوظائف، ترتبها بالذكاء الاصطناعي، تجهز CV مخصصًا لكل فرصة، ثم تساعدك على تتبع ما يحدث بعد التقديم.

إذا كان الهدف فقط "مشاهدة وظائف"، فالمشروع أكبر من الحاجة.  
أما إذا كان الهدف هو **إدارة عملية البحث عن وظيفة كاملة بشكل منظم وقابل للقياس**، فهذه هي وظيفته الأساسية.

## المصادر التي بُني عليها هذا التقييم

- README:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/README.md
- نظرة عامة على المزايا:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/docs-site/docs/features/overview.md
- الـ Orchestrator:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/docs-site/docs/features/orchestrator.md
- تتبع ما بعد التقديم:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/docs-site/docs/features/post-application-tracking.md
- تكامل السيرة الذاتية:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/docs-site/docs/features/reactive-resume.md
- نظرة عامة على الـ extractors:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/docs-site/docs/extractors/overview.md
- منطق الـ pipeline:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/orchestrator/src/server/pipeline/orchestrator.ts
- تقييم الملاءمة بالذكاء الاصطناعي:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/orchestrator/src/server/services/scorer.ts
- تفصيل السيرة الذاتية:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/orchestrator/src/server/services/summary.ts
- مزامنة Gmail:
  https://github.com/DaKheera47/job-ops/blob/d5ad679ff224ec5d354e809d72e2a9e4ad21024d/orchestrator/src/server/services/post-application/ingestion/gmail-sync.ts
