<script setup>
const { columns, items, total, pageIndex, pageSize } = inject('composable');
</script>

<template>
  <div>
    <div class="flex justify-end">
      <UButton
        label="جديد"
        icon="i-lucide-plus"
        to="/contacts/new"
      />
    </div>

    <BasePaginatedTable
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      title="الرسائل"
      icon="i-lucide-mail"
      :data="items"
      :columns="columns"
      :total="total"
    />
  </div>
</template>
