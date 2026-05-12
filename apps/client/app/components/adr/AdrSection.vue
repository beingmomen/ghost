<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  badge: { type: String, default: '' }
})
</script>

<template>
  <UPageSection
    :id="id"
    :title="title"
    :description="description || undefined"
    :ui="{
      container: 'py-6 sm:py-8 scroll-mt-20',
      title: 'text-right text-xl sm:text-2xl font-medium',
      description: 'text-right text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <template
      v-if="badge || icon"
      #headline
    >
      <UBadge
        v-if="badge"
        :label="badge"
        color="primary"
        variant="soft"
        size="sm"
        :icon="icon"
      />
      <div
        v-else-if="icon"
        class="flex items-center gap-2"
      >
        <div class="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <UIcon
            :name="icon"
            class="size-4 text-primary"
          />
        </div>
      </div>
    </template>

    <slot />
  </UPageSection>
</template>
