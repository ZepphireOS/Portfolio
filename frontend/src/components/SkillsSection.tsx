import { skillGroups } from '@/data/skills'
import { type Skill, skillKey } from '@/data/types'
import { Section } from './Section'

interface SkillsSectionProps {
  /** Key of the skill whose detail is open, if any. */
  activeKey?: string
  onSelect: (skill: Skill, category: string) => void
}

export function SkillsSection({ activeKey, onSelect }: SkillsSectionProps) {
  return (
    <Section id="skills" intro="Select any skill for where it was used and how it was learned.">
      <div className="grid gap-4">
        {skillGroups.map((group) => (
          <div key={group.category} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            <h3 className="shrink-0 pt-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase sm:w-44">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const key = skillKey(group.category, skill)
                return (
                  <li key={key}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      data-active={key === activeKey || undefined}
                      onClick={() => onSelect(skill, group.category)}
                      className="cursor-pointer border bg-background px-2.5 py-1 font-mono text-xs transition-[border-color,box-shadow,translate] hover:border-orange-600 hover:shadow-[3px_3px_0_0_var(--border)] focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:outline-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none data-active:border-orange-600"
                    >
                      {skill.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
