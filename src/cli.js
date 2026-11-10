#!/usr/bin/env node
import { openDb } from './db.js';
import { configureBudget, budgetStatus, reserve, settle, recordActual, acceptanceStats } from './ledger.js';
import { runRepoGate, validateArtifacts } from './checks.js';
import { resolve } from 'node:path';

const [command, ...args] = process.argv.slice(2);
const flag = (name, fallback = undefined) => { const i=args.indexOf(name); return i < 0 ? fallback : args[i+1]; };
const has = name => args.includes(name);
const db = openDb(flag('--db', '.shipd-forge/state.sqlite'));
const out = x => console.log(JSON.stringify(x,null,2));

try {
  if (command === 'init') {
    const challengeId = flag('--challenge','default');
    configureBudget(db,{challengeId,cap:Number(flag('--cap','0')),openingBalance: flag('--balance') === undefined ? undefined : Number(flag('--balance'))});
    out({ok:true,challengeId,message:'Initialized local ledger. No Shipd connection or paid action was performed.'});
  } else if (command === 'budget') {
    out(budgetStatus(db,flag('--challenge','default')));
  } else if (command === 'reserve') {
    if (has('--dry-run')) { out({dryRun:true,challengeId:flag('--challenge','default'),operation:flag('--operation'),estimated:Number(flag('--cost','0')),budget:budgetStatus(db,flag('--challenge','default'))}); }
    else out({reservationId:reserve(db,{challengeId:flag('--challenge','default'),operation:flag('--operation','unspecified'),estimated:Number(flag('--cost','0'))})});
  } else if (command === 'settle') {
    settle(db,{reservationId:Number(flag('--id')),actual:Number(flag('--actual')),note:flag('--note','')});
    out({ok:true,reservationId:Number(flag('--id')),actual:Number(flag('--actual'))});
  } else if (command === 'record-spend') {
    if (!has('--confirm')) throw new Error('Refusing to record paid spend without --confirm.');
    recordActual(db,{challengeId:flag('--challenge','default'),operation:flag('--operation','unspecified'),actual:Number(flag('--actual','NaN')),note:flag('--note','')});
    out(budgetStatus(db,flag('--challenge','default')));
  } else if (command === 'repo-gate') {
    const result=runRepoGate(resolve(flag('--path','.')), {stars:flag('--stars')===undefined?null:Number(flag('--stars')),license:flag('--license'),minimumStars:flag('--min-stars')===undefined?null:Number(flag('--min-stars'))});
    out(result); if (!result.passed) process.exitCode=2;
  } else if (command === 'artifacts') {
    const result=validateArtifacts(resolve(flag('--path','.'))); out(result); if (!result.passed) process.exitCode=2;
  } else if (command === 'stats') out(acceptanceStats(db));
  else if (command === 'preflight') {
    out({mode:has('--dry-run')?'dry-run':'read-only',paidActionsEnabled:false,
      requiredBeforePaidActions:['live quest requirements verified','account balance verified','operation cost verified','remaining budget reserved','explicit authorization recorded'],
      note:'This build has no Shipd API/browser adapter. It will not infer live balance, costs, evaluator availability or quest rules.'});
  } else {
    console.log(`Shipd Forge 0.3.0\nCommands:\n  init --challenge ID --cap N [--balance N]\n  budget --challenge ID\n  reserve --challenge ID --operation NAME --cost N [--dry-run]\n  settle --id ID --actual N [--note TEXT]\n  record-spend --challenge ID --operation NAME --actual N --confirm\n  repo-gate --path DIR [--stars N --license SPDX --min-stars N]\n  artifacts --path DIR\n  stats\n  preflight --dry-run\n\nUse --db PATH to select the SQLite ledger. Paid Shipd operations are not implemented.`);
  }
} catch (e) { console.error(JSON.stringify({ok:false,error:e.message},null,2)); process.exitCode=1; }
finally { db.close(); }
