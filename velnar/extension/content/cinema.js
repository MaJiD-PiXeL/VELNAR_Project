globalThis.VELNAR = globalThis.VELNAR || {};

VELNAR.Cinema = {
  HOST_ID: "velnar-cinematic-scene",
  STYLE_ID: "velnar-cinematic-components",
  _state: null,
  _listening: false,
  _signature: "",
  apply(theme, settings) {
    this._state = { theme, settings };
    if (!this._listening) {
      this._listening = true;
      document.addEventListener("visibilitychange", () => this._render());
      matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => this._render());
    }
    this._render();
  },
  remove() {
    document.getElementById(this.HOST_ID)?.remove();
    document.getElementById(this.STYLE_ID)?.remove();
    this._signature = "";
  },
  _render() {
    if (!this._state) return;
    const { theme, settings } = this._state;
    VELNAR.World.apply(theme, settings);
    VELNAR.GraphScenes.apply(theme, settings);
    const overrides = settings.componentOverrides || {};
    if (!theme?.scene || !settings.enabled || !settings.animationsEnabled || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.remove(); return;
    }
    const signature = JSON.stringify([theme.id, overrides]);
    if (this._signature === signature && document.getElementById(this.STYLE_ID) && (overrides.profile === false || document.getElementById(this.HOST_ID))) return;
    this.remove();
    this._signature = signature;
    const style = document.createElement("style");
    style.id = this.STYLE_ID;
    style.textContent = this.componentCss(theme.scene, overrides);
    (document.head || document.documentElement).append(style);
    // Atmospheric decorations follow the Profile switch. Component effects have their own switches.
    if (overrides.profile === false) return;
    const host = document.createElement("div");
    host.id = this.HOST_ID;
    host.dataset.scene = theme.scene;
    host.setAttribute("aria-hidden", "true");
    host.inert = true;
    host.style.cssText = "all:initial!important;position:fixed!important;inset:0!important;pointer-events:none!important;z-index:8!important;overflow:hidden!important;contain:strict!important;";
    const shadow = host.attachShadow({ mode: "open" });
    const css = document.createElement("style");
    css.textContent = this.overlayCss(theme) + VELNAR.SceneArt.motionCss;
    const surface = document.createElement("div"); surface.className = "world world--" + theme.scene;
    const left = document.createElement("div"); left.className = "motif motif-left";
    left.innerHTML = VELNAR.SceneArt.motif(theme.scene);
    const right = document.createElement("div"); right.className = "motif motif-right";
    right.innerHTML = VELNAR.SceneArt.motif(theme.scene);
    surface.append(left, right);
    for (const side of ["left", "right"]) {
      const rail = document.createElement("div"); rail.className = "rail rail-" + side;
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("i");
        particle.style.cssText = `--x:${(i * 37 + 11) % 100}%;--delay:-${i * 1.71}s;--duration:${13 + i % 5 * 3}s;--size:${2 + i % 3}px;`;
        rail.append(particle);
      }
      surface.append(rail);
    }
    shadow.append(css, surface);
    document.documentElement.append(host);
  },
  overlayCss(theme) {
    return `
      :host,* { pointer-events:none!important; box-sizing:border-box; }
      .world { position:absolute; inset:0; overflow:hidden; color:${theme.colors.accentSecondary}; }
      .motif { position:absolute; width:220px; height:220px; opacity:.14; }
      .motif svg { width:100%; height:100%; }
      .motif-left { left:-82px; bottom:20px; }
      .motif-right { right:-70px; bottom:24px; }
      .world--spider-man .motif-left { left:0; bottom:0; width:170px; opacity:.14; }
      .world--spider-man .motif-right { transform:rotate(180deg); right:0; bottom:0; width:175px; opacity:.14; }
      .world--the-last-of-us .motif-left { top:auto; bottom:0; transform:rotate(14deg); }
      .world--the-last-of-us .motif-right { transform:rotate(-12deg); }
      .world--red-dead .motif-left { top:auto; bottom:-36px; opacity:.16; }
      .world--red-dead .motif-right { opacity:.14; }
      .world--rick-and-morty .motif-left { transform:rotate(-24deg); }
      .world--iron-man .motif-right { width:210px; height:210px; opacity:.16; }
      .rail { position:absolute; top:82px; bottom:0; width:70px; overflow:hidden; }
      .rail-left { left:0; } .rail-right { right:0; }
      .rail i { position:absolute; left:var(--x); bottom:-12px; width:var(--size); height:var(--size); border-radius:50%; background:${theme.colors.accentSecondary}; box-shadow:0 0 8px ${theme.colors.accentSecondary}; opacity:0; animation:vn-atmosphere var(--duration) linear var(--delay) infinite; }
      .rail i:nth-child(2n) { background:${theme.colors.accent}; }
      .world--spider-man .rail i { border-radius:0; width:1px; height:18px; box-shadow:none; animation-name:vn-web-tracer; }
      .world--red-dead .rail i { width:12px; height:1px; box-shadow:none; animation-name:vn-dust; }
      .world--iron-man .rail i { width:8px; height:2px; border-radius:0; }
      .world--rick-and-morty .rail i { border:1px solid #c7ff87; background:transparent; width:8px; height:8px; }
      @keyframes vn-atmosphere { 0% { transform:translate(0,0);opacity:0; } 15%,75% { opacity:.5; } 100% { transform:translate(18px,-85vh);opacity:0; } }
      @keyframes vn-web-tracer { 0% { transform:translateY(-85vh);opacity:0; } 15%,65% { opacity:.5; } 100% { transform:translateY(0);opacity:0; } }
      @keyframes vn-dust { 0% { transform:translate(-25px,-20vh);opacity:0; } 20%,70% { opacity:.35; } 100% { transform:translate(40px,-60vh);opacity:0; } }
      @media(max-width:1100px) { .motif { width:150px;height:150px;opacity:.1!important; } .motif-left { left:-95px!important; } .motif-right { right:-100px!important; } .rail { width:24px;opacity:.5; } }
      @media(max-width:600px) { .motif { display:none; } .rail { width:12px;opacity:.3; } }
      @media(prefers-reduced-motion:reduce) { .world { display:none; } }
    `;
  },
  componentCss(scene, overrides = {}) {
    if (overrides.buttons === false) return "";
    const glows = {"spider-man":"#38a9ff66","the-last-of-us":"#dfa56755","red-dead":"#e94b3966","rick-and-morty":"#b2f45d66","iron-man":"#6de5ff66"};
    const glow=glows[scene] || (VELNAR.getThemeById(scene)?.colors.accentSecondary + '66');
    if (!VELNAR.getThemeById(scene)?.scene) return "";
    return `@media(prefers-reduced-motion:no-preference) {
      .btn-primary:is(:hover,:focus-visible),.Button--primary:is(:hover,:focus-visible),[data-variant="primary"]:is(:hover,:focus-visible) { box-shadow:0 0 18px ${glow}!important; }
    }`;
  }
};
