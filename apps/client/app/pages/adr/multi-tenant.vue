<template>
  <UPage dir="rtl">
    <AdrHero
      badge="Architecture Decision Record"
      title="تعدد"
      highlight="العملاء"
      description="قاعدة كود واحدة وdeployment واحد لكل نظام بدل فرع وموقع لكل عميل — العميل بيتحدد من الـ subdomain، والـ backend بيختار قاعدة بياناته من header واحد."
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
                    شركة برمجيات عندها كذا نظام أعمال (موارد بشرية، محاسبة، مخازن) بيخدموا جهات حكومية وخاصة. القرار: <strong class="text-highlighted">قاعدة كود واحدة وdeployment واحد لكل نظام</strong>، والعميل (الـ tenant) بيتحدد من <strong class="text-highlighted">الـ subdomain</strong> اللي فاتح منه، والـ backend بيختار قاعدة بياناته من header واحد.
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

          <!-- The Problem -->
          <AdrSection
            id="problem"
            title="المشكلة — فرع وموقع لكل عميل"
            icon="i-lucide-git-branch"
            description="الديمو كان فرع main، وكل عميل جديد كان بياخد نسخة كاملة خاصة بيه"
          >
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mb-4">
              <p class="text-base text-muted leading-relaxed">
                كل عميل كان ليه فرع git (نفس كود <code
                  class="font-mono text-primary"
                  dir="ltr"
                >main</code> بالظبط)، وتطبيق Netlify خاص بيه (branch deploy بـ env vars لكل عميل زي الـ API URL والعنوان واللوجو)، وbackend app خاص بيه على مزوّد الاستضافة. في نظام الموارد البشرية لوحده كان فيه <strong class="text-highlighted">حوالي 50 فرع عميل</strong> — يعني حوالي 50 deployment منفصل. أي تعديل تطلبه جهة واحدة كان بيتبني ويتجرب على الديمو، وبعدين يتعمله merge وpush يدوي في كل فرع عميل.
              </p>
            </div>
            <div class="grid sm:grid-cols-2 gap-3 mb-4">
              <div
                v-for="problem in problems"
                :key="problem.title"
                class="rounded-lg border border-default/60 bg-elevated/30 p-4 text-right"
              >
                <div class="flex items-center gap-2 mb-2">
                  <UIcon
                    :name="problem.icon"
                    class="size-4 text-muted"
                  />
                  <span class="text-base font-semibold">{{ problem.title }}</span>
                </div>
                <div class="text-base text-muted">
                  {{ problem.description }}
                </div>
              </div>
            </div>
            <AdrDecisionTable
              title="قبل وبعد"
              :headers="['المعيار', 'قبل — فرع لكل عميل', 'بعد — subdomain لكل عميل']"
              :rows="beforeAfterRows"
              icon="i-lucide-arrow-right-left"
            />
          </AdrSection>

          <!-- The Decision -->
          <AdrSection
            id="decision"
            title="القرار"
            icon="i-lucide-handshake"
            description="مين اقترح إيه، ومين بنى إيه"
          >
            <div class="space-y-3">
              <div class="rounded-lg border border-default/60 bg-elevated/30 p-4">
                <p class="text-base text-muted leading-relaxed">
                  درست المشكلة، واقترحت إن الـ tenant يتحدد من الـ subdomain. عرضت الفكرة في اجتماع، وحللنا كل نقطة فيها مع المدير، واتوافق عليها مباشرة.
                </p>
              </div>
              <div class="rounded-lg border border-default/60 bg-elevated/30 p-4">
                <p class="text-base text-muted leading-relaxed">
                  صممت الطريقة وبنيت جانب الـ frontend. الـ backend (.NET، مسؤولية فريق الـ backend) بيحتفظ بقاعدة بيانات لكل tenant وبيختار القاعدة حسب الـ header.
                </p>
              </div>
            </div>
          </AdrSection>

          <!-- Request Flow -->
          <AdrSection
            id="request-flow"
            title="مسار الطلب"
            icon="i-lucide-route"
            description="دورة حياة طلب واحد — من فتح الـ subdomain لحد ما البيانات تترسم في الصفحة"
          >
            <AdrRequestDiagram
              :steps="requestSteps"
              :branch="requestBranch"
              label="مخطط دورة حياة طلب في نظام متعدد العملاء"
              :summary="requestSummary"
              caption="الشكل: المسار الأساسي لعميل اسمه acme. الفرع الجانبي هو الحالات اللي مابيتبعتش فيها header، وبيرجع لنفس الـ API في الآخر."
              loop-note="الطلبات اللي بعد كده من المتصفح بتمشي في نفس المسار من الـ plugin لحد الرد — الـ hostname بيتقري على الكلاينت، ومفيش DNS أو hosting جديد في النص."
            />
          </AdrSection>

          <!-- getTenantId -->
          <AdrSection
            id="get-tenant-id"
            title="تحديد الـ tenant — getTenantId"
            icon="i-lucide-scan"
            description="بيقرا الـ hostname ويطلع أول label لو الـ host من الشكل label.base-domain"
          >
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mb-4">
              <p class="text-base text-muted leading-relaxed">
                في نسخ Nuxt الحالية الـ hostname بييجي من <code
                  class="font-mono text-primary"
                  dir="ltr"
                >useRequestURL().hostname</code> — على السيرفر من الطلب نفسه (الـ host header)، وعلى الكلاينت من المتصفح. (النسخة القديمة الـ SPA كانت بتقراه من <code
                  class="font-mono text-primary"
                  dir="ltr"
                >window.location.hostname</code>.)
              </p>
            </div>
            <AdrCodeBlock
              title="utils/tenant.js — مثال مبسّط"
              language="js"
              :code="getTenantIdCode"
            />
            <AdrDecisionTable
              title="الـ host ← النتيجة"
              :headers="['الـ host', 'النتيجة', 'ليه']"
              :rows="hostResultRows"
              icon="i-lucide-list-checks"
              class="mt-4"
            />
          </AdrSection>

          <!-- Interceptor -->
          <AdrSection
            id="interceptor"
            title="الـ Interceptor"
            icon="i-lucide-send"
            description="بيضيف الـ header لطلبات الـ API — ولو القيمة null مفيش header، والـ backend بيرجع للقاعدة الافتراضية"
          >
            <p class="text-base text-muted leading-relaxed mb-4">
              الأمثلة دي مبسّطة للتوضيح، مش كود الإنتاج.
            </p>
            <AdrCodeBlock
              title="plugins/api.js — Nuxt (SSR + client)"
              language="js"
              :code="nuxtPluginCode"
            />
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mt-4">
              <p class="text-base text-muted leading-relaxed">
                الـ plugin بيتنفذ مرة لكل request على السيرفر، ومرة واحدة في المتصفح — فنفس الـ tenant بيتحسب في الحالتين من غير أي كود خاص بكل بيئة. والطلبات اللي رايحة لسيرفر الهوية/تسجيل الدخول المنفصل مابتاخدش الـ header.
              </p>
            </div>
          </AdrSection>

          <!-- Per-Tenant Differences -->
          <AdrSection
            id="per-tenant"
            title="إيه اللي بيختلف من عميل للتاني"
            icon="i-lucide-split"
          >
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4">
              <p class="text-base text-muted leading-relaxed">
                <strong class="text-highlighted">البيانات بس.</strong> الكود واحد والـ build واحد. حتى الوضع (خاص/عام) مش إعداد للـ tenant — بيتحدد من رد الـ profile بعد تسجيل الدخول، والآلية دي متوثقة في <NuxtLink
                  to="/adr/multi-mode-system"
                  class="text-highlighted underline underline-offset-4 hover:text-primary transition-colors"
                >نظام الأوضاع</NuxtLink>.
              </p>
            </div>
          </AdrSection>

          <!-- Isolation -->
          <AdrSection
            id="isolation"
            title="العزل"
            icon="i-lucide-shield"
            description="قاعدة بيانات لكل tenant، وsession مربوطة بالـ origin"
          >
            <AdrDecisionTable
              title="طبقات العزل"
              :headers="['الطبقة', 'الآلية', 'النتيجة']"
              :rows="isolationRows"
              icon="i-lucide-layers"
            />
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mt-4">
              <p class="text-base text-muted leading-relaxed">
                النتيجة إن session كل subdomain معزولة أوتوماتيك، من غير أي كود إضافي. (النسخة القديمة الـ SPA كانت بتخزن التوكن في localStorage، وده برضه مربوط بالـ origin، فالعزل كان متحقق هناك كمان.)
              </p>
            </div>
          </AdrSection>

          <!-- Alternatives -->
          <AdrSection
            id="alternatives"
            title="البدائل"
            icon="i-lucide-scale"
            description="البديل الحقيقي الوحيد كان إننا نكمّل على النموذج الحالي"
          >
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mb-4">
              <p class="text-base text-muted leading-relaxed">
                مفيش معماريات تانية اتقارنت رسمياً — الفكرة اتعرضت، واتحللت نقطة نقطة، واتوافق عليها.
              </p>
            </div>
            <AdrDecisionTable
              title="البديل"
              :headers="['البديل', 'المشكلة']"
              :rows="alternativeRows"
              icon="i-lucide-x-circle"
            />
          </AdrSection>

          <!-- What Changed During Build -->
          <AdrSection
            id="what-changed"
            title="ما تغيّر أثناء البناء"
            icon="i-lucide-history"
            description="تعديلات ظهرت أثناء البناء، من تاريخ الـ git"
          >
            <AdrDecisionTable
              title="التغييرات"
              :headers="['التغيير', 'البداية', 'اللي ظهر', 'التعديل']"
              :rows="whatChangedRows"
              icon="i-lucide-history"
            />
          </AdrSection>

          <!-- Results & Status -->
          <AdrSection
            id="results"
            title="النتائج والحالة"
            icon="i-lucide-check-circle"
          >
            <div class="space-y-2 mb-4">
              <div
                v-for="result in results"
                :key="result"
                class="flex items-start gap-2 rounded-lg border border-default/60 bg-elevated/30 p-3"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-4 text-success mt-1.5 shrink-0"
                />
                <span class="text-base text-muted">{{ result }}</span>
              </div>
            </div>
            <AdrDecisionTable
              title="حالة الأنظمة"
              :headers="['النظام', 'الحالة']"
              :rows="statusRows"
              icon="i-lucide-activity"
            />
          </AdrSection>

          <!-- Related Files -->
          <AdrSection
            id="related-files"
            title="الملفات ذات الصلة"
            icon="i-lucide-folder-open"
            description="تقسيم مقترح للأمثلة اللي فوق — مش هيكل الملفات الفعلي في الشركة"
          >
            <AdrFileReference
              title="تقسيم مقترح للأمثلة"
              :files="coreFiles"
            />
          </AdrSection>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup>
