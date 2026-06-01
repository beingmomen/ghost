<script setup>
import { MILESTONE_OPTIONS } from '~/composables/modules/roadmap/meta';
import { usePhaseSchema } from '~/composables/modules/roadmap/schema';

const props = defineProps({
  phase: { type: Object, default: null }
});

const roadmap = inject('roadmap');
const schema = usePhaseSchema();
const isEditing = computed(() => !!props.phase);

const open = ref(false);
const state = reactive({
  title: '',
  description: null,
  weeksEstimate: 0,
  milestoneLevel: null
});

watch(open, (value) => {
  if (!value) return;
  state.title = props.phase?.title || '';
  state.description = props.phase?.description ?? null;
  state.weeksEstimate = props.phase?.weeksEstimate ?? 0;
  state.milestoneLevel = props.phase?.milestoneLevel ?? null;
});

async function handleSubmit() {
  const body = {
    title: state.title,
    description: state.description || null,
    weeksEstimate: state.weeksEstimate,
    milestoneLevel: state.milestoneLevel || null
  };
  if (isEditing.value) {
    await roadmap.updatePhase(props.phase.id, body);
  } else {
    await roadmap.createPhase(body);
  }
  open.value = false;
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'تعديل المرحلة' : 'مرحلة جديدة'"
  >
    <slot />

    <template #body>
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="2"
        @submit="handleSubmit"
      >
        <BaseInput
          v-model="state.title"
          name="title"
          label="عنوان المرحلة"
          placeholder="مثال: الأساس: JavaScript بعمق"
          class="col-span-full"
          required
        />
        <BaseTextarea
          v-model="state.description"
          name="description"
          label="الوصف"
          placeholder="وصف مختصر"
          class="col-span-full"
          :rows="2"
        />
        <BaseNumber
          v-model="state.weeksEstimate"
          name="weeksEstimate"
          label="عدد الأسابيع التقديري"
          placeholder="0"
          required
        />
        <BaseSelect
          v-model="state.milestoneLevel"
          name="milestoneLevel"
          label="المرحلة الفاصلة (Milestone)"
          :items="MILESTONE_OPTIONS"
          value-key="value"
          label-key="label"
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
