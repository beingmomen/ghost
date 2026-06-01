# Feature Spec — Learning Roadmap Tracker (مسار التطور لـ Senior Front-end)

> **ملف تنفيذي موجّه لـ Claude Code.** الهدف: بناء فيتشر "متابعة مسار التعلم" عبر الـ 3 مشاريع (Backend / Dashboard / Website) في مشروع الـ Portfolio.
>
> اقرأ القسم الأول كله قبل ما تبدأ أي كود.

---

## 0) تعليمات أساسية لـ Claude Code (اقرأها أولاً — إلزامية)

1. **قبل أي سطر كود، افحص المشاريع التلاتة وافهم الـ conventions الموجودة فعلاً، والتزم بيها 100% — متخترعش أنماط جديدة:**
   - بنية المجلدات (folders structure) في كل مشروع.
   - في الـ Backend (Node.js + Express): شكل الـ routes، الـ controllers/services layer، الـ middleware (خصوصاً الـ auth)، طريقة الـ validation المستخدمة، وطبقة الـ DB/ORM المستخدمة فعلاً. **استخدم نفس الـ ORM/DB ونفس أسلوب الـ validation الموجود — متفترضش حاجة جديدة.**
   - في الـ Dashboard والـ Website (Nuxt 4 + Nuxt UI 4): شكل الـ pages، الـ components، الـ composables، طبقة الـ services/API client، إدارة الـ state، والـ theme/design tokens. استخدم نفس مكونات **Nuxt UI 4** الموجودة بالفعل في كل مشروع ونفس أسلوب التنسيق.
2. **لو لقيت أي تعارض بين الموجود في الكود وبين أي تفصيلة في الملف ده → الموجود في الكود هو المرجع.** الملف ده بيحدد *إيه* المطلوب و*المنطق* (logic)، مش بيفرض أسلوب تنفيذ مخالف لمشاريعه.
3. **الفصل بين المشاريع:** كل حاجة في مشروعها. الـ Backend هو مصدر الحقيقة الوحيد للحسابات (level/progress). الـ Dashboard والـ Website بياخدوا البيانات جاهزة من الـ API ومش بيعيدوا الحساب.
4. لو في تفصيلة تقنية مش واضحة من الكود ولا من الملف ده → **اسأل صاحب المشروع قبل ما تفترض.**

---

## 1) نظرة عامة على الفيتشر

فيتشر بيعرض ويدير خطة تعلم طويلة المدى مقسّمة إلى **مراحل (Phases) ← أسابيع (Weeks) ← مهام (Tasks)**، الهدف منها الوصول من مستوى Junior–Mid إلى **Senior Front-end Engineer**.

المطلوب:
1. **Checkboxes** لكل مهمة (تعليم/إلغاء "تم").
2. **Progress bar** للتقدم الكلي + تقدم لكل مرحلة.
3. **مؤشر المستوى الوظيفي (Level)**: يوضح المستوى الحالي على سُلّم (Junior → Mid → على باب Senior → Senior)، نسبة التقدم للمستوى التالي، والمدة المتبقية التقديرية للوصول لـ Senior.
4. **قابل للتخصيص بالكامل من الـ Dashboard**: إضافة/تعديل/حذف مراحل وأسابيع ومهام، وأي تعديل يظهر **تلقائياً** في الـ Website (لأن الاتنين بياخدوا من نفس الـ API).
5. **ترتيب (Sort/Reorder)** للمراحل والأسابيع والمهام من الـ Dashboard.

### قرارات تصميم اتأخدت (قابلة للتغيير — راجعها مع صاحب المشروع لو محتاج)
- **الـ Website = عرض فقط (read-only).** كل التعديل وتعليم "تم" بيحصل في الـ Dashboard. الـ Website بيعرض النتيجة بشكل احترافي.
- **Roadmap واحدة** (مش متعددة).
- **الـ Level والمدة المتبقية محسوبة تلقائياً** من نسبة إنجاز المهام (الفورمولا في القسم 4)، مع إمكانية **override يدوي** اختياري في الـ Settings.
- **الترتيب (reorder)** عن طريق أزرار ▲▼ (move up/down)، إلا لو فيه نمط drag-and-drop جاهز ومستخدم فعلاً في الـ Dashboard فاستخدمه.
- `hoursPerWeek` الافتراضي = **14** (ساعتين/يوم).

> **ملاحظة مهمة على آخر مرحلة في الخطة ("Open Source + Capstone"):** دي مرحلة **بالتوازي (parallel/ongoing)** بتمشي من اليوم الأول، مش في الآخر. علشان كده الـ `weeksEstimate` بتاعها = **0** (مش بتضيف أسابيع للمدة المتبقية)، بس مهامها **مطلوبة** للوصول لـ Senior (الـ milestone بتاع `senior` متحط عليها). الفكرة: مفيش وصول لـ Senior من غير تطبيق المعرفة في مشروع متشحن + code review حقيقي من خارج. خليها ظاهرة للمستخدم من بدري في الـ UI رغم إنها آخر مرحلة بالـ order.

