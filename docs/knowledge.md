# معرفة المشروع: Beingmomen

هذا الملف مصدر معرفة المشروع لكل الأدوات (Claude Code وCodex وOpenCode وAntigravity). نُقل من ذاكرة Claude الخاصة بتاريخ 2026-11-02 بعد تصنيفها، ولا يحتوي أسرارًا (القيم الحساسة حُذفت وعليها علامة `secret omitted`).
أي حقيقة جديدة تؤثر على الكود أو المراجعة تُضاف هنا لحظة اكتشافها، لا إلى ذاكرة أي أداة.
بند يحمل رابط «التفصيل» فيه نص كامل منقول من الذاكرة؛ اقرأه عند العمل على الموضوع نفسه.

## قواعد عمل وأعراف خاصة بالمشروع

### لا تشيل طبقات الـ Hero الزخرفية
- لا تقترح إزالة طبقات Hero الزخرفية (mesh / dot grid / grain / glow) بحجة AI slop، لأنها تصميم مقصود.
- لا تقدّم توصية بصرية قبل رؤية الـ render فعلاً.
- **السبب:** المستخدم رفض الإزالة قبل كده، وDESIGN.md:217 بيقول نفس الكلام.
- المصدر: ذاكرة Claude (`feedback_dont_reflex_strip_decor.md`)، آخر تعديل غير معروف

### اشتغل في برانش ومتعملش commit
- كل تغيير في برانش وصفي جديد (`git checkout -b`).
- متعملش `git commit` ولا `git add`؛ سيب التعديلات unstaged للمستخدم يراجعها.
- قاعدة الـ no-commit موجودة في القاعدة العامة ("Never commit unless asked")؛ قاعدة البرانش لأ، فلازم تتضاف للقواعد العامة.
- المصدر: ذاكرة Claude (`feedback_git_workflow.md`)، آخر تعديل غير معروف

## حقائق وقرارات المشروع

### ربط agents/skills/commands/mcp بالـ API متوقف
- ربط صفحات agents/skills/commands/mcp بالـ Backend API متوقف بقرار المستخدم — لا تقترحه.
- الـ root CLAUDE.md بيعرض الـ migration كـ«خطوات مطلوبة» (قسم Architecture Migration) ومحتاج يتحدّث بحالة «متوقف».
- **السبب:** المستخدم أجّل الشغل إلى أجل غير مسمى.
- المصدر: ذاكرة Claude (`project_migration_paused.md`)، آخر تعديل غير معروف

### موضوع: apps/server: إنتاج Atlas بس، الفحوص in-memory
- ملاحظة: apps/server فيه `DATABASE_ATLAS` (إنتاج) بس؛ server.js بيتصل بيه مباشرة، ومفيش DB محلي للفحص.
- أي فحص in-memory: `validateSync()` للـ models، و`require('./app')` (app.js مش بيتصل) مع فحص `router.stack`.
- أي فحص محتاج DB أو Cloudinary يتسجل «مُرحَّل للمستخدم» في الخطة.
- ملاحظة: apps/server/CLAUDE.md:26 وREADME.md:90 لسه بيذكروا متغيّر `DATABASE` محلي.
- المصدر: ذاكرة Claude (`project_server_no_local_db.md`)، آخر تعديل غير معروف

## نُقل من ذاكرة Claude بتاريخ 2026-11-03

### موضوع: تشغيل ومراقبة deploy الـVPS عبر GitHub API
- ملاحظة: fine-grained GitHub PAT مخزّن في متغيّر بيئة User اسمه `GH_TOKEN` (يتقرأ بـ`[Environment]::GetEnvironmentVariable('GH_TOKEN','User')` في PowerShell). صلاحياته على ريبو `beingmomen/ghost` بس: Actions RW وContents RW وMetadata؛ مفيش صلاحية Variables (قراءة `*_ENV_PROD` ترجع 403)
- ملاحظة: `gh` مش متثبّت فاستخدم REST: ليست الـruns `GET /repos/beingmomen/ghost/actions/runs`؛ تشغيل يدوي (يبني الكل clean، `CHANGED=ALL`) `POST .../actions/workflows/deploy.yml/dispatches` بـbody `{"ref":"main"}`؛ لوج run `GET .../actions/runs/<id>/logs` (zip)
- ملاحظة: الـdeploy بيشتغل على push لـmain (selective) أو workflow_dispatch
- المصدر: ذاكرة Claude (`reference_github_deploy_access.md`)، آخر تعديل غير معروف

### موضوع: تأطير المشروع في البورتفوليو
- عبدالمؤمن Frontend Engineer (تموضعه الرسمي في `shared/identity.ts`) لكن شغله الفعلي أوسع: بيبني مشاريع كاملة (backend وfrontend) بـNestJS وExpress وNode، وبعضها ما كتبش فيه سطر كود بإيده؛ هو بيعمل الـarchitecture والتخطيط والمراجعة والـAI بينفذ، وده سبب استثماره في أدوات التخطيط (`my-feature` وPlan/ وسجلات المراجعة)
- ما تفترضش إن شغله فرونت إند بس. عند عرض ده في البورتفوليو فرّق بين «الـAI عمل المشروع» (تأطير بيأذيه) و«أنا صمّمت وقُدت التنفيذ» (الحقيقة)
- المصدر: ذاكرة Claude (`user_ai_led_delivery.md`)، آخر تعديل غير معروف
