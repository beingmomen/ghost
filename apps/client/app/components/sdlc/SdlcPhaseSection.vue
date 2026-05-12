<script setup>
const props = defineProps({
  phase: {
    type: Object,
    required: true
  }
})

const metaItems = computed(() => [
  { label: 'Roles', value: props.phase.meta.roles, icon: 'i-lucide-users' },
  { label: 'Key Question', value: props.phase.meta.question, icon: 'i-lucide-help-circle' },
  { label: 'Next Phase Trigger', value: props.phase.meta.trigger, icon: 'i-lucide-arrow-right-circle' },
  { label: 'Risk if Skipped', value: props.phase.meta.risk, icon: 'i-lucide-alert-triangle' }
])
</script>

<template>
  <UPageSection
    :id="phase.id"
    :title="`${phase.num} — ${phase.title}`"
    :description="phase.tagline"
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-xl sm:text-2xl font-medium',
      description: 'text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="grid md:grid-cols-3 gap-4">
      <div class="animate-fade-in animation-delay-100">
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300 h-full">
          <div class="flex items-center gap-2 mb-3">
            <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-zap"
                class="size-4 text-primary"
              />
            </div>
            <span class="text-base font-semibold">{{ phase.layerA.title }}</span>
          </div>
          <p class="text-base text-muted leading-relaxed mb-4">
            {{ phase.layerA.body }}
          </p>
          <div class="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <div class="text-sm font-semibold text-primary mb-1">
              Key Output
            </div>
            <div class="text-base">
              {{ phase.layerA.output }}
            </div>
          </div>
        </div>
      </div>

      <div class="animate-fade-in animation-delay-200">
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300 h-full">
          <div class="flex items-center gap-2 mb-3">
            <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-list"
                class="size-4 text-primary"
              />
            </div>
            <span class="text-base font-semibold">{{ phase.layerB.title }}</span>
          </div>
          <ul class="space-y-2">
            <li
              v-for="item in phase.layerB.items"
              :key="item"
              class="text-base text-muted flex gap-2 items-start"
            >
              <UIcon
                name="i-lucide-circle-check"
                class="size-3.5 text-primary/50 mt-0.5 shrink-0"
              />
              <span>
                <template v-if="item.includes(' — ')">
                  <strong class="text-highlighted">{{ item.split(' — ')[0] }}</strong>
                  <span class="text-dimmed"> — </span>{{ item.split(' — ').slice(1).join(' — ') }}
                </template>
                <template v-else>{{ item }}</template>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="animate-fade-in animation-delay-300">
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300 h-full">
          <div class="flex items-center gap-2 mb-3">
            <div class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-brain"
                class="size-4 text-primary"
              />
            </div>
            <span class="text-base font-semibold">{{ phase.layerC.title }}</span>
          </div>
          <ul class="space-y-2">
            <li
              v-for="item in phase.layerC.items"
              :key="item"
              class="text-base text-muted flex gap-2 items-start"
            >
              <UIcon
                name="i-lucide-help-circle"
                class="size-3.5 text-warning/60 mt-0.5 shrink-0"
              />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <div
        v-for="(metaItem, i) in metaItems"
        :key="metaItem.label"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + i * 0.1}s` }"
      >
        <div class="rounded-lg border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300">
          <div class="flex items-center gap-1.5 mb-1.5">
            <UIcon
              :name="metaItem.icon"
              class="size-3 text-muted"
            />
            <div class="text-sm font-semibold text-muted uppercase tracking-wide">
              {{ metaItem.label }}
            </div>
          </div>
          <div class="text-base leading-relaxed">
            {{ metaItem.value }}
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
