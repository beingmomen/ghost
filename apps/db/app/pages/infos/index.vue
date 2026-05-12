<script setup>
definePageMeta({
  title: 'الإعدادات'
});

const infoEdit = useInfoEdit();

const { data: infosData } = await useAPI('/api/infos', {
  key: infoEdit.INFOS_CACHE_KEY,
  query: { limit: 1 }
});
if (infosData.value?.data?.[0]) infoEdit.loadExisting(infosData.value.data[0]);

provide('composable', infoEdit);
</script>

<template>
  <ModulesInfosForm />
</template>
