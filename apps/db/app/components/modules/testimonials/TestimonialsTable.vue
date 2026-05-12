<script setup>
const { columns, items, total, pageIndex, pageSize } = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <UButton
        label="جديد"
        icon="i-lucide-plus"
        to="/testimonials/new"
      />
    </div>
    <BasePaginatedTable
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      title="التوصيات"
      icon="i-lucide-message-square-quote"
      :data="items"
      :columns="columns"
      :total="total"
    />
  </div>
</template>
