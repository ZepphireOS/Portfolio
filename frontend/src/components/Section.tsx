import type { ReactNode } from 'react'
import { SECTIONS, type SectionId } from './sections'

interface SectionProps {
  id: SectionId
  /** One-line hint under the heading. */
  intro?: string
  children: ReactNode
}

export function Section({ id, intro, children }: SectionProps) {
  const index = SECTIONS.findIndex((s) => s.id === id)
  const { label } = SECTIONS[index]
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      // scroll-mt matches the sticky nav's h-11 so anchored sections land just under it
      className="scroll-mt-11 border-b px-5 py-10 last:border-b-0 sm:px-10"
    >
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-3xl font-bold text-muted-foreground/40">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight">
          {label}
        </h2>
      </div>
      {intro && <p className="mb-6 max-w-prose text-sm text-muted-foreground">{intro}</p>}
      {children}
    </section>
  )
}
