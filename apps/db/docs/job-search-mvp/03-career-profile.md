# 03. Career Profile

## الهدف

إنشاء طبقة موحدة تمثل بياناتك المهنية وتستخدم في:

- matching.
- gap analysis.
- CV generation.
- prompt context.

## المشكلة الحالية

المشروع الحالي يحتوي على بيانات مفيدة في:

- `infos`
- `skills`
- `experiences`
- `projects`

لكنها مصممة أكثر للعرض على الموقع والداشبورد، وليست كافية وحدها كـ career intelligence model.

## الحل

ننشئ `career_profile` يتم بناؤه من بياناتك الحالية مع بعض الحقول الإضافية.

## Sources من النظام الحالي

- `infos.resumeUrl`
- `infos.bio`
- `infos.skills`
- `skills`
- `experiences`
- `projects`

## Career Profile Shape

```ts
type CareerProfile = {
  headline: string
  targetRoles: string[]
  seniority: 'mid' | 'senior' | 'lead'
  yearsOfExperience?: number
  locationPreferences: string[]
  workplacePreferences: Array<'remote' | 'hybrid' | 'onsite'>
  coreStack: string[]
  secondaryStack: string[]
  tools: string[]
  languages: string[]
  domains: string[]
  achievements: string[]
  experiences: CareerExperience[]
  projects: CareerProject[]
  links: CareerLinks
}
```

## مثال مناسب لك

```json
{
  "headline": "Frontend Developer specializing in Vue and Nuxt",
  "targetRoles": [
    "Frontend Developer",
    "Vue Developer",
    "Nuxt Developer"
  ],
  "seniority": "mid",
  "coreStack": [
    "Vue",
    "Nuxt",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS"
  ],
  "secondaryStack": [
    "React",
    "Angular"
  ],
  "workplacePreferences": [
    "remote",
    "hybrid"
  ]
}
```

## حقول يجب إضافتها لاحقًا

هذه الحقول ليست موجودة بوضوح الآن ويجب إضافتها أو استنتاجها:

- target roles.
- target seniority.
- preferred stack.
- stack priority.
- years of experience.
- achievements بصيغة measurable.
- project impact.
- preferred industries.
- salary expectation إن أردت.
- relocation أو remote preference.

## Profile Snapshot

لا نرسل كل بياناتك للـ LLM كل مرة.

ننشئ snapshot مختصر:

```ts
type CareerProfileSnapshot = {
  headline: string
  seniority: string
  coreSkills: string[]
  secondarySkills: string[]
  highlights: string[]
  recentExperience: string[]
  strongestProjects: string[]
}
```

## استخدامه في Matching

الـ matching لا يعتمد فقط على LLM.

يستخدم:

- skill overlap.
- seniority distance.
- role match.
- frontend framework match.
- location/workplace match.
- experience requirements.
- LLM explanation.

## استخدامه في CV

الـ CV generator يستخدم:

- profile headline.
- summary.
- skills.
- experiences.
- projects.
- links.

ثم يختار أو يعيد ترتيب العناصر حسب الوظيفة.

## قرار MVP

في أول نسخة:

- لا نبني profile editor كامل.
- نستخدم بياناتك الحالية.
- نضيف شاشة صغيرة لإعدادات البحث المهنية:
  - target roles.
  - default stack.
  - target seniority.
  - workplace preference.
