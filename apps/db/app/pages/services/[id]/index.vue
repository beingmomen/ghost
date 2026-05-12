<script setup>
definePageMeta({
  title: 'الخدمات'
});

const route = useRoute();
const id = route.params.id;

const serviceEdit = useServiceEdit();

if (serviceEdit.isEditing.value) {
  const { data } = await useAPI(`/api/services/${id}`, { key: serviceEdit.EDIT_CACHE_KEY });
  if (data.value?.data) serviceEdit.populateForm(data.value.data);
}

provide('composable', serviceEdit);
</script>

<template>
  <ModulesServicesForm />
</template>
