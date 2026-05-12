<script setup>
const { state, schema, handleSubmit, loading } = inject('composable');

const seniorityOptions = [
  { label: 'مبتدئ', value: 'junior' },
  { label: 'متوسط', value: 'mid' },
  { label: 'متقدم', value: 'senior' },
  { label: 'قائد', value: 'lead' },
  { label: 'مدير', value: 'manager' },
  { label: 'أي مستوى', value: 'any' }
];

const workplaceOptions = [
  { label: 'في المكتب', value: 'onsite' },
  { label: 'عن بُعد', value: 'remote' },
  { label: 'هجين', value: 'hybrid' }
];

const jobAgeOptions = [
  { label: 'بلا حدود', value: 0 },
  { label: 'أسبوع', value: 7 },
  { label: 'أسبوعان', value: 14 },
  { label: 'شهر', value: 30 },
  { label: 'شهرين (افتراضي)', value: 60 },
  { label: '3 أشهر', value: 90 },
  { label: '6 أشهر', value: 180 },
  { label: 'سنة', value: 365 }
];
</script>

<template>
  <div class="space-y-6">
    <BaseForm
      :schema="schema"
      :state="state"
      :cols="1"
      @submit="handleSubmit"
    >
      <!-- القسم 1: الأدوار المستهدفة -->
      <BaseCard title="الأدوار المستهدفة" icon="i-lucide-target" class="col-span-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField name="targetRoles" label="الأدوار الوظيفية المستهدفة" class="col-span-full">
            <BaseInputTags
              v-model="state.targetRoles"
              placeholder="أضف دوراً واضغط Enter... مثال: Frontend Developer"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تأثير: 25 نقطة في التحليل</span>
            </template>
          </UFormField>

          <UFormField name="targetSeniority" label="مستوى الخبرة المستهدف">
            <USelectMenu
              v-model="state.targetSeniority"
              :items="seniorityOptions"
              value-key="value"
              multiple
              placeholder="اختر مستوى أو أكثر"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تأثير: 15 نقطة في التحليل</span>
            </template>
          </UFormField>
        </div>
      </BaseCard>

      <!-- القسم 2: المهارات التقنية -->
      <BaseCard title="المهارات التقنية" icon="i-lucide-code-2" class="col-span-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField name="defaultStacks" label="المهارات الأساسية" class="col-span-full">
            <BaseInputTags
              v-model="state.defaultStacks"
              placeholder="أضف مهارة واضغط Enter... مثال: Vue, TypeScript, Node.js"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تأثير: 30 نقطة في التحليل — الأهم</span>
            </template>
          </UFormField>

          <UFormField name="optionalStacks" label="المهارات الثانوية" class="col-span-full">
            <BaseInputTags
              v-model="state.optionalStacks"
              placeholder="أضف مهارة ثانوية واضغط Enter... مثال: Docker, AWS"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تأثير: 10 نقاط في التحليل</span>
            </template>
          </UFormField>
        </div>
      </BaseCard>

      <!-- القسم 3: تفضيلات العمل -->
      <BaseCard title="تفضيلات العمل" icon="i-lucide-map-pin" class="col-span-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField name="locationPreferences" label="المواقع المفضلة">
            <BaseInputTags
              v-model="state.locationPreferences"
              placeholder="أضف موقعاً واضغط Enter... مثال: Egypt, Cairo"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تأثير: 10 نقاط في التحليل</span>
            </template>
          </UFormField>

          <UFormField name="workplacePreferences" label="نوع بيئة العمل">
            <USelectMenu
              v-model="state.workplacePreferences"
              :items="workplaceOptions"
              value-key="value"
              multiple
              placeholder="اختر نوعاً أو أكثر"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تأثير: 10 نقاط في التحليل</span>
            </template>
          </UFormField>
        </div>
      </BaseCard>

      <!-- القسم 4: فلترة الوظائف -->
      <BaseCard title="فلترة الوظائف" icon="i-lucide-filter" class="col-span-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField name="requiredKeywords" label="كلمات يجب وجودها" class="col-span-full">
            <BaseInputTags
              v-model="state.requiredKeywords"
              placeholder="مثال: Vue, React, TypeScript"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">الوظيفة تُعرض فقط إذا احتوت على إحدى هذه الكلمات في العنوان أو المهارات</span>
            </template>
          </UFormField>

          <UFormField name="excludedKeywords" label="كلمات يجب إخفاؤها" class="col-span-full">
            <BaseInputTags
              v-model="state.excludedKeywords"
              placeholder="مثال: Laravel, PHP, WordPress"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">الوظيفة تُخفى إذا احتوت على إحدى هذه الكلمات في العنوان أو المهارات</span>
            </template>
          </UFormField>

          <UFormField name="maxJobAgeDays" label="أقصى عمر للوظيفة">
            <USelectMenu
              v-model="state.maxJobAgeDays"
              :items="jobAgeOptions"
              value-key="value"
              placeholder="اختر المدة"
              class="w-full"
            />
            <template #hint>
              <span class="text-xs text-muted">تُخفى الوظائف المنشورة قبل هذه المدة</span>
            </template>
          </UFormField>
        </div>
      </BaseCard>

      <template #actions>
        <UButton
          type="submit"
          label="حفظ الإعدادات"
          icon="i-lucide-check"
          :loading="loading"
        />
      </template>
    </BaseForm>
  </div>
</template>
