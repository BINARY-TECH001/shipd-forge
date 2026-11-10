import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { getMeta, setMeta } from './db.js';

export function hashInputs(paths, cwd = process.cwd()) {
  const hash = createHash('sha256');
  for (const p of [...paths].sort()) {
    const full = resolve(cwd, p);
    hash.update(p); hash.update('\0');
    hash.update(existsSync(full) ? readFileSync(full) : '<MISSING>');
  }
  return hash.digest('hex');
}

export function saveCheck(db, { challengeId, name, paths, status, details = {}, cwd }) {
  const inputHash = hashInputs(paths, cwd);
  db.prepare(`INSERT INTO checks(challenge_id,check_name,input_hash,status,details,created_at)
    VALUES(?,?,?,?,?,?) ON CONFLICT(challenge_id,check_name,input_hash)
    DO UPDATE SET status=excluded.status,details=excluded.details,created_at=excluded.created_at`)
    .run(challengeId, name, inputHash, status, JSON.stringify(details), new Date().toISOString());
  return { name, status, inputHash, details };
}

export function latestCheck(db, { challengeId, name, paths, cwd }) {
  const inputHash = hashInputs(paths, cwd);
  return db.prepare(`SELECT * FROM checks WHERE challenge_id=? AND check_name=? AND input_hash=? ORDER BY id DESC LIMIT 1`)
    .get(challengeId, name, inputHash) ?? null;
}

export function runRepoGate(repoPath, metadata = {}) {
  const run = (args) => execFileSync('git', args, { cwd: repoPath, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
  const failures = [], warnings = [];
  let commit = null, origin = null, dirty = null;
  try { commit = run(['rev-parse','HEAD']); origin = run(['remote','get-url','origin']); dirty = run(['status','--porcelain']); }
  catch (e) { failures.push(`Not a readable Git repository: ${e.message}`); }
  if (dirty) warnings.push('Working tree is dirty; pin and verify a clean commit before challenge creation.');
  if (!commit) failures.push('Could not resolve a pinned commit SHA.');
  const license = metadata.license ?? null;
  const stars = Number.isFinite(metadata.stars) ? metadata.stars : null;
  const minStars = Number.isFinite(metadata.minimumStars) ? metadata.minimumStars : null;
  const blocked = [];
  if (license && metadata.allowedLicenses && !metadata.allowedLicenses.includes(license)) failures.push(`License ${license} is not in the explicitly configured quest allowlist.`);
  if (!license) blocked.push('License metadata is missing; repository eligibility cannot be verified.');
  if (stars === null) blocked.push('GitHub star count is missing; repository eligibility cannot be verified.');
  if (minStars === null) blocked.push('Current quest minimum-star requirement is missing; repository eligibility cannot be verified.');
  if (minStars !== null && stars !== null && stars < minStars) failures.push(`Star count ${stars} is below configured minimum ${minStars}.`);
  const hasLock = ['package-lock.json','pnpm-lock.yaml','yarn.lock','poetry.lock','uv.lock','Pipfile.lock','Cargo.lock','go.sum'].some(f => existsSync(resolve(repoPath,f)));
  if (!hasLock) warnings.push('No recognized dependency lockfile found at repository root.');
  return { passed: failures.length === 0 && blocked.length === 0, decision: failures.length ? 'FAIL' : blocked.length ? 'BLOCKED' : 'PASS', failures, blocked, warnings, commit, origin, clean: dirty === '', hasLock,
    metadataVerified: stars !== null && !!license && minStars !== null };
}

export function validateArtifacts(dir) {
  const required = ['problem.md','test.patch','solution.patch','Dockerfile','test.sh'];
  const missing = required.filter(f => !existsSync(resolve(dir,f)));
  const script = existsSync(resolve(dir,'test.sh')) ? readFileSync(resolve(dir,'test.sh'),'utf8') : '';
  const issues = [...missing.map(f => `Missing ${f}`)];
  if (script && !/output_path|junit|xml/i.test(script)) issues.push('test.sh does not visibly document JUnit/output-path handling; inspect harness contract.');
  return { passed: issues.length === 0, issues, required };
}
