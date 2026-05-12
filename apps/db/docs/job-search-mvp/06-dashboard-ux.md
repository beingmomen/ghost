# 06. Dashboard UX

## الهدف

إضافة workspace واضح للوظائف داخل الداشبورد، وليس مجرد CRUD table.

## Sidebar

إضافة قسم جديد:

```text
الوظائف
```

روابط MVP:

- بحث الوظائف.
- الوظائف المحفوظة.
- استيراد وظيفة LinkedIn.
- إعدادات البروفايل المهني.

## Page 1: Job Search

المسار المقترح:

```text
/job-search
```

الغرض:

- تشغيل Wuzzuf وLinkedIn search run.
- عرض progress بسيط.
- عرض إحصائيات آخر run.

الحقول:

- Terms.
- Sources: Wuzzuf, LinkedIn.
- Location.
- Max pages.
- Max jobs.
- Stack quick filters.

القيم الافتراضية:

- Frontend Developer
- Vue Developer
- Nuxt Developer
- Egypt
- 3 pages
- 60 jobs

Actions:

- Run search.
- Import LinkedIn URL.
- View latest results.

## Page 2: Jobs Inbox

المسار:

```text
/jobs
```

الغرض:

- عرض الوظائف.
- فلترة وترتيب.
- الدخول لتفاصيل الوظيفة.

الأعمدة:

- العنوان.
- الشركة.
- المكان.
- المستوى.
- التقنيات.
- score.
- status.
- تاريخ النشر.

الفلاتر:

- keyword.
- stack.
- seniority.
- workplace.
- status.
- min score.

Default filter:

- source = All.
- يمكن تغيير source إلى Wuzzuf أو LinkedIn.
- stack includes Vue/Nuxt by default، لكن يمكن إلغاء هذا لعرض كل frontend jobs.

## Page 3: Job Details

المسار:

```text
/jobs/:id
```

الأقسام:

- Job summary.
- Original link.
- Description.
- Requirements.
- Skills detected.
- Fit analysis.
- Missing skills.
- Recommendations.
- Resume draft panel.

Actions:

- Analyze again.
- Shortlist.
- Ignore.
- Create ATS CV draft.
- Open Wuzzuf.
- Open LinkedIn إذا كانت الوظيفة من LinkedIn.

## Page 4: Career Profile Settings

المسار:

```text
/career-profile
```

الغرض:

- ضبط إعدادات التحليل الافتراضية.

الحقول:

- Target roles.
- Target seniority.
- Core stack.
- Optional stack.
- Workplace preferences.
- Location preferences.

ملاحظة:

لا نعيد بناء كل بياناتك هنا. هذه الصفحة فقط تضبط إعدادات البحث والتحليل.

## UX Rules

- لا نخفي الوظائف الضعيفة تلقائيًا.
- نعرض الوظيفة ونوضح لماذا score منخفض.
- Senior job لا يتم استبعاده، بل يظهر كـ `stretch`.
- كل score يجب أن يكون معه سبب واضح.
- CV draft لا يُعتبر نهائيًا، بل draft قابل للتعديل.

## Statuses

```text
new
shortlisted
ignored
cv_ready
applied
```

في MVP يمكن استخدام:

- new.
- shortlisted.
- ignored.
- cv_ready.

`applied` اختياري، وليس tracking.

## Empty States

لو لا توجد وظائف:

- اعرض زر Run Job Search.
- اعرض default terms.

لو لا يوجد fit analysis:

- اعرض زر Analyze.

لو لا يوجد career profile:

- اعرض CTA لإعداد Career Profile Settings.
