<script setup>
definePageMeta({
  title: 'بحث الوظائف'
});

const jobSearch = useJobSearch();
await jobSearch.loadLatestRun();

provide('composable', jobSearch);
</script>

<template>
  <ModulesJobSearchForm />
</template>
