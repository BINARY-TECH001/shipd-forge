# Shipd Forge Quality Gates

This is a generic engineering checklist. The live quest contract overrides generic assumptions.

## Repository gate
- [ ] Repository URL resolves to the intended project.
- [ ] Exact base commit SHA pinned.
- [ ] Working tree isolated; user changes preserved.
- [ ] Licence identified and allowed by current quest policy.
- [ ] Stars/activity/size/age/other metadata verified where required.
- [ ] Relevant build/test commands identified.
- [ ] Baseline health recorded.
- [ ] Quest-specific repository limits checked.

## Originality gate
- [ ] Relevant implementation searched.
- [ ] Tests and docs searched.
- [ ] Issues and pull requests searched where accessible.
- [ ] Recent commits and releases reviewed.
- [ ] Prior Forge challenge history searched.
- [ ] Candidate is materially distinct, useful and testable.
- [ ] Search coverage and unavailable sources disclosed.

## Task quality gate
- [ ] User-facing problem and expected behaviour are clear.
- [ ] Acceptance criteria are observable.
- [ ] Inputs, outputs, errors and edge cases are defined.
- [ ] Prompt does not over-prescribe internal implementation.
- [ ] Scope is meaningful but bounded.
- [ ] Task is consistent with current quest policy.

## Patch and test gate
- [ ] Base commit unchanged and recorded.
- [ ] Test patch applies cleanly.
- [ ] Tests fail on base for the intended reason.
- [ ] Solution patch applies cleanly.
- [ ] Tests pass with solution.
- [ ] Existing tests remain green.
- [ ] No unrelated edits or test weakening.
- [ ] Tests cover important edge cases and regressions.
- [ ] Repeatability/flakiness checked.
- [ ] JUnit format verified if required.
- [ ] Offline dependency behaviour verified if required.
- [ ] Docker contract verified by actually running it if required.
- [ ] File/LOC/runtime/resource limits verified against current rules.

## Safety gate
- [ ] No secrets passed to untrusted code.
- [ ] No permission bypass.
- [ ] No unreviewed install hooks executed on host.
- [ ] Disposable execution environment used for untrusted tests.
- [ ] No paid operation without current cost/balance and reservation.

## Final readiness gate
- [ ] All required gates have current evidence.
- [ ] All artifacts are hashed and archived.
- [ ] Policy snapshot is current.
- [ ] Token ledger reconciled.
- [ ] User approval obtained for the exact next paid action.


## Olympus-specific gates (baseline; verify live)
- [ ] Free preflight covers solution, tests, flakiness, prompt quality, environment and reward-hacking.
- [ ] Solution quality and test quality order verified in live UI.
- [ ] Nova/Orion/Vega counts and pass-rate limits validated from platform evidence.
- [ ] Passing Orion run reports sequenceLength >=256000.
- [ ] Trial QA fee includes base plus five tokens per extra rollout.
- [ ] Verified balance and user cap cover reserved spend.
- [ ] No automatic retries or unapproved extra rollouts.
- [ ] Visible acceptance confirmation recorded.
