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
    :ui="{ container: 'px-0 !p-0' }"
  >
    <div class="text-center max-w-2xl mx-auto px-4 mb-8 sm:mb-10">
      <p class="flex items-center justify-center gap-2 text-sm font-medium text-primary mb-3">
        <span
          class="inline-block w-8 h-px bg-primary/50"
          aria-hidden="true"
        />
        آراء العملاء
        <span
          class="inline-block w-8 h-px bg-primary/50"
          aria-hidden="true"
        />
      </p>
      <h2 class="font-display font-bold text-3xl sm:text-4xl leading-tight text-balance">
        آراء عملاء وثقوا بالشغل
      </h2>
      <p class="mt-4 text-base text-muted leading-relaxed">
        كلمات من ناس اشتغلت معاهم فعلاً.
      </p>
    </div>
    <TestimonialCarousel :items="data?.testimonials || []" />
  </UPageSection>
</template>
