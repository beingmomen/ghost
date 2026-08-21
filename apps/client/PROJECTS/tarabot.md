# ترابط | Tarabot

**منصة تربط المتطوعين والمنظمات والداعمين**

## لمحة سريعة

| | |
|---|---|
| **الدور** | مطوّر فردي — الواجهة والـ API |
| **المدة** | شهر واحد |
| **الحالة** | مشروع عميل — سُلّم |
| **التقنيات** | Nuxt 3 · Nuxt UI · Express · MongoDB · JWT · pnpm monorepo |

---

## المشكلة

العمل التطوعي فيه ثلاثة أطراف محتاجين بعض ومش متصلين: منظمات عندها مشاريع ومحتاجة متطوعين ودعم، ومتطوعون بيدوّروا على فرص حقيقية يشاركوا فيها، وداعمون عايزين يوصلوا لمشاريع واضحة يدعموها.

من غير مكان واحد يجمعهم، الطلبات بتضيع ومفيش صورة واضحة لحالة كل مشروع أو مين انضم له.

---

## المنصة

منصة واحدة بتجمع الأطراف الثلاثة: المنظمة بتنشر مشروعها التطوعي، والمتطوع بيقدّم عليه، والداعم بيشوف المشاريع ويدعمها — وكل طلبات الانضمام والدعم بتتدار في مكان واحد بشكل منظّم وشفاف.

المنصة بتدعم كمان **ورش عمل** و**أنواع حسابات متعددة** (متطوع، منظمة، داعم، مدرب) — كل نوع حساب بصلاحياته وواجهته.

---

## البنية

مبني كمونوريبو بـ pnpm workspaces — واجهة Nuxt 3 وAPI بـ Express وMongoDB، بمصادقة JWT.

---

## لقطات الشاشة

4 لقطات، بالترتيب اللي تظهر بيه في الصفحة، مرفوعة على Cloudinary تحت `beingmomen/projects/tarabot/`.

1. **projects-list** — `https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/projects-list`
   alt: قائمة المشاريع التطوعية في منصة ترابط مع اسم المنظمة ومقدار الدعم وعدد المتطوعين وحالة المشروع

2. **project-detail** — `https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/project-detail`
   alt: صفحة مشروع تطوعي في منصة ترابط تعرض الوصف ومقدار الدعم المطلوب وعدد المتطوعين والمنظمة المنفذة وقوائم الداعمين والمتطوعين

3. **join-requests** — `https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/join-requests`
   alt: إدارة طلبات الانضمام في منصة ترابط بأنواع الحسابات (متطوع، منظمة، داعم، مدرب) وحالة كل طلب

4. **workshops** — `https://res.cloudinary.com/dyqfclwdk/image/upload/f_auto,q_auto/beingmomen/projects/tarabot/workshops`
   alt: صفحة ورش العمل في منصة ترابط

---

## الزرار

زرار أساسي بنص "عرض المنصة" يودّي على `https://tarabot.beingmomen.com` في تبويب جديد. بدون زرار ثانوي.
