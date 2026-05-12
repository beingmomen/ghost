---
title: "Context7"
category: "other"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "context7"
  server:
    type: "http"
    url: "https://mcp.context7.com/mcp"
---

## ما هو Context7 MCP Server؟

Context7 يوفر لـ Claude Code توثيقات محدّثة وأمثلة أكواد لأي مكتبة أو framework برمجي. بدلاً من الاعتماد على معلومات قديمة، يجلب Context7 أحدث التوثيقات مباشرة.

## الأدوات المتاحة

- **resolve-library-id** — البحث عن مكتبة والحصول على الـ library ID المتوافق مع Context7
- **query-docs** — جلب التوثيقات وأمثلة الأكواد المحدّثة لأي مكتبة

## خطوات التثبيت

### 1. إضافة الإعدادات

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### 2. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "اجلب توثيقات Nuxt 4 عن الـ composables"
- "أريد أمثلة كود لـ Tailwind CSS v4"
- "اعرض توثيقات React hooks"
- "كيف أستخدم Pinia مع TypeScript؟"

## ملاحظات

- يدعم آلاف المكتبات والـ frameworks.
- يوفر أمثلة أكواد جاهزة للاستخدام.
- المعلومات محدّثة دائماً ولا تعتمد على بيانات قديمة.
- لا يحتاج إلى API key للاستخدام الأساسي.
