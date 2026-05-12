<template>
  <UPage dir="rtl">
    <AdrHero
      badge="Architecture Decision Record"
      title="نظام الأوضاع"
      highlight="المتعددة"
      description="بنية تدعم أوضاع تشغيل متعددة (خاص، حكومي، مختلط) تُحدد في وقت التشغيل — مع فصل كامل بالملفات بدون أي شروط في الكود."
    />

    <UPageSection :ui="{ container: '!pt-0 pb-12 sm:pb-16' }">
      <div class="grid lg:grid-cols-[220px_1fr] gap-8">
        <!-- Table of Contents -->
        <div class="hidden lg:block">
          <AdrTableOfContents :sections="tocSections" />
        </div>

        <!-- Main Content -->
        <div class="min-w-0 space-y-0">
          <!-- Overview -->
          <AdrSection
            id="overview"
            title="نظرة عامة"
            icon="i-lucide-eye"
          >
            <div class="rounded-xl border border-primary/30 bg-primary/5 p-5 mb-4">
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
                    فصل كامل — كل ملف نظيف 100% بدون شروط. الـ mode logic موجود في <strong class="text-highlighted">4 أماكن فقط</strong> في النظام بأكمله.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid sm:grid-cols-3 gap-3">
              <div
                v-for="(impact, index) in impacts"
                :key="impact.title"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
              >
                <div class="rounded-xl border border-default/60 bg-elevated/30 p-4 hover:bg-elevated/60 transition-colors duration-300 h-full">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      :name="impact.icon"
                      class="size-4 text-primary"
                    />
                    <span class="text-base font-semibold">{{ impact.title }}</span>
                  </div>
                  <p class="text-base text-muted">
                    {{ impact.description }}
                  </p>
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- Mode Detection -->
          <AdrSection
            id="mode-detection"
            title="كشف النظام — useMode.js"
            icon="i-lucide-scan"
            description="يقرأ الـ mode من session data ويوحد الصيغة"
          >
            <AdrDecisionTable
              title="قواعد التحويل"
              :headers="['المصدر', 'القيمة', 'النتيجة']"
              :rows="modeDetectionRules"
              icon="i-lucide-arrow-right-left"
            />
            <AdrCodeBlock
              title="useMode.js — Implementation"
              language="js"
              :code="useModeCode"
              class="mt-4"
            />
          </AdrSection>

          <!-- API Reference -->
          <AdrSection
            id="api-reference"
            title="مرجع الـ API"
            icon="i-lucide-book-open"
            description="الدوال والثوابت التي يصدّرها useMode"
          >
            <div class="grid sm:grid-cols-1 gap-4">
              <AdrApiCard
                v-for="api in apiReference"
                :key="api.name"
                v-bind="api"
              />
            </div>
          </AdrSection>

          <!-- Components -->
          <AdrSection
            id="components"
            title="المكوّنات"
            icon="i-lucide-component"
            description="مكوّنات Vue للتعامل مع الأوضاع المتعددة"
          >
            <div class="space-y-4">
              <div class="rounded-xl border border-default/60 bg-elevated/30 p-5">
                <div class="flex items-center gap-2 mb-3">
                  <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <UIcon
                      name="i-lucide-repeat"
                      class="size-4 text-primary"
                    />
                  </div>
                  <div>
                    <span class="text-base font-semibold">BaseModeSwitch</span>
                    <UBadge
                      label="Dynamic Component"
                      color="neutral"
                      variant="subtle"
                      size="xs"
                      class="ms-2"
                    />
                  </div>
                </div>
                <p class="text-base text-muted leading-relaxed mb-3">
                  يستقبل map من المكوّنات ويرسم الصحيح تلقائياً حسب الـ mode. يمرر <code
                    class="font-mono text-primary"
                    dir="ltr"
                  >$attrs</code> و <code
                    class="font-mono text-primary"
                    dir="ltr"
                  >$slots</code> للمكوّن المختار.
                </p>
                <AdrCodeBlock
                  title="Usage"
                  language="vue"
                  :code="modeSwitchUsageCode"
                />
              </div>

              <div class="rounded-xl border border-default/60 bg-elevated/30 p-5">
                <div class="flex items-center gap-2 mb-3">
                  <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <UIcon
                      name="i-lucide-eye"
                      class="size-4 text-primary"
                    />
                  </div>
                  <div>
                    <span class="text-base font-semibold">BaseModeShow</span>
                    <UBadge
                      label="Conditional Render"
                      color="neutral"
                      variant="subtle"
                      size="xs"
                      class="ms-2"
                    />
                  </div>
                </div>
                <p class="text-base text-muted leading-relaxed mb-3">
                  للحالات البسيطة — إظهار/إخفاء محتوى حسب الـ mode. يُستخدم خارج الفورمات فقط.
                </p>
                <AdrCodeBlock
                  title="Usage"
                  language="vue"
                  :code="modeShowUsageCode"
                />
              </div>
            </div>
          </AdrSection>

          <!-- Middleware -->
          <AdrSection
            id="middleware"
            title="حماية الصفحات — Middleware"
            icon="i-lucide-shield"
            description="middleware عام يحمي الصفحات المقيدة بنظام معين"
          >
            <div class="grid sm:grid-cols-2 gap-4 mb-4">
              <div
                v-for="(rule, index) in middlewareRules"
                :key="rule.title"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
              >
                <div
                  class="rounded-xl border p-4 transition-colors duration-300"
                  :class="rule.style"
                >
                  <div
                    class="text-base font-semibold mb-1"
                    :class="rule.textStyle"
                  >
                    {{ rule.title }}
                  </div>
                  <p class="text-base text-muted">
                    {{ rule.description }}
                  </p>
                </div>
              </div>
            </div>
            <AdrCodeBlock
              title="definePageMeta — أمثلة"
              language="js"
              :code="pageMetaExamples"
            />
          </AdrSection>

          <!-- Sidebar Filtering -->
          <AdrSection
            id="sidebar-filtering"
            title="تصفية الـ Sidebar"
            icon="i-lucide-sidebar"
            description="إضافة خاصية modes اختيارية لعناصر الـ sidebar"
          >
            <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 mb-4">
              <p class="text-base text-muted leading-relaxed">
                <strong class="text-highlighted">القاعدة:</strong> عنصر بدون <code
                  class="font-mono text-primary"
                  dir="ltr"
                >modes</code> = يظهر في كل الأنظمة. عنصر مع <code
                  class="font-mono text-primary"
                  dir="ltr"
                >modes</code> = يظهر فقط في الأنظمة المحددة.
              </p>
            </div>
            <AdrCodeBlock
              title="filterByMode — Sidebar Usage"
              language="js"
              :code="sidebarCode"
            />
          </AdrSection>

          <!-- Module Pattern -->
          <AdrSection
            id="module-pattern"
            title="نمط الموديول — الفصل الكامل"
            icon="i-lucide-puzzle"
            description="للموديولات التي تختلف بين الأنظمة: ملف منفصل لكل نظام"
          >
            <div class="grid sm:grid-cols-1 gap-4 mb-4">
              <div class="animate-fade-in animation-delay-100">
                <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 h-full">
                  <div class="flex items-center gap-2 mb-3">
                    <UBadge
                      label="موديول مختلف"
                      color="primary"
                      variant="soft"
                      size="xs"
                    />
                  </div>
                  <AdrCodeBlock
                    language="text"
                    :code="moduleStructureDifferent"
                  />
                </div>
              </div>
              <div class="animate-fade-in animation-delay-200">
                <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 h-full">
                  <div class="flex items-center gap-2 mb-3">
                    <UBadge
                      label="موديول مشترك"
                      color="success"
                      variant="soft"
                      size="xs"
                    />
                  </div>
                  <AdrCodeBlock
                    language="text"
                    :code="moduleStructureShared"
                  />
                </div>
              </div>
            </div>

            <AdrDecisionTable
              title="Naming Conventions"
              :headers="['النوع', 'المشترك', 'الخاص بنظام']"
              :rows="namingConventions"
              icon="i-lucide-tag"
            />
          </AdrSection>

          <!-- Orchestrator Pattern -->
          <AdrSection
            id="orchestrator"
            title="نمط الأوركسترا — index.js"
            icon="i-lucide-music"
            description="المكان الوحيد في الموديول فيه mode logic — يستخدم map بسيط لاختيار الملفات الصحيحة"
          >
            <AdrCodeBlock
              title="Orchestrator — index.js"
              language="js"
              :code="orchestratorCode"
            />
          </AdrSection>

          <!-- Where Mode Logic Exists -->
          <AdrSection
            id="mode-logic-locations"
            title="أين يوجد Mode Logic؟"
            icon="i-lucide-map-pin"
            description="في النظام بأكمله، الـ mode logic موجود في 4 أماكن فقط"
          >
            <div class="grid sm:grid-cols-2 gap-4">
              <div
                v-for="(location, index) in modeLocations"
                :key="location.file"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
              >
                <div class="rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors duration-300">
                  <div class="flex items-center gap-2 mb-2">
                    <UBadge
                      :label="`${index + 1}`"
                      color="primary"
                      variant="subtle"
                      size="xs"
                    />
                    <code
                      class="text-xs font-mono text-primary"
                      dir="ltr"
                    >{{ location.file }}</code>
                  </div>
                  <p class="text-base text-muted">
                    {{ location.purpose }}
                  </p>
                </div>
              </div>
            </div>
            <div class="rounded-lg border border-success/30 bg-success/5 p-4 mt-4">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-circle-check"
                  class="size-4 text-success"
                />
                <span class="text-base font-semibold text-success">كل ملف آخر (schema, form, component, table, columns, service) = كود نظيف 100% بدون أي شرط.</span>
              </div>
            </div>
          </AdrSection>

          <!-- Adding a New Mode -->
          <AdrSection
            id="adding-new-mode"
            title="إضافة نظام جديد"
            icon="i-lucide-plus-circle"
            description="خطوات إضافة نظام mixed (mode: 3) — بدون إعادة هيكلة أو تعديل ملفات الأنظمة الموجودة"
          >
            <div class="space-y-0">
              <div
                v-for="(step, index) in addModeSteps"
                :key="step.title"
              >
                <div
                  class="animate-fade-in"
                  :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
                >
                  <div class="rounded-xl border border-default/60 bg-elevated/30 p-4 hover:bg-elevated/60 transition-colors duration-300">
                    <div class="flex items-center gap-3 mb-2">
                      <UBadge
                        :label="`${index + 1}`"
                        color="primary"
                        variant="soft"
                        size="sm"
                      />
                      <span class="text-base font-semibold">{{ step.title }}</span>
                    </div>
                    <p class="text-base text-muted leading-relaxed">
                      {{ step.description }}
                    </p>
                    <AdrCodeBlock
                      v-if="step.code"
                      :language="step.language || 'js'"
                      :code="step.code"
                      class="mt-3"
                    />
                  </div>
                </div>
                <div
                  v-if="index < addModeSteps.length - 1"
                  class="flex justify-center py-1"
                >
                  <UIcon
                    name="i-lucide-arrow-down"
                    class="size-4 text-primary/30"
                  />
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- Design Decisions -->
          <AdrSection
            id="design-decisions"
            title="القرارات التصميمية"
            icon="i-lucide-scale"
            description="لماذا اخترنا الفصل بالملفات وليس البدائل الأخرى"
          >
            <div class="space-y-4">
              <AdrDecisionTable
                title="لماذا الفصل الكامل وليس شروط في template؟"
                :headers="['المعيار', 'ModeShow / شروط', 'فصل بالملفات']"
                :rows="separationComparison"
              />

              <AdrDecisionTable
                title="التكرار الوحيد = HTML الـ template"
                :headers="['ما يتكرر', 'خطورته']"
                :rows="duplicationAnalysis"
                icon="i-lucide-copy"
              />

              <AdrDecisionTable
                title="لماذا ليس Config-Driven أو Nuxt Layers؟"
                :headers="['البديل', 'المشكلة']"
                :rows="alternativesComparison"
                icon="i-lucide-x-circle"
              />
            </div>
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
                title="Module Example (Signatures)"
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
  title: 'نظام الأوضاع المتعددة'
})

