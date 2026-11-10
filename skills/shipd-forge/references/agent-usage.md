# Using Shipd Forge with coding agents

Shipd Forge is one provider-neutral skill. The host agent supplies browser/computer-use, repository access, shell and Docker capabilities.

## Codex
Install under `.agents/skills/shipd-forge/` or `~/.agents/skills/shipd-forge/`. Invoke with `$shipd-forge` and provide the intake task. Use Codex browser/computer-use capability where available; otherwise configure Playwright MCP as described in `browser-setup.md`.

## Claude Code
Install under `.claude/skills/shipd-forge/` or `~/.claude/skills/shipd-forge/`. Invoke `/shipd-forge`. Use a configured browser integration or supported computer-use capability; if missing, configure Playwright MCP as described in `browser-setup.md`.

## Antigravity
Install under `.agents/skills/shipd-forge/` or `~/.gemini/config/skills/shipd-forge/`. Invoke the skill by name. Use Antigravity's browser capability for the live Shipd UI; if missing, add the Playwright MCP configuration from `browser-setup.md`.

## Generic agent
Provide the complete skill folder including references, templates and scripts. The agent must confirm that it can browse, interact with the authenticated session, upload files and verify final state before promising autonomous submission.

## Invocation modes

- `RESEARCH_ONLY`: live read-only browser research + local work. No paid actions, upload, create or submit.
- `AUTONOMOUS_SUBMIT`: the user has explicitly authorized the full gated platform workflow within a specified maximum spend. The agent proceeds without asking again only if every mandatory gate and live cost/balance check passes.

Never treat an ordinary challenge URL as authorization to spend or submit. See `references/browser-operations.md`.
