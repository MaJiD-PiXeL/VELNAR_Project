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
    const theme = VELNAR.getThemeById(themeId) || VELNAR.getThemeById("dark");
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

  const applied = new Map();
  function applyStyle(id, values, render) {
    const key = JSON.stringify(values);
    const previous = applied.get(id), tag = document.getElementById(id);
    if (previous?.key === key && tag === previous.tag && tag?.textContent === previous.css) return;
    render();
    const next = document.getElementById(id);
    applied.set(id, { key, tag: next, css: next?.textContent });
  }

  function applyAll(settings) {
    const activePreset = settings.customThemeApplied && !settings.autoDarkMode ? null : VELNAR.getThemeById(resolveActiveThemeId(settings));
    if (!settings.enabled) {
      VELNAR.Cinema.apply(null, settings);
      VELNAR.Injector.removeAll();
      applied.clear();
      return;
    }
    const colors = resolveActiveColors(settings);
    applyStyle(VELNAR.STYLE_TAG_ID, [colors, settings.layout], () => VELNAR.Injector.applyThemeVars(colors, settings.layout));
    applyStyle(VELNAR.COMPONENTS_TAG_ID, settings.componentOverrides, () => VELNAR.Injector.applyComponents(settings.componentOverrides));
    applyStyle(VELNAR.TYPOGRAPHY_TAG_ID, settings.typography, () => VELNAR.Injector.applyTypography(settings.typography));
    const motion = settings.animationsEnabled && !document.hidden;
    applyStyle(VELNAR.ANIMATIONS_TAG_ID, [motion, settings.componentOverrides, resolveRgbCycle(settings)], () => VELNAR.Injector.applyAnimations(motion, settings.componentOverrides, resolveRgbCycle(settings)));
    VELNAR.Cinema.apply(activePreset, settings);
    VELNAR.Injector.applyWebSwinger(settings.webSwingerEnabled, colors);
    applyStyle(VELNAR.CUSTOM_CSS_TAG_ID, [settings.customCss, settings.customCssEnabled], () => VELNAR.Injector.applyCustomCss(settings.customCss, settings.customCssEnabled));
  }

  let currentSettings = null;

  async function init() {
    // vaghti user az popup ya options chizi avaz kard, bedune reload update besh
    VELNAR.Storage.onChange((newSettings) => {
      currentSettings = newSettings;
      applyAll(currentSettings);
    });

    const saved = await VELNAR.Storage.get();
    currentSettings ||= saved;
    applyAll(currentSettings);

    // vaghti safhe avaz shod (SPA navigation) dobare bezan ru safhe jadid
    VELNAR.Observer.start(() => {
      if (currentSettings) applyAll(currentSettings);
    });

    // Color the first render; attach body-dependent decorations once parsing ends.
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => applyAll(currentSettings), { once: true });
    document.addEventListener("visibilitychange", () => applyAll(currentSettings));

    // vaghti Auto Dark Mode roshane, taghire system theme (OS) ham bayad live apply beshe
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (currentSettings && currentSettings.autoDarkMode) applyAll(currentSettings);
      });
    }
  }

  init();
})();
