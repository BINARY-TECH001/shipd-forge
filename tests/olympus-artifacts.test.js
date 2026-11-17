import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {validateArtifacts} from "../src/checks.js";
function fixture(t){const dir=mkdtempSync(join(tmpdir(),"forge-artifacts-"));t.after(()=>rmSync(dir,{recursive:true,force:true}));return dir;}
function writeValid(dir){
  for(const file of ["problem.md","test.patch","solution.patch"])writeFileSync(join(dir,file),"placeholder");
  writeFileSync(join(dir,"Dockerfile"),"FROM public.ecr.aws/d3j8x8q7/olympus-base:latest\nWORKDIR /workspace\n");
  writeFileSync(join(dir,"test.sh"),"#!/usr/bin/env bash\noutput_path=''\nwhile [[ $# -gt 0 ]]; do case \"$1\" in --output_path) output_path=\"$2\"; shift 2;; *) shift;; esac; done\nmkdir -p \"$output_path\"\npytest --junitxml=\"$output_path/junit.xml\"\n");
}
test("accepts required Docker and JUnit contract",t=>{const dir=fixture(t);writeValid(dir);assert.equal(validateArtifacts(dir).passed,true);});
test("rejects wrong Docker base image",t=>{const dir=fixture(t);writeValid(dir);writeFileSync(join(dir,"Dockerfile"),"FROM node:22\nWORKDIR /workspace\n");assert.ok(validateArtifacts(dir).issues.some(issue=>issue.includes("base image")));});
test("rejects missing WORKDIR",t=>{const dir=fixture(t);writeValid(dir);writeFileSync(join(dir,"Dockerfile"),"FROM public.ecr.aws/d3j8x8q7/olympus-base:latest\n");assert.ok(validateArtifacts(dir).issues.some(issue=>issue.includes("WORKDIR")));});
test("rejects missing output_path and JUnit XML",t=>{const dir=fixture(t);writeValid(dir);writeFileSync(join(dir,"test.sh"),"pytest -q\n");const result=validateArtifacts(dir);assert.ok(result.issues.some(issue=>issue.includes("--output_path")));assert.ok(result.issues.some(issue=>issue.includes("JUnit XML")));});
