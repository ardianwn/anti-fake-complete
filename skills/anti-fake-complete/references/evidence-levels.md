# Evidence levels

Evidence is cumulative only when each higher level actually includes the lower
level checks relevant to the acceptance criterion.

| Level | Name | What it proves |
|---|---|---|
| L0 | Planned | The work is described; no implementation evidence. |
| L1 | Implemented | Code or configuration was changed and reviewed. |
| L2 | Static checked | Relevant lint, formatting, type-check, or compile checks passed. |
| L3 | Unit tested | Focused automated tests exercise the requested behavior. |
| L4 | Integration tested | Multiple real components or a real boundary work together. |
| L5 | Runtime verified | A real app, service, device, CLI, or deployed endpoint was exercised. |
| L6 | Observed in production | Production behavior was observed with appropriate monitoring and safeguards. |

## Claim policy

- `implemented` requires L1 for every required criterion.
- `partial` requires L1 for implemented criteria and lists lower-evidence criteria.
- `verified` requires the minimum level declared for every required criterion.
- `production-ready` requires L5 at minimum and L6 when production operation is
  part of the requirement.

Evidence must identify the command or observation, its result, and the criterion
it supports. A command that exits successfully but does not exercise the
criterion is not sufficient evidence.
