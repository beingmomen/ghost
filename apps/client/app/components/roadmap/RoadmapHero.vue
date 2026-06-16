<script setup>
import { LEVEL_LADDER, levelLabel, levelColor } from '~/utils/roadmap'

const props = defineProps({
  stats: { type: Object, required: true }
})

const currentIndex = computed(() =>
  LEVEL_LADDER.findIndex(l => l.value === props.stats.currentLevel)
)

const hasStats = computed(() =>
  typeof props.stats?.totalTasks === 'number' && props.stats.totalTasks > 0
)

const safeStats = computed(() => ({
  overallPercent: props.stats?.overallPercent ?? 0,
  doneTasks: props.stats?.doneTasks ?? 0,
  totalTasks: props.stats?.totalTasks ?? 0,
  weeksRemainingToSenior: props.stats?.weeksRemainingToSenior ?? 0,
  hoursRemainingToSenior: props.stats?.hoursRemainingToSenior ?? 0,
  progressToNextPercent: props.stats?.progressToNextPercent ?? 0
}))
</script>

<template>
  <div
    v-if="hasStats"
    class="space-y-8"
  >
    <!-- Level + overall progress -->
    <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col items-center gap-2 sm:items-start">
        <span class="text-sm text-muted">المستوى الحالي</span>
        <UBadge
          :color="levelColor(stats.currentLevel)"
          size="xl"
          class="text-lg"
        >
          {{ levelLabel(stats.currentLevel) }}
        </UBadge>
      </div>

      <!-- Progress ring -->
      <div class="flex flex-col items-center gap-1">
        <div class="text-4xl font-bold text-primary">
          {{ safeStats.overallPercent }}%
        </div>
        <span class="text-sm text-muted">
          {{ safeStats.doneTasks }} / {{ safeStats.totalTasks }} مهمة
        </span>
      </div>

      <div class="flex flex-col items-center gap-1 sm:items-end">
        <span class="text-sm text-muted">المدة المتبقية لـ Senior</span>
        <span class="text-lg font-semibold">
          ~{{ safeStats.weeksRemainingToSenior }} أسبوع
        </span>
        <span class="text-sm text-dimmed">
          ≈ {{ safeStats.hoursRemainingToSenior }} ساعة
        </span>
      </div>
    </div>

    <UProgress
      :model-value="safeStats.overallPercent"
      :max="100"
      color="primary"
      size="lg"
    />

    <!-- Level ladder -->
    <div class="space-y-3">
      <div class="flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap">
        <template
          v-for="(step, i) in LEVEL_LADDER"
          :key="step.value"
        >
          <div
            class="flex-1 rounded-xl border px-4 py-3 text-center transition-colors"
            :class="
              i <= currentIndex
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-default text-muted'
            "
          >
            <div class="text-sm sm:text-base">
              {{ step.label }}
            </div>
          </div>
          <UIcon
            v-if="i < LEVEL_LADDER.length - 1"
            name="i-lucide-chevron-left"
            class="hidden shrink-0 text-dimmed sm:block"
          />
        </template>
      </div>

      <div
        v-if="stats.nextMilestone"
        class="mx-auto max-w-xl space-y-1"
      >
        <div class="flex items-center justify-between text-sm text-muted">
          <span>التقدّم نحو {{ levelLabel(stats.nextMilestone) }}</span>
          <span>{{ safeStats.progressToNextPercent }}%</span>
        </div>
        <UProgress
          :model-value="safeStats.progressToNextPercent"
          :max="100"
          :color="levelColor(stats.nextMilestone)"
          size="sm"
        />
      </div>
      <p
        v-else
        class="text-center text-base font-semibold text-success"
      >
        🎉 تم الوصول لمستوى Senior!
      </p>
    </div>
  </div>
</template>
