<script setup>
definePageMeta({
  title: 'مشاريع الهوم'
});

const homeFeaturedEdit = useHomeFeaturedEdit();

// GET / بيرجّع { data: [doc] } أو { data: [null] } لو مفيش سجل (empty state).
const { data: homeFeaturedData } = await useAPI('/api/home-featured', {
  key: homeFeaturedEdit.HOME_FEATURED_CACHE_KEY,
  query: { limit: 1 }
});
if (homeFeaturedData.value?.data?.[0]) {
  homeFeaturedEdit.loadExisting(homeFeaturedData.value.data[0]);
}

// /projects/all بيرجّع bare array (مش enveloped) — { _id, title, slug, image, altText }.
const { data: projectsData } = await useAPI('/api/projects/all', {
  key: 'projects-all-list'
});
homeFeaturedEdit.setProjectsList(projectsData.value);

provide('composable', homeFeaturedEdit);
</script>

<template>
  <ModulesHomeFeaturedForm />
</template>
