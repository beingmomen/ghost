<script setup>
const { global } = useAppConfig()
const config = useRuntimeConfig()

const { data: infoData, error: infoError, refresh: refreshInfo } = await useAPI('/infos', {
  key: 'about-info',
  default: () => ({}),
  transform: response => response.data?.[0] || {}
})

const { data: experiences, error: expError, refresh: refreshExp } = await useAPI('/experiences/all', {
  key: 'about-experiences',
  default: () => [],
  transform: response => Array.isArray(response) ? response : (response?.data || [])
})

const page = computed(() => {
  const info = infoData.value || {}
  return {
    title: 'نبذة عني',
    description: 'Frontend Engineer بخبرة تزيد عن 5 سنوات. أبني تطبيقات ويب حديثة وعالية الأداء مع التركيز على تجربة المستخدم.',
    story: {
      paragraphs: info.bio?.paragraphs || [],
      quote: info.bio?.quote || ''
    },
    skills: info.skills || [],
    images: (info.images || []).map(img => ({
      ...img,
      src: optimizeCloudinary(img.src, 'f_auto,q_auto,w_256,h_256,c_fill')
    }))
  }
})

const pageDescription = 'Frontend Engineer بخبرة تزيد عن 5 سنوات. أبني تطبيقات ويب حديثة وعالية الأداء مع التركيز على تجربة المستخدم.'

useSeoMeta({
  title: 'نبذة عني | عبدالمؤمن الشطوري',
  ogTitle: 'نبذة عني | عبدالمؤمن الشطوري',
  description: pageDescription,
  ogDescription: pageDescription,
  ogUrl: `${config.public.siteUrl}/about`,
  ogType: 'website',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'نبذة عني | عبدالمؤمن الشطوري',
  twitterDescription: pageDescription,
  twitterSite: '@beingmomen',
  keywords: 'عبدالمؤمن الشطوري, Frontend Engineer, Frontend Engineer, تطوير ويب, مطور واجهات أمامية'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        'name': 'نبذة عني',
        'description': pageDescription,
        'url': `${config.public.siteUrl}/about`,
        'mainEntity': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'jobTitle': 'Frontend Engineer',
          'email': 'abdelmomenelshatory@gmail.com'
        }
      })
    }
  ]
})

useBreadcrumbSchema([{ name: 'نبذة عني', path: '/about' }])
</script>

