<script setup>
import { z } from 'zod'

useSeoMeta({
  title: 'إضافة أمر',
  description: 'إضافة أمر Claude Code جديد'
})

const toast = useToast()

const schema = z.object({
  name: z.string({ error: 'اسم الأمر مطلوب' }).min(1, 'اسم الأمر مطلوب'),
  description: z.string().optional().or(z.literal('')),
  content: z.string().optional().or(z.literal(''))
})

const state = reactive({
  name: '',
  description: '',
  content: ''
})

const loading = ref(false)
const submitted = ref(false)
const createdPath = ref('')

async function onSubmit() {
  loading.value = true

  try {
    const result = await $fetch('/api/commands', {
      method: 'POST',
      body: {
        name: state.name,
        description: state.description,
        content: state.content
      }
    })

    createdPath.value = result.path
    submitted.value = true

    toast.add({
      title: 'تمت الإضافة بنجاح',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  } catch (err) {
    toast.add({
      title: 'خطأ',
      description: err.data?.message || 'فشل في إنشاء الأمر',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    loading.value = false
  }
}

function resetForm() {
  state.name = ''
  state.description = ''
  state.content = ''
  submitted.value = false
  createdPath.value = ''
}
</script>

<template>
  <UPage>
    <UPageHero
      title="إضافة أمر"
      description="تسجيل أمر Claude Code جديد كمرجع"
      :ui="{
        title: 'text-center',
        description: 'text-center'
      }"
    />

    <UPageSection
      :ui="{
        container: '!pt-0 max-w-2xl mx-auto'
      }"
    >
      <div class="rounded-2xl border border-default/60 bg-muted/40 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-neutral-950/5">
        <Transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
          mode="out-in"
        >
          <!-- Success State -->
          <div
            v-if="submitted"
            key="success"
            class="flex flex-col items-center justify-center py-12 gap-4 text-center"
          >
            <div class="size-16 rounded-full bg-success/10 flex items-center justify-center">
              <UIcon
                name="i-lucide-check-circle"
                class="size-8 text-success"
              />
            </div>
            <h3 class="text-xl font-bold text-highlighted">
              تمت الإضافة بنجاح!
            </h3>
            <p class="text-muted text-base max-w-xs">
              تم حفظ الأمر كملف markdown.
            </p>
            <div class="flex items-center gap-3 mt-2">
              <UButton
                :to="createdPath"
                icon="i-lucide-eye"
                label="عرض الأمر"
              />
              <UButton
                variant="outline"
                color="neutral"
                icon="i-lucide-plus"
                label="إضافة آخر"
                @click="resetForm"
              />
              <UButton
                variant="ghost"
                color="neutral"
                to="/commands"
                label="العودة للقائمة"
                icon="i-lucide-list"
              />
            </div>
          </div>

          <!-- Form -->
          <UForm
            v-else
            key="form"
            :schema="schema"
            :state="state"
            class="space-y-5"
            @submit="onSubmit"
          >
            <UFormField
              label="اسم الأمر"
              name="name"
              size="lg"
              required
            >
              <UInput
                v-model="state.name"
                leading-icon="i-lucide-terminal"
                placeholder="مثال: useFetch Check"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="الوصف"
              name="description"
              size="lg"
              hint="اختياري — وصف مختصر للأمر"
            >
              <UInput
                v-model="state.description"
                leading-icon="i-lucide-text"
                placeholder="مثال: Enforce useFetch architectural rules"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="محتوى الأمر (Markdown)"
              name="content"
              size="lg"
              hint="اختياري — محتوى ملف الأمر"
            >
              <UTextarea
                v-model="state.content"
                placeholder="# Command Title&#10;&#10;Instructions and content..."
                class="w-full font-mono text-sm"
                :rows="12"
                dir="ltr"
                :disabled="loading"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              size="xl"
              :loading="loading"
              leading-icon="i-lucide-save"
              class="font-bold cursor-pointer shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
            >
              حفظ الأمر
            </UButton>
          </UForm>
        </Transition>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-6">
        <UButton
          to="/commands"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-right"
          label="العودة للأوامر"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
