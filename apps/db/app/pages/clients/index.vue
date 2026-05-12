<script setup>
definePageMeta({
  title: 'العملاء'
});

const clients = useClients();

await useAPI('/api/clients', {
  key: 'clients',
  query: { page: clients.pageIndex, limit: clients.pageSize }
});

provide('composable', clients);
</script>

<template>
  <ModulesClientsTable />
</template>