<template>
  <UPage>
    <!-- ========== SECTION 1: HERO ========== -->
    <UPageHero
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: '!mx-0 text-right',
        description: '!mx-0 text-right',
        links: 'justify-start'
      }"
    >
      <div class="animate-fade-in">
        <UColorModeAvatar
          class="size-24 sm:size-32 lg:size-36 rounded-2xl ring-2 ring-primary/30 ring-offset-4 ring-offset-bg rotate-2 hover:rotate-0 transition-all duration-500"
          :light="optimizeCloudinary(global.picture?.light, 'f_auto,q_auto,w_288')"
          :dark="optimizeCloudinary(global.picture?.dark, 'f_auto,q_auto,w_288')"
          :alt="global.picture?.alt"
        />
      </div>

      <template #headline>
        <span class="animate-fade-in animation-delay-200">
          <UBadge
            label="Abdelmomen Elshatory - Frontend Engineer"
            color="primary"
            variant="soft"
            size="sm"
          />
        </span>
      </template>

      <template #title>
        <span class="animate-fade-in animation-delay-300">
          <span class="text-amber">عبدالمؤمن الشطوري</span>
        </span>
      </template>

      <template #description>
        <span class="animate-fade-in animation-delay-400">
          {{ page.description }}
        </span>
      </template>

      <template #links>
        <span class="animate-fade-in animation-delay-500">
          <div class="flex items-center gap-2">
            <UButton
              label="تواصل معي"
              to="/contact"
              color="primary"
              size="md"
            />
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
        </span>
      </template>
    </UPageHero>

    <LandingSectionFallback
      v-if="infoError || expError"
      state="error"
      title="تعذّر تحميل بعض المحتوى"
      message="حدث خطأ أثناء جلب بيانات الصفحة. حاول مرة أخرى بعد لحظات."
      alt-action-label="تواصل معي"
      alt-action-to="/contact"
      @retry="refreshInfo(); refreshExp()"
    />

    <!-- ========== SECTION 2: STORY ========== -->
    <UPageSection
      v-if="page.story.paragraphs.length || page.story.quote || page.images.length"
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="lg:grid lg:grid-cols-3 lg:gap-10">
        <div class="lg:col-span-2 space-y-6">
          <h2 class="text-right text-xl sm:text-2xl font-medium text-highlighted">
            قصتي
          </h2>

          <p
            v-for="(paragraph, index) in page.story.paragraphs"
            :key="index"
            class="text-muted text-right text-base sm:text-lg leading-relaxed"
          >
            {{ paragraph }}
          </p>

          <blockquote
            v-if="page.story.quote"
            class="border border-default bg-elevated/40 p-5 rounded-xl"
          >
            <p class="text-muted text-base sm:text-lg font-medium leading-relaxed text-right">
              "{{ page.story.quote }}"
            </p>
          </blockquote>
        </div>

        <div class="lg:col-span-1 flex flex-col items-center justify-center gap-4 lg:gap-6 py-10 lg:py-0">
          <div
            v-for="(image, index) in page.images"
            :key="index"
            class="animate-fade-in"
            :style="{ animationDelay: `${0.3 + 0.15 * index}s` }"
          >
            <PolaroidItem
              :image="image"
              :index="index"
            />
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- ========== SECTION 4: SKILLS ========== -->
    <UPageSection
      v-if="page.skills.length"
      title="المهارات التقنية"
      :ui="{
        container: '!pt-0',
        title: 'text-right text-xl sm:text-2xl font-medium'
      }"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div
          v-for="(category, cIndex) in page.skills"
          :key="cIndex"
          class="animate-fade-in"
          :style="{ animationDelay: `${0.2 + cIndex * 0.15}s` }"
        >
          <div class="rounded-2xl border border-default bg-elevated/40 p-5 sm:p-6 space-y-4 hover:shadow-md transition-all duration-300 group">
            <div class="flex items-center justify-end gap-3">
              <span class="font-semibold text-base text-right text-highlighted">
                {{ category.title }}
              </span>
              <UIcon
                :name="category.icon"
                class="size-6 text-muted shrink-0"
              />
            </div>

            <USeparator />

            <div class="flex flex-wrap gap-2 justify-end">
              <UBadge
                v-for="(skill, sIndex) in category.items"
                :key="sIndex"
                :label="skill.name"
                color="neutral"
                variant="subtle"
                size="sm"
                class="gap-1.5 cursor-default select-none"
              >
                <template #leading>
                  <UIcon
                    :name="skill.icon"
                    class="size-3.5"
                  />
                </template>
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- ========== SECTION 5: WORK EXPERIENCE ========== -->
    <UPageSection
      v-if="experiences.length"
      title="الخبرات العملية"
      :ui="{
        title: 'text-right text-xl sm:text-2xl font-medium'
      }"
    >
      <div class="relative">
        <div class="hidden sm:block absolute top-0 right-5 w-px h-full bg-default" />

        <div class="space-y-6">
          <div
            v-for="(exp, index) in experiences"
            :key="index"
            class="animate-fade-in"
            :style="{ animationDelay: `${0.2 + index * 0.15}s` }"
          >
            <div class="relative flex items-start gap-4 sm:pr-14">
              <!-- Timeline node -->
              <div
                class="hidden sm:flex absolute right-0 top-2 items-center justify-center size-10 rounded-xl border shadow-sm transition-all duration-300"
                :class="exp.endDate === 'الحالي'
                  ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
                  : 'bg-elevated border-default'"
              >
                <UIcon
                  :name="exp.endDate === 'الحالي' ? 'i-lucide-zap' : 'i-lucide-building-2'"
                  class="size-4"
                  :class="exp.endDate === 'الحالي' ? 'text-primary' : 'text-muted'"
                />
              </div>

              <!-- Mobile left-border accent -->
              <div
                class="sm:hidden absolute right-0 top-0 bottom-0 w-px"
                :class="exp.endDate === 'الحالي' ? 'bg-primary' : 'bg-default'"
              />

              <!-- Experience card -->
              <div
                class="flex-1 rounded-xl border border-default bg-elevated/40 p-4 sm:p-5 mr-4 sm:mr-0 transition-all duration-300 hover:shadow-md"
              >
                <div class="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <ULink
                      :to="exp.companySiteUrl"
                      target="_blank"
                      class="font-semibold text-base text-highlighted hover:text-highlighted transition-colors duration-200 inline-flex items-center gap-1.5"
                    >
                      {{ exp.company }}
                      <UIcon
                        name="i-lucide-external-link"
                        class="size-3.5 text-muted"
                      />
                    </ULink>
                    <p class="text-base text-muted mt-0.5">
                      {{ exp.position }}
                    </p>
                  </div>
                  <div class="shrink-0 flex flex-col items-end gap-1">
                    <UBadge
                      :label="`${formatArabicDate(exp.startDate)} — ${formatArabicDate(exp.endDate)}`"
                      color="neutral"
                      variant="subtle"
                      size="xs"
                    />
                    <div class="flex gap-1.5">
                      <UBadge
                        :label="exp.employmentType"
                        color="primary"
                        variant="subtle"
                        size="xs"
                      />
                      <UBadge
                        v-if="exp.workPlace"
                        :label="exp.workPlace"
                        color="neutral"
                        variant="outline"
                        size="xs"
                      />
                    </div>
                  </div>
                </div>

                <USeparator class="my-3" />

                <ul class="space-y-2">
                  <li
                    v-for="(resp, rIndex) in exp.responsibilities.slice(0, 3)"
                    :key="rIndex"
                    class="flex items-start gap-2 text-base text-muted"
                  >
                    <UIcon
                      name="i-lucide-circle-check"
                      class="size-3.5 text-muted mt-1 shrink-0"
                    />
                    <span>{{ resp }}</span>
                  </li>
                </ul>
                <p
                  v-if="exp.responsibilities.length > 3"
                  class="text-xs text-dimmed text-right mt-2"
                >
                  +{{ exp.responsibilities.length - 3 }} مسؤوليات أخرى
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
