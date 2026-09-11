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
      .motif { position:absolute; width:220px; height:220px; opacity:.34; }
      .motif svg { width:100%; height:100%; }
      .motif-left { left:-82px; top:110px; }
      .motif-right { right:-70px; bottom:24px; }
      .world--spider-man .motif-left { left:0; top:68px; width:170px; opacity:.26; }
      .world--spider-man .motif-right { transform:rotate(180deg); right:0; bottom:0; width:175px; opacity:.24; }
      .world--the-last-of-us .motif-left { top:auto; bottom:0; transform:rotate(14deg); }
      .world--the-last-of-us .motif-right { transform:rotate(-12deg); }
      .world--red-dead .motif-left { top:auto; bottom:-36px; opacity:.38; }
      .world--red-dead .motif-right { opacity:.2; }
      .world--rick-and-morty .motif-left { transform:rotate(-24deg); }
      .world--iron-man .motif-right { width:210px; height:210px; opacity:.4; }
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
      @media(max-width:1100px) { .motif { width:150px;height:150px;opacity:.18!important; } .motif-left { left:-95px!important; } .motif-right { right:-100px!important; } .rail { width:24px;opacity:.5; } }
      @media(max-width:600px) { .motif { display:none; } .rail { width:12px;opacity:.3; } }
      @media(prefers-reduced-motion:reduce) { .world { display:none; } }
    `;
  },
  componentCss(scene, overrides = {}) {
    const on = id => overrides[id] !== false;
    const themes = {
      "spider-man": {
        header: "repeating-linear-gradient(32deg,transparent 0 44px,#91c8ff12 45px 46px,transparent 47px 90px),repeating-linear-gradient(-32deg,transparent 0 44px,#ff456217 45px 46px,transparent 47px 90px)",
        motion: "vn-web-scan", button: "vn-spider-charge", graph: "vn-city-signal"
      },
      "the-last-of-us": {
        header: "radial-gradient(ellipse at 25% 100%,#bcd59026,transparent 50%),radial-gradient(ellipse at 80% 0%,#d8b67918,transparent 55%)",
        motion: "vn-forest-mist", button: "vn-firefly", graph: "vn-spore-breathe"
      },
      "red-dead": {
        header: "linear-gradient(105deg,#7e211033,transparent 40%,#f1b45d26 68%,transparent)",
        motion: "vn-sunset", button: "vn-deadeye", graph: "vn-ember"
      },
      "rick-and-morty": {
        header: "repeating-radial-gradient(ellipse at 85% 50%,transparent 0 18px,#b2f45d1f 20px 22px,transparent 24px 40px)",
        motion: "vn-portal-field", button: "vn-portal-charge", graph: "vn-portal-cell"
      },
      "iron-man": {
        header: "repeating-linear-gradient(90deg,transparent 0 55px,#6de5ff15 56px 57px),linear-gradient(110deg,transparent 15%,#6de5ff18 50%,transparent 75%)",
        motion: "vn-hud-scan", button: "vn-reactor-charge", graph: "vn-reactor-cell"
      }
    };
    if (!Object.hasOwn(themes, scene)) return "";
    const t = themes[scene];
    let rules = "";
    if (on("navbar")) rules += `header.AppHeader,.AppHeader-globalBar,.Header { background-image:${t.header}!important;background-size:220% 180%!important;animation:${t.motion} 18s ease-in-out infinite!important; }`;
    if (on("buttons")) rules += `.btn-primary,.Button--primary,[data-variant="primary"] { animation:${t.button} 4.8s ease-in-out infinite!important; }`;
    if (on("contributionGraph")) rules += `.js-calendar-graph-table [data-level="3"],.js-calendar-graph-table [data-level="4"],rect.ContributionCalendar-day[data-level="4"] { animation:${t.graph} 6s ease-in-out infinite!important;animation-delay:var(--velnar-stagger,0ms)!important; }`;
    if (!rules) return "";
    return `
      @keyframes vn-web-scan { 50% { background-position:70% 40%; } }
      @keyframes vn-forest-mist { 50% { background-position:100% 80%; } }
      @keyframes vn-sunset { 50% { background-position:100% 50%; } }
      @keyframes vn-portal-field { 50% { background-position:100% 100%; } }
      @keyframes vn-hud-scan { 50% { background-position:100% 0%; } }
      @keyframes vn-spider-charge { 0%,100% { box-shadow:0 0 0 1px #ff456244,0 0 8px #ff45621a; } 50% { box-shadow:0 0 0 1px #38a9ff88,0 0 22px #38a9ff44; } }
      @keyframes vn-firefly { 0%,100% { box-shadow:0 0 5px #bbd78a18; } 50% { box-shadow:0 0 22px #dfa56755; } }
      @keyframes vn-deadeye { 0%,100% { box-shadow:0 0 0 1px #e94b3955; } 50% { box-shadow:0 0 0 3px #e94b3922,0 0 23px #e94b3944; } }
      @keyframes vn-portal-charge { 0%,100% { box-shadow:0 0 0 2px #b2f45d22,0 0 9px #b2f45d22; } 50% { box-shadow:0 0 0 4px #58dfe815,0 0 25px #b2f45d66; } }
      @keyframes vn-reactor-charge { 0%,100% { box-shadow:0 0 0 1px #6de5ff44,0 0 7px #6de5ff33; } 50% { box-shadow:0 0 0 2px #6de5ff99,0 0 26px #6de5ff55; } }
      @keyframes vn-city-signal { 50% { box-shadow:0 0 8px #38a9ff99; } }
      @keyframes vn-spore-breathe { 50% { box-shadow:0 0 7px #dfa56788; } }
      @keyframes vn-ember { 50% { box-shadow:0 0 8px #e94b39aa; } }
      @keyframes vn-portal-cell { 50% { box-shadow:0 0 10px #b2f45daa; } }
      @keyframes vn-reactor-cell { 50% { box-shadow:0 0 10px #6de5ffbb; } }
      @media(prefers-reduced-motion:no-preference) { ${rules} }
    `;
  }
};
