# 09. Implementation Roadmap

## Phase 0: Decisions

قبل كتابة الكود:

- تأكيد أن Wuzzuf وLinkedIn هما مصدرا الـ MVP.
- تأكيد أن LinkedIn يتم عبر adapter منفصل + manual import fallback.
- تحديد هل الباك الحالي MongoDB أم SQL.
- تحديد مزود LLM.
- تحديد هل PDF مطلوب في أول نسخة أم يكفي draft preview.

## Phase 1: Backend Foundations

المخرجات:

- models:
  - job_sources.
  - job_search_runs.
  - jobs.
  - job_matches.
  - resume_drafts.
- endpoints الأساسية.
- إضافة proxy prefixes في الداشبورد.

لا نبني UI كبير هنا.

## Phase 2: Wuzzuf Extractor

المخرجات:

- fetch search result pages.
- parse job cards.
- fetch detail pages.
- normalize fields.
- dedupe.
- save jobs.
- run stats.
- health check.

اختبار النجاح:

- تشغيل run صغير يرجع 10-20 وظيفة.

## Phase 2b: LinkedIn Source Adapter

المخرجات:

- LinkedIn source adapter منفصل.
- optional JobSpy-style worker أو integration مشابه.
- manual LinkedIn URL import.
- normalized LinkedIn jobs.
- failure isolation.
- health status: healthy/degraded/failed.

اختبار النجاح:

- يمكن إدخال وظيفة LinkedIn وتحليلها حتى لو adapter الآلي غير مستقر.
- إذا فشل LinkedIn، لا يفشل Wuzzuf.

## Phase 3: Dashboard Jobs Inbox

المخرجات:

- صفحة تشغيل search.
- جدول وظائف.
- filters أساسية.
- صفحة تفاصيل وظيفة.
- status update.

اختبار النجاح:

- تقدر تبحث وتفتح وظيفة وتحفظها كـ shortlisted.

## Phase 4: Career Profile Settings

المخرجات:

- إعداد target roles.
- إعداد core stack.
- إعداد optional stack.
- إعداد seniority.
- بناء profile snapshot من بياناتك الحالية.

اختبار النجاح:

- endpoint يرجع profile snapshot usable.

## Phase 5: Matching

المخرجات:

- rules-based score.
- LLM explanation.
- missing skills.
- recommendations.
- حفظ match result.
- عرض النتيجة في job details.

اختبار النجاح:

- وظيفة Vue/Nuxt تأخذ score أعلى من React-only job.
- Senior role يظهر كـ stretch وليس مخفيًا.

## Phase 6: ATS Resume Draft

المخرجات:

- generate resume draft.
- preview داخل job details.
- حفظ draft.
- copy أو download text/html.

اختبار النجاح:

- CV draft يركز على skills المطلوبة في الوظيفة بدون اختراع.

## Phase 7: Polish

المخرجات:

- empty states.
- loading states.
- error states.
- parser error reporting.
- basic tests للـ normalizer والـ scorer.

## Suggested Build Order

الترتيب العملي:

1. data model.
2. Wuzzuf extractor.
3. LinkedIn manual import.
4. LinkedIn adapter.
5. jobs list.
6. job detail.
7. career profile snapshot.
8. match analysis.
9. resume draft.

## ما لا نبدأ به

- لا نبدأ بالـ CV قبل وجود jobs جيدة.
- لا نبدأ بالـ AI قبل وجود normalized data.
- لا نبدأ بالـ UI قبل backend endpoints.
- لا نبدأ بتعدد مصادر غير Wuzzuf وLinkedIn.
