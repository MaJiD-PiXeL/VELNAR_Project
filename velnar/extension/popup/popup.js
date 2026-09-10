// mantegh e popup - list e theme haro neshun mide va enable/disable ro handle mikone
(async function () {
  const themeGrid = document.getElementById("themeGrid");
  const themeCount = document.getElementById("themeCount");
  const enabledSwitch = document.getElementById("enabledSwitch");
  const btnReset = document.getElementById("btnReset");
  const btnSettings = document.getElementById("btnSettings");
  const btnRandom = document.getElementById("btnRandom");
  const btnAnimations = document.getElementById("btnAnimations");
  const autoDarkBanner = document.getElementById("autoDarkBanner");
  const btnDisableAutoDark = document.getElementById("btnDisableAutoDark");

  let settings = await VELNAR.Storage.get();

  function orderedThemes() {
    const favs = settings.favoriteThemeIds || [];
    const favThemes = VELNAR.PRESET_THEMES.filter((t) => favs.includes(t.id));
    const restThemes = VELNAR.PRESET_THEMES.filter((t) => !favs.includes(t.id));
    return [...favThemes, ...restThemes];
  }

  function renderBanner() {
    autoDarkBanner.style.display = settings.autoDarkMode ? "block" : "none";
  }

  let popupFirstRender = true;

  function renderThemes(justAppliedId) {
    themeGrid.innerHTML = "";
    themeCount.textContent = VELNAR.PRESET_THEMES.length + " themes";
    const favs = settings.favoriteThemeIds || [];
    orderedThemes().forEach((theme, i) => {
      const el = document.createElement("div");
      const isActive = settings.activeThemeId === theme.id && !settings.customThemeApplied;
      el.className = "gs-theme-swatch"
        + (isActive ? " is-active" : "")
        + (theme.id === justAppliedId ? " is-just-applied" : "")
        + (popupFirstRender ? " gs-swatch-entrance" : "");
      if (popupFirstRender) el.style.animationDelay = Math.min(i * 0.02, 0.3) + "s";
      el.style.background = theme.colors.background;
      el.title = theme.name;
      const isFav = favs.includes(theme.id);
      el.innerHTML = `
        <span class="gs-star${isFav ? " is-fav" : ""}" data-id="${theme.id}">★</span>
        <span class="gs-dot" style="background:linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentSecondary || theme.colors.accent})"></span>
        <span>${theme.name}</span>`;
      el.addEventListener("click", async (e) => {
        if (e.target.classList.contains("gs-star")) return; // star click ro joda handle mikonim
        // optimistic UI: fori active neshun bede, montazere round-trip e storage namun
        // (in daghigh hamun jaii boud ke "click mikonam kar nemikone" ehsas mishod)
        themeGrid.querySelectorAll(".gs-theme-swatch").forEach((s) => s.classList.remove("is-active"));
        el.classList.add("is-active");
        // Auto Dark Mode age roshan bashe khodesh theme ro override mikone va click bi asar mishe -
        // pas hamzaman ba entekhabe dasti, khamushesh mikonim ta click hamishe natije ye vazeh dashte bashe
        settings = await VELNAR.Storage.set({ activeThemeId: theme.id, customThemeApplied: false, autoDarkMode: false });
        renderBanner();
        renderThemes(theme.id);
      });
      themeGrid.appendChild(el);
    });
    themeGrid.querySelectorAll(".gs-star").forEach((star) => {
      star.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = star.dataset.id;
        const current = new Set(settings.favoriteThemeIds || []);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        settings = await VELNAR.Storage.set({ favoriteThemeIds: [...current] });
        renderThemes();
      });
    });
    popupFirstRender = false;
  }

  function renderSwitch() {
    enabledSwitch.classList.toggle("is-on", !!settings.enabled);
  }

  function renderAnimationsBtn() {
    btnAnimations.classList.toggle("gs-btn-active", !!settings.animationsEnabled);
  }

  enabledSwitch.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ enabled: !settings.enabled });
    renderSwitch();
  });

  btnRandom.addEventListener("click", async () => {
    const pool = VELNAR.PRESET_THEMES.filter((t) => t.id !== settings.activeThemeId);
    const pick = pool[Math.floor(Math.random() * pool.length)] || VELNAR.PRESET_THEMES[0];
    settings = await VELNAR.Storage.set({ activeThemeId: pick.id, customThemeApplied: false, autoDarkMode: false });
    renderBanner();
    renderThemes(pick.id);
  });

  btnAnimations.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ animationsEnabled: !settings.animationsEnabled });
    renderAnimationsBtn();
  });

  btnReset.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({
      activeThemeId: "dark",
      customThemeApplied: false,
      customCss: "",
      customCssEnabled: false,
      autoDarkMode: false
    });
    renderBanner();
    renderThemes("dark");
  });

  btnDisableAutoDark.addEventListener("click", async () => {
    settings = await VELNAR.Storage.set({ autoDarkMode: false });
    renderBanner();
    renderThemes();
  });

  btnSettings.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  renderThemes();
  renderSwitch();
  renderAnimationsBtn();
  renderBanner();
})();
