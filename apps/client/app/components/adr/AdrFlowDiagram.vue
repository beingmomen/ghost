<script setup>
defineProps({
  steps: {
    type: Array,
    required: true
    // Each step: { title, description, icon, color? }
  },
  direction: { type: String, default: 'vertical' }
})
</script>

<template>
  <div :class="direction === 'horizontal' ? 'flex flex-wrap items-start gap-3' : 'space-y-0'">
    <div
      v-for="(step, index) in steps"
      :key="step.title"
    >
      <div
        class="animate-fade-in"
        :class="direction === 'horizontal' ? 'flex-1 min-w-50' : ''"
        :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
      >
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-4 hover:bg-elevated/60 transition-colors duration-300">
          <div class="flex items-center gap-3">
            <div
              class="size-8 rounded-xl flex items-center justify-center shrink-0"
              :class="step.color ? `bg-${step.color}/10` : 'bg-primary/10'"
            >
              <UIcon
                :name="step.icon || 'i-lucide-circle-dot'"
                class="size-4"
                :class="step.color ? `text-${step.color}` : 'text-primary'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-base font-semibold">
                {{ step.title }}
              </div>
              <div
                v-if="step.description"
                class="text-base text-muted mt-0.5"
              >
                {{ step.description }}
              </div>
            </div>
            <UBadge
              v-if="step.badge"
              :label="step.badge"
              color="primary"
              variant="subtle"
              size="xs"
            />
          </div>
          <div
            v-if="step.details"
            class="mt-3 text-base text-muted leading-relaxed"
          >
            {{ step.details }}
          </div>
        </div>
      </div>

      <div
        v-if="index < steps.length - 1"
        class="flex justify-center py-1"
        :class="direction === 'horizontal' ? 'hidden' : ''"
      >
        <UIcon
          name="i-lucide-arrow-down"
          class="size-5 text-primary/40"
        />
      </div>
    </div>
  </div>
</template>
