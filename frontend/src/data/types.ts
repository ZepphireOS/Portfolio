/**
 * Content model for the portfolio. Every section renders from these types;
 * add or edit entries in the sibling data files, not in components.
 */

/** Month precision, e.g. `'2024-08'`. */
export type YearMonth = `${number}-${number}`
/** Day precision, e.g. `'2025-01-31'` — used for one-day events. */
export type YearMonthDay = `${number}-${number}-${number}`

/** Path to an image under `public/`, e.g. `'images/projects/gmail.png'` (no leading slash). */
export type ImagePath = string

// ---------------------------------------------------------------- About

/** Known kinds get a matching icon; `link` is the generic fallback. */
export type ContactKind = 'github' | 'linkedin' | 'email' | 'website' | 'link'

export interface ContactLink {
  kind: ContactKind
  label: string
  href: string
}

export interface About {
  name: string
  role: string
  /** One string per paragraph; the first is rendered as the lede. */
  bio: string[]
  /** Short label/value pairs shown under the bio, e.g. Focus, Currently. */
  facts?: { label: string; value: string }[]
  photo?: ImagePath
  /** Never include a phone number or physical location here. */
  links: ContactLink[]
}

// --------------------------------------------------------------- Skills

export interface Skill {
  name: string
  /** Extra detail for the popup, e.g. the AWS services used. */
  detail?: string
  /** Where the skill was used. Omit to show the placeholder. */
  usedIn?: string
  /** How the skill was learned. Omit to show the placeholder. */
  learnedVia?: string
}

/** A skill category; groups render in array order. */
export interface SkillGroup {
  category: string
  skills: Skill[]
}

/** Unique key for a skill (names may repeat across categories). */
export const skillKey = (category: string, skill: Skill) => `${category}/${skill.name}`

// ------------------------------------------------------------- Timeline

/** Which side of the shared time axis an entry sits on. */
export type TimelineSide = 'education' | 'experience'

interface TimelineEntryBase {
  /** Stable, unique id (used for keys and popups). */
  id: string
  /** Full title, shown in the popup. */
  title: string
  /** Shorter label for the bar; falls back to `title`. */
  shortTitle?: string
  org: string
  bullets: string[]
  image?: ImagePath
}

/** An entry with a real duration, drawn as a bar. */
export interface TimelineSpan extends TimelineEntryBase {
  kind: 'role' | 'degree' | 'certificate'
  start: YearMonth
  /** `'present'` for ongoing entries (e.g. a current role). */
  end: YearMonth | 'present'
}

/** A one-day entry (e.g. a hackathon), drawn as a point marker. */
export interface TimelineEvent extends TimelineEntryBase {
  kind: 'event'
  date: YearMonthDay
  side: TimelineSide
  /** Label shown in the popup instead of "Event", e.g. "Competition". */
  eventType?: string
}

export type TimelineEntry = TimelineSpan | TimelineEvent

/** Roles go on the experience side; degrees and certificates on the education side. */
export const sideOf = (entry: TimelineEntry): TimelineSide =>
  entry.kind === 'event' ? entry.side : entry.kind === 'role' ? 'experience' : 'education'

// ------------------------------------------------------------- Projects

/** Picks the stand-in icon when a project has no image. Add new categories freely. */
export type ProjectCategory = 'pipeline' | 'vision' | 'ml' | 'audio' | 'nlp'

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  /** Short tags shown on the card. */
  tags: string[]
  /** Full description, one bullet per string, shown in the popup. */
  description: string[]
  link?: { label: string; href: string }
  /** First image is used on the card; all are shown in the popup. */
  images?: ImagePath[]
}
