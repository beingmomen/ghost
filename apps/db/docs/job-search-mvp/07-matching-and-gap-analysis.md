# 07. Matching And Gap Analysis

## الهدف

تحويل كل وظيفة إلى قرار عملي:

- هل تستحق التقديم؟
- لماذا مناسبة؟
- ماذا ينقصك؟
- هل هي stretch أم weak؟
- كيف نجهز CV لها؟

## لا نعتمد على LLM وحده

النهج الأفضل هو hybrid:

- rules لحساب score أولي.
- LLM للتفسير والتلخيص وتحليل الفجوات.

## Inputs

- normalized job.
- career profile snapshot.
- skills dictionary.
- stack priorities.
- target seniority.

## Score Components

اقتراح أولي:

```text
role match: 25%
core stack match: 30%
secondary stack match: 10%
seniority distance: 15%
experience/domain match: 10%
location/workplace match: 10%
```

## Score Levels

```text
85-100: excellent
70-84: good
50-69: stretch
0-49: weak
```

## Seniority Logic

لا نستبعد Senior jobs.

نصنفها:

- إذا الوظيفة mid وأنت mid: مناسب.
- إذا الوظيفة senior وأنت mid: stretch.
- إذا الوظيفة lead/manager: غالبًا weak أو stretch حسب المتطلبات.

## Skill Detection

نحتاج dictionary بسيط:

```json
{
  "vue": ["vue", "vue.js", "vuejs"],
  "nuxt": ["nuxt", "nuxt.js", "nuxtjs"],
  "react": ["react", "react.js", "next.js", "nextjs"],
  "angular": ["angular"],
  "typescript": ["typescript", "ts"],
  "javascript": ["javascript", "js", "ecmascript"],
  "tailwind": ["tailwind", "tailwind css"],
  "pinia": ["pinia"],
  "vuex": ["vuex"]
}
```

## Match Output

```ts
type MatchAnalysis = {
  score: number
  level: 'excellent' | 'good' | 'stretch' | 'weak'
  matchedSkills: string[]
  missingSkills: string[]
  reasons: string[]
  risks: string[]
  recommendations: string[]
  seniorityAssessment: string
}
```

## LLM Prompt Output

يجب إجبار الـ LLM على JSON فقط:

```json
{
  "summary": "Short explanation",
  "missingSkills": ["Testing", "GraphQL"],
  "risks": ["Requires 5+ years; profile appears mid-level"],
  "recommendations": ["Emphasize Nuxt projects", "Add measurable frontend performance bullet"],
  "cvFocus": ["Vue", "Nuxt", "TypeScript", "component architecture"]
}
```

## Gap Analysis Examples

مثال:

```text
الوظيفة مناسبة تقنيًا لأنها تطلب Vue/Nuxt/TypeScript.
الفجوة الأساسية: تطلب خبرة Senior وقيادة فريق.
للتقديم: ركز في CV على مشاريع Nuxt، ownership، وتحسينات performance.
```

## MVP Rules

- analysis on-demand أو بعد search run.
- لا نعيد تحليل نفس الوظيفة إلا إذا تغير profile أو job description.
- نحفظ `profileVersion`.
- إذا فشل LLM، نعرض rules score فقط.

## Anti-Garbage Rules

- لا نقبل score بدون reasons.
- لا نقبل missing skills غير موجودة في وصف الوظيفة.
- لا نقبل توصيات عامة جدًا مثل "improve your skills".
- كل recommendation يجب أن تكون مرتبطة بالوظيفة.
