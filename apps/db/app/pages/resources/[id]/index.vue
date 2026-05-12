<script setup>
definePageMeta({
  title: 'المصادر'
});

const route = useRoute();
const id = route.params.id;

const resourceEdit = useResourceEdit();

if (resourceEdit.isEditing.value) {
  const { data } = await useAPI(`/api/resources/${id}`, { key: resourceEdit.EDIT_CACHE_KEY });
  if (data.value?.data) resourceEdit.populateForm(data.value.data);
}

provide('composable', resourceEdit);
</script>

<template>
  <ModulesResourcesForm />
</template>
