## Purpose

Provides the core portfolio site shell — layout, tab-based navigation, and resume-derived content sections — that presents the user's background to visitors and serves as the foundation later changes (AI agent widget, deployment) build on.

## ADDED Requirements

### Requirement: Tab-Based Navigation
The system SHALL present the portfolio's distinct resume aspects (at minimum: About, Experience, Skills/Education, Contact) as separate, individually selectable tabs or equivalent sectioned navigation within a single page.

#### Scenario: Visitor switches between sections
- **WHEN** a visitor selects a different tab (e.g., from "About" to "Experience")
- **THEN** the system displays only the content for the selected section without a full page reload

#### Scenario: Direct navigation to a section
- **WHEN** a visitor loads the site with a URL or state indicating a specific tab
- **THEN** the system displays that tab as the active section on load

### Requirement: Resume-Derived Content Sections
The system SHALL render each non-project tab's content from a structured resume data source (not hardcoded prose mixed into layout code), covering the user's background, work experience, skills, education, and contact information.

#### Scenario: Content reflects the resume data source
- **WHEN** the resume data source contains a given entry (e.g., a job, a skill, a contact method)
- **THEN** the corresponding tab displays that entry's details (title/role, dates, description as applicable)

#### Scenario: Missing optional field is handled gracefully
- **WHEN** an entry in the resume data source omits an optional field (e.g., no end date for current role)
- **THEN** the system renders the entry without error or visible placeholder artifacts

### Requirement: Incremental Content and Image Updates
The system SHALL allow new content entries and images to be added to any resume section over time without requiring changes to the tab/section layout structure.

#### Scenario: Adding a new experience entry
- **WHEN** a new entry is added to the resume data source for an existing section
- **THEN** the section displays the new entry alongside existing ones without layout rework

#### Scenario: Adding an image to a section
- **WHEN** an image is associated with a content entry (e.g., a profile photo or section illustration)
- **THEN** the system displays the image within that entry's rendered content

### Requirement: Responsive Layout
The system SHALL render a usable, readable layout across common viewport sizes, including desktop and mobile widths.

#### Scenario: Mobile viewport
- **WHEN** the site is viewed on a mobile-width viewport
- **THEN** the tab navigation and section content remain usable without horizontal scrolling or overlapping elements

### Requirement: Reserved Agent Widget Integration Point
The system SHALL include a designated layout region (e.g., a fixed-position slot) reserved for a future floating AI agent widget, without rendering any agent, chat, or network-calling functionality in that region as part of this capability.

#### Scenario: Integration point present but inactive
- **WHEN** the portfolio site is loaded
- **THEN** the reserved widget region exists in the layout and performs no network calls or agent behavior

### Requirement: No Backend Dependency
The system SHALL function as a fully static frontend, requiring no backend service, API, or database to render any resume content section.

#### Scenario: Site loads without backend availability
- **WHEN** the portfolio site's static assets are served with no backend service running
- **THEN** all resume content sections (About, Experience, Skills/Education, Contact) render correctly
