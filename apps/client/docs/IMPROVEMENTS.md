<div dir="rtl">

# توثيق التحسينات ودليل البنية والمعايير

> هذا الملف يوثق التحسينات الـ 17 التي تمت على المشروع، ويوفر دليلاً شاملاً للبنية والمعايير التي يجب اتباعها عند التعديل مستقبلاً.

---

# القسم الأول: سجل التعديلات

## تحديث الحزم

تم تحديث 7 حزم (motion-v بقيت على 1.10.3 لأن v2.0.0 تغيير جذري):

| الحزمة | من | إلى |
|--------|-----|-----|
| `@iconify-json/lucide` | 1.2.90 | 1.2.96 |
| `@iconify-json/simple-icons` | 1.2.70 | 1.2.72 |
| `@nuxt/ui` | 4.4.0 | 4.5.1 |
| `tailwindcss` | 4.1.18 | 4.2.1 |
| `@nuxt/eslint` (dev) | 1.15.1 | 1.15.2 |
| `eslint` (dev) | 10.0.0 | 10.0.2 |
| `vue-tsc` (dev) | 3.2.4 | 3.2.5 |

---

## المرحلة 1: الأمان

### 1.1 نقل Cloudinary API Key من الـ Frontend

**المشكلة:** مفتاح `apiKey` كان مكشوفاً في `runtimeConfig.public` ويُرسل من المتصفح مباشرة إلى Cloudinary. أي شخص يفتح DevTools يستطيع رؤية المفتاح واستخدامه.

**الحل:**
1. إنشاء [`server/api/upload.post.ts`](../server/api/upload.post.ts) كـ proxy يرفع الملفات من الـ server
2. نقل `apiKey` و `uploadPreset` إلى `runtimeConfig` الخاص (server-only)
3. تعديل [`FileInput.vue`](../app/components/form/FileInput.vue) ليرسل الملف لـ `/api/upload` بدلاً من Cloudinary مباشرة
4. إضافة validation في الـ server: أنواع الملفات المسموحة (صور فقط) وحد أقصى 5MB

**الملفات المتأثرة:**
- [`nuxt.config.ts`](../nuxt.config.ts) — نقل cloudinary config للـ private
- [`server/api/upload.post.ts`](../server/api/upload.post.ts) — **ملف جديد** — server proxy
- [`app/components/form/FileInput.vue`](../app/components/form/FileInput.vue) — تعديل دالة الرفع

**السبب:** كشف API keys في الـ frontend ثغرة أمنية خطيرة تسمح بإساءة الاستخدام.

---

### 1.2 حماية v-html من XSS

**المشكلة:** صفحة المقال [`blog/[slug].vue`](../app/pages/blog/[slug].vue) كانت تعرض محتوى HTML من الـ API مباشرة عبر `v-html="singleBlog.content"` بدون أي تنقية. إذا حقن أحد script خبيث في المحتوى، سيتم تنفيذه في متصفح الزائر.

**الحل:**
1. تثبيت مكتبة `isomorphic-dompurify` (تعمل في الـ server والـ client)
2. إنشاء computed property تنقّي المحتوى: `DOMPurify.sanitize(singleBlog.content)`
3. استخدام `v-html="sanitizedContent"` بدلاً من المحتوى الخام

**الملفات المتأثرة:**
- [`app/pages/blog/[slug].vue`](../app/pages/blog/[slug].vue) — إضافة DOMPurify
- [`package.json`](../package.json) — إضافة `isomorphic-dompurify`

**السبب:** حماية زوار الموقع من هجمات XSS (Cross-Site Scripting).

---

### 1.3 إضافة Security Headers

**المشكلة:** لم تكن هناك أي headers أمنية في استجابات الـ server.

**الحل:** إضافة 5 headers في [`nuxt.config.ts`](../nuxt.config.ts) ضمن `nitro.routeRules`:

| Header | القيمة | الغرض |
|--------|--------|-------|
| `X-Content-Type-Options` | `nosniff` | منع المتصفح من تخمين نوع الملف |
| `X-Frame-Options` | `DENY` | منع تضمين الموقع في iframe |
| `X-XSS-Protection` | `1; mode=block` | تفعيل حماية XSS المدمجة |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | التحكم في معلومات الـ referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | تعطيل الأذونات غير المستخدمة |

