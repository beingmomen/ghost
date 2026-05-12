<script setup>
const config = useRuntimeConfig()
const { cloudinary } = config.public

const { data: projects } = await useAPI('/projects', {
  key: 'projects',
  query: { isActive: true },
  transform: (response) => {
    return (response.data || []).map(project => ({
      ...project,
      image: project.image?.startsWith('http') ? project.image : `${cloudinary.cloudinaryUrl}${project.image}`
    }))
  }
})

const { global } = useAppConfig()

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
        description: '!mx-0 text-right',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div class="flex items-center gap-2">
          <UButton
            label="تواصل معي"
            :to="global.meetingLink"
            target="_blank"
            color="primary"
          />
          <UButton
            label="أرسل بريد"
            :to="`mailto:${global.email}`"
            color="neutral"
            variant="outline"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div
        v-for="(project, index) in projects"
        :key="project._id"
      >
        <UPageCard
          :title="project.title"
          :description="project.description"
          :to="project.url"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #leading>
            <span class="text-base text-muted">
              {{ project.tag }}
            </span>
          </template>
          <template #footer>
            <div class="flex flex-wrap gap-2 mb-3">
              <UBadge
                v-for="tag in project.tags"
                :key="tag._id"
                :label="tag.title"
                color="primary"
                variant="subtle"
                size="xs"
              />
            </div>
            <ULink
              :to="project.url"
              target="_blank"
              class="text-base text-primary flex items-center"
            >
              عرض المشروع
              <UIcon
                name="i-lucide-arrow-left"
                class="size-4 text-primary transition-all opacity-0 group-hover:-translate-x-1 group-hover:opacity-100"
              />
            </ULink>
          </template>
          <NuxtImg
            :src="project.image"
            :alt="project.altText || project.title"
            width="400"
            height="192"
            loading="lazy"
            class="object-cover w-full h-48 rounded-lg"
          />
        </UPageCard>
      </div>
    </UPageSection>
  </UPage>
</template>
