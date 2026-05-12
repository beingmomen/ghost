<script setup>
defineProps({
  name: { type: String, required: true },
  type: { type: String, default: '' },
  description: { type: String, required: true },
  example: { type: String, default: '' },
  params: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="animate-fade-in rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300 h-full">
    <div class="flex items-center gap-2 mb-2">
      <code
        class="text-base font-bold font-mono text-primary"
        dir="ltr"
      >{{ name }}</code>
      <UBadge
        v-if="type"
        :label="type"
        color="neutral"
        variant="subtle"
        size="xs"
      />
    </div>

    <p class="text-base text-muted leading-relaxed mb-3">
      {{ description }}
    </p>

    <div
      v-if="params.length"
      class="mb-3 space-y-1"
    >
      <div
        v-for="param in params"
        :key="param.name"
        class="flex items-start gap-2 text-sm"
      >
        <code
          class="font-mono text-xs bg-elevated/60 px-1.5 py-0.5 rounded"
          dir="ltr"
        >{{ param.name }}</code>
        <span class="text-muted">{{ param.description }}</span>
      </div>
    </div>

    <div
      v-if="example"
      class="rounded-lg bg-elevated/60 border border-default/40 overflow-hidden"
    >
      <pre
        class="p-3 text-xs leading-relaxed overflow-x-auto"
        dir="ltr"
        style="direction: ltr; text-align: left;"
      ><code>{{ example }}</code></pre>
    </div>
  </div>
</template>
