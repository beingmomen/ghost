<script setup>
const { global } = useAppConfig()
</script>

<template>
  <div
    class="flex gap-4 flex-wrap justify-center"
    role="group"
    aria-label="روابط التواصل الاجتماعي"
  >
    <CommonSocialPartLink
      v-for="link in global.socialLinks"
      :key="link.to"
      v-bind="link"
    />
  </div>
</template>
