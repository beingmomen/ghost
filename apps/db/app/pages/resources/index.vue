<script setup>
definePageMeta({
  title: 'المصادر'
});

const resources = useResources();

await useAPI('/api/resources', {
  key: 'resources',
  query: { page: resources.pageIndex, limit: resources.pageSize }
});

provide('composable', resources);
</script>

<template>
  <ModulesResourcesTable />
</template>
