import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function openDb(file = '.shipd-forge/state.sqlite') {
  const path = resolve(file);
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT, challenge_id TEXT NOT NULL,
      operation TEXT NOT NULL, estimated REAL NOT NULL DEFAULT 0,
      actual REAL, status TEXT NOT NULL, note TEXT, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT, challenge_id TEXT NOT NULL,
      check_name TEXT NOT NULL, input_hash TEXT NOT NULL, status TEXT NOT NULL,
      details TEXT, created_at TEXT NOT NULL,
      UNIQUE(challenge_id, check_name, input_hash)
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, challenge_id TEXT NOT NULL,
      repo TEXT, commit_sha TEXT, outcome TEXT NOT NULL,
      revision_required INTEGER NOT NULL DEFAULT 0, tokens_spent REAL NOT NULL DEFAULT 0,
      details TEXT, created_at TEXT NOT NULL
    );`);
  return db;
}

export function getMeta(db, key, fallback = null) {
  return db.prepare('SELECT value FROM meta WHERE key=?').get(key)?.value ?? fallback;
}
export function setMeta(db, key, value) {
  db.prepare('INSERT INTO meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, String(value));
}
