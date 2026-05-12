<script setup>
definePageMeta({
  title: 'الأسئلة الشائعة'
});

const faqs = useFaqs();

await useAPI('/api/faqs', {
  key: 'faqs',
  query: { page: faqs.pageIndex, limit: faqs.pageSize }
});

provide('composable', faqs);
</script>

<template>
  <ModulesFaqsTable />
</template>
