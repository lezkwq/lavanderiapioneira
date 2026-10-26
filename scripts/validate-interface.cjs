const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const out=path.resolve('../interface-validation');fs.mkdirSync(out,{recursive:true});const previous=path.join(out,'results.json');const report=process.env.HERO_UI_ONLY&&fs.existsSync(previous)?JSON.parse(fs.readFileSync(previous,'utf8')):{views:[],errors:[]};if(process.env.HERO_UI_ONLY)report.views=report.views.filter(v=>v.name!==process.env.HERO_UI_ONLY);try{
for(const [name,width,height] of [['desktop',1440,900],['desktop-wide',1920,1080],['laptop',1366,768],['tablet-landscape',1024,768],['mobile',390,844],['mobile-small',375,667],['mobile-tiny',320,568],['tablet-portrait',768,1024],['phone-landscape',844,390],['mobile-compact',360,640],['mobile-medium',375,812],['mobile-large',414,896]]){
 if(process.env.HERO_UI_ONLY&&process.env.HERO_UI_ONLY!==name)continue;
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 await page.goto('http://127.0.0.1:5173/?t=0');await page.waitForFunction(()=>window.__hero?.ready||window.__hero?.error);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,`${name}.png`),animations:'disabled'});
 const metrics=await page.evaluate(()=>{const box=selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right,display:getComputedStyle(e).display}};return {viewport:[innerWidth,innerHeight],scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,variant:window.__hero.variant,error:window.__hero.error,canvasCount:document.querySelectorAll('canvas').length,title:box('h1'),copy:box('.hero-copy'),cta:box('.primary-cta'),header:box('.site-header'),menu:box('.menu-toggle'),fonts:[document.fonts.check('600 36px "Plus Jakarta Sans"'),document.fonts.check('500 13px Manrope')],whatsapp:document.querySelector('.primary-cta').href,bodySections:document.querySelectorAll('main,section').length};});report.views.push({name,...metrics});console.log(name,JSON.stringify(metrics));
 assert.equal(metrics.error,'');assert.equal(metrics.scrollWidth,width);assert.equal(metrics.scrollHeight,height);assert.equal(metrics.canvasCount,1);assert.equal(metrics.fonts.every(Boolean),true);assert.equal(metrics.whatsapp,'https://wa.me/5547997265636');assert.equal(metrics.bodySections,1);
 if(width<1024){await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.screenshot({path:path.join(out,`${name}-menu.png`),animations:'disabled'});await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('href')),'#inicio');await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.menu-toggle').evaluate(e=>document.activeElement===e),true);}
 {
  await page.evaluate(()=>window.__setHeroTime(4));await page.screenshot({path:path.join(out,`${name}-peak.png`),animations:'disabled'});
  const overlap=await page.evaluate(()=>{
   const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2'),w=canvas.width,h=canvas.height;
   // Test-only silhouette pass using the unchanged garment program/VAO left bound.
   gl.disable(gl.BLEND);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,32*40*6,gl.UNSIGNED_SHORT,0);gl.finish();
   const pixels=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
   const rects=[];const walker=document.createTreeWalker(document.querySelector('.hero-copy'),NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){if(!walker.currentNode.textContent.trim()||!walker.currentNode.parentElement.getClientRects().length)continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);for(const r of range.getClientRects())rects.push(r);}
   for(const selector of ['.primary-cta','.secondary-cta']){const e=document.querySelector(selector);if(getComputedStyle(e).display!=='none')rects.push(e.getBoundingClientRect());}
   let count=0;for(const r of rects){for(let y=Math.max(0,Math.ceil(r.top));y<Math.min(h,Math.floor(r.bottom));y++)for(let x=Math.max(0,Math.ceil(r.left));x<Math.min(w,Math.floor(r.right));x++){const i=((h-1-y)*w+x)*4;if(pixels[i]>35&&pixels[i+1]>35&&pixels[i+2]>35)count++;}}
   window.__setHeroTime(4);return count;
  });report.views.at(-1).garmentOverlapPixelsAtPeak=overlap;assert.equal(overlap,0,`${name}: interface overlaps garment`);
 }
 await page.close();
}
}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
