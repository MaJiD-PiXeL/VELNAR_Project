globalThis.VELNAR = globalThis.VELNAR || {};

// Mutations are serialized by the one service worker shared by all extension pages.
VELNAR.Storage = {
  isWriter: false,
  _writeQueue: Promise.resolve(),
  // Read-only compatibility with installations made before the VELNAR rename.
  _legacyKeys: ["mavaj_settings_v1", "gitskin_settings_v1"],
  _read(keys) {
    return new Promise((resolve, reject) => chrome.storage.local.get(keys, result => {
      const error = chrome.runtime.lastError;
      if (error) reject(new Error(error.message)); else resolve(result);
    }));
  },
  async get() {
    const result = await this._read([VELNAR.STORAGE_KEY, ...this._legacyKeys]);
    const saved = result[VELNAR.STORAGE_KEY] ?? this._legacyKeys.map(key => result[key]).find(Boolean) ?? {};
    return VELNAR.Validator.settings(VELNAR.Validator.isRecord(saved) ? saved : {}, { strict: false });
  },
  _merge(current, partial) {
    const next = { ...current, ...partial };
    for (const key of ["layout", "typography", "componentOverrides"]) {
      if (VELNAR.Validator.isRecord(partial[key])) next[key] = { ...current[key], ...partial[key] };
    }
    return next;
  },
  _commit(action, payload) {
    const run = async () => {
      let next;
      if (action === "reset") next = structuredClone(VELNAR.DEFAULT_SETTINGS);
      else if (action === "restore") {
        if (!VELNAR.Validator.isRecord(payload) || !Object.keys(VELNAR.DEFAULT_SETTINGS).some(key => Object.hasOwn(payload, key))) throw new Error("This file is not a settings backup.");
        next = VELNAR.Validator.settings(payload);
      }
      else {
        const current = await this.get();
        if (action === "patch") {
          if (!VELNAR.Validator.isRecord(payload)) throw new Error("Settings must be an object.");
          next = VELNAR.Validator.settings(this._merge(current, payload));
        } else if (action === "select") {
          const theme = VELNAR.getThemeById(payload);
          if (!theme) throw new Error("Unknown theme.");
          next = { ...current, activeThemeId: theme.id, customThemeApplied: false, autoDarkMode: false, animationsEnabled: theme.scene ? true : current.animationsEnabled };
        } else if (action === "toggle") {
          if (typeof current[payload] !== "boolean") throw new Error("Unknown toggle.");
          next = VELNAR.Validator.settings({ ...current, [payload]: !current[payload] });
        } else if (action === "component") {
          if (!Object.hasOwn(current.componentOverrides, payload)) throw new Error("Unknown component.");
          next = this._merge(current, { componentOverrides: { [payload]: !current.componentOverrides[payload] } });
        } else if (action === "favorite") {
          if (!VELNAR.getThemeById(payload)) throw new Error("Unknown theme.");
          const favorites = new Set(current.favoriteThemeIds);
          if (favorites.has(payload)) favorites.delete(payload); else favorites.add(payload);
          next = { ...current, favoriteThemeIds: [...favorites] };
        } else if (action === "random") {
          const pool = VELNAR.PRESET_THEMES.filter(theme => theme.id !== current.activeThemeId);
          const theme = pool[Math.floor(Math.random() * pool.length)];
          next = { ...current, activeThemeId: theme.id, customThemeApplied: false, autoDarkMode: false, animationsEnabled: theme.scene ? true : current.animationsEnabled };
        } else throw new Error("Unknown settings action.");
      }
      await new Promise((resolve, reject) => chrome.storage.local.set({ [VELNAR.STORAGE_KEY]: next }, () => {
        const error = chrome.runtime.lastError;
        if (error) reject(new Error(error.message)); else resolve();
      }));
      return next;
    };
    const result = this._writeQueue.then(run);
    this._writeQueue = result.catch(() => {});
    return result;
  },
  _request(action, payload) {
    if (this.isWriter) return this._commit(action, payload);
    return new Promise((resolve, reject) => chrome.runtime.sendMessage({ type: "velnar:settings", action, payload }, response => {
      const error = chrome.runtime.lastError;
      if (error) reject(new Error(error.message));
      else if (!response?.ok) reject(new Error(response?.error || "Unable to save settings."));
      else resolve(response.settings);
    }));
  },
  set(partial) { return this._request("patch", partial); },
  selectTheme(id) { return this._request("select", id); },
  restore(settings) { return this._request("restore", settings); },
  reset() { return this._request("reset"); },
  toggle(key) { return this._request("toggle", key); },
  toggleComponent(id) { return this._request("component", id); },
  toggleFavorite(id) { return this._request("favorite", id); },
  randomTheme() { return this._request("random"); },
  onChange(callback) {
    const listener = (changes, area) => {
      if (area !== "local" || !changes[VELNAR.STORAGE_KEY]) return;
      callback(VELNAR.Validator.settings(changes[VELNAR.STORAGE_KEY].newValue || {}, { strict: false }));
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }
};
