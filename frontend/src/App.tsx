import { useState } from 'react'
import { AboutSection } from '@/components/AboutSection'
import { NavBar } from '@/components/NavBar'
import { Section } from '@/components/Section'
import { SkillsSection } from '@/components/SkillsSection'
import { about } from '@/data/about'
import { skillKey } from '@/data/types'

function App() {
  // Which entry's detail is open; the shared popup (section 5) renders from this.
  const [activeKey, setActiveKey] = useState<string>()

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
            onSelect={(skill, category) => setActiveKey(skillKey(category, skill))}
          />
          {/* Placeholders until sections 6 and 7 build these out. */}
          <Section id="timeline">
            <div className="h-[80vh] border border-dashed" />
          </Section>
          <Section id="projects">
            <div className="h-[80vh] border border-dashed" />
          </Section>
        </main>
      </div>
    </div>
  )
}

export default App
