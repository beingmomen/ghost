<script setup>
const props = defineProps({
  run: {
    type: Object,
    default: null
  }
});

const toast = useToast();
const linkedInToastShownFor = ref(null);

const isLinkedInDegraded = (run) => {
  if (!run?.sourceStats) return false;
  const linkedin = run.sourceStats.linkedin;
  return Boolean(linkedin?.degraded && linkedin?.degradedReason !== 'disabled_by_config');
};

watch(
  () => props.run,
  (run) => {
    if (!run?._id) return;
    if (linkedInToastShownFor.value === run._id) return;
    if (!['completed', 'partial', 'failed'].includes(run.status)) return;

    if (isLinkedInDegraded(run)) {
      linkedInToastShownFor.value = run._id;
      toast.add({
        title: 'تحذير: LinkedIn',
        description: 'LinkedIn is currently rate-limited. Retrying via secondary proxy mode...',
        color: 'warning',
        icon: 'i-lucide-triangle-alert'
      });
    }
  },
  { immediate: true, deep: true }
);

const STATUS_MAP = {
  pending: { label: 'في الانتظار', color: 'warning' },
  running: { label: 'جاري البحث...', color: 'info' },
  completed: { label: 'مكتمل', color: 'success' },
  partial: { label: 'مكتمل جزئيًا', color: 'warning' },
  failed: { label: 'فشل', color: 'error' }
};

const SOURCE_LABELS = {
  wuzzuf: 'Wuzzuf',
  linkedin: 'LinkedIn'
};

const DEGRADED_REASON_LABELS = {
  manual_import_only: 'الاستيراد اليدوي فقط',
  disabled_by_config: 'معطّل من الإعدادات'
};

const getStatusBadge = (status) => STATUS_MAP[status] || { label: status, color: 'neutral' };

const getSourceHealthColor = (srcStats) => {
  if (!srcStats) return 'neutral';
  if (srcStats.degraded) return 'warning';
  if (srcStats.errors > 0 && srcStats.saved === 0 && srcStats.skipped === 0) return 'error';
  return 'success';
};

const getSourceHealthLabel = (key, srcStats) => {
  if (!srcStats) return 'لا توجد بيانات';
  if (srcStats.degraded) return 'متدهور';
  if (srcStats.errors > 0 && srcStats.saved === 0 && srcStats.skipped === 0) return 'فشل';
  return `${srcStats.saved ?? 0} محفوظة`;
};

const formatDegradedReason = (reason) =>
  DEGRADED_REASON_LABELS[reason] || reason || '';
</script>

<template>
  <BaseCard v-if="run" title="آخر عملية بحث" icon="i-lucide-history">
    <div class="space-y-3">
      <!-- Overall status -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">الحالة</span>
        <UBadge
          :color="getStatusBadge(run.status).color"
          variant="subtle"
          :label="getStatusBadge(run.status).label"
        />
      </div>

      <!-- Source label -->
      <div v-if="run.source" class="flex items-center justify-between">
        <span class="text-sm text-muted">المصدر</span>
        <span class="text-sm font-medium">{{ run.source === 'all' ? 'الكل' : run.source }}</span>
      </div>

      <!-- Per-source breakdown (source=all only) -->
      <div
        v-if="run.source === 'all' && run.sourceStats"
        class="space-y-2 pt-2 border-t"
      >
        <p class="text-xs text-muted font-medium">
          تفاصيل المصادر
        </p>

        <div
          v-for="(key) in ['wuzzuf', 'linkedin']"
          :key="key"
          class="flex items-center justify-between"
        >
          <span class="text-sm">{{ SOURCE_LABELS[key] }}</span>
          <div class="flex items-center gap-2">
            <UBadge
              :color="getSourceHealthColor(run.sourceStats[key])"
              variant="subtle"
              size="sm"
              :label="getSourceHealthLabel(key, run.sourceStats[key])"
            />
            <!-- Degraded reason tooltip -->
            <UTooltip
              v-if="run.sourceStats[key]?.degraded && run.sourceStats[key]?.degradedReason"
              :text="formatDegradedReason(run.sourceStats[key].degradedReason)"
            >
              <UIcon name="i-lucide-info" class="text-warning size-4 cursor-help" />
            </UTooltip>
          </div>
        </div>

        <!-- LinkedIn degraded hint -->
        <p
          v-if="run.sourceStats.linkedin?.degraded"
          class="text-xs text-warning mt-1"
        >
          LinkedIn لم يتمكن من جلب الوظائف. استخدم زر "استيراد من LinkedIn" كبديل.
        </p>
      </div>

      <!-- Single-source degraded message -->
      <div
        v-else-if="run.source !== 'all' && run.sourceStats?.[run.source]?.degraded"
        class="p-3 bg-warning/10 rounded-lg"
      >
        <p class="text-sm text-warning">
          {{ run.source === 'linkedin' ? 'LinkedIn' : run.source }} متدهور: {{ formatDegradedReason(run.sourceStats[run.source].degradedReason) }}.
          {{ run.source === 'linkedin' ? 'استخدم زر "استيراد من LinkedIn" لإضافة وظائف يدويًا.' : '' }}
        </p>
      </div>

      <!-- Stats (single-source) -->
      <div v-if="run.stats && run.source !== 'all'" class="grid grid-cols-2 gap-4 pt-2 border-t">
        <div class="text-center">
          <p class="text-2xl font-bold text-primary">
            {{ run.stats.saved ?? 0 }}
          </p>
          <p class="text-xs text-muted">
            وظيفة محفوظة
          </p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-muted">
            {{ run.stats.skipped ?? 0 }}
          </p>
          <p class="text-xs text-muted">
            مكررة
          </p>
        </div>
      </div>

      <!-- Stats (all sources) -->
      <div v-else-if="run.stats && run.source === 'all'" class="grid grid-cols-3 gap-2 pt-2 border-t">
        <div class="text-center">
          <p class="text-xl font-bold text-primary">
            {{ run.stats.saved ?? 0 }}
          </p>
          <p class="text-xs text-muted">
            محفوظة
          </p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-muted">
            {{ run.stats.skipped ?? 0 }}
          </p>
          <p class="text-xs text-muted">
            مكررة
          </p>
        </div>
        <div class="text-center">
          <p class="text-xl font-bold text-error">
            {{ run.stats.errors ?? 0 }}
          </p>
          <p class="text-xs text-muted">
            أخطاء
          </p>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="run.errorMessage && run.status === 'failed'" class="p-3 bg-error/10 rounded-lg">
        <p class="text-sm text-error">
          {{ run.errorMessage }}
        </p>
      </div>

      <!-- Completed at -->
      <ClientOnly>
        <div v-if="run.completedAt" class="text-xs text-muted text-end">
          {{ new Date(run.completedAt).toLocaleString('ar-EG') }}
        </div>
      </ClientOnly>
    </div>
  </BaseCard>

  <BaseCard v-else title="آخر عملية بحث" icon="i-lucide-history">
    <p class="text-sm text-muted text-center py-4">
      لم يتم تشغيل بحث بعد.
    </p>
  </BaseCard>
</template>
