# Shipd Forge Agent Skill

Portable, browser-capable and provider-neutral Agent Skill for Codex, Claude Code, Antigravity and compatible coding agents.

Status: **v0.5.0 remediation candidate — NOT RELEASED**. Work is on branch fix/olympus-v0.5-local-certification. Canonical operational source of truth remains main until local tests, CI and independent review pass and the changes are merged.

## Source of truth
Use latest origin/main for operational work. Verify commit SHA and version, read README/changelog and run tests. Feature branches are development/review only.

## Install
    node scripts/install-skill.mjs --agent all --scope project
    node scripts/install-skill.mjs --agent all --scope user

## Local checks
    npm test
    node src/cli.js artifacts --path ./challenge-artifacts
    node src/cli.js olympus-budget
    node src/cli.js olympus-rollouts --file platform-rollouts.json
    node src/cli.js olympus-general --file general-evidence.json
    node src/cli.js olympus-step-evidence --file step-evidence.json

The budget command exits non-zero while required stage prices are unknown. The known 190-token subtotal is not a complete budget.

## Olympus 17 November 2026 baseline (UNVERIFIED)
Nova >=4 and 0% pass (8 tokens/run); Orion >=4, >0% and <=25% pass (16 tokens/run), average sequence length across passing runs >=256k subject to live confirmation; Vega >=4 and <=25% pass (10 tokens/run); solution quality 12; test quality 12; Trial QA 30 plus 5 per rollout beyond 4/4/4. Prechecks, Scope Gate, Build Image, Quick Check, Step 1 checks and Reward Hacking must be mapped and priced from live UI. Cheat rate below 20%; fairness and environment checks require explicit evidence.

## Local certification first
Run all deterministic local checks before paid platform stages: baseline and fail-to-pass tests, regressions, flakiness, Dockerfile base/WORKDIR, test.sh --output_path, JUnit XML, patch scope, artifact integrity and budget arithmetic. Docker unavailable means BLOCKED. Platform-only facts remain UNVERIFIED until observed in authenticated Shipd UI.

## Limits
No verified universal Shipd API integration. Browser/upload capability depends on host agent. Never store credentials or bypass MFA/CAPTCHA. No paid action without live costs, balance, complete budget, reservation and explicit authorization. The 80% first-pass target is measured, not guaranteed.