---

## 2) Data Model

كيانات هرمية: `Phase 1—* Week 1—* Task`، بالإضافة لـ `Settings` (سجل واحد).

> نفّذها بالـ ORM/DB الموجود فعلاً في الـ Backend، بنفس أسلوب تعريف الـ models الموجود.

### Phase (المرحلة)
| الحقل | النوع | ملاحظات |
|---|---|---|
| `id` | string/uuid | حسب أسلوب المشروع |
| `title` | string | اسم المرحلة |
| `description` | string \| null | وصف مختصر |
| `order` | int | ترتيب العرض (تصاعدي) |
| `weeksEstimate` | int | عدد الأسابيع التقديري للمرحلة (يدخل في حساب المدة) |
| `milestoneLevel` | enum \| null | `mid` \| `mid_advanced` \| `senior` — يتحط على المرحلة اللي إتمامها بيرفع المستوى. غير كده `null` |
| `createdAt` / `updatedAt` | datetime | حسب أسلوب المشروع |

### Week (الأسبوع)
| الحقل | النوع | ملاحظات |
|---|---|---|
| `id` | string/uuid | |
| `phaseId` | FK → Phase | |
| `title` | string | مثال: "الأسبوع 1" |
| `focus` | string \| null | عنوان فرعي/تركيز الأسبوع |
| `order` | int | الترتيب داخل المرحلة |

### Task (المهمة)
| الحقل | النوع | ملاحظات |
|---|---|---|
| `id` | string/uuid | |
| `weekId` | FK → Week | |
| `text` | string | نص المهمة |
| `type` | enum \| null | `learn` \| `practice` \| `explain` (اختياري، للتصنيف البصري) |
| `done` | boolean | الافتراضي `false` |
| `doneAt` | datetime \| null | يتسجّل وقت التعليم |
| `order` | int | الترتيب داخل الأسبوع |

### Settings (سجل واحد singleton)
| الحقل | النوع | الافتراضي |
|---|---|---|
| `startDate` | datetime | تاريخ بداية الخطة |
| `hoursPerWeek` | int | `14` |
| `levelOverride` | enum \| null | `junior_mid`\|`mid`\|`mid_advanced`\|`senior` — لو متعيّن يتجاهل الحساب التلقائي للـ level |

---

## 3) Backend (Node.js + Express) — API Contract

> طبّق الـ endpoints دي بنفس أسلوب الـ routing/controllers/validation/auth الموجود. **الـ mutations (POST/PATCH/DELETE) محمية بالـ auth الموجود (Dashboard)، والـ `GET /api/roadmap` متاح للعرض في الـ Website.** (لو الـ Website ليه auth خاص، امشِ على المتاح في المشروع.)

**Base path مقترح:** `/api/roadmap` (عدّله ليتماشى مع نمط الـ API الموجود).

### القراءة (للـ Website والـ Dashboard)
- `GET /api/roadmap`
  يرجّع الشجرة الكاملة + الحسابات الجاهزة. **شكل الـ response:**
  ```jsonc
  {
    "settings": { "startDate": "2025-06-01", "hoursPerWeek": 14, "levelOverride": null },
    "stats": {
      "totalTasks": 0,
      "doneTasks": 0,
      "overallProgress": 0.0,          // 0..1
      "overallPercent": 0,             // 0..100 (مقرّب)
      "currentLevel": "junior_mid",    // junior_mid | mid | mid_advanced | senior
      "nextMilestone": "mid",          // أول milestone لسه مش متحقق، أو null لو وصل senior
      "progressToNextPercent": 0,      // 0..100 تقدم نحو المرحلة الفاصلة التالية
      "weeksRemainingToSenior": 53,    // تقديري
      "hoursRemainingToSenior": 742,   // = weeksRemainingToSenior * hoursPerWeek
      "weeksToNextMilestone": 12
    },
    "phases": [
      {
        "id": "...", "title": "...", "description": "...", "order": 0,
        "weeksEstimate": 8, "milestoneLevel": null,
        "phaseProgress": 0.0, "phasePercent": 0,
        "phaseTotalTasks": 0, "phaseDoneTasks": 0,
        "weeks": [
          { "id": "...", "title": "الأسبوع 1", "focus": "...", "order": 0,
            "tasks": [ { "id": "...", "text": "...", "type": "learn", "done": false, "doneAt": null, "order": 0 } ]
          }
        ]
      }
    ]
  }
  ```

### المراحل (Phases)
- `POST /api/roadmap/phases` — body: `{ title, description?, weeksEstimate, milestoneLevel? }` (الـ `order` = آخر واحد + 1)
- `PATCH /api/roadmap/phases/:id` — تعديل أي حقل
- `DELETE /api/roadmap/phases/:id` — يحذف المرحلة وكل أسابيعها ومهامها (cascade)
- `PATCH /api/roadmap/phases/reorder` — body: `{ orderedIds: ["id1","id2",...] }`

