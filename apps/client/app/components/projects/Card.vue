<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const hover = projectHover({ imageScale: '103' })
const link = computed(() => projectLink(props.project))
</script>

<template>
  <UPageCard
    :description="project.description"
    :to="link.to"
    :target="link.target"
    :rel="link.rel"
    orientation="horizontal"
    variant="naked"
    :reverse="index % 2 === 1"
    :class="`group ${hover.card}`"
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
          v-for="skill in project.skills"
          :key="skill._id"
          :label="skill.title"
          color="primary"
          variant="subtle"
          size="xs"
        />
        <template v-if="!project.detailSlug">
          <UIcon
            name="i-lucide-external-link"
            class="size-3.5 text-dimmed me-auto"
            aria-hidden="true"
          />
          <span class="sr-only">يفتح في تبويب جديد</span>
        </template>
        <CommonProjectExternalLink
          v-else
          :project="project"
          class="me-auto"
        />
        <UIcon
          name="i-lucide-arrow-left"
          :class="`size-4 text-primary ${hover.arrow}`"
          aria-hidden="true"
        />
      </div>
    </template>
    <div class="aspect-video w-full overflow-hidden rounded-lg bg-elevated/40 ring-1 ring-default/60">
      <CommonProjectImage
        :src="project.image"
        :alt="project.altText || project.title"
        width="1152"
        height="648"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : 'auto'"
        :image-class="`object-cover w-full h-full ${hover.image}`"
      />
    </div>
  </UPageCard>
</template>
