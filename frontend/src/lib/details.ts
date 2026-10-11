import {
  AudioWaveform,
  Award,
  Building2,
  Focus,
  GraduationCap,
  type LucideIcon,
  MessageSquareText,
  Network,
  Palette,
  Trophy,
  Workflow,
  Wrench,
} from 'lucide-react'
import type { ImagePath, Project, ProjectCategory, Skill, TimelineEntry } from '@/data/types'
import { formatEntryDates } from './dates'

/** A labelled note; `text` left undefined renders a clearly-marked placeholder. */
export interface DetailNote {
  label: string
  text?: string
}

/** What the shared detail popup shows — every interactable entry is adapted into this shape. */
export interface DetailContent {
  /** Small label above the title, e.g. "Skill", "Experience", "Project". */
  kind: string
  title: string
  subtitle?: string
  dates?: string
  summary?: string
  bullets?: string[]
  notes?: DetailNote[]
  images?: ImagePath[]
  /** Stand-in visual when there is no image. */
  icon: LucideIcon
  link?: { label: string; href: string }
}

/** Stand-in icon per project category — shown on the card and in the popup when there's no image. */
export const PROJECT_ICONS: Record<ProjectCategory, LucideIcon> = {
  pipeline: Workflow,
  vision: Focus,
  ml: Network,
  audio: AudioWaveform,
  nlp: MessageSquareText,
  creative: Palette,
}

const TIMELINE_KINDS: Record<TimelineEntry['kind'], { label: string; icon: LucideIcon }> = {
  role: { label: 'Experience', icon: Building2 },
  degree: { label: 'Education', icon: GraduationCap },
  certificate: { label: 'Certificate', icon: Award },
  event: { label: 'Event', icon: Trophy },
}

export const skillDetail = (skill: Skill, category: string): DetailContent => ({
  kind: 'Skill',
  title: skill.name,
  subtitle: category,
  summary: skill.detail,
  notes: [
    { label: 'Used in', text: skill.usedIn },
    { label: 'Learned via', text: skill.learnedVia },
  ],
  icon: Wrench,
})

export const timelineDetail = (entry: TimelineEntry): DetailContent => ({
  kind: entry.kind === 'event' ? (entry.eventType ?? TIMELINE_KINDS.event.label) : TIMELINE_KINDS[entry.kind].label,
  title: entry.title,
  subtitle: entry.org,
  dates: formatEntryDates(entry),
  bullets: entry.bullets,
  images: entry.image ? [entry.image] : undefined,
  icon: TIMELINE_KINDS[entry.kind].icon,
})

export const projectDetail = (project: Project): DetailContent => ({
  kind: 'Project',
  title: project.title,
  subtitle: project.tags.join(' · '),
  bullets: project.description,
  images: project.images,
  icon: PROJECT_ICONS[project.category],
  link: project.link,
})
