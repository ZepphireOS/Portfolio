## Context

Third of three related changes delivering the digital-self chat feature. Builds on the reserved `AgentWidgetSlot` placeholder from `build-portfolio-frontend` and calls the endpoint defined in `add-agent-backend-proxy`. Lives in the existing `frontend/` folder alongside the rest of the portfolio site. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Deliver a usable floating chat UI, consistent with the existing React + Tailwind + shadcn/ui stack from `build-portfolio-frontend`.
- Make the "no credits" case feel like a normal, honest reply from the digital-self persona rather than a broken feature.
- Keep the widget a thin client of the backend proxy's contract, with no agent or credit logic duplicated in the frontend.

**Non-Goals:**
- No agent persona/logic and no credit-check logic — both live server-side in the other two changes.
- No changes to the existing resume/project tab content or navigation from `build-portfolio-frontend`.

## Decisions

**Component approach: build the chat window using existing shadcn/ui primitives (e.g., Card, Button, Input, ScrollArea) inside the reserved `AgentWidgetSlot`, consistent with the rest of the site's component library.**
Avoids introducing a second UI kit or styling approach just for this widget. Alternative (a separate chat-widget npm package) rejected to keep visual consistency with the hand-picked template from `build-portfolio-frontend` and avoid an extra dependency for a fairly simple UI.

**Backend contract consumption: a single `fetch`/HTTP call per message to the proxy endpoint, with the reply (success or apology) rendered identically as a chat bubble.**
Since the backend already normalizes the "no credits" case into an apology-shaped reply (per `add-agent-backend-proxy`'s design), the frontend needs no special-case branching for that state beyond normal message rendering — it doesn't need to know whether credits were available.

**State management: local component state (no global state library) for conversation history within a single page session.**
Sufficient for a single floating widget with no cross-page persistence requirement; simplest option consistent with "don't add abstractions beyond what's needed."

## Risks / Trade-offs

- [Widget UI built before the backend proxy is deployed can't be end-to-end tested against a live endpoint] → Mitigation: the widget can be developed and demoed against a local mock of the proxy's response shape, then verified against the real endpoint once `add-agent-backend-proxy` is applied.
- [Floating widget could visually clash with the template chosen in `build-portfolio-frontend`] → Mitigation: user will critique and iterate on the widget's appearance the same way as the rest of the site.