### الأسابيع (Weeks)
- `POST /api/roadmap/weeks` — body: `{ phaseId, title, focus? }`
- `PATCH /api/roadmap/weeks/:id`
- `DELETE /api/roadmap/weeks/:id` — cascade على المهام
- `PATCH /api/roadmap/weeks/reorder` — body: `{ phaseId, orderedIds: [...] }`

### المهام (Tasks)
- `POST /api/roadmap/tasks` — body: `{ weekId, text, type? }`
- `PATCH /api/roadmap/tasks/:id` — تعديل `text`/`type`، وكمان **toggle**: لما `done` تتغير لـ `true` يتسجّل `doneAt = now`، ولو `false` يبقى `null`
- `DELETE /api/roadmap/tasks/:id`
- `PATCH /api/roadmap/tasks/reorder` — body: `{ weekId, orderedIds: [...] }`

### الإعدادات (Settings)
- `GET /api/roadmap/settings`
- `PATCH /api/roadmap/settings` — body: `{ hoursPerWeek?, startDate?, levelOverride? }`

### Seeding
- وفّر **seed script** (بنفس أسلوب الـ seeding الموجود في المشروع لو موجود) يحقن البيانات الموجودة في **القسم 5** لو الـ roadmap فاضية.

---

## 4) منطق الحساب (Level & Progress) — يتنفّذ في الـ Backend فقط

> دي الفورمولا الحاسمة. نفّذها في الـ Backend (service واحد) وارجّعها داخل `stats` في `GET /api/roadmap`. الـ frontend **مايعيدش** الحساب.

```
لكل phase:
  phaseTotalTasks = عدد مهام المرحلة
  phaseDoneTasks  = عدد المهام done
  phaseProgress   = phaseTotalTasks == 0 ? 1 : phaseDoneTasks / phaseTotalTasks
  phaseComplete   = (phaseTotalTasks > 0) && (phaseDoneTasks == phaseTotalTasks)

إجمالي:
  totalTasks      = مجموع كل المهام
  doneTasks       = مجموع done
  overallProgress = totalTasks == 0 ? 0 : doneTasks / totalTasks
  overallPercent  = round(overallProgress * 100)

المدة المتبقية (تقديرية):
  لكل phase: remainingWeeks_i = phase.weeksEstimate * (1 - phaseProgress)
  weeksRemainingToSenior = round( Σ remainingWeeks_i )   // على كل المراحل
  hoursRemainingToSenior = weeksRemainingToSenior * settings.hoursPerWeek

تحديد المستوى (currentLevel):
  رتّب الـ phases بالـ order.
  المستوى الأساسي = "junior_mid".
  امشِ على المراحل بالترتيب وكوّن "كل المراحل قبل وشامل المرحلة X مكتملة؟".
  - لو كل المراحل حتى (وشامل) المرحلة اللي milestoneLevel="mid" مكتملة      → currentLevel = "mid"
  - لو كمان كل المراحل حتى milestoneLevel="mid_advanced" مكتملة            → currentLevel = "mid_advanced"
  - لو كل المراحل حتى milestoneLevel="senior" مكتملة                       → currentLevel = "senior"
  (أعلى مستوى تحقّق شرطه هو الناتج)
  * لو settings.levelOverride != null → استخدمه بدل المحسوب.

المرحلة الفاصلة التالية (nextMilestone):
  = أول milestoneLevel (بالترتيب mid → mid_advanced → senior) لسه مش متحقق، أو null لو وصل senior.

التقدم نحو الـ milestone التالية:
  حدد phases من البداية حتى (وشامل) المرحلة اللي milestoneLevel = nextMilestone.
  progressToNextPercent = round( (Σ doneTasks في النطاق ده / Σ totalTasks في النطاق ده) * 100 )
  weeksToNextMilestone  = round( Σ [weeksEstimate * (1 - phaseProgress)] على نفس النطاق )
```

سُلّم العرض للـ Level (للواجهة): `Junior` → `Mid` → `على باب Senior (mid_advanced)` → `Senior`.

---

## 5) Seed Data — المنهج بالترتيب الأمثل (Bottom-up)

> ده الترتيب اللي اختاره صاحب المشروع (الأساسيات الأول)، بعد مراجعة نقدية ضافت: Accessibility، State Management، Build Tooling & Git، Auth & Security بعمق، DSA + Big-O (أساس خفيف — مش FAANG)، Front-end System Design + Debugging، وخيط مستمر للـ Open Source + Capstone. احقنه كـ seed. النصوص بالعربي زي ما هي (هتظهر في الـ UI). `milestoneLevel` متحدّد على المراحل الفاصلة. إجمالي `weeksEstimate` ≈ **53 أسبوع** (متسلسلة) + مرحلة Open Source/Capstone بالتوازي (weeksEstimate = 0). أرقام الأسابيع في الـ `title` متسلسلة عبر كل المراحل.

