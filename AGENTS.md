# Project workflow

Read `CONTEXT.md`, `HANDOFF.md`, `docs/agents/matt-pocock-workflow.md`, and
`docs/agents/issue-tracker.md` before non-trivial work. GitHub Issues is the
canonical tracker; `.scratch/` is decision history, not the active backlog.

Use the Matt Pocock workflow for every non-trivial change:

1. Search open and closed issues before creating one. Reconcile with the code
   and reuse the canonical issue instead of creating a duplicate.
2. Use `wayfinder` for ambiguous, broad, or multi-session destinations. Use
   `grilling` with `domain-modeling` to resolve material product or domain
   decisions; record durable architectural decisions under `docs/adr/`.
3. Before implementation, ensure the issue or spec states the outcome,
   non-goals, dependencies, acceptance criteria, and highest practical public
   testing seam. Use `to-spec` and `to-tickets` when those are missing.
4. Implement one vertical tracer at a time with `tdd`: red, minimal green, then
   the next behavior. Prefer the existing CLI, compiler, provider, runtime-state,
   and render-evidence seams over new internal seams.
5. Finish with `code-review` against the pre-change commit, targeted checks,
   the full relevant test suite, and tracker/docs updates. Do not mark blocked
   work complete or relabel it `ready-for-agent` while a dependency remains open.

The candidate specification under `docs/video-pipeline/` remains authoritative
for terminology and intended contracts but is not production approval. Paid
provider calls, external publication, and release promotion require the explicit
Budget, rights, and human approvals named by the relevant issue.

Trivial typo-only edits may skip map/spec creation, but still require a duplicate
issue check when tracker state is involved and proportionate verification.
