## Why

The portfolio frontend (see `build-portfolio-frontend`) reserves an inert layout slot for a future agent widget but implements no chat behavior. Visitors need an actual floating chat window to talk to the digital-self agent, including a graceful, honest experience when the backend reports no API credits available.

## What Changes

- Implement a floating chat window UI component that occupies the reserved agent-widget slot from `build-portfolio-frontend`, allowing visitors to send messages and see the digital-self agent's replies.
- Call the `agent-backend-proxy` endpoint (separate change) for every message; the frontend never calls the Gemini API or holds any API key directly.
- When the backend proxy indicates credits are exhausted, display that response as a normal chat message with a simple apology — not as an error state, warning banner, or broken UI.
- Handle basic conversational UX concerns: loading/typing indicator while awaiting a reply, scrollable message history within the widget, and open/close toggling of the floating window.
- This change lives in the `frontend/` source folder (alongside the rest of the portfolio frontend) and depends on the reserved slot from `build-portfolio-frontend` and the request/response contract from `add-agent-backend-proxy`.
- Excludes the agent's persona/logic and the backend/credit-check implementation, which are separate changes.

## Capabilities

### New Capabilities
- `agent-widget-ui`: A floating chat window on the portfolio frontend that lets visitors converse with the digital-self agent via the backend proxy, including displaying a plain apology (not an error) when the backend reports no credits available.

### Modified Capabilities
(none — `build-portfolio-frontend`'s reserved-slot requirement is not yet an archived main spec to modify; this change activates that slot as new, additive behavior)

## Impact

- Extends the frontend application (from `build-portfolio-frontend`) with a new interactive component; no changes to the existing resume/project tab content or navigation.
- Depends on `add-agent-backend-proxy`'s HTTP contract being defined (and, for real end-to-end testing, deployed) — sequencing note for the apply phase.
- No new API keys or secrets are introduced on the frontend side.
