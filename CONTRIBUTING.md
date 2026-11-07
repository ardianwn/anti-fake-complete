# Contributing

## Development

1. Use Node.js 20 or newer.
2. Keep changes focused on evidence-backed agent workflows.
3. Add or update tests for behavior changes.
4. Run all checks before opening a pull request:

```bash
npm test
npm run secret-scan
```

5. Report the exact commands and observed results in the pull request.

Do not add real credentials to fixtures. If a secret-shaped fixture is needed,
construct it at runtime so the repository scanner does not treat the test data
as a real credential.

## Pull requests

Explain the user problem, the evidence model change, false-positive risks, and
any compatibility impact. Do not claim production readiness unless the relevant
runtime evidence is included.
