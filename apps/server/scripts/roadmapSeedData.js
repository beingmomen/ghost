/**
 * Seed data for the Learning Roadmap (feature spec, section 5).
 * Texts are in Arabic on purpose — they are rendered as-is in the UI.
 */

module.exports = {
  settings: { hoursPerWeek: 14, levelOverride: null },
  phases: [
    {
      title: 'الأساس: JavaScript بعمق',
      description: 'تفهم وتشرح المحرك من جوه — مش تستخدم وخلاص.',
      weeksEstimate: 8,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 1',
          focus: 'نموذج التنفيذ',
          tasks: [
            {
              text: 'Execution context + Call stack: ازاي JS بيشغّل الكود خطوة خطوة',
              type: 'learn'
            },
            { text: 'Hoisting و TDZ (var / let / const)', type: 'learn' },
            { text: 'Scope: global / function / block', type: 'learn' },
            {
              text: 'تمرين: خد سنيبت فيه var/let واشرح بصوت عالي ترتيب التنفيذ',
              type: 'explain'
            }
          ]
        },
        {
          title: 'الأسبوع 2',
          focus: 'this & binding',
          tasks: [
            {
              text: 'قواعد this الأربعة (default / implicit / explicit / new)',
              type: 'learn'
            },
            { text: 'call / apply / bind', type: 'learn' },
            { text: 'arrow functions و this', type: 'learn' },
            {
              text: 'تمرين: اكتب مثال لكل حالة this من غير AI',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 3',
          focus: 'Closures (الأهم)',
          tasks: [
            { text: 'يعني إيه closure و lexical scope', type: 'learn' },
            {
              text: 'أمثلة: counter / private state / currying',
              type: 'learn'
            },
            {
              text: 'تمرين: ابني module pattern بـ closure من الصفر',
              type: 'practice'
            },
            {
              text: 'اشرح closure لحد متخيّل في 3 جُمل من غير ما تبص على حاجة',
              type: 'explain'
            }
          ]
        },
        {
          title: 'الأسبوع 4',
          focus: 'Prototypes & Inheritance',
          tasks: [
            {
              text: 'Prototype chain و __proto__ vs prototype',
              type: 'learn'
            },
            { text: 'الـ classes تحت الغطا (syntactic sugar)', type: 'learn' },
            {
              text: 'تمرين: اعمل inheritance بالـ prototypes بإيدك',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 5',
          focus: 'Objects, References & Proxies',
          tasks: [
            { text: 'value vs reference + shallow/deep copy', type: 'learn' },
            {
              text: 'Proxy & Reflect (تمهيد لفهم reactivity في Vue)',
              type: 'learn'
            },
            {
              text: 'تمرين: اعمل reactive object بسيط بـ Proxy بإيدك',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 6',
          focus: 'Async (1) — Event Loop',
          tasks: [
            {
              text: 'Call stack + Web APIs + Task/Microtask queues',
              type: 'learn'
            },
            {
              text: 'Microtask vs Macrotask (Promise vs setTimeout)',
              type: 'learn'
            },
            {
              text: 'تمرين: توقّع ترتيب طباعة console.log في كود مختلط، وتأكّد',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 7',
          focus: 'Async (2) — Promises & async/await',
          tasks: [
            {
              text: 'Promise states + chaining + error handling',
              type: 'learn'
            },
            { text: 'async/await تحت الغطا', type: 'learn' },
            {
              text: 'تمرين: implement نسخة مبسطة من Promise.all بنفسك',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 8',
          focus: 'Modern JS + مراجعة',
          tasks: [
            { text: 'ES Modules (import/export, tree-shaking)', type: 'learn' },
            {
              text: 'destructuring / spread / optional chaining بعمق',
              type: 'learn'
            },
            {
              text: 'مراجعة: اشرح كل موضوع من المرحلة بصوت عالي',
              type: 'explain'
            }
          ]
        }
      ]
    },
    {
      title: 'TypeScript',
      description: 'الأساس اللي بيفتح أبواب فوراً.',
      weeksEstimate: 4,
      milestoneLevel: 'mid',
      weeks: [
        {
          title: 'الأسبوع 9',
          focus: 'أساسيات TS',
          tasks: [
            {
              text: 'الأنواع، type vs interface، union/intersection',
              type: 'learn'
            },
            { text: 'تمرين: حوّل ملف JS صغير لـ TS كامل', type: 'practice' }
          ]
        },
        {
          title: 'الأسبوع 10',
          focus: 'Generics',
          tasks: [
            { text: 'Generic functions + constraints', type: 'learn' },
            { text: 'تمرين: اكتب generic utility بنفسك', type: 'practice' }
          ]
        },
        {
          title: 'الأسبوع 11',
          focus: 'Narrowing & Utility Types',
          tasks: [
            { text: 'Type narrowing + type guards', type: 'learn' },
            {
              text: 'Utility types: Partial/Pick/Omit/Record/ReturnType',
              type: 'learn'
            },
            {
              text: 'تمرين: استخدم 5 utility types في كود حقيقي',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 12',
          focus: 'TS مع Vue + متقدم',
          tasks: [
            { text: 'defineProps/defineEmits بالـ TS', type: 'learn' },
            { text: 'conditional & mapped types (مقدمة)', type: 'learn' },
            {
              text: 'تمرين: حوّل component من شغلك لـ TS بالكامل',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Web Fundamentals',
      description: 'اللي بيتسأل في أول 20 دقيقة في أي إنترفيو محترم.',
      weeksEstimate: 4,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 13',
          focus: 'HTTP بعمق',
          tasks: [
            { text: 'Methods / Status codes / Headers / REST', type: 'learn' },
            {
              text: 'اشرح دورة حياة request كاملة بصوت عالي',
              type: 'explain'
            }
          ]
        },
        {
          title: 'الأسبوع 14',
          focus: 'CORS',
          tasks: [
            {
              text: 'CORS بيشتغل ازاي + preflight + الأخطاء الشائعة',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 15',
          focus: 'Caching',
          tasks: [
            {
              text: 'Browser cache + HTTP caching headers + ETags',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 16',
          focus: 'Security أساسيات',
          tasks: [
            {
              text: 'XSS / CSRF / HTTPS / tokens (JWT vs session) — المبادئ',
              type: 'learn'
            },
            { text: 'اشرح الفرق بين XSS و CSRF بمثال', type: 'explain' }
          ]
        }
      ]
    },
    {
      title: 'CSS نظرياً',
      description: 'تنفّذ كويس بالفعل — ناقص الفهم اللي يخليك تشرح وتتحكم.',
      weeksEstimate: 3,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 17',
          focus: 'The Cascade & Specificity',
          tasks: [
            {
              text: 'الـ Cascade + Specificity (احسب الـ specificity بإيدك)',
              type: 'learn'
            },
            { text: 'Inheritance + الـ box model بدقة', type: 'learn' }
          ]
        },
        {
          title: 'الأسبوع 18',
          focus: 'Flexbox بعمق',
          tasks: [
            {
              text: 'main/cross axis + grow/shrink/basis بفهم كامل',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 19',
          focus: 'Grid + Responsive strategy',
          tasks: [
            {
              text: 'Grid بعمق (tracks/areas) + استراتيجية responsive واعية',
              type: 'learn'
            }
          ]
        }
      ]
    },
    {
      title: 'Accessibility (a11y)',
      description:
        'غايب تماماً قبل كده — ومن أكتر حاجة بتفرّق في تقييم الـ front-end تحديداً.',
      weeksEstimate: 2,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 20',
          focus: 'أساسيات a11y',
          tasks: [
            {
              text: 'Semantic HTML الصح + الـ landmark roles + ليه a11y مهم',
              type: 'learn'
            },
            {
              text: 'Keyboard navigation: focus / tab order / focus management',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 21',
          focus: 'ARIA + اختبار',
          tasks: [
            {
              text: 'ARIA roles/states/properties + متى تستخدمها ومتى ماتستخدمش',
              type: 'learn'
            },
            {
              text: 'Screen readers أساسيات + WCAG (المستويات A/AA/AAA)',
              type: 'learn'
            },
            {
              text: 'تمرين: خد component من شغلك وخليه accessible واختبره بالكيبورد',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Vue Internals',
      description: 'بطّل تستخدمه على نياتك — افهمه من جوه.',
      weeksEstimate: 4,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 22',
          focus: 'Reactivity',
          tasks: [
            {
              text: 'ref vs reactive، وازاي Vue بيستخدم Proxy للـ reactivity',
              type: 'learn'
            },
            { text: 'اربط ده بدرس الـ Proxy في مرحلة JS', type: 'explain' }
          ]
        },
        {
          title: 'الأسبوع 23',
          focus: 'Dependency Tracking',
          tasks: [
            {
              text: 'track / trigger / effects — ازاي Vue بيعرف يعيد الرندر',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 24',
          focus: 'Rendering & Lifecycle',
          tasks: [
            {
              text: 'Virtual DOM + diffing + component lifecycle',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 25',
          focus: 'Composables & Patterns',
          tasks: [
            {
              text: 'تصميم composables نظيفة قابلة لإعادة الاستخدام',
              type: 'learn'
            },
            {
              text: 'تمرين: refactor لـ composable من شغلك بشكل أنضف',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Nuxt بعمق',
      description: 'الفهم اللي ينقلك من Mid لباب Senior.',
      weeksEstimate: 4,
      milestoneLevel: 'mid_advanced',
      weeks: [
        {
          title: 'الأسبوع 26',
          focus: 'Rendering modes',
          tasks: [
            {
              text: 'CSR / SSR / SSG / ISR — الفرق وإمتى تستخدم كل واحد وليه',
              type: 'learn'
            },
            {
              text: 'اشرح الفرق بين SSR و CSR بثقة (السؤال اللي وقعت فيه قبل كده)',
              type: 'explain'
            }
          ]
        },
        {
          title: 'الأسبوع 27',
          focus: 'Hydration',
          tasks: [
            {
              text: 'Hydration بيشتغل ازاي + hydration mismatch وأسبابه',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 28',
          focus: 'Data Fetching',
          tasks: [
            {
              text: 'useFetch / useAsyncData + caching + الفرق بينهم',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 29',
          focus: 'Nuxt Architecture',
          tasks: [
            {
              text: 'Layers / Modules / Server routes — وارجع لتجربتك مع base-layer',
              type: 'learn'
            }
          ]
        }
      ]
    },
    {
      title: 'State Management بعمق',
      description:
        'كان سطر صغير — وأنت محتاج فهم نظيف للـ client state والـ server state.',
      weeksEstimate: 2,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 30',
          focus: 'Pinia & Client State',
          tasks: [
            {
              text: 'Pinia بعمق (stores / getters / actions) + متى store ومتى local state',
              type: 'learn'
            },
            { text: 'إدارة client state معقّد بشكل نظيف', type: 'learn' }
          ]
        },
        {
          title: 'الأسبوع 31',
          focus: 'Server State',
          tasks: [
            {
              text: 'مفهوم server-state caching (useFetch/useAsyncData كـ cache)',
              type: 'learn'
            },
            {
              text: 'الفرق بين client state و server state ومتى تحتاج كل واحد',
              type: 'explain'
            }
          ]
        }
      ]
    },
    {
      title: 'Testing',
      description: 'من الصفر — هتغيّر طريقة كتابتك للكود نفسها.',
      weeksEstimate: 4,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 32',
          focus: 'مبادئ + Unit',
          tasks: [
            {
              text: 'ليه نعمل tests + Vitest unit tests للـ functions/composables',
              type: 'learn'
            },
            { text: 'تمرين: اكتب unit tests لكود من شغلك', type: 'practice' }
          ]
        },
        {
          title: 'الأسبوع 33',
          focus: 'Component testing',
          tasks: [
            {
              text: 'Vue Test Utils / Testing Library — اختبار component',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 34',
          focus: 'Mocking & Coverage',
          tasks: [
            {
              text: 'Mocking للـ API + coverage + اختبار async',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 35',
          focus: 'E2E',
          tasks: [
            {
              text: 'Playwright — كتابة E2E test لـ flow كامل',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Build Tooling & Git بعمق',
      description:
        'أدوات يومية بتستخدمها سطحياً — الـ Senior بيفهم الـ toolchain بتاعه.',
      weeksEstimate: 2,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 36',
          focus: 'Build Tooling',
          tasks: [
            {
              text: 'Vite بيعمل إيه فعلاً (dev server / HMR / bundling) + transpilation + tree-shaking عملياً',
              type: 'learn'
            },
            {
              text: 'فهم package.json / lockfiles / إدارة الـ dependencies',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 37',
          focus: 'Git بعمق',
          tasks: [
            {
              text: 'merge vs rebase + interactive rebase + branching strategy',
              type: 'learn'
            },
            {
              text: 'تمرين: اعمل rebase وحل conflict عمداً بثقة',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Auth & Security بعمق',
      description:
        'كانت أساسيات بس في Web Fundamentals — هنا الـ flows الكاملة (نقطة ضعف عندك).',
      weeksEstimate: 2,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 38',
          focus: 'Auth Flows',
          tasks: [
            {
              text: 'OAuth2 flow + JWT vs sessions + refresh tokens',
              type: 'learn'
            },
            {
              text: 'Secure token storage (httpOnly cookies vs localStorage ومخاطره)',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 39',
          focus: 'Frontend Security عملي',
          tasks: [
            {
              text: 'تطبيق الحماية من XSS/CSRF في Nuxt + أساسيات CSP',
              type: 'learn'
            },
            { text: 'اشرح flow الـ auth كامل بصوت عالي', type: 'explain' }
          ]
        }
      ]
    },
    {
      title: 'DSA + Big-O (أساس خفيف)',
      description:
        'أساس خفيف مقصود — مش FAANG. كفاية للتأطير الهندسي وللإنترفيوهات العملية.',
      weeksEstimate: 2,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 40',
          focus: 'Big-O & Structures',
          tasks: [
            {
              text: 'Big-O notation (time/space) + complexity للعمليات الشائعة',
              type: 'learn'
            },
            {
              text: 'arrays / objects / maps / sets — ومتى تستخدم كل واحد',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 41',
          focus: 'تطبيق عملي',
          tasks: [
            {
              text: 'Stack / Queue / Linked list / Tree (فهم لا حفظ)',
              type: 'learn'
            },
            {
              text: 'تمرين: حل 3-5 مسائل بسيطة وحلّل الـ complexity بتاعتها',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Software Design',
      description:
        'هنا بتكتسب الـ judgment اللي ناقصك — تقيّم القرار قبل ما تنفّذه.',
      weeksEstimate: 5,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 42',
          focus: 'SOLID',
          tasks: [
            {
              text: 'مبادئ SOLID مبدأ مبدأ بأمثلة frontend حقيقية',
              type: 'learn'
            },
            {
              text: 'اشرح كل مبدأ بمثال (السؤال اللي وقعت فيه قبل كده)',
              type: 'explain'
            }
          ]
        },
        {
          title: 'الأسبوع 43',
          focus: 'Design Patterns',
          tasks: [
            {
              text: 'Factory / Observer / Strategy / Singleton — مع أمثلة من Vue',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 44',
          focus: 'Clean Code',
          tasks: [
            {
              text: 'Naming / abstraction / متى تفصل ومتى تجمّع',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 45',
          focus: 'Frontend Architecture',
          tasks: [
            {
              text: 'separation of concerns + folder structure واعية + data flow',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 46',
          focus: 'Design Judgment',
          tasks: [
            {
              text: 'تمرين: قيّم قرار architecture من شغلك — مميزاته وعيوبه والبدائل',
              type: 'explain'
            }
          ]
        }
      ]
    },
    {
      title: 'Performance',
      description: 'بفهم مش نقل من مقالات — قياس وتحسين حقيقي.',
      weeksEstimate: 4,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 47',
          focus: 'قياس',
          tasks: [
            {
              text: 'Core Web Vitals + ازاي تقيس بـ DevTools/Lighthouse',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 48',
          focus: 'Bundle',
          tasks: [
            {
              text: 'Bundle analysis + code splitting + lazy loading بفهم',
              type: 'learn'
            },
            {
              text: 'تمرين: حلّل bundle لمشروع وحسّنه فعلياً',
              type: 'practice'
            }
          ]
        },
        {
          title: 'الأسبوع 49',
          focus: 'Rendering perf',
          tasks: [
            {
              text: 'Reflow/Repaint + virtual lists + تجنّب re-renders زيادة',
              type: 'learn'
            }
          ]
        },
        {
          title: 'الأسبوع 50',
          focus: 'Network & Loading',
          tasks: [
            {
              text: 'Loading strategies / prefetch / caching على مستوى الـ app',
              type: 'learn'
            }
          ]
        }
      ]
    },
    {
      title: 'Front-end System Design + Debugging',
      description:
        'أكبر مفرّق في إنترفيوهات وشغل الـ Senior + الـ debugging المنهجي اللي بيضمر مع الـ AI.',
      weeksEstimate: 3,
      milestoneLevel: null,
      weeks: [
        {
          title: 'الأسبوع 51',
          focus: 'FE System Design (1)',
          tasks: [
            {
              text: 'تصميم SPA كبير: component architecture + data flow + folder structure',
              type: 'learn'
            },
            { text: 'مفهوم الـ design system وليه', type: 'learn' }
          ]
        },
        {
          title: 'الأسبوع 52',
          focus: 'FE System Design (2)',
          tasks: [
            {
              text: 'rendering & caching strategy على scale + performance budget',
              type: 'learn'
            },
            {
              text: 'تمرين: صمّم على ورق نظام front-end لتطبيق متوسط واشرح قراراتك',
              type: 'explain'
            }
          ]
        },
        {
          title: 'الأسبوع 53',
          focus: 'Debugging باحتراف',
          tasks: [
            {
              text: 'Debugging منهجي + DevTools (Network/Performance/Memory) + breakpoints + profiling',
              type: 'learn'
            },
            {
              text: 'تمرين: debug مشكلة حقيقية من الأول للآخر من غير AI',
              type: 'practice'
            }
          ]
        }
      ]
    },
    {
      title: 'Open Source + Capstone (ممارسة مستمرة)',
      description:
        'بالتوازي من اليوم الأول — مش في الآخر. ده اللي بيكسر نمط الشغل لوحدك وبيديك code review و judgment حقيقي. (weeksEstimate=0: مش بيضيف وقت للمدة، بس مطلوب للوصول لـ Senior.)',
      weeksEstimate: 0,
      milestoneLevel: 'senior',
      weeks: [
        {
          title: 'Capstone (مستمر)',
          focus: 'طبّق كل اللي بتتعلمه في مشروع متشحن',
          tasks: [
            {
              text: 'اختار مشروع حقيقي (استغل الـ Portfolio) وابدأ فيه من بدري',
              type: 'practice'
            },
            { text: 'اشحن MVP شغّال', type: 'practice' },
            {
              text: 'طبّق كل pillar جديد في المشروع أول بأول',
              type: 'practice'
            },
            {
              text: 'أضف TypeScript كامل + tests للمشروع (بعد المراحل المعنية)',
              type: 'practice'
            }
          ]
        },
        {
          title: 'Open Source (مستمر)',
          focus: 'اخرج من العزلة — اتعرّض لـ code review حقيقي',
          tasks: [
            {
              text: 'Setup: لاقي repos مناسبة لمستواك وافهم الـ contribution guidelines',
              type: 'practice'
            },
            { text: 'قدّم أول PR مقبول', type: 'practice' },
            { text: 'اوصل لـ 5 PRs مقبولة', type: 'practice' },
            {
              text: 'اوصل لـ 10 PRs مقبولة + استوعب الـ feedback من كل review',
              type: 'explain'
            }
          ]
        }
      ]
    }
  ]
};
