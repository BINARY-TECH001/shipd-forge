import { getMeta, setMeta } from './db.js';
const now = () => new Date().toISOString();

export function configureBudget(db, { challengeId, cap, openingBalance }) {
  if (!challengeId || !Number.isFinite(cap) || cap < 0) throw new Error('challengeId and non-negative cap are required');
  if (openingBalance !== undefined && (!Number.isFinite(openingBalance) || openingBalance < 0)) throw new Error('openingBalance must be non-negative');
  setMeta(db, `cap:${challengeId}`, cap);
  if (openingBalance !== undefined) setMeta(db, `balance:${challengeId}`, openingBalance);
}

export function totals(db, challengeId) {
  const row = db.prepare(`SELECT COALESCE(SUM(CASE WHEN status='actual' THEN actual ELSE 0 END),0) spent,
    COALESCE(SUM(CASE WHEN status='reserved' THEN estimated ELSE 0 END),0) reserved,
    COALESCE(SUM(CASE WHEN status='estimate' THEN estimated ELSE 0 END),0) estimates
    FROM ledger WHERE challenge_id=?`).get(challengeId);
  return { spent: row.spent, reserved: row.reserved, estimates: row.estimates };
}

export function budgetStatus(db, challengeId) {
  const cap = Number(getMeta(db, `cap:${challengeId}`, '0'));
  const balanceRaw = getMeta(db, `balance:${challengeId}`);
  const balance = balanceRaw === null ? null : Number(balanceRaw);
  const t = totals(db, challengeId);
  return { challengeId, cap, balance, ...t, availableCap: Math.max(0, cap - t.spent - t.reserved), projected: t.spent + t.reserved };
}

export function addEstimate(db, { challengeId, operation, estimated, note = '' }) {
  if (!Number.isFinite(estimated) || estimated < 0) throw new Error('estimated cost must be non-negative');
  db.prepare(`INSERT INTO ledger(challenge_id,operation,estimated,status,note,created_at) VALUES(?,?,?,'estimate',?,?)`)
    .run(challengeId, operation, estimated, note, now());
}

export function reserve(db, { challengeId, operation, estimated, note = '' }) {
  if (!Number.isFinite(estimated) || estimated < 0) throw new Error('reservation must be non-negative');
  const s = budgetStatus(db, challengeId);
  if (estimated > s.availableCap) throw new Error(`Budget cap would be exceeded: need ${estimated}, available ${s.availableCap}`);
  if (s.balance !== null && estimated > s.balance - s.spent - s.reserved) throw new Error('Insufficient recorded platform balance for reservation');
  const result = db.prepare(`INSERT INTO ledger(challenge_id,operation,estimated,status,note,created_at) VALUES(?,?,?,'reserved',?,?)`)
    .run(challengeId, operation, estimated, note, now());
  return Number(result.lastInsertRowid);
}

export function settle(db, { reservationId, actual, note = '' }) {
  if (!Number.isFinite(actual) || actual < 0) throw new Error('actual cost must be non-negative');
  const item = db.prepare("SELECT * FROM ledger WHERE id=? AND status='reserved'").get(reservationId);
  if (!item) throw new Error('active reservation not found');
  const s = budgetStatus(db, item.challenge_id);
  if (actual > s.cap - s.spent - (s.reserved - item.estimated)) throw new Error('Actual cost would exceed challenge cap; stop and reconcile');
  db.prepare("UPDATE ledger SET status='actual', actual=?, note=?, created_at=? WHERE id=?")
    .run(actual, note, now(), reservationId);
  if (s.balance !== null) setMeta(db, `balance:${item.challenge_id}`, Math.max(0, s.balance - actual));
}

export function recordActual(db, { challengeId, operation, actual, note = '' }) {
  if (!Number.isFinite(actual) || actual < 0) throw new Error('actual cost must be non-negative');
  const s = budgetStatus(db, challengeId);
  if (actual > s.availableCap) throw new Error(`Actual spend would exceed challenge cap: need ${actual}, available ${s.availableCap}`);
  db.prepare(`INSERT INTO ledger(challenge_id,operation,estimated,actual,status,note,created_at) VALUES(?,?,0,?,'actual',?,?)`)
    .run(challengeId, operation, actual, note, now());
  if (s.balance !== null) setMeta(db, `balance:${challengeId}`, Math.max(0, s.balance - actual));
}

export function recordSubmission(db, record) {
  db.prepare(`INSERT INTO submissions(challenge_id,repo,commit_sha,outcome,revision_required,tokens_spent,details,created_at)
    VALUES(?,?,?,?,?,?,?,?)`).run(record.challengeId, record.repo ?? null, record.commitSha ?? null,
    record.outcome, record.revisionRequired ? 1 : 0, record.tokensSpent ?? 0,
    JSON.stringify(record.details ?? {}), now());
}

export function acceptanceStats(db) {
  const row = db.prepare(`SELECT COUNT(*) total,
    SUM(CASE WHEN outcome='accepted' AND revision_required=0 THEN 1 ELSE 0 END) first_pass,
    SUM(CASE WHEN outcome='accepted' THEN 1 ELSE 0 END) accepted FROM submissions`).get();
  return { total: row.total, firstPassAccepted: row.first_pass ?? 0, accepted: row.accepted ?? 0,
    firstPassRate: row.total ? (row.first_pass ?? 0) / row.total : null };
}
