# Shipd Forge — public repository bootstrap prompt

Canonical public repository: https://github.com/BINARY-TECH001/shipd-forge

Paste this into Codex, Claude Code or Antigravity:

```text
Set up and use the Shipd Forge Agent Skill from this public repository:
https://github.com/BINARY-TECH001/shipd-forge

First inspect the repository and its README. Clone or fetch the latest stable version into a temporary directory, verify the repository and release/tag, then install the `shipd-forge` skill into the correct location for this agent. Do not overwrite an existing installation without backing it up. Run the package's self-tests and report the installed version and path.

Then use the skill for this task:
Shipd challenge URL: <PASTE_CHALLENGE_URL>
GitHub repository URL: <PASTE_TARGET_REPOSITORY_URL>
Objective: Identify, build and certify a genuinely original challenge.
Maximum Shipd token spend: <SET_CAP>
Authorization: <RESEARCH_ONLY | AUTONOMOUS_SUBMIT>

If AUTONOMOUS_SUBMIT is selected, it authorizes browser-based Shipd operations and final submission only within the stated spend cap and only after all mandatory gates pass. Use the authenticated browser session available to this agent. If no browser tool is available, configure Microsoft Playwright MCP using the instructions in `integrations/PLAYWRIGHT_MCP.md` (Codex: `codex mcp add playwright npx @playwright/mcp@latest`; Claude Code: `claude mcp add playwright npx @playwright/mcp@latest`; Antigravity: add the included MCP JSON in its MCP settings). Restart the agent if required and ask me to sign in directly in the visible browser once. Do not request or store passwords, cookies or MFA codes. Pause for the user to complete login/MFA/CAPTCHA. Never bypass anti-bot controls. If browser access, current balance, current costs or final submission evidence are unavailable, stop and report BLOCKED rather than claiming success.

Read the entire skill and relevant references. Do not merely summarize them. Execute the workflow, preserve evidence and produce the final readiness/submission report.
```

## Recommended publication model

- Keep this repository public so agents can clone/update it without a ZIP download.
- Tag stable releases (for example `v0.3.0`) and keep `main` for ongoing changes.
- Use the bootstrap prompt for initial setup; after installation, invoke the skill by name.
- Never put credentials, account identifiers, cookies, private challenge data or user token balances in the public repository.
