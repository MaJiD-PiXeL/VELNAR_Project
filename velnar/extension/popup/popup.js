(async function () {
  const $ = id => document.getElementById(id);
  const UI = VELNAR.UI;
  let settings = await VELNAR.Storage.get();
  function render() {
    UI.switch($("enabledSwitch"), settings.enabled);
    $("extensionState").textContent = settings.enabled ? "Active on GitHub" : "Paused";
    $("autoDarkBanner").hidden = !settings.autoDarkMode;
    $("btnAnimations").setAttribute("aria-pressed", String(settings.animationsEnabled));
    $("btnAnimations").classList.toggle("gs-btn-active", settings.animationsEnabled);
    $("themeGrid").replaceChildren();
    const query = $("themeSearch").value.toLowerCase().trim();
    const themes = [...VELNAR.PRESET_THEMES].sort((a, b) => Number(settings.favoriteThemeIds.includes(b.id)) - Number(settings.favoriteThemeIds.includes(a.id))).filter(theme => theme.name.toLowerCase().includes(query));
    $("themeCount").textContent = `${themes.length} themes`;
    $("themeEmpty").hidden = themes.length > 0;
    themes.forEach(theme => {
      const active = UI.activeThemeId(settings) === theme.id && !(settings.customThemeApplied && !settings.autoDarkMode);
      const item = document.createElement("div"); item.className = "gs-theme-swatch"; item.classList.toggle("is-active", active);
      const choose = document.createElement("button"); choose.type = "button"; choose.className = "gs-theme-select";
      choose.style.background = theme.colors.background; choose.style.color = theme.colors.textPrimary;
      choose.setAttribute("aria-label", `Apply ${theme.name} theme`); choose.setAttribute("aria-pressed", String(active));
      const dot = document.createElement("i"); dot.className = "gs-dot"; dot.style.background = `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentSecondary})`;
      const name = document.createElement("span"); name.className = "gs-swatch-name"; name.textContent = theme.name;
      choose.append(dot, name);
      if (theme.scene) { item.classList.add("vn-cinematic-swatch"); const art = document.createElement("div"); art.className = "vn-popup-art"; art.innerHTML = VELNAR.SceneArt.svg(theme.scene); choose.prepend(art); }
      UI.on(choose, "click", async () => { settings = await VELNAR.Storage.selectTheme(theme.id); render(); UI.status(`${theme.name} applied.`); });
      const star = document.createElement("button"); star.type = "button"; star.className = "gs-star"; star.textContent = "★";
      star.classList.toggle("is-fav", settings.favoriteThemeIds.includes(theme.id)); star.setAttribute("aria-label", `Favorite ${theme.name}`); star.setAttribute("aria-pressed", String(settings.favoriteThemeIds.includes(theme.id)));
      UI.on(star, "click", async () => { settings = await VELNAR.Storage.toggleFavorite(theme.id); render(); });
      item.append(choose, star); $("themeGrid").append(item);
    });
  }
  UI.on($("themeSearch"), "input", render);
  UI.on($("enabledSwitch"), "click", async () => { settings = await VELNAR.Storage.toggle("enabled"); render(); });
  UI.on($("btnRandom"), "click", async () => { settings = await VELNAR.Storage.randomTheme(); render(); });
  UI.on($("btnAnimations"), "click", async () => { settings = await VELNAR.Storage.toggle("animationsEnabled"); render(); });
  UI.on($("btnReset"), "click", async () => {
    settings = await VELNAR.Storage.set({ activeThemeId: "dark", customThemeApplied: false, customCss: "", customCssEnabled: false, autoDarkMode: false }); render(); UI.status("Theme reset.");
  });
  UI.on($("btnDisableAutoDark"), "click", async () => { settings = await VELNAR.Storage.set({ autoDarkMode: false }); render(); });
  UI.on($("btnSettings"), "click", () => chrome.runtime.openOptionsPage());
  VELNAR.Storage.onChange(next => { settings = next; render(); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
  render();
})().catch(error => VELNAR.UI.status(error.message, true));
