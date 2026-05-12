<script setup>
defineProps({
  title: { type: String, default: 'الملفات ذات الصلة' },
  files: {
    type: Array,
    required: true
    // Each file: { path, description }
  }
})
</script>

<template>
  <div class="animate-fade-in rounded-xl border border-default/60 bg-elevated/30 overflow-hidden">
    <div class="flex items-center gap-2 px-5 py-3 border-b border-default/60 bg-elevated/20">
      <UIcon
        name="i-lucide-folder-open"
        class="size-4 text-primary"
      />
      <span class="text-base font-semibold">{{ title }}</span>
    </div>
    <div class="divide-y divide-default/30">
      <div
        v-for="file in files"
        :key="file.path"
        class="flex items-start gap-4 px-5 py-3 hover:bg-elevated/40 transition-colors"
      >
        <code
          class="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded shrink-0"
          dir="ltr"
        >{{ file.path }}</code>
        <span class="text-base text-muted">{{ file.description }}</span>
      </div>
    </div>
  </div>
</template>
