<template>
  <UApp :locale="ar">
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>

<script setup>
import { ar } from '@nuxt/ui/locale'
import { IDENTITY } from '#shared/identity'
// LCP على الجوال هو فقرة وصف الهيرو (نص body عربي) — خطها Tajawal 400 عربي.
// نعمل preload لهذا الملف وحده حتى يصل مبكراً بدل التنافس مع باقي الخطوط؛
// الباقي يُكتشف طبيعياً عبر unicode-range مع font-display: swap (لا preload له).
// `?url` يعطي المسار المُجزّأ (hashed) الصحيح بعد البناء.
import tajawalArabic400 from '~/assets/fonts/tajawal-arabic-400.woff2?url'

const lang = ar.code
const dir = ar.dir

const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#1c1917' : 'white')

useHead({
  // ⚠️ اسم الموقع (عبدالمؤمن الشطوري) يُضاف لعنوان الصفحة <title> هنا فقط.
  // ممنوع أي صفحة تحط الاسم يدوياً جوه عنوانها (useHead/useSeoMeta title) —
  // كل صفحة تبعت عنوانها بس، والقالب هنا هو اللي بيضيف الاسم تلقائياً.
  // حماية دفاعية: لو عنوان صفحة جاي وفيه الاسم بالفعل (زي الرئيسية،
  // اللي عنوانها "الاسم | المسمى الوظيفي")، القالب مبيكررهوش.
  titleTemplate: (title) => {
    if (!title) return IDENTITY.fullName
    return title.includes(IDENTITY.fullName) ? title : `${title} | ${IDENTITY.fullName}`
  },
  meta: [
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', href: '/favicon.webp', type: 'image/webp' },
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: tajawalArabic400,
      crossorigin: 'anonymous'
    }
  ],
  htmlAttrs: {
    lang,
    dir
  }
})
</script>
