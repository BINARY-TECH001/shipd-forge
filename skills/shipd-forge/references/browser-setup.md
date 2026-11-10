# Cross-agent browser setup with Playwright MCP

Shipd Forge needs a real browser for authenticated Shipd research, file uploads and submission. The most portable fallback is Microsoft's Playwright MCP server. It works with Codex, Claude Code and Antigravity through MCP-compatible configuration.

## Recommended setup

Use the default headed browser and its default persistent profile. This gives the agent a visible browser and preserves the Shipd login between sessions without asking you to paste credentials into prompts. The first time it opens, sign in to Shipd yourself in that browser window and complete any MFA/CAPTCHA yourself. Do not export or share the browser profile, cookies or storage state.

### Codex CLI

```bash
codex mcp add playwright npx @playwright/mcp@latest
```

### Claude Code

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

### Antigravity / MCP-compatible clients

Add the server configuration from [`playwright-mcp.json`](playwright-mcp.json) to the client's MCP server settings. Exact settings-file location can vary by client version; use the UI's MCP server settings when available.

### Generic MCP configuration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

The browser is headed by default. Do not add `--headless` if you want to watch the agent work. For the same persistent profile across multiple challenge workspaces, run Forge tasks from the same stable workspace root; Playwright MCP derives its default profile from the MCP client workspace. On a 16 GB machine, use one browser instance and avoid parallel sessions.

## First-time sign-in

1. Start or restart the coding agent after adding the MCP server.
2. Ask it to open `https://shipd.ai` using the Playwright browser.
3. Sign in directly in the opened browser. Do not send the password or MFA code to the agent.
4. Confirm the Shipd dashboard is visible.
5. Close/reopen the agent if needed; the default Playwright MCP profile persists between sessions.

## Security settings

- Do not enable the Playwright `storage` capability for routine Forge work.
- Do not call tools that export cookies, localStorage, sessionStorage or storage-state JSON.
- Do not enable or invoke `browser_run_code_unsafe`; Microsoft's documentation describes it as RCE-equivalent. Use the structured browser navigation, snapshot, click, fill, upload and screenshot tools instead.
- Keep the browser profile local and private. Do not commit it or copy it into the challenge workspace.
- Browser profiles are tied to the MCP workspace by default. If using multiple clients concurrently, avoid sharing the same profile directory.
- Never bypass CAPTCHA, MFA, anti-bot protections or access controls.

Official documentation:
- https://playwright.dev/docs/getting-started-mcp
- https://playwright.dev/mcp/configuration/user-profile
