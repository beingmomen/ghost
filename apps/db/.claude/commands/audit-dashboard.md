# 📊 Dashboard Audit — Nuxt 4 + Nuxt UI + NuxtHub

You are a Senior Frontend Engineer specializing in Nuxt 4, Vue 3, Nuxt UI, and NuxtHub.
Your task is to perform a **comprehensive and detailed audit** of this Dashboard / Admin Panel project and produce a full report in Arabic.

---

## 🧠 Project Context — Read This First

- **Framework:** Nuxt 4 (new `app/` directory structure)
- **UI Library:** Nuxt UI (use its components and theme system in all recommendations)
- **Backend/Hosting:** NuxtHub (Cloudflare Workers, D1, KV, Blob, Cache)
- **Language:** JavaScript as the primary language — TypeScript is used **only** in:
  - `nuxt.config.ts`
  - `app.config.ts`
  - `utils/` files that are written once and rarely changed
  - Other static config files
- **Components, Composables, Pages:** Pure JavaScript (`<script setup>`)
- **Project Type:** Dashboard / Admin Panel / Panel System — runs behind an authentication layer
- **SEO:** Not a priority (pages are behind login) — Security, Performance, and UX are the top priorities

---

## 📂 Step 1 — Map the Project Structure

Before any analysis, do the following:

1. Read the full directory structure
2. Read `nuxt.config.ts`, `app.config.ts`, and `package.json`
3. Understand the authentication system in use (Nuxt Auth, custom JWT, session-based, etc.)
4. Identify existing user roles if any
5. Understand the core data model (what are the main entities)
6. Read `CLAUDE.md` if it exists

---

## 🔍 Audit Dimensions

### 1. 🔐 Security & Authentication — Highest Priority

**A. Authentication System**
- How is the session or token stored? (localStorage? httpOnly cookie? — httpOnly is safer)
- Is the token refreshed before it expires?
- Is there a mechanism to log out from all devices?
- When the session expires, is the user redirected to the login page correctly?
- Is the password reset flow secure and time-limited?

**B. Authorization & RBAC**
- Does every page in `pages/` have `definePageMeta({ middleware: ['auth'] })` or equivalent?
- Are there sensitive pages without any protection?
- Are roles validated on the server routes as well (not just the frontend)?
- Can a regular user access another user's data? (Broken Object Level Authorization)
- Are admin routes protected by a separate middleware?

**C. Server Routes Security (NuxtHub)**
- Does every endpoint in `server/api/` verify authentication before any operation?
- Are `hubDatabase()` queries safe from SQL injection? Do they use prepared statements?
- Is `hubBlob()` upload restricted by file type and file size?
- Is there rate limiting on sensitive endpoints (login, password reset)?
- Do error messages avoid leaking sensitive info (database structure, stack traces)?

**D. Data Leakage**
- Are sensitive variables in `runtimeConfig.public` instead of the private section?
- Are API keys or secrets hardcoded directly in source files?
- Is sensitive data printed via `console.log` (passwords, tokens, PII)?
- Is the `.env` file committed to the repo?

**E. Sessions and Cookies**
- Do sensitive cookies have `httpOnly: true`, `secure: true`, `sameSite: 'strict'`?
- Is there CSRF protection for forms?

---

### 2. 🛡️ Access Control

- Audit every page in `app/pages/` and determine who can access it
- Is the middleware properly preventing unauthorized access?
- Are UI elements (buttons, menus, tabs) hidden based on role?
- Does hiding a UI element also block the corresponding API call server-side?
- Can a regular user directly call admin API endpoints from the browser?

---

### 3. ⚡ Performance — Dashboard Context

**A. Large Data Tables**
- Are data-heavy tables using virtual scrolling?
- Is pagination done server-side or client-side (all data downloaded at once)?
- Are sorting and filtering done on the server?
- What is the maximum number of rows displayed? Is that reasonable?

**B. Real-time Data**
- If polling is used — what is the interval? Is it reasonable?
- Does polling stop when the tab is closed or the user is inactive?
- For WebSockets — is the connection closed on component unmount?

**C. Charts and Visualizations**
- Are chart libraries loaded with lazy loading?
- Do charts re-render unnecessarily when unrelated state changes?
- Is heavy chart data processed on the server?

**D. Caching**
- Are API responses for rarely-changing data cached?
- Is `hubCache()` from NuxtHub used for expensive queries?
- Are computed results (aggregations, statistics) cached?