useHead({
  title: 'نظام الأوضاع المتعددة — Multi-Mode Architecture',
  meta: [
    {
      name: 'description',
      content: 'قرار معماري: بنية أوضاع تشغيل متعددة تُحدد runtime مع فصل كامل بالملفات — بدون شروط في الكود.'
    }
  ]
})

useSeoMeta({
  ogTitle: 'نظام الأوضاع المتعددة — Multi-Mode Architecture',
  ogDescription: 'بنية أوضاع تشغيل متعددة تُحدد runtime مع فصل كامل بالملفات.',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'نظام الأوضاع المتعددة',
  twitterDescription: 'بنية أوضاع تشغيل متعددة مع فصل كامل بالملفات.',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([
  { name: 'القرارات المعمارية', path: '/adr' },
  { name: 'نظام الأوضاع المتعددة', path: '/adr/multi-mode-system' }
])

const tocSections = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'mode-detection', label: 'كشف النظام' },
  { id: 'api-reference', label: 'مرجع الـ API' },
  { id: 'components', label: 'المكوّنات' },
  { id: 'middleware', label: 'حماية الصفحات' },
  { id: 'sidebar-filtering', label: 'تصفية الـ Sidebar' },
  { id: 'module-pattern', label: 'نمط الموديول' },
  { id: 'orchestrator', label: 'نمط الأوركسترا' },
  { id: 'mode-logic-locations', label: 'أين يوجد Mode Logic؟' },
  { id: 'adding-new-mode', label: 'إضافة نظام جديد' },
  { id: 'design-decisions', label: 'القرارات التصميمية' },
  { id: 'related-files', label: 'الملفات ذات الصلة' }
]

