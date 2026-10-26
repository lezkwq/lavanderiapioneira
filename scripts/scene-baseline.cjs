const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path');const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const out=path.resolve('../../work/before-scene');fs.mkdirSync(out,{recursive:true});
 for(const [name,width,height] of [['desktop',1920,1080],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});await page.goto('http://127.0.0.1:5173/?sceneMotion=0&t=0');await page.waitForFunction(()=>window.__hero?.ready);await page.waitForTimeout(200);
  for(const t of [0,2,4,6]){await page.evaluate(t=>window.__setHeroTime(t),t);await page.screenshot({path:path.join(out,`${name}-${t}.png`)});}
  await page.close();console.log('baseline',name);
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
