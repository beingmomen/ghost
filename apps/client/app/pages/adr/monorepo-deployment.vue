<template>
  <UPage dir="rtl">
    <AdrHero
      badge="Architecture Decision Record"
      title="نشر"
      highlight="المونوريبو"
      description="pnpm workspace بتلات تطبيقات، كل واحد بيتنشر لوحده حسب المسار المتغيّر — قرار الاستضافة الذاتية، والتقسيم حسب المسار، وعطل إنتاج حقيقي غيّر طريقة كتابة متغيّرات البيئة."
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
                    المشروع عبارة عن pnpm workspace فيه ثلاثة تطبيقات — <code
                      class="font-mono text-primary"
                      dir="ltr"
                    >client</code>، <code
                      class="font-mono text-primary"
                      dir="ltr"
                    >server</code>، و<code
                      class="font-mono text-primary"
                      dir="ltr"
                    >db</code> — بيتشاركوا الأدوات ولوك-فايل واحد، لكن كل واحد بيتنشر لوحده: push بيلمس تطبيق واحد بس ميعملش rebuild للتانيين.
                  </p>
                  <p class="text-base text-muted leading-relaxed mt-3">
                    النشر نفسه عبر self-hosted GitHub Actions runner + PM2 على VPS بيشغّل CloudPanel — بدون Docker، وبدون منصة إدارة container. القرار مبني على واقع إنتاج فعلي شغّال دلوقتي، مش تصميم نظري — بما فيه حادثة إنتاج حقيقية غيّرت طريقة كتابة متغيّرات البيئة، موثّقة بالتفصيل تحت.
                  </p>
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- Deployment Flow -->
          <AdrSection
            id="deployment-flow"
            title="مخطط النشر"
            icon="i-lucide-workflow"
            description="خمس خطوات بالتتابع، من الـ push لحد ما التطبيق يبقى شغّال على النطاق العام"
          >
            <AdrFlowDiagram :steps="deploymentFlowSteps" />
          </AdrSection>

          <!-- Apps Table -->
          <AdrSection
            id="apps-table"
            title="جدول التطبيقات"
            icon="i-lucide-table"
          >
            <AdrDecisionTable
              title="التطبيقات الثلاثة"
              :headers="['التطبيق', 'المسار في الـ workspace', 'الدور']"
              :rows="appsTableRows"
              icon="i-lucide-table"
            />
          </AdrSection>

          <!-- Selective Deploy -->
          <AdrSection
            id="selective-deploy"
            title="آلية الديبلوي الانتقائي"
            icon="i-lucide-git-branch"
            description="مين اللي بيقرر إيه اللي يتبني، وإزاي"
          >
            <p class="text-base text-muted leading-relaxed mb-4">
              الأداة الفعلية اللي بتقرر مين يتبني هي دالة <code
                class="font-mono text-primary"
                dir="ltr"
              >want()</code> جوه <code
                class="font-mono text-primary"
                dir="ltr"
              >scripts/deploy.sh</code>. المنطق بسيط: السكريبت بياخد قايمة المسارات اللي اتغيّرت (عبر <code
                class="font-mono text-primary"
                dir="ltr"
              >git diff</code> بين آخر commit قبل الـ push وبعده)، ولو أي مسار منها بادئته بتطابق مسار تطبيق معيّن، التطبيق ده بيتبني. لو الملف اللي اتغيّر هو <code
                class="font-mono text-primary"
                dir="ltr"
              >pnpm-lock.yaml</code>، أو الديبلوي أول مرة أو شغّال يدوي، التلات تطبيقات بيتبنوا كلهم.
            </p>
            <AdrCodeBlock
              title="want() — منطق القرار (deploy.sh)"
              language="bash"
              :code="wantFunctionCode"
            />
            <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 mt-4">
              <p class="text-base text-muted leading-relaxed">
                الآليتان الحقيقيتان اللي بتحدد النتيجة: فحص <code
                  class="font-mono text-primary"
                  dir="ltr"
                >git diff</code> للمسارات المتغيّرة، ومطابقة بادئة المسار لكل تطبيق. جدول "ديبلوي موحّد مقابل حسب المسار" تحت في القرارات التصميمية بيشرح ليه الاختيار ده تحديداً، مش بس إزاي بيشتغل.
              </p>
            </div>
          </AdrSection>

          <!-- CRLF Incident -->
          <AdrSection
            id="crlf-incident"
            title="ما تغيّر أثناء التشغيل — حادثة CRLF"
            icon="i-lucide-alert-triangle"
            description="عطل إنتاج حقيقي، وأثره على طريقة كتابة متغيّرات البيئة في النشر"
          >
            <div class="space-y-3">
              <div
                v-for="(step, index) in crlfSteps"
                :key="step.label"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
              >
                <div class="rounded-lg border border-default/60 bg-elevated/30 p-4 text-right">
                  <div class="flex items-center gap-2 mb-2">
                    <UBadge
                      :label="`${index + 1}`"
                      color="primary"
                      variant="subtle"
                      size="xs"
                    />
                    <span class="text-base font-semibold">{{ step.label }}</span>
                  </div>
                  <p class="text-base text-muted leading-relaxed">
                    {{ step.text }}
                  </p>
                </div>
              </div>
            </div>
          </AdrSection>

          <!-- Design Decisions -->
          <AdrSection
            id="design-decisions"
            title="القرارات التصميمية"
            icon="i-lucide-scale"
            description="لماذا اخترنا هذا الشكل من النشر وليس البدائل الأخرى"
          >
            <div class="space-y-4">
              <div>
                <p class="text-base text-muted leading-relaxed mb-3">
                  السبب الأساسي: <code
                    class="font-mono text-primary"
                    dir="ltr"
                  >server</code> (Express) محتاج عملية Node دائمة (long-running process)، مش serverless functions — وده وحده كافي يمنع نشره بشكله القياسي على منصة زي Vercel. التكلفة عامل مساعد بس، مش سبب مستقل.
                </p>
                <AdrDecisionTable
                  title="(أ) VPS مستضاف ذاتياً مقابل منصة مُدارة (Vercel/Netlify)"
                  :headers="['المعيار', 'VPS مستضاف ذاتياً', 'منصة مُدارة (Vercel/Netlify)']"
                  :rows="selfHostedComparison"
                />
              </div>
              <AdrDecisionTable
                title="(ب) Monorepo واحد مقابل ريبوهات منفصلة"
                :headers="['المعيار', 'Monorepo واحد', 'ريبوهات منفصلة']"
                :rows="monorepoComparison"
              />
              <AdrDecisionTable
                title="(ج) ديبلوي موحّد مقابل ديبلوي حسب المسار"
                :headers="['المعيار', 'ديبلوي موحّد (الكل مع بعض)', 'ديبلوي حسب المسار (الحالي)']"
                :rows="deployStrategyComparison"
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
  title: 'نشر المونوريبو'
})

