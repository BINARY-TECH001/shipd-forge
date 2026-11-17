#!/usr/bin/env node
import { openDb } from './db.js';
import { readFileSync } from 'node:fs';
import { configureBudget, budgetStatus, reserve, settle, recordActual, acceptanceStats } from './ledger.js';
import { runRepoGate, validateArtifacts, validateLocalStepEvidence } from './checks.js';
import { estimateOlympusBudget, validateRollouts, validateGeneralRequirements, assertStageTransition } from './olympus-policy.js';
import { resolve } from 'node:path';

const [command,...args]=process.argv.slice(2);
const flag=(name,fallback=undefined)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const has=name=>args.includes(name);
const db=openDb(flag('--db','.shipd-forge/state.sqlite'));
const out=value=>console.log(JSON.stringify(value,null,2));
const readJson=path=>{if(!path)throw new Error('A --file path is required.');return JSON.parse(readFileSync(resolve(path),'utf8'));};

try {
  if(command==='init'){
    const challengeId=flag('--challenge','default');
    configureBudget(db,{challengeId,cap:Number(flag('--cap','0')),openingBalance:flag('--balance')===undefined?undefined:Number(flag('--balance'))});
    out({ok:true,challengeId,message:'Initialized local ledger. No Shipd connection or paid action was performed.'});
  } else if(command==='budget') out(budgetStatus(db,flag('--challenge','default')));
  else if(command==='reserve'){
    if(has('--dry-run'))out({dryRun:true,challengeId:flag('--challenge','default'),operation:flag('--operation'),estimated:Number(flag('--cost','0')),budget:budgetStatus(db,flag('--challenge','default'))});
    else out({reservationId:reserve(db,{challengeId:flag('--challenge','default'),operation:flag('--operation','unspecified'),estimated:Number(flag('--cost','0'))})});
  } else if(command==='settle'){
    settle(db,{reservationId:Number(flag('--id')),actual:Number(flag('--actual')),note:flag('--note','')});
    out({ok:true,reservationId:Number(flag('--id')),actual:Number(flag('--actual'))});
  } else if(command==='record-spend'){
    if(!has('--confirm'))throw new Error('Refusing to record paid spend without --confirm.');
    recordActual(db,{challengeId:flag('--challenge','default'),operation:flag('--operation','unspecified'),actual:Number(flag('--actual','NaN')),note:flag('--note','')});
    out(budgetStatus(db,flag('--challenge','default')));
  } else if(command==='repo-gate'){
    const result=runRepoGate(resolve(flag('--path','.')),{stars:flag('--stars')===undefined?null:Number(flag('--stars')),license:flag('--license'),minimumStars:flag('--min-stars')===undefined?null:Number(flag('--min-stars'))});
    out(result);if(!result.passed)process.exitCode=2;
  } else if(command==='artifacts'){
    const result=validateArtifacts(resolve(flag('--path','.')));out(result);if(!result.passed)process.exitCode=2;
  } else if(command==='olympus-budget'){
    const pricesDoc=flag('--prices-file')?readJson(flag('--prices-file')):null;
    const liveVerified=!!pricesDoc&&pricesDoc.liveVerified===true&&pricesDoc.policyVerified===true&&pricesDoc.workflowVerified===true&&typeof pricesDoc.sourceUrl==='string'&&typeof pricesDoc.capturedAt==='string';
    const result=estimateOlympusBudget({nova:Number(flag('--nova','4')),orion:Number(flag('--orion','4')),vega:Number(flag('--vega','4'))},pricesDoc?.prices??null,liveVerified);
    out({...result,priceEvidence:liveVerified?{sourceUrl:pricesDoc.sourceUrl,capturedAt:pricesDoc.capturedAt}:null});
    if(!result.complete)process.exitCode=2;
  } else if(command==='olympus-rollouts'){
    const result=validateRollouts(readJson(flag('--file')));out(result);if(!result.passed)process.exitCode=2;
  } else if(command==='olympus-general'){
    const result=validateGeneralRequirements(readJson(flag('--file')));out(result);if(!result.passed)process.exitCode=2;
  } else if(command==='olympus-step-evidence'){
    const result=validateLocalStepEvidence(readJson(flag('--file')));out(result);if(!result.passed)process.exitCode=2;
  } else if(command==='olympus-transition'){
    const evidence=readJson(flag('--file'));
    if(evidence.liveVerified!==true||!Array.isArray(evidence.stages)||!evidence.sourceUrl||!evidence.capturedAt)throw new Error('Verified live stage-order evidence is required in the supplied file.');
    assertStageTransition(flag('--from'),flag('--to'),evidence.stages,true);
    out({passed:true,from:flag('--from'),to:flag('--to'),sourceUrl:evidence.sourceUrl,capturedAt:evidence.capturedAt});
  } else if(command==='stats')out(acceptanceStats(db));
  else if(command==='preflight')out({mode:has('--dry-run')?'dry-run':'read-only',paidActionsEnabled:false,requiredBeforePaidActions:['live quest requirements verified','all required stage prices verified','account balance verified','remaining budget reserved','explicit authorization recorded'],note:'No Shipd API/browser adapter is implemented. This command never authorizes or performs paid actions.'});
  else console.log(`Shipd Forge 0.5.0
Commands:
  init --challenge ID --cap N [--balance N]
  budget --challenge ID
  reserve --challenge ID --operation NAME --cost N [--dry-run]
  settle --id ID --actual N [--note TEXT]
  record-spend --challenge ID --operation NAME --actual N --confirm
  repo-gate --path DIR [--stars N --license SPDX --min-stars N]
  artifacts --path DIR
  olympus-budget [--nova N --orion N --vega N] [--prices-file live-stage-prices.json]
  olympus-rollouts --file platform-rollouts.json
  olympus-general --file general-evidence.json
  olympus-step-evidence --file step-evidence.json
  olympus-transition --file verified-workflow.json --from STAGE --to STAGE
  stats
  preflight --dry-run

Olympus policy and stage prices remain UNVERIFIED until captured from the authenticated live quest. Paid Shipd operations are not implemented.`);
} catch(error){console.error(JSON.stringify({ok:false,error:error.message},null,2));process.exitCode=1;}
finally{db.close();}
