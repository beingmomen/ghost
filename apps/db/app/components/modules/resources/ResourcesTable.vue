<script setup>
const { columns, items, total, pageIndex, pageSize } = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        label="جديد"
        icon="i-lucide-plus"
        to="/resources/new"
      />
    </div>

    <BasePaginatedTable
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      title="المصادر"
      icon="i-lucide-link"
      :data="items"
      :columns="columns"
      :total="total"
    />
  </div>
</template>
