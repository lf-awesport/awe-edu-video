# Matt Pocock delivery workflow

This project uses a decision-first, tracer-bullet workflow. The workflow is a
gate system, not a requirement to create paperwork for trivial edits.

```text
unclear destination
      │
      ▼
wayfinder ──▶ grilling + domain model ──▶ spec
                                               │
                                               ▼
                                    tracer tickets + dependencies
                                               │
                                               ▼
                                  TDD implementation, one tracer
                                               │
                                               ▼
                                  two-axis review + verification
                                               │
                                               ▼
                                  evidence, docs, tracker closure
```

## Gates

### 1. Orient and reconcile

Read the domain context and current handoff, inspect the implementation, and
search all GitHub Issues. User reports and historical tickets are claims to
verify against the current repository. Use an existing issue when it already
owns the outcome.

### 2. Resolve decisions before slicing work

Use `wayfinder` when the route spans sessions or still contains product fog.
Use `grilling` and `domain-modeling` for decisions that alter vocabulary,
authority, lifecycle, cost, or release semantics. Durable choices that future
work could accidentally reverse belong in `docs/adr/`; update `CONTEXT.md` when
the ubiquitous language changes.

### 3. Establish the contract

Use `to-spec` when behavior is not yet unambiguous. Use `to-tickets` to create
the smallest vertical tracers that deliver observable behavior. Every ticket
states its blocker edges and the highest practical public seam to test. Avoid
horizontal tickets such as “build all schemas” or “add all adapters.”

### 4. Implement test-first

Use `implement` and `tdd`. Work through one red → minimal green behavior at a
time. Existing public seams are preferred: CLI command/result, Storyboard to
RenderPlan, provider contract, runtime recovery, and immutable render evidence.
Do not spend provider credits from a test or normal CI.

### 5. Review and close with evidence

Use `code-review` against the commit immediately before implementation. Review
both repository standards and the originating issue/spec. Run targeted checks
throughout and the full relevant suite at the end. Update handoff, domain/ADR
docs, issue evidence, dependency labels, and the parent map before closure.

## Project-specific release rule

A successful render is not a release. `internal-preview-only` may change only
when the current issue's Claim, rights, authority, quality, and Release Manifest
acceptance criteria are all demonstrated for the exact artifact hash.
