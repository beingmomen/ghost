<script setup>
import { z } from 'zod'

useSeoMeta({
  title: 'إضافة خادم MCP',
  description: 'إضافة إعداد خادم MCP جديد'
})

const toast = useToast()

const schema = z.object({
  name: z.string({ error: 'اسم الخادم مطلوب' }).min(1, 'اسم الخادم مطلوب'),
  category: z.string({ error: 'التصنيف مطلوب' }).min(1, 'التصنيف مطلوب'),
  installationMethod: z.string({ error: 'طريقة التثبيت مطلوبة' }).min(1, 'طريقة التثبيت مطلوبة'),
  mcpKey: z.string().optional().or(z.literal('')),
  mcpConfigJson: z.string({ error: 'إعداد MCP مطلوب' }).min(1, 'إعداد MCP مطلوب'),
  installCommand: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
})

const state = reactive({
  name: '',
  category: '',
  installationMethod: '',
  mcpKey: '',
  mcpConfigJson: '',
  installCommand: '',
  notes: ''
})

const loading = ref(false)
const submitted = ref(false)
const createdPath = ref('')

const categoryOptions = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'DevOps', value: 'devops' },
  { label: 'AI', value: 'ai' },
  { label: 'Database', value: 'database' },
  { label: 'أخرى', value: 'other' }
]

const methodOptions = [
  { label: 'Cloud Code', value: 'cloud code' },
  { label: 'Cursor', value: 'cursor' },
  { label: 'CLI', value: 'cli' },
  { label: 'أخرى', value: 'other' }
]

async function onSubmit() {
  loading.value = true

  try {
    // Validate JSON client-side
    if (state.mcpConfigJson) {
      try {
        const clean = state.mcpConfigJson.replace(/,\s*([}\]])/g, '$1')
        JSON.parse(clean)
      } catch {
        toast.add({
          title: 'خطأ',
          description: 'إعداد MCP يجب أن يكون JSON صالح',
          color: 'error',
          icon: 'i-lucide-alert-circle'
        })
        loading.value = false
        return
      }
    }

    const result = await $fetch('/api/mcp', {
      method: 'POST',
      body: {
        name: state.name,
        category: state.category,
        installationMethod: state.installationMethod,
        mcpKey: state.mcpKey,
        mcpConfigJson: state.mcpConfigJson,
        installCommand: state.installCommand,
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
      description: err.data?.message || 'فشل في إنشاء الخادم',
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
  state.installationMethod = ''
  state.mcpKey = ''
  state.mcpConfigJson = ''
  state.installCommand = ''
  state.notes = ''
  submitted.value = false
  createdPath.value = ''
}
</script>

<template>
  <UPage>
    <UPageHero
      title="إضافة خادم MCP"
      description="تسجيل إعداد خادم MCP جديد"
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
              تم حفظ خادم MCP كملف markdown.
            </p>
            <div class="flex items-center gap-3 mt-2">
              <UButton
                :to="createdPath"
                icon="i-lucide-eye"
                label="عرض الخادم"
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
                to="/mcp"
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
              label="اسم الخادم"
              name="name"
              size="lg"
              required
            >
              <UInput
                v-model="state.name"
                leading-icon="i-lucide-server"
                placeholder="مثال: GitHub MCP Server"
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
              label="طريقة التثبيت"
              name="installationMethod"
              size="lg"
              required
            >
              <USelect
                v-model="state.installationMethod"
                :items="methodOptions"
                placeholder="اختر الطريقة"
                class="w-full"
                :disabled="loading"
              />
            </UFormField>

            <USeparator label="إعداد MCP" />

            <UFormField
              label="MCP Key"
              name="mcpKey"
              size="lg"
              hint="اختياري — يُستخرج تلقائياً من JSON"
            >
              <UInput
                v-model="state.mcpKey"
                leading-icon="i-lucide-key"
                placeholder="مثال: github, filesystem"
                class="w-full"
                dir="ltr"
                :disabled="loading"
              />
            </UFormField>

            <UFormField
              label="MCP Config JSON"
              name="mcpConfigJson"
              size="lg"
              required
              hint="الصق من ملف .mcp.json"
            >
              <UTextarea
                v-model="state.mcpConfigJson"
                placeholder="{&quot;command&quot;: &quot;npx&quot;, &quot;args&quot;: [&quot;-y&quot;, &quot;@example/mcp&quot;]}"
                class="w-full font-mono text-sm"
                :rows="6"
                dir="ltr"
                :disabled="loading"
              />
            </UFormField>

            <USeparator label="معلومات إضافية" />

            <UFormField
              label="أمر التثبيت"
              name="installCommand"
              size="lg"
              hint="اختياري — مثل: npx install-package --yes"
            >
              <UInput
                v-model="state.installCommand"
                leading-icon="i-lucide-terminal"
                placeholder="npx claude-code-templates@latest --mcp=example --yes"
                class="w-full font-mono text-sm"
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
                placeholder="يوفر وصولاً لقراءة وكتابة الملفات&#10;يعمل مع المستودعات العامة والخاصة"
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
              حفظ الخادم
            </UButton>
          </UForm>
        </Transition>
      </div>

      <!-- Back Link -->
      <div class="text-center mt-6">
        <UButton
          to="/mcp"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-right"
          label="العودة للخوادم"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
