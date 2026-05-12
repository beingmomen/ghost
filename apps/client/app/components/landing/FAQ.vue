<script setup>
const { data: landing } = useNuxtData('landing')

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
  root: 'flex items-center gap-4 w-full',
  list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0',
  indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
  trigger: 'px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted',
  label: 'truncate'
}
</script>

<template>
  <UPageSection
    v-if="items.length"
    :title="faqData.title"
    :description="faqData.description"
    :ui="{
      container: 'px-0 !pt-0 gap-4 sm:gap-4',
      title: 'text-right text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-right mt-2 text-base sm:text-lg lg:text-base text-muted leading-relaxed'
    }"
  >
    <UTabs
      :items="items"
      orientation="horizontal"
      :ui="ui"
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
  </UPageSection>
</template>
