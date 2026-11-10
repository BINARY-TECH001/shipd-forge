import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { runRepoGate, validateArtifacts, hashInputs } from '../src/checks.js';

function temp(t) { const dir=mkdtempSync(join(tmpdir(),'forge-gate-')); t.after(()=>rmSync(dir,{recursive:true,force:true})); return dir; }

test('repository gate blocks when live eligibility metadata is missing', t => {
  const dir=temp(t); execFileSync('git',['init'],{cwd:dir}); execFileSync('git',['config','user.email','forge@test.local'],{cwd:dir}); execFileSync('git',['config','user.name','Forge Test'],{cwd:dir});
  writeFileSync(join(dir,'README.md'),'test'); execFileSync('git',['add','.'],{cwd:dir}); execFileSync('git',['commit','-m','init'],{cwd:dir}); execFileSync('git',['remote','add','origin','https://example.com/test/repo.git'],{cwd:dir});
  const result=runRepoGate(dir,{}); assert.equal(result.decision,'BLOCKED'); assert.equal(result.passed,false); assert.ok(result.commit);
});

test('artifact gate reports missing challenge files', t => {
  const dir=temp(t); const result=validateArtifacts(dir); assert.equal(result.passed,false); assert.equal(result.issues.length,5);
});

test('input hash changes when a checked file changes', t => {
  const dir=temp(t); writeFileSync(join(dir,'prompt.md'),'first'); const a=hashInputs(['prompt.md'],dir); writeFileSync(join(dir,'prompt.md'),'second'); const b=hashInputs(['prompt.md'],dir); assert.notEqual(a,b);
});
