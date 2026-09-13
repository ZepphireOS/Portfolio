## Purpose

Provides a dedicated project showcase tab within the portfolio that presents samples of the user's past project work as a distinct, extensible content area separate from the core resume sections.

## ADDED Requirements

### Requirement: Project Showcase Tab
The system SHALL present a dedicated "Projects" tab, navigable the same way as the other resume-derived tabs, that lists samples of the user's past project work.

#### Scenario: Visitor opens the Projects tab
- **WHEN** a visitor selects the "Projects" tab
- **THEN** the system displays a list or grid of project entries distinct from the About/Experience/Skills/Contact content

### Requirement: Project Entry Details
The system SHALL render each project entry with, at minimum, a title and description, and SHALL support optional fields including a link (e.g., to a live demo or repository) and one or more images.

#### Scenario: Project entry with all optional fields
- **WHEN** a project entry includes a title, description, link, and image
- **THEN** the system displays all four elements for that entry

#### Scenario: Project entry with only required fields
- **WHEN** a project entry includes only a title and description
- **THEN** the system displays the entry without broken links or empty image placeholders

### Requirement: Extensible Project List
The system SHALL allow new project entries to be added to the showcase over time without requiring changes to the Projects tab's layout structure.

#### Scenario: Adding a new project
- **WHEN** a new entry is added to the project data source
- **THEN** the Projects tab displays the new entry alongside existing ones without layout rework
