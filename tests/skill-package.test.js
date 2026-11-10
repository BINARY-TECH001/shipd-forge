import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

test('canonical skill and browser playbook exist', async () => {
  const skill = await readFile('skills/shipd-forge/SKILL.md','utf8');
  const browser = await readFile('skills/shipd-forge/references/browser-operations.md','utf8');
  assert.match(skill, /autonomousSubmit/);
  assert.match(skill, /browser-operations\.md/);
  assert.match(browser, /verify the resulting platform state/i);
  assert.match(browser, /Do not inspect, export or manually persist cookies/i);
});

test('public repository bootstrap prompt exists', async () => {
  await stat('BOOTSTRAP_PROMPT.md');
  const prompt = await readFile('BOOTSTRAP_PROMPT.md','utf8');
  assert.match(prompt, /AUTONOMOUS_SUBMIT/);
  assert.match(prompt, /github\.com/);
});
