<script setup>
const { global } = useAppConfig()
const config = useRuntimeConfig()

const { data: infoData } = await useAPI('/infos', {
  key: 'about-info',
  default: () => ({}),
  transform: response => response.data?.[0] || {}
})

const { data: experiences } = await useAPI('/experiences/all', {
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
    stats: info.stats || [],
    skills: info.skills || [],
    images: info.images || []
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
          :light="global.picture?.light"
          :dark="global.picture?.dark"
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
          <span class="text-gradient">عبدالمؤمن الشطوري</span>
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

    <!-- ========== SECTION 2: STORY ========== -->
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="lg:grid lg:grid-cols-3 lg:gap-10">
        <div class="lg:col-span-2 space-y-6">
          <div class="animate-fade-in animation-delay-100">
            <h2 class="text-right text-xl sm:text-2xl font-medium text-highlighted">
              قصتي
            </h2>
          </div>

          <div
            v-for="(paragraph, index) in page.story.paragraphs"
            :key="index"
            class="animate-fade-in"
            :style="{ animationDelay: `${0.15 + 0.15 * index}s` }"
          >
            <p class="text-muted text-right text-base sm:text-lg leading-relaxed">
              {{ paragraph }}
            </p>
          </div>

          <div
            class="animate-fade-in"
            style="animation-delay: 0.45s"
          >
            <blockquote class="border-r-4 border-primary pr-6 py-3 bg-primary/5 dark:bg-primary/10 rounded-l-xl">
              <p class="text-primary-600 dark:text-primary-400 text-base sm:text-lg font-medium leading-relaxed text-right">
                "{{ page.story.quote }}"
              </p>
            </blockquote>
          </div>
        </div>

        <div class="lg:col-span-1 flex flex-row lg:flex-col justify-center items-center py-10 lg:py-0 -space-x-8 lg:space-x-0 lg:gap-6">
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

    <!-- ========== SECTION 3: STATS ========== -->
    <UPageSection
      :ui="{
        container: 'px-0'
      }"
    >
      <div class="-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 border-y border-default py-10 px-4 sm:px-12 lg:px-16">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-(--ui-container) mx-auto">
          <div
            v-for="(stat, index) in page.stats"
            :key="index"
            class="animate-fade-in"
            :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
          >
            <div class="flex flex-col items-center gap-2 text-center group">
              <div class="p-3 rounded-2xl bg-primary/10 dark:bg-primary/15 group-hover:bg-primary/20 transition-colors duration-300">
                <UIcon
                  :name="stat.icon"
                  class="size-5 text-primary"
                />
              </div>
              <span class="text-4xl sm:text-5xl font-bold text-gradient">
                {{ stat.value }}
              </span>
              <span class="text-base text-muted">
                {{ stat.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- ========== SECTION 4: SKILLS ========== -->
    <UPageSection
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
          <div class="rounded-2xl border border-default bg-elevated/40 p-5 sm:p-6 space-y-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
            <div class="flex items-center justify-end gap-3">
              <span class="font-semibold text-base text-right text-highlighted">
                {{ category.title }}
              </span>
              <div class="size-10 rounded-xl bg-primary/10 dark:bg-primary/15 group-hover:bg-primary/20 transition-colors duration-300 shrink-0 flex items-center justify-center">
                <UIcon
                  :name="category.icon"
                  class="size-5 text-primary"
                />
              </div>
            </div>

            <USeparator />

            <div class="flex flex-wrap gap-2 justify-end">
              <div
                v-for="(skill, sIndex) in category.items"
                :key="sIndex"
                class="animate-fade-in"
                :style="{ animationDelay: `${0.3 + cIndex * 0.1 + sIndex * 0.05}s` }"
              >
                <UBadge
                  :label="skill.name"
                  color="primary"
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
      </div>
    </UPageSection>

    <!-- ========== SECTION 5: WORK EXPERIENCE ========== -->
    <UPageSection
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
                class="sm:hidden absolute right-0 top-0 bottom-0 w-0.5 rounded-full"
                :class="exp.endDate === 'الحالي' ? 'bg-primary' : 'bg-default'"
              />

              <!-- Experience card -->
              <div
                class="flex-1 rounded-xl border p-4 sm:p-5 mr-4 sm:mr-0 transition-all duration-300 hover:shadow-md"
                :class="exp.endDate === 'الحالي'
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-default bg-elevated/40'"
              >
                <div class="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <ULink
                      :to="exp.companySiteUrl"
                      target="_blank"
                      class="font-semibold text-base text-highlighted hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5"
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
                      class="size-3.5 text-primary/50 mt-1 shrink-0"
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

    <!-- ========== SECTION 6: CTA ========== -->
    <UPageSection :ui="{ container: '!pt-0' }">
      <div class="animate-fade-in animation-delay-200">
        <UPageCTA
          title="هل لديك مشروع في ذهنك؟"
          description="سواء كان مشروعاً جديداً أو تحسين منتج قائم، أنا هنا للمساعدة والتعاون. لا تتردد في التواصل."
          variant="subtle"
          :ui="{
            container: 'sm:py-12 lg:py-16 sm:gap-6',
            title: 'text-2xl sm:text-3xl font-bold',
            description: '!text-base text-muted mt-2 leading-relaxed'
          }"
        >
          <template #links>
            <div class="flex flex-wrap items-center gap-3 justify-center">
              <UButton
                label="تواصل معي الآن"
                to="/contact"
                color="primary"
                size="lg"
                trailing-icon="i-lucide-arrow-left"
              />
              <UButton
                label="عرض المشاريع"
                to="/projects"
                color="neutral"
                variant="outline"
                size="lg"
                trailing-icon="i-lucide-folder-open"
              />
            </div>
          </template>
        </UPageCTA>
      </div>
    </UPageSection>
  </UPage>
</template>
