<script setup>
const { cloudinary } = useRuntimeConfig().public

const hover = projectHover({ imageScale: '105' })

// `useAPI` unwraps the { status, data, ... } envelope, so `data` is the array of
// featured projects (populated + isActive-filtered + ordered, already capped at ≤3).
const {
  data: projects,
  error: projectsError,
  refresh: refreshProjects
} = await useAPI('/home-featured/populated', {
  key: 'landing-projects'
})

const featuredProjects = computed(() => {
  const list = Array.isArray(projects.value) ? projects.value : []
  return list.map((project) => {
    const src = project.image?.startsWith('http')
      ? project.image
      : `${cloudinary.cloudinaryUrl}${project.image}`
    return {
      ...project,
      image: optimizeCloudinary(src, cloudinaryTransformFor(src, 'thumb')),
      link: projectLink(project)
    }
  })
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
    class="-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/20 px-4 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-(--ui-container) mx-auto">
      <LandingSectionHeading
        class="lg:col-span-4"
        eyebrow="المشاريع"
        title="أبرز المشاريع"
        description="نماذج حقيقية من شغلي في الويب — واجهات وتطبيقات بُنيت بإتقان."
        to="/projects"
        link-label="كل المشاريع"
      />

      <div class="lg:col-span-8 space-y-4">
        <div
          v-for="(project, i) in featuredProjects"
          :key="project._id"
          :class="`animate-fade-in group relative flex items-start gap-4 rounded-xl border border-default/60 bg-elevated/30 p-4 sm:p-5 ${hover.card}`"
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
              v-if="project.skills?.length"
              class="flex flex-wrap justify-end gap-1.5 mt-2.5"
            >
              <UBadge
                v-for="skill in project.skills.slice(0, 3)"
                :key="skill._id"
                :label="skill.title"
                color="primary"
                variant="subtle"
                size="xs"
              />
            </div>
          </div>

          <div class="shrink-0 relative overflow-hidden rounded-lg w-24 h-16">
            <CommonProjectImage
              :src="project.image"
              :alt="project.altText || project.title"
              width="96"
              height="64"
              :loading="i === 0 ? 'eager' : 'lazy'"
              :fetchpriority="i === 0 ? 'high' : 'auto'"
              :image-class="`w-full h-full object-cover ${hover.image}`"
            />
          </div>

          <CommonProjectExternalLink :project="project" />

          <UIcon
            name="i-lucide-arrow-left"
            :class="`size-4 text-primary self-center shrink-0 ${hover.arrow}`"
          />

          <NuxtLink
            :to="project.link.to"
            :target="project.link.target"
            :rel="project.link.rel"
            :aria-label="project.title"
            class="absolute inset-0"
          />
        </div>
      </div>
    </div>
  </section>
  <LandingSectionFallback
    v-else
    state="empty"
    eyebrow="المشاريع"
    title="أبرز المشاريع"
    message="لا توجد مشاريع مميّزة حالياً. تصفّح كل المشاريع للاطّلاع على أعمالي."
    alt-action-label="كل المشاريع"
    alt-action-to="/projects"
  />
</template>
