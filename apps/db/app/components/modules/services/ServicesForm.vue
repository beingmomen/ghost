<script setup>
const {
  state,
  schema,
  handleSubmit,
  loading,
  isEditing
} = inject('composable');
</script>

<template>
  <div class="space-y-4">
    <BaseCard
      :title="isEditing ? 'تعديل خدمة' : 'خدمة جديدة'"
      :icon="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'"
    >
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="1"
        @submit="handleSubmit"
      >
        <BaseInput
          v-model="state.title"
          name="title"
          label="العنوان"
          placeholder="أدخل عنوان الخدمة"
          required
        />
        <BaseTextarea
          v-model="state.description"
          :rows="4"
          name="description"
          label="الوصف"
          placeholder="أدخل وصف الخدمة"
          required
        />
        <BaseInput
          v-model="state.altText"
          name="altText"
          label="النص البديل"
          placeholder="وصف الصورة"
          required
        />

        <BaseFileUpload
          v-model="state.image"
          label="الصورة"
          name="image"
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
            to="/services"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
