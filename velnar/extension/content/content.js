// entry point e content script. injaa hame chizo behem vasl mikonim
(function () {
  // age Auto Dark Mode roshan bashe, theme haghighi az rooye prefers-color-scheme
  // system entekhab mishe, na az activeThemeId e sabet
  function resolveActiveThemeId(settings) {
    if (settings.autoDarkMode) {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark
        ? (settings.autoDarkModeDarkTheme || "dark")
        : (settings.autoDarkModeLightTheme || "light");
    }
    return settings.activeThemeId;
  }

  function resolveActiveColors(settings) {
    if (settings.customThemeApplied && settings.customTheme && !settings.autoDarkMode) {
      return settings.customTheme.colors || settings.customTheme;
    }
    const themeId = resolveActiveThemeId(settings);
    const theme = VELNAR.getThemeById(themeId) || VELNAR.PRESET_THEMES[0];
    return theme.colors;
  }

  // custom theme haye Theme Builder hich vaght rgbCycle nadaran (faghat preset haye
  // "Gaming" in flag ro daran) - pas faghat vaghti ye preset e vaghei fa'ale in true mishe
  function resolveRgbCycle(settings) {
    if (settings.customThemeApplied && settings.customTheme && !settings.autoDarkMode) return false;
    const themeId = resolveActiveThemeId(settings);
    const theme = VELNAR.getThemeById(themeId);
    return !!(theme && theme.rgbCycle);
  }

  function applyAll(settings) {
    if (!settings.enabled) {
      VELNAR.Injector.removeAll();
      return;
    }
    const colors = resolveActiveColors(settings);
    VELNAR.Injector.applyThemeVars(colors, settings.layout);
    VELNAR.Injector.applyComponents(settings.componentOverrides);
    VELNAR.Injector.applyTypography(settings.typography);
    VELNAR.Injector.applyAnimations(settings.animationsEnabled, settings.componentOverrides, resolveRgbCycle(settings));
    VELNAR.Injector.applyWebSwinger(settings.webSwingerEnabled, colors);
    VELNAR.Injector.applyCustomCss(settings.customCss, settings.customCssEnabled);
  }

  let currentSettings = null;

  async function init() {
    currentSettings = await VELNAR.Storage.get();
    applyAll(currentSettings);

    // vaghti user az popup ya options chizi avaz kard, bedune reload update besh
    VELNAR.Storage.onChange((newSettings) => {
      currentSettings = newSettings;
      applyAll(currentSettings);
    });

    // vaghti safhe avaz shod (SPA navigation) dobare bezan ru safhe jadid
    VELNAR.Observer.start(() => {
      if (currentSettings) applyAll(currentSettings);
    });

    // vaghti Auto Dark Mode roshane, taghire system theme (OS) ham bayad live apply beshe
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (currentSettings && currentSettings.autoDarkMode) applyAll(currentSettings);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
