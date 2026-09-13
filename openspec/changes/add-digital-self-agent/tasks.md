## 1. Module Scaffold

- [ ] 1.1 Scaffold the `agents/digital_self/` TypeScript module structure (`agent.ts`, `instructions.md`, `knowledge/`, `build-index.ts`), verified by the folder layout matching design.md and the project compiling with no source files
- [ ] 1.2 Add Gemini API dependencies (a minimal HTTP client or the official SDK) and a local `.env.example` listing required variable names only, verified by `.env` being gitignored and `.env.example` containing no real values

## 2. Knowledge Content

- [ ] 2.1 Write `knowledge/resume.md` from the user's actual resume (background, experience, skills, education), verified by a manual read-through against the source resume
- [ ] 2.2 Write one `knowledge/projects/*.md` file per project from the resume, verified by each file covering one project's description accurately
- [ ] 2.3 Confirm no private details beyond what's already public on the site (e.g., phone number) are included in any knowledge file, verified by a manual review against the live/planned Contact section content

## 3. Offline Embedding Pipeline

- [ ] 3.1 Implement `build-index.ts` to chunk `knowledge/*.md`, call Gemini's embedding endpoint per chunk, and write `embeddings.json`, verified by running it and inspecting the output file for one vector per chunk
- [ ] 3.2 Ask the user to supply the Gemini API key value directly into their local `.env` (never read, generate, or log the value), verified by `build-index.ts` running successfully using that local `.env`

## 4. Retrieval and Generation

- [ ] 4.1 Implement in-process cosine-similarity ranking against `embeddings.json` given a query embedding, verified by a unit test with a known query returning the expected top chunk
- [ ] 4.2 Implement `agent.ts`'s reply function: embed the incoming message, retrieve top-k chunks, call Gemini's `generateContent` with `instructions.md` plus retrieved chunks, verified by a manual test conversation
- [ ] 4.3 Verify the generation request excludes unrelated knowledge chunks for a narrow-topic question, confirmed by inspecting the assembled prompt for a test query

## 5. Persona and Honesty Checks

- [ ] 5.1 Author `instructions.md` so the agent answers in first person, honestly, and only from retrieved content, verified by manual test conversations covering in-scope and out-of-scope questions
- [ ] 5.2 Verify the agent declines or redirects on questions unanswerable from retrieved content, confirmed by a manual test case
- [ ] 5.3 Verify the agent does not fabricate credentials/claims under a leading question, confirmed by a manual adversarial test case

## 6. Final Verification

- [ ] 6.1 Verify `agent.ts`'s reply function works when invoked standalone (a small script calling it directly), outside any HTTP handler or credit-check logic, confirmed by a successful sample invocation
- [ ] 6.2 Review against `specs/digital-self-agent/spec.md` scenario-by-scenario, verified by each scenario passing manual inspection