**الملفات المتأثرة:**
- [`nuxt.config.ts`](../nuxt.config.ts) — إضافة headers في nitro.routeRules

**السبب:** حماية الموقع من أنماط هجمات شائعة (clickjacking, MIME sniffing, إلخ).

---

## المرحلة 2: SEO و Structured Data

### 2.1 إضافة FAQPage Schema

**المشكلة:** مكون [`FAQ.vue`](../app/components/landing/FAQ.vue) يحتوي بيانات أسئلة وأجوبة لكن بدون JSON-LD، فلا تظهر كـ rich results في Google.

**الحل:** إضافة `useHead` مع `FAQPage` schema يستخدم بيانات `faqData.categories` الموجودة فعلاً.

**الملفات المتأثرة:**
- [`app/components/landing/FAQ.vue`](../app/components/landing/FAQ.vue)

**السبب:** تفعيل FAQ rich results في نتائج البحث يزيد الـ CTR بشكل ملحوظ.

---

### 2.2 إضافة WebSite Schema

**المشكلة:** الصفحة الرئيسية [`index.vue`](../app/pages/index.vue) بدون structured data رغم أهميتها كنقطة دخول رئيسية.

**الحل:** إضافة `WebSite` JSON-LD يحتوي اسم الموقع، الـ URL، واللغة.

**الملفات المتأثرة:**
- [`app/pages/index.vue`](../app/pages/index.vue)

**السبب:** يساعد محركات البحث على فهم هوية الموقع وعرض sitelinks.

---

### 2.3 إضافة CollectionPage Schema

**المشكلة:** صفحة المشاريع [`projects.vue`](../app/pages/projects.vue) وصفحة ADR [`adr/index.vue`](../app/pages/adr/index.vue) بدون structured data.

**الحل:** إضافة `CollectionPage` مع `ItemList` يحتوي عناصر ديناميكية من بيانات الصفحة.

**الملفات المتأثرة:**
- [`app/pages/projects.vue`](../app/pages/projects.vue) — CollectionPage مع CreativeWork
- [`app/pages/adr/index.vue`](../app/pages/adr/index.vue) — CollectionPage مع TechArticle

**السبب:** تحسين ظهور صفحات القوائم في نتائج البحث.

---

### 2.4 إضافة TechArticle Schema

**المشكلة:** صفحة SDLC [`sdlc.vue`](../app/pages/sdlc.vue) محتوى تقني غني بدون schema.

**الحل:** إضافة `TechArticle` JSON-LD مع العنوان، الوصف، المؤلف، واللغة.

**الملفات المتأثرة:**
- [`app/pages/sdlc.vue`](../app/pages/sdlc.vue)

**السبب:** تصنيف المحتوى التقني بشكل صحيح لمحركات البحث.

---

## المرحلة 3: Accessibility وجودة الكود

### 3.1 تحسين Accessibility

**المشكلة:** عدة مكونات تفتقر لخصائص accessibility أساسية.

**التعديلات:**

| المكون | المشكلة | الحل |
|--------|---------|------|
| [`AppHeader.vue`](../app/components/AppHeader.vue) | `<div>` بدلاً من `<nav>` | تحويل لـ `<nav aria-label="القائمة الرئيسية">` |
| [`BlogSidebarTableOfContents.vue`](../app/components/blog/BlogSidebarTableOfContents.vue) | بدون aria-label + inject بدون default | إضافة `aria-label="جدول المحتويات"` + default value |
| [`ColorModeButton.vue`](../app/components/ColorModeButton.vue) | fallback div فارغ | إضافة `aria-hidden="true"` |
| [`Stats.vue`](../app/components/landing/Stats.vue) | أرقام بدون سياق | إضافة `:aria-label` يجمع القيمة مع التسمية |

**السبب:** تحسين تجربة مستخدمي قارئات الشاشة والامتثال لمعايير WCAG.

---

### 3.2 توحيد Social Links

**المشكلة:** نفس مصفوفة روابط التواصل الاجتماعي مكررة في 3 أماكن:
- [`CommonSocialPart.vue`](../app/components/common/CommonSocialPart.vue)
- [`BlogSidebarSocial.vue`](../app/components/blog/BlogSidebarSocial.vue)
- [`app.config.ts`](../app/app.config.ts)

