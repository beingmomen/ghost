<script setup>
import { useWeekSchema } from '~/composables/modules/roadmap/schema';

const props = defineProps({
  phaseId: { type: String, default: null },
  week: { type: Object, default: null }
});

const roadmap = inject('roadmap');
const schema = useWeekSchema();
const isEditing = computed(() => !!props.week);

const open = ref(false);
const state = reactive({ title: '', focus: null });

watch(open, (value) => {
  if (!value) return;
  state.title = props.week?.title || '';
  state.focus = props.week?.focus ?? null;
});

async function handleSubmit() {
  const body = { title: state.title, focus: state.focus || null };
  if (isEditing.value) {
    await roadmap.updateWeek(props.week.id, body);
  } else {
    await roadmap.createWeek(props.phaseId, body);
  }
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'تعديل الأسبوع' : 'أسبوع جديد'"
  >
    <slot />

    <template #body>
      <BaseForm :schema="schema" :state="state" @submit="handleSubmit">
        <BaseInput
          v-model="state.title"
          name="title"
          label="عنوان الأسبوع"
          placeholder="مثال: الأسبوع 1"
          required
        />
        <BaseInput
          v-model="state.focus"
          name="focus"
          label="التركيز (Focus)"
          placeholder="عنوان فرعي لتركيز الأسبوع"
        />

        <template #actions>
          <UButton
            type="submit"
            :label="isEditing ? 'تحديث' : 'إنشاء'"
            icon="i-lucide-check"
            :loading="roadmap.loading.value"
          />
          <UButton
            label="إلغاء"
            color="neutral"
            variant="outline"
            icon="i-lucide-x"
            @click="open = false"
          />
        </template>
      </BaseForm>
    </template>
  </UModal>
</template>
