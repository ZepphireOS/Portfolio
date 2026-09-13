## 1. Template & Content Kickoff

- [ ] 1.1 Present 2-3 scaffolded/cloned template candidates from design.md's shortlist to the user and get their pick, verified by an explicit user selection recorded before scaffolding begins
- [ ] 1.2 Collect the user's master resume (and any initial project samples) and verify the raw content is available locally for transcription into data files
- [ ] 1.3 Confirm the resume-to-data-file transcription approach with the user (Claude transcribes vs. user fills in directly), verified by explicit user confirmation

## 2. Project Scaffold

- [ ] 2.1 Scaffold a Vite + React + TypeScript project, verified by `npm run dev` serving a default page locally
- [ ] 2.2 Install and configure Tailwind CSS, verified by a Tailwind utility class rendering correctly on the default page
- [ ] 2.3 Initialize shadcn/ui for the Vite setup and add the initial component set needed (Tabs, Card, at minimum), verified by importing and rendering one shadcn component without errors
- [ ] 2.4 Apply the chosen template's structural base (layout, base styling) from task 1.1, verified by the dev server showing the adapted template shell

## 3. Content Model

- [ ] 3.1 Define structured data files/types for resume sections (About, Experience, Skills/Education, Contact), verified by TypeScript compiling against sample entries
- [ ] 3.2 Define structured data files/types for project showcase entries (title, description, optional link, optional image), verified by TypeScript compiling against sample entries
- [ ] 3.3 Populate data files with the user's actual resume and project content from task 1.2, verified by content rendering correctly in each section

## 4. Tab Navigation & Sections

- [ ] 4.1 Implement tab-based navigation across About, Experience, Skills/Education, Projects, and Contact, verified by clicking each tab and confirming only that section's content is visible
- [ ] 4.2 Implement the About/Experience/Skills/Education/Contact section components consuming the data files from 3.1, verified by each section displaying the populated content
- [ ] 4.3 Implement the Projects tab consuming the data files from 3.2, verified by each project entry rendering its title, description, and optional link/image
- [ ] 4.4 Verify graceful handling of entries with missing optional fields (e.g., no end date, no project link/image), confirmed by rendering a deliberately incomplete sample entry without visual errors

## 5. Responsiveness & Polish

- [ ] 5.1 Verify and adjust layout at mobile, tablet, and desktop breakpoints, confirmed by manual resize/dev-tools device checks showing no overlap or horizontal scroll
- [ ] 5.2 Iterate on visual design per user critique (colors, spacing, typography, imagery), tracked informally as the user reviews the running dev server
- [ ] 5.3 Add any user-supplied images to relevant sections, verified by images rendering at appropriate sizes without layout breakage

## 6. Agent Integration Placeholder

- [ ] 6.1 Add an empty, fixed-position `AgentWidgetSlot` placeholder component to the layout, verified by the element being present in the DOM and rendering no visible UI or network activity
- [ ] 6.2 Confirm no network calls originate from the app (open network tab with app running), verified by an empty network request log for anything other than static asset loads

## 7. Final Verification

- [ ] 7.1 Run a full production build (`npm run build`) and serve it locally, verified by all tabs and content sections working identically to the dev server
- [ ] 7.2 Review against `specs/portfolio-frontend/spec.md` and `specs/portfolio-frontend/project-showcase/spec.md` scenario-by-scenario, verified by each scenario passing manual inspection
