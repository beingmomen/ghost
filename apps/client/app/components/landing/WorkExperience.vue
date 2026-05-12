<script setup>
const experiences = useExperiences()
</script>

<template>
  <UPageSection
    v-if="experiences.length"
    title="الخبرات العملية"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-right text-xl sm:text-xl lg:text-2xl font-medium'
    }"
  >
    <template #description>
      <div
        dir="ltr"
        class="flex flex-col gap-2"
      >
        <div
          v-for="(experience, index) in experiences"
          :key="experience.company"
          class="animate-fade-in"
          :style="`animation-delay: ${0.4 + 0.2 * index}s`"
        >
          <ULink
            :to="experience.companySiteUrl"
            target="_blank"
            class="flex items-baseline justify-between gap-4 py-2 group"
          >
            <span class="text-base text-dimmed whitespace-nowrap">
              {{ formatArabicDate(experience.startDate) }} – {{ formatArabicDate(experience.endDate) }}
            </span>
            <span class="text-base text-muted whitespace-nowrap">
              <span class="font-semibold text-primary group-hover:underline">{{ experience.company }}</span>
              <span> في </span>
              <span>
                {{ experience.position }}
              </span>
            </span>
          </ULink>
          <USeparator
            v-if="index < experiences.length - 1"
          />
        </div>
      </div>
    </template>
  </UPageSection>
</template>
