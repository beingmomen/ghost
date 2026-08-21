<script setup>
definePageMeta({
  title: 'ورّاق'
})

useHead({
  title: 'ورّاق — Warraq',
  meta: [
    {
      name: 'description',
      content: 'نظام إدارة توزيع الكتب بالجملة'
    }
  ]
})

useSeoMeta({
  ogTitle: 'ورّاق — Warraq',
  ogDescription: 'نظام إدارة توزيع الكتب بالجملة',
  ogType: 'article',
  ogLocale: 'ar_EG',
  twitterCard: 'summary_large_image',
  twitterTitle: 'ورّاق — Warraq',
  twitterDescription: 'نظام إدارة توزيع الكتب بالجملة',
  twitterSite: '@beingmomen'
})

useBreadcrumbSchema([
  { name: 'المشاريع', path: '/projects' },
  { name: 'ورّاق', path: '/projects/warraq' }
])

const config = useRuntimeConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': 'ورّاق — Warraq',
        'description': 'نظام إدارة توزيع الكتب بالجملة',
        'url': `${config.public.siteUrl}/projects/warraq`,
        'inLanguage': 'ar',
        'author': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'url': config.public.siteUrl
        },
        'publisher': {
          '@type': 'Person',
          'name': 'عبدالمؤمن الشطوري',
          'url': config.public.siteUrl
        }
      })
    }
  ]
})

const heroLinks = [
  {
    label: 'جرّب النظام',
    to: 'https://warraq.beingmomen.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: 'i-lucide-external-link'
  }
]

const quickFacts = [
  { label: 'الدور', value: 'مطوّر فردي — الواجهة والـ API وقاعدة البيانات' },
  { label: 'المدة', value: 'شهر واحد' },
  { label: 'الحالة', value: 'سُلّم للعميل ويعمل في الإنتاج' },
  { label: 'التقنيات', value: 'Nuxt 3 · TypeScript · Pinia · Express · MongoDB · JWT' }
]

const problemItems = [
  'مين أخد كام كتاب وامتى؟ فواتير ضايعة وإيصالات ورقية وخلافات متكررة مع المكتبات.',
  'مين دفع ومين لأ؟ ديون بتتراكم من غير متابعة موحّدة للتحصيل.',
  'كام رصيد كل مكتبة؟ مفيش لوحة واحدة توري المديونيات والمستحقات.',
  'كام باع كل مندوب؟ مفيش أي مؤشر واضح على أداء التوزيع.',
  'كام الإيراد وكام المكسب؟ الأرقام متفرقة بين الفواتير والتحصيلات، ومحدش يقدر يجاوب من غير حساب يدوي.'
]

const rolesRows = [
  ['مدير', 'إدارة كاملة: مكتبات، مندوبين، كتب، فواتير، تحصيلات، مستخدمين'],
  ['مطوّر', 'وصول كامل + إعدادات النظام'],
  ['مندوب', 'فواتير المكتبات المخصصة له، وتحصيلاتها، وعرض الكتب'],
  ['مستخدم', 'عرض البيانات والتقارير']
]

const modules = [
  { title: 'الكتب', description: 'كتالوج بالعنوان والمؤلف والسعر والكمية في المخزون' },
  { title: 'المكتبات', description: 'بيانات كل مكتبة مع رصيد حسابها وديونها المستحقة وتاريخ آخر دفعة' },
  { title: 'المندوبون', description: 'منطقة التوزيع، رصيد التحصيل، المكتبات المخصصة' },
  { title: 'فواتير البيع', description: 'نقدي أو آجل، بأرقام تسلسلية، بحالة (مدفوعة بالكامل / متبقّي)' },
  { title: 'التحصيلات', description: 'من مكتبة (يُخصم من رصيدها) أو من مندوب (يُخصم من رصيده)' },
  { title: 'لوحة المعلومات', description: 'مؤشرات تتغيّر حسب دور المستخدم' }
]

const screenshots = [
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/warraq/dashboard',
    alt: 'لوحة المعلومات في نظام ورّاق تعرض الإحصائيات المالية: المبلغ المحصل، ديون المناديب، ديون المكاتب، الإيراد الإجمالي، والمكسب الصافي',
    width: 1936,
    height: 749
  },
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/warraq/invoices',
    alt: 'قائمة فواتير البيع في نظام ورّاق مع المندوب والمكتبة والمبلغ المدفوع والمتبقي وحالة الدفع',
    width: 1930,
    height: 1163
  },
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/warraq/bookshop-invoices',
    alt: 'فواتير بيع مكتبة واحدة في نظام ورّاق',
    width: 1926,
    height: 541
  },
  {
    src: 'https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/warraq/collection',
    alt: 'شاشة تحصيل مبلغ من مكتبة في نظام ورّاق، مع الرصيد المتبقي وسجل الدفعات السابقة',
    width: 1930,
    height: 1094
  }
]
</script>