definePageMeta({
  title: 'تعدد العملاء'
})

useHead({
  title: 'تعدد العملاء من الـ subdomain — Multi-Tenant',
  meta: [
    {
      name: 'description',
      content: 'قرار معماري: قاعدة كود واحدة وdeployment واحد لكل نظام بدل فرع وموقع لكل عميل — الـ tenant بيتحدد من الـ subdomain، والـ backend بيختار قاعدة بياناته من header.'
    }
  ]
})

useSeoMeta({
  ogTitle: 'تعدد العملاء من الـ subdomain — Multi-Tenant',
  ogDescription: 'قرار معماري: قاعدة كود واحدة وdeployment واحد لكل نظام، والـ tenant بيتحدد من الـ subdomain.',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'تعدد العملاء من الـ subdomain — Multi-Tenant',
  twitterDescription: 'قاعدة كود واحدة وdeployment واحد لكل نظام، والـ tenant بيتحدد من الـ subdomain.',
  twitterSite: '@beingabdelmomen'
})

useBreadcrumbSchema([
  { name: 'القرارات المعمارية', path: '/adr' },
  { name: 'تعدد العملاء', path: '/adr/multi-tenant' }
])

const config = useRuntimeConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': 'تعدد العملاء من الـ subdomain — Multi-Tenant',
        'description': 'قرار معماري: قاعدة كود واحدة وdeployment واحد لكل نظام بدل فرع وموقع لكل عميل — الـ tenant بيتحدد من الـ subdomain، والـ backend بيختار قاعدة بياناته من header.',
        'url': `${config.public.siteUrl}/adr/multi-tenant`,
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
  { id: 'problem', label: 'المشكلة' },
  { id: 'decision', label: 'القرار' },
  { id: 'request-flow', label: 'مسار الطلب' },
  { id: 'get-tenant-id', label: 'getTenantId' },
  { id: 'interceptor', label: 'الـ Interceptor' },
  { id: 'per-tenant', label: 'الفرق بين العملاء' },
  { id: 'isolation', label: 'العزل' },
  { id: 'alternatives', label: 'البدائل' },
  { id: 'what-changed', label: 'ما تغيّر أثناء البناء' },
  { id: 'results', label: 'النتائج والحالة' },
  { id: 'related-files', label: 'الملفات ذات الصلة' }
]

