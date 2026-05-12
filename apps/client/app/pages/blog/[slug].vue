<script setup>
import DOMPurify from 'isomorphic-dompurify'

const route = useRoute()
const config = useRuntimeConfig()

const { data: singleBlog } = await useAPI(`/blogs/slug/${route.params.slug}`, {
  key: `blog-${route.params.slug}`,
  default: () => ({}),
  transform: response => response?.data || {}
})

provide('singleBlog', singleBlog)

const sanitizedContent = computed(() =>
  singleBlog.value?.content ? DOMPurify.sanitize(singleBlog.value.content) : ''
)

const blogTitle = computed(
  () => singleBlog.value.title || 'مقال - عبدالمؤمن الشطوري'
)
const blogDescription = computed(
  () => singleBlog.value.description || 'مقال من مدونة عبدالمؤمن الشطوري'
)
const blogImage = computed(() =>
  singleBlog.value.image
    ? (singleBlog.value.image.startsWith('http') ? singleBlog.value.image : `${config.public.cloudinary.cloudinaryUrl}${singleBlog.value.image}`)
    : `${config.public.siteUrl}/favicon.ico`
)
const blogUrl = computed(
  () => `${config.public.siteUrl}/blog/${route.params.slug}`
)

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

useSeoMeta({
  title: blogTitle,
  description: blogDescription,
  keywords: () =>
    singleBlog.value.keywords || 'مقال, برمجة, تطوير, عبدالمؤمن الشطوري',
  author: 'عبدالمؤمن الشطوري',
  ogTitle: blogTitle,
  ogDescription: blogDescription,
  ogImage: blogImage,
  ogUrl: blogUrl,
  ogType: 'article',
  ogSiteName: 'عبدالمؤمن الشطوري',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: blogTitle,
  twitterDescription: blogDescription,
  twitterImage: blogImage,
  twitterSite: '@beingmomen',
  twitterCreator: '@beingmomen',
  articleAuthor: 'عبدالمؤمن الشطوري',
  articlePublishedTime: () => singleBlog.value.createdAt,
  articleModifiedTime: () =>
    singleBlog.value.updatedAt || singleBlog.value.createdAt,
  articleSection: 'تقنية',
  articleTag: () => singleBlog.value?.tags || ['برمجة', 'تطوير']
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: blogUrl
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': singleBlog.value.title,
          'description': singleBlog.value.description,
          'image': blogImage.value,
          'author': {
            '@type': 'Person',
            'name': 'عبدالمؤمن الشطوري',
            'url': config.public.siteUrl,
            'sameAs': [
              'https://github.com/beingmomen',
              'https://twitter.com/beingmomen'
            ]
          },
          'publisher': {
            '@type': 'Person',
            'name': 'عبدالمؤمن الشطوري',
            'url': config.public.siteUrl
          },
          'datePublished': singleBlog.value.createdAt,
          'dateModified':
            singleBlog.value.updatedAt || singleBlog.value.createdAt,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${config.public.siteUrl}/blog/${route.params.slug}`
          }
        })
    }
  ]
})

useBreadcrumbSchema([
  { name: 'المدونة', path: '/blog' },
  { name: singleBlog.value?.title || route.params.slug, path: `/blog/${route.params.slug}` }
])
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="singleBlog?.title">
        <ULink
          to="/blog"
          class="text-base flex items-center gap-1"
        >
          <UIcon name="i-lucide-chevron-right" />
          المقالات
        </ULink>
        <div class="flex flex-col gap-3 mt-8">
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="singleBlog.createdAt">
              {{ formatDate(singleBlog.createdAt) }}
            </span>
            <span v-if="singleBlog.createdAt && singleBlog.minRead">
              -
            </span>
            <span v-if="singleBlog.minRead">
              {{ singleBlog.minRead }} دقائق قراءة
            </span>
          </div>
          <NuxtImg
            v-if="singleBlog.image"
            :src="blogImage"
            :alt="singleBlog.title"
            class="rounded-lg w-full h-75 object-cover object-center"
          />
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ singleBlog.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ singleBlog.description }}
          </p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              name="عبدالمؤمن الشطوري"
              description="Frontend Engineer"
              :avatar="{
                src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
                alt: 'عبدالمؤمن الشطوري'
              }"
            />
          </div>
        </div>
        <UPageBody>
          <!-- eslint-disable vue/no-v-html -->
          <article v-html="sanitizedContent" />
          <!-- eslint-enable vue/no-v-html -->
        </UPageBody>

        <template #right>
          <BlogSidebar />
        </template>
      </UPage>

      <div
        v-else
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <UIcon
          name="i-lucide-file-x"
          class="size-16 text-muted mb-4"
        />
        <h1 class="text-2xl font-bold mb-2">
          المقال غير موجود
        </h1>
        <p class="text-muted mb-6">
          لم نتمكن من العثور على المقال المطلوب
        </p>
        <UButton
          label="العودة للمدونة"
          to="/blog"
          color="primary"
          icon="i-lucide-chevron-right"
        />
      </div>
    </UContainer>
  </UMain>
</template>
