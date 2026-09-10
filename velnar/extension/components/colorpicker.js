// ye wrapper sabok dore native color input, hamzaman ye hex text field ham nemayesh mide
// nakhastim ye colorpicker sangin az sefr besazim, chizi ke browser mide kafie faghat style zadim
globalThis.VELNAR = globalThis.VELNAR || {};

VELNAR.ColorPicker = {
  // container: HTMLElement, options: {label, value, onChange}
  create(container, { label, value, onChange }) {
    const wrap = document.createElement("div");
    wrap.className = "gs-color-field";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;

    const row = document.createElement("div");
    row.className = "gs-color-row";

    const swatch = document.createElement("input");
    swatch.type = "color";
    swatch.value = value || "#000000";
    swatch.className = "gs-color-swatch";

    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.className = "gs-input gs-color-hex";
    hexInput.value = value || "#000000";

    swatch.addEventListener("input", () => {
      hexInput.value = swatch.value;
      onChange(swatch.value);
    });

    hexInput.addEventListener("change", () => {
      const hex = hexInput.value.trim();
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
        swatch.value = hex;
        onChange(hex);
      }
    });

    row.appendChild(swatch);
    row.appendChild(hexInput);
    wrap.appendChild(labelEl);
    wrap.appendChild(row);
    container.appendChild(wrap);

    return {
      setValue(v) {
        swatch.value = v;
        hexInput.value = v;
      }
    };
  }
};
