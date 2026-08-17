<template>
  <UPage dir="rtl">
    <AdrHero
      badge="Architecture Decision Record"
      title="نظام"
      highlight="الأوضاع"
      description="بنية تدعم وضعين (خاص وعام) تُحدد في وقت التشغيل — مع Keyed Remount للتبديل الآمن، وهيلبر useModeVariant لعزل الفروقات الحقيقية بس."
    />

    <UPageSection :ui="{ container: '!pt-0 pb-12 sm:pb-16' }">
      <div class="grid lg:grid-cols-[220px_1fr] gap-8">
        <!-- Table of Contents -->
        <div class="hidden lg:block">
          <AdrTableOfContents :sections="tocSections" />
        </div>

        <!-- Mobile TOC (collapsed) -->
        <details class="lg:hidden mb-6 rounded-xl border border-default/60 bg-elevated/30 p-4 group">
          <summary class="flex items-center justify-between cursor-pointer text-base font-semibold list-none">
            <span>الفهرس</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <nav class="mt-3 space-y-1 text-right">
            <a
              v-for="section in tocSections"
              :key="`m-${section.id}`"
              :href="`#${section.id}`"
              class="flex items-center justify-start gap-2 px-2 py-1.5 rounded-lg text-base text-muted hover:text-highlighted hover:bg-elevated/60 transition-colors"
            >
              <span class="size-1.5 rounded-full bg-muted/40 shrink-0" />
              {{ section.label }}
            </a>
          </nav>
        </details>

        <!-- Main Content -->
        <div class="min-w-0 space-y-0">
          <!-- Overview -->
          <AdrSection
            id="overview"
            title="نظرة عامة"
            icon="i-lucide-eye"
          >
            <div class="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div class="flex items-start gap-3">
                <div class="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-lucide-lightbulb"
                    class="size-5 text-primary"
                  />
                </div>
                <div>
                  <div class="text-base font-semibold mb-2">
                    المبدأ الأساسي
                  </div>
                  <p class="text-base text-muted leading-relaxed">
                    النظام بيخدم نوعين من الجهات — <strong class="text-highlighted">خاص</strong> و<strong class="text-highlighted">عام</strong> — بفورمات وحقول مختلفة. الـ mode بيتحدد <strong class="text-highlighted">runtime</strong> بعد تسجيل الدخول، وكل فرق حقيقي بين الوضعين بيتعزل في ملف "variant" نظيف بدل شروط متناثرة في الكود.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid sm:grid-cols-3 gap-3 mt-4">
              <div
                v-for="(principle, index) in principles"
                :key="principle.title"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
              >
                <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 text-right h-full">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      :name="principle.icon"
                      class="size-4 text-primary"
                    />
                    <span class="text-base font-semibold">{{ principle.title }}</span>
                  </div>
                  <div class="text-base text-muted">
                    {{ principle.description }}
                  </div>
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- Mode Resolution -->
          <AdrSection
            id="mode-resolution"
            title="حل الـ Mode — useMode"
            icon="i-lucide-scan"
            description="يقرأ الـ mode من بيانات الـ session ويوحّد الصيغة لقيمة واحدة"
          >
            <AdrDecisionTable
              title="قواعد التحويل"
              :headers="['المصدر', 'القيمة', 'النتيجة']"
              :rows="modeResolutionRules"
              icon="i-lucide-arrow-right-left"
            />
            <AdrCodeBlock
              title="useMode.js — الشكل العام"
              language="js"
              :code="useModeCode"
              class="mt-4"
            />
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mt-4">
              <p class="text-base text-muted leading-relaxed">
                لو شكل بيانات الـ session جه بصيغة مش متعارف عليها، النظام بيرجع لـ <code
                  class="font-mono text-primary"
                  dir="ltr"
                >public</code> كـ fallback آمن بدل ما يفشل، مع تحذير واضح في الكونسول يساعد في التشخيص السريع.
              </p>
            </div>
          </AdrSection>

          <!-- Keyed Remount -->
          <AdrSection
            id="keyed-remount"
            title="آلية التبديل — Keyed Remount"
            icon="i-lucide-refresh-cw"
            description="الـ mode ثابت طوال حياة شجرة المكونات — التبديل بينهم هدم وإعادة بناء كاملة، مش تحديث تفاعلي"
          >
            <AdrFlowDiagram :steps="remountSteps" />
            <AdrCodeBlock
              title="app.vue — الآلية"
              language="vue"
              :code="appVueCode"
              class="mt-4"
            />
            <div class="rounded-xl border border-warning/30 bg-warning/5 p-5 mt-4">
              <div class="text-base font-semibold mb-2 text-warning">
                القاعدة المعمارية
              </div>
              <p class="text-base text-muted leading-relaxed">
                اقرأ الـ mode في أي وقت، لكن <strong class="text-highlighted">لا تخزّن نسخة منه</strong> (أو من أي قيمة محسوبة منه) في مكان بيعيش برّه شجرة المكونات — أي نسخة زي كده بتنجو من عملية الهدم وبتفضل شايلة قيمة الوضع القديم بصمت.
              </p>
            </div>
          </AdrSection>

          <!-- useModeVariant -->
          <AdrSection
            id="mode-variant"
            title="الـ Helper الرسمي — useModeVariant"
            icon="i-lucide-shuffle"
            description="يختار الـ variant المناسب للوضع الحالي، مرة واحدة وقت بناء الـ composable"
          >
            <AdrCodeBlock
              title="useModeVariant.js"
              language="js"
              :code="useModeVariantCode"
            />
            <div class="space-y-4 mt-4">
              <AdrCodeBlock
                title="موديول فيه فروقات حقيقية — مثال: التوظيف (Employment)"
                language="js"
                :code="employmentSchemaCode"
              />
              <AdrCodeBlock
                title="موديول من غير فروقات — ملف عادي بالكامل"
                language="js"
                :code="noVariantCode"
              />
            </div>
          </AdrSection>

          <!-- Artifact Philosophy -->
          <AdrSection
            id="artifact-philosophy"
            title="فلسفة الدمج — مش قاعدة واحدة شاملة"
            icon="i-lucide-layout-grid"
            description="المبدأ الحاكم: هل الترتيب/التكوين الكامل جزء من العقد المرئي؟"
          >
            <AdrDecisionTable
              title="شكل كل Artifact"
              :headers="['الـ Artifact', 'الفلسفة', 'الشكل']"
              :rows="artifactPhilosophyRows"
            />
          </AdrSection>

          <!-- BaseModeShow -->
          <AdrSection
            id="mode-show"
            title="المكوّن الرسمي للفروقات الصغيرة — BaseModeShow"
            icon="i-lucide-eye-off"
            description="إظهار/إخفاء عنصر أو حقل واحد حسب الوضع، بدون فصل ملف كامل"
          >
            <AdrCodeBlock
              title="BaseModeShow — Usage"
              language="vue"
              :code="modeShowUsageCode"
            />
            <AdrDecisionTable
              title="سلّم الفروقات"
              :headers="['حجم الفرق', 'الأداة']"
              :rows="differenceScaleRows"
              icon="i-lucide-compass"
              class="mt-4"
            />
          </AdrSection>

          <!-- Middleware -->
          <AdrSection
            id="middleware"
            title="حماية الصفحات — Middleware"
            icon="i-lucide-shield"
            description="middleware عام بيحمي الصفحات المقيدة بوضع معين"
          >
            <AdrCodeBlock
              title="mode.global.js"
              language="js"
              :code="middlewareCode"
            />
            <AdrCodeBlock
              title="definePageMeta — أمثلة"
              language="js"
              :code="pageMetaExamples"
              class="mt-4"
            />
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mt-4">
              <p class="text-base text-muted leading-relaxed">
                الـ mode في الواجهة أداة عرض (UX) بس — الحماية دي بتنظّم التنقل، مش بديل عن أي تحقق أمني حقيقي على مستوى الـ backend.
              </p>
            </div>
          </AdrSection>

          <!-- Module Pattern -->
          <AdrSection
            id="module-pattern"
            title="نمط الموديول — مثال حقيقي (Employment)"
            icon="i-lucide-puzzle"
            description="موديول التوظيف فيه فروقات حقيقية بين الوضعين، فبيستخدم نمط الـ variant الكامل"
          >
            <AdrCodeBlock
              language="text"
              :code="moduleStructureCode"
            />
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mt-4">
              <p class="text-base text-muted leading-relaxed">
                موديولات تانية بلا فروقات حقيقية (زي المؤهلات) — ملفات عادية بلا أي variant، وكأن نظام الـ mode مش موجود خالص.
              </p>
            </div>
          </AdrSection>

          <!-- Design Decisions -->
          <AdrSection
            id="design-decisions"
            title="القرارات التصميمية"
            icon="i-lucide-scale"
            description="لماذا اخترنا هذا النمط وليس البدائل الأخرى"
          >
            <AdrDecisionTable
              title="البدائل التي درسناها"
              :headers="['البديل', 'المشكلة']"
              :rows="rejectedAlternatives"
              icon="i-lucide-x-circle"
            />
          </AdrSection>

          <!-- What Changed During Build -->
          <AdrSection
            id="what-changed"
            title="ما تغيّر أثناء البناء"
            icon="i-lucide-history"
            description="حاجتان اتبنوا بالكود فعلاً، واتراجعوا أثناء المراجعة الداخلية للبناء — قبل أي استخدام إنتاج حقيقي"
          >
            <AdrDecisionTable
              title="التغييرات"
              :headers="['التغيير', 'كان مصمَّم', 'اتضح في المراجعة', 'التعديل وليه']"
              :rows="whatChangedRows"
              icon="i-lucide-history"
            />
          </AdrSection>

          <!-- Related Files -->
          <AdrSection
            id="related-files"
            title="الملفات ذات الصلة"
            icon="i-lucide-folder-open"
          >
            <div class="space-y-4">
              <AdrFileReference
                title="Core Files"
                :files="coreFiles"
              />
              <AdrFileReference
                title="Module Example (Employment)"
                :files="moduleFiles"
              />
            </div>
          </AdrSection>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup>
