const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const artifacts = process.env.VELNAR_ARTIFACTS ? path.resolve(root, process.env.VELNAR_ARTIFACTS) : path.join(root, "artifacts");
const fixture = fs.readFileSync(path.join(__dirname, "fixtures/dashboard.html"), "utf8");
const rgb = hex => `rgb(${hex.slice(1).match(/../g).map(n => parseInt(n, 16)).join(", ")})`;
async function until(read, expected) {
  for (let i=0;i<60;i++) { if (await read() === expected) return; await new Promise(r => setTimeout(r,100)); }
  assert.equal(await read(),expected);
}
(async () => {
  fs.mkdirSync(artifacts, {recursive:true});
  const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(),"velnar-coverage-")), {
    executablePath:process.env.VELNAR_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    headless:true,viewport:{width:1600,height:1000},
    args:["--disable-extensions-except="+path.join(root,"extension"),"--load-extension="+path.join(root,"extension")]
  });
  const errors=[];context.on("page",page=>page.on("pageerror",error=>errors.push(error.message)));
  try {
    const worker=context.serviceWorkers()[0]||await context.waitForEvent("serviceworker");
    const settings=await context.newPage();await settings.goto(`chrome-extension://${worker.url().split("/")[2]}/options/options.html`);
    await settings.locator(".gs-theme-choice").first().waitFor();
    const page=await context.newPage();await page.route("https://github.com/dashboard/velnar-test*",route=>route.fulfill({contentType:"text/html",body:fixture}));
    await page.goto("https://github.com/dashboard/velnar-test");
    const style=(selector,property="backgroundColor")=>page.locator(selector).evaluate((el,p)=>getComputedStyle(el)[p],property);
    const themes=await settings.evaluate(()=>VELNAR.PRESET_THEMES.filter(t=>t.scene||t.id==="light"||t.id==="dark"));
    for (const theme of themes) {
      await settings.evaluate(id=>VELNAR.Storage.selectTheme(id),theme.id);
      await until(()=>style("body"),rgb(theme.colors.background));
      await until(()=>style("#dashboard"),theme.scene ? "rgba(0, 0, 0, 0)" : rgb(theme.colors.background));
      if (theme.scene) {
        await page.locator("#velnar-world-banner").waitFor({state:"attached"});
        assert.equal(await page.locator("#velnar-world-banner .name").textContent(),theme.name);
        assert.equal(await page.locator("#velnar-world-banner").evaluate(el=>el.inert && el.getAttribute("aria-hidden")==="true"),true);
        assert.ok(await page.locator("#velnar-world-banner .banner").evaluate(el=>el.getAnimations({subtree:true}).length)>0,"banner has moving art and particles");
        assert.notEqual(await style("body","backgroundImage"),"none");
        assert.notEqual(await style("#feed-card","backgroundImage"),"none");
      } else {
        await until(()=>page.locator("#velnar-world-banner").count(),0);
        assert.equal(await page.locator("#velnar-world-skin").count(),0);
      }
      assert.equal(await style("#news"),rgb(theme.colors.background));
      for (const selector of ["#news-card .TimelineItem", "#news-card .TimelineItem-body"]) assert.equal(await style(selector), "rgba(0, 0, 0, 0)", `${theme.id} changelog text inherits the card surface`);
      for (const selector of ["#feed-card","#nested-provider","#news-card","#composer-footer"]) assert.equal(await style(selector),rgb(theme.colors.repoBackground),`${theme.id} ${selector}`);
      for (const selector of ["#nested-card","#token-control","#legacy"]) assert.equal(await style(selector),rgb(theme.colors.backgroundSecondary),`${theme.id} ${selector}`);
      assert.equal(await style(".dashboard-header"),rgb(theme.colors.navbarBackground));
      assert.equal(await style("#hover-button"),rgb(theme.colors.backgroundTertiary));
      await page.locator("#hover-button").hover();assert.equal(await style("#hover-button"),rgb(theme.colors.hoverBackground));
      await page.mouse.move(0,0);
      await page.locator("#open-menu").click();assert.equal(await style("#token-overlay"),rgb(theme.colors.dropdownBackground));
      await page.locator("#close-menu").click();
      assert.equal(await style("#transparent"),"rgba(0, 0, 0, 0)");
      assert.equal(await style("#fixture-image","filter"),"none");
      assert.equal(await style("#danger-status"),"rgb(50, 23, 25)");
      assert.equal(await style("#success-status"),"rgb(18, 38, 30)");
      if(theme.scene) await page.screenshot({path:path.join(artifacts,`dashboard-${theme.id}.png`),fullPage:true});
      console.log(`PASS: ${theme.name} dashboard, nested providers, controls, overlays and semantic colors`);
    }
    await settings.evaluate(()=>VELNAR.Storage.selectTheme("spider-man"));
    await page.locator("#velnar-world-banner").waitFor({state:"attached"});
    await page.evaluate(()=>document.getElementById("velnar-world-banner").remove());
    await page.locator("#velnar-world-banner").waitFor({state:"attached"});
    assert.equal(await page.locator("#velnar-world-banner").count(),1,"React replacement recovers without duplicates");
    await settings.evaluate(()=>VELNAR.Storage.set({animationsEnabled:false}));
    await until(()=>page.locator("#velnar-world-banner").getAttribute("data-signature"),"spider-man:false");
    assert.notEqual(await style("body","backgroundImage"),"none","paused theme keeps its backdrop");
    assert.equal(await page.locator("#velnar-world-banner .banner").evaluate(el=>el.getAnimations({subtree:true}).length),0);
    await settings.evaluate(()=>VELNAR.Storage.set({animationsEnabled:true}));
    await page.emulateMedia({reducedMotion:"reduce"});
    await until(()=>page.locator("#velnar-world-banner").getAttribute("data-signature"),"spider-man:false");
    assert.equal(await page.locator("#velnar-world-banner .banner").evaluate(el=>el.getAnimations({subtree:true}).length),0);
    await page.emulateMedia({reducedMotion:"no-preference"});
    await until(()=>page.locator("#velnar-world-banner").getAttribute("data-signature"),"spider-man:true");
    await page.evaluate(()=>{history.pushState(null,"","/velnar/repository");document.dispatchEvent(new Event("turbo:load"));});
    await until(()=>page.locator("#velnar-world-banner").count(),0);
    await page.evaluate(()=>{history.pushState(null,"","/dashboard/velnar-test");document.dispatchEvent(new Event("turbo:load"));});
    await page.locator("#velnar-world-banner").waitFor({state:"attached"});
    await settings.evaluate(()=>VELNAR.Storage.set({componentOverrides:{profile:false}}));
    await until(()=>page.locator("#velnar-world-banner").count(),0);
    assert.equal(await style("body","backgroundImage"),"none");
    await settings.evaluate(()=>VELNAR.Storage.set({componentOverrides:{profile:true}}));
    await page.locator("#velnar-world-banner").waitFor({state:"attached"});
    await page.evaluate(()=>{
      const late=document.createElement("style");late.textContent='[data-color-mode="dark"][data-dark-theme="dark"] { --bgColor-default:#ffffff; --bgColor-inset:#ffffff; }';document.head.append(late);
      const card=document.createElement("section");card.id="dynamic-card";card.className="modern-card";card.dataset.colorScheme="dark";card.textContent="Dynamically loaded feed item";document.getElementById("dashboard").append(card);
      document.dispatchEvent(new Event("turbo:load"));
    });
    await until(()=>style("#dynamic-card"),"rgb(17, 30, 56)");
    await page.locator("#star").click();assert.equal(await page.locator("#star").getAttribute("aria-pressed"),"true");
    await settings.evaluate(()=>VELNAR.Storage.set({componentOverrides:{buttons:false,inputs:false,dropdowns:false,navbar:false}}));
    await until(()=>style("#hover-button"),"rgb(33, 40, 48)");
    assert.equal(await style("#token-control"),"rgb(1, 4, 9)");
    assert.equal(await style(".dashboard-header"),"rgb(1, 4, 9)");
    await page.locator("#open-menu").click();assert.equal(await style("#token-overlay"),"rgb(21, 27, 35)");await page.locator("#close-menu").click();
    await settings.evaluate(()=>VELNAR.Storage.set({enabled:false}));
    await until(()=>style("#dashboard"),"rgb(1, 4, 9)");
    assert.equal(await page.locator("#velnar-world-banner,#velnar-world-skin").count(),0);
    assert.equal(await style("#nested-provider"),"rgb(13, 17, 23)");
    await settings.evaluate(()=>VELNAR.Storage.set({enabled:true,componentOverrides:VELNAR.DEFAULT_SETTINGS.componentOverrides}));
    await until(()=>style("body"),"rgb(9, 15, 33)");
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(artifacts,"dashboard-mobile.png"),fullPage:true});
    assert.ok(await page.locator("#velnar-world-banner").isVisible());
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(artifacts,"dashboard-results.json"),JSON.stringify({passed:true,browser:context.browser().version(),fixture:"Representative Primer dashboard with sample data; not a signed-in GitHub page",themes:themes.map(t=>t.id),lateStyles:true,dynamicFeed:true,componentToggles:true,disableCleanup:true,mobile:true,sceneBanner:true,reactRecovery:true,pause:true,reducedMotion:true,routeCleanup:true,errors},null,2));
    console.log("PASS: scene banner, React recovery, pause, reduced motion, navigation, toggles, cleanup and mobile");
  } finally {await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
