# my-feature workspace

> ملف إعدادات بيقرأه كل أوضاع my-feature — اتكتب بواسطة /my-init في 2026-07-07.
> لو شكل المشروع اتغيّر، شغّل /my-init تاني لتحديثه.

- **الشكل:** workspace متعدد المشاريع (3 apps تحت `apps/`) + ريبو شقيق واحد مؤكَّد
  على الديسك (`my-base-layer`) بتمتد عليه ميزات `apps/db`.

## المشاريع

| المشروع | المسار | الـ stack | Plan/ |
|---|---|---|---|
| client | ./apps/client | Nuxt 4 + Nuxt UI 4 + Tailwind v4 (SSR portfolio، عربي RTL) | ./apps/client/Plan/ (يتعمل عند أول استخدام) |
| server | ./apps/server | Express.js 4 + Mongoose/MongoDB (REST API، factory pattern) | ./apps/server/Plan/ (يتعمل عند أول استخدام) |
| db | ./apps/db | Nuxt 4 + Nuxt UI 4 (dashboard، بيمدّ my-base-layer) | ./apps/db/Plan/ (يتعمل عند أول استخدام) |

## الريبوهات الشقيقة (خارج الـ monorepo)

| الريبو | المسار المحلي | الـ stack | العلاقة |
|---|---|---|---|
| my-base-layer | F:\Code\personal\Temp\my-base-layer | Nuxt Layer (Nuxt 4 + Nuxt UI 4 + Vue 3) | مصدر الحقيقة لـ `apps/db`: components/composables/layouts/services المشتركة. ميزات `apps/db` غالباً بتلمسه. Plan/ يتعمل عند أول استخدام. |

## المصادر المرجعية

مفيش جدول «التقنية → المصدر المرجعي» صريح في الـ CLAUDE.md، فدي المصادر المكتشفة:

- **Nuxt (client / db / base-layer):** MCP server `nuxt-remote` (https://nuxt.com/mcp) + `context7`.
- **Nuxt UI 4 (client / db / base-layer):** MCP server `nuxt-ui-remote` (https://ui.nuxt.com/mcp).
- **Base layer components/composables (db):** اقرأ المصدر الفعلي في `F:\Code\personal\Temp\my-base-layer`
  قبل استخدام أي `Base*` أو composable — ده مصدر الحقيقة (منصوص عليه في `apps/db/CLAUDE.md`).
- **Express / Mongoose (server):** `context7` + التوثيق الرسمي.
- **الـ deployment / infra:** MCP servers `coolify` و`github` و`hostinger-*`.
- **سكيلز مشروع db** (تنطبق على ملفات تحت `apps/db/` فقط): `senior-architect`, `senior-frontend`,
  `senior-fullstack`, `senior-security`, `frontend-design`, `ui-design-system`, `apps/db:ui-ux-pro-max`.
- **مرجع Nuxt Layers:** `F:\Code\personal\Temp\my-base-layer\docs\nuxt-layers-guide.md`.

> ملاحظة: كل مشروع عنده `CLAUDE.md` خاص بيه (`apps/*/CLAUDE.md`) + الروت `CLAUDE.md` —
> دي المرجع الأساسي للـ conventions والـ deployment.

## قواعد الخطط هنا

- الميزة اللي بتلمس أكتر من مشروع (زي feature في `apps/db` بتحتاج تعديل في `my-base-layer`،
  أو تدفق client↔server) → ملف خطة لكل مشروع/ريبو بنفس الـ slug والتاريخ، مربوطين بالـ linking header.
- سجل المراجعة (`*.review-log.md`) بيتكتب جنب ملف الخطة في المشروع اللي المراجعة اتشغّلت منه.
- المسارات النسبية للحاجات جوّه الـ monorepo؛ المسار المطلق (`F:\…`) للريبو الشقيق بس.

<!-- ## جلسات الأدوات
وضع /my-tools بيسجّل هنا نتايج جلسات اكتشاف الـ skills (✅ اتثبت / ⏳ مؤجّل /
❌ مرفوض بالسبب) — القسم بيتعمل مع أول جلسة، مش هنا. -->
