<script setup>
definePageMeta({
  title: 'تفاصيل الوظيفة'
});

const route = useRoute();
const id = route.params.id;

const jobDetail = useJobDetail();

await useAPI(`/api/jobs/${id}`, { key: `job-${id}` });

provide('composable', jobDetail);

onMounted(() => {
  jobDetail.loadDrafts();
});

const levelLabels = {
  strong: 'ممتاز',
  good: 'جيد',
  possible: 'محتمل',
  stretch: 'تحدٍّ',
  poor: 'ضعيف'
};

const levelColors = {
  strong: 'success',
  good: 'primary',
  possible: 'warning',
  stretch: 'orange',
  poor: 'error'
};

const generatedByLabels = {
  rules: 'تحليل آلي',
  llm: 'تحليل ذكي',
  hybrid: 'تحليل ذكي + آلي'
};
</script>

<template>
  <div v-if="jobDetail.job.value" class="space-y-6">
    <BaseCard :title="jobDetail.job.value.title" icon="i-lucide-briefcase-business">
      <div class="space-y-6">
        <!-- الشارات -->
        <div class="flex flex-wrap gap-2">
          <ModulesJobsJobSourceBadge :source="jobDetail.job.value.source" />
          <ModulesJobsJobStatusBadge :status="jobDetail.job.value.status" />
          <ModulesJobsJobScoreBadge :score="jobDetail.job.value.latestMatch?.score" />
          <UBadge
            v-if="jobDetail.job.value.latestMatch?.level"
            :color="levelColors[jobDetail.job.value.latestMatch.level]"
            variant="subtle"
            :label="levelLabels[jobDetail.job.value.latestMatch.level]"
          />
          <UBadge
            v-if="jobDetail.job.value.seniority"
            color="neutral"
            variant="outline"
            :label="jobDetail.job.value.seniority"
          />
          <UBadge
            v-if="jobDetail.job.value.workplace"
            color="neutral"
            variant="outline"
            :label="jobDetail.job.value.workplace"
          />
        </div>

        <!-- معلومات أساسية -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div v-if="jobDetail.job.value.company">
            <span class="font-semibold">الشركة: </span>
            {{ jobDetail.job.value.company }}
          </div>
          <div v-if="jobDetail.job.value.location">
            <span class="font-semibold">الموقع: </span>
            {{ jobDetail.job.value.location }}
          </div>
          <div v-if="jobDetail.job.value.postedAt">
            <span class="font-semibold">تاريخ النشر: </span>
            {{ new Date(jobDetail.job.value.postedAt).toLocaleDateString('ar-EG') }}
          </div>
          <div v-if="jobDetail.job.value.salary">
            <span class="font-semibold">الراتب: </span>
            {{ jobDetail.job.value.salary }}
          </div>
        </div>

        <!-- الوصف -->
        <div v-if="jobDetail.job.value.description">
          <h3 class="font-semibold mb-2">
            الوصف الوظيفي
          </h3>
          <p class="text-sm whitespace-pre-wrap leading-relaxed">
            {{ jobDetail.job.value.description }}
          </p>
        </div>

        <!-- المتطلبات -->
        <div v-if="jobDetail.job.value.requirements?.length">
          <h3 class="font-semibold mb-2">
            المتطلبات
          </h3>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li v-for="(req, index) in jobDetail.job.value.requirements" :key="index">
              {{ req }}
            </li>
          </ul>
        </div>

        <!-- المهارات -->
        <div v-if="jobDetail.job.value.skills?.length">
          <h3 class="font-semibold mb-2">
            المهارات المطلوبة
          </h3>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in jobDetail.job.value.skills"
              :key="skill"
              color="primary"
              variant="soft"
              :label="skill"
            />
          </div>
        </div>
      </div>

      <!-- الأزرار -->
      <div class="flex flex-wrap gap-2 mt-6 pt-4 border-t">
        <UButton
          v-if="jobDetail.job.value.jobUrl"
          label="فتح الوظيفة"
          icon="i-lucide-external-link"
          :href="jobDetail.job.value.jobUrl"
          target="_blank"
          color="neutral"
          variant="outline"
        />
        <UButton
          label="تحليل الملاءمة"
          icon="i-lucide-brain-circuit"
          color="primary"
          variant="soft"
          :loading="jobDetail.analyzeLoading.value"
          @click="jobDetail.analyze()"
        />
        <UButton
          label="إنشاء CV Draft"
          icon="i-lucide-file-text"
          color="success"
          variant="soft"
          :loading="jobDetail.draftsLoading.value"
          @click="jobDetail.createDraft()"
        />
        <UButton
          label="مختارة"
          icon="i-lucide-star"
          color="success"
          variant="soft"
          :loading="jobDetail.statusLoading.value"
          @click="jobDetail.updateStatus('shortlisted')"
        />
        <UButton
          label="تجاهل"
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          :loading="jobDetail.statusLoading.value"
          @click="jobDetail.updateStatus('ignored')"
        />
        <UButton
          label="رجوع"
          icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          to="/jobs"
        />
      </div>
    </BaseCard>

    <!-- نتائج التحليل -->
    <BaseCard
      v-if="jobDetail.job.value.latestMatch"
      title="نتائج تحليل الملاءمة"
      icon="i-lucide-brain-circuit"
    >
      <div class="space-y-5">
        <!-- المهارات المتطابقة -->
        <div v-if="jobDetail.job.value.latestMatch.matchedSkills?.length">
          <h4 class="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">
            مهارات متطابقة
          </h4>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in jobDetail.job.value.latestMatch.matchedSkills"
              :key="skill"
              color="success"
              variant="soft"
              :label="skill"
            />
          </div>
        </div>

        <!-- المهارات الناقصة -->
        <div v-if="jobDetail.job.value.latestMatch.missingSkills?.length">
          <h4 class="text-sm font-semibold mb-2 text-red-600 dark:text-red-400">
            مهارات ناقصة
          </h4>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in jobDetail.job.value.latestMatch.missingSkills"
              :key="skill"
              color="error"
              variant="soft"
              :label="skill"
            />
          </div>
        </div>

        <!-- الأسباب -->
        <div v-if="jobDetail.job.value.latestMatch.reasons?.length">
          <h4 class="text-sm font-semibold mb-2">
            أسباب التطابق
          </h4>
          <ul class="space-y-1 text-sm">
            <li
              v-for="(reason, i) in jobDetail.job.value.latestMatch.reasons"
              :key="i"
              class="flex gap-2"
            >
              <UIcon name="i-lucide-check-circle" class="text-primary mt-0.5 shrink-0" />
              {{ reason }}
            </li>
          </ul>
        </div>

        <!-- المخاطر -->
        <div v-if="jobDetail.job.value.latestMatch.risks?.length">
          <h4 class="text-sm font-semibold mb-2 text-orange-600 dark:text-orange-400">
            تنبيهات
          </h4>
          <ul class="space-y-1 text-sm">
            <li
              v-for="(risk, i) in jobDetail.job.value.latestMatch.risks"
              :key="i"
              class="flex gap-2"
            >
              <UIcon name="i-lucide-alert-triangle" class="text-orange-500 mt-0.5 shrink-0" />
              {{ risk }}
            </li>
          </ul>
        </div>

        <!-- التوصيات -->
        <div v-if="jobDetail.job.value.latestMatch.recommendations?.length">
          <h4 class="text-sm font-semibold mb-2">
            توصيات
          </h4>
          <ul class="space-y-1 text-sm">
            <li
              v-for="(rec, i) in jobDetail.job.value.latestMatch.recommendations"
              :key="i"
              class="flex gap-2"
            >
              <UIcon name="i-lucide-lightbulb" class="text-yellow-500 mt-0.5 shrink-0" />
              {{ rec }}
            </li>
          </ul>
        </div>

        <!-- معلومات التحليل -->
        <div class="text-xs text-muted border-t pt-3 flex justify-between">
          <span>{{ generatedByLabels[jobDetail.job.value.latestMatch.generatedBy] || 'تحليل آلي' }}</span>
          <span v-if="jobDetail.job.value.latestMatch.updatedAt">
            آخر تحليل: {{ new Date(jobDetail.job.value.latestMatch.updatedAt).toLocaleDateString('ar-EG') }}
          </span>
        </div>
      </div>
    </BaseCard>

    <!-- حث على التحليل إذا لم يتم بعد -->
    <BaseCard v-else icon="i-lucide-brain-circuit">
      <div class="text-center py-4 text-sm text-muted">
        <p class="mb-3">
          لم يتم تحليل هذه الوظيفة بعد.
        </p>
        <UButton
          label="تحليل الملاءمة الآن"
          icon="i-lucide-brain-circuit"
          color="primary"
          variant="soft"
          :loading="jobDetail.analyzeLoading.value"
          @click="jobDetail.analyze()"
        />
      </div>
    </BaseCard>

    <!-- CV Draft Preview -->
    <ModulesJobsResumeDraftPreview />
  </div>

  <div v-else class="text-center py-12">
    <p class="text-muted mb-4">
      لم يتم العثور على الوظيفة.
    </p>
    <UButton label="العودة للوظائف" icon="i-lucide-arrow-right" to="/jobs" />
  </div>
</template>
