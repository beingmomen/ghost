---
title: "Exa"
category: "ai"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "exa"
  server:
    type: "http"
    url: "https://mcp.exa.ai/mcp"
---

## ما هو Exa MCP Server؟

Exa هو محرك بحث مدعوم بالذكاء الاصطناعي يتيح لـ Claude Code البحث في الإنترنت والحصول على معلومات محدّثة، أكواد، توثيقات، وأمثلة برمجية مباشرة.

## الأدوات المتاحة

### البحث في الويب
- **web_search_exa** — البحث في الويب عن أي موضوع والحصول على محتوى نظيف وجاهز للاستخدام
- **get_code_context_exa** — البحث عن أمثلة أكواد وتوثيقات وحلول برمجية من GitHub و Stack Overflow والتوثيقات الرسمية

## خطوات التثبيت

### 1. التثبيت عبر CLI

```bash
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

### 2. أو الإضافة يدوياً

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

### 3. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "ابحث عن أحدث توثيقات Nuxt 4"
- "ابحث عن أمثلة كود لـ Vue 3 Composition API"
- "ما هي آخر أخبار التقنية اليوم؟"
- "ابحث عن حل لمشكلة CORS في Express.js"

## ملاحظات

- لا يحتاج إلى API key — يعمل مباشرة عبر HTTP.
- يوفر محتوى نظيف ومحسّن للاستخدام مع الـ LLMs.
- يدعم البحث العام والبحث المتخصص في الأكواد.
