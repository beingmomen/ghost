<script setup>
const {
  state,
  schema,
  handleSubmit,
  loading,
  isEditing
} = inject('composable');

const { data: cachedFaqs } = useNuxtData('faqs');

const { data: fetchedFaqs } = await useAsyncData(
  'faqs-for-categories',
  () => useFaqsService().getAll({ limit: 200 }),
  { immediate: !cachedFaqs.value?.data?.length }
);

const categories = computed(() => {
  const faqs = cachedFaqs.value?.data || fetchedFaqs.value?.data || [];
  const cats = faqs.map((f) => f.category).filter(Boolean);
  return [...new Set(cats)];
});

function onCreateCategory(item) {
  state.category = item;
}
</script>

<template>
  <div class="space-y-4">
    <BaseCard
      :title="isEditing ? 'تعديل سؤال' : 'سؤال جديد'"
      :icon="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus'"
    >
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="2"
        @submit="handleSubmit"
      >
        <UFormField
          name="category"
          label="التصنيف"
          required
        >
          <USelectMenu
            v-model="state.category"
            :items="categories"
            create-item
            placeholder="اختر أو اكتب تصنيفاً جديداً"
            class="w-full"
            @create="onCreateCategory"
          />
        </UFormField>
        <BaseInput
          v-model.number="state.order"
          name="order"
          label="الترتيب"
          type="number"
          placeholder="0"
        />
        <BaseInput
          v-model="state.question"
          name="question"
          label="السؤال"
          placeholder="اكتب السؤال"
          class="col-span-full"
          required
        />
        <BaseTextarea
          v-model="state.answer"
          name="answer"
          label="الإجابة"
          placeholder="اكتب الإجابة"
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
            to="/faqs"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
