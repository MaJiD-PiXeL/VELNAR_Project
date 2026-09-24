(async function () {
  const $ = id => document.getElementById(id);
  const UI = VELNAR.UI;
  let settings = await VELNAR.Storage.get();
  let builderColors = { ...UI.colors(settings) };
  let cssDirty = false;

  function currentThemeName() {
    return settings.customThemeApplied && !settings.autoDarkMode && settings.customTheme
      ? settings.customTheme.name : VELNAR.getThemeById(UI.activeThemeId(settings)).name;
  }
  document.querySelectorAll(".gs-nav-item").forEach(button => UI.on(button, "click", () => {
    document.querySelectorAll(".gs-nav-item").forEach(item => {
      item.classList.toggle("is-active", item === button);
      if (item === button) item.setAttribute("aria-current", "page"); else item.removeAttribute("aria-current");
    });
    document.querySelectorAll(".gs-tab").forEach(tab => tab.classList.toggle("is-active", tab.id === "tab-" + button.dataset.tab));
    $("tab-" + button.dataset.tab).querySelector("h1").focus();
  }));

  function themeCard(theme) {
    const card = document.createElement("div");
    card.className = "gs-theme-card";
    const active = UI.activeThemeId(settings) === theme.id && !(settings.customThemeApplied && !settings.autoDarkMode);
    card.classList.toggle("is-active", active);
    const choose = document.createElement("button");
    choose.type = "button";
    choose.className = "gs-theme-choice";
    choose.setAttribute("aria-label", `Apply ${theme.name} theme`);
    choose.setAttribute("aria-pressed", String(active));
    const preview = document.createElement("div");
    preview.className = "gs-preview";
    preview.style.background = theme.colors.background;
    preview.innerHTML = '<div></div><div></div><span class="gs-preview-dot"></span>';
    preview.children[0].style.background = theme.colors.sidebarBackground;
    preview.children[1].style.background = theme.colors.backgroundSecondary;
    preview.children[2].style.background = `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentSecondary})`;
    if (theme.scene) { preview.classList.add("vn-scene-art"); preview.dataset.scene = theme.scene; preview.innerHTML = VELNAR.SceneArt.svg(theme.scene); card.classList.add("vn-cinematic-card"); }
    const name = document.createElement("div");
    name.className = "gs-theme-name";
    name.style.background = theme.colors.backgroundSecondary;
    name.style.color = theme.colors.textPrimary;
    name.textContent = theme.name + (active ? " ✓" : "");
    if (theme.scene) { const subtitle = document.createElement("small"); subtitle.className = "vn-scene-tagline"; subtitle.textContent = theme.tagline; name.append(subtitle); }
    choose.append(preview, name);
    UI.on(choose, "click", async () => {
      settings = await VELNAR.Storage.selectTheme(theme.id);
      refresh();
      UI.status(`${theme.name} applied.`);
    });
    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "gs-fav-star";
    favorite.textContent = "★";
    favorite.classList.toggle("is-fav", settings.favoriteThemeIds.includes(theme.id));
    favorite.setAttribute("aria-label", `Favorite ${theme.name}`);
    favorite.setAttribute("aria-pressed", String(settings.favoriteThemeIds.includes(theme.id)));
    UI.on(favorite, "click", async () => { settings = await VELNAR.Storage.toggleFavorite(theme.id); refresh(); });
    card.append(choose, favorite);
    if (theme.rgbCycle) {
      const badge = document.createElement("span"); badge.className = "gs-rgb-badge"; badge.textContent = "RGB"; card.append(badge);
    }
    return card;
  }
  function renderThemes() {
    const targets = { cinematic: $("themeCardsCinematic"), official: $("themeCardsOfficial"), community: $("themeCardsCommunity"), vivid: $("themeCardsVivid"), gaming: $("themeCardsGaming") };
    Object.values(targets).forEach(target => target.replaceChildren());
    $("themeCardsFavorites").replaceChildren();
    const query = $("themeSearch").value.toLowerCase().trim();
    const themes = VELNAR.PRESET_THEMES.filter(theme => `${theme.name} ${theme.category}`.toLowerCase().includes(query));
    themes.forEach(theme => {
      targets[theme.category].append(themeCard(theme));
      if (settings.favoriteThemeIds.includes(theme.id)) $("themeCardsFavorites").append(themeCard(theme));
    });
    Object.values(targets).forEach(target => { target.hidden = !target.children.length; target.previousElementSibling.hidden = target.hidden; });
    $("cinematicHeading").hidden = targets.cinematic.hidden;
    $("favoritesBlock").hidden = !$("themeCardsFavorites").children.length;
    $("themeEmpty").hidden = themes.length > 0;
    $("activeThemeName").textContent = currentThemeName();
  }
  UI.on($("themeSearch"), "input", renderThemes);
  UI.on($("btnRandomTheme"), "click", async () => { settings = await VELNAR.Storage.randomTheme(); refresh(); UI.status(`${currentThemeName()} applied.`); });
  UI.on($("btnDisableAutoDarkOptions"), "click", async () => { settings = await VELNAR.Storage.set({ autoDarkMode: false }); refresh(); });

  const groups = {
    Surfaces: ["background", "backgroundSecondary", "backgroundTertiary", "hoverBackground", "activeBackground", "repoBackground", "sidebarBackground", "navbarBackground"],
    Text: ["textPrimary", "textSecondary", "textTertiary", "navbarText", "codeText"],
    Interactive: ["link", "linkHover", "button", "buttonText", "buttonHover", "accent", "accentSecondary"],
    Borders: ["border", "borderMuted", "codeBackground", "dropdownBackground", "tooltipBackground", "scrollbarThumb", "shadow"],
    Status: ["success", "warning", "error"]
  };
  function renderBuilder() {
    for (const [group, keys] of Object.entries(groups)) {
      const target = $("colorGrid" + group); target.replaceChildren();
      keys.forEach(key => VELNAR.ColorPicker.create(target, {
        label: key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase()),
        value: builderColors[key], hexOnly: key === "accent" || key === "accentSecondary",
        onChange(value) { builderColors[key] = value; updateBuilderPreview(); }
      }));
    }
    updateBuilderPreview();
  }
  function updateBuilderPreview() {
    const preview = $("builderPreview");
    preview.style.background = builderColors.background;
    preview.style.color = builderColors.textPrimary;
    preview.style.borderColor = builderColors.border;
    preview.querySelector("button").style.background = builderColors.button;
    preview.querySelector("button").style.color = builderColors.buttonText;
    preview.querySelector("a").style.color = builderColors.link;
  }
  UI.on($("btnLoadPresetIntoBuilder"), "click", () => { builderColors = { ...UI.colors(settings) }; $("themeNameInput").value = currentThemeName(); renderBuilder(); });
  UI.on($("btnApplyCustom"), "click", async () => {
    const invalid = document.querySelector('.gs-color-hex[aria-invalid="true"]');
    if (invalid) { invalid.reportValidity(); invalid.focus(); return; }
    const customTheme = VELNAR.Validator.theme({ name: $("themeNameInput").value.trim() || "My Theme", colors: builderColors });
    settings = await VELNAR.Storage.set({ customTheme, customThemeApplied: true, autoDarkMode: false });
    refresh(); UI.status(`${customTheme.name} applied.`);
  });
  for (const id of ["borderRadius", "shadowIntensity"]) {
    UI.on($(id), "input", () => $(id + "Value").textContent = $(id).value + (id === "borderRadius" ? "px" : "%"));
    UI.on($(id), "change", async () => { settings = await VELNAR.Storage.set({ layout: { [id]: Number($(id).value) } }); UI.status("Layout saved."); });
  }
  for (const id of ["fontFamily", "codeFont", "fontSize", "lineHeight", "fontWeight"]) {
    UI.on($(id), "change", async () => {
      const value = ["fontFamily", "codeFont"].includes(id) ? $(id).value.trim() : Number($(id).value);
      settings = await VELNAR.Storage.set({ typography: { [id]: value } }); UI.status("Typography saved.");
    });
  }
  for (const id of ["fontSize", "lineHeight"]) UI.on($(id), "input", () => $(id + "Value").textContent = $(id).value + (id === "fontSize" ? "px" : ""));

  function renderComponents() {
    $("componentList").replaceChildren();
    VELNAR.COMPONENTS.forEach(component => {
      const row = document.createElement("div"); row.className = "gs-component-item";
      const label = document.createElement("span"); label.textContent = component.label;
      const button = document.createElement("button"); button.type = "button"; button.className = "gs-switch";
      button.setAttribute("role", "switch"); button.setAttribute("aria-label", `Theme ${component.label}`);
      UI.switch(button, settings.componentOverrides[component.id]);
      UI.on(button, "click", async () => { settings = await VELNAR.Storage.toggleComponent(component.id); refresh(); });
      row.append(label, button); $("componentList").append(row);
    });
  }
  for (const [id, enabled] of [["btnAllComponentsOn", true], ["btnAllComponentsOff", false]]) UI.on($(id), "click", async () => {
    settings = await VELNAR.Storage.set({ componentOverrides: Object.fromEntries(VELNAR.COMPONENTS.map(component => [component.id, enabled])) }); refresh();
  });
  UI.on($("customCssInput"), "input", () => { cssDirty = true; });
  UI.on($("customCssSwitch"), "click", async () => { settings = await VELNAR.Storage.toggle("customCssEnabled"); refresh(); });
  UI.on($("btnValidateCss"), "click", async () => {
    const css = $("customCssInput").value;
    const check = VELNAR.Validator.validateCss(css);
    $("cssErrorBox").hidden = check.valid;
    $("cssErrorBox").textContent = check.errors.join("\n");
    if (!check.valid) return;
    settings = await VELNAR.Storage.set({ customCss: css, customCssEnabled: true }); cssDirty = false;
    refresh(); UI.status("Custom CSS applied.");
  });
  UI.on($("btnResetCss"), "click", async () => {
    settings = await VELNAR.Storage.set({ customCss: "", customCssEnabled: false }); cssDirty = false; $("cssErrorBox").hidden = true; refresh();
  });

  function downloadJson(value, filename) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  UI.on($("btnExportTheme"), "click", () => downloadJson({ name: currentThemeName(), colors: UI.colors(settings) }, "velnar-theme.json"));
  UI.on($("btnBackupSettings"), "click", async () => downloadJson(await VELNAR.Storage.get(), "velnar-settings-backup.json"));
  async function importJson(event, restore) {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > VELNAR.Validator.MAX_IMPORT_BYTES) throw new Error("Choose a JSON file smaller than 250 KB.");
      const parsed = JSON.parse(await file.text());
      settings = restore ? await VELNAR.Storage.restore(VELNAR.Validator.settings(parsed))
        : await VELNAR.Storage.set({ customTheme: VELNAR.Validator.theme(parsed), customThemeApplied: true, autoDarkMode: false });
      cssDirty = false; builderColors = { ...UI.colors(settings) }; $("themeNameInput").value = currentThemeName(); renderBuilder(); refresh();
      UI.status(restore ? "Settings restored." : "Theme imported and applied.");
    } finally { event.target.value = ""; }
  }
  UI.on($("importThemeFile"), "change", event => importJson(event, false));
  UI.on($("restoreSettingsFile"), "change", event => importJson(event, true));

  const switches = { sidebarEnabledSwitch: "enabled", settingEnabled: "enabled", settingCustomTheme: "customThemeApplied", settingAnimations: "animationsEnabled", settingWebSwinger: "webSwingerEnabled", settingAutoDark: "autoDarkMode" };
  for (const [id, key] of Object.entries(switches)) UI.on($(id), "click", async () => {
    if (key === "customThemeApplied" && !settings.customTheme) throw new Error("Create or import a custom theme first.");
    settings = key === "customThemeApplied" && !settings.customThemeApplied
      ? await VELNAR.Storage.set({ customThemeApplied: true, autoDarkMode: false }) : await VELNAR.Storage.toggle(key);
    refresh();
  });
  for (const [id, key] of [["autoDarkLight", "autoDarkModeLightTheme"], ["autoDarkDark", "autoDarkModeDarkTheme"]]) {
    VELNAR.PRESET_THEMES.forEach(theme => { const option = document.createElement("option"); option.value = theme.id; option.textContent = theme.name; $(id).append(option); });
    UI.on($(id), "change", async () => { settings = await VELNAR.Storage.set({ [key]: $(id).value }); refresh(); });
  }
  UI.on($("btnResetAll"), "click", async () => {
    if (!confirm("Reset all VELNAR settings? Your custom theme and CSS will be removed.")) return;
    settings = await VELNAR.Storage.reset(); cssDirty = false; builderColors = { ...UI.colors(settings) }; $("themeNameInput").value = ""; renderBuilder(); refresh(); UI.status("Default settings restored.");
  });
  function refresh() {
    renderThemes(); renderComponents();
    for (const [id, key] of Object.entries(switches)) UI.switch($(id), settings[key]);
    for (const [key, value] of Object.entries(settings.typography)) UI.setValue($(key), value);
    for (const [key, value] of Object.entries(settings.layout)) UI.setValue($(key), value);
    for (const id of ["fontSize", "lineHeight", "borderRadius", "shadowIntensity"]) $(id + "Value").textContent = $(id).value + (id === "lineHeight" ? "" : id === "shadowIntensity" ? "%" : "px");
    UI.switch($("customCssSwitch"), settings.customCssEnabled);
    if (!cssDirty) UI.setValue($("customCssInput"), settings.customCss);
    $("autoDarkBannerOptions").hidden = !settings.autoDarkMode;
    $("autoDarkLight").value = settings.autoDarkModeLightTheme;
    $("autoDarkDark").value = settings.autoDarkModeDarkTheme;
    $("autoDarkLight").disabled = $("autoDarkDark").disabled = !settings.autoDarkMode;
    $("extensionState").textContent = settings.enabled ? "Active on GitHub" : "Paused";
  }
  VELNAR.Storage.onChange(next => { settings = next; refresh(); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh);
  renderBuilder(); refresh();
})().catch(error => VELNAR.UI.status(error.message, true));
