<script setup>
const { cloudinary } = useRuntimeConfig().public

const { data, status, refresh } = await useFetch('/api/blog', {
  key: 'blogs',
  default: () => [],
  transform: blogs => blogs.map(blog => ({
    ...blog,
    image: blog.image?.startsWith('http') ? blog.image : `${cloudinary.cloudinaryUrl}${blog.image}`
  }))
})

const posts = computed(() => {
  return (data.value || []).map(blog => ({
    title: blog.title,
    description: blog.description,
    image: {
      src: blog.image,
      alt: blog.title
    },
    date: blog.createdAt,
    path: `/blog/${blog.slug}`
  }))
})

const page = ref(1)
const pageSize = 6

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize
  return posts.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(posts.value.length / pageSize))

const config = useRuntimeConfig()
const pageDescription = 'اكتشف أحدث المقالات والمدونات حول تطوير الويب والبرمجة وأفضل الممارسات في عالم التكنولوجيا'

useSeoMeta({
  title: 'المدونة | عبدالمؤمن الشطوري',
  ogTitle: 'المدونة | عبدالمؤمن الشطوري',
  description: pageDescription,
  ogDescription: pageDescription,
  ogUrl: `${config.public.siteUrl}/blog`,
  ogType: 'website',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'المدونة | عبدالمؤمن الشطوري',
  twitterDescription: pageDescription,
  twitterSite: '@beingmomen',
  keywords: 'مدونة, برمجة, تطوير الويب, جافا سكريبت, vue.js, nuxt.js, تقنية'
})

useBreadcrumbSchema([{ name: 'المدونة', path: '/blog' }])

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'المدونة - عبدالمؤمن الشطوري',
        'description': pageDescription,
        'url': `${config.public.siteUrl}/blog`,
        'blogPost': (posts.value || []).map(post => ({
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.description,
          'image': post.image?.src,
          'datePublished': post.date,
          'url': `${config.public.siteUrl}${post.path}`
        }))
      })
    }
  ]
})
</script>

<template>
  <UPage>
    <UPageHero
      title="المدونة"
      description="اكتشف أحدث المقالات والمواضيع التقنية حول تطوير الويب والبرمجة"
      :ui="{
        title: '!mx-0 text-right',
        description: '!mx-0 text-right'
      }"
    />

    <UPageSection :ui="{ container: '!pt-0' }">
      <template v-if="posts.length">
        <UBlogPosts orientation="vertical">
          <UBlogPost
            v-for="(post, index) in paginatedPosts"
            :key="post.path"
            variant="naked"
            orientation="horizontal"
            :to="post.path"
            v-bind="post"
            :ui="{
              root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
              image: 'group-hover/blog-post:scale-105 rounded-lg shadow-lg border-4 border-muted ring-2 ring-default',
              header: index % 2 === 0
                ? 'sm:-rotate-1 overflow-visible'
                : 'sm:rotate-1 overflow-visible'
            }"
          />
        </UBlogPosts>

        <div
          v-if="totalPages > 1"
          class="flex justify-center mt-8"
        >
          <UPagination
            v-model="page"
            :total="posts.length"
            :items-per-page="pageSize"
          />
        </div>
      </template>

      <div
        v-else-if="status === 'error'"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-cloud-off"
          class="size-12 text-muted mx-auto mb-4"
        />
        <p class="text-muted mb-4">
          تعذّر تحميل المقالات. حاول مرة أخرى بعد لحظات.
        </p>
        <UButton
          label="حاول مرة أخرى"
          icon="i-lucide-refresh-cw"
          color="primary"
          variant="soft"
          @click="refresh()"
        />
      </div>

      <div
        v-else
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-file-text"
          class="size-12 text-muted mx-auto mb-4"
        />
        <p class="text-muted">
          لا توجد مقالات حالياً
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>
