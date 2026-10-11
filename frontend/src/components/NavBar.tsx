import { useCallback, useEffect, useState } from 'react'
import { useNavObserver } from '@/hooks/useNavObserver'
import { SECTIONS } from './sections'

const HEADER_ID = 'site-nav'
const SELECTORS = SECTIONS.map((s) => `#${s.id}`).join(',')
const LAST_SECTION = SECTIONS[SECTIONS.length - 1].id

/** True once the page is scrolled to its end (and actually scrolled, so a short page doesn't start there). */
const isAtPageBottom = () =>
  window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

/** Sticky section nav. Links are plain anchors (smooth scroll comes from CSS); the scrollspy marks the section in view. */
export function NavBar() {
  const [observed, setObserved] = useState<string>(SECTIONS[0].id)
  const onSection = useCallback((id: string | null) => {
    if (id) setObserved(id)
  }, [])
  useNavObserver(SELECTORS, HEADER_ID, onSection)

  // The scrollspy only marks a section once it reaches the top of the viewport, which a short
  // last section can never do on a tall screen — so at the page bottom, the last section is current.
  const [atBottom, setAtBottom] = useState(false)
  useEffect(() => {
    const check = () => setAtBottom(isAtPageBottom())
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])
  const current = atBottom ? LAST_SECTION : observed

  return (
    <nav
      id={HEADER_ID}
      aria-label="Sections"
      className="sticky top-0 z-20 flex h-11 border-b bg-muted/95 backdrop-blur"
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={s.id === current ? 'location' : undefined}
          className="flex flex-1 items-center justify-center gap-2 border-r px-2 font-mono text-xs tracking-wider whitespace-nowrap text-muted-foreground uppercase transition-colors hover:text-foreground aria-[current=location]:-mb-px aria-[current=location]:border-b-2 aria-[current=location]:border-b-orange-600 aria-[current=location]:bg-background aria-[current=location]:text-foreground sm:flex-none sm:justify-start sm:px-5"
        >
          <span className="hidden text-muted-foreground/60 sm:inline">{String(i + 1).padStart(2, '0')}</span>
          {s.label}
        </a>
      ))}
    </nav>
  )
}
