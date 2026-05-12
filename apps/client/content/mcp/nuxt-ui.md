---
title: "Nuxt UI"
category: "frontend"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "nuxt-ui"
  server:
    type: "http"
    url: "https://ui.nuxt.com/mcp"
---

## ما هو Nuxt UI MCP Server؟

Nuxt UI MCP Server يوفر لـ Claude Code وصولاً مباشراً لتوثيقات Nuxt UI الرسمية — جميع الـ components، الـ props، الـ slots، الـ events، أمثلة الأكواد، وإعدادات الـ theme.

## الأدوات المتاحة

### الـ Components
- **list-components** — عرض جميع الـ components المتاحة مع تصنيفاتها
- **get-component** — جلب توثيقات component محدد (الاستخدام، أمثلة، API، theme)
- **get-component-metadata** — جلب metadata تفصيلية لـ component (props، slots، events)
- **search-components-by-category** — البحث عن components حسب التصنيف أو النص

### التوثيقات والأمثلة
- **list-documentation-pages** — عرض جميع صفحات التوثيق
- **get-documentation-page** — جلب محتوى صفحة توثيق محددة
- **list-examples** — عرض جميع أمثلة الـ UI المتاحة
- **get-example** — جلب كود مثال محدد

### الـ Composables والقوالب
- **list-composables** — عرض جميع الـ composables المتاحة
- **list-templates** — عرض جميع القوالب المتاحة
- **get-template** — جلب تفاصيل قالب محدد

### أخرى
- **list-getting-started-guides** — عرض أدلة البدء السريع
- **get-migration-guide** — جلب دليل الترقية (v3 أو v4)

## خطوات التثبيت

### 1. التثبيت عبر CLI

```bash
claude mcp add --transport http nuxt-ui https://ui.nuxt.com/mcp
```

### 2. أو الإضافة يدوياً

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "nuxt-ui": {
      "type": "http",
      "url": "https://ui.nuxt.com/mcp"
    }
  }
}
```

### 3. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "اعرض جميع الـ components في فئة form"
- "ما هي الـ props المتاحة لـ UButton؟"
- "أريد مثال على استخدام UTable مع pagination"
- "كيف أخصص theme الـ UCard؟"
- "ما الجديد في Nuxt UI v4؟"

## ملاحظات

- يعمل عبر HTTP بدون حاجة لتثبيت أي حزم.
- يوفر أكثر من 125 component جاهز للاستخدام.
- يدعم Tailwind CSS v4 و الـ theming المتقدم.
- مفيد جداً عند بناء واجهات مستخدم بـ Nuxt UI للحصول على الاستخدام الصحيح.
