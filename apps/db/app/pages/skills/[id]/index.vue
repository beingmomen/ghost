<script setup>
definePageMeta({
  title: 'المهارات'
});

const route = useRoute();
const id = route.params.id;

const skillEdit = useSkillEdit();

if (skillEdit.isEditing.value) {
  const { data } = await useAPI(`/api/skills/${id}`, { key: skillEdit.EDIT_CACHE_KEY });
  if (data.value?.data) skillEdit.populateForm(data.value.data);
}

provide('composable', skillEdit);
</script>

<template>
  <ModulesSkillsForm />
</template>
