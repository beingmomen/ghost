---
title: "Nuxt"
category: "frontend"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "nuxt"
  server:
    type: "http"
    url: "https://nuxt.com/mcp"
---

## ما هو Nuxt MCP Server؟

Nuxt MCP Server يوفر لـ Claude Code وصولاً مباشراً لتوثيقات Nuxt الرسمية، الـ modules، أدلة الـ deployment، ومقالات المدونة — كل ذلك محدّث ودقيق.

## الأدوات المتاحة

### التوثيقات
- **get-documentation-page** — جلب محتوى صفحة توثيق محددة
- **list-documentation-pages** — عرض جميع صفحات التوثيق المتاحة
- **get-getting-started-guide** — جلب دليل البدء السريع

### الـ Modules
- **list-modules** — عرض جميع modules الـ Nuxt مع إمكانية التصفية والترتيب
- **get-module** — جلب تفاصيل module محدد (README، التوافق، الإحصائيات)

### الـ Deployment
- **list-deploy-providers** — عرض جميع منصات الـ deployment المتاحة
- **get-deploy-provider** — جلب تعليمات deployment لمنصة محددة

### المدونة
- **list-blog-posts** — عرض جميع مقالات المدونة
- **get-blog-post** — جلب محتوى مقال محدد

## خطوات التثبيت

### 1. التثبيت عبر CLI

```bash
claude mcp add --transport http nuxt https://nuxt.com/mcp
```

### 2. أو الإضافة يدوياً

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "nuxt": {
      "type": "http",
      "url": "https://nuxt.com/mcp"
    }
  }
}
```

### 3. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "اعرض توثيقات الـ composables في Nuxt 4"
- "ما هي الـ modules المتاحة للـ authentication؟"
- "كيف أعمل deploy على Vercel؟"
- "اعرض آخر مقالات مدونة Nuxt"
- "ما الجديد في Nuxt 4؟"

## ملاحظات

- يعمل عبر HTTP بدون حاجة لتثبيت أي حزم.
- يدعم توثيقات Nuxt 3.x و 4.x.
- يوفر معلومات محدّثة مباشرة من الموقع الرسمي.
- مفيد جداً عند تطوير تطبيقات Nuxt للحصول على أحدث الممارسات.
