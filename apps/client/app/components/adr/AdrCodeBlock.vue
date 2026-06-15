<script setup>
defineProps({
  code: { type: String, required: true },
  title: { type: String, default: '' },
  language: { type: String, default: 'js' }
})
</script>

<template>
  <div class="rounded-xl border border-default/60 bg-elevated/30 overflow-hidden min-w-0">
    <div
      v-if="title"
      class="flex items-center gap-2 px-4 py-2.5 border-b border-default/60"
    >
      <UIcon
        name="i-lucide-code-2"
        class="size-4 text-muted"
      />
      <span class="text-base font-semibold">{{ title }}</span>
      <UBadge
        v-if="language"
        :label="language"
        color="neutral"
        variant="subtle"
        size="xs"
        class="ms-auto"
      />
    </div>
    <pre
      class="p-4 overflow-x-auto text-sm leading-relaxed"
      dir="ltr"
    ><code>{{ code }}</code></pre>
  </div>
</template>
