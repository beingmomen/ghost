<script setup>
defineProps({
  links: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <nav
    aria-label="القائمة الرئيسية"
    class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10"
  >
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-elevated/95 rounded-full px-2 sm:px-4 border border-default shadow-sm"
      :ui="{
        link: 'px-3 py-2 sm:px-4 sm:py-2',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </nav>
</template>