**E. Bundle Size**
- Are there code-split bundles per dashboard section?
- Is each section loaded only when visited (route-based splitting)?

---

### 4. 🏗️ Architecture & Scalability

**A. File Structure**
- Does the structure follow Nuxt 4 `app/` directory correctly?
- Are features organized in logical folders (feature-based or type-based)?
- Are there components that are too large and need splitting? (single file over 300 lines)

**B. State Management (Pinia)**
- Are there clear Pinia stores for each domain?
- Do stores mix responsibilities? (one store doing everything)
- Is store data cleared on logout? (previous user's data must not appear for the next)
- Do store actions handle errors and notify the UI?
- Does each store have a `$reset()` where needed?

**C. Composables**
- Are API calls placed in composables rather than directly in components?
- Does each composable do one specific thing?
- Are there duplicate composables solving the same problem?

**D. Server Routes**
- Is `server/api/` organized to reflect business domains?
- Are shared utility functions extracted into `server/utils/`?

---

### 5. 📊 Forms & Validation

**A. Validation**
- Do all forms validate input before submission?
- Is a validation library used (VeeValidate, Zod integration)?
- Is validation also performed on the server (not just the client)?
- Are error messages clear and close to the affected field?

**B. Form UX**
- Is the submit button disabled during loading to prevent double submission?
- Is there a clear success message after saving?
- Does the form warn the user if they try to leave with unsaved changes?
- Do large forms have auto-save or draft functionality?

**C. Nuxt UI Forms**
- Are `<UForm>`, `<UFormField>`, and `<UInput>` used correctly?
- Is the validation schema integrated with `<UForm>`?

---

### 6. 📡 Real-time & Data Fetching

**A. Data Fetching Patterns**
- Is the choice between `useAPI`, `useAsyncData`, and `$fetch` appropriate?
- Dashboard data is mostly client-side — is `server: false` used correctly?
- Are fetch calls parallelized instead of sequential where possible?

**B. Optimistic UI**
- For frequent actions (toggle, update status) — does the UI update immediately before the API response?
- Is there a rollback if the API call fails?

**C. NuxtHub Data**
- Are `hubDatabase()` queries optimized? Are there indexes where needed?
- Are heavy queries cached with `hubCache()`?
- Is `hubKV()` used for session data or settings?

---

### 7. 🎨 Nuxt UI — Dashboard Usage Review

**Core Dashboard Components:**
- `<UTable>` — used correctly? Are columns clearly defined?
- `<UDashboardLayout>` and `<UDashboardPanel>` — is the layout organized?
- `<UCommandPalette>` — available for power users?
- `<UNotifications>` — is the notification system configured?
- `<UModal>` and `<USlideOver>` — used instead of new pages where appropriate?
- `<UDropdown>` and `<UContextMenu>` — are actions well organized?

**Theme:**
- Does `app.config.ts` define consistent colors and typography for the dashboard?
- Does dark mode work correctly across all components?
- Are there custom components that duplicate what Nuxt UI already provides?

---

### 8. 🧹 Code Quality — JavaScript Focus

- Is ESLint configured with `@nuxt/eslint`?
- Are there leftover `console.log` calls, especially ones printing user data?
- Is there duplicated logic, especially in similar CRUD operations?
- Are there components that are too large and need splitting?
- Are there magic strings (status codes, role names written directly)?
- Are async operations missing try/catch?
- Are event listeners or intervals missing cleanup in `onUnmounted`?

---

### 9. ❌ Error Handling — Dashboard Context

- Does every API call have a visible error state in the UI?
- Do error messages help the user understand what happened?
- Do 401 errors (expired session) automatically redirect to login?
- Do 403 errors (unauthorized) display a clear message?
- Are network errors (offline) handled?
- Are form submission errors clearly shown to the user?
- Do server routes return consistent, structured error responses?

---

### 10. 🔔 Notifications & User Feedback

- Does every action (save, delete, update) give immediate user feedback?
- Are toast notifications configured with Nuxt UI?
- Are success and failure messages visually distinct?
- Are loading states present for every heavy action?
- Are confirmation dialogs present for destructive actions (delete)?

---

### 11. 🔷 TypeScript/JavaScript Quality in Config Files

**For TypeScript files only (config and utils):**
- Is `nuxt.config.ts` well organized and documented?
- Do `utils/` files have clear JSDoc comments?
- Are utils pure and testable (no side effects)?
- Are return types explicit in util functions?

---

### 12. 🧪 Testability

- Is business logic in composables rather than components (easier to test)?
- Are there any tests at all? (vitest, Playwright)
- Are critical paths tested (login, logout, CRUD operations)?
- Do server routes have unit tests?

---

### 13. 📱 Responsive Design

Dashboard panels on mobile and tablet:
- Does the layout adapt to smaller screens?
- Do tables have horizontal scroll on mobile?
- Does the sidebar convert to a mobile menu?
- Are forms usable on touch devices?

---

### 14. 📊 Dependency Analysis

Inspect `package.json` and look for:
- Packages that are many major versions behind
- Unused packages
- Conflicting packages or duplicates solving the same problem
- Nuxt modules that are incompatible with Nuxt 4
- Packages with known security vulnerabilities (CVEs)

---

## 📋 Issue Report Format

For every issue found, report it using this exact structure:

```
### [CATEGORY] — [SEVERITY] — [Short Issue Name]

**📍 Location:** `path/to/file.vue` line X

**❓ Problem:**
Clear and detailed description in Arabic.

**💥 Impact:**
What happens because of this issue? What is the effect on security, the user, or the project?

**🔬 How to verify manually:**
Step-by-step instructions the developer can follow to see the issue themselves:
1. Open the browser and go to ...
2. Open DevTools → Network Tab
3. Do ...
4. Notice that ...

**✅ Available Solutions:**

Solution 1 — [Name]:
[code or steps]

Solution 2 — [Name]:
[code or steps]

**⭐ Recommended solution for this project:**
Explain why this solution is the best fit for this dashboard, considering it uses JavaScript (not TypeScript), Nuxt UI, and NuxtHub.

**🔗 References:**
- [Source Name](URL)
- [Source Name](URL)
```

**Severity Levels:**
- 🔴 **Critical** — Security vulnerability or issue that blocks functionality
- 🟠 **High** — Major impact on security or performance
- 🟡 **Medium** — Moderate impact on experience or code quality
- 🟢 **Low** — Minor improvement
- 💡 **Suggestion** — Optional enhancement

---

## 📊 Final Report

After completing all dimensions, write:

### Executive Summary
- **Overall Project Health Score:** X/100
- **Critical Issues 🔴:** X
- **High Issues 🟠:** X
- **Medium Issues 🟡:** X
- **Low Issues 🟢:** X
- **Suggestions 💡:** X

### Score Per Dimension
| Dimension | Score | Status |
|-----------|-------|--------|
| Security & Authentication | X/10 | 🔴/🟠/🟡/🟢 |
| Access Control | X/10 | |
| Performance | X/10 | |
| Architecture | X/10 | |
| Forms & Validation | X/10 | |
| Error Handling | X/10 | |
| Code Quality | X/10 | |
| Nuxt UI | X/10 | |
| Responsive Design | X/10 | |
| Dependencies | X/10 | |

### 🚨 Top 5 Security Issues to Fix Immediately
**In a dashboard, security is always the first priority.**
Ordered by severity and impact.

### ⚡ Quick Wins — Under 30 Minutes
Simple fixes with high impact.

### 🏗️ Long-Term Architecture Recommendations
Structural improvements for scalability and maintainability.

### ✅ Strengths
What is already working well in the project.

---

## 💾 Saving the Report

**Important — after completing the full report:**

Save the report as a Markdown file at:
```
audit/dashboard-audit-[YYYY-MM-DD]-[HH-MM].md
```

Example: `audit/dashboard-audit-2025-01-15-14-30.md`

- Create the `audit/` folder if it does not exist
- Use today's actual date and current time
- **Write the entire report in Arabic** — technical terms (useAPI, composables, hubDatabase, RBAC, etc.) stay in English as-is
- Include all issues, recommendations, code examples, and references

---

## ⚙️ Hard Constraints — Always Follow These

1. **Security first** — in a dashboard, any security issue is automatically 🔴 Critical
2. **Never suggest TypeScript** for JavaScript files (composables, pages, components) — only for config files and utils
3. **Always use Nuxt UI components** in any solution that involves UI — do not suggest other UI libraries
4. **Always consider NuxtHub** for anything related to database, storage, and caching
5. **Nuxt 4 only** — do not suggest patterns that belong to Nuxt 3
6. **Remember:** hiding a UI element is never enough — real protection must be enforced on the server
7. **Primary references:** Nuxt docs, Vue docs, Nuxt UI docs, NuxtHub docs, OWASP for security

Start now by reading the project structure, then go through each dimension one by one.