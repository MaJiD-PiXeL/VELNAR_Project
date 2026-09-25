const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "../extension");
const source = file => fs.readFileSync(path.join(root, file), "utf8");

function harness(initial = {}) {
  let data = structuredClone(initial), failWrite = false;
  const changes = [], messages = [], commands = [], installs = [];
  const runtime = {
    id: "velnar-test", lastError: null, getURL: suffix => "chrome-extension://velnar-test/" + suffix,
    onMessage: { addListener: fn => messages.push(fn) }, onInstalled: { addListener: fn => installs.push(fn) }
  };
  const chrome = { runtime, commands: { onCommand: { addListener: fn => commands.push(fn) } }, storage: {
    local: {
      get(keys, callback) { setTimeout(() => callback(structuredClone(data)), 1); },
      set(next, callback) {
        setTimeout(() => {
          if (failWrite) { failWrite = false; runtime.lastError = { message: "Storage unavailable" }; callback(); runtime.lastError = null; return; }
          const update = Object.fromEntries(Object.entries(next).map(([key, value]) => [key, { oldValue: data[key], newValue: structuredClone(value) }]));
          data = { ...data, ...structuredClone(next) }; callback(); changes.forEach(fn => fn(update, "local"));
        }, 1);
      }
    },
    onChanged: { addListener: fn => changes.push(fn), removeListener: fn => { const i = changes.indexOf(fn); if (i >= 0) changes.splice(i, 1); } }
  } };
  runtime.sendMessage = (message, callback) => messages[0](message, { id: runtime.id, url: runtime.getURL("options/options.html") }, callback);
  function context(worker) {
    const scope = vm.createContext({ chrome, structuredClone, console, setTimeout });
    if (worker) {
      scope.importScripts = (...files) => files.forEach(file => vm.runInContext(source(path.join("background", file)), scope, { filename: file }));
      vm.runInContext(source("background/service-worker.js"), scope);
    } else {
      scope.window = scope;
      for (const file of ["utils/constants.js", "themes/presets.js", "utils/validator.js", "utils/storage.js"]) vm.runInContext(source(file), scope);
    }
    return scope;
  }
  const worker = context(true);
  return { worker, page: () => context(false), data: () => data, fail: () => failWrite = true, messages, commands, installs };
}

test("manifest files exist and service worker starts without window", () => {
  const manifest = JSON.parse(source("manifest.json"));
  assert.equal(manifest.version, "2.4.0"); assert.ok(manifest.description.length <= 132);
  for (const file of [...manifest.content_scripts[0].js, ...Object.values(manifest.icons), manifest.background.service_worker, manifest.options_page, manifest.action.default_popup]) assert.ok(fs.existsSync(path.join(root, file)), file);
  const h = harness(); assert.equal(h.messages.length, 1); assert.equal(h.commands.length, 1); assert.equal(h.installs.length, 1);
});

test("writes from separate pages preserve all changes", async () => {
  const h = harness(), a = h.page().VELNAR.Storage, b = h.page().VELNAR.Storage;
  await Promise.all([a.set({ activeThemeId: "light" }), b.set({ animationsEnabled: true }), a.set({ layout: { borderRadius: 15 } }), b.set({ typography: { fontSize: 17 } })]);
  const actual = await a.get();
  assert.equal(actual.activeThemeId, "light"); assert.equal(actual.animationsEnabled, true); assert.equal(actual.layout.borderRadius, 15); assert.equal(actual.typography.fontSize, 17);
});

test("rapid toggles and favorites use the latest stored state", async () => {
  const h = harness(), a = h.page().VELNAR.Storage, b = h.page().VELNAR.Storage;
  await Promise.all([a.toggle("enabled"), b.toggle("enabled"), a.toggleFavorite("dark"), b.toggleFavorite("light")]);
  const result = await a.get(); assert.equal(result.enabled, true); assert.deepEqual([...result.favoriteThemeIds].sort(), ["dark", "light"]);
});

test("legacy settings migrate without resetting preferences", async () => {
  const h = harness({ mavaj_settings_v1: { activeThemeId: "dracula", enabled: false, favoriteThemeIds: ["dark"] } });
  await h.worker.VELNAR.Storage.set({});
  assert.equal(h.data().velnar_settings_v1.activeThemeId, "dracula"); assert.equal(h.data().velnar_settings_v1.enabled, false);
});

test("restore replaces previous custom theme and CSS, including null values", async () => {
  const h = harness(), p = h.page().VELNAR;
  await p.Storage.set({ customTheme: { name: "Old", colors: p.PRESET_THEMES[0].colors }, customThemeApplied: true, customCss: "body { opacity: .9; }", customCssEnabled: true });
  await p.Storage.restore(structuredClone(p.DEFAULT_SETTINGS));
  const restored = await p.Storage.get(); assert.equal(restored.customTheme, null); assert.equal(restored.customCss, ""); assert.equal(restored.customCssEnabled, false);
});

test("malformed import is rejected before storage changes", async () => {
  const h = harness(), p = h.page().VELNAR;
  await p.Storage.set({ activeThemeId: "nord" });
  for (const invalid of [{ favoriteThemeIds: 123 }, { typography: { fontFamily: "serif; } body { display:none" } }, { customTheme: { colors: { accent: 8 } } }, [], { layout: { borderRadius: -10 } }]) await assert.rejects(p.Storage.restore(invalid));
  assert.equal((await p.Storage.get()).activeThemeId, "nord");
});

