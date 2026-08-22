<script setup>
const config = useRuntimeConfig()
const { cloudinary } = config.public

const { data: projects, error: projectsError, refresh: refreshProjects } = await useAPI('/projects', {
  key: 'projects',
  query: {
    isProductionWork: true,
    isActive: true,
    sort: 'productionOrder,-createdAt',
    limit: 100
  },
  default: () => [],
  transform: (response) => {
    return (Array.isArray(response) ? response : []).map((project) => {
      const src = project.image?.startsWith('http')
        ? project.image
        : `${cloudinary.cloudinaryUrl}${project.image}`
      return {
        ...project,
        image: optimizeCloudinary(src, cloudinaryTransformFor(src, 'full'))
      }
    })
  }
})

const openSourceProjects = [
  {
    title: 'كاتِب — Kateb',
    description: 'تطبيق سطح مكتب للإملاء الصوتي بالعربية والإنجليزية، يعمل بدون إنترنت. مبني بـ Nuxt 4 وTauri 2 وRust، بإصدارات جاهزة لِـ Linux وWindows وmacOS.',
    url: 'https://github.com/beingmomen/kateb'
  },
  {
    title: 'ghost',
    description: 'الكود المصدري للموقع اللي أنت بتتصفحه — مونوريبو pnpm فيه البورتفوليو وREST API ولوحة تحكم.',
    url: 'https://github.com/beingmomen/ghost'
  },
  {
    title: 'pi-arabic-rtl',
    description: 'حزمة npm تصلّح عرض النصوص العربية المختلطة داخل واجهات الطرفية.',
    url: 'https://github.com/beingmomen/pi-arabic-rtl'
  },
  {
    title: 'claude-code-rtl-injector',
    description: 'إضافة VS Code تحقن دعم RTL تلقائياً وتتعامل مع تغيّر أسماء الـ CSS classes بين الإصدارات.',
    url: 'https://github.com/beingmomen/claude-code-rtl-injector'
  }
]

const pageDescription = 'مشاريع ويب حقيقية اشتغلت عليها — واجهات وتطبيقات بُنيت بإتقان.'

useSeoMeta({
  title: 'المشاريع | عبدالمؤمن الشطوري',
  ogTitle: 'المشاريع | عبدالمؤمن الشطوري',
  description: pageDescription,
  ogDescription: pageDescription,
  ogUrl: `${config.public.siteUrl}/projects`,
  ogType: 'website',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'المشاريع | عبدالمؤمن الشطوري',
  twitterDescription: pageDescription,
  twitterSite: '@beingmomen',
  keywords: 'مشاريع, تطوير ويب, Frontend Engineer, عبدالمؤمن الشطوري, تطبيقات ويب'
})

useBreadcrumbSchema([{ name: 'المشاريع', path: '/projects' }])

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'المشاريع - عبدالمؤمن الشطوري',
        'description': 'استعرض مشاريعي في تطوير الويب وبناء تطبيقات حديثة وعالية الأداء',
        'url': `${config.public.siteUrl}/projects`,
        'mainEntity': {
          '@type': 'ItemList',
          'itemListElement': (projects.value || []).map((project, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'CreativeWork',
              'name': project.title,
              'url': project.url,
              'image': project.image
            }
          }))
        }
      })
    }
  ]
})
</script>

<template>
  <UPage>
    <UPageHero
      title="المشاريع"
      description="مجموعة من المشاريع التي عملت عليها باستخدام أحدث التقنيات"
      :ui="{
        title: '!mx-0 text-right',
        description: '!mx-0 text-right'
      }"
    />

    <UPageSection
      title="أعمال الإنتاج"
      description="أنظمة وواجهات بُنيت لعملاء وشركات."
      :ui="{
        container: '!pt-0',
        title: 'text-right',
        description: 'text-right'
      }"
    >
      <LandingSectionFallback
        v-if="projectsError"
        state="error"
        title="تعذّر تحميل أعمال الإنتاج"
        message="حدث خطأ أثناء جلب أعمال الإنتاج من الخادم. حاول مرة أخرى بعد لحظات."
        alt-action-label="تواصل معي"
        alt-action-to="/contact"
        @retry="refreshProjects()"
      />
      <LandingSectionFallback
        v-else-if="!projects?.length"
        state="empty"
        title="لا توجد أعمال إنتاج منشورة حالياً"
        message="يجري تجهيز أعمال جديدة. في الأثناء، تصفّح المصدر المفتوح أسفل الصفحة."
        alt-action-label="تواصل معي"
        alt-action-to="/contact"
      />
      <div
        v-else
        class="space-y-12 sm:space-y-16"
      >
        <ProjectsCard
          v-for="(project, index) in projects"
          :key="project._id"
          :project="project"
          :index="index"
        />
      </div>
    </UPageSection>

    <UPageSection
      id="open-source"
      title="مفتوح المصدر"
      description="أدوات ومشاريع أملكها بالكامل — الكود متاح للاطلاع على GitHub."
      :ui="{
        root: 'scroll-mt-20',
        container: '!pt-0',
        title: 'text-right',
        description: 'text-right'
      }"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <UPageCard
          v-for="item in openSourceProjects"
          :key="item.url"
          :title="item.title"
          :description="item.description"
          :to="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="h-full"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
