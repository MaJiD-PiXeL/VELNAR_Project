// script sabok baraye landing page: sakhtane nemayeshe theme strip az rooye hamun preset ha
// in file mostaghel az extension ejra mishe, faghat baraye namayesh dar website
const THEME_PREVIEWS = [
  { name: "Dark", bg: "#0d1117", accent: "#00c2d7" },
  { name: "Light", bg: "#ffffff", accent: "#0969da" },
  { name: "Midnight", bg: "#05070d", accent: "#5b7fff" },
  { name: "Cyberpunk", bg: "#0a0014", accent: "#ff2bd6" },
  { name: "AMOLED", bg: "#000000", accent: "#00c2d7" },
  { name: "Dracula", bg: "#282a36", accent: "#bd93f9" },
  { name: "GitHub Classic", bg: "#ffffff", accent: "#0969da" },
  { name: "Aurora", bg: "#061a1a", accent: "#00f5d4" },
  { name: "Sunset Blaze", bg: "#1a0e0a", accent: "#ff5e62" },
  { name: "Neon Tokyo", bg: "#05060f", accent: "#00fff0" },
  { name: "Vaporwave", bg: "#241734", accent: "#ff6ec7" },
  { name: "Emerald Forest", bg: "#08150f", accent: "#00c853" },
  { name: "Royal Purple", bg: "#160b28", accent: "#8b5cf6" },
  { name: "Blood Moon", bg: "#170707", accent: "#e63946" },
  { name: "Arctic Ice", bg: "#f0f8ff", accent: "#0ea5e9" },
  { name: "Peach Sorbet", bg: "#fff5f2", accent: "#ff6f91" },
  { name: "Nord", bg: "#2e3440", accent: "#88c0d0" },
  { name: "Solarized Dark", bg: "#002b36", accent: "#268bd2" },
  { name: "Monokai", bg: "#272822", accent: "#a6e22e" },
  { name: "One Dark", bg: "#282c34", accent: "#61afef" },
  { name: "Gruvbox Dark", bg: "#282828", accent: "#fe8019" },
  { name: "Tokyo Night", bg: "#1a1b26", accent: "#7aa2f7" },
  { name: "Catppuccin Mocha", bg: "#1e1e2e", accent: "#cba6f7" },
  { name: "Rosé Pine", bg: "#191724", accent: "#c4a7e7" },
  { name: "Synthwave '84", bg: "#241b2f", accent: "#ff7edb" }
];

function renderThemeStrip() {
  const strip = document.getElementById("themeStrip");
  if (!strip) return;
  THEME_PREVIEWS.forEach((t) => {
    const chip = document.createElement("div");
    chip.className = "theme-chip";
    chip.style.background = `linear-gradient(135deg, ${t.bg} 60%, ${t.accent})`;
    chip.innerHTML = `<span>${t.name}</span>`;
    strip.appendChild(chip);
  });
}

document.addEventListener("DOMContentLoaded", renderThemeStrip);
