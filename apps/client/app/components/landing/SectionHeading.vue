<script setup>
// Sticky side-heading used by the asymmetric landing sections (Blog, FAQ).
// Sits in a narrow grid column while the content flows beside it.
defineProps({
  eyebrow: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  },
  linkLabel: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="lg:sticky lg:top-24 self-start text-right">
    <p
      v-if="eyebrow"
      class="flex items-center justify-end gap-2 text-sm font-medium text-primary mb-3"
    >
      {{ eyebrow }}
      <span
        class="inline-block w-8 h-px bg-primary/50"
        aria-hidden="true"
      />
    </p>

    <h2
      class="font-display font-bold text-3xl sm:text-4xl leading-tight text-balance"
    >
      {{ title }}
    </h2>

    <p
      v-if="description"
      class="mt-4 text-base text-muted leading-relaxed"
    >
      {{ description }}
    </p>

    <slot />

    <UButton
      v-if="to"
      :to="to"
      :label="linkLabel"
      variant="link"
      class="px-0 mt-5 gap-1"
      trailing-icon="i-lucide-arrow-left"
    />
  </div>
</template>
