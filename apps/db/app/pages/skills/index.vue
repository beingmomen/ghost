<script setup>
definePageMeta({
  title: 'المهارات'
});

const skills = useSkills();

await useAPI('/api/skills', {
  key: 'skills',
  query: { page: skills.pageIndex, limit: skills.pageSize }
});

provide('composable', skills);
</script>

<template>
  <ModulesSkillsTable />
</template>