const principles = [
  {
    title: 'الـ subdomain هو الهوية',
    description: 'العميل بيتعرف من الـ subdomain اللي فاتح منه — مفيش إعدادات لكل عميل في الـ build.',
    icon: 'i-lucide-globe'
  },
  {
    title: 'الفرق بيانات بس',
    description: 'الكود واحد والـ build واحد لكل العملاء — اللي بيختلف هو قاعدة البيانات اللي بيتكلم معاها.',
    icon: 'i-lucide-database'
  },
  {
    title: 'منطق تحديد واحد',
    description: 'نفس قواعد تحديد الـ tenant بتتطبق في كل طلب بيروح للـ API، من مكان واحد.',
    icon: 'i-lucide-target'
  }
]

const problems = [
  {
    title: 'Drift',
    description: 'نسخ العملاء كانت بتتأخر عن بعض وعن الديمو.',
    icon: 'i-lucide-git-compare'
  },
  {
    title: 'شغل يدوي متكرر',
    description: 'إصلاح لكل العملاء = حوالي 50 merge وpush يدوي، وNetlify بيعمل deploy لكل واحد.',
    icon: 'i-lucide-repeat'
  },
  {
    title: 'Build minutes',
    description: 'مجموع الـ build minutes عدّى الـ free tier، فبقى تكلفة شهرية متكررة.',
    icon: 'i-lucide-timer'
  },
  {
    title: 'Backend لكل عميل',
    description: 'backend app لكل عميل على مزوّد الاستضافة كان تكلفة إضافية هو كمان.',
    icon: 'i-lucide-server'
  }
]

