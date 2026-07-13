<script setup>
const { data: landing } = useNuxtData('landing')

defineProps({
  apiError: {
    type: [Object, Error, null],
    default: null
  }
})
const emit = defineEmits(['retry'])

// FAQ is a single lean set (availability / collaboration) — no category filter.
const questions = computed(() =>
  (landing.value?.faqs || []).map(faq => ({
    label: faq.question,
    content: faq.answer
  }))
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': questions.value.map(q => ({
          '@type': 'Question',
          'name': q.label,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': q.content
          }
        }))
      }))
    }
  ]
})
</script>

<template>
  <LandingSectionFallback
    v-if="apiError"
    state="error"
    eyebrow="الأسئلة الشائعة"
    title="ما الذي تودّ معرفته؟"
    message="تعذّر جلب الأسئلة الشائعة من الخادم. حاول مرة أخرى بعد لحظات."
    @retry="emit('retry')"
  />
  <section
    v-else-if="questions.length"
    class="py-12 sm:py-16 lg:py-20"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <LandingSectionHeading
        class="lg:col-span-4"
        eyebrow="الأسئلة الشائعة"
        title="ما الذي تودّ معرفته؟"
        description="إجابات على الأسئلة الأكثر شيوعاً"
      />

      <UAccordion
        class="lg:col-span-8"
        trailing-icon="i-lucide-plus"
        :items="questions"
        :unmount-on-hide="false"
        :ui="{
          item: 'border-none',
          trigger: 'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50 text-base',
          trailingIcon: 'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135 text-base text-muted'
        }"
      >
        <template #body="{ item }">
          <p class="px-4 text-muted">
            {{ item.content }}
          </p>
        </template>
      </UAccordion>
    </div>
  </section>
</template>
