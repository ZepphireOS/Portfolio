## Context

Second of three related changes delivering the digital-self chat feature (see `add-digital-self-agent` and `add-agent-widget-ui`). This change is the only one that touches secrets (the Gemini API key) and billing/credit state, and is scoped to its own `backend/` folder so it can be built and deployed independently. Hosting for this feature has been decided as GitHub Pages (frontend) + Cloudflare Workers (backend) — no GCP involvement. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Provide one minimal, always-free-tier HTTP endpoint that gates and proxies chat requests to the agent from `add-digital-self-agent`.
- Guarantee zero LLM usage when credits are exhausted, verified before any agent invocation.
- Keep the endpoint's request/response contract simple enough for the frontend widget (separate change) to integrate against without backend-specific knowledge.

**Non-Goals:**
- No agent persona/retrieval logic (defined in `add-digital-self-agent`, imported as a module).
- No chat UI (defined in `add-agent-widget-ui`).
- No CI/CD or deployment automation beyond what's needed to run this Worker locally during apply (a separate future change covers GitHub Actions deployment).

## Decisions

**Compute: Cloudflare Workers, not GCP.**
Now that the agent has no Python/ADK dependency (see `add-digital-self-agent`'s design), the entire backend — HTTP handling, the credit check, and the agent's retrieval-plus-generation logic — runs as plain TypeScript in one Worker. This pairs naturally with GitHub Pages for the frontend, keeps everything on Cloudflare's always-free tier, and avoids standing up any GCP project at all. Alternative considered and previously chosen (GCP Cloud Run, for ADK compatibility) is no longer necessary once ADK was dropped.

**Credit check mechanism: query the Gemini API's own usage/quota signal via `fetch`, directly from the Worker, before invoking the agent.**
The exact API/field used to determine "credits exhausted" depends on what Google's Gemini API billing/quota surface actually exposes at implementation time; the requirement is behavioral (check before call, never call when exhausted), not tied to a specific provider API shape, so the precise integration is an implementation detail to confirm during apply.

**Failure response shape: a normal-looking chat payload carrying an apology string, not an HTTP error status.**
This directly satisfies the "not an error message" requirement from the original proposal — the frontend widget can render this exactly like any other agent reply.

**Secret handling: the Gemini API key is stored only as a Wrangler secret, supplied by the user directly (e.g., via `wrangler secret put` or a local `.dev.vars` file they fill in themselves).**
During apply, the assistant asks the user to run the secret-setting command or fill in the value themselves rather than reading, generating, or logging the key — the assistant only ever references the variable/binding name in code.

## Risks / Trade-offs

- [Gemini API may not expose a simple, real-time "remaining credit" signal] → Mitigation: if no direct balance endpoint exists, fall back to catching the provider's own quota-exceeded error on a lightweight probe call, while still guaranteeing no full agent invocation occurs on that path — to be finalized during implementation.
- [Cloudflare Workers' free-tier CPU-time/request limits] → Mitigation: per-request work is small (one embedding call, in-process similarity math, one generation call), comfortably within Workers' free limits for a personal portfolio's traffic level.

## Open Questions

- Exact Gemini API mechanism for checking remaining credit/quota (specific endpoint or error-handling strategy) — to be confirmed during implementation; it does not change this change's spec (check-before-call, zero-usage-when-exhausted) or task breakdown at the level already written.
