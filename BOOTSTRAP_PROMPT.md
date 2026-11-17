# Shipd Forge — public repository bootstrap prompt

Canonical repository: https://github.com/BINARY-TECH001/shipd-forge

Paste into Codex, Claude Code or Antigravity:

    Set up and use Shipd Forge from https://github.com/BINARY-TECH001/shipd-forge.

    SOURCE OF TRUTH: main is the only canonical operational branch. Fetch origin/main, inspect its latest commit SHA and package version, read README and CHANGELOG, and run the full test suite. Do not use an unmerged feature branch as the installed/released version. If main is behind a remediation branch, report that release is not yet available rather than silently switching branches.

    Back up any existing installation before updating. Install the skill for this agent and report exact version, commit SHA and install path. Run all local tests.

    Task:
    Shipd challenge URL: <PASTE_CHALLENGE_URL>
    GitHub repository URL: <PASTE_TARGET_REPOSITORY_URL>
    Objective: Identify, build and certify an original challenge.
    Maximum Shipd token spend: <SET_CAP>
    Authorization: <RESEARCH_ONLY | AUTONOMOUS_SUBMIT>

    Read the complete skill and relevant references. Research live requirements in the authenticated browser. Run every locally automatable check before any platform operation. This includes baseline/fail-to-pass tests, regression/flakiness, Dockerfile base and WORKDIR, test.sh --output_path, JUnit XML, fairness, reward-hacking, environment blockers and cheat-rate evidence. If Docker is unavailable, mark the check BLOCKED.

    Verify every current platform stage, stage order, cost and account balance from the authenticated Shipd UI. Do not use historical prices as current prices. Do not call a known-token subtotal a complete budget. If any required price or policy is unverified, paid work is BLOCKED. Run Quick Check first only if the live UI confirms it is the cheapest valid next step.

    Default to research and local work. AUTONOMOUS_SUBMIT authorizes only the complete gated workflow within the stated cap. Never bypass MFA/CAPTCHA, request credentials, exceed the cap, or claim success without visible platform evidence. If any mandatory gate fails or is blocked, stop and report it.

    Preserve evidence, exact commands, exit codes, logs, artifact hashes and a readiness report. Do not overwrite user changes.
