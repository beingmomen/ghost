---
title: "Filesystem MCP Server"
category: "backend"
installation_method: "cli"
created_at: "2026-03-01"
mcp_config:
  key: "filesystem"
  server:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
---

## ما هو Filesystem MCP Server؟

Filesystem MCP Server يتيح لـ Claude Code قراءة وكتابة الملفات والمجلدات على النظام المحلي. يوفر وصولاً آمناً ومحدوداً للمجلدات المحددة فقط في الإعدادات.

## الأدوات المتاحة

- **read_file** — قراءة محتوى ملف
- **write_file** — كتابة محتوى في ملف
- **list_directory** — عرض محتويات مجلد
- **create_directory** — إنشاء مجلد جديد
- **move_file** — نقل أو إعادة تسمية ملف
- **search_files** — البحث عن ملفات بنمط معين
- **get_file_info** — الحصول على معلومات ملف (الحجم، تاريخ التعديل، الصلاحيات)

## خطوات التثبيت

### 1. التثبيت

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

### 2. إضافة الإعدادات

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/directory"
      ]
    }
  }
}
```

### 3. تعديل المسار

استبدل `/path/to/allowed/directory` بمسار المجلد الفعلي الذي تريد السماح بالوصول إليه.

### 4. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "اقرأ محتوى ملف package.json"
- "أنشئ مجلد جديد باسم utils"
- "ابحث عن جميع ملفات .vue في المشروع"
- "انقل الملف من src إلى dist"
- "اعرض معلومات ملف index.ts"

## ملاحظات

- يسمح بالوصول فقط للمجلدات المحددة في الإعدادات — آمن بالتصميم.
- يدعم القراءة والكتابة والبحث والنقل.
- مفيد لمهام إدارة الملفات وسير عمل تحرير الكود.
- يمكن تحديد عدة مجلدات بإضافة مسارات متعددة في الـ args.
