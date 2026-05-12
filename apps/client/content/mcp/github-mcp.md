---
title: "GitHub MCP Server"
category: "devops"
installation_method: "cloud code"
created_at: "2026-03-01"
mcp_config:
  key: "github"
  server:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_PERSONAL_ACCESS_TOKEN}"
---

## ما هو GitHub MCP Server؟

GitHub MCP Server يتيح لـ Claude Code التفاعل مباشرة مع GitHub — إدارة الـ repositories، الـ issues، الـ pull requests، الـ branches، البحث في الكود، والمزيد، كل ذلك من خلال المساعد الذكي.

## الأدوات المتاحة

### Repositories
- **search_repositories** — البحث عن repositories في GitHub
- **create_repository** — إنشاء repository جديد
- **fork_repository** — عمل fork لـ repository في حسابك
- **get_file_contents** — الحصول على محتوى ملف أو مجلد من repository
- **create_or_update_file** — إنشاء أو تحديث ملف واحد
- **push_files** — رفع عدة ملفات في commit واحد
- **create_branch** — إنشاء branch جديد
- **list_commits** — عرض الـ commits على branch معين

### Issues
- **list_issues** — عرض وتصفية الـ issues في repository
- **get_issue** — الحصول على تفاصيل issue معين
- **create_issue** — إنشاء issue جديد
- **update_issue** — تحديث issue موجود
- **add_issue_comment** — إضافة تعليق على issue
- **search_issues** — البحث في الـ issues و pull requests

### Pull Requests
- **list_pull_requests** — عرض وتصفية الـ PRs
- **get_pull_request** — الحصول على تفاصيل PR
- **create_pull_request** — إنشاء PR جديد
- **merge_pull_request** — دمج PR (عبر merge أو squash أو rebase)
- **get_pull_request_files** — عرض الملفات المتغيرة في PR
- **get_pull_request_status** — الحصول على حالة الـ status checks لـ PR
- **get_pull_request_comments** — الحصول على تعليقات المراجعة
- **get_pull_request_reviews** — الحصول على مراجعات الـ PR
- **create_pull_request_review** — إرسال مراجعة PR (approve أو request changes أو comment)
- **update_pull_request_branch** — تحديث branch الـ PR بآخر التغييرات من الـ base branch

### Code & Users
- **search_code** — البحث في الكود عبر repositories في GitHub
- **search_users** — البحث عن مستخدمين في GitHub

## خطوات التثبيت

### 1. إنشاء GitHub Personal Access Token

1. اذهب إلى [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2. اضغط على **Generate new token (classic)**.
3. أعطه اسم وصفي (مثلاً `claude-code-mcp`).
4. اختر الصلاحيات التالية:

| Scope | الوصف |
|-------|-------|
| `repo` | صلاحية كاملة على الـ repositories (قراءة، كتابة، حذف) |
| `read:org` | قراءة عضوية الـ organization |
| `read:user` | قراءة بيانات الملف الشخصي |
| `user:email` | الوصول لعناوين البريد الإلكتروني |
| `read:project` | قراءة لوحات المشاريع |

5. اضغط **Generate token** وانسخ الـ token فوراً.

### 2. حفظ الـ Token

أضف الـ token إلى ملف بيئة Claude Code:

```bash
echo 'GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here' >> ~/.claude/.env
```

### 3. إضافة إعدادات الـ MCP

أضف التالي إلى ملف `.mcp.json` في جذر المشروع:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

أو التثبيت عبر CLI:

```bash
claude mcp add github npx @modelcontextprotocol/server-github -e GITHUB_PERSONAL_ACCESS_TOKEN="${GITHUB_PERSONAL_ACCESS_TOKEN}"
```

### 4. إعادة تشغيل Claude Code

أعد تشغيل Claude Code لتحميل إعدادات الـ MCP server الجديدة.

## أمثلة على الاستخدام

بعد التثبيت، يمكنك أن تطلب من Claude Code:

- "أنشئ issue جديد في الـ repo عن مشكلة تسجيل الدخول"
- "اعرض جميع الـ pull requests المفتوحة"
- "ابحث عن كود الـ authentication في الـ repositories"
- "أنشئ pull request من feature-branch إلى main"
- "راجع آخر PR ووافق عليه"
- "اعمل fork لهذا الـ repository في حسابي"
- "ما الملفات المتغيرة في PR #42؟"

## استكشاف الأخطاء

### تحذير: Missing environment variables
تأكد أن الـ token موجود في `~/.claude/.env`:

```bash
cat ~/.claude/.env | grep GITHUB
```

إذا كان فارغاً، أضفه:

```bash
echo 'GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here' >> ~/.claude/.env
```

### الـ Token منتهي الصلاحية أو غير صالح
أنشئ token جديد من [GitHub Settings](https://github.com/settings/tokens) وحدّث ملف `~/.claude/.env`.

### أخطاء Permission denied
تأكد أن الـ token يملك الصلاحيات المطلوبة (`repo`، `read:org`، `read:user`). يمكنك التحقق من صلاحيات الـ token في [GitHub Settings > Tokens](https://github.com/settings/tokens).

## ملاحظات

- يعمل مع الـ repositories العامة والخاصة.
- الـ token يُحفظ محلياً ولا يُرسل لأي طرف ثالث.
- استخدم fine-grained tokens لصلاحيات أكثر دقة إن أردت.
- حدود الاستخدام تعتمد على خطة GitHub الخاصة بك (5,000 طلب/ساعة للمستخدمين المصادق عليهم).
