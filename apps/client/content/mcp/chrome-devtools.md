---
title: "Chrome DevTools"
category: "devops"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "chrome-devtools"
  server:
    command: "npx"
    args: ["-y", "chrome-devtools-mcp@latest"]
---

## ما هو Chrome DevTools MCP Server؟

Chrome DevTools MCP Server يتيح لـ Claude Code التفاعل مع متصفح Chrome مباشرة — التنقل بين الصفحات، فحص العناصر، تنفيذ JavaScript، تحليل الأداء، مراقبة الشبكة، والتقاط screenshots.

## الأدوات المتاحة

### التنقل والصفحات
- **navigate_page** — التنقل إلى URL أو الرجوع أو التقدم أو إعادة التحميل
- **new_page** — فتح صفحة جديدة
- **list_pages** — عرض جميع الصفحات المفتوحة
- **select_page** — اختيار صفحة كسياق للأوامر
- **close_page** — إغلاق صفحة

### التفاعل مع العناصر
- **click** — الضغط على عنصر في الصفحة
- **hover** — التمرير فوق عنصر
- **fill** — ملء حقل إدخال أو textarea
- **fill_form** — ملء عدة حقول في form دفعة واحدة
- **drag** — سحب عنصر وإفلاته على عنصر آخر
- **press_key** — الضغط على مفتاح أو تركيبة مفاتيح
- **type_text** — كتابة نص في عنصر مُركّز عليه
- **upload_file** — رفع ملف عبر عنصر input

### اللقطات والفحص
- **take_snapshot** — أخذ لقطة نصية للصفحة بناءً على شجرة الـ accessibility
- **take_screenshot** — التقاط screenshot للصفحة أو عنصر محدد
- **evaluate_script** — تنفيذ كود JavaScript في الصفحة

### الشبكة والـ Console
- **list_network_requests** — عرض جميع طلبات الشبكة
- **get_network_request** — الحصول على تفاصيل طلب شبكة محدد
- **list_console_messages** — عرض رسائل الـ console
- **get_console_message** — الحصول على تفاصيل رسالة console محددة

### الأداء والمحاكاة
- **performance_start_trace** — بدء تسجيل trace للأداء
- **performance_stop_trace** — إيقاف تسجيل الـ trace
- **performance_analyze_insight** — تحليل insight محدد من نتائج الـ trace
- **emulate** — محاكاة ميزات مثل dark mode والـ viewport والـ network conditions
- **resize_page** — تغيير حجم الصفحة
- **take_memory_snapshot** — التقاط heap snapshot لتحليل الذاكرة

### الحوارات
- **handle_dialog** — التعامل مع الـ dialogs (alert، confirm، prompt)
- **wait_for** — الانتظار حتى ظهور نص معين في الصفحة

## خطوات التثبيت

### 1. إضافة الإعدادات

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest"
      ]
    }
  }
}
```

### 2. تشغيل Chrome مع الـ Debugging

شغّل Chrome مع تفعيل remote debugging:

```bash
google-chrome --remote-debugging-port=9222
```

### 3. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "افتح الصفحة http://localhost:3000 وخذ screenshot"
- "اضغط على زر تسجيل الدخول"
- "اعرض طلبات الشبكة الفاشلة"
- "شغّل trace للأداء وحلّل النتائج"
- "اعرض رسائل الـ console errors"
- "حاكي وضع الـ dark mode"

## ملاحظات

- يحتاج إلى تشغيل Chrome مع `--remote-debugging-port=9222`.
- يدعم التفاعل الكامل مع الصفحة (نقر، كتابة، سحب).
- مفيد جداً لاختبار الـ UI وتحليل الأداء وتصحيح الأخطاء.
