<script setup>
const props = defineProps({
  // Each step: { lane, title, description?, icon?, chips?: [{ label, accent? }],
  //              kind?: 'decision' | 'stores', stores?: [{ label, active? }], arrowLabel? }
  steps: { type: Array, required: true },
  // Optional side branch: { fromStep, toStep, title, items: [string], footer }
  // Sits beside steps[fromStep..toStep] on wide screens, right after steps[fromStep] on mobile.
  branch: { type: Object, default: null },
  label: { type: String, required: true },
  summary: { type: String, required: true },
  caption: { type: String, default: '' },
  loopNote: { type: String, default: '' }
})

const uid = useId()

// Static class maps — Tailwind only emits classes it finds as complete literal strings.
// Grid rows on wide screens: step i sits on row 2i+1, its connector on row 2i+2.
const ROW_START = [
  'sm:row-start-1', 'sm:row-start-2', 'sm:row-start-3', 'sm:row-start-4',
  'sm:row-start-5', 'sm:row-start-6', 'sm:row-start-7', 'sm:row-start-8',
  'sm:row-start-9', 'sm:row-start-10', 'sm:row-start-11', 'sm:row-start-12',
  'sm:row-start-13', 'sm:row-start-14', 'sm:row-start-15', 'sm:row-start-16',
  'sm:row-start-17', 'sm:row-start-18', 'sm:row-start-19', 'sm:row-start-20'
]
const ROW_SPAN = [
  'sm:row-span-1', 'sm:row-span-2', 'sm:row-span-3', 'sm:row-span-4',
  'sm:row-span-5', 'sm:row-span-6', 'sm:row-span-7', 'sm:row-span-8',
  'sm:row-span-9', 'sm:row-span-10', 'sm:row-span-11'
]
const stepRow = index => ROW_START[index * 2]
const connectorRow = index => ROW_START[index * 2 + 1]

const branchClass = computed(() => {
  if (!props.branch) return ''
  const span = (props.branch.toStep - props.branch.fromStep) * 2 + 1
  return `${ROW_START[props.branch.fromStep * 2]} ${ROW_SPAN[span - 1]}`
})

// DOM order: step, (branch right after its source step), connector.
// On mobile that keeps the branch between the decision and the "yes" arrow;
// on wide screens the branch moves to the second column beside its row range.
const items = computed(() => {
  const list = []
  props.steps.forEach((step, index) => {
    list.push({ type: 'step', step, index })
    if (props.branch && index === props.branch.fromStep) list.push({ type: 'branch', index })
    if (index < props.steps.length - 1) list.push({ type: 'connector', step, index })
  })
  return list
})
</script>

