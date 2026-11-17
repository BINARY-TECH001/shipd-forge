import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
const root=new URL("..",import.meta.url).pathname;
function run(t,command,args=[]){const dir=mkdtempSync(join(tmpdir(),"forge-cli-"));t.after(()=>rmSync(dir,{recursive:true,force:true}));const result=spawnSync(process.execPath,[join(root,"src/cli.js"),command,...args,"--db",join(dir,"state.sqlite")],{encoding:"utf8"});return result;}
function jsonFile(dir,name,value){const path=join(dir,name);writeFileSync(path,JSON.stringify(value));return path;}
test("olympus-budget refuses to call subtotal a complete budget",t=>{const r=run(t,"olympus-budget");assert.equal(r.status,2);assert.match(r.stdout,/"complete": false/);});
test("olympus-rollouts CLI validates input file",t=>{const dir=mkdtempSync(join(tmpdir(),"forge-cli-data-"));t.after(()=>rmSync(dir,{recursive:true,force:true}));const f=jsonFile(dir,"runs.json",{nova:Array.from({length:4},()=>({passed:false})),orion:[{passed:true,sequenceLength:200000},{passed:true,sequenceLength:320000},{passed:false},{passed:false}],vega:Array.from({length:4},()=>({passed:false}))});const r=run(t,"olympus-rollouts",["--file",f]);assert.equal(r.status,0);assert.match(r.stdout,/"averagePassingSequenceLength": 260000/);});
test("olympus-transition refuses unverified workflow evidence",t=>{const dir=mkdtempSync(join(tmpdir(),"forge-cli-data-"));t.after(()=>rmSync(dir,{recursive:true,force:true}));const f=jsonFile(dir,"workflow.json",{liveVerified:false,stages:["prechecks","scope-gate"],sourceUrl:"https://shipd.ai",capturedAt:"2026-11-17"});const r=run(t,"olympus-transition",["--file",f,"--from","prechecks","--to","scope-gate"]);assert.equal(r.status,1);assert.match(r.stderr,/Verified live stage-order evidence/);});
