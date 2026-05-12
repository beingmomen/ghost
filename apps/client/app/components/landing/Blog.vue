<script setup>
const { cloudinary } = useRuntimeConfig().public

const { data: blogs } = await useFetch('/api/blog', {
  key: 'blogs',
  default: () => [],
  transform: blogs => blogs.map(blog => ({
    ...blog,
    image: blog.image?.startsWith('http') ? blog.image : `${cloudinary.cloudinaryUrl}${blog.image}`
  }))
})

const latestBlogs = computed(() => {
  return (blogs.value || []).slice(0, 3).map(blog => ({
    title: blog.title,
    description: blog.description,
    date: blog.createdAt,
    path: `/blog/${blog.slug}`,
    to: `/blog/${blog.slug}`
  }))
})
</script>

<template>
  <UPageSection
    title="آخر المقالات"
    description="اطلع على أحدث المقالات والمواضيع التقنية"
    :ui="{
      container: 'px-0 !pt-4 sm:gap-4 lg:gap-6',
      title: 'text-right text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-right mt-2 text-base sm:text-lg lg:text-base text-muted leading-relaxed'
    }"
  >
    <UBlogPosts
      orientation="vertical"
      class="gap-4 lg:gap-y-4"
    >
      <UBlogPost
        v-for="post in latestBlogs"
        :key="post.path"
        orientation="horizontal"
        variant="naked"
        v-bind="post"
        :to="post.path"
        :ui="{
          root: 'group relative lg:items-start lg:flex rounded-xl border border-default/60 bg-elevated/30 p-4 sm:p-5 hover:bg-elevated/60 transition-colors duration-300 cursor-pointer',
          body: '!px-0',
          header: 'hidden'
        }"
      >
        <template #footer>
          <UButton
            size="xs"
            variant="link"
            class="px-0 gap-0"
            label="اقرأ المقال"
          >
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-left"
                class="size-4 text-primary transition-all opacity-0 group-hover:-translate-x-1 group-hover:opacity-100"
              />
            </template>
          </UButton>
        </template>
      </UBlogPost>
    </UBlogPosts>
  </UPageSection>
</template>
