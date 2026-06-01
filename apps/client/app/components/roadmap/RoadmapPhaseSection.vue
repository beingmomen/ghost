<script setup>
import { levelLabel, levelColor, TASK_TYPE_META } from '~/utils/roadmap'

const props = defineProps({
  phase: { type: Object, required: true },
  defaultOpen: { type: Boolean, default: false }
})

const open = ref(props.defaultOpen)

const taskMeta = type => TASK_TYPE_META[type] || null
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-default bg-default">
    <!-- Header -->
    <button
      type="button"
      class="flex w-full flex-wrap items-center gap-3 p-4 text-start"
      @click="open = !open"
    >
      <UIcon
        :name="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-left'"
        class="shrink-0 text-muted"
      />
      <span class="min-w-0 flex-1 truncate font-semibold">
        {{ phase.title }}
      </span>
      <UBadge
        v-if="phase.milestoneLevel"
        :color="levelColor(phase.milestoneLevel)"
        variant="subtle"
        size="sm"
      >
        {{ levelLabel(phase.milestoneLevel) }}
      </UBadge>
      <div class="flex w-32 shrink-0 items-center gap-2">
        <UProgress
          :model-value="phase.phasePercent"
          :max="100"
          size="sm"
          color="primary"
        />
        <span class="w-10 text-end text-xs text-muted">
          {{ phase.phasePercent }}%
        </span>
      </div>
    </button>

    <!-- Body -->
    <UCollapsible v-model:open="open">
      <template #content>
        <div class="space-y-4 border-t border-default p-4">
          <p
            v-if="phase.description"
            class="text-sm text-muted"
          >
            {{ phase.description }}
          </p>

          <div
            v-for="week in phase.weeks"
            :key="week.id"
            class="rounded-lg border border-default bg-elevated/30 p-3"
          >
            <div class="mb-2">
              <span class="font-medium">{{ week.title }}</span>
              <span
                v-if="week.focus"
                class="text-sm text-muted"
              >
                — {{ week.focus }}</span>
            </div>
            <ul class="space-y-1.5">
              <li
                v-for="task in week.tasks"
                :key="task.id"
                class="flex items-start gap-2 text-sm"
              >
                <UIcon
                  :name="task.done ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                  class="mt-0.5 shrink-0"
                  :class="task.done ? 'text-success' : 'text-dimmed'"
                />
                <span :class="task.done ? 'text-dimmed line-through' : 'text-default'">
                  {{ task.text }}
                </span>
                <UBadge
                  v-if="taskMeta(task.type)"
                  :color="taskMeta(task.type).color"
                  variant="subtle"
                  size="xs"
                  class="shrink-0"
                >
                  {{ taskMeta(task.type).label }}
                </UBadge>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
