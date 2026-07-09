<script setup>
// Wrapper around <NuxtImg> that swaps in an amber-tinted placeholder when the image
// fails to load (broken Cloudinary URL) instead of leaving an empty box. `@error` is a
// re-emitted native <img> error event, so it fires on real load failures.
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  loading: { type: String, default: 'lazy' },
  fetchpriority: { type: String, default: 'auto' },
  imageClass: { type: String, default: '' }
})

const failed = ref(false)

const showImage = computed(() => !failed.value && !!props.src)

// Amber-tinted fallback (DESIGN.md: primary amber #fbbf24, text-amber #d97706), 16:9.
const placeholder = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 18" fill="none">'
  + '<rect width="32" height="18" fill="#fbbf24" fill-opacity="0.1"/>'
  + '<g transform="translate(12 5)" stroke="#d97706" stroke-width="1" '
  + 'stroke-linecap="round" stroke-linejoin="round">'
  + '<rect x="0" y="0" width="8" height="8" rx="1"/>'
  + '<circle cx="2.5" cy="2.5" r="0.9"/>'
  + '<path d="m8 6-2.2-2.2L2 8"/></g></svg>'
)}`
</script>

<template>
  <NuxtImg
    v-if="showImage"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :class="imageClass"
    @error="failed = true"
  />
  <img
    v-else
    :src="placeholder"
    :alt="alt"
    :class="imageClass"
  >
</template>
