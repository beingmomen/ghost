<script setup>
import { z } from 'zod'

useSeoMeta({
  title: 'إضافة Agent',
  description: 'إضافة Agent جديد'
})

const toast = useToast()

const schema = z.object({
  name: z.string({ error: 'اسم الـ Agent مطلوب' }).min(1, 'اسم الـ Agent مطلوب'),
  category: z.string({ error: 'التصنيف مطلوب' }).min(1, 'التصنيف مطلوب'),
  description: z.string().optional().or(z.literal('')),
  prompt: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
})

const state = reactive({
  name: '',
  category: '',
  description: '',
  prompt: '',
  notes: ''
})

const loading = ref(false)
const submitted = ref(false)
const createdPath = ref('')

const categoryOptions = [
  { label: 'Explore', value: 'explore' },
  { label: 'Plan', value: 'plan' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Vue', value: 'vue' },
  { label: 'Design', value: 'design' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Testing', value: 'testing' },
  { label: 'أخرى', value: 'other' }
]

async function onSubmit() {
  loading.value = true

  try {
    const result = await $fetch('/api/agents', {
      method: 'POST',
      body: {
        name: state.name,
        category: state.category,
        description: state.description,
        prompt: state.prompt,
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
      description: err.data?.message || 'فشل في إنشاء الـ Agent',
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
  state.description = ''
  state.prompt = ''
  state.notes = ''
  submitted.value = false
  createdPath.value = ''
}
</script>

<template>
  <UPage>
    <UPageHero
      title="إضافة Agent"
      description="تسجيل Agent جديد كمرجع"
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
              تم حفظ الـ Agent كملف markdown.
            </p>
            <div class="flex items-center gap-3 mt-2">
              <UButton
                :to="createdPath"
                icon="i-lucide-eye"
                label="عرض الـ Agent"
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
                to="/agents"
                label="العودة للـ Agents"
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
              label="اسم الـ Agent"
              name="name"
              size="lg"
              required
            >
              <UInput
                v-model="state.name"
                leading-icon="i-lucide-bot"
                placeholder="مثال: Explore Agent"
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
              label="الوصف"
              name="description"
              size="lg"
              hint="اختياري — ماذا يفعل هذا الـ Agent"
            >
              <UTextarea
                v-model="state.description"
                placeholder="وصف مختصر لما يقوم به هذا الـ Agent"
                class="w-full"
                :rows="3"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="البرومبت"
              name="prompt"
              size="lg"
              hint="اختياري — نص البرومبت"
            >
              <UTextarea
                v-model="state.prompt"
                placeholder="أدخل نص البرومبت هنا..."
                class="w-full font-mono text-sm"
                :rows="6"
                dir="ltr"
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
                placeholder="ملاحظة أولى&#10;ملاحظة ثانية"
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
              حفظ الـ Agent
            </UButton>
          </UForm>
        </Transition>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-6">
        <UButton
          to="/agents"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-right"
          label="العودة للـ Agents"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
