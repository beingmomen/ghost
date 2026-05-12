<script setup>
const { global } = useAppConfig()
</script>

<template>
  <div>
    <nav
      class="flex gap-4 flex-wrap justify-center"
      aria-label="Social Media Links"
    >
      <CommonSocialPartLink
        v-for="link in global.socialLinks"
        :key="link.to"
        v-bind="link"
      />
    </nav>
  </div>
</template>
