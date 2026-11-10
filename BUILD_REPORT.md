# Shipd Forge v0.3.0 — Build Report

## Delivered

- Provider-neutral Agent Skill and cross-agent installer.
- Challenge/repository URL intake generator.
- Explicit authorization manifest with read-only default and optional autonomous-submit mode bounded by a user-defined cap.
- Browser operations playbook covering live research, authenticated session handling, evidence, uploads, paid operations, final submission and state verification.
- Cross-agent Playwright MCP setup guide and configuration template for Codex, Claude Code, Antigravity and other MCP clients.
- Public GitHub bootstrap prompt so the agent can fetch/install the latest skill without a manual ZIP download.
- SQLite token ledger and existing repository/artifact checks carried forward.
- Tests for package, intake authorization and existing ledger/gate behaviour.

## Verification

Verification completed on Node.js v22.16.0: `npm test` — **12 passed, 0 failed**. The installer was smoke-tested for project scope and successfully placed the skill in Codex/Antigravity and Claude Code locations. The intake helper was tested for read-only defaults, mandatory budget cap for autonomous submission, and authorization-scope validation.

## Important boundary

This package is a complete skill package and operating protocol, but not a universal browser automation product. The actual browser driver is supplied by the host agent. A live Shipd UI, authenticated account session, current quest costs and current requirements were not available to this build process, so no live Shipd submission was attempted or claimed. The user must publish the repository to GitHub to use the public bootstrap prompt with a real URL.

## Next operational step

Publish this repository as public `shipd-forge`, replace the placeholder GitHub owner in `BOOTSTRAP_PROMPT.md`, then invoke it from the chosen browser-capable coding agent with a real challenge URL, repository URL and explicit authorization mode.
