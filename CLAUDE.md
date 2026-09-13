# Portfolio

This project is **spec-driven**. Work here flows through OpenSpec, not straight into code.

OpenSpec CLI `1.13.0` (`openspec` on PATH). Root is this directory — `openspec doctor` confirms it.
Planning lives in [openspec/](openspec/); no application code exists yet.

## Default working mode

Treat an incoming request as a *change to be proposed*, not a task to be coded. Before editing
project code, there should be a change in `openspec/changes/<name>/` whose tasks I am working
through, and the user should have explicitly asked me to implement.

Route requests like this:

| The user is… | Use |
| --- | --- |
| Thinking out loud, unsure of the shape, asking "what if" | `openspec-explore` |
| Describing something to build or fix | `openspec-propose` |
| Ready to build an existing change ("implement it", "start on X") | `openspec-apply-change` |
| Revising a plan, or reconciling artifacts after an edit | `openspec-update-change` |
| Promoting delta specs into main specs without archiving | `openspec-sync-specs` |
| Done with a change and wrapping it up | `openspec-archive-change` |

The `/opsx:*` slash commands are the same workflows; `/opsx:propose` → `openspec-propose`, etc.

**Small, genuinely trivial asks** — a typo, a question about a file, a one-line config tweak —
do not need a change. Use judgment; when the work has externally observable behavior or
acceptance criteria, propose it.

## Boundaries that matter

These come from the skills themselves and are easy to violate by being helpful:

- **Propose plans, it never implements.** A request that says "build me X" authorizes *planning*
  only when it enters the propose workflow. Produce the artifacts, present them, stop. Do not
  roll into implementation in the same response — wait for a new request.
- **Apply needs an explicit go-ahead.** Don't infer it from the proposal being finished.
- **Update never touches code.** If a revised plan implies code changes, stop and point to apply.
- **Explore is read-only by default.** Reading and searching is free; before the first write —
  including to OpenSpec artifacts — name what would change and get a yes in a separate message.
- **Artifact `context` and `rules`** from `openspec instructions` are constraints on *me*.
  Never copy them into the artifact files.
- **Never archive with a spec sync in flight.** Sync inline, verify main specs, then move.

## Per-change conventions

- Change names are kebab-case (`add-project-gallery`, not `AddProjectGallery`).
- Drive artifact order off `openspec status --change "<name>" --json`. Build the required set
  from the `requires` edges, not from each artifact's `status` — `status` is file-existence only,
  so a `done` artifact can still sit on dependencies that were never written.
- Write to `artifactPaths.<id>.existingOutputPaths`, never to a glob `resolvedOutputPath`.
- Re-read dependency artifacts from disk before drafting against them. The user edits these files.

## Environment notes

- Windows 11, PowerShell is primary. `openspec` resolves via
  `C:\Users\manub\AppData\Roaming\npm\openspec.ps1`.
- Not a git repository. Nothing is recoverable via git — be correspondingly careful with
  destructive edits and with `archive`, which moves directories.
- The skills are installed three times over — [.claude/skills/](.claude/skills/) (Claude Code),
  [.agents/skills/](.agents/skills/) (generic agents), and
  [.commandcode/skills/](.commandcode/skills/) — plus slash commands in
  [.claude/commands/opsx/](.claude/commands/opsx/) and [.commandcode/commands/](.commandcode/commands/).
  That is OpenSpec's multi-tool install, not drift. `.agents/skills/.openspec-target` reads
  `agents`. If one copy is regenerated, expect the others to need it too.
- [openspec/config.yaml](openspec/config.yaml) is scaffolding only — every field is still
  commented out. Its `context` field is injected into every generated artifact, so filling it in
  (tech stack, conventions, domain) is the highest-leverage way to improve proposals.
