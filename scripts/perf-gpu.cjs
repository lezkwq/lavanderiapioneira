const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const fs=require('node:fs');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report={variants:{}};try{
for(const [name,width,height] of [['desktop',1920,1080],['mobile',390,844]]){
 const p=await b.newPage({viewport:{width,height}});await p.goto('http://127.0.0.1:5173/?t=0');await p.waitForFunction(()=>window.__hero?.ready);const cdp=await p.context().newCDPSession(p);
 report.renderer=await p.evaluate(()=>{const g=document.querySelector('canvas').getContext('webgl2'),e=g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER)});
 const r={};report.variants[name]=r;
 for(const rate of [1,4]){await cdp.send('Emulation.setCPUThrottlingRate',{rate});await p.evaluate(()=>{window.__hero.sampleCount=0;window.__setHeroTime(null)});await p.waitForTimeout(10000);const a=await p.evaluate(()=>Array.from(window.__hero.frameTimes).slice(0,Math.min(window.__hero.sampleCount,2400)));a.sort((a,b)=>a-b);r[`${rate}x`]={samples:a.length,mean:a.reduce((a,b)=>a+b,0)/a.length,p95:a[Math.floor(a.length*.95)]};await p.evaluate(()=>window.__setHeroTime(0));console.log(name,rate,r[`${rate}x`]);}
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
 r.cycleMs=await p.evaluate(()=>new Promise(resolve=>{window.__setHeroTime(0);window.__setHeroTime(null);let start=null,previous=0;function check(now){if(start===null)start=now;const phase=window.__hero.phase;if(phase<previous){resolve(now-start);return;}previous=phase;requestAnimationFrame(check);}requestAnimationFrame(check);}));
 await p.close();console.log(name,'cycle ms',r.cycleMs);
}
}finally{fs.writeFileSync('../scene-validation/gpu-performance.json',JSON.stringify(report,null,2));await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