definePageMeta({
  title: 'نظام الأوضاع'
})

useHead({
  title: 'نظام الأوضاع — Mode System',
  meta: [
    {
      name: 'description',
      content: 'قرار معماري: نظام بوضعين (خاص وعام) يُحدد runtime، مع Keyed Remount للتبديل الآمن وuseModeVariant لعزل الفروقات الحقيقية فقط.'
    }
  ]
})

useSeoMeta({
  ogTitle: 'نظام الأوضاع — Mode System',
  ogDescription: 'قرار معماري: نظام بوضعين يُحدد runtime، مع Keyed Remount وuseModeVariant.',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'نظام الأوضاع — Mode System',
  twitterDescription: 'نظام بوضعين يُحدد runtime، مع Keyed Remount وuseModeVariant.',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([
  { name: 'القرارات المعمارية', path: '/adr' },
  { name: 'نظام الأوضاع', path: '/adr/multi-mode-system' }
])

const config = useRuntimeConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': 'نظام الأوضاع — Mode System',
        'description': 'قرار معماري: نظام بوضعين (خاص وعام) يُحدد runtime، مع Keyed Remount للتبديل الآمن وuseModeVariant لعزل الفروقات الحقيقية فقط.',
        'url': `${config.public.siteUrl}/adr/multi-mode-system`,
        'inLanguage': 'ar',
        'author': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'url': config.public.siteUrl
        },
        'publisher': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'url': config.public.siteUrl
        }
      })
    }
  ]
})

