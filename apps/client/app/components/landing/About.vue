<script setup>
const { global } = useAppConfig()
</script>

<template>
  <UPageSection
    title="نبذة عني"
    :description="global.aboutSection.description"
    :ui="{
      container: '!p-0',
      title: 'text-right text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-right mt-3 text-base sm:text-lg lg:text-base text-muted leading-relaxed'
    }"
  />
</template>
