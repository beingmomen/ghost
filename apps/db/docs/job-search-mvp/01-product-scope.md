# 01. Product Scope

## المشكلة

البحث عن وظائف Frontend مناسب لمسار Vue/Nuxt يحتاج وقتًا كبيرًا:

- البحث اليدوي متكرر.
- الوظائف تختلط بين Vue وReact وAngular وFull Stack.
- seniority غير واضح دائمًا.
- صعب تعرف بسرعة هل الوظيفة مناسبة أم تحتاج مهارات ناقصة.
- تجهيز CV مخصص لكل وظيفة يدويًا مرهق.

## هدف الـ MVP

بناء وحدة داخل الداشبورد تساعدك على:

- البحث في Wuzzuf وLinkedIn عن وظائف Frontend.
- فلترة النتائج حسب التقنية والمستوى والمكان.
- تحليل الملاءمة بناءً على بياناتك الحالية.
- عرض الفجوات المطلوبة لكل وظيفة.
- توليد CV ATS draft مناسب للوظيفة.

## المستخدم

المستخدم الأساسي في الـ MVP هو أنت فقط.

لذلك القرارات تكون لصالح:

- السرعة.
- الاستخدام الشخصي.
- عدم إعادة نشر الوظائف.
- تقليل التعقيد.

## In Scope

- Wuzzuf source.
- LinkedIn source adapter.
- LinkedIn manual URL import fallback.
- on-demand search من الداشبورد.
- حفظ نتائج البحث.
- normalized job model.
- dedupe حسب رابط الوظيفة أو source job id.
- filters:
  - keyword.
  - stack: Vue, Nuxt, React, Angular, JavaScript, TypeScript.
  - seniority.
  - location.
  - workplace: remote, hybrid, onsite.
  - posted date.
- fit score.
- gap analysis.
- job detail page.
- CV ATS draft generation.

## Out of Scope

- LinkedIn login/session automation.
- LinkedIn profile scraping.
- bypass أو proxy rotation أو account-cookie scraping.
- Gmail tracking.
- application tracking pipeline.
- auto apply.
- browser extension.
- multi-user support.
- public job board.
- paid SaaS behavior.
- advanced analytics.
- scheduled crawling في أول نسخة.

## Success Criteria

الـ MVP يعتبر ناجحًا إذا:

- يستطيع جلب نتائج من Wuzzuf بشكل مستقر نسبيًا.
- يستطيع إدخال أو جلب نتائج LinkedIn من source adapter منفصل أو fallback يدوي.
- كل وظيفة تظهر بشكل normalized واضح.
- الفلاتر تقلل الضوضاء بسرعة.
- fit score يساعد على ترتيب الأولويات.
- gap analysis يعطي سببًا عمليًا للتقييم.
- CV draft يكون usable كبداية وليس مجرد نص عام.

## Default Search Profile

القيم الافتراضية المقترحة:

- role keywords:
  - Frontend Developer
  - Front End Developer
  - Vue Developer
  - Nuxt Developer
- default stack filter:
  - Vue
  - Nuxt
  - Vue.js
  - Nuxt.js
- optional stack filters:
  - React
  - Angular
  - JavaScript
  - TypeScript
- seniority:
  - all by default.
  - لا نخفي Senior، بل نعرضها ونحسب gap.

## MVP Philosophy

لا نحاول بناء نسخة كاملة من JobOps.

نبدأ بأصغر حل يعطي قيمة:

> وظائف Wuzzuf وLinkedIn منظمة + فلترة قوية + تحليل ملاءمة + CV ATS draft.
