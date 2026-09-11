// masuliyate in file: sakhtane style tag ha va zadane ru sahfe
// hich vaght az eval ya innerHTML ba data khatarnak estefade nemikonim
globalThis.VELNAR = globalThis.VELNAR || {};

VELNAR.Injector = {
  _getOrCreateTag(id) {
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      (document.head || document.documentElement).appendChild(tag);
    }
    return tag;
  },

  // css variable haye theme ro ru :root minevisim
  applyThemeVars(colors, layout) {
    const tag = this._getOrCreateTag(VELNAR.STYLE_TAG_ID);
    let css = ":root {\n";
    for (const key in VELNAR.CSS_VAR_MAP) {
      const value = colors[key];
      if (value) css += `  ${VELNAR.CSS_VAR_MAP[key]}: ${value};\n`;
    }
    // baraye jelve haye animation (glow/gradient) be rgb khaam ham niaz darim, na faghat hex
    if (colors.accent && typeof gsHexToRgb === "function") {
      const rgb = gsHexToRgb(colors.accent);
      css += `  --gs-accent-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
    }
    if (colors.accentSecondary && typeof gsHexToRgb === "function") {
      const rgb2 = gsHexToRgb(colors.accentSecondary);
      css += `  --gs-accent2-rgb: ${rgb2.r}, ${rgb2.g}, ${rgb2.b};\n`;
    }
    if (layout) {
      css += `  --gs-radius: ${layout.borderRadius ?? 8}px;\n`;
      css += `  --gs-shadow-opacity: ${(layout.shadowIntensity ?? 30) / 100};\n`;
      css += `  --gs-shadow-effective: color-mix(in srgb, var(--gs-shadow) ${layout.shadowIntensity ?? 30}%, transparent);\n`;
    }
    css += "}\n\n";
    css += this._primerCss();
    css += this._baseCss();
    if (tag.textContent !== css) tag.textContent = css;
  },

  // Primer React uses semantic tokens even when its generated class names change.
  // Include nested ThemeProviders: declarations on :root alone do not override them.
  // Token reference: https://primer.style/product/primitives/color/
  _primerDeclarations(tokens) {
    return `:root, [data-color-mode], [data-color-scheme], [data-light-theme], [data-dark-theme] {\n${Object.entries(tokens).map(([name, value]) => `  --${name}: ${value} !important;`).join("\n")}\n}\n`;
  },

  _primerCss() {
    const tokens = {};
    const map = (names, value) => names.split(" ").forEach(name => { tokens[name] = value; });
    map("bgColor-default bgColor-inset color-canvas-default color-canvas-inset", "var(--gs-bg)");
    map("bgColor-muted color-canvas-subtle", "var(--gs-bg-secondary)");
    map("bgColor-neutral-muted bgColor-disabled color-neutral-muted", "var(--gs-bg-tertiary)");
    map("fgColor-default color-fg-default", "var(--gs-text-primary)");
    map("fgColor-muted fgColor-neutral color-fg-muted", "var(--gs-text-secondary)");
    map("fgColor-disabled color-fg-subtle color-primer-fg-disabled", "var(--gs-text-tertiary)");
    map("fgColor-link fgColor-accent color-accent-fg", "var(--gs-link)");
    map("borderColor-default color-border-default", "var(--gs-border)");
    map("borderColor-muted borderColor-neutral-muted color-border-muted color-border-subtle", "var(--gs-border-muted)");
    map("borderColor-emphasis borderColor-neutral-emphasis color-neutral-emphasis", "var(--gs-scrollbar-thumb)");
    map("borderColor-accent-emphasis focus-outlineColor color-accent-emphasis", "var(--gs-accent)");
    map("bgColor-accent-muted color-accent-subtle", "color-mix(in srgb, var(--gs-accent) 14%, var(--gs-bg))");
    // Preserve semantic status/diff colors, transparent surfaces and scrim tokens.
    return this._primerDeclarations(tokens);
  },

  // rule haii ke hamishe active hastan, mostaghel az inke kodum component roshane
  _baseCss() {
    return `
html, body { background-color: var(--gs-bg) !important; color: var(--gs-text-primary) !important; }
.color-bg-default, .color-bg-inset, .bgColor-default, .bgColor-inset {
  background-color: var(--gs-bg) !important;
}
.color-bg-subtle, .bgColor-muted { background-color: var(--gs-bg-secondary) !important; }
.color-bg-emphasis, .bgColor-emphasis { background-color: var(--gs-text-primary) !important; color: var(--gs-bg) !important; }
a { color: var(--gs-link); }
a:hover { color: var(--gs-link-hover); }
::selection { background: var(--gs-accent); color: var(--gs-button-text); }
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-thumb { background: var(--gs-scrollbar-thumb) !important; border-radius: 8px; }
::-webkit-scrollbar-track { background: var(--gs-bg-secondary) !important; }
.color-fg-default { color: var(--gs-text-primary); }
.color-fg-muted, .text-small.color-fg-muted { color: var(--gs-text-secondary) !important; }
.color-fg-subtle { color: var(--gs-text-tertiary) !important; }
.color-fg-success, .octicon-check.color-fg-success { color: var(--gs-success) !important; }
.color-fg-attention { color: var(--gs-warning) !important; }
.color-fg-danger { color: var(--gs-error) !important; }
.color-border-default, .color-border-muted, hr { border-color: var(--gs-border) !important; }
/* IMPORTANT - in rule hamishe fa'ale, hata age user component "Dropdowns & Menus"
   ro khamush kone: hich backdrop/scrim e safheh nabayad opaque beshe. In daghigh oon
   bug e "cover kardane safhe" bud (vaghti ye rule e digar ehtemalan .Overlay ro be
   taur e kolli opaque mikard) - pas in safety net mostaghel az hameye component ha
   hamishe active mimune */
dialog::backdrop,
.Overlay-backdrop,
[class*="Backdrop" i],
[data-backdrop],
.modal-backdrop {
  background-color: transparent !important;
  backdrop-filter: none !important;
}
`;
  },

  // in ja har bakhsh (component) ye block e joda CSS daare
  // selector ha az tarkib class, data-attribute va aria estefade mikonan
  // ta hardche mishe be class haye shekananda vabaste nabashim
  _componentBlocks() {
    return {
      navbar: `
.AppHeader, div[data-testid="global-navigation"], .Header, .AppHeader-globalBar, .AppHeader-context {
  background-color: var(--gs-navbar-bg) !important;
  color: var(--gs-navbar-text) !important;
  border-color: var(--gs-border) !important;
}
header.AppHeader a, .AppHeader-context a, .Header a { color: var(--gs-navbar-text) !important; }

/* icon-only buttons + search inside the header should stay subtle, never a solid accent block.
   in az .Button/[class*=ButtonBase] tarafe kolliye buttons block "ezafe" nemikone
   chun in selector ha (header ...) specificity balatari daran va ru hamun override mishan */
header.AppHeader .Button, header.AppHeader .btn, header.AppHeader button,
.AppHeader-globalBar .Button, .AppHeader-actions .Button, .AppHeader-actions button,
.AppHeader-search, .AppHeader-search .Button, .AppHeader-search button {
  background-color: var(--gs-bg-secondary) !important;
  border: 1px solid var(--gs-border) !important;
  color: var(--gs-navbar-text) !important;
  box-shadow: none !important;
}
header.AppHeader .Button:hover, .AppHeader-globalBar .Button:hover,
.AppHeader-actions .Button:hover, .AppHeader-search:hover {
  background-color: var(--gs-hover-bg) !important;
  border-color: var(--gs-accent) !important;
}
/* avatar dropdown trigger nabayad box beshe */
header.AppHeader summary, .AppHeader-actions summary {
  background-color: transparent !important;
  border-color: transparent !important;
}`,

      sidebar: `
.Layout-sidebar, .BorderGrid, aside[aria-label], .repository-content .Layout-sidebar,
.dashboard-sidebar, .feed-left-sidebar, .feed-right-sidebar {
  background-color: var(--gs-sidebar-bg) !important;
  border-color: var(--gs-border) !important;
}`,

      repoCards: `
.Box, .Box-row, [data-testid="results-list"] > div, .col-12.d-flex.flex-justify-between, .source-list {
  background-color: var(--gs-repo-bg) !important;
  border-color: var(--gs-border) !important;
  border-radius: var(--gs-radius) !important;
}
.Box:hover, .Box-row:hover { background-color: var(--gs-hover-bg) !important; }`,

      buttons: `
/* halate defaulte dokme ha: sobresh be surface theme, na ye block tokh rangi.
   faghat dokme haye "primary" (asli/submit) rang e accent solid migiran, in shabihe
   tarahi haye vaghei hast: rang faghat baraye action asli estefade beshe */
.btn, .Button, [class*="ButtonBase"] {
  background-color: var(--gs-bg-tertiary) !important;
  color: var(--gs-text-primary) !important;
  border: 1px solid var(--gs-border) !important;
  border-radius: var(--gs-radius) !important;
  box-shadow: none;
}
.btn:hover, .Button:hover { background-color: var(--gs-hover-bg) !important; border-color: var(--gs-accent) !important; }
.btn:active, .Button:active { background-color: var(--gs-active-bg) !important; }

.btn-primary, .Button--primary, [data-variant="primary"] {
  background-color: var(--gs-button) !important;
  color: var(--gs-button-text) !important;
  border-color: transparent !important;
  box-shadow: 0 2px 8px var(--gs-shadow-effective, var(--gs-shadow));
}
.btn-primary:hover, .Button--primary:hover, [data-variant="primary"]:hover {
  background-color: var(--gs-button-hover) !important;
}

.btn-danger, .Button--danger, [data-variant="danger"] {
  background-color: var(--gs-error) !important;
  color: #ffffff !important;
  border-color: transparent !important;
}`,

      inputs: `
input, textarea, select, .FormControl-input, .form-control {
  background-color: var(--gs-bg-secondary) !important;
  color: var(--gs-text-primary) !important;
  border-color: var(--gs-border) !important;
  border-radius: var(--gs-radius) !important;
}
input:focus, textarea:focus, select:focus { border-color: var(--gs-accent) !important; }`,

      searchBox: `
.header-search-input, .search-input, [data-testid="search-input"], .AppHeader-search input {
  background-color: var(--gs-bg-secondary) !important;
  color: var(--gs-text-primary) !important;
  border-color: var(--gs-border) !important;
  border-radius: var(--gs-radius) !important;
}`,

      codeBlocks: `
pre, code, .highlight, .blob-code, .blob-code-inner, .react-code-text, .CodeMirror {
  background-color: var(--gs-code-bg) !important;
  color: var(--gs-code-text) !important;
}
.blob-num { background-color: var(--gs-bg-secondary) !important; color: var(--gs-text-tertiary) !important; }`,

      markdown: `
.markdown-body, .comment-body, article.markdown-body {
  background-color: var(--gs-bg) !important;
  color: var(--gs-text-primary) !important;
}
.markdown-body pre, .markdown-body code { background-color: var(--gs-code-bg) !important; }
.markdown-body blockquote { border-color: var(--gs-border) !important; color: var(--gs-text-secondary) !important; }
.markdown-body table tr { background-color: var(--gs-bg) !important; border-color: var(--gs-border) !important; }
.markdown-body table tr:nth-child(2n) { background-color: var(--gs-bg-secondary) !important; }`,

      issues: `
.js-issue-row, .Box-row.js-navigation-item, [data-testid="issue-pr-title"], .TimelineItem {
  background-color: var(--gs-bg) !important;
  border-color: var(--gs-border) !important;
}
.Label, .IssueLabel { border-color: var(--gs-border) !important; }
.State { border-radius: var(--gs-radius) !important; }`,

      pullRequests: `
.pr-toolbar, .diffbar, .file-header, .merge-status-list, .merge-status-item {
  background-color: var(--gs-bg-secondary) !important;
  border-color: var(--gs-border) !important;
}
.merge-status-icon .octicon-check { color: var(--gs-success) !important; }`,

      profile: `
.vcard-names, .h-card, .user-profile-nav, .UnderlineNav {
  background-color: var(--gs-bg) !important;
  border-color: var(--gs-border) !important;
}
.avatar, img.avatar { border-color: var(--gs-border) !important; border-radius: var(--gs-radius) !important; }`,

      followers: `
.follow-list, .follow-list-item, [data-testid="followers-list"] {
  background-color: var(--gs-bg-secondary) !important;
  border-color: var(--gs-border) !important;
  border-radius: var(--gs-radius) !important;
}`,

      notifications: `
.notifications-list, .notification-list-item, [data-testid="notifications-list"] {
  background-color: var(--gs-bg-secondary) !important;
  border-color: var(--gs-border) !important;
}
.notification-list-item:hover { background-color: var(--gs-hover-bg) !important; }`,

      commitList: `
.commit, .Box-row[id^="commit"], .TimelineItem-body {
  background-color: var(--gs-repo-bg) !important;
  border-color: var(--gs-border) !important;
}
.commit:hover { background-color: var(--gs-hover-bg) !important; }`,

      fileExplorer: `
.js-tree-browser-result, [role="tree"], [role="treeitem"], .react-directory-filename-column {
  background-color: var(--gs-repo-bg) !important;
  color: var(--gs-text-primary) !important;
}
[role="treeitem"]:hover, [role="treeitem"][aria-selected="true"] { background-color: var(--gs-hover-bg) !important; }`,

      dropdowns: `
.dropdown-menu, .SelectMenu-modal, [role="menu"], [role="listbox"], [role="dialog"], .tooltipped::after {
  background-color: var(--gs-dropdown-bg) !important;
  border-color: var(--gs-border) !important;
  border-radius: var(--gs-radius) !important;
  box-shadow: 0 8px 24px var(--gs-shadow-effective, var(--gs-shadow)) !important;
}
.tooltipped::after { background-color: var(--gs-tooltip-bg) !important; }
[role="menuitem"]:hover, .SelectMenu-item:hover { background-color: var(--gs-hover-bg) !important; }
/* IMPORTANT: ".Overlay" ru GitHub ham baraye panel e dialog ham gahi baraye
   khode backdrop/scrim e poshte safhe estefade mishe, va chun DOM e daghigh e
   GitHub dar dastres nist, amdan az style dadan be khode ".Overlay" khodداری
   mikonim va faghat sub-part haye shenakhte shode (body/header/footer) ro
   rang mikonim - in daghigh oon bug e "cover kardane safhe" bud ke ghablan
   ba style dadan be ".Overlay" be taur e kolli ijad shode bud. Safety net e
   asli (transparent kardane backdrop) dar _baseCss() hast va hamishe active-e */
.Overlay-body, .Overlay-header, .Overlay-footer {
  background-color: var(--gs-dropdown-bg) !important;
  border-color: var(--gs-border) !important;
}`,

      diffs: `
.diff-table, .blob-code-addition, .blob-code-deletion, .file-diff-split {
  border-color: var(--gs-border) !important;
}
.blob-code-addition { background-color: color-mix(in srgb, var(--gs-success) 15%, var(--gs-code-bg)) !important; }
.blob-code-deletion { background-color: color-mix(in srgb, var(--gs-error) 15%, var(--gs-code-bg)) !important; }`,

      contributionGraph: `
/* nemudare contribution ro az sabze sabete GitHub be rang e accent e theme tabdil mikonim
   ta vaghean ba baghiye safhe hamrang bashe, na ye jazire sabz vasate ye theme mokhtalef */
.js-calendar-graph-table [data-level="0"], rect.ContributionCalendar-day[data-level="0"] {
  fill: var(--gs-bg-secondary) !important;
  background-color: var(--gs-bg-secondary) !important;
  stroke: var(--gs-border) !important;
}
.js-calendar-graph-table [data-level="1"], rect.ContributionCalendar-day[data-level="1"] {
  fill: rgba(var(--gs-accent-rgb), 0.28) !important;
  background-color: rgba(var(--gs-accent-rgb), 0.28) !important;
}
.js-calendar-graph-table [data-level="2"], rect.ContributionCalendar-day[data-level="2"] {
  fill: rgba(var(--gs-accent-rgb), 0.5) !important;
  background-color: rgba(var(--gs-accent-rgb), 0.5) !important;
}
.js-calendar-graph-table [data-level="3"], rect.ContributionCalendar-day[data-level="3"] {
  fill: rgba(var(--gs-accent-rgb), 0.75) !important;
  background-color: rgba(var(--gs-accent-rgb), 0.75) !important;
}
.js-calendar-graph-table [data-level="4"], rect.ContributionCalendar-day[data-level="4"] {
  fill: var(--gs-accent) !important;
  background-color: var(--gs-accent) !important;
}
.js-calendar-graph, .js-calendar-graph-table { background-color: var(--gs-bg) !important; }
.js-calendar-graph-table th, .js-calendar-graph text { fill: var(--gs-text-secondary) !important; color: var(--gs-text-secondary) !important; }`
    };
  },

  // har haftaye graph ye sotoone jodast (td dar hamun position tuye har ye row).
  // pas nth-child e td dar tr, dorost mostaghim ru "haftaye chandom" map mishe -
  // hamin ro baraye stagger delay (mouje az chap be rast) estefade mikonim
  _contributionStaggerCss() {
    let css = "";
    for (let week = 1; week <= 58; week++) {
      css += `.js-calendar-graph-table tr td:nth-child(${week}) { --velnar-stagger: ${week * 14}ms; }\n`;
    }
    return css;
  },

  _componentTokens() {
    const tokens = { navbar: {}, buttons: {}, inputs: {}, dropdowns: {} };
    const map = (component, names, value) => names.split(" ").forEach(name => { tokens[component][name] = value; });
    map("navbar", "header-bgColor color-header-bg", "var(--gs-navbar-bg)");
    map("navbar", "header-fgColor-default header-fgColor-logo color-header-text color-header-logo", "var(--gs-navbar-text)");
    map("navbar", "header-borderColor-divider", "var(--gs-border)");
    map("buttons", "button-default-bgColor-rest color-btn-bg", "var(--gs-bg-tertiary)");
    map("buttons", "button-default-bgColor-hover color-btn-hover-bg button-invisible-bgColor-hover button-outline-bgColor-rest", "var(--gs-hover-bg)");
    map("buttons", "button-default-bgColor-active button-default-bgColor-selected color-btn-active-bg color-btn-selected-bg button-invisible-bgColor-active", "var(--gs-active-bg)");
    map("buttons", "button-default-fgColor-rest button-invisible-fgColor-rest button-invisible-fgColor-hover button-invisible-fgColor-active color-btn-text", "var(--gs-text-primary)");
    map("buttons", "button-default-borderColor-rest button-default-borderColor-hover button-default-borderColor-active color-btn-border color-btn-hover-border", "var(--gs-border)");
    map("buttons", "button-default-bgColor-disabled button-primary-bgColor-disabled", "var(--gs-bg-tertiary)");
    map("buttons", "button-default-fgColor-disabled button-primary-fgColor-disabled button-invisible-fgColor-disabled", "var(--gs-text-tertiary)");
    map("buttons", "button-invisible-iconColor-rest button-invisible-iconColor-hover", "var(--gs-text-secondary)");
    map("buttons", "button-primary-bgColor-rest color-btn-primary-bg", "var(--gs-button)");
    map("buttons", "button-primary-bgColor-hover button-primary-bgColor-active color-btn-primary-hover-bg color-btn-primary-selected-bg", "var(--gs-button-hover)");
    map("buttons", "button-primary-fgColor-rest button-primary-iconColor-rest color-btn-primary-text", "var(--gs-button-text)");
    map("buttons", "button-primary-borderColor-rest button-primary-borderColor-hover button-primary-borderColor-active color-btn-primary-border", "var(--gs-button)");
    map("inputs", "control-bgColor-rest control-bgColor-selected color-input-bg", "var(--gs-bg-secondary)");
    map("inputs", "control-bgColor-hover control-transparent-bgColor-hover", "var(--gs-hover-bg)");
    map("inputs", "control-bgColor-active control-transparent-bgColor-active control-transparent-bgColor-selected", "var(--gs-active-bg)");
    map("inputs", "control-borderColor-rest control-borderColor-selected color-input-border", "var(--gs-border)");
    map("inputs", "control-fgColor-rest", "var(--gs-text-primary)");
    map("inputs", "control-fgColor-placeholder control-iconColor-rest", "var(--gs-text-secondary)");
    map("inputs", "control-checked-bgColor-rest control-checked-bgColor-hover control-checked-bgColor-active control-checked-borderColor-rest", "var(--gs-button)");
    map("inputs", "control-checked-fgColor-rest", "var(--gs-button-text)");
    map("dropdowns", "overlay-bgColor color-canvas-overlay", "var(--gs-dropdown-bg)");
    map("dropdowns", "overlay-borderColor", "var(--gs-border)");
    return tokens;
  },

  applyComponents(overrides) {
    const tag = this._getOrCreateTag(VELNAR.COMPONENTS_TAG_ID);
    const blocks = this._componentBlocks();
    const componentTokens = this._componentTokens();
    let css = "";
    VELNAR.COMPONENTS.forEach((c) => {
      if (!overrides || overrides[c.id] !== false) {
        const tokens = componentTokens[c.id];
        if (tokens) css += this._primerDeclarations(tokens);
        css += blocks[c.id] || "";
        css += "\n";
      }
    });
    if (tag.textContent !== css) tag.textContent = css;
  },

  // "tem motaharek" - vaghti roshan bashe, gradient e navbar mikeshe, dokme haye primary
  // pulse mikonan va hover ha smooth transition migiran. hameye in ha ba rgba mostaghim
  // az --gs-accent-rgb sakhte mishan, pas be color-mix() niazi nist (sazgari bishtar)
  // rgbCycle: faghat theme haye "Gaming" in ro true midan - dokme haye primary va
  // glow e contribution graph ye hue-rotate e dayemi migiran (jelveye RGB gaming vaghei)
  applyAnimations(enabled, overrides, rgbCycle) {
    const tag = this._getOrCreateTag(VELNAR.ANIMATIONS_TAG_ID);
    if (!enabled) {
      tag.textContent = "";
      return;
    }
    const on = id => !overrides || overrides[id] !== false;
    let css = `@keyframes velnar-pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--gs-accent-rgb), 0.35); }
  50% { box-shadow: 0 0 16px 3px rgba(var(--gs-accent2-rgb), 0.45); }
}
@keyframes velnar-gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@keyframes velnar-rgb-hue { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
@media (prefers-reduced-motion: no-preference) {
`;
    if (on("navbar")) css += `
header.AppHeader, .AppHeader-globalBar {
  background-image: linear-gradient(120deg, var(--gs-navbar-bg), rgba(var(--gs-accent-rgb), .12), rgba(var(--gs-accent2-rgb), .12), var(--gs-navbar-bg)) !important;
  background-size: 280% 280% !important;
  animation: velnar-gradient-shift 16s ease-in-out infinite !important;
}`;
    if (on("buttons")) css += `
.btn, .Button { transition: background-color .18s ease, box-shadow .2s ease; }
.btn-primary, .Button--primary, [data-variant="primary"] { animation: velnar-pulse-glow 2.6s ease-in-out infinite; }
`;
    if (on("repoCards")) css += `.Box, .Box-row { transition: background-color .18s ease; }`;
    // RGB cycling belongs to the graph. Keeping buttons stable preserves text contrast.
    css += "}\n";

    if (!overrides || overrides.contributionGraph !== false) {
      css += this._contributionStaggerCss();
      css += `
@keyframes velnar-cell-in {
  from { opacity: 0; transform: scale(0.3); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes velnar-cell-breathe {
  0%, 82%, 100% { filter: brightness(1) saturate(1); }
  91% { filter: brightness(1.45) saturate(1.3); }
}
@keyframes velnar-cell-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(var(--gs-accent-rgb), 0); }
  50% { box-shadow: 0 0 8px 2px rgba(var(--gs-accent2-rgb), 0.7); }
}
@keyframes velnar-shimmer-sweep {
  0% { transform: translateX(-140%) skewX(-12deg); }
  100% { transform: translateX(240%) skewX(-12deg); }
}

/* prefers-reduced-motion: no-preference yani "user explicitly motion ro khamush nakarde" -
   in ye estandarde accessibility hast, ye extension e vaghean herfei bayad rعایesh kone */
@media (prefers-reduced-motion: no-preference) {
  .js-calendar-graph-table td.ContributionCalendar-day,
  rect.ContributionCalendar-day {
    animation:
      velnar-cell-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both,
      velnar-cell-breathe 6s ease-in-out infinite;
    animation-delay: var(--velnar-stagger, 0ms), var(--velnar-stagger, 0ms);
    transition: transform 0.15s ease, box-shadow 0.2s ease;
    transform-origin: center;
  }
  .js-calendar-graph-table td.ContributionCalendar-day[data-level="3"],
  .js-calendar-graph-table td.ContributionCalendar-day[data-level="4"],
  rect.ContributionCalendar-day[data-level="3"],
  rect.ContributionCalendar-day[data-level="4"] {
    animation: ${rgbCycle
      ? "velnar-cell-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both, velnar-cell-breathe 6s ease-in-out infinite, velnar-cell-glow 3.2s ease-in-out infinite, velnar-rgb-hue 4s linear infinite"
      : "velnar-cell-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both, velnar-cell-breathe 6s ease-in-out infinite, velnar-cell-glow 3.2s ease-in-out infinite"};
    animation-delay: ${rgbCycle
      ? "var(--velnar-stagger, 0ms), var(--velnar-stagger, 0ms), calc(var(--velnar-stagger, 0ms) + 500ms), 0ms"
      : "var(--velnar-stagger, 0ms), var(--velnar-stagger, 0ms), calc(var(--velnar-stagger, 0ms) + 500ms)"};
  }
  .js-calendar-graph-table td.ContributionCalendar-day:hover,
  rect.ContributionCalendar-day:hover {
    transform: scale(1.5) !important;
    box-shadow: 0 0 10px 2px rgba(var(--gs-accent2-rgb), 0.7) !important;
    position: relative;
    z-index: 5;
  }
  .js-calendar-graph {
    position: relative;
    overflow: hidden;
  }
  .js-calendar-graph::after {
    content: "";
    position: absolute;
    top: -60%;
    left: -30%;
    width: 30%;
    height: 220%;
    background: linear-gradient(100deg,
      transparent,
      rgba(var(--gs-accent-rgb), 0.16),
      rgba(var(--gs-accent2-rgb), 0.16),
      transparent);
    animation: velnar-shimmer-sweep 8s ease-in-out infinite;
    animation-delay: 1.2s;
    pointer-events: none;
  }
}`;
    }

    if (tag.textContent !== css) tag.textContent = css;
  },


  applyTypography(typography) {
    const tag = this._getOrCreateTag(VELNAR.TYPOGRAPHY_TAG_ID);
    if (!typography) {
      tag.textContent = "";
      return;
    }
    let css = "";
    const bodyRules = [];
    if (typography.fontFamily) bodyRules.push(`font-family: ${typography.fontFamily} !important;`);
    if (typography.fontSize) bodyRules.push(`font-size: ${typography.fontSize}px !important;`);
    if (typography.lineHeight) bodyRules.push(`line-height: ${typography.lineHeight} !important;`);
    if (typography.fontWeight) bodyRules.push(`font-weight: ${typography.fontWeight} !important;`);
    if (bodyRules.length) {
      css += `body, .markdown-body, .Header, .btn { ${bodyRules.join(" ")} }\n`;
    }
    if (typography.codeFont) {
      css += `pre, code, .blob-code, .CodeMirror { font-family: ${typography.codeFont} !important; }\n`;
    }
    if (tag.textContent !== css) tag.textContent = css;
  },

  applyCustomCss(cssText, enabled) {
    const tag = this._getOrCreateTag(VELNAR.CUSTOM_CSS_TAG_ID);
    if (!enabled || !cssText) {
      tag.textContent = "";
      return;
    }
    const check = VELNAR.Validator.validateCss(cssText);
    if (!check.valid) {
      tag.textContent = "";
      return;
    }
    tag.textContent = VELNAR.Validator.sanitize(cssText);
  },

  // "Web Swinger" - ye easter egg e generic (na Spider-Man e ashkhas, chun oon copyright dare).
  // ye silhouette e ghahreman e maskdar mibinim ke faghat vaghti safheye profile hastim,
  // ba rang e accent khode theme az in var oon var e safhe sowing mikone
  applyWebSwinger(enabled, colors) {
    const isProfilePage = !!document.querySelector(
      '.js-profile-editable-area, .vcard-names, [itemtype="http://schema.org/Person"]'
    );
    const styleTag = this._getOrCreateTag(VELNAR.WEB_SWINGER_STYLE_ID);
    let el = document.getElementById(VELNAR.WEB_SWINGER_ELEMENT_ID);

    if (!enabled || !isProfilePage) {
      styleTag.textContent = "";
      if (el) el.remove();
      return;
    }

    const accent = (colors && colors.accent) || "#00c2d7";
    const accent2 = (colors && colors.accentSecondary) || accent;

    // silhouette e sade: khat e tar (web), sar, badan, dast o pa dar halate sowing
    // amdan abstract va stylized negah dashte shode, na kopi az design e khas
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 96'>` +
      `<line x1='4' y1='0' x2='26' y2='24' stroke='${accent2}' stroke-width='1.4' opacity='0.75'/>` +
      `<circle cx='27' cy='24' r='9' fill='${accent}'/>` +
      `<path d='M22 22 Q25 18 29 22 Q25 25 22 22 Z' fill='#fff' opacity='0.92'/>` +
      `<path d='M20 32 Q27 27 36 32 L34 58 Q27 63 21 58 Z' fill='${accent}'/>` +
      `<path d='M20 33 L7 12' stroke='${accent}' stroke-width='6' stroke-linecap='round'/>` +
      `<path d='M36 35 L48 50' stroke='${accent}' stroke-width='6' stroke-linecap='round'/>` +
      `<path d='M23 58 L15 82' stroke='${accent}' stroke-width='7' stroke-linecap='round'/>` +
      `<path d='M33 58 L45 76' stroke='${accent}' stroke-width='7' stroke-linecap='round'/>` +
      `</svg>`;
    const dataUri = "data:image/svg+xml," + encodeURIComponent(svg);

    if (!el) {
      el = document.createElement("div");
      el.id = VELNAR.WEB_SWINGER_ELEMENT_ID;
      document.body.appendChild(el);
    }
    el.style.backgroundImage = `url("${dataUri}")`;

    styleTag.textContent = `
#${VELNAR.WEB_SWINGER_ELEMENT_ID} {
  position: fixed;
  top: 0;
  left: -90px;
  width: 56px;
  height: 84px;
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 999999;
  opacity: 0;
}
@media (prefers-reduced-motion: no-preference) {
  #${VELNAR.WEB_SWINGER_ELEMENT_ID} {
    animation: velnar-web-swing 16s ease-in-out infinite;
  }
}
@keyframes velnar-web-swing {
  0%   { left: -90px;  top: 20vh; opacity: 0;   transform: rotate(-20deg); }
  2%   { opacity: 1; }
  10%  { left: 25vw;   top: 34vh; transform: rotate(20deg); }
  18%  { left: 50vw;   top: 12vh; transform: rotate(-24deg); }
  26%  { left: 75vw;   top: 32vh; transform: rotate(18deg); }
  33%  { left: 106vw;  top: 20vh; opacity: 1;   transform: rotate(-8deg); }
  35%  { opacity: 0; }
  100% { left: 106vw;  top: 20vh; opacity: 0; }
}`;
  },

  removeAll() {
    [VELNAR.STYLE_TAG_ID, VELNAR.CUSTOM_CSS_TAG_ID, VELNAR.TYPOGRAPHY_TAG_ID, VELNAR.COMPONENTS_TAG_ID, VELNAR.ANIMATIONS_TAG_ID, VELNAR.WEB_SWINGER_STYLE_ID].forEach((id) => {
      const tag = document.getElementById(id);
      if (tag) tag.textContent = "";
    });
    const swinger = document.getElementById(VELNAR.WEB_SWINGER_ELEMENT_ID);
    if (swinger) swinger.remove();
  }
};
