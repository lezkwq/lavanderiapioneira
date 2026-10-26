const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');const path=require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('http://127.0.0.1:5173/?previewBreeze=1&t=0');await page.waitForFunction(()=>window.__hero?.ready||window.__hero?.error,{timeout:30000});
 await page.waitForTimeout(300);console.log(await page.evaluate(()=>({...window.__hero,frameTimes:undefined,setTime:undefined})),errors);
 const out=path.resolve('../layer-review');fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,'desktop-t0.png')});
 await page.evaluate(()=>window.__setHeroTime(4));await page.screenshot({path:path.join(out,'desktop-t4.png')});
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>window.__hero?.variant==='mobile'&&window.__hero?.ready);await page.waitForTimeout(200);
 await page.evaluate(()=>window.__setHeroTime(0));await page.screenshot({path:path.join(out,'mobile-t0.png')});
 await page.evaluate(()=>window.__setHeroTime(4));await page.screenshot({path:path.join(out,'mobile-t4.png')});
 console.log('mobile',await page.evaluate(()=>({variant:window.__hero.variant,ready:window.__hero.ready,canvasCount:document.querySelectorAll('canvas').length,engines:window.__hero.activeEngines})),errors);
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
