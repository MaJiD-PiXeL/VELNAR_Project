globalThis.VELNAR = globalThis.VELNAR || {};
VELNAR.UI = {
  status(message, error = false) {
    const region = document.getElementById("statusMessage");
    if (!region) return;
    region.textContent = message;
    region.classList.toggle("is-error", error);
    region.hidden = !message;
  },
  on(element, event, callback) {
    element.addEventListener(event, async eventObject => {
      try { await callback(eventObject); }
      catch (error) { this.status(error.message || "Something went wrong. Please try again.", true); }
    });
  },
  switch(element, value) {
    element.classList.toggle("is-on", !!value);
    element.setAttribute("aria-checked", String(!!value));
  },
  activeThemeId(settings) {
    return settings.autoDarkMode
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? settings.autoDarkModeDarkTheme : settings.autoDarkModeLightTheme)
      : settings.activeThemeId;
  },
  colors(settings) {
    return settings.customThemeApplied && settings.customTheme && !settings.autoDarkMode
      ? settings.customTheme.colors
      : (VELNAR.getThemeById(this.activeThemeId(settings)) || VELNAR.getThemeById("dark")).colors;
  },
  setValue(element, value) {
    if (document.activeElement !== element) element.value = value;
  }
};
