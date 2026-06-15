<script setup>
const { data } = useNuxtData('landing')

defineProps({
  apiError: {
    type: [Object, Error, null],
    default: null
  }
})
const emit = defineEmits(['retry'])
</script>

<template>
  <LandingSectionFallback
    v-if="apiError"
    state="error"
    eyebrow="آراء العملاء"
    title="ماذا قال عملاؤنا"
    message="تعذّر جلب تقييمات العملاء من الخادم. حاول مرة أخرى أو تواصل معي مباشرة."
    alt-action-label="تواصل معي"
    alt-action-to="/contact"
    @retry="emit('retry')"
  />
  <UPageSection
    v-else
    :ui="{ container: 'px-0 !pt-0' }"
  >
    <TestimonialCarousel :items="data?.testimonials || []" />
  </UPageSection>
</template>
