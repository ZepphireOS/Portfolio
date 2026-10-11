import { useCallback, useState } from 'react'
import { AboutSection } from '@/components/AboutSection'
import { DetailDialog } from '@/components/DetailDialog'
import { NavBar } from '@/components/NavBar'
import { Section } from '@/components/Section'
import { SkillsSection } from '@/components/SkillsSection'
import { about } from '@/data/about'
import { projects } from '@/data/projects'
import { timeline } from '@/data/timeline'
import { skillKey } from '@/data/types'
import { formatEntryDates, monthIndex } from '@/lib/dates'
import { type DetailContent, projectDetail, skillDetail, timelineDetail } from '@/lib/details'

// Interim lists (newest first) so every entry can open the popup until sections 6 and 7 build the real layouts.
const interimTimeline = [...timeline].sort(
  (a, b) => monthIndex(b.kind === 'event' ? b.date : b.start) - monthIndex(a.kind === 'event' ? a.date : a.start),
)
const interimButton =
  'w-full cursor-pointer border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-orange-600'

function App() {
  // The entry whose detail is shown. Kept after closing so the popup's exit animation still has content.
  const [detail, setDetail] = useState<{ key: string; content: DetailContent; trigger: HTMLElement }>()
  const [open, setOpen] = useState(false)
  const showDetail = useCallback((key: string, content: DetailContent, trigger: HTMLElement) => {
    setDetail({ key, content, trigger })
    setOpen(true)
  }, [])
  const activeKey = open ? detail?.key : undefined

  return (
    <div className="px-0 py-0 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl border-y bg-card sm:border-x">
        <header className="border-b px-5 pt-8 pb-5 sm:px-10">
          <h1 className="text-5xl leading-[0.9] font-extrabold tracking-tight text-balance sm:text-7xl">
            {about.name}
          </h1>
          <p className="mt-3 font-mono text-xs tracking-wider text-muted-foreground uppercase sm:text-sm">
            {about.role}
          </p>
        </header>

        <NavBar />

        <main>
          <AboutSection />
          <SkillsSection
            activeKey={activeKey}
            onSelect={(skill, category, trigger) =>
              showDetail(skillKey(category, skill), skillDetail(skill, category), trigger)
            }
          />
          <Section id="timeline">
            <ul className="grid gap-2">
              {interimTimeline.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(event) => showDetail(entry.id, timelineDetail(entry), event.currentTarget)}
                    className={interimButton}
                  >
                    <span className="font-medium">{entry.shortTitle ?? entry.title}</span>
                    <span className="ml-2 font-mono text-xs text-muted-foreground">{formatEntryDates(entry)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>
          <Section id="projects">
            <ul className="grid gap-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(event) => showDetail(project.id, projectDetail(project), event.currentTarget)}
                    className={interimButton}
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ul>
          </Section>
        </main>
      </div>

      <DetailDialog
        content={detail?.content}
        open={open}
        onOpenChange={setOpen}
        returnFocusTo={detail?.trigger}
      />
    </div>
  )
}

export default App
