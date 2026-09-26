## Why

The user currently has no portfolio site. A resume-driven, single-page personal site is needed to present background, experience, and project work in an interactive web format, ahead of a later change that adds an AI "digital self" agent widget on top of this frontend.

## What Changes

- Scaffold a new React + Tailwind CSS + shadcn/ui frontend application (no backend in this change).
- Research and select an existing open-source portfolio template (React/Tailwind/shadcn-based) to build on, rather than a from-scratch design, and document the shortlist/decision in design.md.
- Build a single-page, scroll-linked layout with four sections — About (including contact links), Skills, Timeline, Projects — and a sticky nav that tracks the section in view, all sourced from a master resume the user will supply and iterate on.
- Present experience, education, and certifications as one two-sided, date-proportional Timeline that visitors can zoom (trackpad pinch or on-screen buttons) and pan (wheel or drag), with overlapping entries in separate columns and labels that adapt to each entry's rendered length.
- Make Skills, Timeline, and Project entries open a shared detail popup on click.
- Build a dedicated Projects section that showcases samples of past project work (descriptions, links, and optionally images) separately from the core resume sections.
- Support incremental addition of images and content over time without requiring structural rework (e.g., content kept in structured data files/components rather than hardcoded inline).
- Leave an integration point (layout-level placeholder/slot) for a future floating AI agent widget, without implementing the agent, backend, or any LLM integration in this change.
- Exclude any backend, API keys, deployment pipeline, or hosting setup from this change — those are covered by separate future changes.

## Capabilities

### New Capabilities
- `portfolio-frontend`: Core site shell — layout, scroll-linked navigation, detail popups, and resume-derived content sections (About with contact links, Skills, and an interactive zoomable Timeline of experience/education/certifications) built with React, Tailwind CSS, and shadcn/ui, based on a selected open-source template and populated from user-supplied resume content.
- `portfolio-frontend/project-showcase`: Dedicated project gallery section presenting samples of the user's project work (title, description, links, optional images) as a distinct, extensible content area within the portfolio.

### Modified Capabilities
(none — greenfield project, no existing specs)

## Impact

- New frontend application code (React + Tailwind + shadcn/ui), package manifest, and build tooling — all created from scratch under this repo.
- New structured content source(s) for resume-derived data (e.g., JSON/TS data files) that the user will populate and revise iteratively.
- No backend, API, database, or deployment infrastructure is touched or introduced by this change.
- Establishes the layout/component structure that a later change (AI agent widget) and a later deployment change (GitHub Actions + GCP) will build on top of.
