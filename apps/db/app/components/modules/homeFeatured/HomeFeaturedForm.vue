<script setup>
const {
  state,
  schema,
  projectsList,
  handleSubmit,
  loading,
  isEditing,
  moveUp,
  moveDown,
  removeProject
} = inject('composable');

// صفوف الترتيب: كل id في state.projects → المشروع المطابق من القائمة (أو null لو اتمسح).
const orderedProjects = computed(() =>
  state.projects.map((id) => ({
    id,
    project: projectsList.value.find((p) => p.id === id) || null
  }))
);
</script>

<template>
  <div class="space-y-4">
    <BaseCard title="مشاريع الهوم المميزة" icon="i-lucide-star">
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="1"
        @submit="handleSubmit"
      >
        <BaseSelect
          v-model="state.projects"
          name="projects"
          label="المشاريع المميزة (حد أقصى 3)"
          placeholder="اختر حتى 3 مشاريع"
          :items="projectsList"
          value-key="id"
          label-key="name"
          multiple
        />

        <USeparator label="الترتيب" class="col-span-full" />

        <div class="col-span-full space-y-2">
          <p v-if="!orderedProjects.length" class="text-sm text-muted">
            لم يتم اختيار أي مشروع بعد.
          </p>
          <div
            v-for="(row, i) in orderedProjects"
            :key="row.id"
            class="flex items-center gap-3 border border-default rounded-lg p-2"
          >
            <span class="w-5 text-center text-sm text-muted">{{ i + 1 }}</span>
            <UAvatar
              :src="row.project ? normalizeAvatarSrc(row.project.image) : undefined"
              size="md"
            />
            <span class="flex-1 truncate text-sm">
              {{ row.project ? row.project.name : 'مشروع محذوف' }}
            </span>
            <UButton
              icon="i-lucide-arrow-up"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="i === 0"
              @click="moveUp(i)"
            />
            <UButton
              icon="i-lucide-arrow-down"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="i === orderedProjects.length - 1"
              @click="moveDown(i)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              @click="removeProject(i)"
            />
          </div>
        </div>

        <template #actions>
          <UButton
            type="submit"
            :label="isEditing ? 'تحديث' : 'حفظ'"
            icon="i-lucide-check"
            :loading="loading"
          />
        </template>
      </BaseForm>
    </BaseCard>
  </div>
</template>