const tocSections = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'mode-resolution', label: 'حل الـ Mode' },
  { id: 'keyed-remount', label: 'آلية التبديل' },
  { id: 'mode-variant', label: 'useModeVariant' },
  { id: 'artifact-philosophy', label: 'فلسفة الدمج' },
  { id: 'mode-show', label: 'BaseModeShow' },
  { id: 'middleware', label: 'حماية الصفحات' },
  { id: 'module-pattern', label: 'نمط الموديول' },
  { id: 'design-decisions', label: 'القرارات التصميمية' },
  { id: 'what-changed', label: 'ما تغيّر أثناء البناء' },
  { id: 'related-files', label: 'الملفات ذات الصلة' }
]

const principles = [
  {
    title: 'هوية الشجرة',
    description: 'الـ mode بيتحدد مرة واحدة، وأي تغيير فيه يعني إعادة بناء الشجرة من الصفر — مش تحديث تفاعلي.',
    icon: 'i-lucide-tree-pine'
  },
  {
    title: 'Lazy Creation',
    description: 'ملف الـ variant يتعمل بس لو فيه فرق فعلي — موديول من غير فروقات = ملفات عادية بالكامل.',
    icon: 'i-lucide-file-plus'
  },
  {
    title: 'أداة واحدة لكل حجم فرق',
    description: 'نص → مفتاح ترجمة. حقل واحد → BaseModeShow. هيكل مختلف → ملف variant مستقل.',
    icon: 'i-lucide-ruler'
  }
]