const beforeAfterRows = [
  ['الكود', 'فرع git لكل عميل (نسخة من main)', 'قاعدة كود واحدة'],
  ['الـ frontend deployment', 'تطبيق Netlify لكل عميل (حوالي 50 في الموارد البشرية لوحدها)', 'deployment واحد لكل نظام على wildcard subdomain'],
  ['الإعدادات', 'env vars لكل موقع (API URL، العنوان، اللوجو)', 'API base URL واحد للكل، والعميل بيتعرف من الـ subdomain'],
  ['الـ backend', 'backend app لكل عميل', 'backend app واحد بيختار قاعدة البيانات من الـ header'],
  ['إصلاح لكل العملاء', 'حوالي 50 merge وpush يدوي', 'deployment واحد'],
  ['التكلفة', 'build minutes فوق الـ free tier + backend app لكل عميل', 'build minutes جوه الـ free tier + backend app واحد']
]

const requestSteps = [
  {
    lane: 'Browser',
    title: 'المستخدم بيفتح subdomain العميل',
    icon: 'i-lucide-globe',
    chips: [{ label: 'acme.example.com' }]
  },
  {
    lane: 'DNS',
    title: 'Wildcard record',
    description: 'سجل واحد بيوجّه كل subdomains العملاء لنفس المكان، ومعاه شهادة SSL من نوع wildcard',
    icon: 'i-lucide-signpost',
    chips: [{ label: '*.example.com' }]
  },
  {
    lane: 'Hosting',
    title: 'deployment واحد لتطبيق Nuxt',
    description: 'نفس الـ deployment بيخدم كل الـ subdomains — مفيش موقع لكل عميل',
    icon: 'i-lucide-server'
  },
  {
    lane: 'Nuxt SSR',
    title: 'قراءة الـ hostname',
    description: 'السيرفر بيقرا hostname الطلب ويبعته لـ getTenantId',
    icon: 'i-lucide-scan',
    chips: [{ label: 'getTenantId(host)' }]
  },
  {
    lane: 'Decision',
    kind: 'decision',
    title: 'الـ host ده subdomain عميل؟',
    arrowLabel: 'نعم — tenantId = acme'
  },
  {
    lane: '$fetch plugin',
    title: 'تجهيز الطلب',
    description: 'بيضيف الـ header ومعاه التوكن من الـ auth cookie (host-only)',
    icon: 'i-lucide-send',
    chips: [{ label: 'tenantId: acme', accent: true }, { label: 'auth token' }]
  },
  {
    lane: 'Backend API',
    title: 'API واحد لكل العملاء',
    description: 'بيقرا tenantId من الـ header',
    icon: 'i-lucide-server-cog'
  },
  {
    lane: 'Database',
    kind: 'stores',
    title: 'اختيار قاعدة بيانات العميل',
    icon: 'i-lucide-database',
    description: 'قاعدة بيانات لكل tenant — الـ backend بيختار قاعدة acme',
    stores: [{ label: 'acme', active: true }, { label: 'tenant-b' }, { label: 'default' }]
  },
  {
    lane: 'Response',
    title: 'Query ثم JSON',
    description: 'الاستعلام بيتنفذ على قاعدة acme بس، والرد بيرجع JSON لـ Nuxt',
    icon: 'i-lucide-braces'
  },
  {
    lane: 'Render',
    title: 'Nuxt بيرسم الـ HTML',
    description: 'الصفحة بتترسم على السيرفر (SSR)، والمتصفح بيعمل hydrate',
    icon: 'i-lucide-monitor-check'
  }
]

