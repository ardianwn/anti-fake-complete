# Skill Agents

Reusable agent skills for turning fast AI-assisted coding into evidence-backed,
production-minded work.

## Included skills

### `anti-fake-complete`

Prevents an agent from claiming that work is complete without matching evidence.
It defines evidence levels, requires every acceptance criterion to be mapped to
validation, and reports unverified limitations explicitly.

The skill is framework-agnostic and can be copied into a project at:

```text
.github/skills/anti-fake-complete/
```

## Validate

```bash
npm test
node skills/anti-fake-complete/scripts/validate-report.mjs \
  examples/verified-feature.json
```

The validator uses only Node.js built-ins.

## Design principles

- Implemented is not the same as verified.
- A passing test is evidence only for what it actually exercises.
- Unknown or skipped validation must remain visible.
- Completion claims must be reproducible from commands and observed results.
- A tool must fail closed on malformed evidence instead of producing a
  success-shaped fallback.
