<script setup>
definePageMeta({
  title: 'المدونة'
});

const route = useRoute();
const id = route.params.id;

const blogEdit = useBlogEdit();

if (blogEdit.isEditing.value) {
  const { data: blogData } = await useAPI(`/api/blogs/${id}`, { key: blogEdit.EDIT_CACHE_KEY });
  if (blogData.value?.data) blogEdit.populateForm(blogData.value.data);
}

const { data: resourcesData } = await useAPI('/api/resources/all', { key: blogEdit.RESOURCES_CACHE_KEY });
blogEdit.setResourcesList(resourcesData.value);

provide('composable', blogEdit);
</script>

<template>
  <ModulesBlogForm />
</template>
