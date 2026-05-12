<script setup>
import { z } from 'zod'

useSeoMeta({
  title: 'إضافة Skill',
  description: 'إضافة Skill جديد'
})

const toast = useToast()

const schema = z.object({
  name: z.string({ error: 'اسم الـ Skill مطلوب' }).min(1, 'اسم الـ Skill مطلوب'),
  category: z.string({ error: 'التصنيف مطلوب' }).min(1, 'التصنيف مطلوب'),
  trigger: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
})

const state = reactive({
  name: '',
  category: '',
  trigger: '',
  description: '',
  notes: ''
})

const loading = ref(false)
const submitted = ref(false)
const createdPath = ref('')

const categoryOptions = [
  { label: 'Git', value: 'git' },
  { label: 'Code', value: 'code' },
  { label: 'UI', value: 'ui' },
  { label: 'SEO', value: 'seo' },
  { label: 'Testing', value: 'testing' },
  { label: 'Deployment', value: 'deployment' },
  { label: 'أخرى', value: 'other' }
]

async function onSubmit() {
  loading.value = true

  try {
    const result = await $fetch('/api/skills', {
      method: 'POST',
      body: {
        name: state.name,
        category: state.category,
        trigger: state.trigger,
        description: state.description,
        notes: state.notes
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
      description: err.data?.message || 'فشل في إنشاء الـ Skill',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    loading.value = false
  }
}

function resetForm() {
  state.name = ''
  state.category = ''
  state.trigger = ''
  state.description = ''
  state.notes = ''
  submitted.value = false
  createdPath.value = ''
}
</script>

<template>
  <UPage>
    <UPageHero
      title="إضافة Skill"
      description="تسجيل Skill جديد كمرجع"
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
              تم حفظ الـ Skill كملف markdown.
            </p>
            <div class="flex items-center gap-3 mt-2">
              <UButton
                :to="createdPath"
                icon="i-lucide-eye"
                label="عرض الـ Skill"
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
                to="/skills"
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
              label="اسم الـ Skill"
              name="name"
              size="lg"
              required
            >
              <UInput
                v-model="state.name"
                leading-icon="i-lucide-zap"
                placeholder="مثال: Commit Skill"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="التصنيف"
              name="category"
              size="lg"
              required
            >
              <USelect
                v-model="state.category"
                :items="categoryOptions"
                placeholder="اختر التصنيف"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="Trigger"
              name="trigger"
              size="lg"
              hint="اختياري — الأمر المختصر"
            >
              <UInput
                v-model="state.trigger"
                leading-icon="i-lucide-terminal"
                placeholder="مثال: /commit"
                class="w-full font-mono"
                dir="ltr"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="الوصف"
              name="description"
              size="lg"
              hint="اختياري — ماذا يفعل هذا الـ Skill"
            >
              <UTextarea
                v-model="state.description"
                placeholder="وصف ما يقوم به هذا الـ Skill..."
                class="w-full"
                :rows="3"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="ملاحظات"
              name="notes"
              size="lg"
              hint="اختياري — كل سطر يتحول إلى نقطة"
            >
              <UTextarea
                v-model="state.notes"
                placeholder="ملاحظات إضافية..."
                class="w-full"
                :rows="3"
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
              حفظ الـ Skill
            </UButton>
          </UForm>
        </Transition>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-6">
        <UButton
          to="/skills"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-right"
          label="العودة للـ Skills"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
