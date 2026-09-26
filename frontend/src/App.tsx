import { useCallback, useState } from 'react'
import { useNavObserver } from '@/hooks/useNavObserver'

// Temporary scrollspy test page for task 2.4; replaced by the real layout in task 4.1.
const SECTIONS = ['about', 'skills', 'timeline', 'projects']
const HEADER_ID = 'headerNav'

function App() {
  const [current, setCurrent] = useState<string | null>(null)
  const onSection = useCallback((id: string | null) => {
    if (id) setCurrent(id)
  }, [])

  useNavObserver(SECTIONS.map((s) => `#${s}`).join(','), HEADER_ID, onSection)

  return (
    <>
      <nav id={HEADER_ID} className="sticky top-0 z-10 flex gap-4 border-b bg-background p-4">
        {SECTIONS.map((s) => (
          <a
            key={s}
            href={`#${s}`}
            aria-current={s === current ? 'true' : undefined}
            className="uppercase aria-[current=true]:font-bold aria-[current=true]:text-orange-600"
          >
            {s}
          </a>
        ))}
      </nav>
      {SECTIONS.map((s) => (
        <section key={s} id={s} className="min-h-[120vh] scroll-mt-16 border-b p-8">
          <h2 className="text-2xl font-semibold capitalize">{s}</h2>
        </section>
      ))}
    </>
  )
}

export default App
