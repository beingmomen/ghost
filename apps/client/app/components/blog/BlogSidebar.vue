<template>
  <div class="table-of-contents space-y-6">
    <BlogSidebarTableOfContents />
    <USeparator
      class="my-5"
      size="sm"
    />
    <BlogSidebarLinks />
    <USeparator
      class="my-5"
      size="sm"
      type="dashed"
    />
    <div
      class="flex justify-between"
      role="group"
      aria-label="مشاركة المقال"
    >
      <SocialShare
        v-for="network in networks"
        :key="network"
        :network="network"
        :label="false"
        :aria-label="`مشاركة عبر ${network}`"
      />
    </div>
  </div>
</template>

<script setup>
const networks = [
  'facebook',
  'x',
  'linkedin',
  'reddit',
  'whatsapp',
  'telegram'
]
</script>
