<script setup>
const diagrams = [
  { icon: 'i-lucide-shapes', name: 'مخططات UML' },
  { icon: 'i-lucide-component', name: 'مخططات المكونات (Component)' },
  { icon: 'i-lucide-user-square', name: 'مخطط حالات الاستخدام (Use-case)' },
  { icon: 'i-lucide-activity', name: 'مخطط النشاط (Activity)' },
  { icon: 'i-lucide-box', name: 'مخطط الفئات (Class)' },
  { icon: 'i-lucide-arrow-right-left', name: 'مخطط التسلسل (Sequence)' },
  { icon: 'i-lucide-cog', name: 'مخطط آلة الحالة (State Machine)' },
  { icon: 'i-lucide-server', name: 'مخطط النشر (Deployment)' }
]
</script>

<template>
  <UPageSection
    title="المخططات"
    description="مخططات UML الأساسية في دورة حياة النظام — كل مخطط يجيب زاوية مختلفة من البنية."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-right text-xl sm:text-2xl font-medium',
      description: 'text-right text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(diagram, index) in diagrams"
        :key="diagram.name"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + index * 0.06}s` }"
      >
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 text-center hover:bg-elevated/60 transition-colors duration-300 h-full">
          <div class="mx-auto mb-3 flex items-center justify-center text-primary">
            <UIcon
              :name="diagram.icon"
              class="size-6"
            />
          </div>
          <h4 class="text-base font-semibold">
            {{ diagram.name }}
          </h4>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
