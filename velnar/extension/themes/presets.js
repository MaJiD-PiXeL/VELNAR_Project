// list e theme haye amade. har theme faghat ye "base palette" kootah tarif mishe
// va buildTheme() hameye 28 ta css var ro azash misaze (hover/active/tertiary va ...)
// in kar baes mishe hame theme ha consistent bashan va ezafe kardane theme jadid rahat bashe
globalThis.VELNAR = globalThis.VELNAR || {};

// -------- color helpers --------
function gsHexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function gsRgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
}
// percent mosbat = roshan tar, manfi = tarik tar
function gsShade(hex, percent) {
  const { r, g, b } = gsHexToRgb(hex);
  const amt = percent / 100;
  const mix = (c) => (amt >= 0 ? c + (255 - c) * amt : c + c * amt);
  return gsRgbToHex(mix(r), mix(g), mix(b));
}
function gsLuminance(hex) {
  const { r, g, b } = gsHexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// -------- WCAG contrast (baraye buttonText: bayad daghigh ru khode rang e
// accent hesab beshe, na ru "tire/roshan boodane khode theme" - oon bug e asli
// bud: theme tire ba ye accent e roshan (masalan banafsh) hamun matn e siah e
// hamishegi ro migereft ke ehtemalan contrast e kafi nadasht ---------- --------
function gsRelLuminance(hex) {
  const { r, g, b } = gsHexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function gsContrastRatio(hex1, hex2) {
  const l1 = gsRelLuminance(hex1);
  const l2 = gsRelLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
// har do candidate (tire/roshan) ro emtehan mikone va hamuni ke behtarin
// contrast ro nesbat be background midahad barmigardune - dorost va khodkar
// baraye har rang e accent, na ye ghaede sabet (isDark) ke error dashte
function gsBestTextColor(bgHex) {
  const candidates = ["#0a0d12", "#ffffff"];
  let best = candidates[0];
  let bestRatio = -1;
  candidates.forEach((c) => {
    const ratio = gsContrastRatio(c, bgHex);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = c;
    }
  });
  return best;
}

function gsReadableColor(color, backgrounds, minimum = 4.5) {
  const original = gsHexToRgb(color);
  const target = gsHexToRgb(gsBestTextColor(backgrounds[0]));
  for (let step = 0; step <= 100; step++) {
    const amount = step / 100;
    const candidate = gsRgbToHex(original.r + (target.r - original.r) * amount, original.g + (target.g - original.g) * amount, original.b + (target.b - original.b) * amount);
    if (backgrounds.every(background => gsContrastRatio(candidate, background) >= minimum)) return candidate;
  }
  return gsBestTextColor(backgrounds[0]);
}

// base -> { bg, bgAlt, text, textMuted, accent, accent2?, success, warning, error, navbar? }
// accent2 ekhtiari hast: age tarif beshe, animation ha (gradient/glow) beyne accent va
// accent2 harekat mikonan va ye jelveye "do-rangi" ijad mishe. age tarif nashe, khodesh accent hast
function buildTheme(id, name, category, base) {
  const isDark = gsLuminance(base.bg) < 0.5;
  const dir = isDark ? 1 : -1; // baraye hover/active/border, samte roshan/tarik shodan
  const colors = {
    background: base.bg,
    backgroundSecondary: base.bgAlt,
    backgroundTertiary: gsShade(base.bgAlt, dir * 6),
    hoverBackground: gsShade(base.bgAlt, dir * 9),
    activeBackground: gsShade(base.bgAlt, dir * 14),
    textPrimary: base.text,
    textSecondary: gsReadableColor(base.textMuted, [base.bg, base.bgAlt]),
    textTertiary: gsShade(base.textMuted, -dir * 12),
    link: gsReadableColor(base.accent, [base.bg, base.bgAlt]),
    linkHover: gsReadableColor(gsShade(base.accent, 12), [base.bg, base.bgAlt]),
    button: base.accent,
    buttonText: base.buttonText || gsBestTextColor(base.accent),
    buttonHover: gsReadableColor(gsShade(base.accent, -10), [base.buttonText || gsBestTextColor(base.accent)]),
    border: gsShade(base.bgAlt, dir * 12),
    borderMuted: gsShade(base.bgAlt, dir * 5),
    codeBackground: base.bgAlt,
    codeText: base.text,
    repoBackground: base.scene ? base.bgAlt : base.bg,
    sidebarBackground: base.bg,
    navbarBackground: base.navbar || base.bgAlt,
    navbarText: base.navbarText || base.text,
    dropdownBackground: base.bgAlt,
    tooltipBackground: gsShade(base.bgAlt, -dir * 6),
    scrollbarThumb: gsShade(base.bgAlt, dir * 16),
    accent: base.accent,
    accentSecondary: base.accent2 || base.accent,
    success: base.success,
    warning: base.warning,
    error: base.error,
    shadow: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.14)"
  };
  // rgbCycle: theme haye "gaming" in ro true migozaran - ye animation e mojaza
  // (hue-rotate) dokme haye primary va glow e contribution graph ro dayeman
  // az beyne tayfe rang ubur mide, mesle RGB e sakht-afzar haye gaming
  return { id, name, category, colors, rgbCycle: !!base.rgbCycle, scene: base.scene || null, tagline: base.tagline || "" };
}

VELNAR.PRESET_THEMES = [
  buildTheme("spider-man", "Spider-Man", "cinematic", {
    bg: "#090f21", bgAlt: "#111e38", text: "#edf4ff", textMuted: "#a2b4d0",
    accent: "#ff4562", accent2: "#38a9ff", success: "#62deb5", warning: "#ffd166", error: "#ff667d", navbar: "#0c142a",
    scene: "spider-man", tagline: "Web lines. Electric nights."
  }),
  buildTheme("the-last-of-us", "The Last of Us", "cinematic", {
    bg: "#0c120f", bgAlt: "#18241c", text: "#e9eee2", textMuted: "#acbaa0",
    accent: "#bbd78a", accent2: "#dfa567", success: "#97cf95", warning: "#e6ba73", error: "#df8072", navbar: "#101b14",
    scene: "the-last-of-us", tagline: "Life finds a way through."
  }),
  buildTheme("red-dead", "Red Dead", "cinematic", {
    bg: "#190c0b", bgAlt: "#2a1712", text: "#fff0d5", textMuted: "#c9a992",
    accent: "#f1b45d", accent2: "#e94b39", success: "#b8c987", warning: "#f2c278", error: "#ff7460", navbar: "#240b0b",
    scene: "red-dead", tagline: "Ride into the last light."
  }),
  buildTheme("rick-and-morty", "Rick and Morty", "cinematic", {
    bg: "#0b1015", bgAlt: "#152526", text: "#edffe7", textMuted: "#adceaf",
    accent: "#b2f45d", accent2: "#58dfe8", success: "#98ef80", warning: "#ffe16b", error: "#ff7c95", navbar: "#102020",
    scene: "rick-and-morty", tagline: "One portal. Infinite branches."
  }),
  buildTheme("iron-man", "Iron Man", "cinematic", {
    bg: "#160d12", bgAlt: "#28191e", text: "#fff2df", textMuted: "#cbb7a7",
    accent: "#edbb67", accent2: "#6de5ff", success: "#82ddc7", warning: "#ffd176", error: "#ff7474", navbar: "#270e17",
    scene: "iron-man", tagline: "Power the next invention."
  }),
  buildTheme("dark", "Dark", "official", {
    bg: "#0d1117", bgAlt: "#161b22", text: "#e6edf3", textMuted: "#8b949e",
    accent: "#00c2d7", success: "#3fb950", warning: "#d29922", error: "#f85149", navbar: "#010409"
  }),
  buildTheme("light", "Light", "official", {
    bg: "#ffffff", bgAlt: "#f6f8fa", text: "#1f2328", textMuted: "#57606a",
    accent: "#00c2d7", success: "#1a7f37", warning: "#9a6700", error: "#cf222e"
  }),
  buildTheme("midnight", "Midnight", "official", {
    bg: "#05070d", bgAlt: "#0b0f1a", text: "#dbe4ff", textMuted: "#7d89b0",
    accent: "#5b7fff", accent2: "#39c290", success: "#39c290", warning: "#e0a53c", error: "#ff5c72", navbar: "#02040a"
  }),
  buildTheme("cyberpunk", "Cyberpunk", "official", {
    bg: "#0a0014", bgAlt: "#150025", text: "#f4e9ff", textMuted: "#c792ea",
    accent: "#ff2bd6", accent2: "#00f0ff", success: "#00ffa3", warning: "#ffd60a", error: "#ff2b54", navbar: "#050009"
  }),
  buildTheme("amoled", "AMOLED", "official", {
    bg: "#000000", bgAlt: "#0a0a0a", text: "#f2f2f2", textMuted: "#8a8a8a",
    accent: "#00c2d7", success: "#2fb350", warning: "#d0972d", error: "#e5484d"
  }),
  buildTheme("dracula", "Dracula", "official", {
    bg: "#282a36", bgAlt: "#21222c", text: "#f8f8f2", textMuted: "#a9abc9",
    accent: "#bd93f9", accent2: "#ff79c6", success: "#50fa7b", warning: "#f1fa8c", error: "#ff5555", navbar: "#1e1f29"
  }),
  buildTheme("github-classic", "GitHub Classic", "official", {
    bg: "#ffffff", bgAlt: "#f6f8fa", text: "#24292f", textMuted: "#57606a",
    accent: "#0969da", success: "#1a7f37", warning: "#9a6700", error: "#cf222e", navbar: "#24292f", navbarText: "#ffffff"
  }),
  buildTheme("nord", "Nord", "community", {
    bg: "#2e3440", bgAlt: "#3b4252", text: "#eceff4", textMuted: "#9aa5b8",
    accent: "#88c0d0", success: "#a3be8c", warning: "#ebcb8b", error: "#bf616a", navbar: "#242933"
  }),
  buildTheme("solarized-dark", "Solarized Dark", "community", {
    bg: "#002b36", bgAlt: "#073642", text: "#eee8d5", textMuted: "#93a1a1",
    accent: "#268bd2", success: "#859900", warning: "#b58900", error: "#dc322f", navbar: "#00212b"
  }),
  buildTheme("solarized-light", "Solarized Light", "community", {
    bg: "#fdf6e3", bgAlt: "#eee8d5", text: "#586e75", textMuted: "#73797e",
    accent: "#268bd2", success: "#859900", warning: "#b58900", error: "#dc322f"
  }),
  buildTheme("monokai", "Monokai", "community", {
    bg: "#272822", bgAlt: "#1e1f1c", text: "#f8f8f2", textMuted: "#a6a89a",
    accent: "#a6e22e", success: "#a6e22e", warning: "#e6db74", error: "#f92672", navbar: "#1b1c18"
  }),
  buildTheme("one-dark", "One Dark", "community", {
    bg: "#282c34", bgAlt: "#21252b", text: "#abb2bf", textMuted: "#7a8294",
    accent: "#61afef", success: "#98c379", warning: "#e5c07b", error: "#e06c75", navbar: "#21252b"
  }),
  buildTheme("gruvbox", "Gruvbox Dark", "community", {
    bg: "#282828", bgAlt: "#3c3836", text: "#ebdbb2", textMuted: "#a89984",
    accent: "#fe8019", success: "#b8bb26", warning: "#fabd2f", error: "#fb4934", navbar: "#1d2021"
  }),
  buildTheme("tokyo-night", "Tokyo Night", "community", {
    bg: "#1a1b26", bgAlt: "#24283b", text: "#c0caf5", textMuted: "#7982a9",
    accent: "#7aa2f7", accent2: "#bb9af7", success: "#9ece6a", warning: "#e0af68", error: "#f7768e", navbar: "#16161e"
  }),
  buildTheme("catppuccin", "Catppuccin Mocha", "community", {
    bg: "#1e1e2e", bgAlt: "#181825", text: "#cdd6f4", textMuted: "#a6adc8",
    accent: "#cba6f7", success: "#a6e3a1", warning: "#f9e2af", error: "#f38ba8", navbar: "#11111b"
  }),
  buildTheme("rose-pine", "Rosé Pine", "community", {
    bg: "#191724", bgAlt: "#1f1d2e", text: "#e0def4", textMuted: "#908caa",
    accent: "#c4a7e7", success: "#31748f", warning: "#f6c177", error: "#eb6f92", navbar: "#16141f"
  }),
  buildTheme("synthwave", "Synthwave '84", "community", {
    bg: "#241b2f", bgAlt: "#2a2139", text: "#f4eee4", textMuted: "#a48cb5",
    accent: "#ff7edb", accent2: "#72f1b8", success: "#72f1b8", warning: "#fede5d", error: "#fe4450", navbar: "#1a1326"
  }),

  // -------- Vivid: theme haye do-rangi ba art direction ekhtesasi, na faghat auto-shade --------
  buildTheme("aurora", "Aurora", "vivid", {
    bg: "#061a1a", bgAlt: "#0c2626", text: "#e3fffa", textMuted: "#7fb8b0",
    accent: "#00f5d4", accent2: "#b967ff", success: "#00f5d4", warning: "#ffd166", error: "#ff6b6b", navbar: "#04100f"
  }),
  buildTheme("sunset-blaze", "Sunset Blaze", "vivid", {
    bg: "#1a0e0a", bgAlt: "#2b1712", text: "#ffece3", textMuted: "#d1998a",
    accent: "#ff5e62", accent2: "#ffb347", success: "#8bc34a", warning: "#ffb347", error: "#ff3d3d", navbar: "#140a07"
  }),
  buildTheme("neon-tokyo", "Neon Tokyo", "vivid", {
    bg: "#05060f", bgAlt: "#0d1024", text: "#e6f9ff", textMuted: "#7d8bc7",
    accent: "#00fff0", accent2: "#ff00e6", success: "#00ff9d", warning: "#ffe600", error: "#ff2079", navbar: "#03040a"
  }),
  buildTheme("vaporwave", "Vaporwave", "vivid", {
    bg: "#241734", bgAlt: "#2f1f45", text: "#f6ecff", textMuted: "#b79ed6",
    accent: "#ff6ec7", accent2: "#6ef2ff", success: "#7bffcb", warning: "#ffe66d", error: "#ff5d8f", navbar: "#1a1027"
  }),
  buildTheme("emerald-forest", "Emerald Forest", "vivid", {
    bg: "#08150f", bgAlt: "#0f221a", text: "#e3fff0", textMuted: "#7fc9a3",
    accent: "#00c853", accent2: "#b2ff59", success: "#00e676", warning: "#ffca28", error: "#ff5252", navbar: "#050d09"
  }),
  buildTheme("royal-purple", "Royal Purple", "vivid", {
    bg: "#160b28", bgAlt: "#20123a", text: "#f1e9ff", textMuted: "#b09fd6",
    accent: "#8b5cf6", accent2: "#f7b733", success: "#4ade80", warning: "#f7b733", error: "#f87171", navbar: "#0f0720"
  }),
  buildTheme("blood-moon", "Blood Moon", "vivid", {
    bg: "#170707", bgAlt: "#240c0c", text: "#ffe9e9", textMuted: "#cc8c8c",
    accent: "#e63946", accent2: "#ff8c42", success: "#6a994e", warning: "#ff8c42", error: "#e63946", navbar: "#100404"
  }),
  buildTheme("arctic-ice", "Arctic Ice", "vivid", {
    bg: "#f0f8ff", bgAlt: "#e1f0fb", text: "#0b3550", textMuted: "#4a7a94",
    accent: "#0ea5e9", accent2: "#22d3ee", success: "#10b981", warning: "#f59e0b", error: "#ef4444"
  }),
  buildTheme("peach-sorbet", "Peach Sorbet", "vivid", {
    bg: "#fff5f2", bgAlt: "#ffe8e0", text: "#5c2a1e", textMuted: "#9c6b5c",
    accent: "#ff6f91", accent2: "#ffc75f", success: "#57cc99", warning: "#ffb703", error: "#e63946"
  }),

  // -------- Gaming: theme haye "motaharek" - rang e accent dayeman miche beyne tayfe
  // (hue-rotate cycling), mesle keyboard/mouse haye RGB. faghat vaghti "Animated Theme"
  // roshan bashe in cycling ejra mishe, vagarna hamun rang e sabet e accent/accent2 mimune
  buildTheme("rgb-chroma", "RGB Chroma", "gaming", {
    bg: "#050505", bgAlt: "#0d0d0d", text: "#f2f2f2", textMuted: "#9a9a9a",
    accent: "#ff2d55", accent2: "#00e5ff", success: "#00ff9d", warning: "#ffe600", error: "#ff2d55",
    navbar: "#000000", rgbCycle: true
  }),
  buildTheme("esports-arena", "Esports Arena", "gaming", {
    bg: "#03110c", bgAlt: "#072016", text: "#e8fff5", textMuted: "#7fcbae",
    accent: "#00ff85", accent2: "#00b3ff", success: "#00ff85", warning: "#ffcc00", error: "#ff3860",
    navbar: "#010b07", rgbCycle: true
  }),
  buildTheme("neon-grid", "Neon Grid", "gaming", {
    bg: "#0a0014", bgAlt: "#15002b", text: "#f5e9ff", textMuted: "#b48ce0",
    accent: "#ff00e6", accent2: "#00fff0", success: "#39ff14", warning: "#ffe600", error: "#ff0055",
    navbar: "#05000d", rgbCycle: true
  }),
  buildTheme("overclock", "Overclock", "gaming", {
    bg: "#0d0605", bgAlt: "#1a0d0a", text: "#ffe9e0", textMuted: "#d19a86",
    accent: "#ff4d00", accent2: "#ffd400", success: "#8bff00", warning: "#ffd400", error: "#ff1a1a",
    navbar: "#0a0403", rgbCycle: true
  })
];

VELNAR.getThemeById = function (id) {
  return VELNAR.PRESET_THEMES.find((t) => t.id === id) || null;
};

// Film, television and game expansion. Existing ids and saved settings stay valid.
VELNAR.PRESET_THEMES.push(...[
  ["batman","Batman","Gotham after dark","#0a101b","#162235","#efcc66","#90b9df"],
  ["star-wars","Star Wars","The dark side awakens","#120b16","#251a2d","#ff6a75","#9ac5ff"],
  ["harry-potter","Harry Potter","A little magic in every commit","#19101b","#302030","#edc477","#b09de7"],
  ["deadpool","Deadpool","Maximum effort. Every commit.","#180d13","#301923","#ff6c83","#c9cbd8"],
  ["stranger-things","Stranger Things","Welcome to the Upside Down","#101024","#20203b","#ff7975","#9aabff"],
  ["wednesday","Wednesday","Beautifully out of the ordinary","#110f1c","#242036","#c5a6ed","#b0c8d2"],
  ["squid-game","Squid Game","Your next move matters","#091b1c","#123333","#ff7aac","#79d9c1"],
  ["god-of-war","God of War","Forge your own saga","#101a21","#20313a","#f08c85","#92d7eb"],
  ["assassins-creed","Assassin's Creed","Work in the dark. Build in the light.","#17151b","#2c2830","#e6c7a0","#f28888"],
  ["minecraft","Minecraft","One block. Endless possibilities.","#101b13","#233426","#a2d977","#d2b383"]
].map(([id,name,tagline,bg,bgAlt,accent,accent2])=>buildTheme(id,name,"cinematic",{
  scene:id,tagline,bg,bgAlt,accent,accent2,text:"#f2f3f5",textMuted:"#b5becb",navbar:bg,
  success:"#80c998",warning:"#e6be77",error:"#ef848c"
})));
