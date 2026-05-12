<script setup>
defineProps({
  badge: { type: String, required: true },
  title: { type: String, required: true },
  highlight: { type: String, default: '' },
  description: { type: String, required: true }
})
</script>

<template>
  <div>
    <UPageHero
      :ui="{
        container: 'py-12 sm:py-16 lg:py-20',
        title: 'text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'text-md max-w-xl text-muted',
        links: 'mt-4'
      }"
    >
      <template #headline>
        <span class="animate-fade-in">
          <UBadge
            :label="badge"
            color="primary"
            variant="soft"
            size="lg"
          />
        </span>
      </template>

      <template #title>
        <span class="animate-fade-in animation-delay-200">
          {{ title }} <span
            v-if="highlight"
            class="text-gradient"
          >{{ highlight }}</span>
        </span>
      </template>

      <template #description>
        <span class="animate-fade-in animation-delay-400">
          {{ description }}
        </span>
      </template>

      <template #links>
        <span class="animate-fade-in animation-delay-600">
          <UButton
            label="العودة للقرارات المعمارية"
            to="/adr"
            color="neutral"
            variant="ghost"
            size="md"
            icon="i-lucide-arrow-right"
          />
        </span>
      </template>
    </UPageHero>
  </div>
</template>
