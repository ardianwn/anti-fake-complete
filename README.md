# Anti-Fake-Complete

An evidence-backed workflow that makes AI agents prove what they claim to have
built.

## What it does

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
  skills/anti-fake-complete/examples/verified-feature.json
npm run secret-scan
```

The validator uses only Node.js built-ins.
The bundled secret scanner also uses only Node.js built-ins and fails closed
when it finds common private-key, token, or hard-coded secret patterns.

## Design principles

- Implemented is not the same as verified.
- A passing test is evidence only for what it actually exercises.
- Unknown or skipped validation must remain visible.
- Completion claims must be reproducible from commands and observed results.
- A tool must fail closed on malformed evidence instead of producing a
  success-shaped fallback.
