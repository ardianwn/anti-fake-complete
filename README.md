# Anti-Fake-Complete

> Make AI agents prove what they claim to have built.

AI coding agents often report “done” after writing code, even when requested
behavior was not tested, an integration was never exercised, or a required
check was skipped. Anti-Fake-Complete provides a framework-agnostic skill and
small command-line tools for making completion claims proportional to evidence.

## What is included

- `SKILL.md`: an on-demand workflow for agents.
- Evidence levels from planned through production-observed.
- A machine-readable completion report validator.
- A dependency-free secret scanner for common credential patterns.
- Node.js tests and GitHub Actions CI.

## Quick start

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/ardianwn/anti-fake-complete.git
cd anti-fake-complete
npm test
npm run secret-scan
node skills/anti-fake-complete/scripts/validate-report.mjs \
  skills/anti-fake-complete/examples/verified-feature.json
```

The validator rejects a claim when the evidence is too weak:

```bash
node skills/anti-fake-complete/scripts/validate-report.mjs \
  skills/anti-fake-complete/examples/rejected-report.json
# Invalid completion report: criterion "runtime-behavior" reaches L2, below required L5
```

## Install the skill

Copy `skills/anti-fake-complete/` into a project-specific skill directory:

```bash
mkdir -p .github/skills
cp -R skills/anti-fake-complete .github/skills/anti-fake-complete
```

The same directory can be used by agents that support `.agents/skills/` or
`.claude/skills/`. See the target agent's documentation for its skill path.

## Evidence model

| Level | Meaning |
|---|---|
| L0 | Planned |
| L1 | Implemented and reviewed |
| L2 | Static checks passed |
| L3 | Focused unit tests passed |
| L4 | Integration boundary tested |
| L5 | Runtime/device/deployed endpoint verified |
| L6 | Production behavior observed |

“Verified” is not a synonym for “code exists”. A lint pass cannot prove runtime
behavior, and a unit test cannot prove a device or provider integration unless
that boundary is exercised.

## Completion reports

Reports contain a status, acceptance criteria, minimum evidence level, commands,
and observed results:

```json
{
  "status": "verified",
  "criteria": [
    {
      "id": "save-value",
      "description": "The feature saves a value",
      "minimumEvidenceLevel": 3,
      "evidence": [
        {
          "level": 3,
          "command": "npm test -- save-value",
          "result": "1 test passed"
        }
      ]
    }
  ]
}
```

Use `partial`, `unverified`, or `failed` when evidence does not justify a
stronger claim. Never invent output, coverage, deployment status, or provider
availability.

## Project checks

```bash
npm test
npm run secret-scan
```

All tools use Node.js built-ins and do not send source code or credentials to a
third party. The scanner is a heuristic guardrail, not a replacement for a
provider or organization secret-scanning service.

## Scope and limitations

This project improves reporting discipline; it cannot prove that an agent's
acceptance criteria are complete or that a command's output is truthful. Review
the evidence, run checks in a trusted environment, and add project-specific
security, authorization, device, and production checks where required.

## Release status

`v0.1.0` is an early release suitable for evaluation and team workflows. It is
not a guarantee that an agent is truthful, that acceptance criteria are
complete, or that a repository is production-ready. Integrate it with trusted
CI and project-specific runtime checks.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Please include tests and actual
validation output with behavior changes.

## License

MIT. See [LICENSE](./LICENSE).
