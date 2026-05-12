<script setup>
definePageMeta({
  title: 'الوظائف'
});

const jobs = useJobs();

await useAPI('/api/jobs', {
  key: 'jobs',
  query: {
    page: jobs.pageIndex,
    limit: jobs.pageSize,
    source: computed(() => jobs.source.value || undefined),
    status: computed(() => jobs.status.value || undefined),
    seniority: computed(() => jobs.seniority.value || undefined),
    search: computed(() => jobs.keyword.value || undefined)
  }
});

provide('composable', jobs);
</script>

<template>
  <div class="space-y-4">
    <ModulesJobsJobFilters />
    <ModulesJobsTable />
  </div>
</template>
