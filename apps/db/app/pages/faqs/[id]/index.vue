<script setup>
definePageMeta({
  title: 'الأسئلة الشائعة'
});

const route = useRoute();
const id = route.params.id;

const faqEdit = useFaqEdit();

if (faqEdit.isEditing.value) {
  const { data } = await useAPI(`/api/faqs/${id}`, { key: faqEdit.EDIT_CACHE_KEY });
  if (data.value?.data) faqEdit.populateForm(data.value.data);
}

provide('composable', faqEdit);
</script>

<template>
  <ModulesFaqsForm />
</template>
