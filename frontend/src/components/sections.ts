/** Page sections in display order; drives both the nav and the scrollspy. */
export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'projects', label: 'Projects' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']
