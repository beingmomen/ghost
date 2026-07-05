<script setup>
const config = useRuntimeConfig()
const { cloudinary } = config.public

const { data: projects, error: projectsError, refresh: refreshProjects } = await useAPI('/projects', {
  key: 'projects',
  query: { isActive: true },
  default: () => [],
  transform: (response) => {
    return (response.data || []).map(project => ({
      ...project,
      image: optimizeCloudinary(
        project.image?.startsWith('http') ? project.image : `${cloudinary.cloudinaryUrl}${project.image}`,
        'f_auto,q_auto,w_1152'
      )
    }))
  }
})

const pageDescription = 'استعرض مشاريعي في تطوير الويب وبناء تطبيقات حديثة وعالية الأداء'

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
    <LandingSectionFallback
      v-if="projectsError"
      state="error"
      title="تعذّر تحميل المشاريع"
      message="حدث خطأ أثناء جلب المشاريع من الخادم. حاول مرة أخرى بعد لحظات."
      alt-action-label="تواصل معي"
      alt-action-to="/contact"
      @retry="refreshProjects()"
    />
    <LandingSectionFallback
      v-else-if="!projects?.length"
      state="empty"
      title="لا توجد مشاريع منشورة حالياً"
      message="يجري تجهيز أعمال جديدة. في الأثناء، يسعدني أن أسمع عن مشروعك."
      alt-action-label="تواصل معي"
      alt-action-to="/contact"
    />
    <UPageSection
      v-else
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="space-y-12 sm:space-y-16">
        <div
          v-for="(project, index) in projects"
          :key="project._id"
        >
          <UPageCard
            :description="project.description"
            :to="project.url"
            target="_blank"
            rel="noopener noreferrer"
            orientation="horizontal"
            variant="naked"
            :reverse="index % 2 === 1"
            class="group"
            :ui="{
              wrapper: 'max-sm:order-last'
            }"
          >
            <template #title>
              <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
                {{ project.title }}
              </h2>
            </template>
            <template #leading>
              <span class="text-base text-muted">
                {{ project.tag }}
              </span>
            </template>
            <template #footer>
              <div class="flex flex-wrap items-center gap-2">
                <UBadge
                  v-for="tag in project.tags"
                  :key="tag._id"
                  :label="tag.title"
                  color="primary"
                  variant="subtle"
                  size="xs"
                />
                <UIcon
                  name="i-lucide-external-link"
                  class="size-3.5 text-dimmed me-auto"
                  aria-hidden="true"
                />
                <span class="sr-only">يفتح في تبويب جديد</span>
              </div>
            </template>
            <div class="aspect-video w-full overflow-hidden rounded-lg bg-elevated/40 ring-1 ring-default/60">
              <NuxtImg
                :src="project.image"
                :alt="project.altText || project.title"
                width="1152"
                height="648"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                class="object-cover w-full h-full"
              />
            </div>
          </UPageCard>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
