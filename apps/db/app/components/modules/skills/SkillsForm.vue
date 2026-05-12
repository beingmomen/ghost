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
      :title="isEditing ? 'تعديل مهارة' : 'مهارة جديدة'"
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
          placeholder="أدخل عنوان المهارة"
          required
        />
        <BaseInput
          v-model="state.icon"
          name="icon"
          label="الأيقونة"
          placeholder="أدخل الأيقونة"
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
            to="/skills"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
