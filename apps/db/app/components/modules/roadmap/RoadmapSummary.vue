<script setup>
import { LEVEL_LADDER } from '~/composables/modules/roadmap/meta';

const props = defineProps({
  stats: { type: Object, required: true }
});

const { levelLabel, levelColor } = useRoadmapMeta();

const currentIndex = computed(() =>
  LEVEL_LADDER.findIndex((l) => l.value === props.stats.currentLevel)
);
</script>

<template>
  <BaseCard
    title="مسار التطور لـ Senior"
    icon="i-lucide-trending-up"
    card-class="space-y-6"
  >
    <!-- Top row: level + remaining -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="text-sm text-muted">المستوى الحالي:</span>
        <UBadge
          :color="levelColor(stats.currentLevel)"
          size="lg"
          class="text-base"
        >
          {{ levelLabel(stats.currentLevel) }}
        </UBadge>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted">
        <UIcon name="i-lucide-clock" />
        <span>
          المدة المتبقية لـ Senior:
          <strong class="text-default">{{ stats.weeksRemainingToSenior }}</strong>
          أسبوع
          <span class="text-dimmed">
            (≈ {{ stats.hoursRemainingToSenior }} ساعة)
          </span>
        </span>
      </div>
    </div>

    <!-- Overall progress -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">التقدّم الكلي</span>
        <span class="text-muted">
          {{ stats.doneTasks }} / {{ stats.totalTasks }} مهمة •
          <strong class="text-default">{{ stats.overallPercent }}%</strong>
        </span>
      </div>
      <UProgress :model-value="stats.overallPercent" :max="100" color="primary" />
    </div>

    <!-- Level ladder -->
    <div class="space-y-3">
      <span class="text-sm font-medium">سُلّم المستوى</span>
      <div class="flex items-center gap-2">
        <template v-for="(step, i) in LEVEL_LADDER" :key="step.value">
          <div
            class="flex-1 rounded-lg border px-3 py-2 text-center text-sm transition-colors"
            :class="
              i <= currentIndex
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-default text-muted'
            "
          >
            {{ step.label }}
          </div>
          <UIcon
            v-if="i < LEVEL_LADDER.length - 1"
            name="i-lucide-chevron-left"
            class="shrink-0 text-dimmed"
          />
        </template>
      </div>

      <!-- Progress to next milestone -->
      <div v-if="stats.nextMilestone" class="space-y-1 pt-1">
        <div class="flex items-center justify-between text-xs text-muted">
          <span>
            التقدّم نحو
            <strong class="text-default">{{ levelLabel(stats.nextMilestone) }}</strong>
          </span>
          <span>
            {{ stats.progressToNextPercent }}% •
            {{ stats.weeksToNextMilestone }} أسبوع متبقّي
          </span>
        </div>
        <UProgress
          :model-value="stats.progressToNextPercent"
          :max="100"
          :color="levelColor(stats.nextMilestone)"
          size="sm"
        />
      </div>
      <p v-else class="pt-1 text-sm font-medium text-success">
        🎉 وصلت لمستوى Senior!
      </p>
    </div>
  </BaseCard>
</template>
