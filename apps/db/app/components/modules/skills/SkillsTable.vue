<script setup>
const { columns, items, total, pageIndex, pageSize } = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        label="جديد"
        icon="i-lucide-plus"
        to="/skills/new"
      />
    </div>

    <BasePaginatedTable
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      title="المهارات"
      icon="i-lucide-zap"
      :data="items"
      :columns="columns"
      :total="total"
    />
  </div>
</template>
