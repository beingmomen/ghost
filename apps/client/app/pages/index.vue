<script setup>
const config = useRuntimeConfig()

await useAPI('/landing', {
  key: 'landing',
  default: () => ({}),
  transform: response => response.data || {}
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'عبدالمؤمن الشطوري',
        'alternateName': 'Abdelmomen Elshatory',
        'url': config.public.siteUrl,
        'description': 'Frontend Engineer بخبرة تزيد عن 5 سنوات في بناء تطبيقات ويب حديثة وعالية الأداء',
        'inLanguage': 'ar'
      })
    }
  ]
})

useSeoMeta({
  title: 'عبدالمؤمن الشطوري | Frontend Engineer',
  description: 'Frontend Engineer بخبرة تزيد عن 5 سنوات في بناء تطبيقات ويب حديثة وعالية الأداء. تصفح مشاريعي العملية، آراء العملاء، واتصل بي مباشرة لتنفيذ أفكارك التقنية.',
  ogTitle: 'عبدالمؤمن الشطوري | Frontend Engineer',
  ogDescription: 'حلول برمجية مبتكرة وتجارب مستخدم استثنائية — تصفح أعمالي واحصل على استشارة مجانية الآن',
  ogType: 'website',
  ogLocale: 'ar_EG',
  ogSiteName: 'عبدالمؤمن الشطوري',
  twitterCard: 'summary_large_image',
  twitterTitle: 'عبدالمؤمن الشطوري | Frontend Engineer',
  twitterDescription: 'حلول برمجية مبتكرة وتجارب مستخدم استثنائية — تصفح أعمالي واحصل على استشارة مجانية',
  twitterSite: '@beingmomen',
  twitterCreator: '@beingmomen',
  author: 'عبدالمؤمن الشطوري'
})
</script>

<template>
  <UPage>
    <LandingHero />

    <UPageSection :ui="{ container: '!pt-0 lg:grid lg:grid-cols-2 lg:gap-8 *:min-w-0' }">
      <LandingAbout />
      <LandingWorkExperience />
    </UPageSection>

    <LazyLandingStats />
    <LazyLandingBlog />
    <LazyLandingTestimonials />
    <LazyLandingFAQ />
  </UPage>
</template>
