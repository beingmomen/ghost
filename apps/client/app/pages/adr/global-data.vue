<template>
  <UPage dir="rtl">
    <AdrHero
      badge="Architecture Decision Record"
      title="إدارة البيانات"
      highlight="العامة"
      description="نمط composable مركزي يوفر وصولاً موحداً لبيانات الجلسة في أي مكان بالتطبيق — بدون نسخ البيانات أو مزامنة يدوية."
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
                    <code
                      class="font-mono text-primary"
                      dir="ltr"
                    >useGlobal</code>
                    يقرأ مباشرة من
                    <code
                      class="font-mono text-primary"
                      dir="ltr"
                    >useAuth().data</code>
                    عبر
                    <code
                      class="font-mono text-primary"
                      dir="ltr"
                    >computed</code>
                    — بدون نسخ البيانات أو sync يدوي. لو البيانات موجودة أصلاً في مصدر reactive — لا تنسخها.
                  </p>
                  <div class="mt-3">
                    <UBadge
                      label="composables/core/useGlobal.js"
                      color="neutral"
                      variant="subtle"
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- Architecture Flow -->
          <AdrSection
            id="architecture"
            title="مسار تدفق البيانات"
            icon="i-lucide-workflow"
            description="كيف تنتقل البيانات من تسجيل الدخول إلى أي مكان في التطبيق"
          >
            <AdrFlowDiagram :steps="architectureSteps" />
          </AdrSection>

          <!-- Session Data Structure -->
          <AdrSection
            id="session-data"
            title="هيكل بيانات الجلسة"
            icon="i-lucide-braces"
            description="البيانات التي يرجعها الـ API بعد تسجيل الدخول"
          >
            <AdrCodeBlock
              title="Session Data Structure"
              language="JSON"
              :code="sessionDataCode"
            />
            <div class="grid sm:grid-cols-3 gap-3 mt-4">
              <div
                v-for="(step, index) in sessionSteps"
                :key="step.num"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
              >
                <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 text-right">
                  <UBadge
                    :label="`${step.num}`"
                    color="primary"
                    variant="subtle"
                    size="xs"
                    class="mb-2"
                  />
                  <div class="text-base text-muted">
                    {{ step.text }}
                  </div>
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- API Reference -->
          <AdrSection
            id="api-reference"
            title="مرجع الـ API"
            icon="i-lucide-book-open"
            description="كل الخصائص والدوال التي يصدّرها useGlobal"
          >
            <AdrCodeBlock
              title="استيراد واستخدام"
              language="js"
              :code="`const { user, lists, employees, findInList, refreshGlobal, session } = useGlobal()`"
            />
            <div class="grid sm:grid-cols-1 gap-4 mt-4">
              <AdrApiCard
                v-for="api in apiReference"
                :key="api.name"
                v-bind="api"
              />
            </div>
          </AdrSection>

          <!-- Usage Examples -->
          <AdrSection
            id="usage-examples"
            title="أمثلة الاستخدام"
            icon="i-lucide-code-2"
            description="كيف يُستخدم useGlobal في أماكن مختلفة من التطبيق"
          >
            <div class="space-y-4">
              <AdrCodeBlock
                v-for="example in usageExamples"
                :key="example.title"
                :title="example.title"
                :language="example.language"
                :code="example.code"
              />
            </div>
          </AdrSection>

          <!-- How It Works -->
          <AdrSection
            id="how-it-works"
            title="الآلية الداخلية"
            icon="i-lucide-cpu"
            description="كيف يعمل useGlobal من الداخل"
          >
            <AdrCodeBlock
              title="Implementation"
              language="js"
              :code="implementationCode"
            />
            <div class="rounded-xl border border-primary/30 bg-primary/5 p-5 mt-4">
              <div class="text-base font-semibold mb-2">
                لماذا computed وليس نسخ؟
              </div>
              <div
                class="flex items-center gap-2 text-base text-muted font-mono"
                dir="ltr"
                style="direction: ltr;"
              >
                useAuth().data ──computed──→ useGlobal ──read──→ أي مكان
              </div>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="point in computedPoints"
                  :key="point"
                  class="text-base text-muted flex gap-2 items-start"
                >
                  <UIcon
                    name="i-lucide-circle-check"
                    class="size-3.5 text-primary/50 mt-0.5 shrink-0"
                  />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </AdrSection>

          <!-- Refresh Cycle -->
          <AdrSection
            id="refresh-cycle"
            title="دورة تحديث البيانات"
            icon="i-lucide-refresh-cw"
            description="كيف تتحدث البيانات بعد إضافة عنصر جديد"
          >
            <AdrFlowDiagram :steps="refreshSteps" />
          </AdrSection>

          <!-- Design Decisions -->
          <AdrSection
            id="design-decisions"
            title="القرارات التصميمية"
            icon="i-lucide-scale"
            description="لماذا اخترنا هذا النمط وليس البدائل الأخرى"
          >
            <div class="space-y-4">
              <AdrDecisionTable
                title="لماذا ليس Pinia أو useState؟"
                :headers="['المعيار', 'Pinia / useState', 'useGlobal (computed)']"
                :rows="piniaComparison"
              />
              <AdrDecisionTable
                title="لماذا ليس provide/inject؟"
                :headers="['الجانب', 'provide/inject', 'useGlobal']"
                :rows="provideComparison"
              />
              <AdrDecisionTable
                title="متى تستخدم كل حل؟"
                :headers="['الحالة', 'الحل المناسب']"
                :rows="whenToUse"
                icon="i-lucide-compass"
              />
            </div>
          </AdrSection>

          <!-- Related Files -->
          <AdrSection
            id="related-files"
            title="الملفات ذات الصلة"
            icon="i-lucide-folder-open"
          >
            <AdrFileReference :files="relatedFiles" />
          </AdrSection>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup>