```jsonc
{
  "settings": { "hoursPerWeek": 14, "levelOverride": null },
  "phases": [
    {
      "title": "الأساس: JavaScript بعمق",
      "description": "تفهم وتشرح المحرك من جوه — مش تستخدم وخلاص.",
      "weeksEstimate": 8, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 1", "focus": "نموذج التنفيذ", "tasks": [
          { "text": "Execution context + Call stack: ازاي JS بيشغّل الكود خطوة خطوة", "type": "learn" },
          { "text": "Hoisting و TDZ (var / let / const)", "type": "learn" },
          { "text": "Scope: global / function / block", "type": "learn" },
          { "text": "تمرين: خد سنيبت فيه var/let واشرح بصوت عالي ترتيب التنفيذ", "type": "explain" }
        ]},
        { "title": "الأسبوع 2", "focus": "this & binding", "tasks": [
          { "text": "قواعد this الأربعة (default / implicit / explicit / new)", "type": "learn" },
          { "text": "call / apply / bind", "type": "learn" },
          { "text": "arrow functions و this", "type": "learn" },
          { "text": "تمرين: اكتب مثال لكل حالة this من غير AI", "type": "practice" }
        ]},
        { "title": "الأسبوع 3", "focus": "Closures (الأهم)", "tasks": [
          { "text": "يعني إيه closure و lexical scope", "type": "learn" },
          { "text": "أمثلة: counter / private state / currying", "type": "learn" },
          { "text": "تمرين: ابني module pattern بـ closure من الصفر", "type": "practice" },
          { "text": "اشرح closure لحد متخيّل في 3 جُمل من غير ما تبص على حاجة", "type": "explain" }
        ]},
        { "title": "الأسبوع 4", "focus": "Prototypes & Inheritance", "tasks": [
          { "text": "Prototype chain و __proto__ vs prototype", "type": "learn" },
          { "text": "الـ classes تحت الغطا (syntactic sugar)", "type": "learn" },
          { "text": "تمرين: اعمل inheritance بالـ prototypes بإيدك", "type": "practice" }
        ]},
        { "title": "الأسبوع 5", "focus": "Objects, References & Proxies", "tasks": [
          { "text": "value vs reference + shallow/deep copy", "type": "learn" },
          { "text": "Proxy & Reflect (تمهيد لفهم reactivity في Vue)", "type": "learn" },
          { "text": "تمرين: اعمل reactive object بسيط بـ Proxy بإيدك", "type": "practice" }
        ]},
        { "title": "الأسبوع 6", "focus": "Async (1) — Event Loop", "tasks": [
          { "text": "Call stack + Web APIs + Task/Microtask queues", "type": "learn" },
          { "text": "Microtask vs Macrotask (Promise vs setTimeout)", "type": "learn" },
          { "text": "تمرين: توقّع ترتيب طباعة console.log في كود مختلط، وتأكّد", "type": "practice" }
        ]},
        { "title": "الأسبوع 7", "focus": "Async (2) — Promises & async/await", "tasks": [
          { "text": "Promise states + chaining + error handling", "type": "learn" },
          { "text": "async/await تحت الغطا", "type": "learn" },
          { "text": "تمرين: implement نسخة مبسطة من Promise.all بنفسك", "type": "practice" }
        ]},
        { "title": "الأسبوع 8", "focus": "Modern JS + مراجعة", "tasks": [
          { "text": "ES Modules (import/export, tree-shaking)", "type": "learn" },
          { "text": "destructuring / spread / optional chaining بعمق", "type": "learn" },
          { "text": "مراجعة: اشرح كل موضوع من المرحلة بصوت عالي", "type": "explain" }
        ]}
      ]
    },
    {
      "title": "TypeScript",
      "description": "الأساس اللي بيفتح أبواب فوراً.",
      "weeksEstimate": 4, "milestoneLevel": "mid",
      "weeks": [
        { "title": "الأسبوع 9", "focus": "أساسيات TS", "tasks": [
          { "text": "الأنواع، type vs interface، union/intersection", "type": "learn" },
          { "text": "تمرين: حوّل ملف JS صغير لـ TS كامل", "type": "practice" }
        ]},
        { "title": "الأسبوع 10", "focus": "Generics", "tasks": [
          { "text": "Generic functions + constraints", "type": "learn" },
          { "text": "تمرين: اكتب generic utility بنفسك", "type": "practice" }
        ]},
        { "title": "الأسبوع 11", "focus": "Narrowing & Utility Types", "tasks": [
          { "text": "Type narrowing + type guards", "type": "learn" },
          { "text": "Utility types: Partial/Pick/Omit/Record/ReturnType", "type": "learn" },
          { "text": "تمرين: استخدم 5 utility types في كود حقيقي", "type": "practice" }
        ]},
        { "title": "الأسبوع 12", "focus": "TS مع Vue + متقدم", "tasks": [
          { "text": "defineProps/defineEmits بالـ TS", "type": "learn" },
          { "text": "conditional & mapped types (مقدمة)", "type": "learn" },
          { "text": "تمرين: حوّل component من شغلك لـ TS بالكامل", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Web Fundamentals",
      "description": "اللي بيتسأل في أول 20 دقيقة في أي إنترفيو محترم.",
      "weeksEstimate": 4, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 13", "focus": "HTTP بعمق", "tasks": [
          { "text": "Methods / Status codes / Headers / REST", "type": "learn" },
          { "text": "اشرح دورة حياة request كاملة بصوت عالي", "type": "explain" }
        ]},
        { "title": "الأسبوع 14", "focus": "CORS", "tasks": [
          { "text": "CORS بيشتغل ازاي + preflight + الأخطاء الشائعة", "type": "learn" }
        ]},
        { "title": "الأسبوع 15", "focus": "Caching", "tasks": [
          { "text": "Browser cache + HTTP caching headers + ETags", "type": "learn" }
        ]},
        { "title": "الأسبوع 16", "focus": "Security أساسيات", "tasks": [
          { "text": "XSS / CSRF / HTTPS / tokens (JWT vs session) — المبادئ", "type": "learn" },
          { "text": "اشرح الفرق بين XSS و CSRF بمثال", "type": "explain" }
        ]}
      ]
    },
    {
      "title": "CSS نظرياً",
      "description": "تنفّذ كويس بالفعل — ناقص الفهم اللي يخليك تشرح وتتحكم.",
      "weeksEstimate": 3, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 17", "focus": "The Cascade & Specificity", "tasks": [
          { "text": "الـ Cascade + Specificity (احسب الـ specificity بإيدك)", "type": "learn" },
          { "text": "Inheritance + الـ box model بدقة", "type": "learn" }
        ]},
        { "title": "الأسبوع 18", "focus": "Flexbox بعمق", "tasks": [
          { "text": "main/cross axis + grow/shrink/basis بفهم كامل", "type": "learn" }
        ]},
        { "title": "الأسبوع 19", "focus": "Grid + Responsive strategy", "tasks": [
          { "text": "Grid بعمق (tracks/areas) + استراتيجية responsive واعية", "type": "learn" }
        ]}
      ]
    },
    {
      "title": "Accessibility (a11y)",
      "description": "غايب تماماً قبل كده — ومن أكتر حاجة بتفرّق في تقييم الـ front-end تحديداً.",
      "weeksEstimate": 2, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 20", "focus": "أساسيات a11y", "tasks": [
          { "text": "Semantic HTML الصح + الـ landmark roles + ليه a11y مهم", "type": "learn" },
          { "text": "Keyboard navigation: focus / tab order / focus management", "type": "learn" }
        ]},
        { "title": "الأسبوع 21", "focus": "ARIA + اختبار", "tasks": [
          { "text": "ARIA roles/states/properties + متى تستخدمها ومتى ماتستخدمش", "type": "learn" },
          { "text": "Screen readers أساسيات + WCAG (المستويات A/AA/AAA)", "type": "learn" },
          { "text": "تمرين: خد component من شغلك وخليه accessible واختبره بالكيبورد", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Vue Internals",
      "description": "بطّل تستخدمه على نياتك — افهمه من جوه.",
      "weeksEstimate": 4, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 22", "focus": "Reactivity", "tasks": [
          { "text": "ref vs reactive، وازاي Vue بيستخدم Proxy للـ reactivity", "type": "learn" },
          { "text": "اربط ده بدرس الـ Proxy في مرحلة JS", "type": "explain" }
        ]},
        { "title": "الأسبوع 23", "focus": "Dependency Tracking", "tasks": [
          { "text": "track / trigger / effects — ازاي Vue بيعرف يعيد الرندر", "type": "learn" }
        ]},
        { "title": "الأسبوع 24", "focus": "Rendering & Lifecycle", "tasks": [
          { "text": "Virtual DOM + diffing + component lifecycle", "type": "learn" }
        ]},
        { "title": "الأسبوع 25", "focus": "Composables & Patterns", "tasks": [
          { "text": "تصميم composables نظيفة قابلة لإعادة الاستخدام", "type": "learn" },
          { "text": "تمرين: refactor لـ composable من شغلك بشكل أنضف", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Nuxt بعمق",
      "description": "الفهم اللي ينقلك من Mid لباب Senior.",
      "weeksEstimate": 4, "milestoneLevel": "mid_advanced",
      "weeks": [
        { "title": "الأسبوع 26", "focus": "Rendering modes", "tasks": [
          { "text": "CSR / SSR / SSG / ISR — الفرق وإمتى تستخدم كل واحد وليه", "type": "learn" },
          { "text": "اشرح الفرق بين SSR و CSR بثقة (السؤال اللي وقعت فيه قبل كده)", "type": "explain" }
        ]},
        { "title": "الأسبوع 27", "focus": "Hydration", "tasks": [
          { "text": "Hydration بيشتغل ازاي + hydration mismatch وأسبابه", "type": "learn" }
        ]},
        { "title": "الأسبوع 28", "focus": "Data Fetching", "tasks": [
          { "text": "useFetch / useAsyncData + caching + الفرق بينهم", "type": "learn" }
        ]},
        { "title": "الأسبوع 29", "focus": "Nuxt Architecture", "tasks": [
          { "text": "Layers / Modules / Server routes — وارجع لتجربتك مع base-layer", "type": "learn" }
        ]}
      ]
    },
    {
      "title": "State Management بعمق",
      "description": "كان سطر صغير — وأنت محتاج فهم نظيف للـ client state والـ server state.",
      "weeksEstimate": 2, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 30", "focus": "Pinia & Client State", "tasks": [
          { "text": "Pinia بعمق (stores / getters / actions) + متى store ومتى local state", "type": "learn" },
          { "text": "إدارة client state معقّد بشكل نظيف", "type": "learn" }
        ]},
        { "title": "الأسبوع 31", "focus": "Server State", "tasks": [
          { "text": "مفهوم server-state caching (useFetch/useAsyncData كـ cache)", "type": "learn" },
          { "text": "الفرق بين client state و server state ومتى تحتاج كل واحد", "type": "explain" }
        ]}
      ]
    },
    {
      "title": "Testing",
      "description": "من الصفر — هتغيّر طريقة كتابتك للكود نفسها.",
      "weeksEstimate": 4, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 32", "focus": "مبادئ + Unit", "tasks": [
          { "text": "ليه نعمل tests + Vitest unit tests للـ functions/composables", "type": "learn" },
          { "text": "تمرين: اكتب unit tests لكود من شغلك", "type": "practice" }
        ]},
        { "title": "الأسبوع 33", "focus": "Component testing", "tasks": [
          { "text": "Vue Test Utils / Testing Library — اختبار component", "type": "learn" }
        ]},
        { "title": "الأسبوع 34", "focus": "Mocking & Coverage", "tasks": [
          { "text": "Mocking للـ API + coverage + اختبار async", "type": "learn" }
        ]},
        { "title": "الأسبوع 35", "focus": "E2E", "tasks": [
          { "text": "Playwright — كتابة E2E test لـ flow كامل", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Build Tooling & Git بعمق",
      "description": "أدوات يومية بتستخدمها سطحياً — الـ Senior بيفهم الـ toolchain بتاعه.",
      "weeksEstimate": 2, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 36", "focus": "Build Tooling", "tasks": [
          { "text": "Vite بيعمل إيه فعلاً (dev server / HMR / bundling) + transpilation + tree-shaking عملياً", "type": "learn" },
          { "text": "فهم package.json / lockfiles / إدارة الـ dependencies", "type": "learn" }
        ]},
        { "title": "الأسبوع 37", "focus": "Git بعمق", "tasks": [
          { "text": "merge vs rebase + interactive rebase + branching strategy", "type": "learn" },
          { "text": "تمرين: اعمل rebase وحل conflict عمداً بثقة", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Auth & Security بعمق",
      "description": "كانت أساسيات بس في Web Fundamentals — هنا الـ flows الكاملة (نقطة ضعف عندك).",
      "weeksEstimate": 2, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 38", "focus": "Auth Flows", "tasks": [
          { "text": "OAuth2 flow + JWT vs sessions + refresh tokens", "type": "learn" },
          { "text": "Secure token storage (httpOnly cookies vs localStorage ومخاطره)", "type": "learn" }
        ]},
        { "title": "الأسبوع 39", "focus": "Frontend Security عملي", "tasks": [
          { "text": "تطبيق الحماية من XSS/CSRF في Nuxt + أساسيات CSP", "type": "learn" },
          { "text": "اشرح flow الـ auth كامل بصوت عالي", "type": "explain" }
        ]}
      ]
    },
    {
      "title": "DSA + Big-O (أساس خفيف)",
      "description": "أساس خفيف مقصود — مش FAANG. كفاية للتأطير الهندسي وللإنترفيوهات العملية.",
      "weeksEstimate": 2, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 40", "focus": "Big-O & Structures", "tasks": [
          { "text": "Big-O notation (time/space) + complexity للعمليات الشائعة", "type": "learn" },
          { "text": "arrays / objects / maps / sets — ومتى تستخدم كل واحد", "type": "learn" }
        ]},
        { "title": "الأسبوع 41", "focus": "تطبيق عملي", "tasks": [
          { "text": "Stack / Queue / Linked list / Tree (فهم لا حفظ)", "type": "learn" },
          { "text": "تمرين: حل 3-5 مسائل بسيطة وحلّل الـ complexity بتاعتها", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Software Design",
      "description": "هنا بتكتسب الـ judgment اللي ناقصك — تقيّم القرار قبل ما تنفّذه.",
      "weeksEstimate": 5, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 42", "focus": "SOLID", "tasks": [
          { "text": "مبادئ SOLID مبدأ مبدأ بأمثلة frontend حقيقية", "type": "learn" },
          { "text": "اشرح كل مبدأ بمثال (السؤال اللي وقعت فيه قبل كده)", "type": "explain" }
        ]},
        { "title": "الأسبوع 43", "focus": "Design Patterns", "tasks": [
          { "text": "Factory / Observer / Strategy / Singleton — مع أمثلة من Vue", "type": "learn" }
        ]},
        { "title": "الأسبوع 44", "focus": "Clean Code", "tasks": [
          { "text": "Naming / abstraction / متى تفصل ومتى تجمّع", "type": "learn" }
        ]},
        { "title": "الأسبوع 45", "focus": "Frontend Architecture", "tasks": [
          { "text": "separation of concerns + folder structure واعية + data flow", "type": "learn" }
        ]},
        { "title": "الأسبوع 46", "focus": "Design Judgment", "tasks": [
          { "text": "تمرين: قيّم قرار architecture من شغلك — مميزاته وعيوبه والبدائل", "type": "explain" }
        ]}
      ]
    },
    {
      "title": "Performance",
      "description": "بفهم مش نقل من مقالات — قياس وتحسين حقيقي.",
      "weeksEstimate": 4, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 47", "focus": "قياس", "tasks": [
          { "text": "Core Web Vitals + ازاي تقيس بـ DevTools/Lighthouse", "type": "learn" }
        ]},
        { "title": "الأسبوع 48", "focus": "Bundle", "tasks": [
          { "text": "Bundle analysis + code splitting + lazy loading بفهم", "type": "learn" },
          { "text": "تمرين: حلّل bundle لمشروع وحسّنه فعلياً", "type": "practice" }
        ]},
        { "title": "الأسبوع 49", "focus": "Rendering perf", "tasks": [
          { "text": "Reflow/Repaint + virtual lists + تجنّب re-renders زيادة", "type": "learn" }
        ]},
        { "title": "الأسبوع 50", "focus": "Network & Loading", "tasks": [
          { "text": "Loading strategies / prefetch / caching على مستوى الـ app", "type": "learn" }
        ]}
      ]
    },
    {
      "title": "Front-end System Design + Debugging",
      "description": "أكبر مفرّق في إنترفيوهات وشغل الـ Senior + الـ debugging المنهجي اللي بيضمر مع الـ AI.",
      "weeksEstimate": 3, "milestoneLevel": null,
      "weeks": [
        { "title": "الأسبوع 51", "focus": "FE System Design (1)", "tasks": [
          { "text": "تصميم SPA كبير: component architecture + data flow + folder structure", "type": "learn" },
          { "text": "مفهوم الـ design system وليه", "type": "learn" }
        ]},
        { "title": "الأسبوع 52", "focus": "FE System Design (2)", "tasks": [
          { "text": "rendering & caching strategy على scale + performance budget", "type": "learn" },
          { "text": "تمرين: صمّم على ورق نظام front-end لتطبيق متوسط واشرح قراراتك", "type": "explain" }
        ]},
        { "title": "الأسبوع 53", "focus": "Debugging باحتراف", "tasks": [
          { "text": "Debugging منهجي + DevTools (Network/Performance/Memory) + breakpoints + profiling", "type": "learn" },
          { "text": "تمرين: debug مشكلة حقيقية من الأول للآخر من غير AI", "type": "practice" }
        ]}
      ]
    },
    {
      "title": "Open Source + Capstone (ممارسة مستمرة)",
      "description": "بالتوازي من اليوم الأول — مش في الآخر. ده اللي بيكسر نمط الشغل لوحدك وبيديك code review و judgment حقيقي. (weeksEstimate=0: مش بيضيف وقت للمدة، بس مطلوب للوصول لـ Senior.)",
      "weeksEstimate": 0, "milestoneLevel": "senior",
      "weeks": [
        { "title": "Capstone (مستمر)", "focus": "طبّق كل اللي بتتعلمه في مشروع متشحن", "tasks": [
          { "text": "اختار مشروع حقيقي (استغل الـ Portfolio) وابدأ فيه من بدري", "type": "practice" },
          { "text": "اشحن MVP شغّال", "type": "practice" },
          { "text": "طبّق كل pillar جديد في المشروع أول بأول", "type": "practice" },
          { "text": "أضف TypeScript كامل + tests للمشروع (بعد المراحل المعنية)", "type": "practice" }
        ]},
        { "title": "Open Source (مستمر)", "focus": "اخرج من العزلة — اتعرّض لـ code review حقيقي", "tasks": [
          { "text": "Setup: لاقي repos مناسبة لمستواك وافهم الـ contribution guidelines", "type": "practice" },
          { "text": "قدّم أول PR مقبول", "type": "practice" },
          { "text": "اوصل لـ 5 PRs مقبولة", "type": "practice" },
          { "text": "اوصل لـ 10 PRs مقبولة + استوعب الـ feedback من كل review", "type": "explain" }
        ]}
      ]
    }
  ]
}
```

