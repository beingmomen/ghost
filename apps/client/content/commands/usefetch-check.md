---
title: "usefetch-check"
description: "Enforce useFetch/useLazyFetch architectural rules — scan codebase and report violations"
created_at: "2026-03-02"
---

````bash
---
allowed-tools: Grep, Read, Glob
description: Enforce useFetch/useLazyFetch architectural rules — scan codebase and report violations
---

# useFetch Setup Enforcer

Scan the entire codebase for `useFetch(` and `useLazyFetch(` occurrences and enforce the architectural policy below.

## Instructions

1. Use Grep to find ALL occurrences of `useFetch(` and `useLazyFetch(` across the project (`.vue`, `.ts`, `.js` files)
2. For each occurrence, Read the file and evaluate the context using the detection strategy below
3. Output a JSON violation report at the end

## Core Policy

`useFetch` and `useLazyFetch` are ONLY allowed when:
- Used directly inside `<script setup>` blocks
- Inside `.vue` files only
- Executed synchronously during setup phase

Everything else is a violation.

## Strictly Forbidden

1. useFetch outside `<script setup>`
2. useFetch inside composables (except the allowed wrapper below)
3. Returning useFetch from a composable
4. Wrapping useFetch inside custom abstraction layers
5. useFetch inside `defineStore` (Pinia)
6. useFetch declared at module top-level
7. useFetch inside callbacks (setTimeout, event handlers, async functions not tied to setup)
8. Conditional execution outside setup
9. Any indirect invocation through wrapper (unless explicitly allowed)

## Exception (Strict and Narrow)

Only ignore violation type `WRAPPED_USEFETCH` when:
- File path EXACTLY equals `composables/useAPI.ts`
- The useFetch call is directly inside the exported function named `useAPI`

Do NOT ignore any other violation type or any other file.

## Detection Strategy

For every detected occurrence of `useFetch(` or `useLazyFetch(`:

**STEP 1 — Determine File Type**
- Is file a `.vue` file?
- Is file inside `composables/`?
- Is file inside `stores/`?

**STEP 2 — Detect Context**
- Is it inside `<script setup>`?
- Is it inside normal `<script>`?
- Is it inside an exported function?
- Is it returned?
- Is it at module root level?
- Is it inside `defineStore`?
- Is it inside a callback or async wrapper?

**STEP 3 — Apply Violation Classification**
Assign ONE primary violation type:
- `OUTSIDE_SCRIPT_SETUP` — useFetch in `.vue` but outside `<script setup>`
- `INSIDE_COMPOSABLE` — useFetch inside composables folder (except allowed wrapper)
- `RETURNED_USEFETCH` — `return useFetch(...)`
- `WRAPPED_USEFETCH` — useFetch inside custom composable abstraction
- `STORE_USAGE` — useFetch inside `defineStore`
- `TOP_LEVEL_DECLARATION` — useFetch at module root (outside any function)
- `CALLBACK_USAGE` — useFetch inside callback/setTimeout/event handler/nested async

**STEP 4 — Apply Exception Logic**
Only skip if: `violation_type == WRAPPED_USEFETCH` AND `file == composables/useAPI.ts` AND `function name == useAPI`. Otherwise: flag it.

## Output Format (Mandatory JSON)

```json
{
  "violations": [
    {
      "file": "",
      "line": 0,
      "code_snippet": "",
      "violation_type": "",
      "why_invalid": "",
      "architectural_risk": "",
      "exact_fix": ""
    }
  ],
  "summary": {
    "total": 0,
    "critical": 0,
    "files_affected": 0
  }
}
```

If no violations found:

```json
{
  "violations": [],
  "summary": {
    "total": 0
  }
}
```

Every violation must include a concrete fix suggestion. Never suppress violations silently.

````
