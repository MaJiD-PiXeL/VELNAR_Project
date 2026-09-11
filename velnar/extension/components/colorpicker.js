// ye wrapper sabok dore native color input, hamzaman ye hex text field ham nemayesh mide
// nakhastim ye colorpicker sangin az sefr besazim, chizi ke browser mide kafie faghat style zadim
globalThis.VELNAR = globalThis.VELNAR || {};

VELNAR.ColorPicker = {
  // container: HTMLElement, options: {label, value, onChange}
  create(container, { label, value, onChange, hexOnly = false }) {
    const wrap = document.createElement("div");
    wrap.className = "gs-color-field";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;

    const row = document.createElement("div");
    row.className = "gs-color-row";

    const swatch = document.createElement("input");
    swatch.type = "color";
    const asHex = (color) => {
      if (/^#[\da-f]{6}$/i.test(color || "")) return color;
      if (/^#[\da-f]{3}$/i.test(color || "")) return "#" + color.slice(1).split("").map(c => c + c).join("");
      const parts = (color || "").match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      return parts ? "#" + parts.slice(1, 4).map(part => Number(part).toString(16).padStart(2, "0")).join("") : "#000000";
    };
    swatch.value = asHex(value);
    swatch.setAttribute("aria-label", label + " color picker");
    swatch.className = "gs-color-swatch";

    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.className = "gs-input gs-color-hex";
    hexInput.value = value || "#000000";
    hexInput.setAttribute("aria-label", label + " color value");
    hexInput.maxLength = 40;

    swatch.addEventListener("input", () => {
      hexInput.value = swatch.value;
      hexInput.setCustomValidity("");
      hexInput.removeAttribute("aria-invalid");
      onChange(swatch.value);
    });

    hexInput.addEventListener("change", () => {
      const hex = hexInput.value.trim();
      if (VELNAR.Validator.isColor(hex) && (!hexOnly || hex.startsWith("#"))) {
        hexInput.setCustomValidity("");
        hexInput.removeAttribute("aria-invalid");
        swatch.value = asHex(hex);
        onChange(hex);
      } else {
        hexInput.setCustomValidity(hexOnly ? "Use a hex color." : "Use a hex or rgb/rgba color.");
        hexInput.setAttribute("aria-invalid", "true");
        hexInput.reportValidity();
      }
    });

    row.appendChild(swatch);
    row.appendChild(hexInput);
    wrap.appendChild(labelEl);
    wrap.appendChild(row);
    container.appendChild(wrap);

    return {
      setValue(v) {
        swatch.value = asHex(v);
        hexInput.value = v;
      }
    };
  }
};
