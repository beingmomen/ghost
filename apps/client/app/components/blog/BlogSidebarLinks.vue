<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      المصادر
    </h3>

    <div class="flex flex-col">
      <UButton
        v-for="link in links"
        :key="link._id"
        :to="link.url"
        target="_blank"
        color="neutral"
        variant="link"
        :label="link.title"
        size="xl"
        trailing-icon="i-lucide-arrow-up-left"
        class="uppercase py-1"
        :ui="{
          trailingIcon: 'mb-3 size-4'
        }"
      />
    </div>
  </div>
</template>

<script setup>
const singleBlog = inject('singleBlog')

const links = computed(() => singleBlog.value.resources)
</script>
