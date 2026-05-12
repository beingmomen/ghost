<script setup>
const props = defineProps({
  score: {
    type: Number,
    default: undefined
  }
});

const scoreColor = computed(() => {
  if (props.score === undefined || props.score === null) return 'neutral';
  if (props.score >= 80) return 'success';
  if (props.score >= 60) return 'warning';
  return 'error';
});
</script>

<template>
  <UBadge v-if="score !== undefined && score !== null" :color="scoreColor" variant="subtle">
    {{ score }}%
  </UBadge>
  <UBadge
    v-else
    color="neutral"
    variant="soft"
    label="غير محلل"
  />
</template>
