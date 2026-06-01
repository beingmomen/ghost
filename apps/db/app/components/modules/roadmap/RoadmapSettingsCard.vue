<script setup>
import { LEVEL_LADDER } from '~/composables/modules/roadmap/meta';
import { useSettingsSchema } from '~/composables/modules/roadmap/schema';

const roadmap = inject('roadmap');
const schema = useSettingsSchema();

const LEVEL_OVERRIDE_OPTIONS = [
  { label: 'تلقائي (حسب الإنجاز)', value: null },
  ...LEVEL_LADDER
];

const toDateInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : null;

const state = reactive({
  hoursPerWeek: 14,
  startDate: null,
  levelOverride: null
});

watchEffect(() => {
  const s = roadmap.settings.value;
  state.hoursPerWeek = s.hoursPerWeek ?? 14;
  state.startDate = toDateInput(s.startDate);
  state.levelOverride = s.levelOverride ?? null;
});

async function handleSubmit() {
  await roadmap.updateSettings({
    hoursPerWeek: state.hoursPerWeek,
    startDate: state.startDate || undefined,
    levelOverride: state.levelOverride || null
  });
}

const busy = computed(() => roadmap.busyId.value === 'settings');
</script>

<template>
  <BaseCard title="الإعدادات" icon="i-lucide-settings">
    <BaseForm
      :schema="schema"
      :state="state"
      :cols="3"
      @submit="handleSubmit"
    >
      <BaseNumber
        v-model="state.hoursPerWeek"
        name="hoursPerWeek"
        label="ساعات الأسبوع"
        placeholder="14"
        required
      />
      <BaseInput
        v-model="state.startDate"
        name="startDate"
        label="تاريخ البداية"
        type="date"
      />
      <BaseSelect
        v-model="state.levelOverride"
        name="levelOverride"
        label="تجاوز المستوى (اختياري)"
        :items="LEVEL_OVERRIDE_OPTIONS"
        value-key="value"
        label-key="label"
      />

      <template #actions>
        <UButton
          type="submit"
          label="حفظ الإعدادات"
          icon="i-lucide-save"
          :loading="busy"
        />
      </template>
    </BaseForm>
  </BaseCard>
</template>
