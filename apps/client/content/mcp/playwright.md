---
title: "Playwright"
category: "other"
installation_method: "cloud code"
created_at: "2026-03-02"
mcp_config:
  key: "playwright"
  server:
    command: "npx"
    args: ["-y", "@playwright/mcp@latest"]

---

## ما هو Playwright MCP Server؟

Playwright MCP Server يتيح لـ Claude Code التحكم في متصفح ويب بشكل آلي — التنقل بين الصفحات، التفاعل مع العناصر، ملء النماذج، التقاط screenshots، وتشغيل اختبارات الـ UI.

## الأدوات المتاحة

### التنقل
- **browser_navigate** — التنقل إلى URL
- **browser_navigate_back** — الرجوع للصفحة السابقة
- **browser_tabs** — إدارة الـ tabs (عرض، إنشاء، إغلاق، اختيار)
- **browser_wait_for** — الانتظار حتى ظهور نص أو مرور وقت محدد

### التفاعل مع العناصر
- **browser_click** — الضغط على عنصر
- **browser_hover** — التمرير فوق عنصر
- **browser_type** — كتابة نص في عنصر
- **browser_fill_form** — ملء عدة حقول form دفعة واحدة
- **browser_select_option** — اختيار خيار من dropdown
- **browser_press_key** — الضغط على مفتاح
- **browser_drag** — سحب وإفلات بين عنصرين
- **browser_file_upload** — رفع ملف أو عدة ملفات

### اللقطات والتقييم
- **browser_snapshot** — أخذ لقطة accessibility للصفحة (أفضل من screenshot)
- **browser_take_screenshot** — التقاط screenshot للصفحة أو عنصر
- **browser_evaluate** — تنفيذ كود JavaScript في الصفحة

### الشبكة والـ Console
- **browser_network_requests** — عرض جميع طلبات الشبكة
- **browser_console_messages** — عرض رسائل الـ console

### أخرى
- **browser_handle_dialog** — التعامل مع الـ dialogs
- **browser_resize** — تغيير حجم نافذة المتصفح
- **browser_close** — إغلاق الصفحة
- **browser_install** — تثبيت المتصفح المطلوب
- **browser_run_code** — تشغيل كود Playwright مباشرة

## خطوات التثبيت

### 1. التثبيت عبر CLI

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

### 2. أو الإضافة يدوياً

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

### 3. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتطبيق التغييرات.

## أمثلة على الاستخدام

- "افتح http://localhost:3000 واختبر صفحة تسجيل الدخول"
- "خذ screenshot للصفحة الرئيسية"
- "املأ form التواصل وأرسله"
- "اضغط على كل رابط في الـ navbar وتحقق من عدم وجود أخطاء"
- "اعرض رسائل الـ console errors في الصفحة"

## ملاحظات

- يفتح متصفح حقيقي ويتفاعل معه بشكل آلي.
- يدعم Chromium و Firefox و WebKit.
- مثالي لاختبار الـ UI والتحقق من سلوك الصفحات.
- الـ snapshot (لقطة الـ accessibility) أفضل من الـ screenshot للتفاعل مع العناصر.
