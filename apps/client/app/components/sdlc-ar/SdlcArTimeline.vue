<script setup>
defineProps({
  phases: {
    type: Array,
    required: true
  }
})

const phaseRoles = {
  analysis: ['مالك المنتج', 'مدير المشروع', 'محلل الأعمال', 'المدير التقني'],
  design: ['مهندس الأنظمة', 'مصمم UX/UI'],
  development: ['مطور الواجهة الأمامية', 'مطور الخلفية'],
  testing: ['مهندس الحلول', 'مهندس جودة', 'مختبِر', 'DevOps'],
  deployment: ['مدير قاعدة البيانات', 'DevOps'],
  maintenance: ['المستخدمون', 'المختبِرون', 'الدعم الفني']
}

const roleDetails = {
  'مالك المنتج': { summary: 'يمثّل رؤية المنتج ويحدد أولويات المتطلبات نيابة عن أصحاب المصلحة. يدير قائمة الأعمال المتراكمة ويقرر ما يتم بناؤه أولاً لتعظيم قيمة المنتج.' },
  'مدير المشروع': { summary: 'ينسّق عمل الفريق، ويدير الجداول الزمنية والموارد والمخاطر. يضمن تسليم المشروع في الوقت المحدد وضمن الميزانية من خلال التواصل الفعّال مع جميع الأطراف.' },
  'محلل الأعمال': { summary: 'يجمع ويوثّق متطلبات أصحاب المصلحة. يسدّ الفجوة بين احتياجات العمل والحلول التقنية لضمان فهم الفريق الكامل لما يتم بناؤه ولماذا.' },
  'المدير التقني': { summary: 'يقود الاستراتيجية التقنية للشركة ويشرف على فرق البنية التحتية والهندسة. يضمن توافق القرارات التقنية مع أهداف العمل والرؤية طويلة المدى.' },
  'مهندس الأنظمة': { summary: 'يصمم البنية التقنية الشاملة للنظام ويختار الأنماط المعمارية والتقنيات المناسبة. يضمن تكامل المكونات وتلبية متطلبات الأداء والأمان وقابلية التوسع.' },
  'مصمم UX/UI': { summary: 'يصمم تجربة المستخدم وواجهة التطبيق من الإطارات السلكية إلى التصميمات النهائية. يهدف لجعل المنتج جذاباً بصرياً وسهل الاستخدام ومتوافقاً مع احتياجات المستخدمين الحقيقية.' },
  'مطور الواجهة الأمامية': { summary: 'يحوّل تصميمات UX/UI إلى واجهات تفاعلية يتعامل معها المستخدمون مباشرة. يضمن الأداء والاستجابة عبر الأجهزة والمتصفحات مع الحفاظ على معايير جودة الكود.' },
  'مطور الخلفية': { summary: 'يبني منطق الأعمال للتطبيق وواجهات APIs وقواعد البيانات. مسؤول عن أداء النظام وأمانه واستقراره ومعالجة البيانات بكفاءة.' },
  'مهندس الحلول': { summary: 'يصمم الحلول التقنية المتكاملة التي تربط الاستراتيجية التقنية بالتنفيذ العملي. يشرف على مطابقة الحل للمتطلبات ويضمن جودة البنية الشاملة.' },
  'مهندس جودة': { summary: 'يضمن جودة البرمجيات من خلال تصميم وتنفيذ خطط الاختبار. يمنع العيوب من الوصول للمستخدمين النهائيين ويحدد معايير الجودة لكامل الفريق.' },
  'مختبِر': { summary: 'يختبر البرمجيات يدوياً أو آلياً للعثور على الأخطاء. يتحقق من أن النظام يعمل وفق المواصفات المحددة ويوثّق العيوب بوضوح لفريق التطوير.' },
  'DevOps': { summary: 'يربط بين التطوير والعمليات لأتمتة عمليات البناء والنشر والمراقبة. يضمن استقرار البيئة وسرعة التسليم وموثوقية النظام في الإنتاج.' },
  'مدير قاعدة البيانات': { summary: 'يدير ويصون قواعد البيانات، ضامناً أداءها وأمانها وتوافرها. يشرف على عمليات الترحيل والنسخ الاحتياطي واستعادة الكوارث.' },
  'المستخدمون': { summary: 'يستخدمون النظام في الإنتاج ويقدمون ملاحظات حقيقية تشكّل اتجاه التحسين في الدورة التالية. رضاهم هو المقياس الحقيقي لنجاح المنتج.' },
  'المختبِرون': { summary: 'يشاركون في الاختبار المستمر بعد النشر للتحقق من استقرار النظام وأدائه في الإنتاج، واكتشاف انحدارات الجودة المبكرة بين الإصدارات.' },
  'الدعم الفني': { summary: 'يستجيب لمشاكل المستخدمين ويحلّها. يمثل الخط الأول في سلسلة الدعم بعد الإطلاق، ويوثّق الأخطاء المتكررة ويوجّهها لفريق الهندسة.' }
}

const modalOpen = ref(false)
const activeRole = ref(null)
const activePhase = ref(null)

function openModal(role, phase) {
  activeRole.value = role
  activePhase.value = phase
  modalOpen.value = true
}
</script>

<template>
  <UPageSection
    title="٦ مراحل · الأدوار في لمحة"
    description="لكل مرحلة أصحاب مصلحة ومدخلات ومخرجات مميزة. الدورة تكرارية — وليست خطية بشكل صارم."
    :ui="{
      container: 'py-8 sm:py-12 lg:py-16',
      title: 'text-right text-xl sm:text-2xl font-medium',
      description: 'text-right text-base text-muted mt-2 leading-relaxed'
    }"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(phase, index) in phases"
        :key="phase.id"
        class="animate-fade-in"
        :style="{ animationDelay: `${0.1 + index * 0.08}s` }"
      >
        <div class="rounded-xl border border-default/60 bg-elevated/30 p-5 hover:bg-elevated/60 transition-colors duration-300 text-right">
          <div class="flex items-center gap-2 mb-3">
            <UBadge
              :label="phase.num"
              color="primary"
              variant="subtle"
              size="xs"
            />
            <span class="text-base font-semibold">{{ phase.title }}</span>
          </div>
          <USeparator class="mb-3" />
          <ul class="space-y-2">
            <li
              v-for="role in phaseRoles[phase.id]"
              :key="role"
              class="text-base text-muted hover:text-primary cursor-pointer transition-colors duration-200"
              @click="openModal(role, phase)"
            >
              {{ role }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <UModal
      :open="modalOpen"
      :title="activeRole"
      :description="activePhase?.title"
      @update:open="modalOpen = $event"
    >
      <template #body>
        <p class="text-base text-muted leading-relaxed text-right">
          {{ roleDetails[activeRole]?.summary }}
        </p>
      </template>
    </UModal>
  </UPageSection>
</template>
