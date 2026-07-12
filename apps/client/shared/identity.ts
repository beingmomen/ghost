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
  availableLabel: 'متاح للفرص والمشاريع',
  unavailableLabel: 'غير متاح حالياً',
  // وصف الهيرو (المسودّة المعتمدة).
  description: `${title} أبني واجهات ويب نظيفة وسريعة وأنظمة تصميم متّسقة — أطوّر للويب منذ ${since}.`,
  // وصف SEO الهوم (≤160) — صادق ومحايد.
  seoDescription: `${title} أبني واجهات ويب نظيفة وسريعة وأنظمة تصميم متّسقة منذ ${since}. اطّلع على أعمالي وتواصل معي مباشرة.`,
  ogTitle: `${fullName} — ${title}`,
  ogDescription:
    'واجهات نظيفة وأداء سريع وأنظمة تصميم متّسقة — اطّلع على أعمالي وتواصل معي.'
} as const
