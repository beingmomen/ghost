<script setup>
const tasks = [
  {
    title: 'قراءة المتطلبات من الفصل 12',
    desc: 'استخلاص وتوثيق جميع المتطلبات من فصل نظام تتبع الإجازات. إنشاء وثيقة متطلبات مشتركة يمكن للفريق بأكمله الرجوع إليها.',
    tags: ['الرؤية', 'المتطلبات الوظيفية', 'المتطلبات غير الوظيفية', 'القيود']
  },
  {
    title: 'تعريف نطاق المشكلة',
    desc: 'تحديد حدود النظام. تحديد ما هو داخل وخارج نطاق نظام تتبع الإجازات. توثيق ماهية النظام — وما ليس عليه صراحةً.',
    tags: ['حدود النطاق', 'تعريف النطاق', 'تحديد الكيانات']
  },
  {
    title: 'استخلاص الأطراف الفاعلة في النظام',
    desc: 'تحديد كل إنسان ونظام سيتفاعل مع نظام تتبع الإجازات. تصنيف كل طرف كأساسي أو ثانوي أو نظامي.',
    tags: ['الأطراف الأساسية', 'الأطراف الثانوية', 'الأطراف النظامية']
  },
  {
    title: 'بناء حالات الاستخدام — "إدارة الوقت"',
    desc: 'لكل حالة استخدام، إنتاج أربعة مخرجات تحدد السلوك بالكامل. هذه تصبح الأساس للتطوير والاختبار.',
    tags: ['الكيانات (نموذج البيانات)', 'مخطط التدفق', 'مخطط التسلسل', 'شبه الكود']
  }
]
</script>

<template>
  <UPageSection
    title="سير عمل الفريق"
    description="مهام ملموسة لنظام تتبع الإجازات (الفصل 12) — المشروع التطبيقي لبرنامج الإرشاد OOA&D."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-right text-xl sm:text-2xl font-medium',
      description: 'text-right text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="space-y-4">
      <div
        v-for="(task, index) in tasks"
        :key="task.title"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + index * 0.12}s` }"
      >
        <div class="flex gap-4 items-start">
          <div class="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
            {{ index + 1 }}
          </div>
          <div class="flex-1 rounded-xl border border-default/60 bg-elevated/30 p-4 sm:p-5 hover:bg-elevated/60 transition-colors duration-300 text-right">
            <h3 class="text-base font-semibold mb-1">
              {{ task.title }}
            </h3>
            <p class="text-base text-muted leading-relaxed mb-3">
              {{ task.desc }}
            </p>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in task.tags"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="subtle"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
