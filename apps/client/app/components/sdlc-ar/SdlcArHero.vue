<script setup>
defineProps({
  phases: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <SdlcHero
    :phases="phases"
    badge-label="دليل المعماري · OOA&D"
    title="دورة حياة"
    title-highlight="تطوير البرمجيات"
    description="إطار بصري معرفي للمفكرين النظاميين — يحوّل نظرية SDLC إلى نموذج ذهني تفاعلي للتحليل والتصميم كائني التوجه."
    button-label="استكشف المراحل"
    arrow-icon="i-lucide-arrow-left"
  />
</template>
