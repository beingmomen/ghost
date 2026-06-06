<div dir="rtl">

# دليل النشر (Deployment) — Beingmomen Monorepo

شرح كامل لعملية النشر. المشروع `monorepo` فيه 3 تطبيقات (`client`, `server`, `db`)
كل واحد يُنشر **بشكل مستقل** على منصة **Coolify** (مستضافة ذاتياً على VPS) باستخدام
**Docker**، عبر **الـ Auto-Deploy المدمج في Coolify** (GitHub App webhook) — بدون
GitHub Actions.

## نظرة عامة

```
git push → main
        │
        ▼ (webhook من الـ GitHub App)
Coolify
        │
        ├─ Watch Paths  ← أي تطبيق اتغيّر؟ (مضبوطة لكل تطبيق)
        │
        ▼ (البناءات تُصفّ في طابور: concurrent_builds = 1)
   بناء Docker image → تشغيل الحاوية
        │
        ▼
Traefik (reverse proxy) + Let's Encrypt SSL → النطاق العام
```

| التطبيق | المسار | النطاق | الـ Stack | UUID (Coolify) |
|---------|--------|--------|-----------|----------------|
| **client** | `apps/client` | elshatory-web.beingmomen.com | Nuxt 4 (portfolio) | `q6fhf875uc3gkeufyhm65t6e` |
| **server** | `apps/server` | elshatory-api.beingmomen.com | Express.js (REST API) | `u1180x2bduzvavpdq8suq4tm` |
| **db** | `apps/db` | elshatory-db.beingmomen.com | Nuxt 4 (admin dashboard) | `hf5pu8txoa6tkkjqhzegjlrm` |

- **المصدر (Source):** GitHub App خاص باسم `comfortable-capuchin-z122lc1l6`
  (`app_id: 3676122`) موصول بالريبو `beingmomen/ghost` على الفرع `main`.

---

## كيف يعمل النشر

1. **Push على `main`** → الـ GitHub App يرسل webhook إلى Coolify.
2. **Watch Paths** — Coolify يفحص أي تطبيق تأثّر، ولا يُعيد بناء إلا المتأثّر:

   | التطبيق | watch_paths |
   |---------|-------------|
   | `client` | `apps/client` + `pnpm-lock.yaml` |
   | `db` | `apps/db` + `pnpm-lock.yaml` |
   | `server` | `apps/server` + `pnpm-lock.yaml` |

   > `pnpm-lock.yaml` يُشغّل **الثلاثة** لأنه مشترك على مستوى الـ workspace.
3. **طابور البناء** — لو تأثّر أكثر من تطبيق، يُصفّون في طابور ويُبنون **واحداً تلو
   الآخر** لأن إعداد السيرفر `concurrent_builds = 1`. هذا يمنع تشغيل بناءين Nuxt
   معاً (كل واحد يحتاج ~4GB RAM) فيستنفدان ذاكرة الـ VPS.
4. **Traefik** يوجّه النطاق ويُدير شهادة SSL تلقائياً.

> **حرج:** `concurrent_builds = 1` هو ما يحمي الـ VPS من نفاد الذاكرة. لا ترفعه.
> هذا الإعداد يحلّ محلّ الترتيب المتسلسل الذي كان يفرضه GitHub Actions سابقاً.

---

## بناء Docker لكل تطبيق

عند الـ trigger، Coolify يبني الـ image حسب `Dockerfile` كل تطبيق:

### server — [apps/server/Dockerfile](../apps/server/Dockerfile)
الأبسط (Express): صورة واحدة، `pnpm install --prod`، يشغّل `server.js` على port **1234**.

### client — [apps/client/Dockerfile](../apps/client/Dockerfile)
multi-stage (Nuxt):
- `deps`: يثبّت `python3 make g++` (مطلوبة لـ `better-sqlite3`)
- `builder`: يستقبل build args (`BASE_URL`, `SITE_URL`, `CLOUDINARY_*`) ويبني بـ heap = 4GB
- `runner`: صورة نظيفة فيها `.output` فقط، port **3000**، heap = 2GB

### db — [apps/db/Dockerfile](../apps/db/Dockerfile)
multi-stage (Nuxt) مع ميزة خاصة: يستقبل `GIGET_AUTH` كـ build arg لجلب الـ
base layer من GitHub الخاص أثناء البناء.

---

## نقطتان حرجتان في متغيّرات البيئة

### 1. متغيّرات البناء (build-time) في الـ client
`nuxt.config.ts` يخبز `BASE_URL` داخل ترويسة الـ CSP (`connect-src`) **وقت
البناء**. لو ضبطتها runtime-only في Coolify، المتصفح سيحجب كل نداءات الـ API.
لازم تُضبط **build-time + runtime**:
`BASE_URL`, `SITE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_URL`.

### 2. `GIGET_AUTH` في الـ db
لازم build-time، وإلا فشل البناء لأنه لا يقدر يجلب الـ base layer.

---

## النشر اليدوي (عند الحاجة)

بدائل لتشغيل deploy دون انتظار push:

- **زر Deploy في لوحة Coolify** — التطبيق → Deploy.
- **Deploy Webhook / API:**
  ```bash
  curl -X GET "https://coolify.beingmomen.com/api/v1/deploy?uuid=<APP_UUID>" \
    -H "Authorization: Bearer $COOLIFY_TOKEN"
  ```

---

## الـ Stack الأساسي

- **Runtime**: Node.js 24 (see `.nvmrc`) + pnpm 10.29.3
- **Proxy**: Traefik + Let's Encrypt (SSL تلقائي)
- **Platform**: Coolify (مستضاف ذاتياً) على `coolify.beingmomen.com`

</div>
