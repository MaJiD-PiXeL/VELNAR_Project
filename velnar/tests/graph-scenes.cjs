const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),artifacts=path.join(root,'artifacts');
const fixture=fs.readFileSync(path.join(__dirname,'fixtures/profile.html'),'utf8');
const worlds=["spider-man", "the-last-of-us", "red-dead", "rick-and-morty", "iron-man", "batman", "star-wars", "harry-potter", "deadpool", "stranger-things", "wednesday", "squid-game", "god-of-war", "assassins-creed", "minecraft"];
const actors=['webman','survivor','outlaw','duo','ironman',...Array(10).fill('hero')];
async function until(read,expected){for(let i=0;i<80;i++){if(await read()===expected)return;await new Promise(r=>setTimeout(r,50))}assert.equal(await read(),expected)}
(async()=>{
  const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(),'velnar-graph-')),{
    executablePath:process.env.VELNAR_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,viewport:{width:1440,height:1024},
    args:['--disable-extensions-except='+path.join(root,'extension'),'--load-extension='+path.join(root,'extension')]
  });
  const errors=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  try{
    const worker=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
    const options=await context.newPage();await options.goto(`chrome-extension://${worker.url().split('/')[2]}/options/options.html`);
    await options.locator('.gs-theme-choice').first().waitFor();
    const page=await context.newPage();await page.route('https://github.com/velnar-graph*',r=>r.fulfill({contentType:'text/html',body:fixture}));await page.goto('https://github.com/velnar-graph');
    const report=[];
    for(const [index,id]of worlds.entries()){
      await options.evaluate(id=>VELNAR.Storage.selectTheme(id),id);await page.bringToFront();
      await until(()=>page.locator('.velnar-graph-scene').getAttribute('data-scene'),id);
      await page.locator('.js-calendar-graph').scrollIntoViewIfNeeded();
      await until(()=>page.locator('.velnar-graph-scene').getAttribute('data-visible'),'true');
      assert.equal(await page.locator('.velnar-graph-scene').count(),1);
      assert.equal(await page.locator('.velnar-graph-scene').evaluate(e=>e.inert&&getComputedStyle(e).pointerEvents==='none'),true);
      const actor=page.locator(`.velnar-graph-scene .${actors[index]}`);
      await actor.evaluate((e,t)=>e.getAnimations().forEach(a=>a.currentTime=t),([5400,2500,1300,6200,7200][index] ?? 9700));
      const before=await actor.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(180);assert.notEqual(await actor.evaluate(e=>getComputedStyle(e).transform),before,'actor actually moves');
      const stats=await page.locator('.velnar-graph-scene').evaluate(e=>{
        const a=e.shadowRoot.getAnimations();return {objects:a.length,properties:[...new Set(a.flatMap(x=>x.effect.getKeyframes().flatMap(k=>Object.keys(k).filter(p=>!['offset','computedOffset','easing','composite'].includes(p)))))],cells:[...e.parentElement.querySelectorAll('td.ContributionCalendar-day')].reduce((n,c)=>n+c.getAnimations().length,0)};
      });
      assert.ok(stats.objects>=4&&stats.objects<=8,`${id}: bounded overlay object count`);assert.equal(stats.cells,0);
      assert.deepEqual(stats.properties.sort(),['opacity','transform']);
      assert.equal(await page.locator('.js-calendar-graph').evaluate(e=>getComputedStyle(e,'::after').animationName),'none','generic sweep yields to story');
      const aligned=await page.locator('.velnar-graph-scene').evaluate(host=>{
        const rect=host.getBoundingClientRect(),cells=[...host.parentElement.querySelectorAll('td.ContributionCalendar-day')].map(e=>e.getBoundingClientRect());
        return [...host.shadowRoot.querySelectorAll('.target')].every(t=>cells.some(c=>Math.abs(rect.left+parseFloat(t.style.left)-(c.left+c.width/2))<1&&Math.abs(rect.top+parseFloat(t.style.top)-(c.top+c.height/2))<1));
      });assert.equal(aligned,true,'targets snap to real cells');
      // Freeze a readable action moment only for the screenshot, then resume.
      await page.locator('.velnar-graph-scene').evaluate((host,time)=>host.shadowRoot.getAnimations().forEach(a=>{a.pause();a.currentTime=time}),([4400,8200,5200,7800,4650][index] ?? 6000));
      await page.locator('.js-yearly-contributions').screenshot({path:path.join(artifacts,`graph-${id}.png`)});
      await page.locator('.velnar-graph-scene').evaluate(host=>host.shadowRoot.getAnimations().forEach(a=>a.play()));
      const hit=await page.locator('.velnar-graph-scene').evaluate(e=>{const r=e.getBoundingClientRect();return !document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest('.velnar-graph-scene')});assert.equal(hit,true,'overlay does not intercept cell hover/click');
      report.push({id,...stats,aligned,clickThrough:hit});console.log(`PASS: ${id} story, cell alignment, real motion and ${stats.objects} overlay animations`);
    }
    await page.setViewportSize({width:1000,height:900});await page.waitForTimeout(150);
    assert.equal(await page.locator('.velnar-graph-scene').evaluate(e=>Math.abs(e.getBoundingClientRect().width-e.parentElement.querySelector('tbody').getBoundingClientRect().width)<10),true,'resize follows cells');
    await page.setViewportSize({width:390,height:844});await page.locator('.js-calendar-graph').scrollIntoViewIfNeeded();await page.waitForTimeout(150);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no mobile document overflow');
    await page.locator('.js-calendar-graph').evaluate(e=>e.scrollLeft=100);await page.waitForTimeout(100);
    assert.equal(await page.locator('.velnar-graph-scene').count(),1);
    await page.locator('.js-calendar-graph').screenshot({path:path.join(artifacts,'graph-mobile.png')});
    // Keep offscreen stories suspended while the rest of the page is used.
    await page.evaluate(()=>scrollTo(0,0));await until(()=>page.locator('.velnar-graph-scene').getAttribute('data-visible'),'false');
    assert.equal(await page.locator('.velnar-graph-scene').evaluate(e=>e.shadowRoot.getAnimations().filter(a=>a.playState==='running').length),0);
    await page.locator('.js-calendar-graph').scrollIntoViewIfNeeded();
    await options.evaluate(()=>VELNAR.Storage.set({animationsEnabled:false}));await until(()=>page.locator('.velnar-graph-scene').count(),0);
    assert.equal(await page.locator('[data-velnar-graph]').count(),0);
    await options.evaluate(()=>VELNAR.Storage.set({animationsEnabled:true,componentOverrides:{profile:false}}));await page.locator('.velnar-graph-scene').waitFor({state:'attached'});
    assert.equal(await page.locator('#velnar-cinematic-scene').count(),0,'graph story is independent of atmosphere');
    await options.evaluate(()=>VELNAR.Storage.set({componentOverrides:{contributionGraph:false}}));await until(()=>page.locator('.velnar-graph-scene').count(),0);
    await options.evaluate(()=>VELNAR.Storage.set({componentOverrides:{contributionGraph:true}}));await page.locator('.velnar-graph-scene').waitFor({state:'attached'});
    await page.emulateMedia({reducedMotion:'reduce'});await until(()=>page.locator('.velnar-graph-scene').count(),0);
    await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('.velnar-graph-scene').waitFor({state:'attached'});
    // GitHub can fetch or replace the graph after Turbo's render event.
    await page.evaluate(()=>{const old=document.querySelector('.js-calendar-graph'),next=old.cloneNode(true);next.querySelector('.velnar-graph-scene').remove();next.removeAttribute('data-velnar-graph');old.replaceWith(next)});
    await page.locator('.velnar-graph-scene').waitFor({state:'attached'});assert.equal(await page.locator('.velnar-graph-scene').count(),1);
    await page.evaluate(()=>document.querySelector('.js-calendar-graph').remove());await until(()=>page.locator('.velnar-graph-scene').count(),0);
    await options.evaluate(()=>VELNAR.Storage.selectTheme('dark'));await until(()=>page.locator('#velnar-graph-style').count(),0);
    await options.evaluate(()=>VELNAR.Storage.selectTheme('spider-man'));await page.goto('https://github.com/velnar-graph');await page.locator('.velnar-graph-scene').waitFor({state:'attached'});
    await options.evaluate(()=>VELNAR.Storage.set({enabled:false}));await until(()=>page.locator('.velnar-graph-scene').count(),0);assert.equal(await page.locator('#velnar-graph-style').count(),0);
    assert.deepEqual(errors,[]);fs.writeFileSync(path.join(artifacts,'graph-scenes-results.json'),JSON.stringify({passed:true,version:'2.4.0',fixture:'Isolated Edge extension session with sample contribution data',worlds:report,resize:true,mobile:true,offscreenPause:true,lateReplacement:true,componentGates:true,reducedMotion:true,cleanup:true,errors},null,2));
    console.log('PASS: resize, mobile scroll, offscreen pause, settings, late replacement and cleanup');
  }finally{await context.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
