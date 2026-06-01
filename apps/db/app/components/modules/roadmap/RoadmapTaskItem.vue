<script setup>
import {
  TASK_TYPE_META,
  TASK_TYPE_OPTIONS
} from '~/composables/modules/roadmap/meta';

const props = defineProps({
  task: { type: Object, required: true },
  tasks: { type: Array, required: true },
  index: { type: Number, required: true }
});

const roadmap = inject('roadmap');

const editing = ref(false);
const draft = reactive({ text: '', type: null });

const busy = computed(() => roadmap.busyId.value === props.task.id);
const typeMeta = computed(() => TASK_TYPE_META[props.task.type] || null);

function startEdit() {
  draft.text = props.task.text;
  draft.type = props.task.type ?? null;
  editing.value = true;
}

async function saveEdit() {
  if (!draft.text.trim()) return;
  await roadmap.updateTask(props.task.id, {
    text: draft.text.trim(),
    type: draft.type || null
  });
  editing.value = false;
}
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-md border border-default px-3 py-2"
    :class="task.done ? 'bg-elevated/40' : 'bg-default'"
  >
    <UCheckbox
      :model-value="task.done"
      :disabled="busy"
      @update:model-value="roadmap.toggleTask(task)"
    />

    <!-- Display mode -->
    <template v-if="!editing">
      <span
        class="flex-1 text-sm"
        :class="task.done ? 'text-dimmed line-through' : 'text-default'"
      >
        {{ task.text }}
      </span>
      <UBadge
        v-if="typeMeta"
        :color="typeMeta.color"
        variant="subtle"
        size="sm"
        :icon="typeMeta.icon"
      >
        {{ typeMeta.label }}
      </UBadge>
    </template>

    <!-- Edit mode -->
    <template v-else>
      <UInput
        v-model="draft.text"
        class="flex-1"
        size="sm"
        autofocus
        @keyup.enter="saveEdit"
      />
      <USelect
        v-model="draft.type"
        :items="TASK_TYPE_OPTIONS"
        value-key="value"
        label-key="label"
        size="sm"
        class="w-28"
      />
    </template>

    <!-- Controls -->
    <div class="flex shrink-0 items-center gap-0.5">
      <template v-if="editing">
        <UButton
          icon="i-lucide-check"
          color="success"
          variant="ghost"
          size="xs"
          :loading="busy"
          @click="saveEdit"
        />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="editing = false"
        />
      </template>
      <template v-else>
        <UButton
          icon="i-lucide-chevron-up"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="index === 0 || busy"
          @click="roadmap.moveTask(tasks, index, -1)"
        />
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="index === tasks.length - 1 || busy"
          @click="roadmap.moveTask(tasks, index, 1)"
        />
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="startEdit"
        />
        <BaseDelete
          :delete-function="() => roadmap.removeTask(task.id)"
          :item-name="task.text"
          size="xs"
        />
      </template>
    </div>
  </div>
</template>
