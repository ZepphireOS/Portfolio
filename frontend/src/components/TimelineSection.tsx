import { cn } from 'cn'
import { type CSSProperties, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { timeline as timelineData } from '@/data/timeline'
import type { TimelineEntry, TimelineSide } from '@/data/types'
import { formatEntryDates, monthIndex } from '@/lib/dates'
import {
  BAR_TEXT,
  countLines,
  labelTier,
  layoutTimeline,
  type PlacedEvent,
  type PlacedSpan,
  type TimelineLayout,
  yearTicks,
} from '@/lib/timeline'
import { Section } from './Section'

const AXIS_W = 64
const COLUMN_MAX_W = 220
const COLUMN_GAP = 8
const DOT = 12
/** Shades per kind in the palette (see --tl-* in index.css). */
const SHADES = 3
const SIDES = ['education', 'experience'] as const
const KIND_TAG: Record<PlacedSpan['entry']['kind'], string> = { role: 'Role', degree: 'Degree', certificate: 'Cert' }

const barLabel = (entry: TimelineEntry) => entry.shortTitle ?? entry.title

interface TimelineSectionProps {
  /** Defaults to the timeline data file; overridable for previews/tests. */
  entries?: TimelineEntry[]
  /** Id of the entry whose popup is open. */
  activeId?: string
  onSelect: (entry: TimelineEntry, trigger: HTMLElement) => void
}

export function TimelineSection({ entries = timelineData, activeId, onSelect }: TimelineSectionProps) {
  const layout = useMemo(() => layoutTimeline(entries), [entries])
  return (
    <Section
      id="timeline"
      intro="Education and certificates on the left, experience on the right, read against one shared time axis — each bar spans its real dates. Select any entry for details."
    >
      <div className="hidden md:block">
        <DualAxisTimeline layout={layout} activeId={activeId} onSelect={onSelect} />
      </div>
      <div className="md:hidden">
        <TimelineList entries={entries} activeId={activeId} onSelect={onSelect} />
      </div>
    </Section>
  )
}

interface ViewProps {
  activeId?: string
  onSelect: TimelineSectionProps['onSelect']
}

function DualAxisTimeline({ layout, activeId, onSelect }: ViewProps & { layout: TimelineLayout }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number }>()

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const update = (width: number, height: number) => {
      if (width > 0 && height > 0) setSize({ width, height }) // 0×0 while hidden at narrow widths
    }
    update(el.clientWidth, el.clientHeight)
    const observer = new ResizeObserver(() => update(el.clientWidth, el.clientHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const sideW = size ? (size.width - AXIS_W) / 2 : 0
  const columnWidth = (side: TimelineSide) => {
    const n = Math.max(1, layout.sides[side].columns)
    return Math.min(COLUMN_MAX_W, (sideW - (n - 1) * COLUMN_GAP) / n)
  }

  // How many lines each bar title wraps to at its column width — recomputed on resize only.
  const titleLines = useMemo(() => {
    const lines = new Map<string, number>()
    const ctx = document.createElement('canvas').getContext('2d')
    if (!size || !ctx || !viewportRef.current) return lines
    ctx.font = `600 12px ${getComputedStyle(viewportRef.current).fontFamily}`
    for (const side of SIDES) {
      const textWidth = columnWidth(side) - BAR_TEXT.insetX - 2 // 2px slack for sub-pixel rounding
      for (const span of layout.sides[side].spans) {
        lines.set(span.entry.id, countLines(ctx, barLabel(span.entry), textWidth))
      }
    }
    return lines
    // columnWidth derives from layout + size.width
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, size?.width])

  // Time scale: pixels per month and the view's scroll offset (px). At minimum zoom the whole range fits.
  const scale = size ? size.height / (layout.end - layout.origin) : 0
  const offset = 0
  const y = (month: number) => (month - layout.origin) * scale - offset
  const ticks = yearTicks(layout.origin, layout.end)

  return (
    <div>
      <div className="mb-2 grid font-mono text-[11px] tracking-wider text-muted-foreground uppercase" style={{ gridTemplateColumns: `1fr ${AXIS_W}px 1fr` }}>
        <h3>Education &amp; Certificates</h3>
        <span />
        <h3 className="text-right">Experience</h3>
      </div>

      <div ref={viewportRef} data-timeline-viewport className="relative h-[clamp(28rem,72svh,46rem)] overflow-hidden border bg-background">
        {size && (
          <>
            {/* Year grid lines behind everything, so bars on both sides read against the same years */}
            {ticks.map((m) => (
              <div key={m} aria-hidden="true" className="pointer-events-none absolute inset-x-0 border-t border-dashed border-border" style={{ top: y(m) }} />
            ))}

            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 border-x-[1.5px] border-muted-foreground/40 bg-muted/60" style={{ left: sideW, width: AXIS_W }}>
              {ticks.map((m) => (
                <div
                  key={m}
                  data-year={m / 12}
                  className="absolute inset-x-0 -translate-y-1/2 bg-muted text-center font-mono text-[10px] leading-4 text-muted-foreground"
                  style={{ top: y(m) }}
                >
                  {m / 12}
                </div>
              ))}
              <div data-present className="absolute -inset-x-1.5 border-t-[1.5px] border-dashed border-orange-600" style={{ top: y(layout.present) }} />
              <div className="absolute inset-x-0 -translate-y-full pb-0.5 text-center font-mono text-[9px] tracking-widest text-orange-600" style={{ top: y(layout.present) }}>
                NOW
              </div>
            </div>

            {SIDES.map((side) => {
              const width = columnWidth(side)
              return layout.sides[side].spans.map((span) => (
                <TimelineBar
                  key={span.entry.id}
                  span={span}
                  side={side}
                  active={span.entry.id === activeId}
                  titleLines={titleLines.get(span.entry.id) ?? 1}
                  onSelect={onSelect}
                  style={{
                    top: y(span.start),
                    height: (span.end - span.start) * scale,
                    width,
                    left:
                      side === 'education'
                        ? sideW - (span.column + 1) * width - span.column * COLUMN_GAP
                        : sideW + AXIS_W + span.column * (width + COLUMN_GAP),
                  }}
                />
              ))
            })}

            {SIDES.map((side) =>
              layout.sides[side].events.map((event) => (
                <TimelineDot
                  key={event.entry.id}
                  event={event}
                  active={event.entry.id === activeId}
                  onSelect={onSelect}
                  style={{ top: y(event.at) - DOT / 2, left: (side === 'education' ? sideW : sideW + AXIS_W) - DOT / 2 }}
                />
              )),
            )}
          </>
        )}
      </div>

      <Legend />
    </div>
  )
}

function TimelineBar({
  span,
  side,
  active,
  titleLines,
  onSelect,
  style,
}: {
  span: PlacedSpan
  side: TimelineSide
  active: boolean
  titleLines: number
  onSelect: TimelineSectionProps['onSelect']
  style: CSSProperties
}) {
  const { entry } = span
  const label = barLabel(entry)
  const dates = formatEntryDates(entry)
  const tier = labelTier(Number(style.height), titleLines)
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={`${label}, ${dates}`}
      // Hover hint when the bar is too short to show its full label.
      title={tier === 'full' || tier === 'title' ? undefined : `${label}, ${dates}`}
      data-entry={entry.id}
      data-side={side}
      data-column={span.column}
      data-tier={tier}
      data-active={active || undefined}
      onClick={(event) => onSelect(entry, event.currentTarget)}
      style={{
        ...style,
        '--bar': `var(--tl-${entry.kind}-${span.column % SHADES})`,
        // An ongoing entry has an open (dashed) end at the present marker.
        ...(span.ongoing && { borderBottomStyle: 'dashed' }),
      } as CSSProperties}
      className={cn(
        // No padding on the bar itself, so its height can follow the time scale all the way down.
        'absolute flex cursor-pointer flex-col justify-center overflow-hidden border-[1.5px] border-(--bar) bg-[color-mix(in_srgb,var(--bar)_14%,var(--color-background))] p-0 text-left transition-shadow hover:z-10 hover:shadow-[3px_3px_0_0_var(--color-border)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 data-active:z-10 data-active:outline-2 data-active:outline-offset-2 data-active:outline-(--bar)',
        side === 'education' ? 'border-r-4' : 'border-l-4',
      )}
    >
      {tier !== 'none' && (
        <span className="flex flex-col items-start px-[7px] py-[3px]">
          <span className={cn('w-full text-xs leading-[15px] font-semibold', tier === 'title-one-line' ? 'truncate' : 'line-clamp-2')}>
            {label}
          </span>
          {tier === 'full' && (
            <span className="mt-px w-full truncate font-mono text-[10px] leading-[13px] text-muted-foreground">
              <span className="text-(--bar) uppercase">{KIND_TAG[entry.kind]}</span> · {dates}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

function TimelineDot({
  event,
  active,
  onSelect,
  style,
}: {
  event: PlacedEvent
  active: boolean
  onSelect: TimelineSectionProps['onSelect']
  style: CSSProperties
}) {
  const { entry } = event
  const label = `${barLabel(entry)}, ${formatEntryDates(entry)}`
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label={label}
      title={label}
      data-entry={entry.id}
      data-active={active || undefined}
      onClick={(e) => onSelect(entry, e.currentTarget)}
      style={style}
      // The before: pseudo-element widens the hit area beyond the 12px dot.
      className="absolute z-20 size-3 cursor-pointer rounded-full border-2 border-background bg-(--tl-event) shadow-[0_0_0_1.5px_var(--tl-event)] transition-transform before:absolute before:-inset-2 before:content-[''] hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 data-active:scale-125"
    />
  )
}

function Legend() {
  const swatch = 'inline-block size-2.5 border-[1.5px]'
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
      {(['degree', 'certificate', 'role'] as const).map((kind) => (
        <li key={kind} className="flex items-center gap-1.5">
          <i
            className={swatch}
            style={{ borderColor: `var(--tl-${kind}-0)`, background: `color-mix(in srgb, var(--tl-${kind}-0) 14%, transparent)` }}
          />
          {kind === 'degree' ? 'Degree' : kind === 'certificate' ? 'Certificate' : 'Role'}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <i className="inline-block size-2.5 rounded-full bg-(--tl-event)" />
        One-day event
      </li>
      <li className="flex items-center gap-1.5">
        <i className={cn(swatch, 'border-muted-foreground')} style={{ borderBottomStyle: 'dashed' }} />
        Ongoing
      </li>
    </ul>
  )
}

/** Narrow screens: a plain newest-first list (the full mobile layout is task 6.9). */
function TimelineList({ entries, activeId, onSelect }: ViewProps & { entries: TimelineEntry[] }) {
  const sorted = useMemo(
    () => [...entries].sort((a, b) => monthIndex(b.kind === 'event' ? b.date : b.start) - monthIndex(a.kind === 'event' ? a.date : a.start)),
    [entries],
  )
  return (
    <ul className="grid gap-2">
      {sorted.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            aria-haspopup="dialog"
            data-active={entry.id === activeId || undefined}
            onClick={(event) => onSelect(entry, event.currentTarget)}
            className="w-full cursor-pointer border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-orange-600 data-active:border-orange-600"
          >
            <span className="font-medium">{barLabel(entry)}</span>
            <span className="ml-2 font-mono text-xs text-muted-foreground">{formatEntryDates(entry)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
