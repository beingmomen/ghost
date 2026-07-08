<div dir="rtl">

# Handoff — نشر Monorepo/تطبيقات على CloudPanel VPS عبر GitHub Actions + PM2

> **الغرض:** دليل قابل للنسخ لتكرار **نفس بنية النشر** على أي مشروع آخر (تطبيق واحد أو
> عدة تطبيقات — 2 / 3 / 4… حسب الحاجة)، **بدون Docker وبدون Coolify**.
> مبني على تجربة فعلية (مشروع `Beingmomen`: client Nuxt + server Express + db Nuxt).
> الأهم فيه: **قسم «المشاكل والحلول»** في الآخر — اقرأه قبل ما تبدأ عشان توفّر ساعات.

---

## 0. الخلاصة في سطر واحد

```
git push → main
   └─▶ GitHub Actions (self-hosted runner على الـ VPS نفسه)
         1. git reset --hard origin/main            (يزامن الكود)
         2. يكتب apps/*/.env من repository variables (الأسرار)
         3. bash scripts/deploy.sh                   (يبني المتأثّر فقط، بالتتابع)
              └─▶ PM2 startOrRestart                 (يشغّل ويحفظ الـ processes)
                    └─▶ CloudPanel (nginx reverse-proxy) + Let's Encrypt SSL → النطاق العام
```

**المبدأ:** كل app بروسيس Node مستقل على **بورت محلي**، وCloudPanel يعمل **reverse-proxy**
من النطاق العام إلى البورت المحلي. **لا static hosting** — كله SSR/Node خلف PM2.

---

## 1. المتطلبات

- **VPS** عليه **CloudPanel** مثبّت (Ubuntu 22.04/24.04)، مع صلاحية `root` أو sudo.
- **نطاق (Domain)** أو أكثر — واحد لكل app تريد تعريضه للعامة (مثلاً `app.example.com`،
  `api.example.com`). الـ DNS (سجل A) يشير إلى IP الـ VPS.
