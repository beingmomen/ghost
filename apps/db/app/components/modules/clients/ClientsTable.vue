<script setup>
const { columns, items, total, pageIndex, pageSize } = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        label="جديد"
        icon="i-lucide-plus"
        to="/clients/new"
      />
    </div>

    <BasePaginatedTable
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      title="العملاء"
      icon="i-lucide-building-2"
      :data="items"
      :columns="columns"
      :total="total"
    />
  </div>
</template>
