# GitHub Issues tracker

Repository: `lf-awesport/awe-edu-video`
Canonical map: [Completare e rendere rilasciabile il master audiovisivo AWE](https://github.com/lf-awesport/awe-edu-video/issues/1)

GitHub Issues is the active tracker. Local Markdown under
`.scratch/video-generation-pipeline/` preserves resolved decision history and
must not be treated as a second backlog.

## Triage labels

| Label | Meaning |
|---|---|
| `needs-triage` | Scope or priority is not settled. |
| `needs-info` | A named dependency, input, or decision blocks execution. |
| `ready-for-agent` | Acceptance criteria and testing seam are complete and no blocker is open. |
| `ready-for-human` | A human must provide evidence, authority, approval, or a product decision. |
| `wontfix` | Intentionally excluded from the current destination. |

Structural labels are `wayfinder:map`, `tracer`, and `optional`. They do not
replace exactly one current triage state.

## Operations

Search both open and closed issues before creation:

```bash
gh issue list --repo lf-awesport/awe-edu-video --state all --limit 200 \
  --json number,title,state,labels,url
gh issue list --repo lf-awesport/awe-edu-video --state all --search '<terms>'
```

Read or update a canonical issue:

```bash
gh issue view <number> --repo lf-awesport/awe-edu-video
gh issue edit <number> --repo lf-awesport/awe-edu-video --body-file <file>
```

Create a ticket only after reconciliation. Its body must contain outcome,
acceptance criteria, dependencies, non-goals where useful, source decision or
requirement IDs, and residual uncertainty. Link it from the map when it belongs
to a multi-session destination.

This repository currently expresses blocking relationships in issue bodies as
`## Blocked by` with issue references. A blocked issue uses `needs-info`, not
`ready-for-agent`. When the last blocker closes, re-read the issue against the
current code before promoting it; do not relabel mechanically.

Close an issue only when its acceptance evidence is linked or reproducible.
Closing a map child must also update the map's low-resolution status.
