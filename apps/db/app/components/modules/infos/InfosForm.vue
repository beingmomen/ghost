<script setup>
const {
  state,
  schema,
  handleSubmit,
  loading,
  isEditing
} = inject('composable');

// Bio paragraphs
function addParagraph() {
  state.bio.paragraphs.push('');
}
function removeParagraph(i) {
  state.bio.paragraphs.splice(i, 1);
}

// Skills
function addSkill() {
  state.skills.push({ title: '', icon: '', items: [{ name: '', icon: '' }] });
}
function removeSkill(i) {
  state.skills.splice(i, 1);
}
function addSkillItem(si) {
  state.skills[si].items.push({ name: '', icon: '' });
}
function removeSkillItem(si, ii) {
  state.skills[si].items.splice(ii, 1);
}

// Images
function addImage() {
  state.images.push({ src: null, alt: '' });
}
function removeImage(i) {
  state.images.splice(i, 1);
}
</script>

<template>
  <div class="space-y-4">
    <BaseCard title="الإعدادات" icon="i-lucide-settings">
      <BaseForm
        :schema="schema"
        :state="state"
        :cols="1"
        @submit="handleSubmit"
      >
        <BaseInput
          v-model="state.resumeUrl"
          name="resumeUrl"
          label="رابط السيرة الذاتية"
          placeholder="https://example.com/resume.pdf"
          required
        />

        <!-- Bio Section -->
        <USeparator label="السيرة الذاتية" class="col-span-full" />

        <div class="col-span-full space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">الفقرات</span>
            <UButton
              label="إضافة فقرة"
              icon="i-lucide-plus"
              size="xs"
              variant="outline"
              @click="addParagraph"
            />
          </div>
          <div v-for="(_, i) in state.bio.paragraphs" :key="i" class="flex gap-2">
            <BaseTextarea
              v-model="state.bio.paragraphs[i]"
              :name="`bio.paragraphs.${i}`"
              :placeholder="`الفقرة ${i + 1}`"
              class="flex-1"
            />
            <UButton
              v-if="state.bio.paragraphs.length > 1"
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="lg"
              @click="removeParagraph(i)"
            />
          </div>
        </div>

        <BaseInput
          v-model="state.bio.quote"
          name="bio.quote"
          label="الاقتباس"
          placeholder="اقتباس ملهم..."
        />

        <!-- Skills Section -->
        <USeparator label="المهارات" class="col-span-full" />

        <div class="col-span-full space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">المهارات</span>
            <UButton
              label="إضافة مجموعة"
              icon="i-lucide-plus"
              size="xs"
              variant="outline"
              @click="addSkill"
            />
          </div>
          <div v-for="(skill, si) in state.skills" :key="si" class="border border-default rounded-lg p-4 space-y-3">
            <div class="flex gap-2 items-start">
              <BaseInput
                v-model="skill.title"
                :name="`skills.${si}.title`"
                placeholder="عنوان المجموعة"
                class="flex-1"
              />
              <BaseInput
                v-model="skill.icon"
                :name="`skills.${si}.icon`"
                placeholder="الأيقونة"
                class="flex-1"
              />
              <UButton
                v-if="state.skills.length > 1"
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="lg"
                @click="removeSkill(si)"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">العناصر</span>
              <UButton
                label="إضافة عنصر"
                icon="i-lucide-plus"
                size="2xs"
                variant="outline"
                @click="addSkillItem(si)"
              />
            </div>
            <div v-for="(item, ii) in skill.items" :key="ii" class="flex gap-2 items-start ps-4">
              <BaseInput
                v-model="item.name"
                :name="`skills.${si}.items.${ii}.name`"
                placeholder="الاسم"
                class="flex-1"
              />
              <BaseInput
                v-model="item.icon"
                :name="`skills.${si}.items.${ii}.icon`"
                placeholder="الأيقونة"
                class="flex-1"
              />
              <UButton
                v-if="skill.items.length > 1"
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="lg"
                @click="removeSkillItem(si, ii)"
              />
            </div>
          </div>
        </div>

        <!-- Images Section -->
        <USeparator label="الصور" class="col-span-full" />

        <div class="col-span-full space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">الصور</span>
            <UButton
              label="إضافة"
              icon="i-lucide-plus"
              size="xs"
              variant="outline"
              @click="addImage"
            />
          </div>
          <div v-for="(img, i) in state.images" :key="i" class="flex gap-2 items-start">
            <BaseFileUpload
              v-model="img.src"
              :name="`images.${i}.src`"
              accept="image/*"
              class="flex-1"
            />
            <BaseInput
              v-model="img.alt"
              :name="`images.${i}.alt`"
              placeholder="النص البديل"
              class="flex-1"
            />
            <UButton
              v-if="state.images.length > 1"
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="lg"
              @click="removeImage(i)"
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
