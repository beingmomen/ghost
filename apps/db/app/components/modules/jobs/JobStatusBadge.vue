<script setup>
const props = defineProps({
  status: {
    type: String,
    default: ''
  }
});

const STATUS_MAP = {
  new: { label: 'جديدة', color: 'info' },
  shortlisted: { label: 'مختارة', color: 'success' },
  ignored: { label: 'متجاهلة', color: 'neutral' },
  cv_ready: { label: 'CV جاهز', color: 'warning' },
  applied: { label: 'تقدمت', color: 'primary' }
};

const badge = computed(() => STATUS_MAP[props.status] || { label: props.status || '—', color: 'neutral' });
</script>

<template>
  <UBadge :color="badge.color" variant="subtle" :label="badge.label" />
</template>
