<script setup>
definePageMeta({
  title: 'العملاء'
});

const route = useRoute();
const id = route.params.id;

const clientEdit = useClientEdit();

if (clientEdit.isEditing.value) {
  const { data } = await useAPI(`/api/clients/${id}`, { key: clientEdit.EDIT_CACHE_KEY });
  if (data.value?.data) clientEdit.populateForm(data.value.data);
}

provide('composable', clientEdit);
</script>

<template>
  <ModulesClientsForm />
</template>
