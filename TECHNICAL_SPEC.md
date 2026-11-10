# Shipd Forge — Technical Specification v0.3.0

## Product definition

Shipd Forge is a provider-neutral Agent Skill, not a standalone autonomous agent. The host agent (Codex, Claude Code, Antigravity or compatible runtime) performs reasoning, repository edits and browser interactions. Forge supplies the repeatable operating procedure, scripts, templates, evidence schema, safety boundaries and persistent local ledger.

## Inputs

- Shipd challenge URL (required)
- GitHub repository URL (optional)
- Objective and optional constraints
- User-defined maximum Shipd spend for paid workflow
- Authorization mode: research-only or explicitly authorized autonomous submission

## Runtime contracts

1. Agent skill discovery via standard `SKILL.md` folder.
2. Browser/computer-use supplied by host agent; Microsoft Playwright MCP is the cross-agent fallback and supports persistent headed profiles. The runtime must support visible authenticated Shipd UI interaction and file uploads for autonomous submission.
3. Git and isolated workspace for source inspection and patch work.
4. Docker or equivalent disposable environment for untrusted build/test execution where required.
5. SQLite for persistent budget and outcomes.

## Browser contract

- Browser is mandatory for live Shipd requirements and all platform actions.
- Native host browser preferred; Playwright MCP is the documented cross-agent fallback when configured.
- Never store credentials or bypass CAPTCHA/MFA/anti-bot controls.
- Every live requirement, cost and balance is evidenced with page URL and retrieval timestamp.
- Submission success requires a visible final status/receipt, not merely a click event.

## Authorization model

`create-intake.mjs --autonomous-submit --budget-cap N` creates an explicit authorization manifest enabling paid actions, uploads, challenge creation, evaluation and submission within cap. It does not waive hard gates or authorize account setting changes, unexpected legal attestations, anti-bot bypasses, cap overruns or unverified spend. The default intake is read-only research + local work.

## Hard gates

- Live quest policy is current and verified.
- Repository eligibility is supported by evidence.
- Candidate feature has a documented novelty search scope and no known duplicate.
- Problem contract is testable and non-prescriptive.
- Test patch fails against the base for the intended reason.
- Solution patch passes new and relevant existing tests.
- Docker/JUnit/offline/repeatability checks pass where required by current policy.
- Artifacts and repository SHA match the readiness report.
- Current account balance and operation costs are verified before paid work.
- Actual spend is reconciled after each operation.
- Final submission receipt/status is recorded.

## Non-goals and limitations

Forge does not promise global novelty, a particular Shipd evaluation result, or 80% acceptance. It does not bundle a universal Shipd API, login automation or browser driver. Browser support is a host-agent capability. A missing capability is `BLOCKED`, never simulated as success.
