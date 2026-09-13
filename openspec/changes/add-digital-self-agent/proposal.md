## Why

Visitors to the portfolio should be able to interact with a conversational "digital version" of the user — one that speaks well and honestly about their background — rather than only reading static resume text. This requires an agent grounded in the user's actual resume/project content, kept small and cheap to run given how little content there actually is.

## What Changes

- Define a lightweight conversational agent, implemented directly against the Gemini API (no agent framework), that represents the user in first person and answers honestly, only from their supplied content.
- Ground the agent using retrieval-augmented generation (RAG): precompute embeddings for chunks of the resume/project content offline, and at request time retrieve only the most relevant chunks via in-process similarity search before generating a reply — keeping each request cheap (one embedding call + one generation call, no standing vector database).
- Adopt an ADK-style folder convention despite not depending on the ADK package: persona/system instructions live in a separate plain-text file, never embedded in code; source knowledge content lives in its own files; a small offline script turns that content into a precomputed embeddings file.
- Define the agent's input/output contract so the backend-proxy change (a Cloudflare Worker) can call it as a plain TypeScript module.
- House the agent in a dedicated top-level `agents/` source folder, separate from `frontend/` and `backend/`.
- Exclude HTTP transport, hosting, and credit/balance checking from this change — that's `add-agent-backend-proxy`. Exclude the chat UI — that's `add-agent-widget-ui`.

## Capabilities

### New Capabilities
- `digital-self-agent`: A retrieval-grounded conversational agent, implemented directly against the Gemini API, that represents the user honestly in first person using only their supplied resume/project content.

### Modified Capabilities
(none)

## Impact

- New `agents/` top-level source folder containing a TypeScript module (persona logic, retrieval, knowledge content, and a precomputed embeddings file), with no GCP or agent-framework dependency.
- No frontend or backend code is modified by this change; it produces a standalone module that `add-agent-backend-proxy`'s Cloudflare Worker imports directly.
- Establishes the input/output contract that `add-agent-backend-proxy` depends on.
- The Gemini API key used to compute embeddings (offline, during development) is supplied by the user directly into a local, gitignored `.env` file — it is never read, logged, or persisted by the assistant during apply; only the variable name is referenced in code.
