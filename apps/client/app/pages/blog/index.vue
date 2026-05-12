<script setup>
const { cloudinary } = useRuntimeConfig().public

const { data, status } = await useFetch('/api/blog', {
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
      <div
        v-if="status === 'pending'"
        class="space-y-8"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="md:grid md:grid-cols-2 gap-8"
        >
          <USkeleton class="h-48 rounded-lg" />
          <div class="space-y-4 mt-4 md:mt-0">
            <USkeleton class="h-6 w-3/4" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </div>
      </div>

      <template v-else-if="posts.length">
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
