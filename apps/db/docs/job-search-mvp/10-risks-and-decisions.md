# 10. Risks And Decisions

## Decisions

### D1: Wuzzuf and LinkedIn

الـ MVP يستخدم Wuzzuf وLinkedIn.

السبب:

- Wuzzuf يعطي مصدرًا مستقرًا نسبيًا.
- LinkedIn مهم جدًا لحجم وجودة الفرص.
- LinkedIn يبقى adapter منفصلًا حتى لا يعطل باقي النظام.

### D2: No tracking

لا يوجد تتبع بعد التقديم في MVP.

السبب:

- ليس ضروريًا لاختبار القيمة الأساسية.
- يضيف تعقيدًا كبيرًا.

### D3: No auto-apply

لا يوجد تقديم تلقائي.

السبب:

- مخاطرة عالية.
- غير مطلوب حاليًا.

### D4: Wide search, separate scoring

لا نخفي الوظائف غير المثالية.

نبحث واسعًا ثم نستخدم score وgap analysis.

### D5: Hybrid matching

لا نعتمد على LLM فقط.

نستخدم rules + LLM.

### D6: LinkedIn fallback required

كل دعم LinkedIn يجب أن يكون معه manual import fallback.

السبب:

- LinkedIn قد يفشل أو يحظر الجلب الآلي.
- القيمة الأساسية لا يجب أن تعتمد على adapter غير مضمون.

## Risks

### R1: تغير HTML في Wuzzuf

الأثر:

- parser قد يفشل.

التخفيف:

- فصل parser عن normalizer.
- health check.
- tests على HTML samples.

### R2: قيود الاستخدام

الأثر:

- scraping قد يكون غير مناسب للاستخدام العام أو التجاري.

التخفيف:

- استخدام شخصي داخلي.
- لا إعادة نشر.
- rate limits.
- تخزين أقل قدر مطلوب.
- مراجعة User Agreement دوريًا.

### R2b: LinkedIn restrictions

الأثر:

- LinkedIn قد يكون غير مناسب للـ scraping الآلي المباشر.
- adapter قد يفشل أو يكون غير مستقر.

التخفيف:

- no login.
- no cookies.
- no bypass.
- manual URL import.
- source يمكن تعطيله.
- Wuzzuf لا يعتمد على LinkedIn.

### R3: جودة LLM

الأثر:

- score أو recommendations قد تكون عامة.

التخفيف:

- JSON schema.
- rules score fallback.
- reject generic recommendations.

### R4: بيانات profile غير كافية

الأثر:

- CV draft ضعيف.
- gap analysis غير دقيق.

التخفيف:

- career profile settings.
- تحسين projects/experiences بمرور الوقت.

### R5: تضخيم الـ MVP

الأثر:

- المشروع يتعطل قبل الوصول لقيمة.

التخفيف:

- LinkedIn محدود داخل adapter منفصل.
- لا tracking.
- لا auto apply.
- لا analytics متقدمة.

## Open Questions

- هل الباك الحالي MongoDB أم SQL؟
- هل تريد PDF في أول نسخة أم preview/copy كافٍ؟
- ما مزود LLM المفضل؟
- هل تريد حفظ raw HTML samples للاختبار؟
- هل تريد البحث داخل مصر فقط أم Remote/MENA أيضًا؟
- هل LinkedIn automatic adapter مطلوب من أول sprint أم يكفي manual import أولًا ثم adapter؟

## Recommended Answers مبدئيًا

- ابدأ بـ Wuzzuf داخل مصر + Remote.
- أضف LinkedIn manual import مبكرًا.
- أضف LinkedIn automatic adapter بعد ثبات Wuzzuf.
- استخدم preview/copy أولًا، ثم PDF لاحقًا.
- احفظ raw text لا raw HTML كامل إلا في بيئة development.
- استخدم LLM فقط بعد rules-based score.

## Source Notes

Wuzzuf User Agreement يذكر أن استخدام مواد الموقع يكون للاستخدام الشخصي غير التجاري والمعلوماتي، ويمنع إعادة النشر أو التوزيع أو الاستخدام العام/التجاري بدون تصريح.

المصدر:
https://wuzzuf.net/user_agreement/

LinkedIn robots.txt واتفاقية الاستخدام يضعان قيودًا صريحة على الوصول الآلي وscraping/copying بدون إذن.

المصادر:
https://www.linkedin.com/robots.txt
https://www.linkedin.com/legal/user-agreement