const impacts = [
  {
    title: 'الصفحات المتاحة',
    description: 'بعض الصفحات خاصة بنظام معين — يحميها middleware تلقائياً',
    icon: 'i-lucide-file-lock'
  },
  {
    title: 'عناصر الـ Sidebar',
    description: 'تظهر أو تختفي حسب النظام عبر filterByMode',
    icon: 'i-lucide-sidebar'
  },
  {
    title: 'محتوى الصفحات',
    description: 'نفس الصفحة بحقول/سكيمة/state مختلف لكل نظام',
    icon: 'i-lucide-layout-template'
  }
]

const modeDetectionRules = [
  ['privateCompanyMode', 'true', 'private'],
  ['privateCompanyMode', 'false', 'government'],
  ['mode', '1', 'private'],
  ['mode', '2', 'government'],
  ['mode', '3', 'mixed'],
  ['fallback', '—', 'private']
]

const useModeCode = `export const MODES = {
  PRIVATE: 'private',
  GOVERNMENT: 'government',
  MIXED: 'mixed'
}

export const useMode = () => {
  const { data: session } = useAuth()

  const mode = computed(() => {
    const raw = session.value
    if (raw?.mode !== undefined) {
      return {
        1: MODES.PRIVATE,
        2: MODES.GOVERNMENT,
        3: MODES.MIXED
      }[raw.mode] || MODES.PRIVATE
    }
    if (raw?.privateCompanyMode !== undefined) {
      return raw.privateCompanyMode
        ? MODES.PRIVATE : MODES.GOVERNMENT
    }
    return MODES.PRIVATE
  })

  const isMode = (...modes) => modes.includes(mode.value)

  const filterByMode = (items) => items.filter(item => {
    if (!item.modes || item.modes.length === 0) return true
    return item.modes.includes(mode.value)
  })

  return { mode, isMode, filterByMode, MODES }
}`