useHead({
  title: 'نشر المونوريبو — Monorepo Deployment',
  meta: [
    {
      name: 'description',
      content: 'قرار معماري: pnpm workspace بتلات تطبيقات، كل واحد بيتنشر لوحده حسب المسار — الاستضافة الذاتية، الديبلوي الانتقائي، وحادثة إنتاج حقيقية غيّرت طريقة كتابة متغيّرات البيئة.'
    }
  ]
})

useSeoMeta({
  ogTitle: 'نشر المونوريبو — Monorepo Deployment',
  ogDescription: 'قرار معماري: pnpm workspace بتلات تطبيقات، كل واحد بيتنشر لوحده حسب المسار المتغيّر.',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'نشر المونوريبو — Monorepo Deployment',
  twitterDescription: 'pnpm workspace بتلات تطبيقات، كل واحد بيتنشر لوحده حسب المسار المتغيّر.',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([
  { name: 'القرارات المعمارية', path: '/adr' },
  { name: 'نشر المونوريبو', path: '/adr/monorepo-deployment' }
])

const config = useRuntimeConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': 'نشر المونوريبو — Monorepo Deployment',
        'description': 'قرار معماري: pnpm workspace بتلات تطبيقات، كل واحد بيتنشر لوحده حسب المسار المتغيّر، مع توثيق حادثة إنتاج حقيقية.',
        'url': `${config.public.siteUrl}/adr/monorepo-deployment`,
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
  { id: 'deployment-flow', label: 'مخطط النشر' },
  { id: 'apps-table', label: 'جدول التطبيقات' },
  { id: 'selective-deploy', label: 'آلية الديبلوي الانتقائي' },
  { id: 'crlf-incident', label: 'حادثة CRLF' },
  { id: 'design-decisions', label: 'القرارات التصميمية' },
  { id: 'related-files', label: 'الملفات ذات الصلة' }
]

const deploymentFlowSteps = [
  {
    title: 'Push على main',
    description: 'أي تغيير على الفرع الرئيسي يشغّل الـ pipeline تلقائياً',
    icon: 'i-lucide-git-commit-horizontal'
  },
  {
    title: 'GitHub Actions Workflow',
    description: 'self-hosted runner بيستقبل الحدث ويبدأ التنفيذ',
    icon: 'i-lucide-cog'
  },
  {
    title: 'مزامنة الكود ومتغيّرات البيئة',
    description: 'الكود بيتزامن مع آخر نسخة، وملفات .env لكل تطبيق بتتكتب من متغيّرات الريبو',
    icon: 'i-lucide-download'
  },
  {
    title: 'scripts/deploy.sh',
    description: 'بيحدد التطبيقات المتأثرة ويبنيها/يعيد تشغيلها بالتتابع',
    icon: 'i-lucide-server'
  },
  {
    title: 'CloudPanel (nginx)',
    description: 'بيوجّه كل نطاق للتطبيق المسؤول عنه ويدير شهادة SSL',
    icon: 'i-lucide-shield'
  }
]

const appsTableRows = [
  ['client', 'apps/client', 'الموقع — Nuxt 4، البورتفوليو والمدونة وصفحات الـ ADR'],
  ['server', 'apps/server', 'REST API — Express، مصدر البيانات لكل التطبيقات التانية'],
  ['db', 'apps/db', 'لوحة الإدارة — Nuxt 4، لإدارة محتوى الموقع (مشاريع، مقالات، ADRs)']
]

const wantFunctionCode = `BUILD_ALL=0
if [ "$CHANGED" = "ALL" ] || echo "$CHANGED" | grep -q '^pnpm-lock.yaml$'; then
  BUILD_ALL=1
fi

want() { [ "$BUILD_ALL" = 1 ] || echo "$CHANGED" | grep -q "^$1/"; }

if want apps/client; then
  # ...build client...
fi`

const crlfSteps = [
  {
    label: 'المشكلة',
    text: '/projects رجّعت 404 في الإنتاج، بينما باقي صفحات الموقع (زي الصفحة الرئيسية) شغّالة عادي — نفس الديبلوي، صفحة واحدة بس واقعة.'
  },
  {
    label: 'السبب الجذري',
    text: 'أول تشخيص افترض إن الكاش القديم لبناء Nuxt هو السبب — اتصلح بمسح الكاش قبل كل بناء، بس المشكلة فضلت موجودة، وده نفى الفرضية دي فعلياً. السبب الحقيقي كان \\r زايد في نهاية قيمة BASE_URL (جايّة من صياغة CRLF في متغيّرات النشر)، وده كان بيكسر بناء الرابط في الطلبات اللي معاها query string بس — و/projects هي الصفحة الوحيدة في الموقع اللي بتنادي useAPI بـ query، فكانت الوحيدة المتأثرة.'
  },
  {
    label: 'الحل',
    text: 'الحل كان في مستويين — تنضيف قيمة متغيّرات البيئة من الـ \\r قبل ما تتكتب في ملف .env وقت النشر، مع إضافة طبقة حماية دفاعية في useAPI نفسها بتشيل أي مسافة أو محرف زايد من قيمة الـ baseURL قبل ما تُستخدم — عشان أي تلوث مشابه في المستقبل ميكررش نفس المشكلة.'
  },
  {
    label: 'المنع',
    text: 'الدرس الأهم مكنش في الإصلاح نفسه، لكن في إن الاعتماد على كتابة صحيحة لمتغيّرات البيئة يدوياً مش كافي — التعقيم لازم يبقى آلي جوه سكريبت النشر نفسه، مش افتراض إن القيمة هتوصل نضيفة دايماً.'
  }
]

const selfHostedComparison = [
  ['طبيعة server (Express)', 'عملية Node دائمة — مطلوبة للـ REST API', 'serverless functions — مش مناسبة لعملية دائمة'],
  ['التقسيم', 'التلات تطبيقات على نفس البنية', 'كان محتاج تقسيم على أكتر من منصة'],
  ['التكلفة (عامل مساعد)', 'VPS واحد ثابت التكلفة لتلات تطبيقات', 'تكلفة شهرية مضاعفة لتلات تطبيقات منفصلة']
]

const monorepoComparison = [
  ['الأدوات والإعدادات', 'مشتركة بين التلات تطبيقات', 'كل ريبو بيكرر إعداداته لوحده'],
  ['الـ lockfile', 'واحد (pnpm-lock.yaml) لكل الـ dependencies', 'lockfile منفصل لكل ريبو'],
  ['النشر', 'مستقل حسب المسار المتغيّر', 'مستقل بطبيعته (pipeline خاص لكل ريبو)']
]

const deployStrategyComparison = [
  ['وقت البناء', 'بناء التلات تطبيقات في كل push، حتى لو اتغيّر واحد بس', 'بناء التطبيق المتأثر بس'],
  ['استهلاك الموارد', 'موارد السيرفر ما بتستحملش 3 عمليات build في نفس الوقت — فحتى لو اتبنوا واحد ورا التاني، وقت النشر بيطول من غير داعي', 'بناء أقصر — تطبيق واحد بس بيتبني في الحالة الشائعة'],
  ['الآلية', 'مفيش حاجة تحدد إيه اللي اتغيّر', 'دالة want() بتقارن مسارات git diff ببادئة كل تطبيق']
]

const relatedFiles = [
  { path: 'scripts/deploy.sh', description: 'سكريبت الديبلوي — بيحدد التطبيق المتأثر ويبنيه بالتتابع' },
  { path: 'ecosystem.config.cjs', description: 'تعريف الـ processes الثلاثة لـ PM2' },
  { path: '.github/workflows/deploy.yml', description: 'الـ workflow — بيزامن الكود، يكتب متغيّرات البيئة، وينفّذ deploy.sh' },
  { path: 'pnpm-workspace.yaml', description: 'تعريف الـ workspace — التلات تطبيقات تحت apps/*' },
  { path: 'docs/DEPLOYMENT.md', description: 'التوثيق الكامل لآلية النشر' },
  { path: 'app/composables/useAPI.ts', description: 'فيه الـ .trim() الدفاعي اللي اتضاف بعد حادثة الـ CRLF' }
]
</script>
