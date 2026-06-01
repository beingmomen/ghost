// Display metadata for the learning roadmap (read-only website view).

export interface RoadmapLevel {
  value: string
  label: string
}

export const LEVEL_LADDER: RoadmapLevel[] = [
  { value: 'junior_mid', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'mid_advanced', label: 'على باب Senior' },
  { value: 'senior', label: 'Senior' }
]

export const LEVEL_LABELS: Record<string, string> = {
  junior_mid: 'Junior',
  mid: 'Mid',
  mid_advanced: 'على باب Senior',
  senior: 'Senior'
}

export const LEVEL_COLORS: Record<string, string> = {
  junior_mid: 'neutral',
  mid: 'info',
  mid_advanced: 'warning',
  senior: 'success'
}

export const TASK_TYPE_META: Record<
  string,
  { label: string, color: string, icon: string }
> = {
  learn: { label: 'تعلّم', color: 'info', icon: 'i-lucide-book-open' },
  practice: { label: 'تطبيق', color: 'warning', icon: 'i-lucide-dumbbell' },
  explain: { label: 'شرح', color: 'primary', icon: 'i-lucide-megaphone' }
}

export const levelLabel = (level?: string) =>
  (level && LEVEL_LABELS[level]) || level || '—'

export const levelColor = (level?: string) =>
  (level && LEVEL_COLORS[level]) || 'neutral'
