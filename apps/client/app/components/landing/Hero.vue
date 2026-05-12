<script setup>
const { global } = useAppConfig()
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <UColorModeAvatar
        class="size-18 ring ring-default ring-offset-3 ring-offset-bg animate-fade-in"
        :light="global.picture?.light"
        :dark="global.picture?.dark"
        :alt="global.picture?.alt"
      />
    </template>

    <template #title>
      <div class="animate-fade-in">
        {{ global.fullName }}
      </div>

      <div class="animate-fade-in mt-4 text-4xl text-muted">
        {{ global.title }}
      </div>
    </template>

    <template #description>
      <span class="animate-fade-in animation-delay-200">
        {{ global.description }}
      </span>
    </template>

    <template #links>
      <div
        v-if="global.links"
        class="flex items-center gap-2 animate-fade-in animation-delay-300"
      >
        <UButton v-bind="global.links[0]" />
        <UButton
          :color="global.available ? 'success' : 'error'"
          variant="ghost"
          class="gap-2"
          :to="global.available ? global.meetingLink : ''"
          :target="global.available ? '_blank' : undefined"
          :label="global.available ? 'متاح للمشاريع الجديدة' : 'غير متاح حالياً'"
        >
          <template #leading>
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full rounded-full opacity-75"
                :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
              />
              <span
                class="relative inline-flex size-2 scale-90 rounded-full"
                :class="global.available ? 'bg-success' : 'bg-error'"
              />
            </span>
          </template>
        </UButton>
      </div>

      <div class="gap-x-2 inline-flex mt-4 animate-fade-in animation-delay-400">
        <CommonSocialPartLink
          v-for="link in global.socialLinks"
          :key="link.to"
          v-bind="link"
        />
      </div>
    </template>
  </UPageHero>
</template>