const apiReference = [
  {
    name: 'MODES',
    type: 'Object',
    description: 'ثوابت أسماء الأنظمة — PRIVATE, GOVERNMENT, MIXED.',
    example: `import { MODES } from '~/composables/core/useMode'

MODES.PRIVATE     // 'private'
MODES.GOVERNMENT  // 'government'
MODES.MIXED       // 'mixed'`
  },
  {
    name: 'mode',
    type: 'ComputedRef',
    description: 'الـ mode الحالي كـ string — يتحدث تلقائياً عند تغيير session.',
    example: `const { mode } = useMode()
console.log(mode.value)
// 'private' | 'government' | 'mixed'`
  },
  {
    name: 'isMode(...modes)',
    type: 'Function',
    description: 'يتحقق هل النظام الحالي ضمن القائمة المحددة — يقبل عدة أنظمة.',
    example: `const { isMode } = useMode()

isMode('private')              // true لو خاص
isMode('private', 'mixed')     // true لو خاص أو مختلط
isMode('government')           // true لو حكومي`
  },
  {
    name: 'filterByMode(items)',
    type: 'Function',
    description: 'يصفي array من العناصر حسب خاصية modes الاختيارية — عنصر بدون modes يظهر دائماً.',
    example: `const { filterByMode } = useMode()

const items = [
  { label: 'Dashboard' },
  { label: 'Invoices', modes: ['private'] },
  { label: 'Tenders', modes: ['government'] },
]

filterByMode(items)
// → العناصر المناسبة للنظام الحالي`
  }
]

