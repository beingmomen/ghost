<script setup>
const {
  state,
  schema,
  handleSubmit,
  loading,
  isEditing,
  statusOptions,
  resourcesList
} = inject('composable');

const { label: descCounter, colorClass: descCounterClass } = useCharacterCounter(
  () => state.description,
  { min: 60, max: 160 }
);
</script>

<template>
  <BaseCard
    :title="isEditing ? 'تعديل مقال' : 'مقال جديد'"
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
        placeholder="أدخل عنوان المقال"
        required
      />

      <BaseInputTags
        v-model="state.tags"
        name="tags"
        label="الوسوم"
        placeholder="أدخل وسم واضغط Enter"
        required
      />
      <BaseInput
        v-model="state.keywords"
        name="keywords"
        label="الكلمات المفتاحية"
        placeholder="كلمة1, كلمة2"
        required
      />

      <BaseSelect
        v-model="state.resources"
        name="resources"
        label="المصادر"
        :items="resourcesList"
        label-key="title"
        multiple
        :return-object="['title', 'url']"
        required
      />

      <BaseTextarea
        v-model="state.description"
        name="description"
        label="وصف المقال"
        placeholder="وصف موجز للمقال يصلح كـ meta description"
        help="وصف صادق يلخّص موضوع المقال — بين 60 و160 حرف."
        :rows="4"
        :maxlength="160"
        required
        class="col-span-full"
      >
        <template #hint>
          <span class="text-xs" :class="descCounterClass">{{ descCounter }}</span>
        </template>
      </BaseTextarea>

      <BaseSwitch
        v-model="state.isArabicArticle"
        name="isArabicArticle"
        label="مقال عربي"
      />

      <BaseSelect
        v-if="isEditing"
        v-model="state.status"
        name="status"
        label="الحالة"
        placeholder="اختر الحالة"
        :items="statusOptions"
        :search-input="false"
        required
      />

      <BaseFileUpload
        v-model="state.image"
        label="صورة المقال"
        name="image"
        required
        class="col-span-full"
      />

      <BaseInput
        v-model="state.altText"
        label="وصف الصورة"
        name="altText"
        placeholder="وصف الصورة"
        class="col-span-full"
      />

      <BaseEditor
        v-model="state.content"
        name="content"
        label="المحتوى"
        toolbar
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
          to="/blog"
        />
      </template>
    </BaseForm>
  </BaseCard>
</template>
