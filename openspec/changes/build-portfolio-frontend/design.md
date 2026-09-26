## Context

Greenfield project — no application code exists yet. Two future changes are anticipated on top of this one: an AI "digital self" agent widget (a lightweight, retrieval-grounded agent behind a Cloudflare Worker backend proxy, no separate agent framework or GCP dependency) and a deployment change (GitHub Actions → GitHub Pages for the frontend + Cloudflare Workers for the backend, chosen to stay entirely on free tiers). This change only builds the static frontend shell; it must not foreclose those later choices. See proposal.md for motivation and scope.

An interactive storyboard was built and iterated on with the user before writing this design, and is checked in at `examples/storyboard.html` (relative reference from current dir, not from root). It is a static HTML/CSS/JS mockup — not React, not the final visual design — but it fixes the information architecture, navigation behavior, and interaction patterns described below, all of which came from direct user feedback across several rounds. Treat it as the authoritative reference for *structure and behavior*; treat its "engineering datasheet" visual styling (mono mixed with a display serif-adjacent font, sage/orange palette, corner registration marks) as one option, not a locked-in decision — color/type is still an open discussion with the user (see Open Questions). One exception to the storyboard's authority: the Timeline's interaction model (zoom/pan, adaptive labels) was added after the storyboard and supersedes it — in particular the storyboard's fixed 760px axis and 34px minimum bar height do not carry over.

## Goals / Non-Goals

**Goals:**
- Stand up a React + Tailwind CSS + shadcn/ui frontend, based on an existing open-source template's reference rather than a from-scratch design.
- Implement the four-section, scroll-linked single-page structure validated in the storyboard: About, Skills, Timeline, Projects.
- Implement the interactive popup pattern (click/tap to open, close via X / outside click / Escape) for Skills, Timeline, and Project entries.
- Implement the dual-sided Timeline (education+certifications vs. experience) with proportional date spans and overlap-aware layout.
- Keep content data-driven so the user can add entries/images over time without touching layout code.
- Leave a clean, inert integration slot for the future agent widget.
- Keep the build a static-output SPA so it can later be served from free-tier static hosting (e.g., GitHub Pages) with zero backend coupling.

**Non-Goals:**
- No agent, chat, or LLM integration in this change — that is a separate future change.
- No backend or API proxy — this frontend makes no network calls; popups are pure client-side state.
- No CI/CD or deployment configuration — a separate future change.
- No final visual/pixel-level design (color palette, typography) — the storyboard's "datasheet" look is a placeholder for discussion, not a locked decision; the user will critique and iterate on the chosen template's look during implementation.

## Decisions

**Framework: Vite + React + TypeScript (not Next.js), despite most shadcn/ui showcase templates being Next.js-based.**
Rationale: the backend responsibilities (agent proxy, credit check) are being handled by a standalone Cloudflare Worker, not by framework API routes, and the deployment target favors a plain static bundle (GitHub Pages) over a Next.js server or its static-export caveats. shadcn/ui officially supports a Vite + React setup, so nothing is lost by skipping Next.js.

