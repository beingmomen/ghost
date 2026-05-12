<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      محتويات المقال
    </h3>

    <nav
      aria-label="جدول المحتويات"
      class="toc-navigation space-y-1"
    >
      <UButton
        v-for="item in table"
        :key="item.id"
        :variant="activeHeading === item.id ? 'soft' : 'ghost'"
        :color="activeHeading === item.id ? 'primary' : 'gray'"
        :class="[
          'w-full justify-start text-right',
          `toc-level-${item.level}`,
          {
            'font-semibold': activeHeading === item.id,
            'ps-0': item.level === 2,
            'ps-4': item.level === 3,
            'ps-8': item.level === 4
          }
        ]"
        :size="item.level === 2 ? 'xl' : 'lg'"
        @click="scrollToHeading(item.id)"
      >
        {{ item.text }}
      </UButton>
    </nav>
  </div>
</template>

<script setup>
const singleBlog = inject('singleBlog', ref({}))
const table = computed(() => singleBlog.value.tableOfContents)

const activeHeading = ref('')

// Function to handle smooth scrolling to headings
const scrollToHeading = (headingId) => {
  const element = document.getElementById(headingId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Function to determine which heading is currently in view
const updateActiveHeading = () => {
  const headings = table.value
    .map(item => ({
      id: item.id,
      element: document.getElementById(item.id)
    }))
    .filter(item => item.element)

  // Find the heading that's currently in the viewport
  let currentHeading = ''
  const scrollPosition = window.scrollY + 150 // Add offset for better UX

  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    if (heading.element.offsetTop <= scrollPosition) {
      currentHeading = heading.id
      break
    }
  }

  activeHeading.value = currentHeading
}

// Throttle scroll events for better performance
let ticking = false
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveHeading()
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  // Initial check
  updateActiveHeading()
  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
