<script setup>
definePageMeta({
  title: 'الملف المهني'
});

const careerProfile = useCareerProfileEdit();

const { data: profileData } = await useAPI('/api/career-profile', {
  key: careerProfile.CACHE_KEY
});

if (profileData.value?.data?.profile?.settings) {
  careerProfile.loadSettings(profileData.value.data.profile.settings);
}

provide('composable', careerProfile);
</script>

<template>
  <ModulesCareerProfileForm />
</template>
