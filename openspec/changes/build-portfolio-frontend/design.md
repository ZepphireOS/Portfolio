## Context

Greenfield project — no application code exists yet. Two future changes are anticipated on top of this one: an AI "digital self" agent widget (backend proxy in Google Cloud Functions, using Gemini via the Google Agent Development Kit (ADK), with credit/balance-aware behavior) and a deployment change (GitHub Actions → GCP, likely Firebase Hosting for static assets + Cloud Functions for the agent proxy, chosen to stay within free-tier usage). This change only builds the static frontend shell; it must not foreclose those later choices. See proposal.md for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Stand up a React + Tailwind CSS + shadcn/ui frontend, based on an existing open-source template rather than a from-scratch design.
- Establish a tab-based structure covering resume content (About, Experience, Skills/Education, Contact) plus a distinct Projects showcase tab.
- Keep content data-driven so the user can add entries/images over time without touching layout code.
- Leave a clean, inert integration slot for the future agent widget.
- Keep the build a static-output SPA so it can later be served from free-tier static hosting (e.g., Firebase Hosting) with zero backend coupling.

**Non-Goals:**
- No agent, chat, LLM, or Google ADK integration in this change — that is a separate future change.
- No backend, Cloud Functions, or API proxy — this frontend makes no network calls.
- No CI/CD or GCP deployment configuration — a separate future change.
- No final visual/pixel-level design decisions — the user will critique and iterate on the chosen template's look during implementation; this design fixes the technical foundation only.

## Decisions

**Framework: Vite + React + TypeScript (not Next.js), despite most shadcn/ui showcase templates being Next.js-based.**
Rationale: the backend responsibilities (agent proxy, credit check) are being handled by a standalone Google Cloud Function/ADK service, not by framework API routes, and the deployment target favors a plain static bundle (Firebase Hosting/GCS) over a Next.js server or its static-export caveats. shadcn/ui officially supports a Vite + React setup, so nothing is lost by skipping Next.js. Alternative considered: adopt a Next.js shadcn template directly and only use its static export — rejected because it carries Next.js routing/build complexity for no benefit here.

**Template approach: use a plain React + Tailwind portfolio template as the structural/layout base, then layer in shadcn/ui components (Tabs, Card, etc.) for interactive primitives, rather than forcing a Next.js shadcn template into Vite.**
Shortlist researched (all open-source):
- [tbakerx/react-resume-template](https://github.com/tbakerx/react-resume-template) — React/TS/Tailwind resume-style site; Next.js-based, would need adaptation to Vite or a Next.js reconsideration.
- [BraydenTW/react-tailwind-portfolio](https://github.com/BraydenTW/react-tailwind-portfolio) — plain React + Tailwind, no framework lock-in; closest fit for a Vite base, no shadcn out of the box (would be added manually).
- [techwithanirudh/shadcn-portfolio](https://github.com/techwithanirudh/shadcn-portfolio) — Next.js + shadcn/ui + Framer Motion; strong visual/component reference even if not used as the literal scaffold.
- [shadcn.io template catalog](https://www.shadcn.io/template) — large collection of shadcn/ui blocks/templates (mostly Next.js) useful for cherry-picking individual components (tab navigation, card grids) regardless of base framework.

Final template pick and visual direction will be selected interactively with the user at the start of implementation (see Open Questions) rather than locked in here, since the user has said they will critique and revise the design iteratively.

**Content model: structured local data (e.g., TypeScript/JSON data files) per section, consumed by presentational components.**
Rationale: satisfies the "add content/images over time without layout rework" requirement, keeps content decoupled from components, and needs no backend or CMS for a single-owner portfolio. Alternative considered: headless CMS — rejected as unnecessary complexity for one user's content.

**Agent integration point: a single, empty, fixed-position layout slot/component (e.g., an `AgentWidgetSlot` placeholder) with no logic.**
Rationale: gives the future agent-widget change a clear insertion point without this change guessing at that change's internal design (Google ADK, Gemini, credit-check UX are all decided later).

## Risks / Trade-offs

- [Chosen React+Tailwind base template may look dated or clash with desired aesthetic] → Mitigation: template is a structural starting point only; the user will iteratively critique and the design is expected to diverge visually from any single source template.
- [Skipping Next.js means manually porting any Next.js-only shadcn template pieces to Vite] → Mitigation: prefer plain React/Tailwind templates as the base and adapt individual shadcn component code (which is copy-in, not a package dependency) rather than a whole Next.js template.
- [Reserved agent slot's shape may not match what the future ADK-based widget actually needs] → Mitigation: keep the slot minimal (a positioned empty container) so it imposes no real constraint; the agent change can restructure it freely.

## Open Questions

- Exact template repository/starting point and initial visual theme — to be chosen interactively with the user at the start of the tasks phase, after they see a couple of scaffolded options.
- Whether the master resume will be supplied as a document to transcribe into the data files, or the user will fill in the data files directly — to be clarified when implementation starts.