const requestBranch = {
  fromStep: 4,
  toStep: 6,
  title: 'لا — النتيجة null',
  items: ['localhost', 'عنوان IP', 'dev tunnel host', 'الدومين الافتراضي لمنصة الاستضافة', 'الديمو'],
  footer: 'مفيش header بيتبعت، وبيكمل لنفس الـ API اللي بيرجع للقاعدة الافتراضية'
}

const requestSummary = 'المستخدم بيفتح acme.example.com. سجل DNS من نوع wildcard وشهادة SSL wildcard بيوجّهوا كل الـ subdomains لنفس الـ deployment بتاع Nuxt. السيرفر بيقرا الـ hostname وبينادي getTenantId. لو الـ host subdomain عميل النتيجة acme، والـ $fetch plugin بيضيف header اسمه tenantId بقيمة acme ومعاه التوكن من auth cookie من نوع host-only. لو الـ host هو localhost أو IP أو tunnel host أو الدومين الافتراضي لمنصة الاستضافة أو الديمو، النتيجة null ومفيش header، والطلب بيروح لنفس الـ API اللي بيستخدم القاعدة الافتراضية. الـ backend بيقرا tenantId ويختار قاعدة بيانات acme من بين قواعد العملاء، وبينفذ الاستعلام ويرجّع JSON لـ Nuxt، اللي بيرسم الـ HTML على السيرفر والمتصفح بيعمل hydrate. الطلبات اللي بعد كده من المتصفح بتمشي في نفس المسار من غير DNS أو hosting جديد.'

const getTenantIdCode = `const BASE_DOMAIN = 'example.com'
const RESERVED = ['www', 'demo']

export const getTenantId = (hostname) => {
  if (!hostname || hostname === 'localhost') return null
  if (isIpAddress(hostname)) return null
  if (isTunnelHost(hostname) || isPlatformDefaultHost(hostname)) return null

  const suffix = '.' + BASE_DOMAIN
  if (!hostname.endsWith(suffix)) return null

  const label = hostname.slice(0, -suffix.length)
  if (label.includes('.') || RESERVED.includes(label)) return null

  return label
}`

