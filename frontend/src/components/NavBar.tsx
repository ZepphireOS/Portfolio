import { useCallback, useState } from 'react'
import { useNavObserver } from '@/hooks/useNavObserver'
import { SECTIONS } from './sections'

const HEADER_ID = 'site-nav'
const SELECTORS = SECTIONS.map((s) => `#${s.id}`).join(',')

/** Sticky section nav. Links are plain anchors (smooth scroll comes from CSS); the scrollspy marks the section in view. */
export function NavBar() {
  const [current, setCurrent] = useState<string>(SECTIONS[0].id)
  const onSection = useCallback((id: string | null) => {
    if (id) setCurrent(id)
  }, [])
  useNavObserver(SELECTORS, HEADER_ID, onSection)

  return (
    <nav
      id={HEADER_ID}
      aria-label="Sections"
      className="sticky top-0 z-20 flex h-11 overflow-x-auto border-b bg-muted/95 backdrop-blur"
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={s.id === current ? 'location' : undefined}
          className="flex flex-1 items-center justify-center gap-2 border-r px-2 font-mono sm:flex-none sm:justify-start text-xs tracking-wider whitespace-nowrap text-muted-foreground uppercase transition-colors hover:text-foreground aria-[current=location]:-mb-px aria-[current=location]:border-b-2 aria-[current=location]:border-b-orange-600 aria-[current=location]:bg-background aria-[current=location]:text-foreground sm:px-5"
        >
          <span className="hidden text-muted-foreground/60 sm:inline">{String(i + 1).padStart(2, '0')}</span>
          {s.label}
        </a>
      ))}
    </nav>
  )
}
