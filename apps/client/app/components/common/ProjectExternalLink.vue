<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <a
    v-if="project.detailSlug"
    :href="project.url"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`الموقع الخارجي لـ ${project.title}`"
    class="relative z-10 inline-flex items-center justify-center text-dimmed transition-colors hover:text-primary"
  >
    <UIcon
      name="i-lucide-external-link"
      class="size-3.5"
      aria-hidden="true"
    />
  </a>
</template>