definePageMeta({
  title: 'إدارة البيانات العامة'
})

useHead({
  title: 'إدارة البيانات العامة — useGlobal Composable',
  meta: [
    {
      name: 'description',
      content: 'قرار معماري: نمط composable مركزي يوفر وصولاً موحداً لبيانات الجلسة عبر computed — بدون نسخ أو مزامنة يدوية.'
    }
  ]
})

useSeoMeta({
  ogTitle: 'إدارة البيانات العامة — useGlobal Composable',
  ogDescription: 'قرار معماري: نمط composable مركزي يوفر وصولاً موحداً لبيانات الجلسة.',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'إدارة البيانات العامة — useGlobal',
  twitterDescription: 'نمط composable مركزي للوصول الموحد لبيانات الجلسة.',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([
  { name: 'القرارات المعمارية', path: '/adr' },
  { name: 'إدارة البيانات العامة', path: '/adr/global-data' }
])

const tocSections = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'architecture', label: 'مسار تدفق البيانات' },
  { id: 'session-data', label: 'هيكل بيانات الجلسة' },
  { id: 'api-reference', label: 'مرجع الـ API' },
  { id: 'usage-examples', label: 'أمثلة الاستخدام' },
  { id: 'how-it-works', label: 'الآلية الداخلية' },
  { id: 'refresh-cycle', label: 'دورة تحديث البيانات' },
  { id: 'design-decisions', label: 'القرارات التصميمية' },
  { id: 'related-files', label: 'الملفات ذات الصلة' }
]

const architectureSteps = [
  {
    title: 'تسجيل الدخول',
    description: 'POST /api/auth/login → يرجع access_token',
    icon: 'i-lucide-log-in',
    details: 'useLogin → signIn(credentials) → nuxt-auth يحفظ الـ token في cookie'
  },
  {
    title: 'Session Fetch',
    description: 'GET /api/auth/profile → GET /global (External API)',
    icon: 'i-lucide-download',
    details: 'nuxt-auth → getSession() → النتيجة تتخزن في useAuth().data (reactive ref)'
  },
  {
    title: 'useGlobal() Composable',
    description: 'يقرأ مباشرة من useAuth().data عبر computed',
    icon: 'i-lucide-database',
    details: 'لا نسخ — لا sync — لا ازدواجية. يصدّر: user, lists, employees, findInList, refreshGlobal, session'
  },
  {
    title: 'المستهلكون',
    description: 'Components, Composables, Render Functions',
    icon: 'i-lucide-layout-grid',
    details: 'Navbar, GlobalSelect, form.js, schema.js, columns.js — كلها تقرأ من نفس المصدر'
  }
]

