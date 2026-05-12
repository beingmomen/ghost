# 08. ATS Resume MVP

## الهدف

توليد CV draft مخصص للوظيفة ويكون مناسبًا للـ ATS.

## ما المقصود بـ ATS-friendly؟

في MVP نقصد:

- layout بسيط.
- نص واضح.
- headings قياسية.
- عدم الاعتماد على جداول معقدة.
- عدم استخدام صور أو أيقونات داخل المحتوى الأساسي.
- كلمات مفتاحية من الوظيفة تظهر بشكل طبيعي.
- PDF قابل للقراءة والنقل إلى text.

## Sections

النسخة الأولى تحتوي على:

- Name and contact.
- Professional summary.
- Skills.
- Experience.
- Projects.
- Education إن وجدت.
- Links.

## Inputs

- career profile.
- job details.
- match analysis.
- selected projects.

## Resume Draft Shape

```ts
type AtsResumeDraft = {
  headline: string
  summary: string
  skills: string[]
  experienceBullets: Array<{
    company: string
    role: string
    bullets: string[]
  }>
  projects: Array<{
    title: string
    bullets: string[]
    stack: string[]
  }>
  warnings: string[]
}
```

## Tailoring Rules

- لا نخترع خبرات غير موجودة.
- لا نضيف skill غير موجودة في profile إلا كـ warning أو gap.
- نعيد ترتيب المهارات حسب الوظيفة.
- نختار المشاريع الأقرب للوظيفة.
- نبرز Vue/Nuxt إذا الوظيفة تطلبهم.
- نبرز React/Angular فقط لو الوظيفة تطلبهم وكانوا ضمن مهاراتك الثانوية أو مشاريعك.

## Output Formats

في أول نسخة:

- `ats_text`: نص structured قابل للنسخ.
- `html`: preview بسيط داخل الداشبورد.

PDF يمكن تأجيله خطوة واحدة إذا كان سيأخذ وقتًا.

إذا أردنا PDF من البداية:

- نستخدم HTML template بسيط.
- أو endpoint backend يحول HTML إلى PDF.

## CV Template

Template بسيط:

```text
Name
Frontend Developer | Vue | Nuxt | TypeScript
Email | Phone | LinkedIn | GitHub | Portfolio

Summary
...

Skills
Frontend: Vue, Nuxt, TypeScript, JavaScript, Tailwind CSS
Tools: Git, REST APIs, ...

Experience
Company - Role
- Built ...
- Improved ...

Projects
Project Name
- Built ...
- Used ...
```

## Warnings

كل CV draft يجب أن يعرض warnings إذا وجدت:

- الوظيفة تطلب skill غير موجودة في profile.
- الوظيفة senior جدًا مقارنة بالإعداد الحالي.
- لا توجد مشاريع كافية مرتبطة بالـ stack.
- الوصف ناقص، والـ CV قد يكون عامًا.

## MVP Non-Goals

- لا نحتاج محرر CV كامل.
- لا نحتاج themes كثيرة.
- لا نحتاج drag/drop.
- لا نحتاج parsing CV PDF.
- لا نحتاج export DOCX في أول نسخة.

## Quality Criteria

CV draft جيد إذا:

- يطابق الوظيفة بدون كذب.
- يبرز Vue/Nuxt بوضوح.
- يستخدم كلمات الوظيفة المهمة.
- لا يكون طويلًا جدًا.
- يمكن نسخه أو تحويله إلى PDF بسهولة.
