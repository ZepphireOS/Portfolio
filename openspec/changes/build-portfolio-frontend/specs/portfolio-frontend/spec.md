## Purpose

Provides the core portfolio site shell — layout, scroll-linked navigation, and resume-derived content sections — that presents the user's background to visitors and serves as the foundation later changes (AI agent widget, deployment) build on.

## ADDED Requirements

### Requirement: Scroll-Linked Navigation
The system SHALL present the portfolio as a single continuous page divided into sections (at minimum: About, Skills, Timeline, Projects), with a persistent navigation bar whose items link to those sections. Selecting a navigation item SHALL smoothly scroll the page to that section, and the navigation SHALL indicate which section is currently in view as the visitor scrolls.

#### Scenario: Visitor selects a navigation item
- **WHEN** a visitor selects a navigation item for a different section (e.g., from "About" to "Timeline")
- **THEN** the page scrolls to that section without a full page reload

#### Scenario: Navigation reflects scroll position
- **WHEN** a visitor scrolls the page so that a different section enters the viewport
- **THEN** the navigation bar updates to indicate that section as the current one, without requiring a click

### Requirement: Resume-Derived Content Sections
The system SHALL render each section's content from a structured resume data source (not hardcoded prose mixed into layout code), covering the user's background, skills, work experience, education, certifications, and project work.

#### Scenario: Content reflects the resume data source
- **WHEN** the resume data source contains a given entry (e.g., a job, a skill, a degree, a certification)
- **THEN** the corresponding section displays that entry's details

#### Scenario: Missing optional field is handled gracefully
- **WHEN** an entry in the resume data source omits an optional field (e.g., no end date for a current role)
- **THEN** the system renders the entry without error or visible placeholder artifacts

### Requirement: Interactive Detail Popups
The system SHALL render Skills, Timeline (experience/education/certification), and Project entries as individually interactable elements. Activating one SHALL open a popup showing that entry's fuller detail. The popup SHALL close when the visitor selects a close control, clicks/taps outside the popup, or presses the Escape key.

#### Scenario: Activating an entry opens its detail
- **WHEN** a visitor activates a Skill, Timeline, or Project entry
- **THEN** the system opens a popup containing that entry's fuller detail (and an image, when one exists for that entry)

#### Scenario: Closing via the close control
- **WHEN** a visitor selects the popup's close control
- **THEN** the popup closes and the underlying page remains at the same scroll position

#### Scenario: Closing via outside click
- **WHEN** a visitor clicks or taps outside the open popup's bounds
- **THEN** the popup closes

#### Scenario: Closing via Escape key
- **WHEN** a visitor presses the Escape key while a popup is open
- **THEN** the popup closes

#### Scenario: Entry without an image still presents cleanly
- **WHEN** an activated entry has no associated image
- **THEN** the popup presents a deliberate, non-blank visual treatment in place of the image, not empty space or a broken image element

### Requirement: Skill Detail Supports Placeholder Content
The system SHALL support showing, for each Skill entry's popup, notes on where the skill was used and how it was learned, without requiring that data to be authored before the site can be built — placeholder content SHALL be visibly distinguishable as a placeholder pending later authoring.

#### Scenario: Skill popup before real notes are authored
- **WHEN** a visitor activates a Skill entry whose usage/learning notes have not yet been written
- **THEN** the popup displays clearly-marked placeholder text rather than blank space or fabricated detail

### Requirement: Unified Timeline of Experience, Education, and Certifications
The system SHALL present work experience on one side of a shared, dated timeline and education (including certifications) on the other side, both read against the same time scale. Each entry SHALL visually reflect its actual start-to-end span, not only its end date.

#### Scenario: Entry duration is visible
- **WHEN** a Timeline entry has a defined start and end date
- **THEN** its rendered span reflects both dates, and the dates are shown as text on the entry whenever they fit (per Adaptive Timeline Entry Labels) and always in the entry's detail popup

#### Scenario: Ongoing entry
- **WHEN** a Timeline entry has no end date (an ongoing role)
- **THEN** the system renders it extending to the present, distinguishable from entries with a definite end date

#### Scenario: Overlapping entries occupy separate columns
- **WHEN** two or more entries on the same side of the timeline overlap in time
- **THEN** each is placed in its own column beside the others so that no entry overlaps or obscures another, and an entry that overlaps nothing reuses the innermost free column

### Requirement: Zoomable, Pannable Timeline Viewport
The system SHALL render the dual-axis Timeline inside a bounded viewport whose time scale can be zoomed and panned. Zooming SHALL change every entry's vertical length in proportion to the time scale and SHALL NOT change entry widths. At the minimum zoom level the entire timeline SHALL fit within the viewport. This requirement applies to the dual-axis layout; the narrow-viewport single-column fallback is not required to support zoom or pan.

