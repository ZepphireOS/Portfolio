import {
  sideOf,
  type TimelineEntry,
  type TimelineEvent,
  type TimelineSide,
  type TimelineSpan,
  type YearMonthDay,
} from '@/data/types'
import { monthIndex } from './dates'

/*
 * Timeline geometry, in "month units" (months since year 0, fractional).
 * Same conventions as the storyboard: a span runs from the start of its start
 * month to the start of its end month, so "Jan – Apr" is three months long and
 * an entry ending in a month can share a column with one starting that month.
 */

const daysIn = (year: number, month0: number) => new Date(year, month0 + 1, 0).getDate()

/** A specific day as a fractional month index (the 1st is the month's start). */
export const dayIndex = (date: YearMonthDay) => {
  const [year, month, day] = date.split('-').map(Number)
  return monthIndex(date) + (day - 1) / daysIn(year, month - 1)
}

/** Today as a fractional month index — where the "present" marker sits and ongoing entries end. */
export const presentIndex = (now = new Date()) =>
  now.getFullYear() * 12 + now.getMonth() + (now.getDate() - 1) / daysIn(now.getFullYear(), now.getMonth())

export interface PlacedSpan {
  entry: TimelineSpan
  start: number
  end: number
  ongoing: boolean
  /** 0 is the column against the axis; higher columns sit further out. */
  column: number
}

export interface PlacedEvent {
  entry: TimelineEvent
  at: number
}

export interface TimelineLayout {
  /** First and last month shown at minimum zoom (entries plus padding). */
  origin: number
  end: number
  present: number
  sides: Record<TimelineSide, { spans: PlacedSpan[]; events: PlacedEvent[]; columns: number }>
}

/**
 * Greedy interval colouring (the storyboard's `assignLanes`): in start order, each item takes
 * the innermost column whose last item has ended by its start, else opens a new column.
 * Guarantees no two items in a column overlap, for any number of simultaneous overlaps.
 */
export function assignColumns<T extends { start: number; end: number }>(items: T[]): (T & { column: number })[] {
  const columnEnds: number[] = []
  return [...items]
    .sort((a, b) => a.start - b.start)
    .map((item) => {
      let column = columnEnds.findIndex((end) => end <= item.start)
      if (column === -1) column = columnEnds.push(item.end) - 1
      else columnEnds[column] = item.end
      return { ...item, column }
    })
}

/** Months of breathing room above the earliest entry and below the present. */
const PADDING_MONTHS = 2

export function layoutTimeline(entries: TimelineEntry[], present = presentIndex()): TimelineLayout {
  const sides: TimelineLayout['sides'] = {
    education: { spans: [], events: [], columns: 0 },
    experience: { spans: [], events: [], columns: 0 },
  }
  const raw: Record<TimelineSide, Omit<PlacedSpan, 'column'>[]> = { education: [], experience: [] }
  const times: number[] = [present]

  for (const entry of entries) {
    if (entry.kind === 'event') {
      const at = dayIndex(entry.date)
      sides[sideOf(entry)].events.push({ entry, at })
      times.push(at)
    } else {
      const start = monthIndex(entry.start)
      // A same-month span still covers its month rather than collapsing to nothing.
      const end = entry.end === 'present' ? present : Math.max(monthIndex(entry.end), start + 1)
      raw[sideOf(entry)].push({ entry, start, end, ongoing: entry.end === 'present' })
      times.push(start, end)
    }
  }

  for (const side of ['education', 'experience'] as const) {
    sides[side].spans = assignColumns(raw[side])
    sides[side].columns = Math.max(0, ...sides[side].spans.map((s) => s.column + 1))
    sides[side].events.sort((a, b) => a.at - b.at)
  }

  return {
    origin: Math.floor(Math.min(...times)) - PADDING_MONTHS,
    end: Math.ceil(Math.max(...times)) + PADDING_MONTHS,
    present,
    sides,
  }
}

/** Month indices of every January 1st strictly inside the range (one on an edge would be half cut off). */
export const yearTicks = (origin: number, end: number) => {
  const ticks: number[] = []
  for (let m = Math.ceil(origin / 12) * 12; m < end; m += 12) if (m > origin) ticks.push(m)
  return ticks
}

// ------------------------------------------------------------ bar labels

/** Pixel metrics of a bar's text block; must match the classes in TimelineSection. */
export const BAR_TEXT = {
  /** Vertical padding + border, top and bottom combined. */
  chrome: 2 * (3 + 1.5),
  titleLine: 15,
  gap: 1,
  details: 13,
  /** Horizontal padding + borders (1.5px outer, 4px on the axis side). */
  insetX: 2 * 7 + 1.5 + 4,
}

export type LabelTier = 'full' | 'title' | 'title-one-line' | 'none'

/**
 * Picks how much text a bar can show at its rendered height, so text is never cut off mid-line:
 * title + details, title only, the title squeezed to one line, or nothing.
 * Derived from the scale rather than measured, so it stays cheap while zooming.
 */
export function labelTier(height: number, titleLines: number): LabelTier {
  const title = Math.min(titleLines, 2) * BAR_TEXT.titleLine
  if (height >= BAR_TEXT.chrome + title + BAR_TEXT.gap + BAR_TEXT.details) return 'full'
  if (height >= BAR_TEXT.chrome + title) return 'title'
  if (titleLines > 1 && height >= BAR_TEXT.chrome + BAR_TEXT.titleLine) return 'title-one-line'
  return 'none'
}

/** Counts how many lines `text` wraps to at `maxWidth`, using canvas text metrics (no layout). */
export function countLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let lines = 1
  let line = ''
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word
    if (!line || ctx.measureText(candidate).width <= maxWidth) line = candidate
    else {
      lines++
      line = word
    }
  }
  return lines
}
