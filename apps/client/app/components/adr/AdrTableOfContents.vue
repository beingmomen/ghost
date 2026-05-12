<script setup>
const props = defineProps({
  sections: {
    type: Array,
    required: true
    // Each section: { id, label }
  }
})

const activeId = ref('')

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
  )

  for (const section of props.sections) {
    const el = document.getElementById(section.id)
    if (el) observer.observe(el)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <nav class="sticky top-24 space-y-1 text-right">
    <div class="flex items-center justify-end gap-2 mb-3 px-3">
      <span class="text-base font-semibold">الفهرس</span>
      <UIcon
        name="i-lucide-list"
        class="size-4 text-primary"
      />
    </div>
    <a
      v-for="section in sections"
      :key="section.id"
      :href="`#${section.id}`"
      class="flex items-center justify-end gap-2 px-3 py-1.5 rounded-lg text-base transition-colors duration-200"
      :class="activeId === section.id
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted hover:text-highlighted hover:bg-elevated/60'"
    >
      {{ section.label }}
      <span
        class="size-1.5 rounded-full shrink-0"
        :class="activeId === section.id ? 'bg-primary' : 'bg-muted/40'"
      />
    </a>
  </nav>
</template>
