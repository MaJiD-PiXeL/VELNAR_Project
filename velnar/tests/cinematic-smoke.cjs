const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "..");
const artifacts = path.join(root, "artifacts");
const worlds = ["spider-man", "the-last-of-us", "red-dead", "rick-and-morty", "iron-man", "batman", "star-wars", "harry-potter", "deadpool", "stranger-things", "wednesday", "squid-game", "god-of-war", "assassins-creed", "minecraft"];

async function until(read, expected, label) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (JSON.stringify(await read()) === JSON.stringify(expected)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.deepEqual(await read(), expected, label);
}

(async () => {
  fs.mkdirSync(artifacts, { recursive: true });
  const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
  const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), "velnar-cinema-")), {
    executablePath: process.env.VELNAR_BROWSER || (fs.existsSync(edge) ? edge : undefined),
    headless: true, viewport: { width: 1440, height: 1040 },
    args: ["--disable-extensions-except=" + path.join(root, "extension"), "--load-extension=" + path.join(root, "extension")]
  });
  const errors = [], checked = [];
  context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker");
    const base = `chrome-extension://${worker.url().split("/")[2]}`;
    const options = await context.newPage(); await options.goto(`${base}/options/options.html`);
    await options.locator(".vn-cinematic-card").first().waitFor();
    assert.equal(await options.locator(".vn-cinematic-card").count(), 15);
    const github = await context.newPage();
    await github.route("https://github.com/velnar-cinema*", route => route.fulfill({ contentType: "text/html", body: `<!doctype html><html><head><title>VELNAR cinematic fixture</title></head><body>
      <header class="AppHeader"><div class="AppHeader-globalBar">GitHub fixture</div></header>
      <main style="max-width:1000px;margin:40px auto"><button class="btn btn-primary" id="action">Primary action</button><div class="Box">Repository</div>
      <div class="js-calendar-graph"><table class="js-calendar-graph-table"><tr><td class="ContributionCalendar-day" data-level="4">Day</td></tr></table></div></main>
      <script>document.getElementById('action').addEventListener('click',e=>e.currentTarget.textContent='Clicked');</script></body></html>` }));
    await github.goto("https://github.com/velnar-cinema");
    await github.locator("#velnar-theme-vars").waitFor({ state: "attached" });
    const preview = await context.newPage(); await preview.goto(`${base}/preview/preview.html`);
    for (const [index, id] of worlds.entries()) {
      const name = await options.evaluate(id => VELNAR.getThemeById(id).name, id);
      await options.getByRole("button", { name: `Apply ${name} theme`, exact: true }).click();
      await github.bringToFront();
      await until(() => github.locator("#velnar-cinematic-scene").getAttribute("data-scene"), id, `${id} applied`);
      assert.equal(await github.locator("#velnar-cinematic-scene .rail i").count(), 24);
      assert.equal(await github.locator("#velnar-cinematic-scene").getAttribute("aria-hidden"), "true");
      assert.equal(await github.locator("#velnar-cinematic-scene").evaluate(el => el.inert && getComputedStyle(el).pointerEvents === "none"), true);
      assert.equal(await github.locator(".AppHeader-globalBar").evaluate(el => getComputedStyle(el).animationName), "none", "header does not repaint continuously");
      const particle = github.locator("#velnar-cinematic-scene .rail-left i").nth(3);
      const before = await particle.evaluate(el => getComputedStyle(el).transform);
      await github.waitForTimeout(180);
      assert.notEqual(await particle.evaluate(el => getComputedStyle(el).transform), before, `${id} actually moves`);
      await github.locator("#action").click(); assert.equal(await github.locator("#action").textContent(), "Clicked");
      await github.evaluate(() => document.dispatchEvent(new Event("turbo:load")));
      await github.waitForTimeout(250);
      assert.equal(await github.locator("#velnar-cinematic-scene").count(), 1);
      // Deleting a style and navigating must also restore the scene, without duplicates.
      await github.evaluate(() => { document.getElementById("velnar-cinematic-components").remove(); document.dispatchEvent(new Event("turbo:load")); });
      await github.locator("#velnar-cinematic-components").waitFor({ state: "attached" });
      await preview.bringToFront();
      await preview.locator(`[data-theme="${id}"]`).click();
      assert.equal(await preview.locator("#sceneTitle").textContent(), name);
      assert.ok(await preview.locator(".scene-illustration").evaluate(el => el.getAnimations({ subtree: true }).length) > 0, `${id} artwork animates`);
      await until(()=>preview.locator('.velnar-graph-scene').getAttribute('data-scene'),id,`${id} graph preview`);
      await preview.getByRole('button',{name:'Replay scene ↻',exact:true}).click();
      assert.ok(await preview.locator('.velnar-graph-scene').evaluate(host=>host.shadowRoot.getAnimations().every(a=>a.currentTime<1000)), 'replay starts the graph story again');
      await preview.waitForTimeout(350);
      await preview.screenshot({ path: path.join(artifacts, `velnar-${id}.png`), fullPage: true });
      checked.push({ id, particleMotion: true, clickThrough: true, navigationRecovery: true });
      console.log(`PASS: ${name} selection, real motion, click-through and navigation`);
    }
    await preview.getByRole("button", { name: "Pause effects", exact: true }).click();
    assert.equal(await preview.locator("#velnar-cinematic-scene").count(), 0);
    assert.equal(await preview.locator(".scene-illustration").evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    await preview.getByRole("button", { name: "Use this theme on GitHub", exact: true }).click();
    await until(() => options.evaluate(async () => (await VELNAR.Storage.get()).animationsEnabled), false, "paused preview saves paused theme");
    await preview.getByRole("button", { name: "Play effects", exact: true }).click();
    await preview.getByRole("button", { name: "Use this theme on GitHub", exact: true }).click();
    await until(() => options.evaluate(async () => (await VELNAR.Storage.get()).animationsEnabled), true, "preview applies motion");
    await preview.getByRole("button", { name: "Star this demo ☆", exact: true }).click();
    assert.equal(await preview.locator("#demoAction").getAttribute("aria-pressed"), "true");
    await preview.setViewportSize({ width: 390, height: 844 });
    assert.equal(await preview.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "mobile preview overflow");
    await preview.screenshot({ path: path.join(artifacts, "velnar-cinema-mobile.png"), fullPage: true });
    console.log("PASS: preview pause/play, apply, interaction and mobile layout");

    await github.bringToFront();
    await github.locator("#velnar-cinematic-scene").waitFor({ state: "attached" });
    await github.emulateMedia({ reducedMotion: "reduce" });
    await until(() => github.locator("#velnar-cinematic-scene").count(), 0, "reduced motion removes particles");
    assert.equal(await github.locator(".btn-primary").evaluate(el => getComputedStyle(el).animationName), "none");
    assert.equal(await github.locator("#velnar-cinematic-components").count(), 0);
    await github.emulateMedia({ reducedMotion: "no-preference" });
    await github.locator("#velnar-cinematic-scene").waitFor({ state: "attached" });
    // Exercise the shared visibility listener in the preview's own JS world.
    await preview.bringToFront();
    await preview.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
    assert.equal(await preview.locator("#velnar-cinematic-scene").count(), 0);
    await preview.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
    await preview.locator("#velnar-cinematic-scene").waitFor({ state: "attached" });
    await github.bringToFront();
    await options.evaluate(() => VELNAR.Storage.set({ componentOverrides: Object.fromEntries(VELNAR.COMPONENTS.map(c => [c.id, false])) }));
    await until(() => github.locator("#velnar-cinematic-scene").count(), 0, "component disable removes atmosphere");
    assert.equal(await github.locator(".AppHeader-globalBar").evaluate(el => getComputedStyle(el).animationName), "none");
    assert.equal(await github.locator(".btn-primary").evaluate(el => getComputedStyle(el).animationName), "none");
    await options.evaluate(() => VELNAR.Storage.set({ componentOverrides: VELNAR.DEFAULT_SETTINGS.componentOverrides }));
    await github.locator("#velnar-cinematic-scene").waitFor({ state: "attached" });
    await options.evaluate(() => VELNAR.Storage.set({ enabled: false }));
    await until(() => github.locator("#velnar-cinematic-scene").count(), 0, "disable extension cleans effects");
    await options.evaluate(() => VELNAR.Storage.set({ enabled: true }));
    await github.locator("#velnar-cinematic-scene").waitFor({ state: "attached" });
    await options.evaluate(() => VELNAR.Storage.selectTheme("dark"));
    await until(() => github.locator("#velnar-cinematic-scene").count(), 0, "regular palette cleans effects");
    await options.evaluate(async () => { await VELNAR.Storage.selectTheme("iron-man"); await VELNAR.Storage.set({ customTheme: { name: "Plain", colors: VELNAR.getThemeById("dark").colors }, customThemeApplied: true }); });
    await until(() => github.locator("#velnar-cinematic-scene").count(), 0, "custom palette cleans effects");
    console.log("PASS: reduced motion, background pause, component gates and theme cleanup");

    const local = await context.newPage();
    await local.goto(pathToFileURL(path.join(root, "extension/preview/preview.html")).href);
    await local.getByRole("button", { name: "Use this theme on GitHub", exact: true }).click();
    assert.match(await local.locator("#applyStatus").textContent(), /Install VELNAR/);
    await local.emulateMedia({ reducedMotion: "reduce" });
    await until(() => local.locator("#velnar-cinematic-scene").count(), 0, "local reduced motion");
    assert.equal(await local.locator(".scene-illustration").evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    assert.deepEqual(errors, [], "browser errors");
    fs.writeFileSync(path.join(artifacts, "cinematic-results.json"), JSON.stringify({ passed: true, browser: context.browser().version(), fixture: "local HTML routed at github.com/velnar-cinema", worlds: checked, reducedMotion: true, cleanup: true, mobile: true, errors }, null, 2));
    console.log("PASS: standalone demo, reduced motion and no page errors");
  } catch (error) {
    for (const [i, page] of context.pages().entries()) await page.screenshot({ path: path.join(artifacts, `cinema-failure-${i}.png`) }).catch(() => {});
    throw error;
  } finally { await context.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
