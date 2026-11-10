# Shipd Forge Agent Skill

**A portable, browser-capable, provider-neutral Agent Skill for Codex, Claude Code, Antigravity and compatible coding agents.** Give it a Shipd challenge URL, an optional GitHub repository URL and an authorization/budget scope. The agent researches the live quest, audits the repository, designs and builds an original challenge, certifies it locally, and can operate the authenticated Shipd browser UI and submit when autonomous submission is explicitly authorized.

> Status: **v0.3.0 — browser-ready skill package**. The skill defines browser operation and autonomous submission controls. It does not contain a universal Shipd API or guarantee that every host agent exposes browser/computer-use, upload or file-dialog capabilities. Those capabilities must be available in the chosen agent environment and are verified at runtime.

## Recommended distribution: public GitHub repository

Use one public repository as the source of truth. You do **not** need to download a ZIP for every run. Publish this repository, then give your coding agent the bootstrap prompt in [`BOOTSTRAP_PROMPT.md`](BOOTSTRAP_PROMPT.md). The agent clones the latest version, installs the skill for its own environment and uses it. Keep tagged releases so you can pin known-good versions.

A ZIP remains available as an offline backup or for environments where Git access is unavailable.

## Agent skill locations

- Codex: `.agents/skills/shipd-forge/` or `~/.agents/skills/shipd-forge/`.
- Antigravity: `.agents/skills/shipd-forge/` or `~/.gemini/config/skills/shipd-forge/`.
- Claude Code: `.claude/skills/shipd-forge/` or `~/.claude/skills/shipd-forge/`.

The included installer supports project/user scopes for Codex, Claude Code and Antigravity:

```bash
node scripts/install-skill.mjs --agent all --scope project
# or
node scripts/install-skill.mjs --agent all --scope user
```

## Create a task intake

Research and local work only (safe default):

```bash
node scripts/create-intake.mjs \
  --challenge-url "https://shipd.ai/quests/olympus/challenges/CHALLENGE_ID" \
  --repo-url "https://github.com/owner/repository" \
  --goal "Find and build an original, meaningful challenge suitable for this quest" \
  --budget-cap 50
```

Autonomous browser-based platform workflow and submission (only when you deliberately authorize it):

```bash
node scripts/create-intake.mjs \
  --challenge-url "https://shipd.ai/quests/olympus/challenges/CHALLENGE_ID" \
  --repo-url "https://github.com/owner/repository" \
  --goal "Find, build, certify and submit an original challenge" \
  --budget-cap 50 \
  --autonomous-submit
```

`--autonomous-submit` authorizes paid Shipd actions, uploads, challenge creation, evaluation and final submission only within the stated cap and only after all mandatory gates pass. It does not authorize bypassing CAPTCHA/MFA, accepting unexpected terms, changing account/payment settings, exceeding the cap, or proceeding when costs/balance cannot be verified. The cap is a user-defined maximum, not a claim about current Shipd prices.

The helper creates `.shipd-forge/intake/intake.json` and `TASK.md`. The agent then reads the task and follows the installed skill.

## Browser operation

The skill requires a real browser for live Shipd research and authorized platform actions. Prefer the host agent browser; otherwise use the optional Microsoft Playwright MCP integration, which works across Codex, Claude Code and Antigravity. Its default headed browser profile persists login between sessions: sign in manually once in that browser. The agent then verifies the target challenge/account, collects page evidence, uploads intended artifacts, runs authorized checks, submits once and verifies the resulting status. It must not export credentials or use hidden endpoints to bypass the UI. If browser interaction is unavailable, it reports `BLOCKED` rather than claiming completion. See [`integrations/PLAYWRIGHT_MCP.md`](integrations/PLAYWRIGHT_MCP.md).

See [`skills/shipd-forge/references/browser-operations.md`](skills/shipd-forge/references/browser-operations.md).

## What the skill does

1. Verify live challenge/quest requirements and snapshot the policy.
2. Pin and audit the repository at an exact commit.
3. Search implementation, tests, docs, issues, PRs, releases and Forge history for duplicate/planned work.
4. Compare feature opportunities and select only a defensible original candidate.
5. Write a non-prescriptive task contract and generate quest-required artifacts.
6. Certify baseline, fail-to-pass tests, solution tests, regressions, Docker/JUnit/offline behaviour and repeatability where required.
7. Produce a readiness report with evidence, hashes, commands, risks and spend.
8. When authorized, use the browser to complete the live platform workflow and verify the final submission state.

## Requirements

- Node.js 22.13+ for helper scripts and SQLite ledger.
- Git for repository work.
- Docker recommended/required when the live quest's harness requires it.
- A host agent with browser/computer-use and file-upload capability for autonomous Shipd submission. If needed, configure Playwright MCP using `integrations/PLAYWRIGHT_MCP.md`.
- A logged-in Shipd browser session. Login/MFA/CAPTCHA must be completed by the user when requested.

## Package layout

- `skills/shipd-forge/SKILL.md` — canonical agent instructions.
- `skills/shipd-forge/references/` — browser playbook, quality gates, historical platform notes and agent usage.
- `skills/shipd-forge/templates/` — intake and readiness templates.
- `scripts/install-skill.mjs` — skill installer.
- `scripts/create-intake.mjs` — challenge/repository URL intake and authorization manifest.
- `src/` — persistent SQLite ledger and basic local checks.
- `tests/` — package and foundation tests.
- `BOOTSTRAP_PROMPT.md` — prompt to install/update from the public repository and invoke the skill.
- `integrations/PLAYWRIGHT_MCP.md` — cross-agent browser setup and security guidance.

## Limits and truthfulness

The package does not contain a verified universal Shipd API integration. Platform behaviour, challenge requirements, costs and account balance must be observed live in the browser. Browser support depends on the host agent. Do not claim a challenge was submitted or accepted without a visible platform receipt/status. First-pass acceptance of 80% remains a measured long-term target, not a guarantee.
