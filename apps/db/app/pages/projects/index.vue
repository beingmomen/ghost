<script setup>
definePageMeta({
  title: 'المشاريع'
});

const projects = useProjects();

await useAPI('/api/projects', {
  key: 'projects',
  query: { page: projects.pageIndex, limit: projects.pageSize }
});

provide('composable', projects);
</script>

<template>
  <ModulesProjectsTable />
</template>
