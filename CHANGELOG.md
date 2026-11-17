# Changelog

## 0.5.0 remediation candidate — 2026-11-17 (not released)
- Corrected Orion sequence-length validation to use the average across passing runs, pending live semantic confirmation.
- Added cheat-rate, fairness and environment evidence validators.
- Added local Step 1 evidence gate and complete-budget blocking for unknown stage prices.
- Implemented Olympus CLI handlers and stronger Dockerfile/test.sh artifact checks.
- Added artifact/CLI tests and GitHub Actions Node test matrix.
- Preserved main as the canonical operational source of truth; this candidate is not yet certified or merged.


## 0.4.0
- Added unverified dated Olympus rollout policy, token estimator and result validator.
- Added Nova/Orion/Vega pass-rate and Orion sequence-length regression tests.
- Hardened paid reservations and settlements to require sufficient recorded balance.
- Replaced obsolete Auto Review intake flag with Trial QA.


## 0.3.0
- Added browser-first Shipd research and UI operation playbook.
- Added explicit autonomous submission authorization with mandatory user-defined spend cap.
- Added browser evidence, authenticated-session, CAPTCHA/MFA and final-state verification rules.
- Added public-repository bootstrap prompt and root skill entry point.
- Updated cross-agent installation and invocation guidance.
- Clarified that browser availability is supplied by the host agent and is checked at runtime.

## 0.2.0
- Added portable Agent Skill packaging, installer and URL intake helper.
- Added references, templates and package tests.

## 0.1.0
- Added SQLite token ledger, repository/artifact checks and initial CLI.