<template>
  <figure class="animate-fade-in">
    <div
      role="img"
      :aria-label="label"
      :aria-describedby="`${uid}-desc`"
      class="rounded-xl border border-default/60 bg-elevated/20 p-3 sm:p-5"
    >
      <p
        :id="`${uid}-desc`"
        class="sr-only"
      >
        {{ summary }}
      </p>

      <div
        class="grid grid-cols-1 gap-x-4"
        :class="branch ? 'sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]' : ''"
      >
        <template
          v-for="item in items"
          :key="`${item.type}-${item.index}`"
        >
          <!-- Main path step -->
          <div
            v-if="item.type === 'step'"
            class="sm:col-start-1 min-w-0"
            :class="stepRow(item.index)"
          >
            <div
              class="rounded-lg border bg-default p-3 sm:p-4"
              :class="item.step.kind === 'decision' ? 'border-default border-dashed' : 'border-default/60'"
            >
              <div class="flex items-start gap-3">
                <div
                  v-if="item.step.kind === 'decision'"
                  class="size-9 shrink-0 mt-0.5 hidden sm:flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div class="size-7 rotate-45 rounded-sm border-2 border-default bg-elevated flex items-center justify-center">
                    <UIcon
                      name="i-lucide-help-circle"
                      class="size-4 -rotate-45 text-muted"
                    />
                  </div>
                </div>
                <div
                  v-else
                  class="size-9 shrink-0 rounded-lg bg-elevated hidden sm:flex items-center justify-center"
                  aria-hidden="true"
                >
                  <UIcon
                    :name="item.step.icon || 'i-lucide-circle-dot'"
                    class="size-5 text-muted"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span
                      class="font-mono text-xs uppercase tracking-wide text-muted rounded bg-elevated px-1.5 py-0.5"
                      dir="ltr"
                    >{{ item.step.lane }}</span>
                    <span class="text-base font-semibold text-highlighted">{{ item.step.title }}</span>
                  </div>
                  <p
                    v-if="item.step.description"
                    class="text-base text-muted mt-1 leading-relaxed"
                  >
                    {{ item.step.description }}
                  </p>

                  <div
                    v-if="item.step.chips?.length"
                    class="flex flex-wrap gap-2 mt-2"
                  >
                    <code
                      v-for="chip in item.step.chips"
                      :key="chip.label"
                      dir="ltr"
                      class="font-mono text-sm rounded-md px-2 py-0.5 break-all"
                      :class="chip.accent ? 'bg-primary/10 ring-1 ring-primary/40 text-amber' : 'bg-elevated text-default'"
                    >{{ chip.label }}</code>
                  </div>

                  <div
                    v-if="item.step.kind === 'stores'"
                    class="flex flex-wrap gap-2 mt-3"
                  >
                    <div
                      v-for="store in item.step.stores"
                      :key="store.label"
                      class="flex items-center gap-1.5 rounded-md px-2 py-1"
                      :class="store.active ? 'bg-primary/10 ring-1 ring-primary/40' : 'bg-elevated'"
                    >
                      <UIcon
                        name="i-lucide-database"
                        class="size-4"
                        :class="store.active ? 'text-amber' : 'text-muted'"
                      />
                      <span
                        class="font-mono text-sm"
                        :class="store.active ? 'text-amber font-semibold' : 'text-muted'"
                        dir="ltr"
                      >{{ store.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connector to the next step -->
          <div
            v-else-if="item.type === 'connector'"
            class="sm:col-start-1 flex items-center justify-center gap-2 py-1.5"
            :class="connectorRow(item.index)"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-arrow-down"
              class="size-5 text-muted"
            />
            <span
              v-if="item.step.arrowLabel"
              class="text-sm text-muted"
            >{{ item.step.arrowLabel }}</span>
          </div>

          <!-- Side branch -->
          <div
            v-else
            class="sm:col-start-2 min-w-0 mt-3 sm:mt-0 ms-4 sm:ms-0"
            :class="branchClass"
          >
            <div class="h-full rounded-lg border border-dashed border-default bg-elevated/30 p-3 sm:p-4 flex flex-col">
              <div class="flex items-center gap-2 mb-2">
                <UIcon
                  name="i-lucide-corner-down-left"
                  class="size-4 text-muted"
                  aria-hidden="true"
                />
                <span class="text-base font-semibold text-highlighted">{{ branch.title }}</span>
              </div>
              <ul class="space-y-1 text-base text-muted">
                <li
                  v-for="entry in branch.items"
                  :key="entry"
                  class="flex items-start gap-2"
                >
                  <span
                    class="size-1.5 rounded-full bg-muted mt-2.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 break-words">{{ entry }}</span>
                </li>
              </ul>
              <div class="mt-auto pt-3 flex items-center gap-2 text-base text-muted">
                <UIcon
                  name="i-lucide-arrow-down"
                  class="size-4 shrink-0 sm:hidden"
                  aria-hidden="true"
                />
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-4 shrink-0 hidden sm:block"
                  aria-hidden="true"
                />
                <span>{{ branch.footer }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="loopNote"
        class="mt-4 flex items-start gap-2 rounded-lg border border-default/60 bg-default p-3"
      >
        <UIcon
          name="i-lucide-repeat"
          class="size-4 text-muted mt-1.5 shrink-0"
          aria-hidden="true"
        />
        <p class="text-base text-muted leading-relaxed">
          {{ loopNote }}
        </p>
      </div>
    </div>

    <figcaption
      v-if="caption"
      class="mt-2 text-sm text-muted text-right"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