const hostResultRows = [
  ['acme.example.com', 'acme', 'subdomain عميل — بيتبعت header'],
  ['www.example.com', 'null', 'www مش عميل'],
  ['demo.example.com', 'null', 'الديمو مستثنى — بيروح للقاعدة الافتراضية'],
  ['localhost', 'null', 'تطوير محلي — القاعدة الافتراضية'],
  ['192.168.1.10', 'null', 'عنوان IP مش subdomain عميل'],
  ['dev tunnel host (زي ngrok)', 'null', 'مش subdomain عميل'],
  ['الدومين الافتراضي لمنصة الاستضافة', 'null', 'شكله زي subdomain عميل، بس مش عميل']
]

const nuxtPluginCode = `// composables/useTenantId.js
export const useTenantId = () => getTenantId(useRequestURL().hostname)

// plugins/api.js
export default defineNuxtPlugin(() => {
  const tenantId = useTenantId()

  const api = $fetch.create({
    baseURL: '/api',
    onRequest({ options }) {
      if (tenantId) options.headers.set('tenantId', tenantId)
    }
  })

  return { provide: { api } }
})`

const isolationRows = [
  ['قاعدة البيانات', 'قاعدة لكل tenant، والـ backend بيختارها من الـ header', 'بيانات كل عميل منفصلة'],
  ['الـ session', 'auth cookie من نوع host-only — من غير ما نحدد cookie domain', 'كل subdomain ليه session مستقلة، والكوكي مابتتبعتش لأي subdomain تاني']
]

const alternativeRows = [
  ['نكمّل على فرع + موقع + backend app لكل عميل', 'الـ drift والـ merges اليدوية بيزيدوا مع كل عميل جديد، والتكلفة بتكبر معاهم']
]

const whatChangedRows = [
  [
    'اسم الـ header',
    'tenant_id',
    'بعض الـ proxies بتشيل الـ headers اللي فيها underscore (nginx بيعمل كده افتراضياً).',
    'الاسم بقى tenantId — مايعتمدش على إعداد proxy معين.'
  ],
  [
    'الديمو',
    'الديمو subdomain زي أي عميل، فكان بيبعت header.',
    'الديمو مش عميل — هو النسخة اللي بتتجرب عليها التعديلات.',
    'الديمو اتستثنى ومابيبعتش header.'
  ],
  [
    'التطوير المحلي',
    'localhost وعناوين الـ IP مالهاش subdomain عميل.',
    'محتاجين التطوير المحلي يشتغل من غير tenant.',
    'الدالة بترجع null، فالتطوير المحلي بيكلّم القاعدة الافتراضية.'
  ],
  [
    'الـ dev tunnel hosts',
    'host زي ngrok كان بيتقري كأنه tenant.',
    'تسجيل الدخول نجح، بس الـ profile رجع فاضي.',
    'الـ tunnel hosts اتستثنت.'
  ],
  [
    'الدومين الافتراضي لمنصة الاستضافة',
    'الدومين الافتراضي اللي منصة الاستضافة بتديه للموقع (من الشكل site-name.platform-domain) ماكانش مستثنى.',
    'شكله زي subdomain عميل بالظبط، فأي deploy لسه على الدومين ده أول جزء منه بيتقري كأنه tenant.',
    'الدومينات الافتراضية للمنصة اتستثنت زي الـ tunnel hosts.'
  ]
]

const results = [
  'أي إصلاح بيوصل لكل العملاء في deployment واحد.',
  'مفيش merges لكل عميل، ومفيش drift.',
  'الـ build minutes رجعت جوه الـ free tier.',
  'backend app واحد بدل واحد لكل عميل.',
  'إضافة عميل جديد بقت subdomain + قاعدة بيانات، مش فرع وموقع جديد.'
]

const statusRows = [
  ['الموارد البشرية', 'اتنقل وشغّال في الإنتاج، ونسخة Nuxt الجديدة مبنية بنفس النمط'],
  ['المحاسبة', 'اتنقل وشغّال في الإنتاج'],
  ['المخازن', 'بيتنقل لنفس النمط دلوقتي']
]

const coreFiles = [
  { path: 'utils/tenant.js', description: 'getTenantId' },
  { path: 'composables/useTenantId.js', description: 'بيقرا الـ hostname على السيرفر والكلاينت ويطبّق getTenantId' },
  { path: 'plugins/api.js', description: 'الـ interceptor اللي بيضيف الـ header' }
]
</script>
