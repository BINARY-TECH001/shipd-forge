#!/usr/bin/env node
import { cp, mkdir, realpath, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, '../skills/shipd-forge');
const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const agent = flag('--agent', 'all');
const scope = flag('--scope', 'project');
const project = resolve(flag('--project', process.cwd()));
if (!['project', 'user'].includes(scope)) throw new Error("--scope must be 'project' or 'user'.");
const home = process.env.HOME || process.env.USERPROFILE;
if (!home) throw new Error('Could not determine home directory.');

const targets = {
  codex: scope === 'user' ? join(home, '.agents/skills/shipd-forge') : join(project, '.agents/skills/shipd-forge'),
  antigravity: scope === 'user' ? join(home, '.gemini/config/skills/shipd-forge') : join(project, '.agents/skills/shipd-forge'),
  claude: scope === 'user' ? join(home, '.claude/skills/shipd-forge') : join(project, '.claude/skills/shipd-forge'),
};
const selected = agent === 'all' ? ['codex', 'claude', 'antigravity'] : [agent];
for (const name of selected) if (!targets[name]) throw new Error(`Unknown agent '${name}'. Use codex, claude, antigravity or all.`);
const uniqueTargets = [...new Set(selected.map(name => targets[name]))];
for (const target of uniqueTargets) {
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
  const skillStat = await stat(join(target, 'SKILL.md'));
  if (!skillStat.isFile()) throw new Error(`Skill install verification failed: ${target}`);
  console.log(`Installed Shipd Forge skill: ${target}`);
}
console.log('Installation complete. No Shipd credentials or paid actions were used.');
