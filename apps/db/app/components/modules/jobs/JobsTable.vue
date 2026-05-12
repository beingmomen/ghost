<script setup>
const { columns, items, total, pageIndex, pageSize } = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <div v-if="!items.length" class="text-center py-12">
      <p class="text-muted mb-4">
        لا توجد وظائف محفوظة بعد.
      </p>
      <UButton
        label="تشغيل بحث عن وظائف"
        icon="i-lucide-search"
        to="/job-search"
      />
    </div>

    <BasePaginatedTable
      v-else
      v-model:page="pageIndex"
      v-model:page-size="pageSize"
      title="الوظائف"
      icon="i-lucide-briefcase-business"
      :data="items"
      :columns="columns"
      :total="total"
    />
  </div>
</template>
