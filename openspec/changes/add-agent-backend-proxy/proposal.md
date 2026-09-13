## Why

The digital-self agent (separate change) must not be called directly from the browser, since that would expose the Gemini API key. A minimal backend is needed to hold the key, invoke the agent, and gate calls on remaining API credit so the app never fails ugly or burns credits it doesn't have.

## What Changes

- Stand up a minimal Cloudflare Worker (TypeScript) that receives a visitor's chat message and returns the digital-self agent's reply, importing the agent module from `add-digital-self-agent` directly into the same Worker.
- Before invoking the agent, check the Gemini API account's remaining credit/quota. If credits are exhausted, return a plain, apologetic, non-error response without invoking the agent or the LLM at all — this must not consume any credits or make any LLM API call in that state.
- Hold the Gemini API key and any agent invocation logic entirely server-side; the frontend never sees the key.
- House this endpoint in a dedicated top-level `backend/` source folder, separate from `frontend/` and `agents/`, per the requested repo partition — this change's code can be built/deployed independently of the agent and frontend changes.
- Exclude the chat UI, the agent's persona/instructions, and CI/CD deployment automation from this change.

## Capabilities

### New Capabilities
- `agent-backend-proxy`: A minimal backend HTTP endpoint that gates and proxies chat requests to the digital-self agent, checking Gemini API credit availability first and returning a graceful apology (not an error) with zero LLM/API usage when credits are exhausted.

### Modified Capabilities
(none)

## Impact

- New `backend/` top-level source folder containing a Cloudflare Worker (Wrangler project) and its dependencies — no GCP project or service.
- Depends on the agent input/output contract defined in `add-digital-self-agent` (must be implemented, or at least specified, before this proxy can call it — sequencing note for the apply phase, not a spec-time blocker).
- Introduces the Gemini API key as a Worker secret (`wrangler secret put`), supplied directly by the user — never bundled into frontend assets, and never read or logged by the assistant during apply.
- Establishes the request/response contract the frontend widget (separate change) will call.
