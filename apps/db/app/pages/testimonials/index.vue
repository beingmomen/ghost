<script setup>
definePageMeta({
  title: 'التوصيات'
});

const testimonials = useTestimonials();

await useAPI('/api/testimonials', {
  key: 'testimonials',
  query: { page: testimonials.pageIndex, limit: testimonials.pageSize }
});

provide('composable', testimonials);
</script>

<template>
  <ModulesTestimonialsTable />
</template>
