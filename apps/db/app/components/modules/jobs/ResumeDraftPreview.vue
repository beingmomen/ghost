<script setup>
const composable = inject('composable');

const drafts = composable.drafts;
const draftsLoading = composable.draftsLoading;
const createDraft = composable.createDraft;

const latestDraft = computed(() => drafts.value?.[0] || null);

const copied = ref(false);

const copyText = async () => {
  const text = latestDraft.value?.content?.text;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <BaseCard title="CV Draft - ATS" icon="i-lucide-file-text">
    <!-- أزرار التحكم -->
    <div class="flex flex-wrap gap-2 mb-4">
      <UButton
        label="إنشاء CV Draft جديد"
        icon="i-lucide-plus"
        color="primary"
        variant="soft"
        :loading="draftsLoading"
        @click="createDraft()"
      />
      <UButton
        v-if="latestDraft?.content?.text"
        :label="copied ? 'تم النسخ!' : 'نسخ النص'"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        color="neutral"
        variant="outline"
        :disabled="copied"
        @click="copyText()"
      />
    </div>

    <!-- لا يوجد draft بعد -->
    <div v-if="!latestDraft" class="text-center py-6 text-sm text-muted">
      <UIcon name="i-lucide-file-x" class="text-3xl mb-2 opacity-40" />
      <p>لم يتم توليد أي CV draft بعد لهذه الوظيفة.</p>
    </div>

    <template v-else>
      <!-- التحذيرات -->
      <div
        v-if="latestDraft.warnings?.length"
        class="space-y-2 mb-4"
      >
        <UAlert
          v-for="(warning, i) in latestDraft.warnings"
          :key="i"
          color="warning"
          variant="soft"
          icon="i-lucide-alert-triangle"
          :description="warning"
        />
      </div>

      <!-- نص الـ CV -->
      <pre
        class="bg-muted/30 border rounded-lg p-4 text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto max-h-[600px] overflow-y-auto"
        dir="ltr"
      >{{ latestDraft.content?.text }}</pre>

      <!-- معلومات التوليد -->
      <div class="mt-3 text-xs text-muted flex justify-between flex-wrap gap-1">
        <span v-if="latestDraft.profileVersion">
          إصدار البروفايل: {{ latestDraft.profileVersion }}
        </span>
        <span v-if="latestDraft.createdAt">
          تاريخ التوليد: {{ new Date(latestDraft.createdAt).toLocaleDateString('ar-EG') }}
        </span>
      </div>

      <!-- عدد الإصدارات -->
      <div v-if="drafts.length > 1" class="mt-2 text-xs text-muted">
        يوجد {{ drafts.length }} إصدار — يُعرض الأحدث
      </div>
    </template>
  </BaseCard>
</template>
