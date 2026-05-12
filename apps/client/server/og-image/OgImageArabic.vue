<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    dir="rtl"
    lang="ar"
    :style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
      padding: '60px',
      fontFamily: 'Tajawal, sans-serif'
    }"
  >
    <div
      :style="{
        fontSize: '48px',
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '20px'
      }"
    >
      {{ title || 'عبدالمؤمن الشطوري' }}
    </div>
    <div
      :style="{
        fontSize: '24px',
        color: '#94a3b8',
        textAlign: 'center',
        maxWidth: '800px'
      }"
    >
      {{ description || 'Frontend Engineer' }}
    </div>
    <div
      :style="{
        marginTop: '40px',
        fontSize: '18px',
        color: '#60a5fa'
      }"
    >
      beingmomen.com
    </div>
  </div>
</template>
