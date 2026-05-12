<script setup>
const {
  state,
  schema,
  handleSubmit,
  loading,
  isEditing
} = inject('composable');

const isCurrent = computed({
  get: () => state.endDate === 'الحالي',
  set: (val) => {
    state.endDate = val ? 'الحالي' : undefined;
  }
});

function addResponsibility() {
  state.responsibilities.push('');
}

function removeResponsibility(index) {
  state.responsibilities.splice(index, 1);
}
</script>

<template>
  <div class="space-y-4">
    <BaseCard
      :title="isEditing ? 'تعديل خبرة' : 'خبرة جديدة'"
      :icon="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'"
    >
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="2"
        @submit="handleSubmit"
      >
        <BaseInput
          v-model="state.company"
          name="company"
          label="الشركة"
          placeholder="اسم الشركة"
          required
        />
        <BaseInput
          v-model="state.position"
          name="position"
          label="المنصب"
          placeholder="المسمى الوظيفي"
          required
        />
        <BaseInput
          v-model="state.employmentType"
          name="employmentType"
          label="نوع العمل"
          placeholder="دوام كامل / جزئي / تدريب"
          required
        />
        <BaseInput
          v-model="state.workPlace"
          name="workPlace"
          label="مكان العمل"
          placeholder="عن بُعد / هجين / مقر الشركة"
          required
        />
        <BaseCalendar
          v-model="state.startDate"
          name="startDate"
          label="تاريخ البداية"
          required
        />
        <div class="flex flex-col gap-2">
          <BaseCalendar
            v-model="state.endDate"
            name="endDate"
            label="تاريخ النهاية"
            :disabled="isCurrent"
            :required="!isCurrent"
          />
          <BaseCheckbox
            v-model="isCurrent"
            name="isCurrent"
            label="حالي (لا يزال يعمل)"
          />
        </div>
        <BaseInput
          v-model="state.linkedInUrl"
          name="linkedInUrl"
          label="رابط LinkedIn"
          placeholder="https://linkedin.com/company/..."
        />
        <BaseInput
          v-model="state.companySiteUrl"
          name="companySiteUrl"
          label="رابط موقع الشركة"
          placeholder="https://example.com"
        />
        <BaseFileUpload
          v-model="state.iconName"
          name="iconName"
          label="صورة/أيقونة الشركة"
          accept="image/*"
          class="col-span-full"
        />
        <BaseInput
          v-model="state.imageAlt"
          name="imageAlt"
          label="النص البديل للصورة"
          placeholder="وصف الصورة"
        />
        <BaseInput
          v-model.number="state.order"
          name="order"
          label="الترتيب"
          type="number"
          placeholder="0"
        />

        <!-- Responsibilities -->
        <div class="col-span-full space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">المسؤوليات</span>
            <UButton
              label="إضافة"
              icon="i-lucide-plus"
              size="xs"
              variant="outline"
              @click="addResponsibility"
            />
          </div>
          <div
            v-for="(_, index) in state.responsibilities"
            :key="index"
            class="flex gap-2"
          >
            <BaseInput
              v-model="state.responsibilities[index]"
              :name="`responsibilities.${index}`"
              :placeholder="`المسؤولية ${index + 1}`"
              class="flex-1"
            />
            <UButton
              v-if="state.responsibilities.length > 1"
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="lg"
              @click="removeResponsibility(index)"
            />
          </div>
        </div>

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
            to="/experiences"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
