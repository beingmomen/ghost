<script setup>
const route = useRoute()
const toast = useToast()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('agents').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    message: 'Agent not found'
  })
}

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

useSeoMeta({
  title: page.value?.title || 'Agent',
  description: `Agent: ${page.value?.title} — ${page.value?.category}`
})

const deleting = ref(false)
const showDeleteConfirm = ref(false)

async function deleteAgent() {
  if (!page.value) return
  deleting.value = true

  const slug = page.value.path.replace('/agents/', '')

  try {
    await $fetch('/api/agents', {
      method: 'DELETE',
      body: { slug }
    })

    toast.add({
      title: 'تم الحذف بنجاح',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    await navigateTo('/agents')
  } catch (err) {
    toast.add({
      title: 'خطأ',
      description: err.data?.message || 'فشل في حذف الـ Agent',
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
          to="/agents"
          icon="i-lucide-arrow-right"
          label="العودة للـ Agents"
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
            حذف الـ Agent؟
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
              @click="deleteAgent"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UPage>
</template>
