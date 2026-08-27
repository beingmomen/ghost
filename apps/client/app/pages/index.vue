<script setup>
import { IDENTITY } from '#shared/identity'

const config = useRuntimeConfig()

const siteUrl = config.public.siteUrl
const pageTitle = `${IDENTITY.fullName} | ${IDENTITY.title}`

const { error: landingError, refresh: refreshLanding } = await useAPI('/landing', {
  key: 'landing',
  default: () => ({}),
  transform: response => response || {}
})

// JSON-LD — يُصدَّر داخل <head> من الخادم (useHead يُرندَر أثناء SSR)، مش بعد hydration.
// نوعان: WebSite + Person. الـ Person يشارك نفس الـ @id مع الهوية العامة التي يحقنها
// `@nuxtjs/seo` (schemaOrg.identity في nuxt.config) فيدمجهما Google في كيان واحد بدل تكرارهما.
const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': IDENTITY.fullName,
  'alternateName': IDENTITY.fullNameEn,
  'url': siteUrl,
  'description': IDENTITY.seoDescription,
  'inLanguage': 'ar'
}

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#identity`,
  'name': IDENTITY.fullName,
  'alternateName': IDENTITY.fullNameEn,
  'jobTitle': IDENTITY.jobTitle,
  'url': siteUrl,
  'image':
    'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
  'email': 'abdelmomenelshatory@gmail.com',
  'sameAs': [...IDENTITY.sameAs],
  'worksFor': {
    '@type': 'Organization',
    'name': 'Nanosoft',
    'url': 'https://nanosoft.ly/'
  },
  'knowsAbout': [...IDENTITY.knowsAbout],
  'knowsLanguage': ['ar', 'en']
}

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(websiteLd)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(personLd)
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
