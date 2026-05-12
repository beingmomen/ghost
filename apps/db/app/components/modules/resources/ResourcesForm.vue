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
      :title="isEditing ? 'تعديل مصدر' : 'مصدر جديد'"
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
          placeholder="أدخل عنوان المصدر"
          required
        />
        <BaseInput
          v-model="state.url"
          name="url"
          label="الرابط"
          placeholder="https://example.com"
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
            to="/resources"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
