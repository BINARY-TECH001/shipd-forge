import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDb } from '../src/db.js';
import { configureBudget, reserve, settle, budgetStatus, recordSubmission, acceptanceStats } from '../src/ledger.js';

function fixture(t) { const dir=mkdtempSync(join(tmpdir(),'forge-')); const db=openDb(join(dir,'state.sqlite')); t.after(()=>{db.close();rmSync(dir,{recursive:true,force:true});}); return db; }

test('ledger persists spend and balance across database reopen', t => {
  const db=fixture(t); configureBudget(db,{challengeId:'c1',cap:20,openingBalance:15});
  const id=reserve(db,{challengeId:'c1',operation:'prechecks',estimated:3}); settle(db,{reservationId:id,actual:2});
  assert.equal(budgetStatus(db,'c1').spent,2); assert.equal(budgetStatus(db,'c1').balance,13);
});

test('reservation blocks cap overspend', t => {
  const db=fixture(t); configureBudget(db,{challengeId:'c2',cap:5});
  reserve(db,{challengeId:'c2',operation:'a',estimated:4});
  assert.throws(()=>reserve(db,{challengeId:'c2',operation:'b',estimated:2}),/cap would be exceeded/);
});

test('actual settlement cannot exceed cap', t => {
  const db=fixture(t); configureBudget(db,{challengeId:'c3',cap:5});
  const id=reserve(db,{challengeId:'c3',operation:'x',estimated:2});
  assert.throws(()=>settle(db,{reservationId:id,actual:6}),/exceed challenge cap/);
});

test('first-pass acceptance metric excludes revised acceptances', t => {
  const db=fixture(t); recordSubmission(db,{challengeId:'a',outcome:'accepted',revisionRequired:false});
  recordSubmission(db,{challengeId:'b',outcome:'accepted',revisionRequired:true});
  recordSubmission(db,{challengeId:'c',outcome:'rejected'});
  assert.deepEqual(acceptanceStats(db),{total:3,firstPassAccepted:1,accepted:2,firstPassRate:1/3});
});