**الحل:** إضافة `socialLinks` في [`utils/links.ts`](../app/utils/links.ts) وحذف النسخ المكررة. Nuxt يعمل auto-import فلا حاجة لـ import يدوي.

**الملفات المتأثرة:**
- [`app/utils/links.ts`](../app/utils/links.ts) — إضافة socialLinks
- [`app/components/common/CommonSocialPart.vue`](../app/components/common/CommonSocialPart.vue) — حذف المصفوفة المحلية
- [`app/components/blog/BlogSidebarSocial.vue`](../app/components/blog/BlogSidebarSocial.vue) — حذف المصفوفة المحلية

**السبب:** تجنب تكرار البيانات = صيانة أسهل وتعديل من مكان واحد.

---

### 3.3 دمج مكونات SDLC المكررة

**المشكلة:** [`SdlcHero.vue`](../app/components/sdlc/SdlcHero.vue) و [`SdlcArHero.vue`](../app/components/sdlc-ar/SdlcArHero.vue) متطابقان بنسبة 95%+ — فقط النصوص مختلفة.

**الحل:** تحويل `SdlcHero.vue` ليقبل props (badgeLabel, title, titleHighlight, description, buttonLabel, arrowIcon) مع قيم إنجليزية افتراضية. المكون العربي `SdlcArHero.vue` أصبح يلف `SdlcHero` بـ props عربية فقط.

**الملفات المتأثرة:**
- [`app/components/sdlc/SdlcHero.vue`](../app/components/sdlc/SdlcHero.vue) — إضافة props
- [`app/components/sdlc-ar/SdlcArHero.vue`](../app/components/sdlc-ar/SdlcArHero.vue) — تبسيط ليلف SdlcHero

**السبب:** تكرار المكونات يعني تعديل نفس الشيء في مكانين = أخطاء حتمية.

---

### 3.4 تنظيف الكود المعلق

**المشكلة:** كود معلق (commented out) متعلق بنظام authentication قديم تم إزالته.

**الحل:** حذف الكود المعلق وتنظيف الملفات.

**الملفات المتأثرة:**
- [`app/plugins/api.ts`](../app/plugins/api.ts) — حذف أسطر auth المعلقة
- [`app/composables/useErrorHandler.js`](../app/composables/useErrorHandler.js) — حذف signOut/useAuth المعلق

**السبب:** الكود المعلق يشوش على المطور ولا يخدم أي غرض.

---

## المرحلة 4: الأداء و UX

### 4.1 إضافة Loading States (Skeletons)

**المشكلة:** صفحة المدونة [`blog/index.vue`](../app/pages/blog/index.vue) كانت تعرض صفحة فارغة أثناء تحميل البيانات.

**الحل:** استخدام `status` من `useFetch` لعرض `USkeleton` أثناء التحميل، مع إضافة empty state عند عدم وجود مقالات.

**الملفات المتأثرة:**
- [`app/pages/blog/index.vue`](../app/pages/blog/index.vue)

**السبب:** تحسين تجربة المستخدم بإظهار حالة التحميل بدلاً من صفحة فارغة.

---

### 4.2 إضافة Error Boundary للمقال

**المشكلة:** صفحة المقال [`blog/[slug].vue`](../app/pages/blog/[slug].vue) كانت تعرض صفحة فارغة إذا لم يُعثر على المقال.

**الحل:** إضافة `v-else` مع واجهة 404 تحتوي أيقونة ورسالة "المقال غير موجود" وزر للعودة للمدونة.

**الملفات المتأثرة:**
- [`app/pages/blog/[slug].vue`](../app/pages/blog/[slug].vue)

**السبب:** تجربة مستخدم أفضل عند الوصول لرابط مقال غير صالح.

---

### 4.3 إضافة Pagination للمدونة

**المشكلة:** صفحة المدونة كانت تعرض كل المقالات دفعة واحدة بدون تقسيم.

**الحل:** إضافة `UPagination` مع computed property لتقسيم المقالات (6 مقالات/صفحة).

**الملفات المتأثرة:**
- [`app/pages/blog/index.vue`](../app/pages/blog/index.vue)

**السبب:** تحسين الأداء وتجربة التصفح مع زيادة عدد المقالات.

---

