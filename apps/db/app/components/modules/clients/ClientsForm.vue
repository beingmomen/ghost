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
      :title="isEditing ? 'تعديل عميل' : 'عميل جديد'"
      :icon="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'"
    >
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="2"
        @submit="handleSubmit"
      >
        <BaseInput
          v-model="state.name"
          name="name"
          label="الاسم"
          placeholder="أدخل اسم العميل"
          required
        />
        <BaseInput
          v-model="state.website"
          name="website"
          label="الموقع"
          placeholder="https://example.com"
        />
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
          label="الصورة"
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
            to="/clients"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
