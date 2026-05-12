<script setup>
const props = defineProps({
  source: {
    type: String,
    default: ''
  }
});

const SOURCE_MAP = {
  wuzzuf: { label: 'Wuzzuf', color: 'orange' },
  linkedin: { label: 'LinkedIn', color: 'blue' },
  manual: { label: 'يدوي', color: 'neutral' }
};

const badge = computed(() => SOURCE_MAP[props.source] || { label: props.source || '—', color: 'neutral' });
</script>

<template>
  <UBadge :color="badge.color" variant="subtle" :label="badge.label" />
</template>
