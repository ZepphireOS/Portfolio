## Purpose

Provides a dedicated Projects section within the portfolio that presents samples of the user's past project work as a distinct, extensible, and interactively explorable content area separate from the core resume sections.

## ADDED Requirements

### Requirement: Project Showcase Section
The system SHALL present a dedicated "Projects" section, reachable the same way as the portfolio's other sections, that displays samples of the user's past project work as individually interactable entries (per the core capability's Interactive Detail Popups requirement).

#### Scenario: Visitor reaches the Projects section
- **WHEN** a visitor navigates to the "Projects" section
- **THEN** the system displays a grid of project entries distinct from the About/Skills/Timeline content

### Requirement: Project Entry Details
The system SHALL render each project entry with, at minimum, a title and description, and SHALL support optional fields including a link (e.g., to a live demo or repository) and one or more images.

#### Scenario: Project entry with all optional fields
- **WHEN** a project entry includes a title, description, link, and image
- **THEN** the system displays all four elements for that entry (image and full description in its popup)

#### Scenario: Project entry with only required fields
- **WHEN** a project entry includes only a title and description
- **THEN** the system displays the entry without broken links or empty image placeholders

### Requirement: Deliberate Treatment for Projects Without an Image
The system SHALL render a project entry that has no image with a distinct, intentional visual (e.g., a type/category icon) in the image's place, both in the grid and in its popup, rather than a blank area.

#### Scenario: Project without an image
- **WHEN** a project entry has no associated image
- **THEN** its card and popup both show the same deliberate stand-in visual instead of blank space

#### Scenario: Mixed presence of images across projects
- **WHEN** some project entries have images and others do not
- **THEN** both kinds render cleanly side by side, with the presence or absence of an image being visually intentional rather than inconsistent

### Requirement: Extensible Project List
The system SHALL allow new project entries to be added to the showcase over time without requiring changes to the Projects section's layout structure.

#### Scenario: Adding a new project
- **WHEN** a new entry is added to the project data source
- **THEN** the Projects section displays the new entry alongside existing ones without layout rework