const modeResolutionRules = [
  ['privateCompanyMode', 'true', 'private'],
  ['privateCompanyMode', 'false', 'public'],
  ['mode', '1', 'private'],
  ['mode', '2', 'public'],
  ['شكل غير متعارف عليه', '—', 'public (مع تحذير)']
]

const useModeCode = `export const useMode = () => {
  const { data: session } = useAuth()

  const mode = computed(() => resolveMode(session.value))

  const isMode = (...modes) => modes.includes(mode.value)

  return { mode, isMode }
}`

const remountSteps = [
  {
    title: 'تغيّر الـ mode',
    description: 'مصدر التغيير (مثلاً: حفظ إعدادات) يحدّث بيانات الـ session',
    icon: 'i-lucide-git-commit-horizontal'
  },
  {
    title: 'المراقب المركزي',
    description: 'watch(mode) في app.vue بيلتقط التغيير',
    icon: 'i-lucide-radar'
  },
  {
    title: 'تنظيف وفحص',
    description: 'مسح الكاش القديم + التأكد إن الصفحة الحالية مسموحة في الوضع الجديد',
    icon: 'i-lucide-eraser'
  },
  {
    title: 'Remount كامل',
    description: 'الـ key بتاع NuxtLayout بيتغيّر → هدم وبناء الشجرة من الصفر',
    icon: 'i-lucide-refresh-cw'
  }
]

const appVueCode = '<' + `script setup>
const { mode } = useMode()
const route = useRoute()

watch(mode, async () => {
  clearNuxtData()
  const allowed = route.meta.modes
  if (allowed && !allowed.includes(mode.value)) {
    await navigateTo('/')
  }
})
  <` + `/script>

<template>
  <NuxtLayout :key="mode">
    <NuxtPage />
  </NuxtLayout>
</template>`

const useModeVariantCode = `export const useModeVariant = (variants) => {
  const { mode } = useMode()
  return variants[mode.value]?.() ?? {}
}`

const employmentSchemaCode = `export const useEmployeeEmploymentSchema = () => {
  const modeSpecific = useModeVariant({
    private: useEmployeeEmploymentSchemaPrivate,
    public: useEmployeeEmploymentSchemaPublic
  })

  const baseSchema = z.object({ /* الحقول المشتركة */ })

  const schema = computed(() =>
    modeSpecific.extension
      ? baseSchema.extend(modeSpecific.extension.shape)
      : baseSchema
  )

  return { schema }
}`

const noVariantCode = `export const useQualificationsSchema = () => {
  const schema = z.object({ /* ... */ })
  return { schema }
}`

const artifactPhilosophyRows = [
  ['Schema / Form State', 'base + extension', 'ملف الـ variant يصدّر الفرق (delta) بس — المشترك مُعرَّف مرة واحدة'],
  ['Columns', 'تعريف كامل لكل وضع', 'ترتيب الأعمدة عقد مرئي — كل variant بيعرّف الأعمدة كاملة'],
  ['Sidebar', 'تعريف كامل عند ظهور فرق', 'نفس منطق الـ Columns — الترتيب والتجميع مرئيين'],
  ['Components', 'فصل كامل بالملفات', 'هيكل مختلف يستحق ملفات مستقلة عبر componentsMap']
]

const modeShowUsageCode = `<!-- إظهار للوضع الخاص فقط -->
<BaseModeShow :modes="['private']">
  <BaseInput v-model="state.someField" label="حقل خاص بالوضع الخاص" />
</BaseModeShow>`

const differenceScaleRows = [
  ['نص فقط (عنوان، label)', 'مفتاح ترجمة بلاحقة الوضع'],
  ['حقل أو عنصر واحد', 'BaseModeShow'],
  ['هيكل مختلف بالكامل', 'ملف variant مستقل عبر componentsMap']
]

