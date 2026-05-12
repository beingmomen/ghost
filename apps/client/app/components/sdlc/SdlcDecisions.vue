<script setup>
const leftNodes = [
  {
    type: 'warn',
    condition: 'IF requirement is unclear',
    action: { prefix: 'Return to ', target: 'Analysis', suffix: '. Re-engage stakeholders. Clarify vision and functional expectations before any design work begins.' }
  },
  {
    type: 'err',
    condition: 'IF architecture is unstable',
    action: { prefix: 'Revisit ', target: 'Design', suffix: '. Decompose further. Validate the architecture against requirements again before resuming development.' }
  },
  {
    type: 'err',
    condition: 'IF use case is incomplete',
    action: { prefix: 'Return to ', target: 'Design', suffix: '. Add missing actors, flows, or edge cases. Re-model before writing a single line of code.' }
  }
]

const rightNodes = [
  {
    type: 'warn',
    condition: 'IF a test fails',
    action: { prefix: 'Return to ', target: 'Development', suffix: '. Fix root cause — not the symptom. Re-run the full regression suite before resubmitting for QA.' }
  },
  {
    type: 'err',
    condition: 'IF deployment fails',
    action: { prefix: 'Execute ', target: 'Rollback Plan', suffix: '. Investigate root cause. Fix in Development → re-test → redeploy with confidence.' }
  },
  {
    type: 'ok',
    condition: 'IF all checkpoints pass',
    action: { prefix: 'Proceed to ', target: 'next phase', suffix: '. Document decisions and rationale. Notify stakeholders and update progress tracking.' }
  }
]

const nodeStyles = {
  warn: { card: 'border-warning/30 bg-warning/5', text: 'text-warning' },
  err: { card: 'border-error/30 bg-error/5', text: 'text-error' },
  ok: { card: 'border-success/30 bg-success/5', text: 'text-success' }
}
</script>

<template>
  <UPageSection
    title="Decision Flow System"
    description="The conditional logic an architect applies when something is wrong, incomplete, or ambiguous — and how to recover."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-xl sm:text-2xl font-medium',
      description: 'text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-3">
        <div
          v-for="(node, index) in leftNodes"
          :key="node.condition"
          class="animate-fade-in"
          :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
        >
          <div
            class="rounded-xl border p-5 transition-colors duration-300"
            :class="nodeStyles[node.type].card"
          >
            <div
              class="text-base font-semibold mb-2"
              :class="nodeStyles[node.type].text"
            >
              {{ node.condition }}
            </div>
            <p class="text-base text-muted leading-relaxed">
              → {{ node.action.prefix }}<strong class="text-highlighted">{{ node.action.target }}</strong>{{ node.action.suffix }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="(node, index) in rightNodes"
          :key="node.condition"
          class="animate-fade-in"
          :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
        >
          <div
            class="rounded-xl border p-5 transition-colors duration-300"
            :class="nodeStyles[node.type].card"
          >
            <div
              class="text-base font-semibold mb-2"
              :class="nodeStyles[node.type].text"
            >
              {{ node.condition }}
            </div>
            <p class="text-base text-muted leading-relaxed">
              → {{ node.action.prefix }}<strong class="text-highlighted">{{ node.action.target }}</strong>{{ node.action.suffix }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
