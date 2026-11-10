#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const flag = (name, fallback = '') => { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] ?? '') : fallback; };
const challengeUrl = flag('--challenge-url');
const repoUrl = flag('--repo-url');
const objective = flag('--goal', 'Investigate the repository and identify the strongest genuinely original challenge suitable for this quest.');
const capRaw = flag('--budget-cap');
const outDir = resolve(flag('--out', '.shipd-forge/intake'));
const autonomousSubmit = has('--autonomous-submit');
const authorizePaid = has('--authorize-paid') || autonomousSubmit;
const authorizeUpload = has('--authorize-upload') || autonomousSubmit;
const authorizeCreate = has('--authorize-create') || autonomousSubmit;
const authorizeEvaluation = has('--authorize-evaluation') || autonomousSubmit;
const authorizeSubmit = has('--authorize-submit') || autonomousSubmit;

if (!challengeUrl) throw new Error('Missing required --challenge-url.');
const challenge = new URL(challengeUrl);
if (!['http:', 'https:'].includes(challenge.protocol) || !/(^|\.)shipd\.ai$/i.test(challenge.hostname)) throw new Error('Challenge URL must be an HTTP(S) URL on shipd.ai.');
let repo = null;
if (repoUrl) {
  const u = new URL(repoUrl);
  if (!['http:', 'https:', 'ssh:'].includes(u.protocol) || !/(^|\.)github\.com$/i.test(u.hostname)) throw new Error('Repository URL must point to github.com.');
  repo = repoUrl;
}
if (capRaw && (!Number.isFinite(Number(capRaw)) || Number(capRaw) < 0)) throw new Error('--budget-cap must be a non-negative number.');
if ((authorizePaid || authorizeUpload || authorizeCreate || authorizeEvaluation || authorizeSubmit) && !capRaw) {
  throw new Error('A --budget-cap is required when authorizing paid or irreversible platform actions.');
}
if ((authorizeUpload || authorizeCreate || authorizeEvaluation || authorizeSubmit) && !authorizePaid) {
  throw new Error('Platform actions require --authorize-paid, or use --autonomous-submit to authorize the complete gated workflow.');
}
const id = challenge.pathname.match(/\/challenges\/([^/?#]+)/i)?.[1] || challenge.pathname.split('/').filter(Boolean).at(-1) || 'unknown-challenge';
const authorization = {
  research: true,
  localWork: true,
  browserRead: true,
  paidShipdActions: authorizePaid,
  upload: authorizeUpload,
  createChallenge: authorizeCreate,
  agentRollouts: authorizeEvaluation,
  autoReview: authorizeEvaluation,
  submit: authorizeSubmit,
  autonomousSubmit,
  maximumSpend: capRaw ? Number(capRaw) : 0,
  scope: autonomousSubmit
    ? 'Autonomous end-to-end platform workflow up to the user-specified budget cap, only after every hard gate passes.'
    : 'Research and local work; only individually enabled platform actions are authorized.'
};
const manifest = {
  schemaVersion: 2,
  createdAt: new Date().toISOString(),
  challengeUrl,
  challengeId: id,
  repositoryUrl: repo,
  objective,
  budgetCap: capRaw ? Number(capRaw) : null,
  browser: { required: true, preferredMode: 'host-agent-browser', persistentAuthenticatedSession: true, credentialStorage: false },
  authorization
};
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'intake.json'), JSON.stringify(manifest, null, 2) + '\n');
const task = `# Shipd Forge — execution request\n\nUse the installed \`shipd-forge\` skill. Read its complete SKILL.md and all relevant references before acting.\n\n- Shipd challenge: ${challengeUrl}\n- Challenge ID (URL-derived; verify on the live page): ${id}\n- GitHub repository: ${repo || 'Not supplied; determine whether one is required before asking.'}\n- Objective: ${objective}\n- Maximum Shipd token spend: ${capRaw || 'Not authorized'}\n- Browser: Required. Use the host agent's authenticated browser/computer-use capability.\n- Authorization: ${JSON.stringify(authorization, null, 2)}\n\nExecute the complete workflow, including live browser research and platform interaction where authorized. Preserve evidence. Do not claim success without verifying the final platform state. If autonomous submission is authorized, submit only after every mandatory policy, originality, artifact, local certification, quality and budget gate passes. Stop on CAPTCHA, MFA, unexpected payment, changed costs, warnings, or ambiguous irreversible actions; never bypass them.\n`;
await writeFile(resolve(outDir, 'TASK.md'), task);
console.log(JSON.stringify({ ok: true, workspace: outDir, manifest: resolve(outDir, 'intake.json'), task: resolve(outDir, 'TASK.md'), challengeId: id, repositoryProvided: Boolean(repo), browserRequired: true, authorization }, null, 2));