### 4.4 Lazy Loading للمكونات

**المشكلة:** الصفحة الرئيسية تحمّل كل المكونات دفعة واحدة رغم أن بعضها أسفل الصفحة.

**الحل:** استخدام `Lazy` prefix لـ 4 مكونات غير مرئية فوراً:
- `LazyLandingStats`
- `LazyLandingBlog`
- `LazyLandingTestimonials`
- `LazyLandingFAQ`

**الملفات المتأثرة:**
- [`app/pages/index.vue`](../app/pages/index.vue)

**السبب:** تقليل حجم الـ JavaScript المبدئي وتسريع الـ First Paint.

---

### 4.5 تحسين Error Handling في useAPI

**المشكلة:** composable الـ [`useAPI.ts`](../app/composables/useAPI.ts) لم يكن يعالج أخطاء الـ API.

**الحل:** إضافة `onResponseError` handler يعرض toast تلقائياً:
- خطأ 500 → "حدث خطأ في الخادم"
- خطأ 404 → "البيانات المطلوبة غير موجودة"

**الملفات المتأثرة:**
- [`app/composables/useAPI.ts`](../app/composables/useAPI.ts)

**السبب:** إبلاغ المستخدم بالأخطاء بدلاً من الفشل الصامت.

---

### 4.6 تحويل RSS لـ Server Route

**المشكلة:** [`blog.get.js`](../server/api/blog.get.js) كان يكتب ملف RSS مباشرة في مجلد `public/` — مشكلة في بيئات containerized وعند التشغيل read-only.

**الحل:**
1. إنشاء [`server/routes/rss.xml.get.ts`](../server/routes/rss.xml.get.ts) كـ server route مستقل
2. يُرجع RSS XML ديناميكياً مع content-type صحيح و cache-control (10 دقائق)
3. حذف منطق كتابة الملف من `blog.get.js`

**الملفات المتأثرة:**
- [`server/routes/rss.xml.get.ts`](../server/routes/rss.xml.get.ts) — **ملف جديد**
- [`server/api/blog.get.js`](../server/api/blog.get.js) — حذف RSS generation

**السبب:** Server routes أنظف وأكثر موثوقية من الكتابة على الـ filesystem.

---
---

# القسم الثاني: دليل البنية والمعايير

## 1. بنية المجلدات

```
app/
├── assets/css/          # أنماط عامة (Tailwind, typography)
├── components/          # مكونات Vue
│   ├── landing/         # أقسام الصفحة الرئيسية (Hero, About, Stats, FAQ...)
│   ├── blog/            # مكونات المدونة (Sidebar, TOC, Social)
│   ├── sdlc/            # مكونات SDLC الإنجليزية
│   ├── sdlc-ar/         # مكونات SDLC العربية (تلف المكونات الإنجليزية)
│   ├── common/          # مكونات مشتركة (Social links)
│   ├── form/            # مكونات النماذج (File upload)
│   ├── adr/             # مكونات القرارات المعمارية
│   ├── AppHeader.vue    # شريط التنقل
│   ├── AppFooter.vue    # تذييل الصفحة
│   └── ColorModeButton.vue  # زر الوضع الداكن/الفاتح
├── composables/         # Composables لجلب البيانات والمنطق المشترك
├── layouts/             # القوالب (default = header + footer)
├── pages/               # الصفحات (file-based routing)
├── plugins/             # إضافات Nuxt ($api helper)
└── utils/               # أدوات مساعدة (links, clipboard)

server/
├── api/                 # نقاط API (blog proxy, upload, CRUD)
├── routes/              # Server routes (RSS feed)
├── og-image/            # قوالب OG image
└── plugins/             # إضافات الـ server

content/                 # ملفات Markdown (Nuxt Content)
└── mcp/                 # أدلة MCP servers
```

### قاعدة: أين أضع الملف الجديد؟

| نوع الملف | المكان | مثال |
|-----------|--------|------|
| مكون UI | `app/components/{قسم}/` | `landing/NewSection.vue` |
| جلب بيانات | `app/composables/` | `useNewFeature.js` |
| صفحة | `app/pages/` | `new-page.vue` |
| بيانات/ثوابت مشتركة | `app/utils/` | `constants.ts` |
| API endpoint | `server/api/` | `new-endpoint.get.ts` |
| Server route (غير API) | `server/routes/` | `feed.xml.get.ts` |

