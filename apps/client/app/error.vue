<script setup>
defineProps({
  error: {
    type: Object,
    required: true
  }
})

useSeoMeta({
  title: 'الصفحة غير موجودة',
  description: 'عذراً، لم نتمكن من العثور على هذه الصفحة.'
})
</script>

<template>
  <div>
    <AppHeader :links="navLinks" />

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <UToaster />
  </div>
</template>
