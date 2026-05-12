---
title: "DeepGraph Vue MCP"
category: "frontend"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "DeepGraph Vue MCP"
  server:
    command: "npx"
    args: ["-y", "mcp-code-graph@latest", "vuejs/core"]
---

## ما هو DeepGraph Vue MCP Server؟

DeepGraph Vue MCP يوفر لـ Claude Code تحليلاً عميقاً لكود Vue.js الأساسي عبر بناء graph للكود. يتيح البحث الدلالي، تحليل الـ dependencies، واستكشاف الكود بطريقة ذكية.

## الأدوات المتاحة

### استكشاف الكود
- **get-code** — جلب الكود الكامل لـ function أو class أو method محدد
- **find-direct-connections** — استكشاف العلاقات المباشرة لأي functionality في الكود
- **folder-tree-structure** — عرض هيكل المجلدات والملفات

### البحث
- **nodes-semantic-search** — البحث الدلالي عن functionalities باستخدام وصف بالـ natural language
- **docs-semantic-search** — البحث في التوثيقات باستخدام الـ semantic similarity

### تحليل الـ Dependencies
- **get-usage-dependency-links** — تحليل شامل للـ dependencies وتأثير التغييرات على الكود

## خطوات التثبيت

### 1. التثبيت التلقائي

```bash
npx claude-code-templates@latest --mcp=deepgraph/deepgraph-vue --yes
```

### 2. أو الإضافة يدوياً

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "DeepGraph Vue MCP": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-code-graph@latest",
        "vuejs/core"
      ]
    }
  }
}
```

### 3. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "ابحث عن كود الـ reactivity system في Vue"
- "اعرض الـ dependencies لـ function معينة"
- "ما هي الـ functions التي تتأثر إذا غيّرت هذا الكود؟"
- "ابحث عن كيفية عمل الـ virtual DOM في Vue"
- "اعرض هيكل مجلد src/runtime"

## ملاحظات

- يحلل كود repository الـ `vuejs/core` بالكامل.
- يدعم البحث الدلالي بالـ natural language.
- مفيد لفهم بنية Vue.js الداخلية وتحليل التأثيرات.
- يبني graph كامل للكود مع العلاقات بين الـ functions والـ classes.