const sessionDataCode = `{
  loginName: "ahmed",
  name: "أحمد محمد",
  privateCompanyMode: true,
  list: {
    employees: [
      { id: 1, name: "أحمد" },
      { id: 2, name: "محمد" }
    ],
    departments: [
      { id: 1, name: "IT" }
    ],
    categories: [...],
    // ... قوائم أخرى
  }
}`

const sessionSteps = [
  { num: '1', text: 'POST /api/auth/login → يرجع access_token' },
  { num: '2', text: 'GET /api/auth/profile → server proxy يضرب GET /global بالـ token' },
  { num: '3', text: 'النتيجة تتخزن في useAuth().data' }
]

const apiReference = [
  {
    name: 'user',
    type: 'ComputedRef',
    description: 'بيانات المستخدم الحالي — loginName و name.',
    example: `const { user } = useGlobal()

// في template
{{ user.loginName }}  // → "ahmed"
{{ user.name }}       // → "أحمد محمد"`
  },
  {
    name: 'lists',
    type: 'ComputedRef',
    description: 'كل الـ lookup lists التي يرجعها الـ API — employees, departments, categories, إلخ.',
    example: `const { lists } = useGlobal()

const departments = computed(
  () => lists.value.departments || []
)`
  },
  {
    name: 'employees',
    type: 'ComputedRef',
    description: 'اختصار مباشر لـ lists.value.employees — لأن قائمة الموظفين هي الأكثر استخداماً.',
    example: `const { employees } = useGlobal()

// بدلاً من:
const employees = computed(
  () => lists.value.employees || []
)`
  },
  {
    name: 'findInList(list, id, idKey?)',
    type: 'Function',
    description: 'يبحث عن عنصر بالـ ID في أي قائمة. يقبل idKey اختياري للبحث بحقل مخصص.',
    example: `const { employees, findInList } = useGlobal()

const emp = findInList(employees, 5)
// → { id: 5, name: "أحمد" }

const dept = findInList(departments, 'IT', 'code')`
  },
  {
    name: 'refreshGlobal()',
    type: 'Function',
    description: 'يحدث كل البيانات العامة عبر إعادة استدعاء getSession() — يُستخدم بعد إضافة/تعديل/حذف عنصر.',
    example: `const { refreshGlobal } = useGlobal()

await service.create(newEmployee)
await refreshNuxtData(service.CACHE_KEY)
refreshGlobal()`
  },
  {
    name: 'session',
    type: 'Ref',
    description: 'البيانات الخام للـ session كما هي — للحالات التي تحتاج وصول مباشر لحقول غير موجودة في الـ computed.',
    example: `const { session } = useGlobal()

const privateMode = computed(
  () => session.value?.privateCompanyMode
)`
  }
]

const usageExamples = [
  {
    title: 'في Component (Navbar)',
    language: 'vue',
    code: '\x3Cscript setup\x3E\nconst { user } = useGlobal()\n\x3C/script\x3E\n\n\x3Ctemplate\x3E\n  \x3CUUser :name="user.loginName" :description="user.name" /\x3E\n\x3C/template\x3E'
  },
  {
    title: 'في Module Composable (form.js)',
    language: 'js',
    code: `export const useEmployeesForm = () => {
  const { lists, findInList } = useGlobal()
  const departments = computed(
    () => lists.value.departments || []
  )
  return { departments }
}`
  },
  {
    title: 'في Columns (h() render)',
    language: 'js',
    code: `export const useEmployeesColumns = () => {
  const { findInList, employees } = useGlobal()

  const createColumns = () => {
    return computed(() => [{
      accessorKey: 'departmentId',
      header: 'القسم',
      cell: ({ row }) => {
        const dept = findInList(departments, row.original.departmentId)
        return dept?.name || '—'
      }
    }])
  }
  return { createColumns }
}`
  },
  {
    title: 'عبر GlobalSelect Component',
    language: 'vue',
    code: `<!-- يكفي تحديد اسم القائمة -->
<GlobalSelect
  list="employees"
  label="الموظف"
  v-model="state.employeeId"
/>`
  }
]

