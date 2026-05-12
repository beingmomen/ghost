<script setup>
defineProps({
  title: { type: String, required: true },
  headers: { type: Array, required: true },
  rows: { type: Array, required: true },
  icon: { type: String, default: 'i-lucide-scale' }
})
</script>

<template>
  <div class="animate-fade-in rounded-xl border border-default/60 bg-elevated/30 overflow-hidden">
    <div class="flex items-center gap-2 px-5 py-3 border-b border-default/60 bg-elevated/20">
      <UIcon
        :name="icon"
        class="size-4 text-primary"
      />
      <span class="text-base font-semibold">{{ title }}</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-base">
        <thead>
          <tr class="border-b border-default/60">
            <th
              v-for="header in headers"
              :key="header"
              class="px-4 py-3 text-right font-semibold text-primary bg-primary/5"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="border-b border-default/30 last:border-b-0 hover:bg-elevated/40 transition-colors"
          >
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              class="px-4 py-3 text-muted"
              :class="cellIndex === 0 ? 'font-medium text-highlighted' : ''"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
