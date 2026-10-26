const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const out=path.resolve('../scene-validation'),before=path.join(out,'baseline');fs.mkdirSync(out,{recursive:true});
async function raw(png){return sharp(png).removeAlpha().raw().toBuffer();}
function diff(a,b,region,w){let sum=0,max=0,pixels=0,count=0;for(let i=0;i<a.length;i+=3){const x=(i/3)%w,y=Math.floor(i/3/w);if(region&&(x<region[0]||x>=region[2]||y<region[1]||y>=region[3]))continue;let changed=false;for(let c=0;c<3;c++){const d=Math.abs(a[i+c]-b[i+c]);sum+=d;max=Math.max(max,d);changed||=d>0;count++;}if(changed)pixels++;}return {mean:sum/count,max,changedPixels:pixels};}
function rect(r,iw,ih,w,h){const s=Math.max(w/iw,h/ih),ox=w-iw*s,oy=(h-ih*s)*.695;return [Math.ceil(r[0]*s+ox),Math.ceil(r[1]*s+oy),Math.floor(r[2]*s+ox),Math.floor(r[3]*s+oy)];}
async function ready(page,variant){await page.waitForFunction(v=>window.__hero?.variant===v&&(window.__hero?.ready||window.__hero?.error),variant);assert.equal(await page.evaluate(()=>window.__hero.error),'');await page.waitForTimeout(180);}
async function set(page,t){await page.evaluate(t=>{window.__setHeroTime(t);document.querySelector('canvas').getContext('webgl2').finish();},t);}
async function snap(page){return page.screenshot({animations:'disabled'});}
function stats(values){const a=values.slice().sort((a,b)=>a-b);return {samples:a.length,mean:a.reduce((a,b)=>a+b,0)/a.length,p95:a[Math.floor(a.length*.95)]};}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const report={renderer:'SwiftShader',variants:{},consoleErrors:[]};
 try{
 for(const [name,w,h,iw,ih,shirtROI,sunROI,cloudROI,bubbleROI] of [
  ['desktop',1920,1080,1672,941,[1150,330,1400,600],[70,40,160,100],[120,700,600,900],[650,140,780,290]],
  ['mobile',390,844,941,1672,[490,850,650,1080],[180,110,195,140],[30,1370,450,1650],[640,595,780,730]]
 ]){
  const page=await browser.newPage({viewport:{width:w,height:h}});page.on('pageerror',e=>report.consoleErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())});
  const r={unchangedRenderer:[],shirtInterior:[],loop:{},regions:{},performance:{}};report.variants[name]=r;
  await page.goto('http://127.0.0.1:5173/?sceneMotion=0&t=0');await ready(page,name);
  for(const t of [0,2,4,6]){await set(page,t);const a=await raw(await snap(page)),b=await raw(path.join(before,`${name}-${t}.png`));const d=diff(a,b,null,w);r.unchangedRenderer.push({t,...d});assert.equal(d.max,0,'garment/base regression with scene off');}
  await page.goto('http://127.0.0.1:5173/?t=0');await ready(page,name);
  const frames=[];let zero=null,previous=null;const steps=[];
  for(let i=0;i<=240;i++){
   const t=i/30;await set(page,t);const png=await snap(page),pixels=await raw(png);
   if(i===0)zero=pixels;
   if(previous)steps.push(diff(previous,pixels,null,w).mean);previous=pixels;
   if(i%30===0&&i<240){fs.writeFileSync(path.join(out,`${name}-${t}.png`),png);frames.push(png);}
   if([0,60,120,180].includes(i)){
    const b=await raw(path.join(before,`${name}-${t}.png`));const d=diff(pixels,b,rect(shirtROI,iw,ih,w,h),w);r.shirtInterior.push({t,...d});assert.equal(d.max,0,'garment interior changed');
   }
   if(i===120){r.regions.sun=diff(zero,pixels,rect(sunROI,iw,ih,w,h),w);r.regions.rope=diff(zero,pixels,rect(name==='desktop'?[598,46,604,50]:[185,662,191,666],iw,ih,w,h),w);r.regions.clouds=diff(zero,pixels,rect(cloudROI,iw,ih,w,h),w);r.regions.bubble=diff(zero,pixels,rect(bubbleROI,iw,ih,w,h),w);}
   if(i===240){r.loop=diff(zero,pixels,null,w);assert.equal(r.loop.max,0,'loop pixel mismatch');}
   if(i%60===0)console.log(name,'capture',i,'/240');
  }
  const mean=steps.reduce((a,b)=>a+b,0)/steps.length;r.smoothness={meanStep:mean,closingStep:steps.at(-1),closingToMean:steps.at(-1)/mean,openingStep:steps[0],maxStep:Math.max(...steps),maxStepAtSecond:(steps.indexOf(Math.max(...steps))+1)/30};
  const tw=name==='desktop'?480:195,th=name==='desktop'?270:422;
  const thumbs=await Promise.all(frames.map(p=>sharp(p).resize(tw,th).toBuffer()));
  await sharp({create:{width:tw*4,height:th*2,channels:3,background:'#159ce5'}}).composite(thumbs.map((input,i)=>({input,left:(i%4)*tw,top:Math.floor(i/4)*th}))).png().toFile(path.join(out,`${name}-strip.png`));
  // Check actual RAF timings without screenshot/readback overhead.
  const cdp=await page.context().newCDPSession(page);
  for(const rate of [1,4]){
   await cdp.send('Emulation.setCPUThrottlingRate',{rate});await page.evaluate(()=>{window.__hero.sampleCount=0;window.__setHeroTime(null)});await page.waitForTimeout(10000);
   const v=await page.evaluate(()=>({frames:Array.from(window.__hero.frameTimes).slice(0,Math.min(window.__hero.sampleCount,2400)),dpr:window.__hero.dpr}));
   r.performance[`${rate}x`]={...stats(v.frames),dpr:v.dpr};await set(page,0);console.log(name,'performance',rate,r.performance[`${rate}x`]);
  }
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);r.reducedMotion=await page.evaluate(()=>({running:window.__hero.running,canvasVisible:getComputedStyle(document.querySelector('canvas')).display,phase:window.__hero.phase}));assert.equal(r.reducedMotion.running,false);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>window.__setHeroTime(null));
  await page.evaluate(()=>{document.querySelector('main').style.marginTop='200vh'});await page.waitForTimeout(150);const n=await page.evaluate(()=>window.__hero.frames);await page.waitForTimeout(200);r.offscreen=await page.evaluate(n=>({running:window.__hero.running,framesStopped:window.__hero.frames===n}),n);assert.equal(r.offscreen.framesStopped,true);await page.evaluate(()=>{document.querySelector('main').style.marginTop='0'});
  await page.setViewportSize({width:name==='desktop'?390:1920,height:name==='desktop'?844:1080});await ready(page,name==='desktop'?'mobile':'desktop');await page.setViewportSize({width:w,height:h});await ready(page,name);r.resize=await page.evaluate(()=>({variant:window.__hero.variant,canvases:document.querySelectorAll('canvas').length,engines:window.__hero.activeEngines}));assert.equal(r.resize.canvases,1);assert.equal(r.resize.engines,1);
  await page.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
 }
 assert.equal(report.consoleErrors.length,0);console.log(JSON.stringify(report,null,2));
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
