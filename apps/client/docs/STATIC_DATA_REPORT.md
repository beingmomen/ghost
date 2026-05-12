<div dir="rtl">

# تقرير البيانات الـ Static في المشروع

> **تاريخ الاستكشاف:** أبريل 2026  
> بعد استكشاف شامل لجميع ملفات المشروع، إليك كل البيانات الـ static (المكتوبة مباشرة في الكود وليست قادمة من API أو CMS).

---

## 1. `app/app.config.ts` — الإعدادات العامة

**النوع:** بيانات شخصية + إعدادات UI

```ts
global.picture.dark   = 'cloudinary URL'
global.picture.light  = 'cloudinary URL'
global.picture.alt    = 'عبدالمؤمن الشطوري'
global.meetingLink    = 'https://cal.com/beingmomen'
global.email          = 'abdelmomenelshatory@gmail.com'
global.available      = true

footer.credits = '© 2026 عبدالمؤمن الشطوري'
footer.links   = [LinkedIn, GitHub, Twitter, Facebook, Instagram]
ui.colors.primary  = 'blue'
ui.colors.neutral  = 'neutral'
```

---

## 2. `app/utils/links.ts` — روابط التنقل والسوشيال ميديا

### `socialLinks` (6 منصات):

| المنصة | الرابط |
|--------|---------|
| LinkedIn | linkedin.com/in/beingmomen |
| GitHub | github.com/beingmomen |
| Qabilah | qabilah.com/profile/beingmomen |
| Twitter | twitter.com/beingmomen |
| Facebook | facebook.com/beingmomen |
| Instagram | instagram.com/beingmomen |

### `navLinks` (7 صفحات):

الرئيسية `/`  ·  المشاريع `/projects`  ·  القرارات المعمارية `/adr`  
المقالات `/blog`  ·  قم بتقييمنا `/testimonial`  ·  تواصل معنا `/contact`  ·  عن الموقع `/about`

---

## 3. ~~`app/composables/useExperiences.js` — الخبرات العملية~~ ✅ تم النقل

> **تم النقل إلى API** — يقرأ الآن من `useNuxtData('landing')` (الصفحة الرئيسية) أو `/experiences/all` (صفحة about).  
> CRUD عبر Dashboard: `/experiences` + Backend: `/api/v1/experiences`

---

## 4. `app/components/landing/About.vue`

**النوع:** نص تعريفي

```
العنوان: نبذة عني
الوصف: Frontend Engineer بخبرة تزيد عن 5 سنوات. أعمل على بناء تطبيقات ويب حديثة وعالية الأداء...
```

---

## 5. `app/components/landing/Hero.vue`

**النوع:** محتوى الصفحة الرئيسية

```
العنوان: عبدالمؤمن الشطوري
الوصف: Frontend Engineer بخبرة تزيد عن 5 سنوات...
الروابط: [تواصل معي → /contact]
```

**الصور (5 مشاريع بـ Cloudinary URLs):**
1. Tiger Academy Dashboard
2. Golden Tiger Academy
3. STREAMMAXY
4. Dream TV Player
5. Spider TV

---

## 6. `app/components/landing/Stats.vue`

**النوع:** أرقام إنجازات — **4 إحصائيات**

| القيمة | التسمية |
|--------|---------|
| +5 | سنوات خبرة |
| +10 | مشروع منجز |
| 3 | شركات |
| 100% | التزام بالجودة |

---

## 7. ~~`app/components/landing/FAQ.vue` — الأسئلة الشائعة~~ ✅ تم النقل

> **تم النقل إلى API** — يقرأ الآن من `useNuxtData('landing')` ويُجمّع حسب التصنيف.  
> CRUD عبر Dashboard: `/faqs` + Backend: `/api/v1/faqs`

---

## 8. `app/components/AppFooter.vue`

**النوع:** قوائم تنقل داخلية — **3 قوائم**

- **quickLinks (6):** `/`, `/projects`, `/blog`, `/about`, `/contact`, `/testimonial`
- **guides (2):** SDLC Framework · دورة حياة تطوير البرمجيات
- **aiTools (4):** MCP Servers · Agents · Skills · Commands

---

## 9. ~~`app/pages/about.vue` — أكثر ملف بيانات static~~ ✅ تم النقل

> **تم النقل إلى API** — يجلب الآن من `/infos` (للسيرة والإحصائيات والمهارات والصور) + `/experiences/all` (للخبرات).  
> الإعداد عبر Dashboard: `/infos` + `/experiences`  
> الوصف والعنوان وبيانات SEO المثبتة بقيت static (لا حاجة لنقلها).

