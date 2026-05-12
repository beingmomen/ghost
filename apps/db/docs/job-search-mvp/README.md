# Wuzzuf + LinkedIn Job Search MVP

هذا الفولدر يشرح تخطيط وتصميم MVP لإضافة جزء داخل الداشبورد يبحث عن وظائف مناسبة لمسار Frontend/Vue/Nuxt من Wuzzuf وLinkedIn، ثم يحلل مدى الملاءمة ويجهز CV مناسب للـ ATS.

## القرار الأساسي

الـ MVP يدعم مصدرين:

- **Wuzzuf** كمصدر مستقر أول.
- **LinkedIn** كمصدر مهم، لكن عبر adapter منفصل عالي الحذر.

لا نضيف في هذه المرحلة:

- تتبع ما بعد التقديم.
- Gmail أو email routing.
- auto-apply.
- multi-source orchestration كبير.
- dashboard analytics متقدمة.

## لماذا Wuzzuf وLinkedIn؟

Wuzzuf مناسب كبداية لأنه يخدم سوق مصر والمنطقة، وصفحاته العامة أسهل نسبيًا للفهم مقارنة بـ LinkedIn، ونطاقه أضيق، وهذا يقلل مخاطر الـ MVP.

LinkedIn مهم جدًا لأنه يحتوي على حجم فرص أكبر وجودة شركات أعلى، ولا يصح تجاهله من تجربة البحث الواقعية. لكن دعمه يكون كـ source adapter منفصل مع fallback للاستيراد اليدوي، وليس كـ scraper عشوائي مدموج في قلب النظام.

## مبدأ التنفيذ

نحن لا ننسخ JobOps كما هو.

نأخذ منه الفكرة:

1. source extractor.
2. normalized jobs.
3. fit scoring.
4. gap analysis.
5. resume tailoring.

ثم نعيد تصميمها بما يناسب مشروعك الحالي.

## الملفات

- [01-product-scope.md](./01-product-scope.md): نطاق المنتج والـ MVP.
- [02-wuzzuf-source-design.md](./02-wuzzuf-source-design.md): تصميم Wuzzuf extractor.
- [02b-linkedin-source-design.md](./02b-linkedin-source-design.md): تصميم LinkedIn source adapter.
- [03-career-profile.md](./03-career-profile.md): تصميم Career Profile واستخدام بياناتك الحالية.
- [04-data-model.md](./04-data-model.md): الجداول/الموديلات المطلوبة.
- [05-api-contract.md](./05-api-contract.md): API endpoints المقترحة.
- [06-dashboard-ux.md](./06-dashboard-ux.md): صفحات وتجربة الداشبورد.
- [07-matching-and-gap-analysis.md](./07-matching-and-gap-analysis.md): scoring وتحليل الفجوات.
- [08-ats-resume-mvp.md](./08-ats-resume-mvp.md): توليد CV مناسب للـ ATS.
- [09-implementation-roadmap.md](./09-implementation-roadmap.md): ترتيب التنفيذ.
- [10-risks-and-decisions.md](./10-risks-and-decisions.md): المخاطر والقرارات المفتوحة.
- [11-implementation-plan.md](./11-implementation-plan.md): خطة تنفيذ الكود بناءً على الباك والداشبورد الحاليين.
- [12-ai-implementation-prompts.md](./12-ai-implementation-prompts.md): برومبتات جاهزة لتنفيذ المراحل عبر AI models.

## النتيجة المطلوبة من الـ MVP

في نهاية الـ MVP يجب أن تستطيع:

1. تشغيل بحث من الداشبورد عن وظائف Frontend على Wuzzuf وLinkedIn.
2. استخدام فلاتر مثل Vue وNuxt وReact وAngular والمستوى والمكان ونوع العمل.
3. رؤية كل الوظائف، حتى لو ليست مثالية.
4. معرفة درجة الملاءمة لكل وظيفة.
5. معرفة ما الذي ينقصك لكل وظيفة.
6. فتح تفاصيل وظيفة ورؤية سبب التقييم.
7. توليد CV ATS draft مخصص لوظيفة محددة.
8. تنزيل أو نسخ نسخة CV structured قابلة للتحويل إلى PDF لاحقًا.

## ملاحظة قانونية وتشغيلية

حسب Wuzzuf User Agreement، استخدام المواد مسموح للاستخدام الشخصي غير التجاري والمعلوماتي، مع قيود على إعادة النشر أو التوزيع. لذلك الـ MVP يجب أن يكون للاستخدام الداخلي الشخصي فقط، ولا يعيد نشر بيانات الوظائف على الموقع العام.

LinkedIn أعلى مخاطرة: robots.txt واتفاقية الاستخدام يحظران الوصول الآلي أو scraping/copying بدون إذن صريح. لذلك دعمه يجب أن يكون بتصميم حذر، منفصل، وقابل للتعطيل، مع fallback للاستيراد اليدوي من روابط LinkedIn.

المصادر:
https://wuzzuf.net/user_agreement/
https://www.linkedin.com/robots.txt
https://www.linkedin.com/legal/user-agreement
