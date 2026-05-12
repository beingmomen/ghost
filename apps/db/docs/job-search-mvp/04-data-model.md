# 04. Data Model

## مبدأ التصميم

نفصل بين:

- مصدر الوظيفة.
- عملية البحث.
- الوظيفة نفسها.
- تحليل الملاءمة.
- CV draft.

هذا يمنع الخلط ويجعل التوسع لاحقًا أسهل.

## job_sources

```ts
type JobSource = {
  id: string
  key: 'wuzzuf' | 'linkedin'
  name: string
  enabled: boolean
  mode?: 'automatic' | 'manual_import' | 'disabled'
  lastHealthStatus?: 'healthy' | 'degraded' | 'failed'
  lastCheckedAt?: string
  createdAt: string
  updatedAt: string
}
```

## job_search_runs

```ts
type JobSearchRun = {
  id: string
  source: 'wuzzuf' | 'linkedin' | 'all'
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  query: {
    terms: string[]
    location?: string
    maxPages: number
    maxJobs: number
    filters?: Record<string, unknown>
  }
  stats: {
    fetched: number
    created: number
    updated: number
    duplicated: number
    failed: number
  }
  errorMessage?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
}
```

## jobs

```ts
type Job = {
  id: string
  source: 'wuzzuf' | 'linkedin'
  sourceJobId?: string
  title: string
  company: string
  location?: string
  workplace: 'remote' | 'hybrid' | 'onsite' | 'unknown'
  seniority: 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'manager' | 'unknown'
  jobUrl: string
  applyUrl?: string
  postedAt?: string
  description?: string
  requirements: string[]
  skills: string[]
  tags: string[]
  salary?: string
  status: 'new' | 'shortlisted' | 'ignored' | 'cv_ready' | 'applied'
  rawText?: string
  rawPayload?: unknown
  firstSeenAt: string
  lastSeenAt: string
  createdAt: string
  updatedAt: string
}
```

## job_matches

```ts
type JobMatch = {
  id: string
  jobId: string
  profileVersion: string
  score: number
  level: 'excellent' | 'good' | 'stretch' | 'weak'
  matchedSkills: string[]
  missingSkills: string[]
  seniorityAssessment: string
  roleAssessment: string
  reasons: string[]
  risks: string[]
  recommendations: string[]
  generatedBy: 'rules' | 'llm' | 'hybrid'
  createdAt: string
}
```

## resume_drafts

```ts
type ResumeDraft = {
  id: string
  jobId: string
  profileVersion: string
  title: string
  format: 'ats_text' | 'html'
  content: {
    headline: string
    summary: string
    skills: string[]
    experienceBullets: string[]
    selectedProjects: string[]
  }
  warnings: string[]
  createdAt: string
  updatedAt: string
}
```

## career_profile_settings

```ts
type CareerProfileSettings = {
  targetRoles: string[]
  targetSeniority: 'mid' | 'senior' | 'lead'
  defaultStacks: string[]
  optionalStacks: string[]
  locationPreferences: string[]
  workplacePreferences: Array<'remote' | 'hybrid' | 'onsite'>
  updatedAt: string
}
```

## Indexes مهمة

- `jobs.source + jobs.sourceJobId`
- `jobs.source + jobs.jobUrl`
- `jobs.status`
- `jobs.seniority`
- `jobs.workplace`
- `job_matches.jobId`
- `job_search_runs.status`

## MVP Simplification

إذا كان الباك الحالي MongoDB:

- نفس الموديلات يمكن تنفيذها كـ collections.

إذا كان SQL:

- `rawPayload` و`query` و`stats` و`content` يمكن أن تكون JSON columns.
