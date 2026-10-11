import type { TimelineEntry, YearMonth, YearMonthDay } from '@/data/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const parts = (date: YearMonth | YearMonthDay) => date.split('-').map(Number)

/** Months since year 0 — a linear index for positioning on a time axis. */
export const monthIndex = (date: YearMonth | YearMonthDay) => {
  const [year, month] = parts(date)
  return year * 12 + (month - 1)
}

/** `'2024-08'` → `'Aug 2024'` */
export const formatMonth = (date: YearMonth) => {
  const [year, month] = parts(date)
  return `${MONTHS[month - 1]} ${year}`
}

/** `'2025-01-31'` → `'Jan 31, 2025'` */
export const formatDay = (date: YearMonthDay) => {
  const [year, month, day] = parts(date)
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

/** `'2026-10-03'`–`'2026-10-04'` → `'Oct 3–4, 2026'`; falls back to two full dates across months. */
export const formatDayRange = (start: YearMonthDay, end?: YearMonthDay) => {
  if (!end || end === start) return formatDay(start)
  const [y1, m1, d1] = parts(start)
  const [y2, m2, d2] = parts(end)
  if (y1 === y2 && m1 === m2) return `${MONTHS[m1 - 1]} ${d1}–${d2}, ${y1}`
  return `${formatDay(start)} – ${formatDay(end)}`
}

/** Human-readable date or date range for a timeline entry. */
export const formatEntryDates = (entry: TimelineEntry) =>
  entry.kind === 'event'
    ? formatDayRange(entry.date, entry.endDate)
    : `${formatMonth(entry.start)} – ${entry.end === 'present' ? 'Present' : formatMonth(entry.end)}`
