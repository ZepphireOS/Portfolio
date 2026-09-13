## 1. Worker Scaffold

- [ ] 1.1 Scaffold a `backend/` top-level folder with a Cloudflare Worker project via Wrangler, verified by the Worker running and responding locally via `wrangler dev`
- [ ] 1.2 Ask the user to supply the Gemini API key value directly (local `.dev.vars` for dev, `wrangler secret put` for deploy) — never read, generate, or log the value — verified by the Worker reading it from that binding at runtime

## 2. Credit Check

- [ ] 2.1 Implement the pre-call credit/quota check against the Gemini API account, verified by a manual test confirming it returns an availability signal before any agent call is attempted
- [ ] 2.2 Implement the zero-usage apology response path for exhausted credits, verified by simulating an exhausted-credit condition and confirming no agent/LLM call occurs (e.g., via request logging/mocking)

## 3. Agent Invocation

- [ ] 3.1 Integrate the endpoint with the `digital-self-agent` (from `add-digital-self-agent`) using its documented input/output contract, verified by a successful end-to-end call returning the agent's reply
- [ ] 3.2 Return the agent's reply in the endpoint's response contract, verified by a sample request/response matching the documented shape

## 4. Secret and Response Hygiene

- [ ] 4.1 Verify the Gemini API key never appears in any response body or log accessible to a client, confirmed by inspecting sample responses and logs
- [ ] 4.2 Verify the no-credit response is not an HTTP error status or technical error body, confirmed by inspecting the response for that path

## 5. Final Verification

- [ ] 5.1 Review against `specs/agent-backend-proxy/spec.md` scenario-by-scenario, verified by each scenario passing manual inspection (using local emulation where live credit exhaustion can't be triggered on demand)