---

## 6) Dashboard (Nuxt 4 + Nuxt UI 4) — صفحة الإدارة

> استخدم مكونات **Nuxt UI 4** الموجودة وطبقة الـ services/composables الموجودة للاتصال بالـ API. التزم بنمط الصفحات والـ navigation الموجود.

### الصفحة
- صفحة جديدة (مثال route: `/learning-roadmap` — عدّله ليناسب نمط الـ Dashboard)، مضافة للـ navigation بنفس الأسلوب.

### الهيدر (ملخص علوي)
- شارة المستوى الحالي (Badge) + **Progress bar** للتقدم الكلي (`UProgress`) + رقم النسبة + "المدة المتبقية لـ Senior: X أسبوع".

### الإدارة (CRUD + Reorder)
- عرض المراحل كـ Accordion (`UAccordion`)؛ جوه كل مرحلة الأسابيع، وجوه كل أسبوع المهام.
- **المهمة:** `UCheckbox` لتعليم done (PATCH فوري) + نص قابل للتعديل inline + زر حذف (مع `UModal` تأكيد) + أزرار ▲▼ لإعادة الترتيب.
- **إضافة مهمة:** `UInput` + `UButton` داخل كل أسبوع.
- **إضافة/تعديل أسبوع ومرحلة:** عبر `UModal` فيه فورم (للمرحلة: title, description, weeksEstimate, milestoneLevel).
- **Reorder:** أزرار ▲▼ على كل مستوى (مرحلة/أسبوع/مهمة) تنادي endpoint الـ reorder المناسب. (لو فيه نمط DnD جاهز في الـ Dashboard استخدمه بدلها.)
- بعد أي mutation: اعمل refetch لـ `GET /api/roadmap` (أو invalidate) عشان الأرقام والمستوى يتحدّثوا من الـ Backend.

