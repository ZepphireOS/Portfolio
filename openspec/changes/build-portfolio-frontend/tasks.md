## 1. Template & Content Kickoff

- [x] 1.1 Review `examples/storyboard.html` in a browser together with the user as the structural/interaction reference (not visual reference — palette/type are still open), verified by explicit user confirmation before scaffolding begins
- [x] 1.2 Collect the user's master resume (and any initial project samples/images) and verify the raw content is available locally for transcription into data files
- [x] 1.3 Confirm the resume-to-data-file transcription approach with the user (Claude transcribes vs. user fills in directly), verified by explicit user confirmation

## 2. Project Scaffold

- [x] 2.1 Scaffold a Vite + React + TypeScript project, verified by `npm run dev` serving a default page locally
- [x] 2.2 Install and configure Tailwind CSS, verified by a Tailwind utility class rendering correctly on the default page
- [x] 2.3 Initialize shadcn/ui for the Vite setup and add the initial component set needed (Dialog/Popover for the shared popup, Card), verified by importing and rendering one shadcn component without errors
- [x] 2.4 Port tbakerx's `useNavObserver` Intersection-Observer scrollspy hook (plain React, not Next.js-specific) into the Vite app, verified by a minimal test page highlighting the correct nav item while scrolling

## 3. Content Model

- [x] 3.1 Define structured data types/files for About (bio, contact links) and Skills (name, category, and optional usage/learned-via notes), verified by TypeScript compiling against sample entries
- [x] 3.2 Define structured data types/files for Timeline entries (`kind`: role/degree/certificate/event, `start`, `end` or ongoing flag, org, bullets), verified against the same real dates used in the storyboard
- [x] 3.3 Define structured data types/files for Project entries (title, description, optional link, optional image, category icon fallback), verified by TypeScript compiling against sample entries
- [ ] 3.4 Populate all data files with the user's actual resume and project content from task 1.2, verified by content rendering correctly in each section

## 4. Sections & Scroll Navigation

- [x] 4.1 Implement the sticky, scroll-linked nav bar (About/Skills/Timeline/Projects) using the ported scrollspy hook, verified by scrolling the page and confirming the nav highlights the section in view, and by clicking a nav item and confirming a smooth scroll to that section
- [x] 4.2 Implement the About section: bio content, photo (with a deliberate non-blank placeholder if no photo is supplied yet), and GitHub/LinkedIn/email icon links — no phone number, no location — verified against the Contact Links Without Sensitive Details scenario
- [x] 4.3 Implement the Skills section from the data files, each skill rendered as an interactable element, verified by every skill being clickable

## 5. Shared Popup Component

- [ ] 5.1 Implement one shared modal/popup component used by Skills, Timeline, and Project entries, verified by opening it with different sample content from each of the three sections
- [ ] 5.2 Implement all three close behaviors (close-control click, outside/backdrop click, Escape key), verified by testing each independently
- [ ] 5.3 Implement the Skill popup's placeholder usage/learned-via content, clearly marked as a placeholder, verified against the Skill Detail Supports Placeholder Content scenario

## 6. Timeline

- [ ] 6.1 Implement the two-sided, date-proportional Timeline layout (education/certifications left, experience right, shared time axis with year ticks and a "present" marker) inside a bounded viewport, positioned from a time-scale model (`pxPerMonth` + offset) with no minimum bar height, verified against the real dates from `examples/storyboard.html`
- [ ] 6.2 Port the N-column overlap assignment algorithm from the storyboard (`assignLanes`), verified by the known overlapping pair (the Udemy ADK certificate and the still-in-progress Master's degree) rendering in separate columns with distinct colors, and by a synthetic three-way overlap rendering three columns with no bar overlapping another
- [ ] 6.3 Implement the one-day-event point marker (for entries with no end date span), verified by the hackathon entry rendering as a point rather than a bar
- [ ] 6.4 Implement zoom limits (min = whole range fits the viewport, max = fixed cap) and zoom-in/zoom-out buttons at the Timeline's top-right, verified by button clicks changing entry lengths but not widths, zooming around the viewport center, and each button disabling at its limit
- [ ] 6.5 Implement trackpad pinch zoom via `@use-gesture/react`, verified in Chromium, Firefox, and Safari by pinching over the Timeline zooming it around the pointer without zooming the browser page
- [ ] 6.6 Implement wheel and drag panning with edge handling, verified by: wheel panning the Timeline while zoomed in; a trackpad flick's momentum stopping at a pan edge without scrolling the page; a new or continued scroll at that edge scrolling the page; a notched mouse wheel at the edge scrolling the page; wheel scrolling the page at minimum zoom; drag panning with the pointer; a drag not opening a popup while a click still does; and panning staying bounded between the earliest entry and the present marker
- [ ] 6.7 Implement adaptive entry labels (full text / title only / none, chosen from rendered height), verified by zooming out step by step and seeing each entry go full → title-only → no text with no partially clipped text, and a no-text entry still opening its popup and exposing an accessible name
- [ ] 6.8 Implement touch handling at dual-axis widths, verified on a touch device or emulator by: a drag panning only while zoomed in, a flick's momentum stopping at the edge, a fresh drag at the edge scrolling the page, a drag at minimum zoom scrolling the page, and the zoom buttons working
- [ ] 6.9 Implement the Timeline's mobile fallback (single-column stack when the dual-axis layout won't fit, no zoom/pan), verified at a mobile viewport width

## 7. Projects

- [ ] 7.1 Implement the Projects grid with the shared popup pattern, verified by each project opening its popup with full description and (image or category icon)
- [ ] 7.2 Implement the category-icon fallback for projects without an image, verified by at least one project with a real image and at least one without rendering cleanly side by side

## 8. Responsiveness & Polish

- [ ] 8.1 Verify and adjust layout at mobile, tablet, and desktop breakpoints for all four sections, confirmed by manual resize/dev-tools device checks showing no overlap or horizontal scroll
- [ ] 8.2 Hold the color/typography discussion with the user (see design.md Open Questions) and iterate on visual design per their critique, tracked informally as they review the running dev server
- [ ] 8.3 Add any user-supplied images (photo, project screenshots) to relevant sections, verified by images rendering at appropriate sizes without layout breakage

## 9. Agent Integration Placeholder

- [ ] 9.1 Add an empty, fixed-position `AgentWidgetSlot` placeholder component to the layout, verified by the element being present in the DOM and rendering no visible UI or network activity
- [ ] 9.2 Confirm no network calls originate from the app (open network tab with app running), verified by an empty network request log for anything other than static asset loads

## 10. Final Verification

- [ ] 10.1 Run a full production build (`npm run build`) and serve it locally, verified by all sections, scroll navigation, and popups working identically to the dev server
- [ ] 10.2 Review against `specs/portfolio-frontend/spec.md` and `specs/portfolio-frontend/project-showcase/spec.md` scenario-by-scenario, verified by each scenario passing manual inspection
