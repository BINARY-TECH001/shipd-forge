# Shipd Forge Quality Gates

Missing evidence is BLOCKED, not PASS. The live quest contract overrides historical examples.

## Repository and originality
- [ ] Latest canonical main fetched; SHA/version verified.
- [ ] Pinned base SHA and isolated clean worktree.
- [ ] License, stars, activity and quest metadata verified.
- [ ] Implementation, tests, docs, issues, PRs, releases and prior Forge history searched.
- [ ] Candidate is useful, distinct and testable.

## Challenge and patch quality
- [ ] Prompt is clear, non-prescriptive and externally observable.
- [ ] Test patch fails on base for intended reason.
- [ ] Solution patch passes new and relevant existing tests.
- [ ] No weakened tests, unrelated changes or bypasses.
- [ ] Repeated runs are deterministic; flakiness evidence retained.

## Artifact and harness contract
- [ ] Artifact list matches live quest.
- [ ] Dockerfile base image matches live quest.
- [ ] Dockerfile WORKDIR matches exact live requirement.
- [ ] test.sh parses and uses --output_path.
- [ ] JUnit XML is valid and non-empty.
- [ ] Exit codes propagate correctly.
- [ ] Docker/harness and offline execution tested where required.
- [ ] File count, LOC, runtime and resource limits verified.

## Olympus gates — 2026-11-17 baseline, UNVERIFIED
- [ ] Nova >=4, exactly 0% pass.
- [ ] Orion >=4, >0% and <=25% pass.
- [ ] Average sequence length across passing Orion runs >=256k; confirm live semantics.
- [ ] Vega >=4, <=25% pass.
- [ ] Cheat rate strictly below 20%, with evidence.
- [ ] Fairness explicitly PASS.
- [ ] Environment and reward-hacking checks explicitly PASS.
- [ ] Prechecks, Scope Gate, Build Image, Quick Check and Step 1 checks mapped from live UI.
- [ ] Tests, solution, flakiness and Task Prompt Quality pass before solution quality; verify exact order live.
- [ ] Reward Hacking stage and position verified live.
- [ ] Solution quality then test quality order verified live.
- [ ] Rollout and Trial QA costs verified live.
- [ ] Review, Final Review and FP Panel removal verified live.
- [ ] Current balance and complete stage costs verified.

## Budget and release
- [ ] No complete budget while any required stage price is unknown.
- [ ] Paid reservations require verified balance, complete cost and explicit authorization.
- [ ] No automatic retries or unapproved extra rollouts.
- [ ] Full Forge tests pass locally and in CI on clean runners.
- [ ] CLI commands and documentation agree.
- [ ] Independent review completed.
- [ ] Release merged to main only after certification.