---

## 2. تدفق البيانات

```
الصفحة (page)
  → Composable (useXxx)
    → useAPI (useFetch wrapper)
      → $api plugin (يضيف baseURL + headers)
        → Backend API الخارجي
```

### المسار الكامل لطلب بيانات:

1. **الصفحة** تستدعي composable: `const { blogs } = useBlog()`
2. **الـ Composable** يستدعي `useAPI('/blogs/all')`
3. **`useAPI`** يستخدم `useFetch` مع `$api` كـ client
4. **`$api` plugin** يضيف `baseURL` من `runtimeConfig.public.baseURL`
5. **الاستجابة** ترجع عبر نفس السلسلة مع error handling تلقائي

### للبيانات الثابتة (بدون API):

```
الصفحة → Composable → return reactive data مباشرة
```

مثال: [`useExperiences.js`](../app/composables/useExperiences.js)، [`useProjects.js`](../app/composables/useProjects.js)

---

## 3. معايير الأمان

### ✅ افعل:
- **استخدم server routes لإخفاء API keys** — أي مفتاح سري يجب أن يكون في `runtimeConfig` (بدون `.public`) ويُستخدم فقط في `server/`
- **نقِّ كل محتوى HTML قبل عرضه** — استخدم `DOMPurify.sanitize()` مع كل `v-html`
- **تحقق من الملفات المرفوعة** — النوع (MIME type) والحجم في الـ server

### ❌ لا تفعل:
- لا تضع API keys أو secrets في `runtimeConfig.public` — ستُكشف في الـ client
- لا تستخدم `v-html` مع محتوى من API بدون sanitization
- لا ترفع ملفات من الـ client مباشرة لخدمات خارجية

### مرجع:
```typescript
// nuxt.config.ts — المفاتيح السرية هنا (server-only)
runtimeConfig: {
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,     // ✅ سري
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  },
  public: {
    baseURL: process.env.BASE_URL,              // ✅ عام — لا يحتوي secrets
  }
}
```

---

## 4. معايير SEO و Structured Data

### ✅ افعل:
- **كل صفحة لازم `useSeoMeta`** — title, description, og:image
- **كل صفحة قائمة (list) لازم `CollectionPage` schema** — مع `ItemList` للعناصر
- **كل مقال/محتوى تقني لازم `TechArticle` أو `Article` schema**
- **كل صفحة فيها FAQ لازم `FAQPage` schema**
- **الصفحة الرئيسية لازم `WebSite` schema**

### ❌ لا تفعل:
- لا تنسى إضافة structured data لأي صفحة جديدة
- لا تكرر schemas — استخدم `useHead` مع `script` type `application/ld+json`

### مثال لإضافة schema لصفحة جديدة:
```typescript
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',  // أو TechArticle, FAQPage, etc.
      'name': 'عنوان الصفحة',
      'url': `${config.public.siteUrl}/page-path`,
      'inLanguage': 'ar'
    })
  }]
})
```

---

## 5. معايير Accessibility

### ✅ افعل:
- **استخدم semantic HTML** — `<nav>` بدلاً من `<div>` للتنقل، `<main>` للمحتوى الرئيسي، `<article>` للمقالات
- **أضف `aria-label`** لكل عنصر تفاعلي (أزرار، قوائم، أقسام)
- **الأرقام/الإحصائيات** لازم `aria-label` يجمع القيمة مع التسمية (مثال: `"5 سنوات خبرة"`)
- **العناصر الزخرفية** لازم `aria-hidden="true"`
- **أضف default value لكل `inject`** — لتجنب أخطاء عند استخدام المكون خارج سياقه

### ❌ لا تفعل:
- لا تستخدم `<div>` لعناصر لها semantic tag مناسب
- لا تترك أزرار أو أيقونات بدون label نصي أو `aria-label`

---

## 6. معايير الأداء و UX

### ✅ افعل:
- **استخدم `Lazy` prefix** للمكونات أسفل الصفحة (below the fold):
  ```html
  <LazyLandingStats />    <!-- بدلاً من <LandingStats /> -->
  ```
- **أضف `USkeleton`** أثناء تحميل البيانات:
  ```html
  <template v-if="status === 'pending'">
    <USkeleton class="h-48 w-full" />
  </template>
  ```