const implementationCode = `export const useGlobal = () => {
  const { data: session, getSession } = useAuth()

  const user = computed(() => ({
    loginName: session.value?.loginName || '',
    name: session.value?.name || ''
  }))

  const lists = computed(() => session.value?.list || {})
  const employees = computed(() => lists.value.employees || [])

  const refreshGlobal = () => getSession()

  const findInList = (list, id, idKey = 'id') =>
    list.value?.find(item => item[idKey] === id) || null

  return { user, lists, employees, refreshGlobal, findInList, session }
}`

const computedPoints = [
  'لو session تتحدث (بعد getSession()) → كل مكان يتحدث فوراً',
  'لا watchers، لا actions، لا manual sync',
  'مستحيل تكون البيانات قديمة — لأنها تُقرأ من المصدر مباشرة'
]

const refreshSteps = [
  {
    title: 'إضافة عنصر جديد',
    description: 'service.create(data) → POST /api/employees',
    icon: 'i-lucide-plus-circle'
  },
  {
    title: 'تحديث الجدول المحلي',
    description: 'await refreshNuxtData(service.CACHE_KEY)',
    icon: 'i-lucide-table'
  },
  {
    title: 'تحديث الـ lookup lists',
    description: 'refreshGlobal() → getSession() → GET /global',
    icon: 'i-lucide-refresh-cw'
  },
  {
    title: 'التحديث التلقائي',
    description: 'useAuth().data يتحدث → كل computed في useGlobal يتحدث → كل مستهلك يتحدث',
    icon: 'i-lucide-zap'
  }
]

const piniaComparison = [
  ['مصدر البيانات', 'نسخة منفصلة (sync مطلوب)', 'قراءة مباشرة من useAuth'],
  ['تحديث البيانات', 'يدوي (action/watcher)', 'تلقائي (computed)'],
  ['خطر بيانات قديمة', 'ممكن — لو نسيت الـ sync', 'مستحيل — لا sync أصلاً'],
  ['Dependencies', '@pinia/nuxt + setup', 'صفر'],
  ['SSR', 'يحتاج إعداد', 'يعمل تلقائياً (يرث من useAuth)'],
  ['يعمل في composables', 'نعم', 'نعم'],
  ['يعمل في h() render', 'نعم', 'نعم']
]

const provideComparison = [
  ['النطاق', 'يعتمد على component tree', 'يعمل في أي مكان'],
  ['في composables مستقلة', 'لا يعمل (form.js, columns.js)', 'يعمل'],
  ['في render functions', 'لا يعمل', 'يعمل'],
  ['في components', 'يعمل', 'يعمل']
]

const whenToUse = [
  ['بيانات من مصدر reactive موجود (useAuth)', 'computed + composable'],
  ['بيانات ينشئها الكلاينت (shopping cart, wizard)', 'Pinia'],
  ['بيانات معقدة مع mutations كثيرة', 'Pinia'],
  ['بيانات بسيطة مشتركة بين صفحتين', 'useState']
]

const relatedFiles = [
  { path: 'composables/core/useGlobal.js', description: 'الـ composable الرئيسي' },
  { path: 'components/global/GlobalSelect.vue', description: 'Select يقرأ من useGlobal تلقائياً' },
  { path: 'components/layout/Navbar.vue', description: 'يستخدم useGlobal().user لعرض بيانات المستخدم' },
  { path: 'composables/auth/useLogin.js', description: 'عملية تسجيل الدخول (تبدأ دورة الـ session)' },
  { path: 'plugins/api.ts', description: '$api plugin — يحقن Bearer token تلقائياً' },
  { path: 'server/api/auth/profile.get.ts', description: 'Server proxy — يضرب /global API' },
  { path: 'composables/core/useErrorHandler.js', description: 'معالجة أخطاء الـ API' }
]
</script>
