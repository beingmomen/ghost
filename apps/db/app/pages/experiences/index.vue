<script setup>
definePageMeta({
  title: 'الخبرات العملية'
});

const experiences = useExperiences();

await useAPI('/api/experiences', {
  key: 'experiences',
  query: { page: experiences.pageIndex, limit: experiences.pageSize }
});

provide('composable', experiences);
</script>

<template>
  <ModulesExperiencesTable />
</template>
