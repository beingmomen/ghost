<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'imported']);

const service = useManualJobsService();

const form = reactive({
  jobUrl: '',
  rawText: ''
});

const result = ref(null);
const errorMsg = ref('');

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// Reset form whenever modal closes
watch(isOpen, (val) => {
  if (!val) reset();
});

const hasInput = computed(() => form.jobUrl.trim() || form.rawText.trim());

const reset = () => {
  form.jobUrl = '';
  form.rawText = '';
  result.value = null;
  errorMsg.value = '';
};

const handleClose = () => {
  isOpen.value = false;
  reset();
};

const submit = async () => {
  if (!hasInput.value) {
    errorMsg.value = 'يرجى إدخال رابط الوظيفة أو لصق وصفها.';
    return;
  }

  errorMsg.value = '';
  result.value = null;

  const payload = { source: 'linkedin' };
  if (form.jobUrl.trim()) payload.jobUrl = form.jobUrl.trim();
  if (form.rawText.trim()) payload.rawText = form.rawText.trim();

  const res = await service.import(payload);

  if (res?.data) {
    result.value = {
      isDuplicate: res.isDuplicate,
      title: res.data.title || 'الوظيفة'
    };
    emit('imported', res.data);
    // Reset form fields but keep success message visible
    form.jobUrl = '';
    form.rawText = '';
  }
};
</script>

<template>
  <UModal v-model:open="isOpen" :title="'استيراد وظيفة من LinkedIn'">
    <template #body>
      <div class="space-y-4">
        <!-- Info note -->
        <div class="p-3 bg-info/10 rounded-lg text-sm text-info">
          إذا كان LinkedIn يحجب الجلب الآلي، الصق وصف الوظيفة مباشرةً في الحقل أدناه.
        </div>

        <!-- URL field -->
        <BaseInput
          v-model="form.jobUrl"
          name="jobUrl"
          label="رابط الوظيفة على LinkedIn"
          placeholder="https://www.linkedin.com/jobs/view/..."
          type="url"
        />

        <!-- Raw text field -->
        <UFormField name="rawText" label="أو الصق وصف الوظيفة">
          <UTextarea
            v-model="form.rawText"
            placeholder="الصق وصف الوظيفة الكامل هنا..."
            :rows="6"
            class="w-full font-mono text-sm"
            resize
          />
        </UFormField>

        <!-- Success message -->
        <div v-if="result" class="p-3 rounded-lg" :class="result.isDuplicate ? 'bg-warning/10' : 'bg-success/10'">
          <p class="text-sm" :class="result.isDuplicate ? 'text-warning' : 'text-success'">
            <template v-if="result.isDuplicate">
              الوظيفة موجودة مسبقًا: "{{ result.title }}" — تم تحديث تاريخ الرؤية.
            </template>
            <template v-else>
              تمت إضافة الوظيفة بنجاح: "{{ result.title }}".
            </template>
          </p>
        </div>

        <!-- Error message -->
        <div v-if="errorMsg" class="p-3 bg-error/10 rounded-lg">
          <p class="text-sm text-error">
            {{ errorMsg }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton
          label="إغلاق"
          color="neutral"
          variant="outline"
          @click="handleClose"
        />
        <UButton
          label="استيراد"
          icon="i-lucide-download"
          :loading="service.loading.value"
          :disabled="!hasInput || service.loading.value"
          @click="submit"
        />
      </div>
    </template>
  </UModal>
</template>
