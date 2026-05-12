<script setup>
const { items, deleteItem, columns, tableRef } = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">
        الأسئلة الشائعة
      </h2>
      <UButton
        label="جديد"
        icon="i-lucide-plus"
        to="/faqs/new"
      />
    </div>
    <BasePaginatedTable
      ref="tableRef"
      :data="items"
      :columns="columns"
    />
  </div>
</template>
