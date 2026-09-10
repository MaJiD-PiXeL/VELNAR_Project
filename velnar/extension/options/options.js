// mantegh e kamele safheye Settings / Dashboard
(async function () {
  let settings = await VELNAR.Storage.get();
  let builderColors = null; // rang haii ke to Theme Builder dare test mishe (ghabl az save)

  // ---------- Sidebar navigation ----------
  const navItems = document.querySelectorAll(".gs-nav-item");
  const tabs = document.querySelectorAll(".gs-tab");
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      navItems.forEach((b) => b.classList.remove("is-active"));
      tabs.forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("is-active");
    });
  });

  const sidebarEnabledSwitch = document.getElementById("sidebarEnabledSwitch");
  sidebarEnabledSwitch.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ enabled: !settings.enabled });
    refreshAllUI();
  });

  // ---------- Themes tab ----------
  const themeCardsOfficial = document.getElementById("themeCardsOfficial");
  const themeCardsCommunity = document.getElementById("themeCardsCommunity");
  const themeCardsVivid = document.getElementById("themeCardsVivid");
  const themeCardsGaming = document.getElementById("themeCardsGaming");
  const themeCardsFavorites = document.getElementById("themeCardsFavorites");
  const favoritesBlock = document.getElementById("favoritesBlock");

  let themesFirstRender = true;

  function makeThemeCard(theme, justAppliedId) {
    const isActive = settings.activeThemeId === theme.id && !settings.customThemeApplied;
    const isFav = (settings.favoriteThemeIds || []).includes(theme.id);
    const card = document.createElement("div");
    card.className = "gs-theme-card"
      + (isActive ? " is-active" : "")
      + (theme.id === justAppliedId ? " is-just-applied" : "")
      + (themesFirstRender ? " gs-card-entrance" : "");
    const c = theme.colors;
    const dotGradient = `linear-gradient(135deg, ${c.accent}, ${c.accentSecondary || c.accent})`;
    card.innerHTML = `
      <div class="gs-preview" style="background:${c.background}">
        <div style="background:${c.sidebarBackground}"></div>
        <div style="background:${c.repoBackground}"></div>
        <span class="gs-preview-dot" style="background:${dotGradient}"></span>
        <span class="gs-fav-star${isFav ? " is-fav" : ""}" data-id="${theme.id}">★</span>
        ${theme.rgbCycle ? '<span class="gs-rgb-badge">RGB</span>' : ""}
      </div>
      <div class="gs-theme-name" style="background:${c.backgroundSecondary}; color:${c.textPrimary}">
        ${theme.name}
        <span class="gs-theme-check">&check;</span>
      </div>
    `;
    card.addEventListener("click", async (e) => {
      if (e.target.classList.contains("gs-fav-star")) return;
      // Auto Dark Mode age roshan bashe, khodesh theme ro override mikone va click bi-asar
      // be nazar miad - pas hamzaman ba click e dasti, khamushesh mikonim ta natije hamishe
      // vazeh bashe (in dorost hamun jaii bud ke "click mikonam kar nemikone" ehsas mishod)
      settings = await VELNAR.Storage.set({ activeThemeId: theme.id, customThemeApplied: false, autoDarkMode: false });
      renderAutoDarkBanner();
      renderThemeCards(theme.id);
    });
    card.querySelector(".gs-fav-star").addEventListener("click", async (e) => {
      e.stopPropagation();
      const current = new Set(settings.favoriteThemeIds || []);
      if (current.has(theme.id)) current.delete(theme.id);
      else current.add(theme.id);
      settings = await VELNAR.Storage.set({ favoriteThemeIds: [...current] });
      renderThemeCards();
    });
    return card;
  }

  function renderThemeCards(justAppliedId) {
    themeCardsOfficial.innerHTML = "";
    themeCardsCommunity.innerHTML = "";
    themeCardsVivid.innerHTML = "";
    themeCardsGaming.innerHTML = "";
    themeCardsFavorites.innerHTML = "";
    const favIds = settings.favoriteThemeIds || [];
    favoritesBlock.style.display = favIds.length ? "block" : "none";

    const targetFor = { official: themeCardsOfficial, vivid: themeCardsVivid, gaming: themeCardsGaming, community: themeCardsCommunity };
    VELNAR.PRESET_THEMES.forEach((theme) => {
      if (favIds.includes(theme.id)) themeCardsFavorites.appendChild(makeThemeCard(theme, justAppliedId));
      (targetFor[theme.category] || themeCardsCommunity).appendChild(makeThemeCard(theme, justAppliedId));
    });
    themesFirstRender = false;
  }

  const autoDarkBannerOptions = document.getElementById("autoDarkBannerOptions");
  function renderAutoDarkBanner() {
    autoDarkBannerOptions.style.display = settings.autoDarkMode ? "block" : "none";
  }
  document.getElementById("btnDisableAutoDarkOptions").addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ autoDarkMode: false });
    renderAutoDarkBanner();
    loadSettingsUI();
  });

  document.getElementById("btnRandomTheme").addEventListener("click", async () => {
    const pool = VELNAR.PRESET_THEMES.filter((t) => t.id !== settings.activeThemeId);
    const pick = pool[Math.floor(Math.random() * pool.length)] || VELNAR.PRESET_THEMES[0];
    settings = await VELNAR.Storage.set({ activeThemeId: pick.id, customThemeApplied: false, autoDarkMode: false });
    renderAutoDarkBanner();
    renderThemeCards(pick.id);
  });

  // ---------- Theme Builder tab ----------
  const colorGroups = {
    Surfaces: ["background", "backgroundSecondary", "backgroundTertiary", "hoverBackground", "activeBackground", "repoBackground", "sidebarBackground", "navbarBackground"],
    Text: ["textPrimary", "textSecondary", "textTertiary", "navbarText", "codeText"],
    Interactive: ["link", "linkHover", "button", "buttonText", "buttonHover", "accent", "accentSecondary"],
    Borders: ["border", "borderMuted", "codeBackground", "dropdownBackground", "tooltipBackground", "scrollbarThumb", "shadow"],
    Status: ["success", "warning", "error"]
  };
  const colorLabels = {
    background: "Background", backgroundSecondary: "Secondary Background", backgroundTertiary: "Tertiary Background",
    hoverBackground: "Hover Background", activeBackground: "Active Background",
    textPrimary: "Primary Text", textSecondary: "Secondary Text", textTertiary: "Tertiary Text",
    link: "Link Color", linkHover: "Link Hover", button: "Button Color", buttonText: "Button Text", buttonHover: "Button Hover",
    border: "Border Color", borderMuted: "Muted Border", codeBackground: "Code Background", codeText: "Code Text",
    repoBackground: "Repository Background", sidebarBackground: "Sidebar Background",
    navbarBackground: "Navbar Background", navbarText: "Navbar Text",
    dropdownBackground: "Dropdown Background", tooltipBackground: "Tooltip Background", scrollbarThumb: "Scrollbar Thumb",
    accent: "Accent Color", accentSecondary: "Accent Color 2 (used in gradients/glow)", success: "Success Color", warning: "Warning Color", error: "Error Color", shadow: "Shadow Color"
  };
  const groupContainerIds = {
    Surfaces: "colorGridSurfaces", Text: "colorGridText", Interactive: "colorGridInteractive",
    Borders: "colorGridBorders", Status: "colorGridStatus"
  };

  function renderColorGrid(colors) {
    Object.keys(groupContainerIds).forEach((group) => {
      const container = document.getElementById(groupContainerIds[group]);
      container.innerHTML = "";
      colorGroups[group].forEach((key) => {
        VELNAR.ColorPicker.create(container, {
          label: colorLabels[key] || key,
          value: colors[key],
          onChange: (val) => {
            builderColors[key] = val;
          }
        });
      });
    });
  }

  function activeColorsSnapshot() {
    if (settings.customThemeApplied && settings.customTheme) return { ...settings.customTheme.colors };
    const theme = VELNAR.getThemeById(settings.activeThemeId) || VELNAR.PRESET_THEMES[0];
    return { ...theme.colors };
  }

  document.getElementById("btnLoadPresetIntoBuilder").addEventListener("click", () => {
    builderColors = activeColorsSnapshot();
    renderColorGrid(builderColors);
  });

  document.getElementById("btnApplyCustom").addEventListener("click", async () => {
    if (!builderColors) builderColors = activeColorsSnapshot();
    const name = document.getElementById("themeNameInput").value.trim() || "My Theme";
    settings = await VELNAR.Storage.set({
      customThemeApplied: true,
      customTheme: { name, colors: builderColors },
      autoDarkMode: false
    });
    renderAutoDarkBanner();
    renderThemeCards();
  });

  // Advanced: border radius / shadow
  const borderRadiusInput = document.getElementById("borderRadius");
  const shadowIntensityInput = document.getElementById("shadowIntensity");
  const borderRadiusValue = document.getElementById("borderRadiusValue");
  const shadowIntensityValue = document.getElementById("shadowIntensityValue");

  function loadLayoutUI() {
    const l = settings.layout || { borderRadius: 8, shadowIntensity: 30 };
    borderRadiusInput.value = l.borderRadius;
    shadowIntensityInput.value = l.shadowIntensity;
    borderRadiusValue.textContent = l.borderRadius + "px";
    shadowIntensityValue.textContent = l.shadowIntensity + "%";
  }
  async function saveLayout() {
    settings = await VELNAR.Storage.set({
      layout: {
        borderRadius: Number(borderRadiusInput.value),
        shadowIntensity: Number(shadowIntensityInput.value)
      }
    });
  }
  borderRadiusInput.addEventListener("input", () => { borderRadiusValue.textContent = borderRadiusInput.value + "px"; });
  borderRadiusInput.addEventListener("change", saveLayout);
  shadowIntensityInput.addEventListener("input", () => { shadowIntensityValue.textContent = shadowIntensityInput.value + "%"; });
  shadowIntensityInput.addEventListener("change", saveLayout);

  // ---------- Typography tab ----------
  const fontFamilyInput = document.getElementById("fontFamily");
  const codeFontInput = document.getElementById("codeFont");
  const fontSizeInput = document.getElementById("fontSize");
  const lineHeightInput = document.getElementById("lineHeight");
  const fontWeightInput = document.getElementById("fontWeight");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const lineHeightValue = document.getElementById("lineHeightValue");

  function loadTypographyUI() {
    const t = settings.typography;
    fontFamilyInput.value = t.fontFamily || "";
    codeFontInput.value = t.codeFont || "";
    fontSizeInput.value = t.fontSize || 14;
    lineHeightInput.value = t.lineHeight || 1.5;
    fontWeightInput.value = String(t.fontWeight || 400);
    fontSizeValue.textContent = fontSizeInput.value + "px";
    lineHeightValue.textContent = lineHeightInput.value;
  }

  async function saveTypography() {
    settings = await VELNAR.Storage.set({
      typography: {
        fontFamily: fontFamilyInput.value.trim(),
        codeFont: codeFontInput.value.trim(),
        fontSize: Number(fontSizeInput.value),
        lineHeight: Number(lineHeightInput.value),
        fontWeight: Number(fontWeightInput.value)
      }
    });
  }

  [fontFamilyInput, codeFontInput, fontWeightInput].forEach((el) =>
    el.addEventListener("change", saveTypography)
  );
  fontSizeInput.addEventListener("input", () => { fontSizeValue.textContent = fontSizeInput.value + "px"; });
  fontSizeInput.addEventListener("change", saveTypography);
  lineHeightInput.addEventListener("input", () => { lineHeightValue.textContent = lineHeightInput.value; });
  lineHeightInput.addEventListener("change", saveTypography);

  // ---------- Components tab (real toggles now) ----------
  const componentList = document.getElementById("componentList");

  function renderComponentList() {
    componentList.innerHTML = "";
    VELNAR.COMPONENTS.forEach((comp) => {
      const row = document.createElement("div");
      row.className = "gs-component-item";
      const isOn = !settings.componentOverrides || settings.componentOverrides[comp.id] !== false;
      row.innerHTML = `<span>${comp.label}</span><div class="gs-switch${isOn ? " is-on" : ""}" data-comp="${comp.id}"></div>`;
      componentList.appendChild(row);
    });
    componentList.querySelectorAll(".gs-switch").forEach((sw) => {
      sw.addEventListener("click", async () => {
        const id = sw.dataset.comp;
        const current = { ...(settings.componentOverrides || {}) };
        current[id] = current[id] === false ? true : false;
        settings = await VELNAR.Storage.set({ componentOverrides: current });
        renderComponentList();
      });
    });
  }

  document.getElementById("btnAllComponentsOn").addEventListener("click", async () => {
    const all = {};
    VELNAR.COMPONENTS.forEach((c) => (all[c.id] = true));
    settings = await VELNAR.Storage.set({ componentOverrides: all });
    renderComponentList();
  });
  document.getElementById("btnAllComponentsOff").addEventListener("click", async () => {
    const all = {};
    VELNAR.COMPONENTS.forEach((c) => (all[c.id] = false));
    settings = await VELNAR.Storage.set({ componentOverrides: all });
    renderComponentList();
  });

  // ---------- Custom CSS tab ----------
  const customCssSwitch = document.getElementById("customCssSwitch");
  const customCssInput = document.getElementById("customCssInput");
  const cssErrorBox = document.getElementById("cssErrorBox");

  function loadCustomCssUI() {
    customCssSwitch.classList.toggle("is-on", !!settings.customCssEnabled);
    customCssInput.value = settings.customCss || "";
  }

  customCssSwitch.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ customCssEnabled: !settings.customCssEnabled });
    loadCustomCssUI();
  });

  document.getElementById("btnValidateCss").addEventListener("click", async () => {
    const css = customCssInput.value;
    const result = VELNAR.Validator.validateCss(css);
    if (!result.valid) {
      cssErrorBox.style.display = "block";
      cssErrorBox.textContent = result.errors.join("\n");
      return;
    }
    cssErrorBox.style.display = "none";
    settings = await VELNAR.Storage.set({ customCss: css, customCssEnabled: true });
    loadCustomCssUI();
  });

  document.getElementById("btnResetCss").addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ customCss: "", customCssEnabled: false });
    cssErrorBox.style.display = "none";
    loadCustomCssUI();
  });

  // ---------- Import / Export tab ----------
  function downloadJson(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  document.getElementById("btnExportTheme").addEventListener("click", () => {
    const colors = activeColorsSnapshot();
    const name = settings.customThemeApplied && settings.customTheme ? settings.customTheme.name : settings.activeThemeId;
    downloadJson({ name, ...colors }, `velnar-theme-${name}.json`.replace(/\s+/g, "-").toLowerCase());
  });

  document.getElementById("importThemeFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      const { name, ...colors } = parsed;
      settings = await VELNAR.Storage.set({
        customThemeApplied: true,
        customTheme: { name: name || "Imported Theme", colors }
      });
      renderThemeCards();
      alert("Theme import shod.");
    } catch (err) {
      alert("File JSON motabar nist.");
    }
  });

  document.getElementById("btnBackupSettings").addEventListener("click", () => {
    downloadJson(settings, "velnar-settings-backup.json");
  });

  document.getElementById("restoreSettingsFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      settings = await VELNAR.Storage.set(parsed);
      refreshAllUI();
      alert("Settings restore shod.");
    } catch (err) {
      alert("File JSON motabar nist.");
    }
  });

  // ---------- Settings tab ----------
  const settingEnabled = document.getElementById("settingEnabled");
  const settingCustomTheme = document.getElementById("settingCustomTheme");
  const settingAnimations = document.getElementById("settingAnimations");
  const settingWebSwinger = document.getElementById("settingWebSwinger");
  const settingAutoDark = document.getElementById("settingAutoDark");
  const autoDarkLight = document.getElementById("autoDarkLight");
  const autoDarkDark = document.getElementById("autoDarkDark");
  const autoDarkPickers = document.getElementById("autoDarkPickers");

  // select haye Auto Dark Mode ro ye bar az rooye preset ha por mikonim
  VELNAR.PRESET_THEMES.forEach((theme) => {
    const optA = document.createElement("option");
    optA.value = theme.id;
    optA.textContent = theme.name;
    autoDarkLight.appendChild(optA);
    const optB = optA.cloneNode(true);
    autoDarkDark.appendChild(optB);
  });

  function loadSettingsUI() {
    settingEnabled.classList.toggle("is-on", !!settings.enabled);
    settingCustomTheme.classList.toggle("is-on", !!settings.customThemeApplied);
    settingAnimations.classList.toggle("is-on", !!settings.animationsEnabled);
    settingWebSwinger.classList.toggle("is-on", !!settings.webSwingerEnabled);
    settingAutoDark.classList.toggle("is-on", !!settings.autoDarkMode);
    sidebarEnabledSwitch.classList.toggle("is-on", !!settings.enabled);
    autoDarkLight.value = settings.autoDarkModeLightTheme || "light";
    autoDarkDark.value = settings.autoDarkModeDarkTheme || "dark";
    autoDarkPickers.style.opacity = settings.autoDarkMode ? "1" : "0.4";
    autoDarkPickers.style.pointerEvents = settings.autoDarkMode ? "auto" : "none";
  }

  settingEnabled.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ enabled: !settings.enabled });
    loadSettingsUI();
  });
  settingCustomTheme.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ customThemeApplied: !settings.customThemeApplied });
    loadSettingsUI();
    renderThemeCards();
  });
  settingAnimations.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ animationsEnabled: !settings.animationsEnabled });
    loadSettingsUI();
  });
  settingWebSwinger.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ webSwingerEnabled: !settings.webSwingerEnabled });
    loadSettingsUI();
  });
  settingAutoDark.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ autoDarkMode: !settings.autoDarkMode });
    loadSettingsUI();
    renderAutoDarkBanner();
  });
  autoDarkLight.addEventListener("change", async () => {
    settings = await VELNAR.Storage.set({ autoDarkModeLightTheme: autoDarkLight.value });
  });
  autoDarkDark.addEventListener("change", async () => {
    settings = await VELNAR.Storage.set({ autoDarkModeDarkTheme: autoDarkDark.value });
  });

  document.getElementById("btnResetAll").addEventListener("click", async () => {
    if (!confirm("Motmaeni mikhay hameye tanzimat reset beshe?")) return;
    settings = await VELNAR.Storage.reset();
    refreshAllUI();
  });

  // ---------- init ----------
  function refreshAllUI() {
    renderThemeCards();
    loadTypographyUI();
    loadCustomCssUI();
    loadSettingsUI();
    renderComponentList();
    loadLayoutUI();
    renderAutoDarkBanner();
  }
  refreshAllUI();
})();
