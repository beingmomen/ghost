<script setup>
definePageMeta({
  title: 'الخدمات'
});

const services = useServices();

await useAPI('/api/services', {
  key: 'services',
  query: { page: services.pageIndex, limit: services.pageSize }
});

provide('composable', services);
</script>

<template>
  <ModulesServicesTable />
</template>
