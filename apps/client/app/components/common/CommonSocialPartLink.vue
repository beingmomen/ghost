<template>
  <NuxtLink
    :to="to"
    target="_blank"
    :aria-label="label"
    class="inline-flex items-center justify-center min-w-11 min-h-11 p-1.5 rounded-lg hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-opacity"
    rel="noopener noreferrer"
  >
    <template v-if="icon">
      <UIcon
        :name="icon"
        class="size-10"
      />
    </template>
    <template v-else-if="image">
      <NuxtImg
        provider="cloudinary"
        :src="image"
        :alt="label"
        class="w-8 min-w-8 h-8 object-cover"
        width="32"
        height="32"
        format="webp"
        loading="lazy"
      />
    </template>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
})
</script>
