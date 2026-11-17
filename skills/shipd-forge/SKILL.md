---
name: shipd-forge
description: Research, engineer, locally certify and, when explicitly authorized, submit original Shipd coding challenges.
---
# Shipd Forge — Agent Skill

Use the latest canonical main branch as the operational source of truth. Fetch origin/main, verify its SHA and package version, read README and changelog, and run the full test suite before operating. Feature branches are for development and review only; never treat an unmerged branch as a release.

## Authorization
Default to research, browser read-only work and local work. URLs do not authorize uploads, paid checks, rollouts, Trial QA or submission. Autonomous submission requires an explicit intake manifest, user-defined cap and enabled action flags. Never exceed the cap or bypass a failed gate.

## Required workflow
1. Validate the challenge URL, create an isolated workspace and record the authorization manifest. Never store credentials.
2. Use the authenticated browser to inspect the live challenge and parent quest. Capture exact requirements, source URLs and retrieval time.
3. Record prechecks, Scope Gate, Build Image, Quick Check, Step 1 checks, Reward Hacking, solution quality, test quality, model rollouts and Trial QA. Capture exact live order and every visible price. Unknown order or price is UNVERIFIED.
4. Pin the repository commit. Inspect license, metadata, structure, tests, CI, dependency scripts and history. Search code, docs, issues, PRs, releases and prior Forge work for originality.
5. Create a non-prescriptive task contract and only the artifacts required by the current quest.
6. Run all local certification before any paid platform step: baseline tests; test patch fail-on-base; solution patch pass; existing regression tests; repeatability/flakiness; patch scope and LOC; Dockerfile base image and WORKDIR; test.sh argument parsing and --output_path; valid non-empty JUnit XML; exit-code propagation; offline dependencies; Docker/harness execution; fairness; reward-hacking; environment blockers; cheat-rate evidence; complete Forge tests and CI.
7. Missing evidence is BLOCKED, not PASS. A heuristic cannot prove fairness or absence of reward hacking. Docker unavailable means Docker certification is BLOCKED.
8. Build a complete cost table from live platform evidence. If any required price is unknown, total budget is incomplete and paid work is BLOCKED. Verify balance, reserve spend and enforce the user's cap.
9. Run Quick Check first only if the live UI confirms it is the cheapest valid next check. Do not start rollouts until all preceding mandatory checks pass.
10. Produce a readiness report with evidence, commit SHA, artifact hashes, test commands/results, policy snapshot, complete costs, balance and unresolved risks.
11. Execute only separately authorized UI actions. Re-fetch policy, prices and balance before paid actions. Stop on unexpected prompts, changed costs, warnings or spend mismatch. Never bypass MFA/CAPTCHA.

## Olympus policy snapshot — 2026-11-17 (UNVERIFIED)
User-provided announcement:
- Nova: minimum 4 runs, exactly 0% pass, 8 tokens/run.
- Orion: minimum 4, >0% and <=25% pass, 16 tokens/run. Reviewer clarification: average sequence length across passing/solving Orion runs >=256k. Confirm exact aggregation semantics in live UI.
- Vega: minimum 4, <=25% pass, 10 tokens/run.
- Solution quality 12; test quality 12.
- Trial QA 30 plus 5 per rollout beyond minimum 4/4/4.
- Review, Final Review and FP Panel reportedly removed; Trial QA replaces Auto Review.
- Cheat rate must be strictly below 20%; fairness and environment checks must pass.
- Quick Check is reported as the cheapest setup check. Verify cost, prerequisites and position live.
- Payout range reportedly $350–$400; never guarantee payout.
Prices for prechecks, Scope Gate, Build Image, Quick Check, Step 1 checks and Reward Hacking are not established here. The 190-token figure is only a known subtotal and must never be represented as the complete minimum budget.

## Resumption and reporting
On resume, read manifest, policy snapshot, ledger and previous readiness report. Verify SHA and input hashes. Re-run checks affected by changed inputs. Re-verify current policy, costs and balance before every paid action.

Report each gate as PASS, FAIL, BLOCKED or UNVERIFIED. Never claim submitted, accepted, verified or passed without corresponding evidence. The 80% first-pass target is measured, not guaranteed.