const modeSwitchUsageCode = '<' + `script setup>
import FormPrivate from '~/components/.../FormPrivate.vue'
import FormGovernment from '~/components/.../FormGovernment.vue'

const formComponents = {
  private: FormPrivate,
  government: FormGovernment
}
  <` + `/script>

<template>
  <BaseModeSwitch :is="formComponents" />
</template>`

const modeShowUsageCode = `<!-- إظهار للنظام الخاص فقط -->
<BaseModeShow :modes="['private']">
  <div>محتوى خاص بالنظام الخاص</div>
</BaseModeShow>

<!-- إظهار للجميع ما عدا الحكومي -->
<BaseModeShow :except="['government']">
  <div>يظهر لكل الأنظمة إلا الحكومي</div>
</BaseModeShow>`

const middlewareRules = [
  {
    title: 'صفحة بدون modes',
    description: 'مسموحة لكل الأنظمة — لا حاجة لتحديد modes',
    style: 'border-success/30 bg-success/5',
    textStyle: 'text-success'
  },
  {
    title: 'صفحة مع modes',
    description: 'مسموحة فقط للأنظمة المحددة — باقي الأنظمة يتم تحويلها لـ /',
    style: 'border-warning/30 bg-warning/5',
    textStyle: 'text-warning'
  }
]

const pageMetaExamples = `// صفحة متاحة لكل الأنظمة
definePageMeta({
  title: 'pages.activities'
})

// صفحة خاصة بالنظام الخاص فقط
definePageMeta({
  title: 'pages.invoices',
  modes: ['private']
})

// صفحة متاحة للخاص والمختلط
definePageMeta({
  title: 'pages.tax',
  modes: ['private', 'mixed']
})`

const sidebarCode = `export const useSidebar = () => {
  const { filterByMode } = useMode()

  const filterLinks = (items) => {
    return filterByMode(items).map(item => {
      if (item.children)
        return { ...item, children: filterByMode(item.children) }
      return item
    }).filter(item => !(item.children?.length === 0))
  }

  const rawLinks = computed(() => [
    {
      label: t('sidebar.dashboard'),
      icon: 'i-lucide-house',
      to: localePath('/')
      // بدون modes → يظهر دائماً
    },
    {
      label: t('sidebar.invoices'),
      icon: 'i-lucide-file-text',
      to: localePath('/invoices'),
      modes: ['private']  // ← خاص فقط
    },
    // ...
  ])

  const links = computed(() => [filterLinks(rawLinks.value), []])
  return { links }
}`

