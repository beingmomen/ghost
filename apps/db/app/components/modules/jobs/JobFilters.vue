<script setup>
const { source, status, seniority, keyword, minMatchScore, resetFilters } =
  inject('composable');

const sourceOptions = [
  { label: 'Wuzzuf', value: 'wuzzuf' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'يدوي', value: 'manual' }
];

const statusOptions = [
  { label: 'جديدة', value: 'new' },
  { label: 'مختارة', value: 'shortlisted' },
  { label: 'متجاهلة', value: 'ignored' },
  { label: 'CV جاهز', value: 'cv_ready' },
  { label: 'تقدمت', value: 'applied' }
];

const seniorityOptions = [
  { label: 'مبتدئ', value: 'junior' },
  { label: 'متوسط', value: 'mid' },
  { label: 'متقدم', value: 'senior' },
  { label: 'مدير', value: 'lead' }
];
</script>

<template>
  <BaseCard title="الفلاتر" icon="i-lucide-filter">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UFormField label="بحث نصي">
        <UInput
          v-model="keyword"
          placeholder="ابحث عن وظيفة..."
          icon="i-lucide-search"
          class="w-full"
        />
      </UFormField>

      <UFormField label="المصدر">
        <USelectMenu
          v-model="source"
          :items="sourceOptions"
          value-key="value"
          placeholder="الكل"
          class="w-full"
        />
      </UFormField>

      <UFormField label="الحالة">
        <USelectMenu
          v-model="status"
          :items="statusOptions"
          value-key="value"
          placeholder="الكل"
          class="w-full"
        />
      </UFormField>

      <UFormField label="المستوى">
        <USelectMenu
          v-model="seniority"
          :items="seniorityOptions"
          value-key="value"
          placeholder="الكل"
          class="w-full"
        />
      </UFormField>
    </div>

    <div class="mt-4">
      <UFormField
        :label="`الحد الأدنى لنتيجة التطابق: ${minMatchScore}%`"
        help="يُفلتر الوظائف المعروضة بناءً على تقييم الذكاء الاصطناعي."
      >
        <USlider
          v-model="minMatchScore"
          :min="0"
          :max="100"
          :step="5"
          data-testid="min-score-slider"
        />
      </UFormField>
    </div>

    <div class="mt-4 flex justify-end">
      <UButton
        label="مسح الفلاتر"
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="resetFilters"
      />
    </div>
  </BaseCard>
</template>
