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
      :title="isEditing ? 'تعديل رسالة' : 'رسالة جديد'"
      :icon="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'"
    >
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="3"
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
          v-model="state.email"
          name="email"
          label="البريد الإلكتروني"
          placeholder="البريد الإلكتروني"
          required
        />

        <BaseInput
          v-model="state.phone"
          name="phone"
          label="رقم الهاتف"
          placeholder="رقم الهاتف"
          required
        />

        <BaseTextarea
          v-model="state.description"
          :rows="4"
          name="description"
          label="الوصف"
          placeholder="أدخل وصف الخدمة"
          required
          class="col-span-full"
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
            to="/contacts"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