### Settings
- قسم صغير لتعديل `hoursPerWeek` و `startDate` و (اختياري) `levelOverride`.

---

## 7) Frontend / Website (Nuxt 4 + Nuxt UI 4) — صفحة العرض (Read-only)

> نفس الـ design system والـ components بتاعة الـ Website. يقرأ من نفس `GET /api/roadmap`. **عرض فقط — مفيش تعديل ولا toggle.**

### الأقسام
1. **Hero / ملخص:**
   - شارة المستوى الحالي + **حلقة/شريط تقدم** كبير للنسبة الكلية.
   - "المدة المتبقية لـ Senior: ~X أسبوع (≈ Y ساعة)".
2. **سُلّم المستوى (Level Ladder):**
   - عرض بصري للأربع محطات: `Junior` → `Mid` → `على باب Senior` → `Senior`، مع تمييز المحطة الحالية ونسبة التقدم نحو التالية (`progressToNextPercent`).
3. **المراحل:**
   - كل مرحلة كـ section فيها عنوانها + progress bar خاص بيها (`phasePercent`) + قائمة الأسابيع والمهام للعرض (المهمة الـ done تتعرض بعلامة ✓/حالة مميّزة، غير المنجزة بحالة عادية).
   - الكل بيتولّد ديناميكياً من الـ API — أي إضافة من الـ Dashboard تظهر هنا تلقائياً.

### تأكيدات
- **اتساق كامل** مع ثيم وألوان وخطوط الـ Website الموجودة.
- لا منطق حساب في الـ frontend — كل الأرقام من `stats` في الـ API.

---

## 8) ترتيب التنفيذ المقترح لـ Claude Code

1. افحص المشاريع التلاتة ووثّق الـ conventions اللي هتمشي عليها (خطوة سريعة، بدون كود).
2. **Backend:** الـ models → الـ migration → الـ service بتاع الحسابات (قسم 4) → الـ routes/controllers → الـ seed script (قسم 5).
3. اختبر الـ API يدوياً (Postman موجود عنده) وتأكد من شكل `stats`.
4. **Dashboard:** الصفحة + الـ CRUD + الـ reorder + الـ settings.
5. **Website:** صفحة العرض الـ read-only.
6. تأكّد إن تعديل في الـ Dashboard بيظهر في الـ Website (نفس مصدر البيانات).

---

### ملاحظة أخيرة
الملف ده بيحدد **الـ what والـ logic**. الـ **how** (التنفيذ الفعلي) لازم يتبع 100% أنماط المشاريع الموجودة. أي تعارض → الكود الموجود هو المرجع، وأي غموض → اسأل قبل ما تفترض.
