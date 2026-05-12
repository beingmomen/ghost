<script setup>
const route = useRoute()
const toast = useToast()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('mcp').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    message: 'Server not found'
  })
}

const categoryColors = {
  frontend: 'info',
  backend: 'success',
  devops: 'warning',
  ai: 'error',
  database: 'neutral',
  other: 'neutral'
}

useSeoMeta({
  title: page.value?.title || 'MCP Server',
  description: `MCP Server: ${page.value?.title} — ${page.value?.category}`
})

const deleting = ref(false)
const showDeleteConfirm = ref(false)

async function deleteServer() {
  if (!page.value) return
  deleting.value = true

  const slug = page.value.path.replace('/mcp/', '')

  try {
    await $fetch('/api/mcp', {
      method: 'DELETE',
      body: { slug }
    })

    toast.add({
      title: 'تم الحذف بنجاح',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    await navigateTo('/mcp')
  } catch (err) {
    toast.add({
      title: 'خطأ',
      description: err.data?.message || 'فشل في حذف الخادم',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}
</script>

<template>
  <UPage>
    <UPageSection>
      <!-- Top Actions -->
      <div class="flex items-center justify-between mb-6">
        <UButton
          to="/mcp"
          icon="i-lucide-arrow-right"
          label="العودة للخوادم"
          variant="ghost"
          color="neutral"
        />
        <UButton
          icon="i-lucide-trash-2"
          label="حذف"
          variant="ghost"
          color="error"
          @click="showDeleteConfirm = true"
        />
      </div>

      <div v-if="page">
        <!-- Header -->
        <div class="mb-8 space-y-4">
          <h1 class="text-3xl sm:text-4xl font-bold">
            {{ page.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-3">
            <UBadge
              :color="categoryColors[page.category] || 'neutral'"
              variant="subtle"
              :label="page.category"
              size="lg"
            />
            <UBadge
              color="neutral"
              variant="outline"
              :label="page.installation_method"
              size="lg"
            />
            <span class="text-base text-muted">
              {{ page.created_at }}
            </span>
          </div>
        </div>

        <!-- Markdown Content -->
        <div class="ProseMirror">
          <ContentRenderer :value="page" />
        </div>
      </div>
    </UPageSection>

    <!-- Delete Confirmation Modal -->
    <UModal
      :open="showDeleteConfirm"
      @update:open="showDeleteConfirm = $event"
    >
      <template #content>
        <div class="p-6 text-center space-y-4">
          <div class="size-12 rounded-full bg-error/10 flex items-center justify-center mx-auto">
            <UIcon
              name="i-lucide-alert-triangle"
              class="size-6 text-error"
            />
          </div>
          <h3 class="text-lg font-bold">
            حذف الخادم؟
          </h3>
          <p class="text-base text-muted">
            سيتم حذف "{{ page?.title }}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
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
              :loading="deleting"
              @click="deleteServer"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UPage>
</template>
