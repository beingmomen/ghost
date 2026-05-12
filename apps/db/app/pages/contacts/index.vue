<script setup>
definePageMeta({
  title: 'الرسائل'
});

const contacts = useContacts();

await useAPI('/api/contacts', {
  key: 'contacts',
  query: { page: contacts.pageIndex, limit: contacts.pageSize }
});

provide('composable', contacts);
</script>

<template>
  <ModulesContactsTable />
</template>
