globalThis.VELNAR = globalThis.VELNAR || {};

// The static scene survives Pause/Reduce Motion. Cinema adds the moving layer.
VELNAR.World = {
  STYLE_ID: "velnar-world-skin",
  BANNER_ID: "velnar-world-banner",
  _state: null,
  _observer: null,
  _timer: null,
  _skin: null,
  apply(theme, settings) {
    if (!theme?.scene || !settings.enabled) { this.remove(); return; }
    this._state = { theme, settings };
    const style = VELNAR.Injector._getOrCreateTag(this.STYLE_ID);
    const key = JSON.stringify([theme, settings.componentOverrides]);
    if (this._skin?.key !== key) this._skin = { key, css: this.skinCss(theme, settings.componentOverrides || {}) };
    const css = this._skin.css;
    if (style.textContent !== css) style.textContent = css;
    const dashboard = /^\/(?:dashboard(?:\/|$)|$)/.test(location.pathname);
    if (!dashboard || settings.componentOverrides?.profile === false) {
      this._stopBanner(); return;
    }
    this._syncBanner();
    // React can replace the dashboard without changing the URL or <head>.
    if (!this._observer && document.body) {
      this._observer = new MutationObserver(() => {
        if (document.getElementById(this.BANNER_ID) || this._timer) return;
        this._timer = setTimeout(() => { this._timer = null; this._syncBanner(); }, 100);
      });
      this._observer.observe(document.body, { childList: true, subtree: true });
    }
  },
  _stopBanner() {
    this._observer?.disconnect(); this._observer = null;
    if (this._timer) clearTimeout(this._timer);
    this._timer = null;
    document.getElementById(this.BANNER_ID)?.remove();
  },
  remove() {
    this._state = null;
    this._skin = null;
    this._stopBanner();
    document.getElementById(this.STYLE_ID)?.remove();
  },
  _syncBanner() {
    if (!this._state) return;
    const { theme, settings } = this._state;
    // Do not add a banner to GitHub's signed-out marketing page or repository files.
    const target = document.querySelector("body.logged-in main, main#dashboard, #dashboard main, [data-testid='dashboard']");
    if (!target) return;
    let host = document.getElementById(this.BANNER_ID);
    if (!host) {
      host = document.createElement("div"); host.id = this.BANNER_ID;
      host.setAttribute("aria-hidden", "true"); host.inert = true;
      host.style.cssText = "display:block!important;position:relative!important;width:100%!important;min-width:0!important;margin:0 0 24px!important;pointer-events:none!important;";
      host.attachShadow({ mode: "open" });
      const heading = target.querySelector(":scope > h1");
      if (heading) heading.after(host); else target.prepend(host);
    }
    const motion = settings.animationsEnabled && !document.hidden && !matchMedia("(prefers-reduced-motion:reduce)").matches;
    const signature = `${theme.id}:${motion}`;
    if (host.dataset.signature === signature) return;
    host.dataset.signature = signature;
    host.dataset.motion = String(motion);
    // Pause/resume existing artwork without rebuilding its SVG tree.
    if (host.dataset.theme === theme.id) return;
    host.dataset.theme = theme.id;
    const c = theme.colors;
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing:border-box;pointer-events:none; }
      .banner { height:190px;position:relative;overflow:hidden;border:1px solid ${c.accent}55;border-radius:14px;background:${c.background};isolation:isolate; }
      .art { position:absolute;right:-1%;inset-block:0;width:55%;mask-image:linear-gradient(90deg,transparent,#000 25%); }
      .art svg { width:auto;height:100%;display:block;position:absolute;right:0;top:0; }
      .light { position:absolute;inset:0;background:radial-gradient(ellipse at 4% 100%,${c.accent}24,transparent 65%); }
      .sparks { position:absolute;inset:0 0 0 50%;overflow:hidden; }
      .sparks i { position:absolute;left:var(--x);bottom:-15px;width:3px;height:3px;border-radius:50%;background:${c.accentSecondary};opacity:0;box-shadow:0 0 8px ${c.accentSecondary}88; }
      .sparks i:nth-child(2n) { background:${c.accent}; }
      .copy { position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:26px 30px;max-width:65%;font-family:system-ui,sans-serif; }
      .eyebrow { font-size:9px;font-weight:650;letter-spacing:.2em;color:${c.accent}; }
      .name { font-size:clamp(24px,2.7vw,40px);font-weight:800;letter-spacing:-.045em;line-height:1.1;color:${c.textPrimary};margin:12px 0 10px; }
      .tagline { font-size:12px;color:${c.textSecondary};line-height:1.5; }
      .rule { width:40px;height:3px;margin-top:16px;border-radius:4px;background:linear-gradient(90deg,${c.accent},${c.accentSecondary}); }
      @media(max-width:700px) { .banner{height:160px}.copy{padding:20px;max-width:70%}.name{font-size:26px}.tagline{font-size:11px}.art{width:58%;right:-9%;opacity:.7}.eyebrow{font-size:8px}.rule{margin-top:12px} }
      ${VELNAR.SceneArt.motionCss + `
        .sparks i { animation:vn-banner-spark var(--duration) linear var(--delay) infinite; }
        @keyframes vn-banner-spark { 0%{transform:translate(-15px,0);opacity:0}15%,75%{opacity:.5}100%{transform:translate(25px,-220px);opacity:0} }
        ${theme.id === "spider-man" ? ".sparks i {width:1px;height:20px;border-radius:0;animation-direction:reverse;}" : ""}
        ${theme.id === "iron-man" ? ".sparks i {width:9px;height:1px;border-radius:0;}" : ""}
        ${theme.id === "red-dead" ? ".sparks i {width:10px;height:1px;box-shadow:none;}" : ""}
        ${theme.id === "rick-and-morty" ? ".art .vn-orbit {animation-duration:12s;} .sparks i {width:5px;height:5px;background:transparent;border:1px solid #b2f45d;}" : ""}
      `}
      :host([data-motion="false"]) * { animation:none!important; }
    `;
    const banner = document.createElement("div"); banner.className = "banner";
    const art = document.createElement("div"); art.className = "art";
    art.innerHTML = VELNAR.SceneArt.svg(theme.id);
    const light = document.createElement("div"); light.className = "light";
    const sparks = document.createElement("div"); sparks.className = "sparks";
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement("i");
      spark.style.cssText = `--x:${(i * 37 + 13) % 100}%;--duration:${6 + i % 4}s;--delay:-${i * 1.3}s;`;
      sparks.append(spark);
    }
    const copy = document.createElement("div"); copy.className = "copy";
    for (const [className, text] of [["eyebrow", "VELNAR / CINEMATIC COLLECTION"], ["name", theme.name], ["tagline", theme.tagline], ["rule", ""]]) {
      const line = document.createElement("span"); line.className = className; line.textContent = text; copy.append(line);
    }
    banner.append(art, light, sparks, copy); host.shadowRoot.replaceChildren(style, banner);
  },
  skinCss(theme, overrides) {
    const c = theme.colors, on = id => overrides[id] !== false;
    const surfaces = {
      "spider-man": {
        canvas: `repeating-linear-gradient(32deg,transparent 0 90px,${c.accentSecondary}08 91px 92px,transparent 93px 180px),radial-gradient(ellipse at 100% 0%,${c.accent}18,transparent 60%)`,
        header: `repeating-linear-gradient(32deg,transparent 0 42px,${c.accentSecondary}24 43px 44px,transparent 45px 88px),linear-gradient(100deg,${c.navbarBackground},#45142688,${c.navbarBackground})`,
        edge: c.accent
      },
      "the-last-of-us": {
        canvas: `radial-gradient(ellipse at 0% 0%,#51784c20,transparent 55%),radial-gradient(ellipse at 100% 65%,#cba56c10,transparent 55%)`,
        header: `radial-gradient(ellipse at 20% 100%,#9aac6945,transparent 70%),linear-gradient(110deg,${c.navbarBackground},#2e352444)`,
        edge: "#90ad69"
      },
      "red-dead": {
        canvas: `radial-gradient(ellipse at 90% 0%,#db46302b,transparent 62%),repeating-linear-gradient(0deg,transparent 0 5px,#f1b45d03 6px 7px)`,
        header: "linear-gradient(100deg,#310e0d,#7b231b88 60%,#310e0d)", edge: "#df6544"
      },
      "rick-and-morty": {
        canvas: "radial-gradient(ellipse at 90% 5%,#b2f45d18,transparent 60%),radial-gradient(ellipse at 5% 60%,#58dfe812,transparent 55%)",
        header: "repeating-radial-gradient(ellipse at 90% 50%,transparent 0 18px,#b2f45d25 20px 22px,transparent 24px 44px)", edge: c.accent
      },
      "iron-man": {
        canvas: "linear-gradient(#6de5ff06 1px,transparent 1px),linear-gradient(90deg,#6de5ff06 1px,transparent 1px),radial-gradient(ellipse at 100% 0%,#6de5ff18,transparent 65%)",
        header: "repeating-linear-gradient(90deg,transparent 0 54px,#6de5ff22 55px 56px),linear-gradient(100deg,#270e17,#17404a88,#270e17)", edge: c.accentSecondary
      }
    };
    const t = surfaces[theme.scene] || VELNAR.CollectionArt?.skin(theme);
    if (!t) return "";
    const motif = `url("data:image/svg+xml,${encodeURIComponent(VELNAR.SceneArt.motif(theme.id).replace('<svg ', `<svg style="color:${t.edge}" `))}")`;
    let css = "";
    if (on("profile")) css += `
      body { min-height:100vh;background-image:${t.canvas}!important;background-attachment:scroll!important;${theme.id === "iron-man" ? "background-size:64px 64px,64px 64px,auto!important;" : ""} }
      .application-main,.Layout-main,main,main.color-bg-inset,[role="main"] { background-color:transparent!important;background-image:none!important; }
      main h1 { color:${c.textPrimary};text-shadow:0 2px 22px ${c.accent}18; }
    `;
    if (on("navbar")) css += `
      header.AppHeader,.AppHeader,.AppHeader-globalBar,.Header,body>header { background-image:${t.header}!important;border-bottom-color:${t.edge}66!important;box-shadow:0 3px 22px ${t.edge}0d!important; }
    `;
    if (on("repoCards")) css += `
      .Box,.border.rounded-2,.border.rounded-3,[data-testid="feed-item"],[data-testid="feed-card"] {
        background-image:linear-gradient(145deg,${c.accentSecondary}08,transparent 65%)!important;
        border-color:color-mix(in srgb,${t.edge} 24%,var(--gs-border))!important;
        box-shadow:0 8px 24px var(--gs-shadow-effective),inset 0 1px ${c.accentSecondary}0d!important;
      }
      .Box:hover,.border.rounded-2:hover,.border.rounded-3:hover { border-color:color-mix(in srgb,${t.edge} 55%,var(--gs-border))!important; }
    `;
    if (on("sidebar")) css += `
      .Layout-sidebar,.dashboard-sidebar,.feed-left-sidebar,.feed-right-sidebar { background-image:linear-gradient(${c.sidebarBackground}ed,${c.sidebarBackground}ed),${motif}!important;background-position:center,bottom center!important;background-size:auto,280px!important;background-repeat:no-repeat!important;border-color:${t.edge}26!important; }
      .Layout-sidebar .h-card,.Layout-sidebar .vcard-names,.Layout-sidebar .user-profile-bio { background-color:transparent!important;background-image:none!important; }
      .Layout-sidebar:has(.h-card),.Layout-sidebar:has(.js-profile-editable-area) { background-color:transparent!important;background-image:none!important; }
    `;
    return css;
  }
};
