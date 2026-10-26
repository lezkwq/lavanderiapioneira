const { chromium } = require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.env.HERO_TEST_URL || 'http://127.0.0.1:5173';
const output = path.resolve('../outputs');
fs.mkdirSync(output, { recursive: true });
const report = { url: base, cases: [], consoleErrors: [] };
async function posterReady(page) {
  await page.waitForFunction(() => { const img = document.querySelector('.hero-poster'); return img?.complete && img.naturalWidth > 0; });
}
async function videoReady(page, variant) {
  await page.waitForFunction(v => {
    const el = document.querySelector('.hero-video');
    return document.querySelector('.hero')?.dataset.variant === v && el?.readyState >= 2 && !el.paused && el.currentTime > 0 && el.dataset.visible === 'true';
  }, variant, { timeout: 30000 });
}
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    for (const [name, width, height, variant] of [['desktop',1920,1080,'desktop'],['mobile',390,844,'mobile'],['square',800,800,'desktop'],['phone-landscape',844,390,'desktop']]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const requests = [];
      page.on('request', r => { if (/\/hero\/.*\.mp4/.test(r.url())) requests.push(r.url()); });
      page.on('pageerror', e => report.consoleErrors.push(String(e)));
      page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
      await page.goto(base);
      await posterReady(page);
      await videoReady(page, variant);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => {
        const v = document.querySelector('video');
        return { src: v.currentSrc, muted: v.muted, loop: v.loop, autoplay: v.autoplay, inline: v.playsInline, dimensions: [v.videoWidth,v.videoHeight], canvasCount: document.querySelectorAll('canvas').length, scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth };
      });
      assert.equal(result.muted && result.loop && result.autoplay && result.inline, true);
      assert.deepEqual(result.dimensions, variant === 'desktop' ? [1280,720] : [720,1280]);
      assert.equal(result.canvasCount, 0);
      assert.equal(result.scrollWidth, result.viewport);
      assert(requests.length > 0 && requests.every(url => url.includes(`/hero/${variant}.mp4`)));
      if (name === 'desktop' || name === 'mobile') {
        // Seek close to the end, then observe an actual wrap and resumed playback.
        await page.evaluate(() => { const v=document.querySelector('video'); v.currentTime=v.duration-.25; });
        await page.waitForFunction(() => { const v=document.querySelector('video'); return v.currentTime>.05 && v.currentTime<1 && !v.paused; });
        result.loopObserved = true;
        await page.screenshot({ path: path.join(output,`hero-${name}.png`), animations: 'disabled' });
      }
      if (name === 'mobile') {
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.primary-cta').getAttribute('href'), 'https://wa.me/5547984260159');
        result.menuVerified = true;
      }
      if (name === 'desktop') {
        await page.setViewportSize({width:390,height:844});
        await videoReady(page,'mobile');
        await page.setViewportSize({width:1920,height:1080});
        await videoReady(page,'desktop');
        assert.equal(await page.locator('video').count(),1);
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.waitForFunction(()=>!document.querySelector('video'));
        await posterReady(page);
        await page.emulateMedia({reducedMotion:'no-preference'});
        await videoReady(page,'desktop');
        result.orientationAndMotionChanges = true;
      }
      report.cases.push({name,...result,initialVideoRequests:requests.slice(0,1)});
      console.log('PASS', name, JSON.stringify(result));
      await page.close();
    }
    for (const [variant,width,height] of [['desktop',1920,1080],['mobile',390,844]]) {
      for (const mode of ['reduced-motion','network-failure','autoplay-rejected','loading']) {
        const page = await browser.newPage({viewport:{width,height}, reducedMotion:mode==='reduced-motion'?'reduce':'no-preference'});
        const requests=[];
        page.on('request',r=>{if(/\/hero\/.*\.mp4/.test(r.url()))requests.push(r.url());});
        if(mode==='network-failure')await page.route('**/hero/*.mp4',route=>route.abort('failed'));
        if(mode==='autoplay-rejected')await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Test autoplay denied','NotAllowedError'));};});
        let release;
        const pending = new Promise(resolve=>{release=resolve;});
        if(mode==='loading')await page.route('**/hero/*.mp4',async route=>{await pending;await route.abort();});
        await page.goto(base,{waitUntil:'domcontentloaded'});
        await posterReady(page);
        if(mode==='network-failure'||mode==='autoplay-rejected')await page.waitForFunction(()=>!document.querySelector('video'));
        if(mode==='reduced-motion'){
          await page.waitForTimeout(300);
          assert.equal(await page.locator('video').count(),0);
          assert.equal(requests.length,0);
        }
        if(mode==='loading')assert.equal(await page.locator('video').getAttribute('data-visible'),'false');
        assert.equal(await page.locator('.hero-poster').isVisible(),true);
        assert(requests.every(url=>url.includes(`/hero/${variant}.mp4`)));
        report.cases.push({name:`${variant}-${mode}`,posterVisible:true,videoRequests:requests.length});
        console.log('PASS',variant,mode,'poster visible; requests:',requests.length);
        if(release)release();
        await page.close();
      }
    }
    assert.deepEqual(report.consoleErrors,[]);
  } finally {
    fs.writeFileSync(path.join(output,'hero-video-tests.json'),JSON.stringify(report,null,2));
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