- **GitHub repo** (خاص أو عام) فيه الكود. إن كان monorepo، كل app في `apps/<name>/`.
- **معرفة بورت حر** لكل app على الـ VPS (تحقق بـ `ss -tlnp` — انظر مشكلة #2).

> **مهم لو الـ VPS مشترك مع مشاريع أخرى:** البورتات الشائعة (`3000`, `1234`, `8080`…) قد
> تكون محجوزة. اختَر بورتات فارغة **وثبّتها** في `ecosystem.config.cjs`.

---

## 2. الإعداد خطوة بخطوة

### 2.1 تجهيز الـ VPS (مرة واحدة)

```bash
# Node عبر nvm (معزول عن node النظام) — استخدم نفس نسخة .nvmrc في مشروعك
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24 && nvm alias default 24

# pnpm عبر corepack (يطابق نسخة packageManager في package.json)
corepack enable
corepack prepare pnpm@10.29.3 --activate

# PM2 (مدير الـ processes)
npm i -g pm2
```

### 2.2 جلب الكود على الـ VPS

اختر مساراً ثابتاً (مثلاً `/root/<project>`). استخدم **SSH deploy key (read-only)**
للريبو الخاص:

```bash
ssh-keygen -t ed25519 -C "vps-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub     # ← أضِفه في GitHub repo → Settings → Deploy keys (read-only)

git clone git@github.com:<owner>/<repo>.git /root/<project>
cd /root/<project> && pnpm install --frozen-lockfile
```

> الـ workflow لاحقاً سيعمل `git reset --hard origin/main` في هذا المسار، فتأكد أنه
> clone صحيح على فرع `main`.

### 2.3 تثبيت الـ self-hosted runner (كخدمة systemd)

من GitHub: **repo → Settings → Actions → Runners → New self-hosted runner** (Linux x64)،
واتبع الأوامر المعروضة، ثم ثبّته **كخدمة** (تعمل بعد أي reboot):

```bash
mkdir -p /root/actions-runner && cd /root/actions-runner
# … curl + tar + ./config.sh (من صفحة GitHub، فيها التوكن المؤقت) …
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status        # تأكد أنه Active
```

> الـ runner labels الافتراضية `self-hosted, linux` — الـ workflow يعتمد عليها في
> `runs-on: [self-hosted, linux]`.

### 2.4 إنشاء site لكل app في CloudPanel (reverse-proxy + SSL)

لكل app تريد تعريضه:

1. CloudPanel → **Add Site → Reverse Proxy**.
2. Domain: `app.example.com` — Reverse proxy URL: `http://127.0.0.1:<PORT>` (بورت الـ app).
3. بعد الإنشاء: **SSL/TLS → Let's Encrypt → Issue** (شهادة تلقائية).

> **تنظيف مهم (مشكلة #9):** CloudPanel قد ينشئ الـ site بـ `root` يشير لمجلد `htdocs`
> فارغ + محاولة `try_files` قبل الـ proxy. تأكد أن إعداد nginx **reverse-proxy نظيف**:
> `location / { proxy_pass http://127.0.0.1:<PORT>; }` بدون طبقة static وسيطة.

### 2.5 الملفات الثلاثة داخل الريبو

انسخ القوالب من **قسم 3** إلى جذر الريبو:
`ecosystem.config.cjs` · `scripts/deploy.sh` · `.github/workflows/deploy.yml`
(عدّل أسماء الـ apps والبورتات).

### 2.6 أسرار البيئة (Repository Variables)

**GitHub → repo → Settings → Secrets and variables → Actions**. أنشئ **متغيّراً واحداً
لكل app**، محتواه **ملف `.env` كامل**:

| المتغيّر | يُكتب إلى | ملاحظات |
|----------|----------|---------|
| `<APP>_ENV_PROD` | `apps/<app>/.env` | كل مفاتيح الـ app |

> **Variables مقابل Secrets:** الـ **Variables** مقروءة (تظهر لمن له صلاحية على الريبو).
> أي توكن حساس (PAT, `GIGET_AUTH`, مفاتيح DB) **يُفضّل بشدة** وضعه كـ **Secret** (مشفّر،
> مخفي في الـ logs) وتغيير الـ workflow من `vars.` إلى `secrets.`.

### 2.7 تثبيت PM2 على الإقلاع (بعد أول نشر)

```bash
pm2 startup systemd        # ينفّذ الأمر الذي يطبعه
pm2 save                   # يحفظ الـ processes الحالية لتعود بعد reboot
```

### 2.8 أول نشر

- إمّا `git push` على `main`، أو **Actions → Deploy → Run workflow** (يدوي).
- **`workflow_dispatch` يبني كل الـ apps** (مفيد لأول مرة). راجع مشكلة #13.

---

## 3. القوالب الجاهزة (Templates)

> استبدل الـ placeholders: `<project>` (اسم مجلد الكلون)، `<app>` (اسم كل تطبيق)،
> `<PORT>` (بورت محلي حر لكل app).

### 3.1 `ecosystem.config.cjs` (جذر الريبو)

كتلة واحدة لكل app. **تطبيقات Nuxt/Nitro** تشغّل `.output/server/index.mjs`؛
**تطبيق Express/Node-API** يشغّل ملف الدخول مباشرة (`server.js`).

```js
const ROOT = '/root/<project>'

module.exports = {
  apps: [
    {
      name: 'client',                              // ← Nuxt/Nitro app
      cwd: `${ROOT}/apps/client`,
      script: '.output/server/index.mjs',
      env: { PORT: 3000, NODE_OPTIONS: '--max-old-space-size=2048' }
    },
    {
      name: 'server',                              // ← Express/Node API (لا build)
      cwd: `${ROOT}/apps/server`,
      script: 'server.js',
      env: { PORT: 3001 }                          // بورت حر (تجنّب المحجوز — مشكلة #2)
    }
    // كرّر الكتلة لكل app إضافي ببورت فريد
  ]
}
```

### 3.2 `scripts/deploy.sh` (جذر الريبو)

يبني **المتأثّر فقط**، **بالتتابع**. لكل app: عرّف نوعه (Nuxt = build، Express = restart فقط).

```bash
#!/usr/bin/env bash
set -euo pipefail

export HOME="${HOME:-/root}"        # ← حرج: خدمة الـ runner تبدأ بلا HOME (مشكلة #1)
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BEFORE="${BEFORE:-}"
AFTER="${AFTER:-$(git rev-parse HEAD)}"
EVENT="${EVENT:-manual}"

# push عادي → فرق الملفات؛ أي شيء آخر (workflow_dispatch/أول مرة) → ابنِ الكل
if [ "$EVENT" != "push" ] || [ -z "$BEFORE" ] || echo "$BEFORE" | grep -qE '^0+$'; then
  CHANGED="ALL"
else
  CHANGED="$(git diff --name-only "$BEFORE" "$AFTER" 2>/dev/null || echo ALL)"
fi
echo "changed: $CHANGED"

BUILD_ALL=0
if [ "$CHANGED" = "ALL" ] || echo "$CHANGED" | grep -q '^pnpm-lock.yaml$'; then
  pnpm install --frozen-lockfile
  BUILD_ALL=1
fi
want() { [ "$BUILD_ALL" = 1 ] || echo "$CHANGED" | grep -q "^$1/"; }

# ── Nuxt app: يحتاج build. مصدر .env قبل البناء لو فيه متغيّرات build-time (CSP/توكنات) ──
if want apps/client; then
  echo "== build client =="
  set -a; . apps/client/.env; set +a          # BASE_URL يُخبز في CSP وقت البناء (مشكلة #5)
  NODE_OPTIONS=--max-old-space-size=4096 pnpm build:client
  pm2 startOrRestart ecosystem.config.cjs --only client --update-env
fi

# ── Express/Node API: بلا build، إعادة تشغيل فقط (مشكلة #3) ──
if want apps/server; then
  echo "== restart server (no build) =="
  pm2 startOrRestart ecosystem.config.cjs --only server --update-env
fi

# مثال app خاص يحتاج توكن وقت البناء (private layer):
# if want apps/db; then
#   set -a; . apps/db/.env; set +a            # GIGET_AUTH لجلب base-layer خاص (مشكلة #6)
#   NODE_OPTIONS=--max-old-space-size=4096 pnpm build:db
#   pm2 startOrRestart ecosystem.config.cjs --only db --update-env
# fi

pm2 save
echo "== deploy done =="
```

> **حرج (مشكلة #4):** بناءان Nuxt معاً يستنزفان الرام (كل واحد ~4GB heap). ابنِ
> **بالتتابع دائماً** — لا `&` ولا parallel.

### 3.3 `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
  workflow_dispatch: {}          # ← تشغيل يدوي = يبني الكل (مشكلة #13)

concurrency:                     # لا تشغّل نشرين معاً (الرام)
  group: deploy-vps
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: [self-hosted, linux]
    steps:
      - name: Sync repo on server
        run: |
          cd /root/<project>
          git fetch origin main
          git reset --hard origin/main

      - name: Write env files from repository variables
        env:
          CLIENT_ENV: ${{ vars.CLIENT_ENV_PROD }}
          SERVER_ENV: ${{ vars.SERVER_ENV_PROD }}
        run: |
          printf '%s' "$CLIENT_ENV" > /root/<project>/apps/client/.env
          printf '%s' "$SERVER_ENV" > /root/<project>/apps/server/.env

      - name: Build & restart changed apps
        env:
          BEFORE: ${{ github.event.before }}
          AFTER: ${{ github.sha }}
          EVENT: ${{ github.event_name }}
        run: bash /root/<project>/scripts/deploy.sh
```

---

## 4. ⚠️ المشاكل والحلول (اقرأه — ده أهم قسم)

| # | المشكلة | العَرَض | الحل |
|---|---------|--------|------|
| **1** | **`HOME` غير معرّف في الـ runner** | `deploy.sh` يفشل بـ `HOME: unbound variable` (مع `set -u`) لأن خدمة systemd تبدأ بلا HOME | `export HOME="${HOME:-/root}"` **أول سطر** في deploy.sh (قبل `nvm.sh`) |
| **2** | **تعارض بورت على VPS مشترك** | `EADDRINUSE` عند إقلاع الـ process (بورت محجوز من مشروع آخر) | تحقق بـ `ss -tlnp \| grep <port>`، اختَر بورتاً حراً، وثبّته في `ecosystem.config.cjs` |
| **3** | **بناء تطبيق Express** | `pnpm build:server` يفشل (cp same-file) — Express لا يُبنى | احذف خطوة الـ build له؛ شغّل `server.js` مباشرة عبر PM2 (restart فقط) |
| **4** | **بناءان Nuxt معاً يستنزفان الرام** | الـ VPS يتجمّد/يُقتل الـ build (OOM) — كل Nuxt build ~4GB | ابنِ **بالتتابع** في deploy.sh (client ثم db…)، لا parallel. اضبط `NODE_OPTIONS=--max-old-space-size` |
| **5** | **`BASE_URL` يُخبز وقت البناء (CSP)** | استدعاءات المتصفح للـ API يحجبها الـ CSP بعد النشر | `set -a; . apps/client/.env; set +a` **قبل** `pnpm build:client` — والمتغيّر لازم يكون في `<APP>_ENV_PROD` |
| **6** | **توكن لجلب تبعية خاصة وقت البناء** | build يفشل بجلب private layer/package (مثل `GIGET_AUTH`) | مصدر `.env` الخاص بالـ app قبل بنائه (`set -a; . apps/db/.env; set +a`)، والتوكن في متغيّر البيئة |
| **7** | **CloudPanel default site = static فارغ** | يظهر لبس «static ولا Node؟»، أو صفحة فارغة/404 | نظّف nginx لـ **reverse-proxy بحت**: `location / { proxy_pass 127.0.0.1:<PORT>; }`. مجلد `htdocs` يفضل فارغاً — كله Node/SSR خلف PM2 |
| **8** | **إعادة النشر لا تُعيد البناء** | push بلا تغيير في مجلد الـ app لا يعيد بناءه (يعتمد `git diff BEFORE AFTER`) | لإجبار بناء كامل: **Actions → Run workflow** (workflow_dispatch → يبني الكل)، أو على السيرفر: `EVENT=workflow_dispatch bash scripts/deploy.sh` |
| **9** | **الـ runner لا يعمل بعد reboot** | النشر يتوقف بعد إعادة تشغيل الـ VPS | ثبّت الـ runner **كخدمة**: `sudo ./svc.sh install && ./svc.sh start`. وللـ PM2: `pm2 startup && pm2 save` |
| **10** | **SWR cache يقدّم صفحة خطأ قديمة** | إصلاح لا يظهر لأن Nuxt يخدم نسخة SWR مكاش (dقائق/ساعة) | قلّل `swr` في `routeRules` (مثلاً `60`) أثناء التطوير/التشخيص، أو أعد بناء نظيفاً |
| **11** | **(محلي/dev) قفل Nuxt** | `Another Nuxt dev is already running` | `NUXT_IGNORE_LOCK=1 pnpm dev`، أو اقتل الـ process العالق |
| **12** | **(محلي/dev) كاش `.nuxt` قديم** | تعديل composable/config لا يظهر رغم restart (HMR لم يلتقطه) | `rm -rf apps/<app>/.nuxt` ثم أعد `pnpm dev`. **dev-only** — لا يحدث في production build نظيف |

### تفاصيل إضافية مهمة

- **`git reset --hard origin/main` يمسح أي تعديل محلي على السيرفر** — لا تعدّل الكود يدوياً
  على الـ VPS؛ كل التعديلات تمرّ عبر git.
- **الأسرار غير المرفوعة لا تُنشر:** الـ `workflow_dispatch` يبني من `origin/main`. لو عدّلت
  كوداً محلياً، **لازم commit + push** قبل ما النشر يشوفه.
- **build-time مقابل runtime env:** المتغيّرات التي تُخبز وقت البناء (CSP، توكنات الجلب) لازم
  تُصدَّر **قبل** `pnpm build`. متغيّرات الـ runtime (البورت…) تُقرأ وقت التشغيل من PM2 env.
- **selective deploy يعتمد على مسارات الملفات:** `deploy.sh` يبني app لو تغيّر أي ملف تحت
  `apps/<app>/`. تغيير `pnpm-lock.yaml` → `pnpm install` + بناء الكل.

---

## 5. ✅ Checklist التحقق بعد النشر

على السيرفر:
```bash
pm2 ls                                   # كل الـ apps = online
curl -I http://127.0.0.1:<PORT>          # كل app يرد محلياً
```
من الخارج:
```bash
curl -I https://app.example.com          # 200 + SSL شغّال
curl -sI https://app.example.com | grep -i x-powered-by   # يؤكد Node/SSR (مش static)
```
في GitHub: **Actions → آخر run = ✅ success**.

---

## 6. أوامر PM2 مفيدة (على السيرفر)

```bash
pm2 ls                 # حالة كل الـ apps
pm2 logs <app>         # سجل app معيّن (تشخيص أخطاء الإقلاع)
pm2 restart <app>      # إعادة تشغيل يدوية
pm2 save               # حفظ الحالة (بعد أي تغيير دائم)
```

---

## 7. ملخص «افعل / لا تفعل»

**افعل:**
- بورت فريد لكل app + ثبّته في `ecosystem.config.cjs`.
- ابنِ Nuxt apps **بالتتابع**؛ اضبط `--max-old-space-size`.
- `export HOME` أول deploy.sh.
- ثبّت الـ runner و PM2 **كخدمات** تعود بعد reboot.
- مصدر `.env` قبل البناء لأي متغيّر build-time.

**لا تفعل:**
- لا تبنِ تطبيقين Nuxt معاً (OOM).
- لا تبنِ تطبيق Express (شغّله مباشرة).
- لا تعدّل الكود يدوياً على السيرفر (يُمسح بـ `git reset --hard`).
- لا تضع بورتاً محجوزاً.
- لا تنسَ `commit + push` قبل توقّع ظهور تعديلاتك على live.

</div>
