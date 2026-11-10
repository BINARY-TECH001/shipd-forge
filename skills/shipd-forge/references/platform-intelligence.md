# Shipd Platform Intelligence — Evidence and Caution Notes

## Purpose
This document carries forward research gathered during earlier Shipd reverse-engineering work. It is a research notebook, not a live specification. The agent MUST verify every quest-specific and time-sensitive rule against the current challenge/quest interface before relying on it.

## Previously investigated areas
- Shipd challenge lifecycle and quest tracks, including Olympus and Mars.
- Repository eligibility, task scope, artifact packaging, test patches, solution patches, Docker execution and JUnit reporting.
- Prechecks, scope/quality gates, automated review, model-agent rollouts and originality checks.
- Token budgeting, operation sequencing and acceptance/rejection outcomes.
- Historical Mingo and Marshmallow challenge investigations.

## Historical observations — NOT current policy
Earlier research notes contained examples of:
- Docker base image: `public.ecr.aws/d3j8x8q7/olympus-base:latest`.
- Possible artifact names such as `problem.md`, `test.patch`, `solution.patch`, `Dockerfile`, and `test.sh`.
- An offline evaluation environment and JUnit output expectations.
- A historical set of 14 prechecks.
- Historical estimated costs for prechecks, scope checks, quality checks, agent rollouts and Auto Review.
- Historical Olympus calibration examples involving Nova, Orion and Vega model families, including run-count and solve-rate bands.

These details may have changed, may apply only to a specific quest version, and may have been recorded incompletely. Never hardcode them as universal requirements or current prices. Verify the live challenge contract and save a dated policy snapshot.

## Known research-quality cautions
- Prior notes contained inconsistent test directory references (`tests/new/` versus `test/new/`). Resolve from the current quest docs and repository conventions.
- A challenge's minimum stars, licence allowlist, source requirements, modified-file limits, effective LOC, model pools and calibration thresholds must be read from its current quest rules.
- A platform page being accessible does not establish that an account is authorized to create, evaluate or submit.
- A visible price is not necessarily the total cost of a complete evaluation sequence.
- Do not infer current account balance or evaluator availability from old screenshots or notes.

## Prior challenge examples
Mingo, Marshmallow and a Molstar repository challenge were previously investigated. Treat their lessons as case studies only; do not reuse their challenge text, patches or feature ideas as new work without independent originality checks.

## Provenance rule
When using a fact from this file in a readiness decision, label it `historical research` and independently verify it. If it cannot be verified, mark the relevant gate `UNVERIFIED` or `BLOCKED`.
