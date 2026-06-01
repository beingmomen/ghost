<script setup>
definePageMeta({
  title: 'مسار التعلم'
});

const roadmap = useRoadmap();

await useAPI('/api/roadmap', {
  key: 'roadmap',
  default: () => ({ settings: {}, stats: {}, phases: [] }),
  transform: (response) => response.data
});

provide('roadmap', roadmap);
</script>

<template>
  <div class="space-y-6">
    <ModulesRoadmapSummary :stats="roadmap.stats.value" />

    <ModulesRoadmapSettingsCard />

    <!-- Phases -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          المراحل
        </h2>
        <ModulesRoadmapPhaseModal>
          <UButton icon="i-lucide-plus" label="إضافة مرحلة" />
        </ModulesRoadmapPhaseModal>
      </div>

      <ModulesRoadmapPhaseItem
        v-for="(phase, i) in roadmap.phases.value"
        :key="phase.id"
        :phase="phase"
        :phases="roadmap.phases.value"
        :index="i"
      />

      <p
        v-if="!roadmap.phases.value.length"
        class="rounded-lg border border-dashed border-default p-8 text-center text-muted"
      >
        لا توجد مراحل بعد. ابدأ بإضافة مرحلة.
      </p>
    </div>
  </div>
</template>
