<script setup>
const props = defineProps({
  week: { type: Object, required: true },
  weeks: { type: Array, required: true },
  index: { type: Number, required: true }
});

const roadmap = inject('roadmap');

const newTaskText = ref('');
const addBusy = computed(
  () => roadmap.busyId.value === `new-task-${props.week.id}`
);

async function addTask() {
  const text = newTaskText.value.trim();
  if (!text) return;
  await roadmap.createTask(props.week.id, { text });
  newTaskText.value = '';
}
</script>

<template>
  <div class="rounded-lg border border-default bg-elevated/30 p-3">
    <!-- Week header -->
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0">
        <span class="font-medium">{{ week.title }}</span>
        <span v-if="week.focus" class="text-sm text-muted"> — {{ week.focus }}</span>
      </div>
      <div class="flex shrink-0 items-center gap-0.5">
        <UButton
          icon="i-lucide-chevron-up"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="index === 0"
          @click="roadmap.moveWeek(weeks, index, -1)"
        />
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="index === weeks.length - 1"
          @click="roadmap.moveWeek(weeks, index, 1)"
        />
        <ModulesRoadmapWeekModal :week="week">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="xs"
          />
        </ModulesRoadmapWeekModal>
        <BaseDelete
          :delete-function="() => roadmap.removeWeek(week.id)"
          :item-name="week.title"
          size="xs"
        />
      </div>
    </div>

    <!-- Tasks -->
    <div class="space-y-2">
      <ModulesRoadmapTaskItem
        v-for="(task, i) in week.tasks"
        :key="task.id"
        :task="task"
        :tasks="week.tasks"
        :index="i"
      />
      <p v-if="!week.tasks.length" class="px-1 text-sm text-dimmed">
        لا توجد مهام بعد.
      </p>
    </div>

    <!-- Add task -->
    <div class="mt-3 flex items-center gap-2">
      <UInput
        v-model="newTaskText"
        placeholder="أضف مهمة جديدة…"
        size="sm"
        class="flex-1"
        @keyup.enter="addTask"
      />
      <UButton
        icon="i-lucide-plus"
        label="إضافة"
        size="sm"
        :loading="addBusy"
        :disabled="!newTaskText.trim()"
        @click="addTask"
      />
    </div>
  </div>
</template>
