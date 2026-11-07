---
name: anti-fake-complete
description: "Prevent AI agents from claiming work is complete without evidence. Use when implementing, debugging, reviewing, testing, or reporting software changes; especially when a feature may be only partially implemented, mocked, untested, or runtime-unverified."
argument-hint: "Describe the feature, acceptance criteria, and available validation commands"
---

# Anti-Fake-Complete

Make every completion claim proportional to the evidence available.

## When to use

- Before saying a feature, bug fix, or refactor is complete.
- When a user asks whether work is finished or production-ready.
- When tests, builds, device checks, or external integrations may be missing.
- When an agent inherited changes from another agent.
- During code review of AI-generated changes.

## Procedure

1. **Extract acceptance criteria.** Rewrite the request as observable outcomes.
   Separate required behavior from implementation suggestions.
2. **Inspect the change.** Read the relevant code, tests, configuration, and
   diff. Do not treat file creation as proof of behavior.
3. **Map evidence.** For every criterion, record the command or observation
   that validates it. Use the [evidence levels](./references/evidence-levels.md).
4. **Run the narrowest meaningful checks.** Prefer targeted tests, type checks,
   lint, build, and runtime smoke tests in that order of relevance. Do not
   replace an unavailable check with an unrelated passing command.
5. **Inspect actual results.** Record exit codes, failing assertions, skipped
   checks, and environment limitations. Never infer a pass from command
   startup or generated output alone.
6. **Classify the result.**
   - `verified`: every required criterion has sufficient evidence.
   - `partial`: some criteria are verified and the rest are explicitly listed.
   - `unverified`: implementation exists but required evidence is absent.
   - `failed`: a required check or behavior failed.
7. **Report honestly.** Use the [completion report template](./templates/completion-report.md).
   Include commands, observed results, known limitations, and the next action.

## Non-negotiable rules

- Never say “done”, “working”, “fixed”, or “production-ready” without naming
  the evidence that supports the claim.
- Do not count a test that does not exercise the requested behavior.
- Do not hide failures with broad catches, empty fallbacks, skipped tests, or
  mocked success responses.
- A type check or lint pass does not prove runtime behavior.
- A unit test does not prove integration, authorization, device, or provider
  behavior unless it exercises that boundary.
- If validation cannot run, say exactly why and mark the criterion unverified.
- Do not invent output, coverage, device results, provider availability, or
  deployment status.

## Fast completion gate

Before reporting completion, ask:

```text
What exact outcome was requested?
What command or observation proves that outcome?
Did I inspect the actual result?
What remains unverified?
Could another developer reproduce this evidence?
```

Use the bundled validator for machine-readable reports:

```bash
node ./scripts/validate-report.mjs ./completion-report.json
```

The validator rejects malformed reports and completion claims whose evidence
does not meet the minimum level.

Before sharing or committing generated code, run the bundled secret scan:

```bash
node ./scripts/secret-scan.mjs .
```

Treat findings as blockers until each value is removed, replaced with an
environment reference, or confirmed as a documented non-secret example.
