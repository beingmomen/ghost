<script setup>
const { state, schema, loading, isRunning, runSearch, latestRun, showImportModal } = inject('composable');

const sourceOptions = [
  { label: 'Wuzzuf', value: 'wuzzuf' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'الكل', value: 'all' }
];

const isLinkedInSource = computed(
  () => state.source === 'linkedin' || state.source === 'all'
);
</script>

<template>
  <div class="space-y-6">
    <BaseCard title="بحث عن وظائف" icon="i-lucide-search">
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="2"
        @submit="runSearch"
      >
        <UFormField
          name="terms"
          label="مصطلحات البحث"
          class="col-span-full"
          required
        >
          <BaseInputTags
            v-model="state.terms"
            placeholder="أضف مصطلح بحث واضغط Enter..."
            class="w-full"
          />
        </UFormField>

        <UFormField name="source" label="المصدر" required>
          <USelectMenu
            v-model="state.source"
            :items="sourceOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <BaseInput
          v-model="state.location"
          name="location"
          label="الموقع"
          placeholder="مثال: Egypt"
        />

        <BaseNumber
          v-model="state.maxPages"
          name="maxPages"
          label="عدد الصفحات"
          :min="1"
          :max="10"
        />

        <BaseNumber
          v-model="state.maxJobs"
          name="maxJobs"
          label="الحد الأقصى للوظائف"
          :min="1"
          :max="200"
        />

        <!-- LinkedIn hint when selected -->
        <div
          v-if="isLinkedInSource"
          class="col-span-full p-3 bg-warning/10 rounded-lg flex items-start gap-2"
        >
          <UIcon name="i-lucide-triangle-alert" class="text-warning mt-0.5 shrink-0" />
          <p class="text-sm text-warning">
            جلب LinkedIn الآلي تجريبي وقد يفشل. استخدم "استيراد من LinkedIn" لإضافة وظائف يدويًا.
          </p>
        </div>

        <template #actions>
          <UButton
            type="submit"
            label="تشغيل البحث"
            icon="i-lucide-play"
            :loading="loading || isRunning"
            :disabled="isRunning"
          />
          <UButton
            label="استيراد من LinkedIn"
            icon="i-lucide-link-2"
            color="neutral"
            variant="outline"
            @click="showImportModal = true"
          />
          <UButton
            label="عرض الوظائف"
            icon="i-lucide-briefcase-business"
            color="neutral"
            variant="outline"
            to="/jobs"
          />
        </template>
      </BaseForm>
    </BaseCard>

    <ModulesJobSearchRunStatus :run="latestRun" />

    <!-- Manual import modal -->
    <ModulesJobSearchLinkedInImportModal
      v-model="showImportModal"
      @imported="() => navigateTo('/jobs')"
    />
  </div>
</template>