const moduleStructureDifferent = `composables/modules/settings/signatures/
├── index.js              ← الأوركسترا
├── schema.private.js     ← سكيمة نظيفة
├── schema.government.js  ← سكيمة نظيفة
├── form.private.js       ← state نظيف
├── form.government.js    ← state نظيف
├── table.js              ← مشترك
└── columns.js            ← مشترك

components/modules/settings/signatures/
├── SignaturesFormPrivate.vue
├── SignaturesFormGovernment.vue
└── SignaturesTable.vue`

const moduleStructureShared = `composables/modules/settings/activities/
├── index.js
├── schema.js       ← ملف واحد
├── form.js         ← ملف واحد
├── table.js
└── columns.js

components/modules/settings/activities/
├── ActivitiesForm.vue   ← ملف واحد
└── ActivitiesTable.vue`

const namingConventions = [
  ['Schema composable', 'schema.js', 'schema.private.js / schema.government.js'],
  ['Form composable', 'form.js', 'form.private.js / form.government.js'],
  ['Columns composable', 'columns.js', 'columns.private.js / columns.government.js'],
  ['Vue Component', 'SignaturesForm.vue', 'SignaturesFormPrivate.vue / SignaturesFormGovernment.vue'],
  ['Export function', 'useSignaturesSchema()', 'useSignaturesSchemaPrivate() / ...Government()']
]

const orchestratorCode = `export const useSignatures = () => {
  const { mode } = useMode()

  // ← الشرط الوحيد: اختيار النسخة الصحيحة
  const schemaMap = {
    private: useSignaturesSchemaPrivate,
    government: useSignaturesSchemaGovernment
  }
  const formMap = {
    private: useSignaturesFormPrivate,
    government: useSignaturesFormGovernment
  }

  const { schema } = schemaMap[mode.value]()
  const form = formMap[mode.value]()

  // ← مشترك — بدون أي شرط
  const table = useSignaturesTable()
  const { createColumns } = useSignaturesColumns()

  const editHandler = (item) => {
    form.state.id = item.id
  }

  const columns = createColumns({ onEdit: editHandler })

  const resetState = () => form.resetForm()

  const submitHandler = async () => {
    table.loadingSave.value = true
    try {
      const body = form.prepareSubmitData()
      await table.updateSignature(form.state.id, body)
      form.resetForm()
    } catch {
      // handled by base service
    } finally {
      table.loadingSave.value = false
    }
  }

  return {
    schema, state: form.state,
    reportsList: form.reportsList,
    items: table.items,
    loadingSave: table.loadingSave,
    columns, resetState, submitHandler
  }
}`

const modeLocations = [
  { file: 'composables/core/useMode.js', purpose: 'قراءة الـ mode من session وتوحيد الصيغة' },
  { file: 'middleware/mode.global.js', purpose: 'حماية الصفحات المقيدة بنظام معين' },
  { file: 'composables/layout/useSidebar.js', purpose: 'تصفية عناصر الـ sidebar حسب النظام' },
  { file: 'composables/modules/*/index.js', purpose: 'اختيار schema/form/component الصحيح (الأوركسترا)' }
]

