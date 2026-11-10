import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const script = resolve('scripts/create-intake.mjs');
function run(args, cwd) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
}

test('intake defaults to read-only and browser-required', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'forge-intake-'));
  try {
    const r = run(['--challenge-url','https://shipd.ai/quests/olympus/challenges/abc','--out','.shipd-forge/intake'], dir);
    assert.equal(r.status, 0, r.stderr);
    const m = JSON.parse(await readFile(join(dir,'.shipd-forge/intake/intake.json'),'utf8'));
    assert.equal(m.browser.required, true);
    assert.equal(m.authorization.submit, false);
    assert.equal(m.authorization.paidShipdActions, false);
  } finally { await rm(dir,{recursive:true,force:true}); }
});

test('autonomous submit requires an explicit budget cap and enables scoped actions', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'forge-intake-'));
  try {
    const bad = run(['--challenge-url','https://shipd.ai/challenges/abc','--autonomous-submit'], dir);
    assert.notEqual(bad.status, 0);
    const good = run(['--challenge-url','https://shipd.ai/challenges/abc','--budget-cap','25','--autonomous-submit','--out','.shipd-forge/intake'], dir);
    assert.equal(good.status, 0, good.stderr);
    const m = JSON.parse(await readFile(join(dir,'.shipd-forge/intake/intake.json'),'utf8'));
    assert.equal(m.authorization.autonomousSubmit, true);
    assert.equal(m.authorization.submit, true);
    assert.equal(m.authorization.upload, true);
    assert.equal(m.authorization.maximumSpend, 25);
  } finally { await rm(dir,{recursive:true,force:true}); }
});

test('upload or submit cannot be authorized without paid-action authorization', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'forge-intake-'));
  try {
    const r = run(['--challenge-url','https://shipd.ai/challenges/abc','--budget-cap','10','--authorize-submit'], dir);
    assert.notEqual(r.status, 0);
  } finally { await rm(dir,{recursive:true,force:true}); }
});
