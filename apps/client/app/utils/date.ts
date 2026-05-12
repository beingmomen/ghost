/**
 * Formats an ISO date string (YYYY-MM-DD) to Arabic month+year (e.g. "يناير 2021").
 * If the value equals 'الحالي' or is empty, returns it as-is.
 */
export function formatArabicDate(value: string | undefined | null): string {
  if (!value) return ''
  if (value === 'الحالي') return 'الحالي'
  // Expect YYYY-MM-DD
  const [year, month] = value.split('-').map(Number)
  if (!year || !month) return value
  const monthName = new Intl.DateTimeFormat('ar', { month: 'long' }).format(new Date(year, month - 1, 1))
  return `${monthName} ${year}`
}