const middlewareCode = `export default defineNuxtRouteMiddleware((to) => {
  const allowedModes = to.meta?.modes
  if (!allowedModes || !Array.isArray(allowedModes) || allowedModes.length === 0) return
  const { isMode } = useMode()
  if (!isMode(...allowedModes)) return navigateTo('/')
})`

const pageMetaExamples = `// صفحة متاحة لكل الأوضاع
definePageMeta({ title: 'pages.qualifications' })

// صفحة خاصة بالوضع الخاص فقط
definePageMeta({ title: 'pages.employment', modes: ['private'] })`

const moduleStructureCode = `composables/modules/administration/employees/_employment/
├── schema/
│   ├── index.js                    ← الأوركسترا (useModeVariant)
│   ├── schema.private.js           ← extension الوضع الخاص
│   └── schema.public.js            ← extension الوضع العام
├── form/
│   ├── index.js
│   ├── form.private.js
│   └── form.public.js
└── lists/
    └── index.js                    ← مشترك، بدون فروقات`

const rejectedAlternatives = [
  ['Config-Driven (حقول كـ array)', 'يفقد مرونة الـ template — لا slots مخصصة، لا layouts معقدة، كل نوع حقل جديد يحتاج case جديد في الـ renderer'],
  ['Nuxt Layers (طبقة منفصلة لكل وضع)', 'الـ mode بييجي runtime من بيانات الـ session — Layers بتشتغل build-time بس، مش مناسبة للسيناريو ده']
]

const whatChangedRows = [
  [
    'من 3 أوضاع لوضعين',
    'نظام بتلات أوضاع منفصلة — خاص، حكومي، ومختلط — كل واحد بملفات ومنطق مستقل خاص بيه.',
    'الوضع "المختلط" ما كانش له تمايز فعلي كافي يستاهل مسار كامل مستقل، والفرق الحقيقي بين "الحكومي" وباقي الحالات كان بيتلخص عملياً في نفس منطق الوضع "العام".',
    'تقليص النظام لوضعين بس. تبسيط حقيقي في عدد المسارات المطلوب صيانتها، مش فقدان قدرة فعلية كانت مستخدَمة.'
  ],
  [
    'حذف ModeSwitch وfilterByMode',
    'مكوّن ModeSwitch (Dynamic component يختار الشكل المناسب حسب الوضع تلقائياً) ودالة filterByMode (تصفية عناصر قائمة حسب الوضع) — كأدوات مساعدة عامة.',
    'ModeSwitch كان بيكرر بالظبط نفس وظيفة نمط componentsMap المستخدَم أصلاً في كل أوركسترا. filterByMode طلعت dead code فعلياً — صفر استخدامات حقيقية في الكود وقت المراجعة.',
    'الاتنين اتشالوا بالكامل. ModeSwitch استُبدل بـ componentsMap مباشرة، وfilterByMode اتشالت من غير أي بديل — مكنش ليها استخدام حقيقي أصلاً.'
  ]
]

const coreFiles = [
  { path: 'composables/core/useMode.js', description: 'قراءة الـ mode من الـ session وتوحيد الصيغة' },
  { path: 'composables/core/useModeVariant.js', description: 'اختيار الـ variant المناسب للوضع الحالي' },
  { path: 'components/base/ModeShow.vue', description: 'إظهار/إخفاء شرطي للفروقات الصغيرة' },
  { path: 'middleware/mode.global.js', description: 'حماية الصفحات المقيدة بوضع معين' },
  { path: 'app.vue', description: 'الـ NuxtLayout key="mode" + المراقب المركزي' }
]

const moduleFiles = [
  { path: 'composables/modules/administration/employees/_employment/schema/index.js', description: 'الأوركسترا (useModeVariant)' },
  { path: 'composables/modules/administration/employees/_employment/schema/schema.private.js', description: 'Extension الوضع الخاص' },
  { path: 'composables/modules/administration/employees/_employment/schema/schema.public.js', description: 'Extension الوضع العام' },
  { path: 'composables/modules/administration/employees/_employment/form/index.js', description: 'الأوركسترا (useModeVariant)' },
  { path: 'composables/modules/administration/employees/_employment/lists/index.js', description: 'مشترك، بدون فروقات' }
]
</script>
