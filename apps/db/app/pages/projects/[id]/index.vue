<script setup>
definePageMeta({
  title: 'المشاريع'
});

const route = useRoute();
const id = route.params.id;

const projectEdit = useProjectEdit();

if (projectEdit.isEditing.value) {
  const { data: projectData } = await useAPI(`/api/projects/${id}`, { key: projectEdit.EDIT_CACHE_KEY });
  if (projectData.value?.data) projectEdit.populateForm(projectData.value.data);
}

const { data: skillsData } = await useAPI('/api/skills/all', { key: projectEdit.SKILLS_CACHE_KEY });
projectEdit.setSkillsList(skillsData.value);

provide('composable', projectEdit);
</script>

<template>
  <ModulesProjectsForm />
</template>
