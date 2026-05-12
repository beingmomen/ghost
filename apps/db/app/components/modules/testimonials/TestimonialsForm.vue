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
      :title="isEditing ? 'تعديل تقييم' : 'تقييم جديدة'"
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
          placeholder="اسم صاحب التوصية"
          required
        />
        <BaseInput
          v-model="state.email"
          name="email"
          label="البريد"
          placeholder="البريد الإلكتروني"
          required
        />
        <BaseTextarea
          v-model="state.description"
          name="description"
          label="التوصية"
          placeholder="نص التوصية"
          required
          :class="!isEditing ? 'col-span-full' : ''"
        />
        <BaseSwitch
          v-if="!!isEditing"
          v-model="state.isConfirmed"
          name="isConfirmed"
          label="الحالة"
          checked-label="مؤكد"
          unchecked-label="معلق"
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
            to="/testimonials"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
