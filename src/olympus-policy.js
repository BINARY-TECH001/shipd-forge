export const OLYMPUS_POLICY = Object.freeze({
  version: "2026-11-17",
  status: "UNVERIFIED",
  source: "User-provided Olympus announcement plus reviewer findings; confirm all semantics and prices in authenticated Shipd UI",
  minimumRuns: 4,
  models: {
    nova: { cost: 8, maxPassRate: 0 },
    orion: { cost: 16, minPassRateExclusive: 0, maxPassRate: 0.25, averagePassingSequenceLengthMin: 256000 },
    vega: { cost: 10, maxPassRate: 0.25 }
  },
  quality: { solution: 12, tests: 12 },
  trialQA: { base: 30, perExtraRollout: 5 },
  stages: ["prechecks","scope-gate","build-image","quick-check","step1-checks","reward-hacking","solution-quality","test-quality","rollouts","trial-qa","acceptance-confirmation"],
  workflowOrderStatus: "UNVERIFIED",
  unpricedStages: ["prechecks","scope-gate","build-image","quick-check","step1-checks","reward-hacking"]
});

export function estimateOlympusBudget(counts = {}, liveStagePrices = null, liveVerified = false) {
  const normalized = Object.fromEntries(Object.keys(OLYMPUS_POLICY.models).map(k => [k, counts[k] ?? 4]));
  for (const [model, count] of Object.entries(normalized)) {
    if (!Number.isInteger(count) || count < OLYMPUS_POLICY.minimumRuns) throw new Error(`${model} requires at least ${OLYMPUS_POLICY.minimumRuns} runs`);
  }
  const totalRuns = Object.values(normalized).reduce((a,b) => a+b,0);
  const rolloutTokens = Object.entries(normalized).reduce((sum,[model,count]) => sum + count*OLYMPUS_POLICY.models[model].cost,0);
  const trialQATokens = OLYMPUS_POLICY.trialQA.base + (totalRuns-12)*OLYMPUS_POLICY.trialQA.perExtraRollout;
  const knownTokens = rolloutTokens + OLYMPUS_POLICY.quality.solution + OLYMPUS_POLICY.quality.tests + trialQATokens;
  const missingPrices = OLYMPUS_POLICY.unpricedStages.filter(stage => !liveVerified || !Number.isFinite(liveStagePrices?.[stage]) || liveStagePrices[stage] < 0);
  const pricedStageTokens = OLYMPUS_POLICY.unpricedStages.reduce((sum,stage) => sum + (Number.isFinite(liveStagePrices?.[stage]) && liveStagePrices[stage] >= 0 ? liveStagePrices[stage] : 0),0);
  return {
    counts: normalized,totalRuns,rolloutTokens,qualityTokens:24,trialQATokens,knownTokens,pricedStageTokens,
    total: missingPrices.length ? null : knownTokens+pricedStageTokens,
    missingPrices,complete:missingPrices.length===0,policyStatus:OLYMPUS_POLICY.status,
    warning:"Known-token subtotal is not a complete budget until every required stage price is captured from the live platform."
  };
}

export function validateRollouts(results) {
  const errors=[],summary={};
  for (const [model,rule] of Object.entries(OLYMPUS_POLICY.models)) {
    const runs=results?.[model];
    if (!Array.isArray(runs)||runs.length<4) { errors.push(`${model} requires at least 4 recorded runs`); continue; }
    if (runs.some(run=>typeof run?.passed!=="boolean")) { errors.push(`${model} has invalid/missing pass result`); continue; }
    const passing=runs.filter(run=>run.passed),passRate=passing.length/runs.length;
    summary[model]={count:runs.length,passes:passing.length,passRate};
    if(model==="nova"&&passing.length!==0)errors.push("Nova pass rate must be exactly 0%");
    if(model==="orion"){
      if(!(passRate>0&&passRate<=rule.maxPassRate))errors.push("Orion pass rate must be >0% and <=25%");
      const lengths=passing.map(run=>run.sequenceLength);
      if(lengths.some(length=>!Number.isFinite(length)||length<0))errors.push("Every passing Orion run must include a valid non-negative sequenceLength");
      else if(lengths.length&&lengths.reduce((sum,n)=>sum+n,0)/lengths.length<rule.averagePassingSequenceLengthMin)errors.push("Average sequenceLength across passing Orion runs must be >=256000");
      summary.orion.averagePassingSequenceLength=lengths.length&&lengths.every(Number.isFinite)?lengths.reduce((sum,n)=>sum+n,0)/lengths.length:null;
    }
    if(model==="vega"&&passRate>rule.maxPassRate)errors.push("Vega pass rate must be <=25%");
  }
  return {passed:errors.length===0,errors,summary};
}

export function validateGeneralRequirements(evidence={}) {
  const errors=[],blocked=[],cheatRate=evidence.cheatRate;
  if(!Number.isFinite(cheatRate))blocked.push("Cheat rate evidence is missing");
  else if(cheatRate<0||cheatRate>1)errors.push("Cheat rate must be expressed as a fraction between 0 and 1");
  else if(cheatRate>=0.20)errors.push("Cheat rate must be strictly below 20%");
  for(const key of ["fairness","environment"]){
    if(evidence[key]!=="PASS"){if(evidence[key]==="FAIL")errors.push(`${key} requirement failed`);else blocked.push(`${key} evidence is missing or not verified`);}
  }
  return {passed:errors.length===0&&blocked.length===0,errors,blocked};
}

export function validateLocalStepEvidence(evidence={}) {
  const required=["tests","solution","flakiness","taskPromptQuality","rewardHacking","fairness","environment"];
  const blocked=required.filter(key=>evidence[key]!=="PASS"&&evidence[key]!=="FAIL");
  const failed=required.filter(key=>evidence[key]==="FAIL");
  return {passed:blocked.length===0&&failed.length===0,blocked,failed,required};
}

export function assertPolicyFreshness(status=OLYMPUS_POLICY.status,liveVerified=false) {
  if(status!=="VERIFIED"||!liveVerified)throw new Error("Olympus policy is unverified/stale; re-check live rules, stage order, prices and balance");
  return true;
}

export function assertStageTransition(from,to,verifiedStages=null,liveVerified=false) {
  if(!liveVerified||!Array.isArray(verifiedStages)||verifiedStages.length===0)throw new Error("Live verified stage order is required before validating a platform transition");
  const index=verifiedStages.indexOf(from);
  if(index<0||verifiedStages[index+1]!==to)throw new Error("Invalid Olympus stage transition against verified live order");
  return true;
}