<template>
  <UPage dir="rtl">
    <UPageHero
      title="Warraq — ورّاق"
      description="نظام إدارة توزيع الكتب بالجملة"
      :links="heroLinks"
      :ui="{
        title: '!mx-0 text-right',
        description: '!mx-0 text-right',
        links: 'justify-start'
      }"
    />

    <UPageSection :ui="{ container: '!pt-0 pb-8 sm:pb-10' }">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-default/60 bg-elevated/30 p-5">
        <div
          v-for="fact in quickFacts"
          :key="fact.label"
          class="text-right"
        >
          <p class="text-xs font-medium text-muted mb-1">
            {{ fact.label }}
          </p>
          <p class="text-sm sm:text-base font-semibold text-highlighted leading-snug">
            {{ fact.value }}
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="المشكلة"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <p class="text-base text-muted leading-relaxed mb-5 text-right">
        موزّع الكتب بالجملة بيتعامل مع عشرات المكتبات ومندوبين في الميدان، والتشغيل كله ماشي على ورق:
      </p>
      <ul class="space-y-3">
        <li
          v-for="item in problemItems"
          :key="item"
          class="flex items-start gap-3 text-right"
        >
          <UIcon
            name="i-lucide-circle-help"
            class="size-5 text-primary shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p class="text-base text-muted leading-relaxed">
            {{ item }}
          </p>
        </li>
      </ul>
    </UPageSection>

    <UPageSection
      title="النظام"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <p class="text-base text-muted leading-relaxed mb-5 text-right">
        ورّاق بيربط الفواتير والتحصيلات والأرصدة والديون في مكان واحد، بصلاحيات محددة لكل دور.
      </p>

      <AdrDecisionTable
        title="أدوار المستخدمين والصلاحيات"
        :headers="['الدور', 'الصلاحيات']"
        :rows="rolesRows"
        icon="i-lucide-users"
      />

      <div class="grid sm:grid-cols-2 gap-4 mt-6">
        <div
          v-for="module in modules"
          :key="module.title"
          class="rounded-xl border border-default/60 bg-elevated/30 p-4 text-right"
        >
          <p class="text-base font-semibold text-highlighted mb-1">
            {{ module.title }}
          </p>
          <p class="text-sm text-muted leading-relaxed">
            {{ module.description }}
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="قرار العرض — إزاي تعرض نظام عميل مقفول؟"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <div class="rounded-xl border border-primary/30 bg-primary/5 p-5 text-right space-y-3">
        <p class="text-base text-muted leading-relaxed">
          المشكلة: النظام ملك العميل، وبياناته حقيقية، والكود مش قابل للنشر. والحل المعتاد في الحالة دي هو لقطات شاشة ساكنة — الزائر بيشوف صورة ومش بيفهم إزاي النظام بيشتغل فعلاً.
        </p>
        <p class="text-base text-muted leading-relaxed">
          القرار: بنيت وضع تجريبي كامل جوّه النظام نفسه — بيانات تجريبية واقعية بأسماء عربية، وبطاقات دخول سريع لكل دور، وجولة تفاعلية بتشرح كل قسم للمستخدم الجديد.
        </p>
        <p class="text-base text-muted leading-relaxed">
          النتيجة: الزائر بيدخل النظام بنفسه ويجرّبه من منظور المدير أو المندوب، من غير ما يتعرّض أي بيان حقيقي يخص العميل.
        </p>
      </div>
    </UPageSection>

    <UPageSection
      title="النتيجة"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <div class="text-right space-y-3">
        <p class="text-base text-muted leading-relaxed">
          نظام فول ستاك كامل — واجهة وAPI وقاعدة بيانات وصلاحيات وفوترة وتحصيلات — بناه مطوّر واحد في شهر، وسُلّم ويعمل في الإنتاج.
        </p>
        <p class="text-base text-muted leading-relaxed">
          واجهة عربية RTL بالكامل مع دعم ثنائي اللغة، ووضع داكن، وتصميم متجاوب على الجوال والتابلت وسطح المكتب.
        </p>
      </div>
    </UPageSection>

    <UPageSection
      title="لقطات الشاشة"
      :ui="{ container: '!pt-0', title: 'text-right' }"
    >
      <div class="space-y-6">
        <div
          v-for="screenshot in screenshots"
          :key="screenshot.src"
          class="rounded-xl border border-default/60 overflow-hidden"
        >
          <CommonProjectImage
            :src="screenshot.src"
            :alt="screenshot.alt"
            :width="screenshot.width"
            :height="screenshot.height"
            loading="lazy"
            image-class="w-full h-auto"
          />
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