const addModeSteps = [
  {
    title: 'تحديث useMode.js',
    description: 'إضافة النظام الجديد للثوابت وقاعدة التحويل.',
    code: `export const MODES = {
  PRIVATE: 'private',
  GOVERNMENT: 'government',
  MIXED: 'mixed'  // ← جديد
}

// في computed:
{ 1: MODES.PRIVATE, 2: MODES.GOVERNMENT, 3: MODES.MIXED }`
  },
  {
    title: 'إنشاء ملفات النظام الجديد',
    description: 'لكل موديول مختلف — schema, form, component.',
    code: `schema.mixed.js
form.mixed.js
SignaturesFormMixed.vue`,
    language: 'text'
  },
  {
    title: 'تحديث الأوركسترا',
    description: 'إضافة النظام الجديد في الـ map.',
    code: `const schemaMap = {
  private: useSignaturesSchemaPrivate,
  government: useSignaturesSchemaGovernment,
  mixed: useSignaturesSchemaMixed  // ← جديد
}`
  },
  {
    title: 'تحديث الصفحة',
    description: 'إضافة المكوّن الجديد في formComponents.',
    code: `const formComponents = {
  private: FormPrivate,
  government: FormGovernment,
  mixed: FormMixed  // ← جديد
}`
  },
  {
    title: 'تحديث Sidebar',
    description: 'إضافة عناصر جديدة مع modes: [\'mixed\'].',
    code: `{
  label: t('sidebar.mixedReport'),
  to: localePath('/mixed-report'),
  modes: ['mixed']  // ← جديد
}`
  },
  {
    title: 'تحديث Page Meta',
    description: 'حماية الصفحات المقيدة بالنظام الجديد.',
    code: `definePageMeta({
  title: 'pages.mixedReport',
  modes: ['mixed']  // ← حماية بالـ middleware
})`
  }
]

const separationComparison = [
  ['مع مئات الحقول', 'مئات الشروط في template', 'كل ملف نظيف 100%'],
  ['مع 3+ أنظمة', 'تعقيد أسّي', 'ملف جديد فقط'],
  ['فهم نظام واحد', 'فلترة ذهنية لكل سطر', 'فتح ملف واحد = كل شيء'],
  ['إضافة نظام جديد', 'تعديل ملفات موجودة', 'إضافة ملفات فقط']
]

const duplicationAnalysis = [
  ['HTML الحقول في template', 'منخفضة — تصريحي وليس لوجك'],
  ['Labels', 'صفر — من i18n (ملف واحد مشترك)'],
  ['سلوك الحقول', 'صفر — في Base Components'],
  ['Schema', 'صفر — ملف مستقل لكل نظام'],
  ['Form state', 'صفر — ملف مستقل لكل نظام'],
  ['Services/API', 'صفر — مشترك دائماً'],
  ['Save/Submit', 'صفر — مشترك في الأوركسترا']
]

const alternativesComparison = [
  ['Config-Driven (حقول كـ array)', 'يفقد مرونة الـ template — لا slots مخصصة، لا layouts معقدة، كل نوع حقل جديد يحتاج case'],
  ['Nuxt Layers (طبقة لكل نظام)', 'الـ mode يأتي runtime من API بعد تسجيل الدخول — Layers تعمل build-time فقط']
]

const coreFiles = [
  { path: 'composables/core/useMode.js', description: 'قراءة الـ mode من session' },
  { path: 'composables/core/useGlobal.js', description: 'يصدّر mode و isMode من useMode' },
  { path: 'components/base/ModeSwitch.vue', description: 'Dynamic component حسب الـ mode' },
  { path: 'components/base/ModeShow.vue', description: 'Conditional render حسب الـ mode' },
  { path: 'middleware/mode.global.js', description: 'حماية الصفحات المقيدة' },
  { path: 'composables/layout/useSidebar.js', description: 'تصفية عناصر الـ sidebar' }
]

const moduleFiles = [
  { path: 'composables/modules/settings/signatures/index.js', description: 'الأوركسترا' },
  { path: 'composables/modules/settings/signatures/schema.private.js', description: 'سكيمة النظام الخاص' },
  { path: 'composables/modules/settings/signatures/schema.government.js', description: 'سكيمة النظام الحكومي' },
  { path: 'composables/modules/settings/signatures/form.private.js', description: 'State النظام الخاص' },
  { path: 'composables/modules/settings/signatures/form.government.js', description: 'State النظام الحكومي' },
  { path: 'composables/modules/settings/signatures/table.js', description: 'مشترك' },
  { path: 'composables/modules/settings/signatures/columns.js', description: 'مشترك' }
]
</script>
