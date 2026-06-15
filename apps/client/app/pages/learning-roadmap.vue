<script setup>
const config = useRuntimeConfig();

const {
  data: roadmap,
  error: roadmapError,
  refresh: refreshRoadmap
} = await useAPI('/roadmap', {
  key: 'roadmap',
  default: () => ({ settings: {}, stats: {}, phases: [] }),
  transform: (response) => response.data || {}
});

const stats = computed(() => roadmap.value?.stats || {});
const phases = computed(() => roadmap.value?.phases || []);

const pageDescription =
  'مسار تعلم مُمنهَج للوصول من Mid إلى Senior Front-end Engineer — مقسّم إلى مراحل وأسابيع ومهام مع متابعة حيّة للتقدّم.';

useSeoMeta({
  title: 'مسار التطور لـ Senior | عبدالمؤمن الشطوري',
  ogTitle: 'مسار التطور لـ Senior | عبدالمؤمن الشطوري',
  description: pageDescription,
  ogDescription: pageDescription,
  ogUrl: `${config.public.siteUrl}/learning-roadmap`,
  ogType: 'website',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'مسار التطور لـ Senior | عبدالمؤمن الشطوري',
  twitterDescription: pageDescription,
  twitterSite: '@beingmomen',
  keywords:
    'مسار التعلم, Senior Front-end, خطة تعلم, عبدالمؤمن الشطوري, تطوير الواجهات'
});

useBreadcrumbSchema([{ name: 'مسار التعلم', path: '/learning-roadmap' }]);
</script>

<template>
  <UPage>
    <UPageHero
      title="مسار التطور لـ Senior"
      description="رحلة تعلّم مُمنهَجة من Mid إلى Senior Front-end Engineer — مع متابعة حيّة للتقدّم."
      :ui="{
        title: '!mx-0 text-right',
        description: '!mx-0 text-right'
      }"
    />

    <LandingSectionFallback
      v-if="roadmapError"
      state="error"
      title="تعذّر تحميل المسار"
      message="حدث خطأ أثناء جلب بيانات المسار. حاول مرة أخرى بعد لحظات."
      @retry="refreshRoadmap()"
    />

    <template v-else>
      <UPageSection v-if="stats.totalTasks" :ui="{ container: '!pt-0' }">
        <RoadmapHero :stats="stats" />
      </UPageSection>

      <UPageSection
        title="المراحل"
        :ui="{
          container: '!pt-0',
          title: 'text-right text-xl lg:text-2xl font-medium'
        }"
      >
        <div class="space-y-3">
          <RoadmapPhaseSection
            v-for="(phase, i) in phases"
            :key="phase.id"
            :phase="phase"
            :default-open="i === 0"
          />
          <p
            v-if="!phases.length"
            class="rounded-lg border border-dashed border-default p-8 text-center text-muted"
          >
            لا توجد بيانات لعرضها حالياً.
          </p>
        </div>
      </UPageSection>
    </template>
  </UPage>
</template>
