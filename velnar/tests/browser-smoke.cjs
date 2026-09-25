const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "..");
const artifacts = path.join(root, "artifacts");

async function until(read, expected, label) {
  for (let i = 0; i < 60; i++) {
    const actual = await read();
    if (JSON.stringify(actual) === JSON.stringify(expected)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.deepEqual(await read(), expected, label);
}

(async () => {
  fs.mkdirSync(artifacts, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "velnar-smoke-"));
  const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
  const executablePath = process.env.VELNAR_BROWSER || (fs.existsSync(edge) ? edge : undefined);
  const context = await chromium.launchPersistentContext(profile, {
    executablePath, headless: true, viewport: { width: 1440, height: 1024 },
    args: ["--disable-extensions-except=" + path.join(root, "extension"), "--load-extension=" + path.join(root, "extension")]
  });
  const errors = [];
  context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker");
    const extensionOrigin = new URL(worker.url()).origin;
    const extensionId = worker.url().split("/")[2];
    const base = `chrome-extension://${extensionId}`;
    assert.equal(await worker.evaluate(() => typeof window), "undefined");
    const options = await context.newPage();
    await options.goto(`${base}/options/options.html`);
    await options.locator(".gs-color-field").first().waitFor({ state: "attached" });
    assert.equal(await options.locator(".gs-color-field").count(), 30);
    assert.equal(await options.locator(".gs-theme-choice").count(), 45);
    console.log("PASS: real extension service worker, options and 30 builder controls");

    const github = await context.newPage();
    // Deterministic GitHub-shaped fixture: no signed-in account or remote data.
    await github.route("https://github.com/velnar-test*", route => route.fulfill({ contentType: "text/html", body: `<!doctype html><html><head><title>VELNAR test fixture</title></head><body>
      <header class="AppHeader"><div class="AppHeader-globalBar">GitHub fixture</div></header>
      <main><div class="vcard-names">Example profile</div><button class="btn btn-primary">Primary action</button>
      <div class="Box">Repository card</div><div class="js-calendar-graph"><table class="js-calendar-graph-table"><tr><td class="ContributionCalendar-day" data-level="4">Day</td></tr></table></div>
      <p id="custom-target">Custom CSS target</p></main></body></html>` }));
    await github.goto("https://github.com/velnar-test");
    await github.locator("#velnar-theme-vars").waitFor({ state: "attached" });
    await options.getByRole("button", { name: "Apply Dracula theme", exact: true }).click();
    await until(() => github.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(40, 42, 54)", "theme reaches content script");
    await options.getByRole("searchbox", { name: "Search themes" }).fill("arctic");
    assert.equal(await options.locator(".gs-theme-choice").count(), 1);
    await options.getByRole("searchbox", { name: "Search themes" }).fill("");
    console.log("PASS: theme search and live theme application");

    await options.getByRole("button", { name: "Theme Builder", exact: true }).click();
    await options.getByLabel("Theme name", { exact: true }).fill("Blue hour");
    await options.getByRole("textbox", { name: "Background color value", exact: true }).fill("#101629");
    await options.getByRole("textbox", { name: "Background color value", exact: true }).press("Tab");
    await options.getByRole("button", { name: "Apply Custom Theme", exact: true }).click();
    await until(() => github.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(16, 22, 41)", "custom palette reaches content script");
    console.log("PASS: theme builder preview and application");

    await options.getByRole("button", { name: "Custom CSS", exact: true }).click();
    await options.getByRole("textbox", { name: "Custom CSS", exact: true }).fill("#custom-target { color: rgb(1, 2, 3) !important; }");
    await options.getByRole("button", { name: "Validate & Apply", exact: true }).click();
    await until(() => github.locator("#custom-target").evaluate(el => getComputedStyle(el).color), "rgb(1, 2, 3)", "custom CSS applies");
    await options.getByRole("textbox", { name: "Custom CSS", exact: true }).fill('body { background: url(https://example.com/pixel); }');
    await options.getByRole("button", { name: "Validate & Apply", exact: true }).click();
    assert.equal(await options.locator("#cssErrorBox").isVisible(), true);
    console.log("PASS: Custom CSS applies and rejects external resources");

    const other = await context.newPage(); await other.goto(`${base}/options/options.html`);
    await other.locator(".gs-color-field").first().waitFor({ state: "attached" });
    await Promise.all([
      options.evaluate(() => VELNAR.Storage.set({ layout: { shadowIntensity: 0 } })),
      other.evaluate(() => VELNAR.Storage.set({ typography: { fontSize: 18 } }))
    ]);
    const settings = await options.evaluate(() => VELNAR.Storage.get());
    assert.equal(settings.layout.shadowIntensity, 0); assert.equal(settings.typography.fontSize, 18);
    await until(() => github.locator(".btn-primary").evaluate(el => /rgba\(0, 0, 0, 0\)|color\(srgb [^)]*\/ 0\)/.test(getComputedStyle(el).boxShadow)), true, "zero shadow is transparent");
    await other.close();
    console.log("PASS: cross-window storage and shadow intensity");

    await options.getByRole("button", { name: "Import / Export", exact: true }).click();
    await options.getByLabel("Import theme JSON").setInputFiles({ name: "theme.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ name: "Imported blue", background: "#123456", accent: "#6699ff" })) });
    await until(() => github.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(18, 52, 86)", "legacy theme import");
    await options.getByLabel("Restore settings JSON").setInputFiles({ name: "invalid.json", mimeType: "application/json", buffer: Buffer.from('{"favoriteThemeIds":123}') });
    await until(() => options.locator("#statusMessage").getAttribute("class"), "gs-status is-error", "invalid import feedback");
    assert.equal((await options.evaluate(() => VELNAR.Storage.get())).customTheme.name, "Imported blue");
    await options.evaluate(() => VELNAR.Storage.restore(VELNAR.DEFAULT_SETTINGS));
    await until(() => github.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(13, 17, 23)", "restore defaults");
    console.log("PASS: legacy theme import and invalid-backup rejection");

    await options.evaluate(() => VELNAR.Storage.set({ animationsEnabled: true, componentOverrides: { navbar: false, buttons: false } }));
    await until(() => github.locator(".AppHeader-globalBar").evaluate(el => getComputedStyle(el).animationName), "none", "disabled navbar does not animate");
    await options.evaluate(() => VELNAR.Storage.set({ componentOverrides: { navbar: true, buttons: true } }));
    await until(() => github.locator(".AppHeader-globalBar").evaluate(el => getComputedStyle(el).backgroundImage !== "none"), true, "enabled navbar keeps its static gradient");
    assert.equal(await github.locator(".AppHeader-globalBar").evaluate(el => getComputedStyle(el).animationName), "none", "no perpetual header repaint");
    await github.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await github.locator(".AppHeader-globalBar").evaluate(el => getComputedStyle(el).animationName), "none");
    assert.equal(await github.locator(".btn-primary").evaluate(el => getComputedStyle(el).animationName), "none");
    assert.equal(await github.locator(".ContributionCalendar-day").evaluate(el => getComputedStyle(el).animationName), "none");
    await github.evaluate(() => { document.getElementById("velnar-theme-vars").remove(); document.dispatchEvent(new Event("turbo:load")); });
    await github.locator("#velnar-theme-vars").waitFor({ state: "attached" });
    console.log("PASS: component toggles, reduced motion and SPA style recovery");

    await options.evaluate(() => VELNAR.Storage.reset());
    await options.getByRole("button", { name: "Themes", exact: true }).click();
    await options.evaluate(() => VELNAR.UI.status(""));
    await options.screenshot({ path: path.join(artifacts, "velnar-settings.png"), fullPage: true });
    await options.getByRole("button", { name: "Theme Builder", exact: true }).click();
    await options.getByRole("button", { name: "Start from active theme", exact: true }).click();
    await options.screenshot({ path: path.join(artifacts, "velnar-builder.png"), fullPage: true });
    await options.setViewportSize({ width: 390, height: 844 });
    assert.equal(await options.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "mobile options overflow");

    const popup = await context.newPage(); await popup.setViewportSize({ width: 380, height: 620 }); await popup.goto(`${base}/popup/popup.html`);
    await popup.locator(".gs-theme-select").first().waitFor();
    assert.equal(await popup.locator(".gs-theme-select").count(), 45);
    await popup.getByRole("switch", { name: "Enable extension", exact: true }).focus();
    await popup.getByRole("switch", { name: "Enable extension", exact: true }).press("Space");
    await until(() => popup.getByRole("switch", { name: "Enable extension", exact: true }).getAttribute("aria-checked"), "false", "keyboard toggle");
    await popup.getByRole("switch", { name: "Enable extension", exact: true }).press("Space");
    await until(() => popup.getByRole("switch", { name: "Enable extension", exact: true }).getAttribute("aria-checked"), "true", "keyboard toggle restore");
    await popup.screenshot({ path: path.join(artifacts, "velnar-popup.png"), fullPage: true });
    console.log("PASS: keyboard controls, popup and responsive options");

    const landing = await context.newPage(); await landing.goto(pathToFileURL(path.join(root, "landing/index.html")).href);
    assert.equal(await landing.locator(".theme-chip").count(), 45);
    assert.equal(await landing.locator("#install").getAttribute("href"), "../dist/velnar-extension.zip");
    await landing.screenshot({ path: path.join(artifacts, "velnar-landing.png"), fullPage: true });
    assert.deepEqual(errors, [], "browser errors");
    fs.writeFileSync(path.join(artifacts, "browser-results.json"), JSON.stringify({ passed: true, browser: await context.browser().version(), fixture: "local HTML routed at github.com/velnar-test", errors }, null, 2));
    console.log("PASS: landing page, matching palette inventory and no page errors");
  } catch (error) {
    for (const [i, page] of context.pages().entries()) await page.screenshot({ path: path.join(artifacts, `failure-${i}.png`) }).catch(() => {});
    throw error;
  } finally { await context.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
