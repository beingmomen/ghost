<script setup>
defineProps({
  phase: { type: Object, required: true },
  phases: { type: Array, required: true },
  index: { type: Number, required: true }
});

const roadmap = inject('roadmap');
const { levelLabel, levelColor } = useRoadmapMeta();

const open = ref(false);
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-default bg-default">
    <!-- Phase header -->
    <div class="flex flex-wrap items-center gap-3 p-4">
      <UButton
        :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-left'"
        color="neutral"
        variant="ghost"
        @click="open = !open"
      />

      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-3 text-start"
        @click="open = !open"
      >
        <span class="truncate font-semibold">{{ phase.title }}</span>
        <UBadge
          v-if="phase.milestoneLevel"
          :color="levelColor(phase.milestoneLevel)"
          variant="subtle"
          size="sm"
        >
          {{ levelLabel(phase.milestoneLevel) }}
        </UBadge>
        <UBadge color="neutral" variant="soft" size="sm">
          {{ phase.weeksEstimate }} أسبوع
        </UBadge>
      </button>

      <!-- Phase progress -->
      <div class="flex w-40 shrink-0 items-center gap-2">
        <UProgress
          :model-value="phase.phasePercent"
          :max="100"
          size="sm"
          color="primary"
        />
        <span class="w-12 text-end text-xs text-muted">
          {{ phase.phasePercent }}%
        </span>
      </div>

      <!-- Controls -->
      <div class="flex shrink-0 items-center gap-0.5">
        <UButton
          icon="i-lucide-chevron-up"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="index === 0"
          @click="roadmap.movePhase(index, -1)"
        />
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="index === phases.length - 1"
          @click="roadmap.movePhase(index, 1)"
        />
        <ModulesRoadmapPhaseModal :phase="phase">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="xs"
          />
        </ModulesRoadmapPhaseModal>
        <BaseDelete
          :delete-function="() => roadmap.removePhase(phase.id)"
          :item-name="phase.title"
          size="xs"
        />
      </div>
    </div>

    <!-- Phase body -->
    <UCollapsible v-model:open="open">
      <template #content>
        <div class="space-y-3 border-t border-default p-4">
          <p v-if="phase.description" class="text-sm text-muted">
            {{ phase.description }}
          </p>

          <ModulesRoadmapWeekItem
            v-for="(week, i) in phase.weeks"
            :key="week.id"
            :week="week"
            :weeks="phase.weeks"
            :index="i"
          />
          <p v-if="!phase.weeks.length" class="text-sm text-dimmed">
            لا توجد أسابيع بعد.
          </p>

          <ModulesRoadmapWeekModal :phase-id="phase.id">
            <UButton
              icon="i-lucide-plus"
              label="إضافة أسبوع"
              color="neutral"
              variant="outline"
              size="sm"
              block
              @click.stop
            />
          </ModulesRoadmapWeekModal>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
