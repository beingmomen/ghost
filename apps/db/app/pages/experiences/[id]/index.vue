<script setup>
definePageMeta({
  title: 'الخبرات العملية'
});

const route = useRoute();
const id = route.params.id;

const experienceEdit = useExperienceEdit();

if (experienceEdit.isEditing.value) {
  const { data } = await useAPI(`/api/experiences/${id}`, { key: experienceEdit.EDIT_CACHE_KEY });
  if (data.value?.data) experienceEdit.populateForm(data.value.data);
}

provide('composable', experienceEdit);
</script>

<template>
  <ModulesExperiencesForm />
</template>
