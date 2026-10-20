// مصدر الهوية الواحد.
// يُقرأ من `app/**` عبر الـ alias `#shared/identity`، ومن `nuxt.config.ts` بمسار نسبي
// (`./shared/identity`) لأن الـ alias لسه مش متاح وقت تحميل الـ config.
// ملف `shared/` مش auto-import — فالاستيراد صريح دائماً.
// الرقم 2021 يعيش هنا فقط (في `since`) — مش literal في أي مكان تاني.

const since = 2021
const fullName = 'عبدالمؤمن الشطوري'
const title = 'Frontend Engineer'

export const IDENTITY = {
  fullName,
  fullNameEn: 'Abdelmomen Elshatory',
  title,
  since,
  available: true,
  // نص شارة التوفّر — مصدر واحد بدل تكراره hardcoded (تموضع محايد: وظيفة + فريلانس).
  availableLabel: 'متاح لفرص عن بُعد',
  unavailableLabel: 'غير متاح حالياً',
  // وصف الهيرو (المسودّة المعتمدة).
  description: `مهندس واجهات أمامية، أسلّم مشاريع فول ستاك كاملة — أبني أنظمة أعمال عربية تشتغل في الإنتاج: توزيع، فوترة، لوحات تحكم متعددة الصلاحيات. Nuxt & Vue منذ ${since}.`,
  // وصف SEO الهوم (≤160) — صادق ومحايد.
  seoDescription: `مهندس واجهات أمامية أسلّم مشاريع فول ستاك وأبني أنظمة أعمال عربية تشتغل في الإنتاج — Nuxt & Vue وواجهات RTL منذ ${since}. اطّلع على أعمالي وتواصل معي.`,
  ogTitle: `${fullName} — ${title}`,
  ogDescription:
    `مهندس واجهات أمامية أسلّم مشاريع فول ستاك وأبني أنظمة أعمال عربية تشتغل في الإنتاج — Nuxt & Vue وواجهات RTL منذ ${since}. اطّلع على أعمالي وتواصل معي.`,
  // اللقب الوظيفي المستخدم في structured data (Person schema) —
  // أدقّ من `title` المختصر المخصّص لعناوين الصفحات.
  jobTitle: 'Senior Frontend Engineer',
  // الحسابات الموثّقة — تُغذّي `sameAs` في Person schema (تقوية ربط الهوية في نتائج البحث).
  sameAs: [
    'https://github.com/beingmomen',
    'https://www.linkedin.com/in/beingmomen/'
  ],
  // مجالات الخبرة — تُغذّي `knowsAbout` في Person schema.
  knowsAbout: [
    'Vue.js',
    'Nuxt',
    'JavaScript',
    'Tailwind CSS',
    'Frontend Architecture',
    'RTL Web Interfaces',
    'Web Performance',
    'Server-Side Rendering'
  ]
} as const
