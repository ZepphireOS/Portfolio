import { useEffect } from 'react'

/**
 * Scrollspy: reports which section is in view as the page scrolls.
 *
 * Ported from tbakerx/react-resume-template's `useNavObserver`. The original
 * imported `headerID` from its Next.js Header component; here the nav's element
 * id is passed in so the hook has no dependency on a specific component.
 *
 * @param selectors CSS selector list matching the observed sections, e.g. `#about,#skills`
 * @param headerId  id of the sticky nav element, used to tell whether a section is above or below it
 * @param handler   called with the id of the section now considered current
 */
export const useNavObserver = (
  selectors: string,
  headerId: string,
  handler: (sectionId: string | null) => void,
) => {
  useEffect(() => {
    // Get all sections
    const headings = document.querySelectorAll(selectors)
    const headingsArray = Array.from(headings)
    const headerWrapper = document.getElementById(headerId)

    // Create the IntersectionObserver API
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentY = entry.boundingClientRect.y
          const id = entry.target.getAttribute('id')
          if (headerWrapper) {
            // Create a decision object
            const decision = {
              id,
              currentIndex: headingsArray.findIndex((heading) => heading.getAttribute('id') === id),
              isIntersecting: entry.isIntersecting,
              currentRatio: entry.intersectionRatio,
              belowToc: !(currentY < headerWrapper.getBoundingClientRect().y),
            }
            if (decision.isIntersecting) {
              // Section is within the top 30% of the viewport: it's the current one
              handler(decision.id)
            } else if (
              decision.currentRatio < 1 &&
              decision.currentRatio > 0 &&
              decision.belowToc
            ) {
              // Section just left the zone downwards (scrolling up): previous section is current
              const currentVisible = headingsArray[decision.currentIndex - 1]?.getAttribute('id')
              handler(currentVisible ?? null)
            }
          }
        })
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -70% 0px',
      },
    )
    // Observe all the sections
    headings.forEach((section) => observer.observe(section))
    // Cleanup
    return () => observer.disconnect()
  }, [selectors, headerId, handler])
}