test("failed storage write rejects and does not poison the queue", async () => {
  const h = harness(), p = h.page().VELNAR.Storage;
  h.fail(); await assert.rejects(p.set({ enabled: false }), /Storage unavailable/);
  await p.set({ activeThemeId: "nord" }); assert.equal((await p.get()).activeThemeId, "nord");
});

test("settings endpoint rejects a GitHub content-script sender", () => {
  const h = harness(); let response;
  h.messages[0]({ type: "velnar:settings", action: "reset" }, { id: "velnar-test", url: "https://github.com/" }, value => response = value);
  assert.equal(response.ok, false); assert.equal(Object.keys(h.data()).length, 0);
});

test("random theme disables system selection and custom theme", async () => {
  const p = harness().page().VELNAR;
  await p.Storage.set({ activeThemeId: "dark", autoDarkMode: true });
  const next = await p.Storage.randomTheme(); assert.notEqual(next.activeThemeId, "dark"); assert.equal(next.autoDarkMode, false); assert.equal(next.customThemeApplied, false);
});

test("cinematic selection enables effects atomically and rejects unknown themes", async () => {
  const p = harness().page().VELNAR;
  const scenes = p.PRESET_THEMES.filter(theme => theme.category === "cinematic");
  assert.deepEqual(Array.from(scenes, theme => theme.id), ["spider-man", "the-last-of-us", "red-dead", "rick-and-morty", "iron-man", "batman", "star-wars", "harry-potter", "deadpool", "stranger-things", "wednesday", "squid-game", "god-of-war", "assassins-creed", "minecraft"]);
  for (const theme of scenes) {
    await p.Storage.set({ animationsEnabled: false, autoDarkMode: true });
    const next = await p.Storage.selectTheme(theme.id);
    assert.equal(next.activeThemeId, theme.id);
    assert.equal(next.animationsEnabled, true);
    assert.equal(next.autoDarkMode, false);
    assert.equal(next.customThemeApplied, false);
  }
  await assert.rejects(p.Storage.selectTheme("unknown"), /Unknown theme/);
  assert.equal((await p.Storage.get()).activeThemeId, "minecraft");
  await p.Storage.set({ animationsEnabled: false });
  assert.equal((await p.Storage.selectTheme("dark")).animationsEnabled, false);
});

test("CSS validation rejects external resources and escaped URLs", () => {
  const validator = harness().page().VELNAR.Validator;
  for (const css of ['@import "https://example.com/style.css";', 'body { background: url(https://example.com/pixel); }', 'body { background: u\\72l(https://example.com); }', 'body { background: image-set("https://example.com/a.png" 1x); }', '} body {', 'a'.repeat(50001)]) assert.equal(validator.validateCss(css).valid, false, css.slice(0, 90));
  for (const css of ['body { color: red; }', 'a::after { content: "{"; } /* } */', '@media (min-width: 20px) { a { color: blue; } }']) assert.equal(validator.validateCss(css).valid, true, css);
});

test("old flat theme exports remain compatible and fill new colors", () => {
  const p = harness().page().VELNAR;
  const imported = p.Validator.theme({ name: "Legacy", background: "#123456", accent: "#00f" });
  assert.equal(imported.colors.background, "#123456"); assert.equal(Object.keys(imported.colors).length, 30);
});

test("preset link/text and primary hover contrast stays readable", () => {
  const p = harness().page();
  assert.equal(p.VELNAR.PRESET_THEMES.length, 45);
  for (const theme of p.VELNAR.PRESET_THEMES) {
    const c = theme.colors;
    for (const [text, background] of [[c.link, c.background], [c.link, c.backgroundSecondary], [c.textSecondary, c.backgroundSecondary], [c.buttonText, c.button], [c.buttonText, c.buttonHover]]) assert.ok(p.gsContrastRatio(text, background) >= 4.5, `${theme.id}: ${text} / ${background}`);
  }
});

test("every content script parses and custom CSS works in manifest load order", () => {
  const h = harness(), p = h.page(); const tags = new Map();
  p.document = { readyState: "loading", addEventListener() {}, getElementById: id => tags.get(id), createElement: () => ({ textContent: "" }), head: { appendChild(tag) { tags.set(tag.id, tag); } } };
  p.location = { href: "https://github.com/" };
  for (const file of JSON.parse(source("manifest.json")).content_scripts[0].js) {
    const script = new vm.Script(source(file), { filename: file });
    // Startup is exercised in the real browser; this VM has no document lifecycle.
    if (file !== "content/content.js") script.runInContext(p);
  }
  p.VELNAR.Injector.applyCustomCss("body { color: red; }", true);
  assert.equal(tags.get(p.VELNAR.CUSTOM_CSS_TAG_ID).textContent, "body { color: red; }");
  p.VELNAR.Injector.applyAnimations(true, Object.fromEntries(p.VELNAR.COMPONENTS.map(c => [c.id, false])), false);
  assert.doesNotMatch(tags.get(p.VELNAR.ANIMATIONS_TAG_ID).textContent, /animation\s*:/);
});
