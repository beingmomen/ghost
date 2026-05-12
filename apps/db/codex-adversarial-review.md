# Codex Adversarial Review

**التاريخ**: 2026-04-12
**الهدف**: الفرق بين branch `claude` وـ `main` (27 ملف، 1424 إضافة)
**الحكم**: `needs-attention` — **لا يجب الإطلاق (No-ship)**

> "The new job-search flow loses the run it just started, and the jobs list can query itself into an empty state by default."

---

## المشكلتان الحرجتان

### 1. [high] البيانات المُخزَّنة لتشغيل البحث بشكل خاطئ وبدون polling

**الملف**: `app/composables/modules/job-search/index.js:7-14`

`runSearch` يُسنِد `latestRun` إلى `result.data` مباشرة، لكن الـ backend يُرجع الـ run تحت `data.run`، وينشئه بحالة `pending` ثم تنتقل للخلفية إلى `running` ثم لحالة نهائية.

**النتيجة العملية**:
- `latestRun.value?.status` يكون `undefined` فوراً بعد الإرسال
- بطاقة الحالة تستقبل الـ wrapper object بدل الـ run الفعلي
- حارس الإرسال لا يعتبر الـ run النشط نشطاً
- تشغيلات crawler مكلفة ومتكررة
- تغذية راجعة فارغة للمستخدم
- لا طريقة لرؤية الاكتمال دون تحديث الصفحة يدوياً

**التوصية**:
1. فك الـ wrapper: `result.data.run` بدل `result.data`
2. معالجة `pending` و`running` كحالات نشطة في حارس الإرسال
3. إضافة حارس in-flight داخل `runSearch` لمنع التكرار
4. Polling كل 3-5 ثواني حتى `completed` / `partial` / `failed`، مع فك الـ wrapper في كل استجابة

---

### 2. [high] قائمة الوظائف ترسل فلاتر فارغة تُعامَل كفلاتر exact-match

**الملف**: `app/pages/jobs/index.vue:10-16`

طلب `/jobs` يُرسل دائماً `source`، `status`، `seniority`، و`keyword` حتى حين تكون الـ refs مُهيَّأة بقيمة فارغة `''`. الـ backend يُرشِّح ليزيل فقط `page`، `sort`، `limit`، `fields`، و`search`، فتصبح هذه المفاتيح الفارغة فلاتر Mongo من قبيل:
```
source: ''
status: ''
```
علاوة على ذلك، `keyword` ليس حقلاً في نموذج Job أصلاً.

**النتيجة العملية**:
- الصفحة الافتراضية وإعادة تعيين الفلاتر قد تُرجع **صفر وظائف** حتى لو كانت الوظائف موجودة في قاعدة البيانات
- البحث النصي لن يعمل

**التوصية**:
1. بناء الـ query من `activeFilters` computed الذي يحتوي القيم غير الفارغة فقط
2. حذف القيم الفارغة كلياً قبل الإرسال للـ backend
3. تعيين حقل البحث النصي إلى `search` المدعوم من الـ backend (أو إضافة دعم للاسم المختار)

---

## الخطوات المقترحة

1. إصلاح `app/composables/modules/job-search/index.js` — فك الـ wrapper + polling loop
2. إصلاح `app/pages/jobs/index.vue` — تصفية الفلاتر الفارغة + تصحيح اسم حقل البحث
