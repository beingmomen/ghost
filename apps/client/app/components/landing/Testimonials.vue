<script setup>
const { data } = useNuxtData('landing')
const config = useRuntimeConfig()

const testimonials = computed(() => {
  const items = data.value?.testimonials || []
  return items.map(item => ({
    quote: item.description,
    author: {
      name: item.name,
      description: item.email,
      avatar: {
        src: item.image?.trim() ? (item.image.startsWith('http') ? item.image : `${config.public.cloudinary.cloudinaryUrl}${item.image}`) : undefined,
        alt: item.name
      }
    }
  }))
})
</script>

<template>
  <UPageSection :ui="{ container: 'px-0 !pt-0' }">
    <UCarousel
      v-if="testimonials.length"
      v-slot="{ item }"
      :items="testimonials"
      :autoplay="{ delay: 4000 }"
      loop
      dots
      :ui="{
        viewport: '-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 max-w-(--ui-container)'
      }"
    >
      <UPageCTA
        :description="item.quote"
        variant="naked"
        class="rounded-none"
        :ui="{
          container: 'sm:py-12 lg:py-12 sm:gap-8',
          description: '!text-base text-balance before:content-[open-quote] before:text-5xl lg:before:text-7xl before:inline-block before:text-dimmed before:absolute before:-mr-6 lg:before:-mr-10 before:-mt-2 lg:before:-mt-4 after:content-[close-quote] after:text-5xl lg:after:text-7xl after:inline-block after:text-dimmed after:absolute after:mt-1 lg:after:mt-0 after:mr-1 lg:after:mr-2'
        }"
      >
        <UUser
          v-bind="item.author"
          size="xl"
          class="justify-center"
        />
      </UPageCTA>
    </UCarousel>
  </UPageSection>
</template>