#### Scenario: Trackpad pinch zooms the timeline
- **WHEN** a visitor pinches on a trackpad over the Timeline
- **THEN** the time scale zooms in or out anchored at the pointer position, entries grow or shrink in length only, and the browser page itself does not zoom

#### Scenario: Zoom buttons
- **WHEN** a visitor selects the zoom-in or zoom-out control at the top-right of the Timeline
- **THEN** the time scale zooms by a fixed step anchored at the viewport's center, and each control is disabled at its respective zoom limit

#### Scenario: Wheel pans when zoomed
- **WHEN** the Timeline is zoomed in and a visitor scrolls the mouse wheel over it
- **THEN** the Timeline pans up or down in the scroll direction instead of the page scrolling

#### Scenario: Drag pans when zoomed
- **WHEN** the Timeline is zoomed in and a visitor drags within it
- **THEN** the Timeline pans with the pointer, and releasing the drag does not open an entry popup

#### Scenario: Momentum stops at the pan edge
- **WHEN** the Timeline is zoomed in and carry-over momentum from a scroll or flick pans it to its limit
- **THEN** the Timeline stops at that limit and the leftover momentum does not scroll the page

#### Scenario: Continued scrolling passes to the page
- **WHEN** the Timeline is at minimum zoom, or a visitor actively scrolls (a new gesture, or continued deliberate scrolling) toward an edge the Timeline is already panned to
- **THEN** the page scrolls normally

#### Scenario: Touch input at dual-axis widths
- **WHEN** a visitor on a touch device uses the dual-axis Timeline
- **THEN** a one-finger drag pans the Timeline only while it is zoomed in, following the same momentum and edge rules; a drag at minimum zoom scrolls the page; and zooming is available through the zoom buttons (touch pinch is not required)

#### Scenario: Pan limits
- **WHEN** a visitor pans the Timeline
- **THEN** the view stays bounded between the earliest entry and the present marker

### Requirement: Adaptive Timeline Entry Labels
The system SHALL show a Timeline entry's text only to the extent that it fits within the entry's rendered length at the current zoom, and SHALL NOT show partially clipped text.

#### Scenario: All text fits
- **WHEN** an entry's rendered length can hold its title and secondary details (organization, dates)
- **THEN** the entry shows the title and the secondary details

#### Scenario: Only the title fits
- **WHEN** an entry's rendered length can hold its title but not its secondary details
- **THEN** the entry shows only its title, and the secondary details reappear once zooming lengthens the entry enough to hold them

#### Scenario: No text fits
- **WHEN** an entry's rendered length cannot hold even its title
- **THEN** the entry shows no text, remains visible and activatable (opening its full-detail popup), and retains an accessible name

### Requirement: Contact Links Without Sensitive Details
The system SHALL present contact links (at minimum: professional profile and email) as part of the About section, and SHALL NOT display the user's phone number or physical location.

#### Scenario: Visitor looks for contact info
- **WHEN** a visitor views the About section
- **THEN** they find working links to the user's contact channels, with no phone number or location shown anywhere on the site

### Requirement: Incremental Content and Image Updates
The system SHALL allow new content entries and images to be added to any section over time without requiring changes to the section's layout structure.

#### Scenario: Adding a new timeline entry
- **WHEN** a new entry is added to the resume data source for the Timeline
- **THEN** the Timeline displays the new entry alongside existing ones without layout rework

#### Scenario: Adding an image to a section
- **WHEN** an image is associated with a content entry (e.g., a profile photo or a project screenshot)
- **THEN** the system displays the image within that entry's rendered content or popup

### Requirement: Responsive Layout
The system SHALL render a usable, readable layout across common viewport sizes, including desktop and mobile widths, including the two-sided Timeline.

#### Scenario: Mobile viewport
- **WHEN** the site is viewed on a mobile-width viewport
- **THEN** the navigation and section content remain usable without horizontal scrolling or overlapping elements

#### Scenario: Timeline on a narrow viewport
- **WHEN** the Timeline is viewed on a mobile-width viewport
- **THEN** it remains readable (e.g., by stacking to a single column) rather than compressing into an unreadable dual-column layout

### Requirement: Reserved Agent Widget Integration Point
The system SHALL include a designated layout region (e.g., a fixed-position slot) reserved for a future floating AI agent widget, without rendering any agent, chat, or network-calling functionality in that region as part of this capability.

#### Scenario: Integration point present but inactive
- **WHEN** the portfolio site is loaded
- **THEN** the reserved widget region exists in the layout and performs no network calls or agent behavior

### Requirement: No Backend Dependency
The system SHALL function as a fully static frontend, requiring no backend service, API, or database to render any section or popup.

#### Scenario: Site loads without backend availability
- **WHEN** the portfolio site's static assets are served with no backend service running
- **THEN** all sections (About, Skills, Timeline, Projects) and their popups render and function correctly
