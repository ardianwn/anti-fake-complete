# Security policy

## Scope

Anti-Fake-Complete is a local workflow and heuristic scanner. It does not
upload source code, execute untrusted project code, or replace organization
secret scanning, dependency auditing, authorization tests, or runtime security
monitoring.

## Reporting a vulnerability

Do not disclose credentials or exploitable details in a public issue. Report
security concerns privately through
[GitHub's private vulnerability reporting](https://github.com/ardianwn/anti-fake-complete/security/advisories/new)
when available. Include a minimal reproduction, affected version, impact, and
suggested mitigation.

## Safe use

- Run the tools in the intended repository and review their output.
- Treat scanner findings as blockers until investigated.
- Do not paste secrets into completion reports or issue comments.
- Keep evidence commands free of tokens, passwords, and private URLs.
