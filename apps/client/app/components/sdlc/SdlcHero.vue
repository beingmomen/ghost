<script setup>
defineProps({
  phases: {
    type: Array,
    required: true
  },
  badgeLabel: {
    type: String,
    default: 'Architect Playbook · OOA&D'
  },
  title: {
    type: String,
    default: 'Software Development'
  },
  titleHighlight: {
    type: String,
    default: 'Life Cycle'
  },
  description: {
    type: String,
    default: 'A cognitive visual framework for system thinkers — transforming SDLC theory into an interactive mental model for Object Oriented Analysis & Design.'
  },
  buttonLabel: {
    type: String,
    default: 'Explore Phases'
  },
  arrowIcon: {
    type: String,
    default: 'i-lucide-arrow-right'
  }
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
            :label="badgeLabel"
            color="primary"
            variant="soft"
            size="sm"
            icon="i-lucide-book-open"
          />
        </span>
      </template>

      <template #title>
        <span class="animate-fade-in animation-delay-200">
          {{ title }} <span class="text-gradient">{{ titleHighlight }}</span>
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
            :label="buttonLabel"
            to="#analysis"
            color="primary"
            size="md"
            trailing-icon="i-lucide-arrow-down"
          />
        </span>
      </template>
    </UPageHero>

    <UPageSection :ui="{ container: '!pt-0 pb-8 sm:pb-12 lg:pb-16' }">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(phase, index) in phases"
          :key="phase.id"
          class="animate-fade-in"
          :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
        >
          <a
            :href="`#${phase.id}`"
            class="flex items-center gap-3 rounded-xl border border-default/60 bg-elevated/30 p-4 hover:bg-elevated/60 transition-colors duration-300 group"
          >
            <span class="text-lg font-bold text-primary">{{ phase.num }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-base font-semibold">
                {{ phase.title }}
              </div>
              <div class="text-base text-muted">
                {{ phase.tagline }}
              </div>
            </div>
            <UIcon
              :name="arrowIcon"
              class="size-4 text-muted group-hover:text-primary transition-colors shrink-0"
            />
          </a>
        </div>
      </div>
    </UPageSection>
  </div>
</template>
