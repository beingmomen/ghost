// Shared display metadata for the learning roadmap (labels, colors, ladder).

export const LEVEL_LADDER = [
  { value: 'junior_mid', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'mid_advanced', label: 'على باب Senior' },
  { value: 'senior', label: 'Senior' }
];

export const LEVEL_LABELS = {
  junior_mid: 'Junior',
  mid: 'Mid',
  mid_advanced: 'على باب Senior',
  senior: 'Senior'
};

export const LEVEL_COLORS = {
  junior_mid: 'neutral',
  mid: 'info',
  mid_advanced: 'warning',
  senior: 'success'
};

// milestoneLevel options (a phase can carry one of these, or none).
export const MILESTONE_OPTIONS = [
  { label: 'بدون', value: null },
  { label: 'Mid', value: 'mid' },
  { label: 'على باب Senior (mid_advanced)', value: 'mid_advanced' },
  { label: 'Senior', value: 'senior' }
];

export const TASK_TYPE_OPTIONS = [
  { label: 'بدون', value: null },
  { label: 'تعلّم', value: 'learn' },
  { label: 'تطبيق', value: 'practice' },
  { label: 'شرح', value: 'explain' }
];

export const TASK_TYPE_META = {
  learn: { label: 'تعلّم', color: 'info', icon: 'i-lucide-book-open' },
  practice: { label: 'تطبيق', color: 'warning', icon: 'i-lucide-dumbbell' },
  explain: { label: 'شرح', color: 'primary', icon: 'i-lucide-megaphone' }
};

export const useRoadmapMeta = () => ({
  LEVEL_LADDER,
  LEVEL_LABELS,
  LEVEL_COLORS,
  MILESTONE_OPTIONS,
  TASK_TYPE_OPTIONS,
  TASK_TYPE_META,
  levelLabel: (level) => LEVEL_LABELS[level] || level || '—',
  levelColor: (level) => LEVEL_COLORS[level] || 'neutral'
});
