const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('src/sceneMotion.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const context={exports:{},Math,Float32Array};vm.runInNewContext(source,context);
const report={};
for(const name of ['desktop','mobile']){
 const meta=JSON.parse(fs.readFileSync(`public/hero/${name}-scene.json`,'utf8'));
 const scene=new context.exports.SceneMotion(meta);
 const sample=t=>{scene.update(t);return [...scene.offsets,...scene.clouds];};
 const zero=sample(0),end=sample(8),h=.0001;
 assert.deepEqual(zero,end);
 const before0=sample(-h),after0=sample(h),before8=sample(8-h),after8=sample(8+h);
 const v0=after0.map((x,i)=>(x-before0[i])/(2*h)),v8=after8.map((x,i)=>(x-before8[i])/(2*h));
 const difference=Math.max(...v0.map((x,i)=>Math.abs(x-v8[i])));
 assert.equal(difference,0);
 report[name]={loopMax:Math.max(...zero.map((x,i)=>Math.abs(x-end[i]))),velocityMismatchPxPerSecond:difference};
}
console.log(JSON.stringify(report,null,2));
