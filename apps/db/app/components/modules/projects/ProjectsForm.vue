<script setup>
const {
  state,
  schema,
  handleSubmit,
  loading,
  isEditing,
  skillsList
} = inject('composable');

const { label: descCounter, colorClass: descCounterClass } = useCharacterCounter(
  () => state.description,
  { min: 60, max: 200 }
);
</script>

<template>
  <div class="space-y-4">
    <BaseCard
      :title="isEditing ? 'تعديل مشروع' : 'مشروع جديد'"
      :icon="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'"
    >
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="2"
        @submit="handleSubmit"
      >
        <BaseInput
          v-model="state.title"
          name="title"
          label="العنوان"
          placeholder="أدخل عنوان المشروع"
          required
        />
        <BaseInput
          v-model="state.tag"
          name="tag"
          label="الوسم"
          placeholder="مثل: موقع، تطبيق"
          required
        />
        <BaseInput
          v-model="state.url"
          name="url"
          label="الرابط"
          placeholder="https://example.com"
          required
        />

        <BaseSelect
          v-model="state.skillIds"
          name="skillIds"
          label="المهارات (3 على الأقل)"
          placeholder="اختر المهارات"
          :items="skillsList"
          value-key="id"
          label-key="name"
          multiple
          required
        />
        <BaseSwitch
          v-model="state.isActive"
          name="isActive"
          label="الحالة"
          checked-label="نشط"
          unchecked-label="غير نشط"
        />

        <BaseTextarea
          v-model="state.description"
          :rows="4"
          :maxlength="200"
          name="description"
          label="الوصف"
          placeholder="وصف موجز: المشروع بيعمل إيه ولمين"
          help="وصف صادق يحكي ماذا يقدّم المشروع ولِمن — بين 60 و200 حرف."
          class="col-span-full"
          required
        >
          <template #hint>
            <span class="text-xs" :class="descCounterClass">{{ descCounter }}</span>
          </template>
        </BaseTextarea>

        <BaseInput
          v-model="state.altText"
          name="altText"
          label="النص البديل"
          placeholder="وصف الصورة"
          class="col-span-full"
          required
        />

        <BaseFileUpload
          v-model="state.image"
          label="صورة المشروع"
          name="image"
          class="col-span-full"
          required
        />

        <template #actions>
          <UButton
            type="submit"
            :label="isEditing ? 'تحديث' : 'إنشاء'"
            icon="i-lucide-check"
            :loading="loading"
          />
          <UButton
            label="إلغاء"
            color="neutral"
            variant="outline"
            icon="i-lucide-x"
            to="/projects"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
