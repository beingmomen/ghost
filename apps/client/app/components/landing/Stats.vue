<script setup>
import { ref, computed, onMounted } from 'vue'

const stats = [
  { value: '+5', label: 'سنوات خبرة', icon: 'i-lucide-calendar-days' },
  { value: '+10', label: 'مشروع منجز', icon: 'i-lucide-folder-check' },
  { value: '3', label: 'شركات', icon: 'i-lucide-building-2' },
  { value: '22', label: 'عملاء', icon: 'i-lucide-users' }
]

function useCountUp(target, duration = 1800) {
  const current = ref(0)
  const hasPlus = target.startsWith('+')
  const numericValue = parseInt(target.replace('+', ''))

  function start() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      current.value = numericValue
      return
    }
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      current.value = Math.round(eased * numericValue)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const display = computed(() => hasPlus ? `+${current.value}` : `${current.value}`)
  return { display, start }
}

const counters = stats.map(s => useCountUp(s.value))
const sectionRef = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        counters.forEach(c => c.start())
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
  <UPageSection
    :ui="{
      container: 'px-0 !pt-0 !pb-0'
    }"
  >
    <div
      ref="sectionRef"
      class="-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 border-y border-default py-12 px-4 sm:px-12 lg:px-16"
    >
      <div class="flex flex-wrap items-stretch justify-around max-w-(--ui-container) mx-auto divide-x divide-default/50 rtl:divide-x-reverse">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="flex-1 min-w-35 flex flex-col items-center gap-3 text-center group cursor-default animate-fade-in px-8 py-2"
          :style="`animation-delay: ${0.1 + index * 0.1}s`"
          :aria-label="`${stat.value} ${stat.label}`"
        >
          <div class="size-14 rounded-xl flex items-center justify-center bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/15 group-hover:ring-primary/30 transition-all duration-300">
            <UIcon
              :name="stat.icon"
              class="size-6 text-primary"
            />
          </div>
          <span
            dir="ltr"
            class="text-4xl sm:text-5xl font-bold text-gradient leading-none"
          >
            {{ counters[index].display.value }}
          </span>
          <span class="text-sm text-muted leading-snug">
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
