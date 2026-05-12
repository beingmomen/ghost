<script setup>
definePageMeta({
  title: 'الرسائل'
});

const route = useRoute();
const id = route.params.id;

const contactEdit = useContactEdit();

if (contactEdit.isEditing.value) {
  const { data } = await useAPI(`/api/contacts/${id}`, { key: contactEdit.EDIT_CACHE_KEY });
  if (data.value?.data) contactEdit.populateForm(data.value.data);
}

provide('composable', contactEdit);
</script>

<template>
  <ModulesContactsForm />
</template>
