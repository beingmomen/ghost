<script setup>
import { IDENTITY } from '#shared/identity'

const config = useRuntimeConfig()

const pageTitle = `${IDENTITY.fullName} | ${IDENTITY.title}`

const { error: landingError, refresh: refreshLanding } = await useAPI('/landing', {
  key: 'landing',
  default: () => ({}),
  transform: response => response || {}
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': IDENTITY.fullName,
        'alternateName': IDENTITY.fullNameEn,
        'url': config.public.siteUrl,
        'description': IDENTITY.seoDescription,
        'inLanguage': 'ar'
      })
    }
  ]
})

useSeoMeta({
  title: pageTitle,
  description: IDENTITY.seoDescription,
  ogTitle: IDENTITY.ogTitle,
  ogDescription: IDENTITY.ogDescription,
  ogType: 'website',
  ogLocale: 'ar_EG',
  ogSiteName: IDENTITY.fullName,
  twitterCard: 'summary_large_image',
  twitterTitle: IDENTITY.ogTitle,
  twitterDescription: IDENTITY.ogDescription,
  twitterSite: '@beingmomen',
  twitterCreator: '@beingmomen',
  author: IDENTITY.fullName
})
</script>

<template>
  <UPage>
    <LandingHero />

    <UPageSection :ui="{ container: '!py-12 sm:!py-16 lg:!py-20 lg:grid lg:grid-cols-2 lg:gap-8 *:min-w-0' }">
      <LandingAbout />
      <LandingWorkExperience
        :api-error="landingError"
        @retry="refreshLanding()"
      />
    </UPageSection>

    <LazyLandingProjects />
    <LazyLandingBlog />
    <LazyLandingTestimonials
      :api-error="landingError"
      @retry="refreshLanding()"
    />
    <LazyLandingFAQ
      :api-error="landingError"
      @retry="refreshLanding()"
    />
  </UPage>
</template>
