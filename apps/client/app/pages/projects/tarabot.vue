<script setup>
definePageMeta({
  title: 'ترابط'
})

useHead({
  title: 'ترابط | Tarabot',
  meta: [
    {
      name: 'description',
      content: 'منصة تربط المتطوعين والمنظمات والداعمين'
    }
  ]
})

useSeoMeta({
  ogTitle: 'ترابط | Tarabot',
  ogDescription: 'منصة تربط المتطوعين والمنظمات والداعمين',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'ترابط | Tarabot',
  twitterDescription: 'منصة تربط المتطوعين والمنظمات والداعمين',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([
  { name: 'المشاريع', path: '/projects' },
  { name: 'ترابط', path: '/projects/tarabot' }
])

const config = useRuntimeConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': 'ترابط | Tarabot',
        'description': 'منصة تربط المتطوعين والمنظمات والداعمين',
        'url': `${config.public.siteUrl}/projects/tarabot`,
        'inLanguage': 'ar',
        'author': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'url': config.public.siteUrl
        },
        'publisher': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'url': config.public.siteUrl
        }
      })
    }
  ]
})

const heroLinks = [
  {
    label: 'عرض المنصة',
    to: 'https://tarabot.beingmomen.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: 'i-lucide-external-link'
  }
]

const quickFacts = [
  { label: 'الدور', value: 'مطوّر فردي — الواجهة والـ API' },
  { label: 'المدة', value: 'شهر واحد' },
  { label: 'الحالة', value: 'مشروع عميل — سُلّم' },
  { label: 'التقنيات', value: 'Nuxt 3 · Nuxt UI · Express · MongoDB · JWT · pnpm monorepo' }
]

const screenshots = [
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/projects-list',
    alt: 'قائمة المشاريع التطوعية في منصة ترابط مع اسم المنظمة ومقدار الدعم وعدد المتطوعين وحالة المشروع',
    width: 1935,
    height: 766
  },
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/project-detail',
    alt: 'صفحة مشروع تطوعي في منصة ترابط تعرض الوصف ومقدار الدعم المطلوب وعدد المتطوعين والمنظمة المنفذة وقوائم الداعمين والمتطوعين',
    width: 1927,
    height: 1036
  },
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/join-requests',
    alt: 'إدارة طلبات الانضمام في منصة ترابط بأنواع الحسابات (متطوع، منظمة، داعم، مدرب) وحالة كل طلب',
    width: 1930,
    height: 1000
  },
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/workshops',
    alt: 'صفحة ورش العمل في منصة ترابط',
    width: 1933,
    height: 808
  }
]
</script>

<template>
  <UPage dir="rtl">
    <UPageHero
      title="ترابط | Tarabot"
      description="منصة تربط المتطوعين والمنظمات والداعمين"
      :links="heroLinks"
      :ui="{
        title: '!mx-0 text-right',
        description: '!mx-0 text-right',
        links: 'justify-start'
      }"
    />

    <UPageSection :ui="{ container: '!pt-0 pb-8 sm:pb-10' }">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-default/60 bg-elevated/30 p-5">
        <div
          v-for="fact in quickFacts"
          :key="fact.label"
          class="text-right"
        >
          <p class="text-xs font-medium text-muted mb-1">
            {{ fact.label }}
          </p>
          <p class="text-sm sm:text-base font-semibold text-highlighted leading-snug">
            {{ fact.value }}
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="المشكلة"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <div class="text-right space-y-3">
        <p class="text-base text-muted leading-relaxed">
          العمل التطوعي فيه ثلاثة أطراف محتاجين بعض ومش متصلين: منظمات عندها مشاريع ومحتاجة متطوعين ودعم، ومتطوعون بيدوّروا على فرص حقيقية يشاركوا فيها، وداعمون عايزين يوصلوا لمشاريع واضحة يدعموها.
        </p>
        <p class="text-base text-muted leading-relaxed">
          من غير مكان واحد يجمعهم، الطلبات بتضيع ومفيش صورة واضحة لحالة كل مشروع أو مين انضم له.
        </p>
      </div>
    </UPageSection>

    <UPageSection
      title="المنصة"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <div class="text-right space-y-3">
        <p class="text-base text-muted leading-relaxed">
          منصة واحدة بتجمع الأطراف الثلاثة: المنظمة بتنشر مشروعها التطوعي، والمتطوع بيقدّم عليه، والداعم بيشوف المشاريع ويدعمها — وكل طلبات الانضمام والدعم بتتدار في مكان واحد بشكل منظّم وشفاف.
        </p>
        <p class="text-base text-muted leading-relaxed">
          المنصة بتدعم كمان <span class="font-semibold text-highlighted">ورش عمل</span> و<span class="font-semibold text-highlighted">أنواع حسابات متعددة</span> (متطوع، منظمة، داعم، مدرب) — كل نوع حساب بصلاحياته وواجهته.
        </p>
      </div>
    </UPageSection>

    <UPageSection
      title="البنية"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <p class="text-base text-muted leading-relaxed text-right">
        مبني كمونوريبو بـ pnpm workspaces — واجهة Nuxt 3 وAPI بـ Express وMongoDB، بمصادقة JWT.
      </p>
    </UPageSection>

    <UPageSection
      title="لقطات الشاشة"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <div class="space-y-6">
        <div
          v-for="screenshot in screenshots"
          :key="screenshot.src"
          class="rounded-xl border border-default/60 overflow-hidden"
        >
          <CommonProjectImage
            :src="screenshot.src"
            :alt="screenshot.alt"
            :width="screenshot.width"
            :height="screenshot.height"
            loading="lazy"
            image-class="w-full h-auto"
          />
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