- **أضف empty state** عند عدم وجود بيانات
- **أضف error state** عند فشل الطلب
- **استخدم `UPagination`** للقوائم الطويلة (أكثر من 6 عناصر)
- **استخدم server routes** بدلاً من الكتابة على الـ filesystem

### ❌ لا تفعل:
- لا تعرض صفحة فارغة أثناء التحميل
- لا تتجاهل حالات الخطأ — المستخدم يحتاج feedback
- لا تحمّل كل المكونات دفعة واحدة إذا كانت أسفل الصفحة

---

## 7. معايير جودة الكود

### ✅ افعل:
- **اجمع البيانات المشتركة في `utils/`** — إذا وجدت نفس البيانات في أكثر من مكان، انقلها لـ `utils/` واستورِدها
- **استخدم props لتجنب تكرار المكونات** — إذا مكونين متشابهين 80%+، وحّدهما بـ props
- **احذف الكود المعلق** — إذا لم يعد مستخدماً، احذفه. Git يحفظ التاريخ
- **أضف `onResponseError`** في composables الـ API — لإبلاغ المستخدم بالأخطاء

### ❌ لا تفعل:
- لا تكرر بيانات في أكثر من ملف
- لا تنسخ مكون وتغير النصوص فقط — استخدم props
- لا تترك `console.log` أو كود معلق في الـ production
- لا تكتب ملفات على الـ filesystem من الـ server — استخدم server routes

### مثال: نمط توحيد المكونات المكررة

```vue
<!-- المكون الأساسي — يقبل props -->
<script setup>
defineProps({
  title: { type: String, default: 'English Title' },
  description: { type: String, default: 'English description' }
})
</script>

<!-- المكون العربي — يلف الأساسي بـ props -->
<template>
  <BaseComponent title="عنوان عربي" description="وصف عربي" />
</template>
```

---

## 8. معايير RTL

### القواعد:
- الموقع **عربي أولاً**: `dir="rtl"` و `lang="ar"` على `<html>`
- استخدم `text-right` لمحاذاة النص
- **السهم "للأمام" في RTL** هو `i-lucide-arrow-left` (لأن الاتجاه معكوس)
- استخدم `<UApp :locale="ar">` من `@nuxt/ui/locale`
- الأيقونات تنعكس تلقائياً في RTL — لا تحتاج تعديل

### في الملفات التوثيقية:
- استخدم `<div dir="rtl">` لضمان العرض الصحيح في GitHub

---

## 9. معايير Nuxt UI 4

### الألوان:
- **استخدم ألوان semantic** — `error`, `success`, `warning`, `info`
- **لا تستخدم** أسماء ألوان مباشرة (`red`, `green`, إلخ)

### الأيقونات:
- **الصيغة:** `i-lucide-name` (مثال: `i-lucide-search`)
- **لا تستخدم:** `lucide:name`

### الإشعارات:
```typescript
const toast = useToast()
toast.add({
  title: 'رسالة النجاح',
  color: 'success',   // ✅ semantic
  timeout: 4000
})
```

### المكونات شائعة الاستخدام:

| الغرض | المكون |
|-------|--------|
| تحميل | `<USkeleton>` |
| تقسيم صفحات | `<UPagination>` |
| إشعارات | `useToast()` |
| أيقونات | `<UIcon name="i-lucide-xxx" />` |
| أزرار | `<UButton>` |
| نماذج | `<UForm>` + `<UFormField>` |
| تبديل وضع | `useColorMode()` |

---

## ملخص سريع

| المجال | القاعدة الذهبية |
|--------|----------------|
| الأمان | API keys في الـ server فقط + DOMPurify مع كل v-html |
| SEO | كل صفحة = `useSeoMeta` + JSON-LD schema مناسب |
| Accessibility | Semantic HTML + `aria-label` لكل عنصر تفاعلي |
| الأداء | `Lazy` prefix + `USkeleton` + pagination + error states |
| الكود | لا تكرار + لا كود معلق + بيانات مشتركة في `utils/` |
| RTL | `dir="rtl"` + `text-right` + `arrow-left` = "للأمام" |
| Nuxt UI | ألوان semantic + أيقونات `i-lucide-*` + `useToast()` |

</div>
