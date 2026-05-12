<script setup>
useSeoMeta({
  title: 'Agents Manager',
  description: 'Browse and manage Claude Code agent configurations'
})

const { data: agents } = await useAsyncData('agents-list', () => {
  return queryCollection('agents').order('created_at', 'DESC').all()
})

const activeCategory = ref('all')
const selectedAgents = ref(new Set())

const categories = [
  { label: 'الكل', value: 'all' },
  { label: 'Explore', value: 'explore' },
  { label: 'Plan', value: 'plan' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Vue', value: 'vue' },
  { label: 'Design', value: 'design' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Testing', value: 'testing' },
  { label: 'أخرى', value: 'other' }
]

const categoryColors = {
  explore: 'info',
  plan: 'success',
  frontend: 'warning',
  vue: 'success',
  design: 'error',
  architecture: 'info',
  testing: 'warning',
  other: 'neutral'
}

const filteredAgents = computed(() => {
  if (!agents.value) return []
  if (activeCategory.value === 'all') return agents.value
  return agents.value.filter(a => a.category === activeCategory.value)
})

const hasSelection = computed(() => selectedAgents.value.size > 0)

const allFilteredSelected = computed(() => {
  if (!filteredAgents.value.length) return false
  return filteredAgents.value.every(a => selectedAgents.value.has(a.path))
})

function toggleAgent(path) {
  const next = new Set(selectedAgents.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  selectedAgents.value = next
}

function toggleAll() {
  if (allFilteredSelected.value) {
    const next = new Set(selectedAgents.value)
    filteredAgents.value.forEach(a => next.delete(a.path))
    selectedAgents.value = next
  } else {
    const next = new Set(selectedAgents.value)
    filteredAgents.value.forEach(a => next.add(a.path))
    selectedAgents.value = next
  }
}

const toast = useToast()
const deletingSelected = ref(false)
const showDeleteConfirm = ref(false)

async function deleteSelected() {
  if (!agents.value) return
  deletingSelected.value = true

  const selected = agents.value.filter(a => selectedAgents.value.has(a.path))
  let successCount = 0

  for (const agent of selected) {
    const slug = agent.path.replace('/agents/', '')
    try {
      await $fetch('/api/agents', {
        method: 'DELETE',
        body: { slug }
      })
      successCount++
    } catch {
      // continue deleting others
    }
  }

  toast.add({
    title: `تم حذف ${successCount} Agent`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })

  selectedAgents.value = new Set()
  showDeleteConfirm.value = false
  deletingSelected.value = false

  refreshNuxtData('agents-list')
}
</script>

<template>
  <UPage>
    <UPageHero
      title="Agents"
      description="تصفح وإدارة إعدادات الـ Agents"
      :ui="{
        title: 'text-center',
        description: 'text-center'
      }"
    >
      <template #links>
        <div class="flex justify-center">
          <UButton
            to="/agents/new"
            icon="i-lucide-plus"
            label="إضافة Agent"
            size="lg"
          />
        </div>
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <!-- Category Filters -->
      <div
        class="flex flex-wrap gap-2 mb-8 justify-center"
        role="group"
        aria-label="تصفية حسب الفئة"
      >
        <UButton
          v-for="cat in categories"
          :key="cat.value"
          :label="cat.label"
          :variant="activeCategory === cat.value ? 'solid' : 'outline'"
          :color="activeCategory === cat.value ? 'primary' : 'neutral'"
          size="sm"
          :aria-pressed="activeCategory === cat.value"
          @click="activeCategory = cat.value"
        />
      </div>

      <!-- Select All Bar -->
      <div
        v-if="filteredAgents.length"
        class="flex items-center justify-between mb-4"
      >
        <UButton
          :label="allFilteredSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل'"
          :icon="allFilteredSelected ? 'i-lucide-square-check' : 'i-lucide-square'"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="toggleAll"
        />
      </div>

      <!-- Agent Cards Grid -->
      <div
        v-if="filteredAgents.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="agent in filteredAgents"
          :key="agent.path"
          class="group relative"
        >
          <!-- Checkbox -->
          <div class="absolute top-2 start-2 z-10 min-w-11 min-h-11 flex items-center justify-center">
            <UCheckbox
              :model-value="selectedAgents.has(agent.path)"
              @update:model-value="toggleAgent(agent.path)"
            />
          </div>

          <NuxtLink
            :to="agent.path"
            class="cursor-pointer focus-visible:outline-none"
          >
            <UCard
              variant="outline"
              class="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:ring-1 hover:ring-primary/20 focus-within:ring-2 focus-within:ring-primary"
              :class="{ 'ring-1 ring-primary/40 border-primary/50': selectedAgents.has(agent.path) }"
            >
              <div class="space-y-3 ps-8">
                <h3 class="text-lg font-semibold group-hover:text-primary transition-colors">
                  {{ agent.title }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    :color="categoryColors[agent.category] || 'neutral'"
                    variant="subtle"
                    :label="agent.category"
                  />
                </div>
                <p class="text-base text-muted">
                  {{ agent.created_at }}
                </p>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-16"
      >
        <UIcon
          name="i-lucide-bot"
          class="size-12 text-muted mx-auto mb-4"
        />
        <p class="text-muted text-lg">
          لا توجد Agents
        </p>
        <UButton
          to="/agents/new"
          label="أضف أول Agent"
          variant="outline"
          class="mt-4"
        />
      </div>

      <!-- Floating Action Bar -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="hasSelection"
          class="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-full bg-elevated border border-default shadow-xl backdrop-blur-sm"
          aria-live="polite"
        >
          <span class="text-base font-medium">
            {{ selectedAgents.size }} مُحدد
          </span>
          <UButton
            icon="i-lucide-trash-2"
            label="حذف"
            size="sm"
            color="error"
            variant="outline"
            @click="showDeleteConfirm = true"
          />
        </div>
      </Transition>

      <!-- Delete Confirmation Modal -->
      <UModal
        :open="showDeleteConfirm"
        @update:open="showDeleteConfirm = $event"
      >
        <template #content>
          <div
            class="p-6 text-center space-y-4"
            role="alertdialog"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
          >
            <div class="size-12 rounded-full bg-error/10 flex items-center justify-center mx-auto">
              <UIcon
                name="i-lucide-alert-triangle"
                class="size-6 text-error"
              />
            </div>
            <h3
              id="delete-title"
              class="text-lg font-bold"
            >
              حذف {{ selectedAgents.size }} Agent؟
            </h3>
            <p
              id="delete-desc"
              class="text-base text-muted"
            >
              سيتم حذف الـ Agents المحددة نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <UButton
                label="إلغاء"
                variant="outline"
                color="neutral"
                @click="showDeleteConfirm = false"
              />
              <UButton
                label="حذف"
                color="error"
                icon="i-lucide-trash-2"
                :loading="deletingSelected"
                @click="deleteSelected"
              />
            </div>
          </div>
        </template>
      </UModal>
    </UPageSection>
  </UPage>
</template>
