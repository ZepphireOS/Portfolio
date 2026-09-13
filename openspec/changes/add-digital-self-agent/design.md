## Context

This is the first of three related changes (agent, backend proxy, widget UI) that together deliver the "digital self" chat feature described in `build-portfolio-frontend`'s proposal. Each targets its own top-level source folder (`agents/`, `backend/`, `frontend/` respectively) so they can be applied independently, in separate sessions. Hosting has been decided across the whole feature: GitHub Pages for the frontend, Cloudflare Workers for the backend — no GCP involvement. This change defines only the agent module itself — no transport, hosting, or UI. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Define a small, cheap-to-run conversational agent representing the user honestly in first person.
- Ground the agent strictly in supplied resume/project content via retrieval, not by stuffing the entire knowledge base into every request.
- Define a stable, minimal input/output contract other changes can build against.
- Keep persona/knowledge content separated from code, in the spirit of ADK's folder conventions, without depending on the ADK package.

**Non-Goals:**
- No HTTP endpoint, hosting, or deployment — that's `add-agent-backend-proxy`.
- No credit/quota checking — the agent itself is unaware of billing state.
- No chat UI — that's `add-agent-widget-ui`.
- No agent framework (ADK, LangChain, LlamaIndex, etc.) — deliberately out of scope; see Decisions.

## Decisions

**No agent framework — hand-rolled RAG in TypeScript.**
The corpus is tiny: one resume and five short project write-ups, well under 50 chunks total. A framework (ADK, LangChain, LlamaIndex, Haystack) earns its weight with many documents, incremental re-indexing, or swappable vector-store backends — none of which apply here, so adopting one would add dependency weight without benefit. It also sidesteps a real incompatibility: ADK is a Python package with native dependencies and does not run inside a Cloudflare Worker's JS runtime (the backend's chosen host, decided in `add-agent-backend-proxy`), so using it would have forced a different, heavier backend host.

**Retrieval: precompute embeddings offline; rank by cosine similarity in-process at request time; no vector database.**
An offline script (`build-index.ts`) chunks `knowledge/*.md`, calls Gemini's embedding endpoint once per chunk, and writes the vectors to `embeddings.json`. At request time, the agent module embeds only the incoming visitor message (one call) and ranks the precomputed chunk vectors by cosine similarity in plain code — trivial at this corpus size. This keeps runtime cost to one embedding call plus one generation call per message, with no standing vector-database service or its cost.

**Grounding content: dedicated `knowledge/*.md` files, not shared/duplicated from the frontend's data files.**
Earlier drafts of this change considered sharing content directly with the frontend's resume data files; instead, the agent keeps its own `knowledge/*.md` source content, written to be chunked and embedded well (self-contained paragraphs), rather than reusing the frontend's UI-oriented data structures. Some manual duplication of facts is an accepted cost of keeping each side simple; both sides ultimately describe the same public resume/project content the user controls.

**Folder convention: ADK-style separation of instructions/knowledge from code, without the ADK package.**
```
agents/digital_self/
  agent.ts            # thin orchestration: loads instructions.md + embeddings.json, calls Gemini
  instructions.md      # persona/system prompt — plain text, no code
  knowledge/
    resume.md
    projects/*.md
  embeddings.json       # precomputed vectors, generated offline
  build-index.ts         # offline script: knowledge/*.md → embedding calls → embeddings.json
```
`agent.ts` never contains persona text or knowledge content directly — both are always read from the sibling files.

**Output contract: plain text reply keyed to a simple message+context input.**
Kept intentionally minimal (visitor message string, optional short conversation history) so the backend proxy can integrate against a stable shape.

**Secret handling: the Gemini API key used to compute embeddings lives only in a local, gitignored `.env` file (and later, a Wrangler secret for the deployed Worker).**
During apply, the assistant asks the user to supply the key value directly (e.g., by having the user paste it into `.env` themselves) rather than reading, generating, or logging it — the assistant only ever references the variable name in code.

## Risks / Trade-offs

- [Knowledge content is committed to the repo] → Mitigation: this is acceptable because the same content is already rendered publicly on the site itself (see discussion with the user); `knowledge/*.md` must be held to the same public-disclosure bar as the live page and never used to stash otherwise-private details (e.g., a phone number omitted from the public Contact section should also be omitted here).
- [Re-embedding must be rerun by hand after editing knowledge content] → Mitigation: keep `build-index.ts` a single, well-documented command; note it prominently wherever knowledge content is edited.
- [Small corpus means retrieval quality is easy to get "good enough" but also easy to under-test] → Mitigation: manually test retrieval against a handful of representative questions per knowledge file during implementation.

## Open Questions

- Exact chunking granularity for `knowledge/*.md` (per-file vs. per-paragraph) — to be decided during implementation based on how retrieval quality looks in manual testing; doesn't change the spec's behavioral requirement (retrieve relevant chunks only).
