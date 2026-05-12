<script setup>
</script>

<template>
  <div>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:shadow-lg focus:outline-none"
    >
      تخطي إلى المحتوى
    </a>
    <UContainer class="sm:border-x border-default pt-10">
      <AppHeader :links="navLinks" />
      <main id="main-content">
        <slot />
      </main>
      <AppFooter />
    </UContainer>
  </div>
</template>
