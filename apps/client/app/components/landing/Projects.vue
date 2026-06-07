<script setup>
const { cloudinary } = useRuntimeConfig().public

const {
  data: featuredProjects,
  error: projectsError,
  refresh: refreshProjects
} = await useAPI('/projects', {
  key: 'landing-projects',
  query: { isActive: true, limit: 3 },
  default: () => [],
  transform: (response) =>
    (response.data || []).slice(0, 3).map(project => ({
      ...project,
      image: project.image?.startsWith('http')
        ? project.image
        : `${cloudinary.cloudinaryUrl}${project.image}`
    }))
})
</script>

<template>
  <LandingSectionFallback
    v-if="projectsError"
    state="error"
    eyebrow="المشاريع"
    title="أبرز المشاريع"
    message="تعذّر جلب المشاريع من الخادم. حاول مرة أخرى أو تصفح المشاريع بالكامل."
    alt-action-label="كل المشاريع"
    alt-action-to="/projects"
    @retry="refreshProjects()"
  />
  <section
    v-else-if="featuredProjects?.length"
    class="py-12 sm:py-16"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <LandingSectionHeading
        class="lg:col-span-4"
        eyebrow="المشاريع"
        title="أبرز المشاريع"
        description="نماذج من أعمالي في تطوير الويب، بناء واجهات حديثة وتطبيقات عالية الأداء."
        to="/projects"
        link-label="كل المشاريع"
      />

      <div class="lg:col-span-8 space-y-4">
        <NuxtLink
          v-for="(project, i) in featuredProjects"
          :key="project._id"
          :to="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="animate-fade-in group flex items-start gap-4 rounded-xl border border-default/60 bg-elevated/30 p-4 sm:p-5 hover:bg-elevated/60 hover:border-primary/30 transition-colors duration-300"
          :style="`animation-delay: ${i * 0.12}s`"
        >
          <div class="flex-1 min-w-0 text-right">
            <p class="text-xs font-medium text-primary mb-1">{{ project.tag }}</p>
            <h3 class="font-semibold text-base text-highlighted leading-snug line-clamp-1">
              {{ project.title }}
            </h3>
            <p class="text-sm text-muted mt-1 line-clamp-2 leading-relaxed">
              {{ project.description }}
            </p>
            <div
              v-if="project.tags?.length"
              class="flex flex-wrap justify-end gap-1.5 mt-2.5"
            >
              <UBadge
                v-for="tag in project.tags.slice(0, 3)"
                :key="tag._id"
                :label="tag.title"
                color="primary"
                variant="subtle"
                size="xs"
              />
            </div>
          </div>

          <div class="shrink-0 relative overflow-hidden rounded-lg w-24 h-16">
            <NuxtImg
              :src="project.image"
              :alt="project.altText || project.title"
              width="96"
              height="64"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <UIcon
            name="i-lucide-arrow-left"
            class="size-4 text-primary self-center shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-200"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
