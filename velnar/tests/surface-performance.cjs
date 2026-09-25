const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), artifacts = path.join(root, 'artifacts');
const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/profile.html'), 'utf8');
const dashboard = fs.readFileSync(path.join(__dirname, 'fixtures/dashboard.html'), 'utf8');
const transparent = 'rgba(0, 0, 0, 0)';
const rgb = h => `rgb(${h.slice(1).match(/../g).map(n => parseInt(n, 16)).join(', ')})`;
async function until(read, expected) {
  for(let i=0;i<80;i++) { if(await read()===expected)return; await new Promise(r=>setTimeout(r,50)); }
  assert.equal(await read(),expected);
}
async function run(extension, label) {
  const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(),'velnar-surface-')), {
    executablePath:process.env.VELNAR_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true,
    viewport:{width:1440,height:1024},args:['--disable-extensions-except='+extension,'--load-extension='+extension]
  });
  const errors=[]; context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  try {
    const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
    const options=await context.newPage(); await options.goto(`chrome-extension://${worker.url().split('/')[2]}/options/options.html`);
    await options.locator('.gs-theme-choice').first().waitFor();
    await options.evaluate(()=>VELNAR.Storage.selectTheme('the-last-of-us'));
    const page=await context.newPage();
    await page.route('https://github.com/velnar-profile*',r=>r.fulfill({contentType:'text/html',body:fixture}));
    await page.route('https://github.com/dashboard/velnar-test*',r=>r.fulfill({contentType:'text/html',body:dashboard}));
    await page.goto('https://github.com/velnar-profile');
    await page.locator('#velnar-cinematic-scene').waitFor({state:'attached'});
    await page.waitForTimeout(1600);
    const style=(s,p='backgroundColor')=>page.locator(s).first().evaluate((e,p)=>getComputedStyle(e)[p],p);
    const measure=()=>page.evaluate(()=>{
      const animations=document.getAnimations().filter(a=>a.playState==='running');
      const cells=[...document.querySelectorAll('td.ContributionCalendar-day')];
      return {cellCount:cells.length,cellAnimations:cells.reduce((n,e)=>n+e.getAnimations().filter(a=>a.playState==='running').length,0),documentAnimations:animations.length,
        paintAnimations:animations.filter(a=>a.effect.getKeyframes().some(k=>Object.keys(k).some(p=>/^(filter|boxShadow|backgroundPosition|left|top)$/.test(p)))).length,
        themeCssBytes:[...document.querySelectorAll('style[id^="velnar-"]')].reduce((n,e)=>n+new TextEncoder().encode(e.textContent).length,0)};
    });
    const measurements=await measure();
    await page.screenshot({path:path.join(artifacts,`profile-${label}.png`),fullPage:true});
    if(label==='after') {
      const themes=await options.evaluate(()=>VELNAR.PRESET_THEMES.filter(t=>t.scene));
      for(const t of themes) {
        await options.evaluate(id=>VELNAR.Storage.selectTheme(id),t.id);
        await until(()=>style('body'),rgb(t.colors.background));
        for(const s of ['.h-card','.vcard-names','.user-profile-bio','.application-main','main','.Layout-main','.Layout-sidebar','.js-calendar-graph','.js-calendar-graph-table']) assert.equal(await style(s),transparent,`${t.id}: ${s} shares its parent surface`);
        assert.equal(await style('.filter-item.selected'),rgb(t.colors.button));
        assert.equal(await style('.legend [data-level="4"]'),rgb(t.colors.accent));
        assert.equal(await style('.avatar','filter'),'none');
        const before=await style('.Box');await page.locator('.Box').first().hover();assert.equal(await style('.Box'),before,'hover cannot split card surfaces');await page.mouse.move(0,0);
        assert.equal((await measure()).cellAnimations,0);
        assert.equal((await measure()).paintAnimations,0,'cinematic idle motion uses transform and opacity');
      }
      // Storage updates unrelated to rendering must not rewrite styles or replace artwork.
      await page.goto('https://github.com/dashboard/velnar-test');await page.locator('#velnar-world-banner').waitFor({state:'attached'});
      await page.evaluate(()=>{window.savedArt=document.querySelector('#velnar-world-banner').shadowRoot.querySelector('svg');window.styleWrites=0;new MutationObserver(records=>{window.styleWrites+=records.filter(r=>r.target.closest?.('style[id^="velnar-"]')).length}).observe(document.head,{subtree:true,childList:true,characterData:true})});
      await options.evaluate(()=>VELNAR.Storage.toggleFavorite('dark'));
      await page.waitForTimeout(200);
      assert.equal(await page.evaluate(()=>window.styleWrites),0,'favorite update writes no theme CSS');
      await options.evaluate(()=>VELNAR.Storage.set({animationsEnabled:false}));
      await until(()=>page.locator('#velnar-world-banner').getAttribute('data-motion'),'false');
      assert.equal(await page.evaluate(()=>window.savedArt===document.querySelector('#velnar-world-banner').shadowRoot.querySelector('svg')),true,'pause keeps the existing SVG');
      await options.evaluate(()=>VELNAR.Storage.set({animationsEnabled:true}));
      await until(()=>page.locator('#velnar-world-banner').getAttribute('data-motion'),'true');
      assert.equal(await page.evaluate(()=>window.savedArt===document.querySelector('#velnar-world-banner').shadowRoot.querySelector('svg')),true,'resume keeps the existing SVG');
      await page.evaluate(()=>{document.querySelector('#velnar-components').remove();document.dispatchEvent(new Event('turbo:render'));document.dispatchEvent(new Event('turbo:load'));document.dispatchEvent(new Event('pjax:end'))});
      await page.locator('#velnar-components').waitFor({state:'attached'});
      // Slow site scripts must not delay the first palette application.
      let release; const blocked=new Promise(r=>release=r);
      await page.route('https://github.com/velnar-slow.js',async r=>{await blocked;await r.fulfill({contentType:'text/javascript',body:''})});
      await page.route('https://github.com/velnar-slow',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><script src="/velnar-slow.js"></script></head><body><main>Slow loading fixture</main></body></html>'}));
      await page.goto('https://github.com/velnar-slow',{waitUntil:'commit'});
      try { await page.locator('#velnar-theme-vars').waitFor({state:'attached'});assert.equal(await page.evaluate(()=>document.readyState),'loading'); }
      finally {release()}
      await page.waitForLoadState('domcontentloaded');
      await page.goto('https://github.com/velnar-profile');await page.locator('#velnar-cinematic-scene').waitFor({state:'attached'});
      await options.evaluate(()=>VELNAR.Storage.set({enabled:false}));
      await until(()=>page.locator('#velnar-world-skin').count(),0);
      assert.equal(await style('.filter-item.selected'),'rgb(31, 111, 235)','disable restores native selected year');
      await options.evaluate(()=>VELNAR.Storage.set({enabled:true}));await page.locator('#velnar-cinematic-scene').waitFor({state:'attached'});
      await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    await options.evaluate(()=>VELNAR.Storage.selectTheme('the-last-of-us'));
    await page.setViewportSize({width:1440,height:1024});
    await page.goto('https://github.com/dashboard/velnar-test');await page.locator('#velnar-world-banner').waitFor({state:'attached'});
    await until(()=>style('body'),'rgb(12, 18, 15)');
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(150);
    await page.locator('#news-card').screenshot({path:path.join(artifacts,`changelog-${label}.png`)});
    if(label==='after') for(const s of ['#news-card .TimelineItem','#news-card .TimelineItem-body'])assert.equal(await style(s),transparent);
    assert.deepEqual(errors,[]);
    return {version:JSON.parse(fs.readFileSync(path.join(extension,'manifest.json'),'utf8')).version,...measurements,errors};
  } finally { await context.close(); }
}
(async()=>{
  const report={fixture:'Representative GitHub profile and changelog with sample data; isolated Edge extension session'};
  if(process.argv[2]) report.before=await run(path.resolve(process.argv[2]),'before');
  report.after=await run(path.join(root,'extension'),'after');
  assert.equal(report.after.cellAnimations,0);assert.equal(report.after.paintAnimations,0);
  report.passed=true;fs.writeFileSync(path.join(artifacts,'surface-performance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
