<div dir="rtl">

# دليل النشر (Deployment) — Beingmomen Monorepo

المشروع `monorepo` فيه 3 تطبيقات (`client`, `server`, `db`) تُنشر **بشكل مستقل** على
**VPS** يعمل عليه **CloudPanel**، عبر **GitHub Actions self-hosted runner** + **PM2** —
بدون Docker وبدون Coolify.

> **ملاحظة تاريخية:** كان النشر سابقاً على **Coolify** (Docker + Traefik). تمّ الانتقال
> إلى **CloudPanel** على VPS منفصل. نسخة Coolify القديمة قد تظل تعمل كـ backup على
> نطاقات `elshatory-*.beingmomen.com` (سيرفر مختلف تماماً، لا يتزاحم مع هذا).

## نظرة عامة

```
git push → main
        │
        ▼ (GitHub Actions — self-hosted runner على الـ VPS)
   .github/workflows/deploy.yml
        │  1. يزامن /root/ghost (git reset --hard origin/main)
        │  2. يكتب apps/*/.env من الـ repository variables
        │  3. ينفّذ scripts/deploy.sh
        ▼
   scripts/deploy.sh  →  يبني التطبيق المتأثّر فقط (بديل watch_paths)، بالتتابع
        │
        ▼
   PM2 (startOrRestart)  →  يشغّل الـ 3 processes ويحفظها (auto-start بعد reboot)
        │
        ▼
   CloudPanel (nginx reverse-proxy) + Let's Encrypt SSL → النطاق العام
```

## التطبيقات والنطاقات

| التطبيق | النطاق | البورت المحلي | PM2 name | Site user (CloudPanel) |
|---------|--------|---------------|----------|------------------------|
| **client** | beingmomen.com | `3000` | `client` | `ghost-web` |
| **server** | api.beingmomen.com | `3001` | `server` | `ghost-api` |
| **db** | db.beingmomen.com | `9122` | `db` | `ghost-db` |

> **لماذا 3001 للـ server؟** البورت الافتراضي `1234` محجوز من مشروع آخر على هذا الـ VPS
> المشترك، فتمّ نقل الـ server إلى `3001` عبر `ecosystem.config.cjs`.

## البنية على السيرفر (VPS)

- **النظام:** Ubuntu 24.04 + CloudPanel، IP: `145.223.33.177`
- **Runtime:** Node.js 24 عبر `nvm` (معزول عن node النظام) + pnpm 10.29.3 (corepack) + PM2
- **الكود:** clone واحد للـ workspace في `/root/ghost` (عبر **SSH deploy key** — read only)
- **الـ processes:** يديرها PM2؛ `pm2 startup` مفعّل ليرجعوا بعد أي reboot

## آلية النشر (تفصيلاً)

1. **Push على `main`** → GitHub يبلّغ الـ **self-hosted runner** المثبّت على الـ VPS
   (كخدمة systemd، `srv635353`).
2. **الـ workflow** ([.github/workflows/deploy.yml](../.github/workflows/deploy.yml)):
   - **Sync:** `cd /root/ghost && git fetch && git reset --hard origin/main`
   - **Env:** يكتب `apps/{client,server,db}/.env` من الـ repository variables
     `CLIENT_ENV_PROD` / `SERVER_ENV_PROD` / `DB_ENV_PROD`
   - **Deploy:** ينفّذ `scripts/deploy.sh` ويمرّر له `BEFORE`/`AFTER`/`EVENT` (سياق git)
3. **[scripts/deploy.sh](../scripts/deploy.sh):**
   - يحدّد التطبيقات المتأثّرة من `git diff` (أو الكل في `workflow_dispatch`)
   - لو تغيّر `pnpm-lock.yaml` → `pnpm install --frozen-lockfile` + يبني الكل
   - يبني ويعيد تشغيل المتأثّر فقط، **بالتتابع** (بناءان Nuxt معاً يستنزفان الرام)
4. **CloudPanel (nginx)** يوجّه النطاق للبورت المحلي ويدير الـ SSL.

> **حرج:** البناء **بالتتابع** (client ثم db ثم server) هو ما يحمي الرام — نفس منطق
> `concurrent_builds = 1` الذي كان في Coolify.

## متغيّرات البيئة

القيم مخزّنة في **GitHub → Settings → Secrets and variables → Actions → Variables**
كثلاثة متغيّرات، كل واحد يحتوي **محتوى ملف `.env` كامل**:

| المتغيّر | التطبيق | مفاتيح مهمة |
|----------|---------|-------------|
| `CLIENT_ENV_PROD` | client | `BASE_URL`, `SITE_URL`, `CLOUDINARY_*` |
| `SERVER_ENV_PROD` | server | `DATABASE_ATLAS`, `JWT_*`, `CLOUDINARY_*` |
| `DB_ENV_PROD` | db | إعدادات الـ dashboard + **`GIGET_AUTH`** |

### نقطتان حرجتان

1. **`BASE_URL` build-time للـ client:** يُخبز في ترويسة الـ CSP وقت البناء. `deploy.sh`
   يعمل `source apps/client/.env` قبل `pnpm build:client`، فلازم يكون في `CLIENT_ENV_PROD`.
2. **`GIGET_AUTH` للـ db:** الـ db يجلب base-layer من ريبو خاص (`beingmomen/base-layer`)
   أثناء التثبيت/البناء. `deploy.sh` يعمل `source apps/db/.env` قبل بناء db.

> **تحسين أمني مقترح:** القيم حالياً **Variables** (مقروءة، تظهر لمن له صلاحية على الريبو).
> يُفضّل نقلها إلى **Secrets** (مشفّرة، مخفية في الـ logs) — خصوصاً `GIGET_AUTH` والـ PAT —
> وتعديل الـ workflow من `vars.` إلى `secrets.`.

## الملفات المسؤولة عن النشر

- [ecosystem.config.cjs](../ecosystem.config.cjs) — تعريف الـ 3 processes لـ PM2 + البورتات
- [scripts/deploy.sh](../scripts/deploy.sh) — بناء وإعادة تشغيل المتأثّر فقط، بالتتابع
- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) — يكتب الـ env ويشغّل deploy.sh

## النشر اليدوي (عند الحاجة)

- **إعادة بناء الكل:** شغّل الـ workflow يدوياً من GitHub → Actions → *Deploy to VPS* →
  **Run workflow** (يمرّر `workflow_dispatch` → يبني الثلاثة).
- **على السيرفر مباشرة:**
  ```bash
  cd /root/ghost && EVENT=workflow_dispatch bash scripts/deploy.sh
  ```

## أوامر PM2 مفيدة (على السيرفر)

```bash
pm2 ls                 # حالة الـ 3 apps
pm2 logs server        # سجل تطبيق (تشخيص الأخطاء)
pm2 restart db         # إعادة تشغيل يدوية
pm2 save               # حفظ الحالة الحالية
```

## الـ Stack الأساسي

- **Runtime:** Node.js 24 (nvm) + pnpm 10.29.3
- **Process manager:** PM2 (systemd startup)
- **Proxy/SSL:** CloudPanel (nginx) + Let's Encrypt
- **CI:** GitHub Actions self-hosted runner (لا GitHub-hosted runners، لا Docker)

</div>
