// Preview the same palettes that ship in the extension.
const strip = document.getElementById("themeStrip");
VELNAR.PRESET_THEMES.forEach(theme => {
  const chip = document.createElement("div");
  chip.className = "theme-chip";
  chip.style.background = `linear-gradient(135deg, ${theme.colors.background} 60%, ${theme.colors.accent})`;
  const name = document.createElement("span");
  name.textContent = theme.name;
  name.style.color = theme.colors.textPrimary;
  name.style.background = theme.colors.background;
  chip.append(name);
  strip.append(chip);
});
