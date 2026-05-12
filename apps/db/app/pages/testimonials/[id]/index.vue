<script setup>
definePageMeta({
  title: 'التوصيات'
});

const route = useRoute();
const id = route.params.id;

const testimonialEdit = useTestimonialEdit();

if (testimonialEdit.isEditing.value) {
  const { data } = await useAPI(`/api/testimonials/${id}`, { key: testimonialEdit.EDIT_CACHE_KEY });
  if (data.value?.data) testimonialEdit.populateForm(data.value.data);
}

provide('composable', testimonialEdit);
</script>

<template>
  <ModulesTestimonialsForm />
</template>
