<script setup>
const stages = [
  {
    title: 'المتطلبات',
    items: ['الرؤية', 'المتطلبات الوظيفية', 'المتطلبات غير الوظيفية', 'القيود', 'الافتراضات']
  },
  {
    title: 'نطاق المشكلة',
    items: ['تعريف حدود النظام', 'تحديد الكيانات الأساسية', 'رسم العلاقات', 'تحديد حدود النطاق']
  },
  {
    title: 'حالات الاستخدام',
    items: ['حالات الاستخدام المحورية', 'حالات استخدام النظام', 'قائمة جميع الأطراف الفاعلة', 'مخططات النشاط']
  },
  {
    title: 'تعريف البنية',
    items: ['تحليل البنية', 'تعريف المكونات', 'ربط الواجهات', 'اختيار الأنماط']
  },
  {
    title: 'النشر',
    items: ['إعداد البنية التحتية', 'خط CI/CD', 'ضبط البيئة', 'خطة الإطلاق']
  }
]
</script>

<template>
  <UPageSection
    title="سير عمل التحليل والتصميم"
    description="خط الأنابيب المنظّم من المتطلبات الخام إلى البنية المنشورة — كل مرحلة تنتج مخرجات ملموسة تغذي المرحلة التالية."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-right text-xl sm:text-2xl font-medium',
      description: 'text-right text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <template #headline>
      <UBadge
        label="خط أنابيب OOA&D"
        color="primary"
        variant="soft"
        size="sm"
        icon="i-lucide-workflow"
      />
    </template>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(stage, index) in stages"
        :key="stage.title"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
      >
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300 h-full text-right">
          <div class="flex items-center gap-2 mb-3">
            <UBadge
              :label="`${index + 1}`"
              color="primary"
              variant="subtle"
              size="xs"
            />
            <span class="text-base font-semibold">{{ stage.title }}</span>
          </div>
          <USeparator class="mb-3" />
          <ul class="space-y-1.5">
            <li
              v-for="item in stage.items"
              :key="item"
              class="text-base text-muted flex gap-2 items-center leading-relaxed"
            >
              <span class="size-1 rounded-full bg-primary/50 shrink-0" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
