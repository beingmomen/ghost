<script setup>
useSeoMeta({
  title: 'MCP Servers Manager',
  description: 'Browse and manage MCP server configurations'
})

const { data: servers } = await useAsyncData('mcp-servers', () => {
  return queryCollection('mcp').order('created_at', 'DESC').all()
})

const activeCategory = ref('all')
const selectedServers = ref(new Set())

const categories = [
  { label: 'الكل', value: 'all' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'DevOps', value: 'devops' },
  { label: 'AI', value: 'ai' },
  { label: 'Database', value: 'database' },
  { label: 'أخرى', value: 'other' }
]

const categoryColors = {
  frontend: 'info',
  backend: 'success',
  devops: 'warning',
  ai: 'error',
  database: 'neutral',
  other: 'neutral'
}

const filteredServers = computed(() => {
  if (!servers.value) return []
  if (activeCategory.value === 'all') return servers.value
  return servers.value.filter(s => s.category === activeCategory.value)
})

const hasSelection = computed(() => selectedServers.value.size > 0)

const allFilteredSelected = computed(() => {
  if (!filteredServers.value.length) return false
  return filteredServers.value.every(s => selectedServers.value.has(s.path))
})

function toggleServer(path) {
  const next = new Set(selectedServers.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  selectedServers.value = next
}

function toggleAll() {
  if (allFilteredSelected.value) {
    const next = new Set(selectedServers.value)
    filteredServers.value.forEach(s => next.delete(s.path))
    selectedServers.value = next
  } else {
    const next = new Set(selectedServers.value)
    filteredServers.value.forEach(s => next.add(s.path))
    selectedServers.value = next
  }
}

const toast = useToast()
const deletingSelected = ref(false)
const showDeleteConfirm = ref(false)

async function deleteSelected() {
  if (!servers.value) return
  deletingSelected.value = true

  const selected = servers.value.filter(s => selectedServers.value.has(s.path))
  let successCount = 0

  for (const server of selected) {
    const slug = server.path.replace('/mcp/', '')
    try {
      await $fetch('/api/mcp', {
        method: 'DELETE',
        body: { slug }
      })
      successCount++
    } catch {
      // continue deleting others
    }
  }

  toast.add({
    title: `تم حذف ${successCount} خادم`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })

  selectedServers.value = new Set()
  showDeleteConfirm.value = false
  deletingSelected.value = false

  refreshNuxtData('mcp-servers')
}

function downloadMcpJson() {
  if (!servers.value) return

  const selected = servers.value.filter(s => selectedServers.value.has(s.path))
  const mcpServers = {}

  for (const server of selected) {
    if (server.mcp_config?.key && server.mcp_config?.server) {
      mcpServers[server.mcp_config.key] = server.mcp_config.server
    }
  }

  const json = JSON.stringify({ mcpServers }, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '.mcp.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <UPage>
    <UPageHero
      title="MCP Servers"
      description="تصفح وإدارة إعدادات خوادم MCP"
      :ui="{
        title: 'text-center',
        description: 'text-center'
      }"
    >
      <template #links>
        <div class="flex justify-center">
          <UButton
            to="/mcp/new"
            icon="i-lucide-plus"
            label="إضافة خادم"
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

      <!-- Select All / Download Bar -->
      <div
        v-if="filteredServers.length"
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

      <!-- Server Cards Grid -->
      <div
        v-if="filteredServers.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="server in filteredServers"
          :key="server.path"
          class="group relative"
        >
          <!-- Checkbox -->
          <div class="absolute top-2 start-2 z-10 min-w-11 min-h-11 flex items-center justify-center">
            <UCheckbox
              :model-value="selectedServers.has(server.path)"
              @update:model-value="toggleServer(server.path)"
            />
          </div>

          <NuxtLink
            :to="server.path"
            class="cursor-pointer focus-visible:outline-none"
          >
            <UCard
              variant="outline"
              class="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:ring-1 hover:ring-primary/20 focus-within:ring-2 focus-within:ring-primary"
              :class="{ 'ring-1 ring-primary/40 border-primary/50': selectedServers.has(server.path) }"
            >
              <div class="space-y-3 ps-8">
                <h3 class="text-lg font-semibold group-hover:text-primary transition-colors">
                  {{ server.title }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    :color="categoryColors[server.category] || 'neutral'"
                    variant="subtle"
                    :label="server.category"
                  />
                  <UBadge
                    color="neutral"
                    variant="outline"
                    :label="server.installation_method"
                  />
                </div>
                <p class="text-base text-muted">
                  {{ server.created_at }}
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
          name="i-lucide-server-off"
          class="size-12 text-muted mx-auto mb-4"
        />
        <p class="text-muted text-lg">
          لا توجد خوادم
        </p>
        <UButton
          to="/mcp/new"
          label="أضف أول خادم"
          variant="outline"
          class="mt-4"
        />
      </div>

      <!-- Floating Download Bar -->
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
            {{ selectedServers.size }} مُحدد
          </span>
          <UButton
            icon="i-lucide-download"
            label="تحميل .mcp.json"
            size="sm"
            @click="downloadMcpJson"
          />
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
              حذف {{ selectedServers.size }} خادم؟
            </h3>
            <p
              id="delete-desc"
              class="text-base text-muted"
            >
              سيتم حذف الخوادم المحددة نهائياً. لا يمكن التراجع عن هذا الإجراء.
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
