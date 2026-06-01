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
  <section
    v-if="latestBlogs.length"
    class="py-12 sm:py-16"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <LandingSectionHeading
        class="lg:col-span-4"
        eyebrow="المدونة"
        title="آخر المقالات"
        description="اطلع على أحدث المقالات والمواضيع التقنية التي أشاركها من واقع العمل."
        to="/blog"
        link-label="كل المقالات"
      />

      <UBlogPosts
        orientation="vertical"
        class="lg:col-span-8 gap-4 lg:gap-y-4"
      >
        <UBlogPost
          v-for="post in latestBlogs"
          :key="post.path"
          orientation="horizontal"
          variant="naked"
          v-bind="post"
          :to="post.path"
          :ui="{
            root: 'group relative lg:items-start lg:flex rounded-xl border border-default/60 bg-elevated/30 p-4 sm:p-5 hover:bg-elevated/60 hover:border-primary/30 transition-colors duration-300 cursor-pointer',
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
    </div>
  </section>
</template>
