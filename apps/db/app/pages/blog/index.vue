<script setup>
definePageMeta({
  title: 'المدونة'
});

const blogs = useBlogs();

await useAPI('/api/blogs', {
  key: 'blogs',
  query: { page: blogs.pageIndex, limit: blogs.pageSize }
});

provide('composable', blogs);
</script>

<template>
  <ModulesBlogTable />
</template>
