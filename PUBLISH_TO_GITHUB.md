# Publish Shipd Forge as a public GitHub repository

The recommended repository name is `shipd-forge`. Publishing it lets coding agents clone/update the skill using one bootstrap prompt; you do not need to download a ZIP for each run.

## Option A — GitHub CLI

From the extracted `shipd-forge` project directory, with GitHub CLI authenticated:

```bash
gh auth status
gh repo create shipd-forge --public --source=. --remote=origin --push
```

If you want the repository under a GitHub organization or a different account, use `OWNER/shipd-forge` instead of `shipd-forge`.

## Option B — GitHub website

1. Create a new repository named `shipd-forge` and set it to **Public**.
2. Do not initialize it with a README, license or `.gitignore` (this project already contains them).
3. In this project directory, run:

```bash
git init
git branch -M main
git add .
git commit -m "Shipd Forge v0.3.0: browser-capable agent skill"
git remote add origin https://github.com/BINARY-TECH001/shipd-forge.git
git push -u origin main
```

4. Repository owner: `BINARY-TECH001`.
5. Replace `YOUR_GITHUB_OWNER/shipd-forge` in `BOOTSTRAP_PROMPT.md` with the real repository path.
6. Tag the release:

```bash
git tag v0.3.0
git push origin v0.3.0
```

## Before making it public

- Check that no `.env`, access token, password, cookie, browser profile, private account detail or private challenge data is included.
- Keep `.shipd-forge/`, SQLite databases and browser state out of Git; `.gitignore` already excludes them.
- Review the license and historical Shipd research notes before publication.
- Do not publish private repository code or challenge artifacts from a live submission.
