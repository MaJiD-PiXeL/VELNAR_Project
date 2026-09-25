// Usage: node scripts/capture_dashboard_comparison.cjs <previous-unpacked-release>
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const root = path.resolve(__dirname, "..");
const baseline = process.argv[2];
if (!baseline) throw new Error("Pass the previous unpacked release directory.");

(async () => {
  const fixture = fs.readFileSync(path.join(root, "tests/fixtures/dashboard.html"), "utf8");
  const versions = {};
  for (const [label, extension] of [["before", path.resolve(baseline)], ["after", path.join(root, "extension")]]) {
    const context = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), "velnar-compare-")), {
      executablePath: process.env.VELNAR_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
      headless: true, viewport: { width: 1440, height: 1000 },
      args: ["--disable-extensions-except=" + extension, "--load-extension=" + extension]
    });
    try {
      const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker");
      const settings = await context.newPage();
      await settings.goto(`chrome-extension://${worker.url().split("/")[2]}/options/options.html`);
      await settings.locator(".gs-theme-choice").first().waitFor();
      await settings.evaluate(() => VELNAR.Storage.selectTheme("spider-man"));
      versions[label] = await settings.evaluate(() => chrome.runtime.getManifest().version);
      const page = await context.newPage();
      await page.route("https://github.com/dashboard/velnar-test", route => route.fulfill({ contentType: "text/html", body: fixture }));
      await page.goto("https://github.com/dashboard/velnar-test");
      await page.locator("#velnar-theme-vars").waitFor({ state: "attached" });
      if (label === "after") await page.locator("#velnar-world-banner").waitFor({ state: "attached" });
      await page.mouse.move(0, 0);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(root, "artifacts", `dashboard-${label}.png`) });
      console.log(`${label}: VELNAR ${versions[label]}, same dashboard fixture at 1440 × 1000`);
    } finally { await context.close(); }
  }
  fs.writeFileSync(path.join(root, "artifacts/dashboard-comparison.json"), JSON.stringify({ ...versions, theme: "spider-man", viewport: { width: 1440, height: 1000 }, fixture: "Same local fixture in separate real extension browser sessions" }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
