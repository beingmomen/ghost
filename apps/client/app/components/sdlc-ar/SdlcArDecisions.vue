<script setup>
const leftNodes = [
  {
    type: 'warn',
    condition: 'إذا كان المتطلب غير واضح',
    action: { prefix: 'العودة إلى ', target: 'التحليل', suffix: '. إعادة إشراك أصحاب المصلحة. توضيح الرؤية والتوقعات الوظيفية قبل أي عمل تصميمي.' }
  },
  {
    type: 'err',
    condition: 'إذا كانت البنية غير مستقرة',
    action: { prefix: 'مراجعة ', target: 'التصميم', suffix: '. تفكيك أعمق. التحقق من البنية مقابل المتطلبات مرة أخرى قبل استئناف التطوير.' }
  },
  {
    type: 'err',
    condition: 'إذا كانت حالة الاستخدام ناقصة',
    action: { prefix: 'العودة إلى ', target: 'التصميم', suffix: '. إضافة الأطراف الفاعلة أو التدفقات أو الحالات الحدية المفقودة. إعادة النمذجة قبل كتابة أي كود.' }
  }
]

const rightNodes = [
  {
    type: 'warn',
    condition: 'إذا فشل اختبار',
    action: { prefix: 'العودة إلى ', target: 'التطوير', suffix: '. إصلاح السبب الجذري — وليس العرَض. إعادة تشغيل مجموعة اختبارات الانحدار الكاملة قبل إعادة التقديم.' }
  },
  {
    type: 'err',
    condition: 'إذا فشل النشر',
    action: { prefix: 'تنفيذ ', target: 'خطة التراجع', suffix: '. التحقيق في السبب الجذري. الإصلاح في التطوير ← إعادة الاختبار ← إعادة النشر بثقة.' }
  },
  {
    type: 'ok',
    condition: 'إذا اجتازت جميع نقاط التحقق',
    action: { prefix: 'المتابعة إلى ', target: 'المرحلة التالية', suffix: '. توثيق القرارات والمبررات. إخطار أصحاب المصلحة وتحديث تتبع التقدم.' }
  }
]

const nodeStyles = {
  warn: { card: 'border-warning/30 bg-warning/5', text: 'text-warning' },
  err: { card: 'border-error/30 bg-error/5', text: 'text-error' },
  ok: { card: 'border-success/30 bg-success/5', text: 'text-success' }
}
</script>

<template>
  <UPageSection
    title="نظام تدفق القرارات"
    description="المنطق الشرطي الذي يطبّقه المعماري عندما يكون هناك خطأ أو نقص أو غموض — وكيفية التعافي."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-right text-xl sm:text-2xl font-medium',
      description: 'text-right text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-3">
        <div
          v-for="(node, index) in leftNodes"
          :key="node.condition"
          class="animate-fade-in"
          :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
        >
          <div
            class="rounded-xl border p-5 transition-colors duration-300 text-right"
            :class="nodeStyles[node.type].card"
          >
            <div
              class="text-base font-semibold mb-2"
              :class="nodeStyles[node.type].text"
            >
              {{ node.condition }}
            </div>
            <p class="text-base text-muted leading-relaxed">
              → {{ node.action.prefix }}<strong class="text-highlighted">{{ node.action.target }}</strong>{{ node.action.suffix }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="(node, index) in rightNodes"
          :key="node.condition"
          class="animate-fade-in"
          :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
        >
          <div
            class="rounded-xl border p-5 transition-colors duration-300 text-right"
            :class="nodeStyles[node.type].card"
          >
            <div
              class="text-base font-semibold mb-2"
              :class="nodeStyles[node.type].text"
            >
              {{ node.condition }}
            </div>
            <p class="text-base text-muted leading-relaxed">
              → {{ node.action.prefix }}<strong class="text-highlighted">{{ node.action.target }}</strong>{{ node.action.suffix }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