**Template approach: use [tbakerx/react-resume-template](https://github.com/tbakerx/react-resume-template) as the visual/structural reference, hand-ported into the existing Vite + React + shadcn/ui setup rather than cloned/forked directly.**
Because tbakerx's repo is Next.js-based and the Framework decision above keeps this project on Vite, it is not applied as a literal scaffold. One specific piece *is* adopted directly in behavior: tbakerx's `Header.tsx` uses a custom `useNavObserver` hook wrapping the Intersection Observer API to track the section in view and highlight the matching nav link, with anchor links and `scroll-behavior: smooth` doing the scrolling — this is the pattern the Scroll-Linked Navigation requirement is built on. tbakerx's Portfolio section (hover-overlay cards linking out) was explicitly *not* carried over — the user wants click-to-open popups with full detail instead, which is a deliberate departure from the reference, not an oversight.

**Information architecture: About (incl. contact links), Skills, Timeline, Projects — four sections, not five.**
Earlier drafts of this design had five sections (About, Experience, Skills/Education, Projects, Contact). Through the storyboard review, the user asked to: fold Contact into About as icon links (GitHub, LinkedIn, email — no phone, no location); move Skills above the combined Experience/Education; and merge Experience and Education (plus certifications) into one "Timeline" section. This is now the structure the spec and tasks are written against.

**Timeline: two-sided, date-proportional layout driven by a zoomable time-scale model, with N-column overlap assignment.**
Education and certifications render on one side, experience on the other, both positioned against one shared vertical time scale (not just listed with a single end date each). Entries are computed from `{start, end|ongoing}` month-year pairs. Positions are not fixed pixels: a time-scale model (`pxPerMonth` + scroll `offset`) maps dates to `top = (monthIndex − origin) × pxPerMonth − offset`, and bar height is the true span with no minimum — so zooming changes lengths only, while column widths stay fixed. The minimum zoom is the scale at which the whole range fits the viewport; the maximum is a fixed cap.

Overlaps use the storyboard's `assignLanes` greedy algorithm (sort by start, place each entry in the first column whose last end ≤ its start, else open a new column), which already handles any number of columns — each column gets a distinct color. Columns keep a fixed width; if many simultaneous overlaps exceed the side's width, the side narrows its columns rather than letting bars overlap.

Labels are chosen per entry from its rendered pixel height against known constants (title line height, details block height, padding): full text if both fit, title only if only the title fits, nothing otherwise. Computed from the scale, not measured from the DOM each frame, so it stays cheap during continuous zoom. Hidden-text entries keep an `aria-label` with the title. A one-day event (e.g., a hackathon) renders as a point marker on the axis, not a bar, and is unaffected by label fitting.

**Timeline input layer: `@use-gesture/react` for pinch, wheel, and drag.**
Browsers deliver trackpad pinch as `wheel` events with `ctrlKey: true` (Chromium/Firefox) and as `gesture*` events on Safari; handling these consistently, with non-passive listeners so `preventDefault` stops page zoom, is what the library normalizes. Pinch zooms anchored at the pointer; zoom buttons (top-right of the Timeline) zoom by a fixed step anchored at the viewport center. Plain wheel pans only when zoomed in. At a pan edge the Timeline distinguishes carry-over momentum from deliberate scrolling: browsers don't flag momentum events, so after the edge is hit, a run of wheel events with *decaying* deltas is treated as momentum and swallowed, while a pause in wheel events (~150ms, i.e. a new gesture) or steady/increasing deltas (a notched mouse wheel, or the user pushing again) is treated as deliberate and passed to page scroll. At minimum zoom the wheel always goes to the page. Touch follows the same model: a one-finger drag pans only while zoomed in, the Timeline's own fling momentum stops at the edge, and a fresh drag toward that edge is forwarded to page scroll; at minimum zoom the Timeline yields touch to native page scrolling. Touch pinch is not handled — tablets use the zoom buttons. Drag pans via pointer capture, and only counts as a drag after ~4px of movement so clicks still open popups. Alternative considered: hand-rolled Pointer Events + wheel handling — viable, but re-implements the cross-browser pinch normalization. Zoom/pan applies to the dual-axis layout only; the mobile single-column fallback stays a plain list, since touch pinch there would compete with native page zoom.

**Popup pattern: a single shared modal/dialog, populated per-entry, for Skills, Timeline, and Project entries.**
One modal component, opened with different content depending on what was activated, rather than a bespoke popup per section — keeps the interaction consistent and the implementation small. Closes via a close-control click, an outside click on the backdrop, or the Escape key (all three verified working in the storyboard).

**Projects without images: a per-category type icon in the image slot, not a blank box.**
Given the user may not have a screenshot for every project, each project gets a small icon (e.g., a pipeline diagram, a viewfinder, a node graph, a waveform) representing its kind, shown in the same visual slot an image would occupy — image and icon are treated as interchangeable content for that slot, so adding a real screenshot later is a content change, not a layout change.

**Skill popups: template/placeholder content, since the usage/learning-source mapping doesn't exist yet.**
The user does not yet have "which experience used this skill" or "where I learned it" data written. Skill popups render a clearly-marked placeholder (e.g., "— add your notes here —") for those two fields, which the user can rewrite once the page exists, rather than blocking this change on writing that content now.

**Content model: structured local data (e.g., TypeScript/JSON data files) per section, consumed by presentational components.**
Rationale: satisfies the "add content/images over time without layout rework" requirement, keeps content decoupled from components, and needs no backend or CMS for a single-owner portfolio.

**Agent integration point: a single, empty, fixed-position layout slot/component (e.g., an `AgentWidgetSlot` placeholder) with no logic.**
Rationale: gives the future agent-widget change a clear insertion point without this change guessing at that change's internal design.

## Risks / Trade-offs

- [Chosen tbakerx template may look dated or clash with desired aesthetic, and the user has explicitly said they'll modify it "to a significant extreme"] → Mitigation: treat this as expected, normal iteration; the template (and the storyboard's own "datasheet" styling) are structural/visual starting points only, not the target.
- [Porting tbakerx's `useNavObserver` scrollspy logic into a Vite app is manual work, not copy-paste, since the rest of the template is Next.js] → Mitigation: the hook itself is plain React (Intersection Observer + state), not Next.js-specific — it ports cleanly on its own even though the surrounding template doesn't.
- [Momentum detection is heuristic — no browser exposes a "momentum" flag on wheel events] → Mitigation: tune the pause and decay thresholds against a real trackpad and a notched mouse wheel; when in doubt, let the event through to the page, so the worst case is page scroll arriving slightly early, never a trapped page.
- [Trackpad pinch triggering browser page zoom instead of Timeline zoom] → Mitigation: non-passive listeners that `preventDefault` ctrl+wheel and Safari gesture events over the Timeline; verified per browser in task 6.5.
- [Many simultaneous overlaps on one side make columns cramped] → Mitigation: the N-column algorithm guarantees no overlap; columns narrow if needed, and adaptive labels hide text that no longer fits. Re-check readability if three or more entries ever overlap at once on the real data.
- [Skill popups shipping with placeholder text] → Mitigation: explicitly spec'd as acceptable (see Skill Detail Supports Placeholder Content requirement) so it isn't mistaken for a bug; clearly marked as a placeholder in the UI itself.

## Open Questions

- Final color palette and typography — the storyboard's palette was the assistant's own placeholder choice and has not yet been discussed with the user; to be resolved as its own design pass, separate from the structural work this change is scoped to.
- Whether the master resume will be supplied as a document to transcribe into the data files, or the user will fill in the data files directly — to be clarified when implementation starts.
