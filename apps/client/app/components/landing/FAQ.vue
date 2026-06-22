<script setup>
const { data: landing } = useNuxtData('landing')

defineProps({
  apiError: {
    type: [Object, Error, null],
    default: null
  }
})
const emit = defineEmits(['retry'])

const faqData = computed(() => {
  const faqs = landing.value?.faqs || []
  // Group by category
  const categoryMap = {}
  for (const faq of faqs) {
    if (!categoryMap[faq.category]) {
      categoryMap[faq.category] = []
    }
    categoryMap[faq.category].push({
      label: faq.question,
      content: faq.answer
    })
  }
  return {
    title: 'الأسئلة الشائعة',
    description: 'إجابات على الأسئلة الأكثر شيوعاً',
    categories: Object.entries(categoryMap).map(([title, questions]) => ({
      title,
      questions
    }))
  }
})

const items = computed(() => {
  return (faqData.value.categories || []).map(faq => ({
    label: faq.title,
    key: faq.title.toLowerCase(),
    questions: faq.questions
  }))
})

const allQuestions = computed(() =>
  (faqData.value.categories || []).flatMap(c => c.questions)
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': allQuestions.value.map(q => ({
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

const ui = {
  // Mobile: stack the category row above the panels so it gets full width.
  // The old flex-row squeezed the list beside the content and forced truncation.
  // Desktop (lg) keeps the side-by-side layout.
  root: 'flex flex-col lg:flex-row lg:items-center gap-4 w-full',
  // Scroll the category row horizontally instead of truncating labels when they
  // overflow; min-w-0 lets the flex child become a scroll container.
  list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0 min-w-0 overflow-x-auto',
  indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
  trigger: 'shrink-0 px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted',
  label: 'whitespace-nowrap'
}
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
    v-else-if="items.length"
    class="py-12 sm:py-16 lg:py-20"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <LandingSectionHeading
        class="lg:col-span-4"
        eyebrow="الأسئلة الشائعة"
        title="ما الذي تودّ معرفته؟"
        :description="faqData.description"
      />

      <UTabs
        :items="items"
        orientation="horizontal"
        :ui="ui"
        class="lg:col-span-8"
      >
        <template #content="{ item }">
          <UAccordion
            trailing-icon="i-lucide-plus"
            :items="item.questions"
            :unmount-on-hide="false"
            :ui="{
              item: 'border-none',
              trigger: 'mb-2 border-0 group px-4 transform-gpu rounded-lg bg-elevated/60 will-change-transform hover:bg-muted/50 text-base',
              trailingIcon: 'group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-135 text-base text-muted'
            }"
          >
            <template #body="{ item: _item }">
              <p class="px-4 text-muted">
                {{ _item.content }}
              </p>
            </template>
          </UAccordion>
        </template>
      </UTabs>
    </div>
  </section>
</template>