---

## 10. `app/pages/contact.vue`

**النوع:** بيانات عرض صفحة الاتصال

```
contactPills = [
  { icon: mail,      label: البريد الإلكتروني (من app.config) }
  { icon: message,   label: 'واتساب / تيليجرام' }
  { icon: map-pin,   label: 'مصر — متاح عن بُعد' }
]
```

---

## 11. `app/pages/adr/index.vue` — 2 قرار معماري

| الـ slug | العنوان | الـ Topics |
|---------|---------|-----------|
| global-data | إدارة البيانات العامة | Computed Reactivity, Session Management, Single Source of Truth, API Design |
| multi-mode-system | نظام الأوضاع المتعددة | Runtime Switching, File Separation, Orchestrator Pattern, Zero Conditionals |

---

## 12. `app/pages/sdlc.vue` — 6 مراحل SDLC (إنجليزي)

| # | المرحلة | اللون |
|---|---------|-------|
| 01 | Analysis | cyan |
| 02 | Design | violet |
| 03 | Development | emerald |
| 04 | Testing | amber |
| 05 | Deployment | orange |
| 06 | Maintenance | pink |

كل مرحلة تحتوي على: `layerA` (وصف + output) + `layerB` (5 أنشطة) + `layerC` (5 checkpoints) + `meta` (roles, question, trigger, risk)

---

## 13. `app/pages/sdlc-ar.vue` — 6 مراحل SDLC (عربي)

نفس الهيكل والمراحل بالضبط، مترجمة بالكامل للعربية.

---

## 14. صفحات إدارة الأدوات — فلاتر التصنيف

| الصفحة | الفئات |
|-------|-------|
| `/agents` | all, explore, plan, frontend, vue, design, architecture, testing, other |
| `/skills` | all, git, code, ui, seo, testing, deployment, other |
| `/mcp` | all, frontend, backend, devops, ai, database, other |
| `/commands` | لا فئات — قائمة مباشرة |

---

## 15. `nuxt.config.ts` — SEO Metadata الأساسية

```
title:          'عبدالمؤمن الشطوري | Frontend Engineer'
description:    'Frontend Engineer بخبرة تزيد عن 5 سنوات...'
keywords:       'Frontend Engineer, Frontend Engineer, عبدالمؤمن الشطوري...'
og:title:       'عبدالمؤمن الشطوري - Frontend Engineer | مشاريع واقعية لأكثر من +50 عميل'
og:description: 'حلول برمجية مبتكرة وتجارب مستخدم استثنائية...'
author:         'Abdelmomen Elshatory'
robots:         'index, follow, max-image-preview:large'
site.name:      'عبدالمؤمن الشطوري'
site.defaultLocale: 'ar'
schemaOrg:      Person (name, jobTitle, email, sameAs, knowsLanguage)
```

---

## ملخص — أولوية النقل لـ API/CMS

| الملف | نوع البيانات | الحالة |
|-------|-------------|--------|
| ~~`app/composables/useExperiences.js`~~ | خبرات العمل (3 وظائف كاملة) | ✅ تم النقل |
| ~~`app/pages/about.vue`~~ | قصة، مهارات، إحصائيات، صور | ✅ تم النقل |
| `app/app.config.ts` | معلومات اتصال، صورة، availability | 🔴 عالية جداً |
| ~~`app/components/landing/FAQ.vue`~~ | 3 فئات، 8 أسئلة وأجوبة | ✅ تم النقل |
| `app/components/landing/Hero.vue` | عنوان، وصف، 5 صور مشاريع | 🟠 عالية |
| `app/components/landing/Stats.vue` | 4 إحصائيات | 🟡 متوسطة |
| `app/components/landing/About.vue` | نص قصير | 🟡 متوسطة |
| `app/utils/links.ts` | روابط Nav و Social | 🟡 متوسطة |
| `app/components/AppFooter.vue` | quickLinks, guides, aiTools | 🟡 متوسطة |
| `app/pages/sdlc.vue` | 6 مراحل كاملة (إنجليزي) | 🟢 منخفضة (محتوى تعليمي ثابت) |
| `app/pages/sdlc-ar.vue` | 6 مراحل كاملة (عربي) | 🟢 منخفضة (محتوى تعليمي ثابت) |
| `app/pages/adr/index.vue` | 2 بطاقة ADR | 🟢 منخفضة (موثّق في Markdown) |

</div>
