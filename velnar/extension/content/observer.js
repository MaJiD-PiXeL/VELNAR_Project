// github ye SPA hast, safhe avaz mishe bedune reload kamel (Turbo/pjax)
// pas bayad befahmim url avaz shode ta age style tag ha ba DOM jadid pak shodan dobare bezanim
// az turbo:load / turbo:render event ha estefade mikonim chun github khodesh in event haro pakhsh mikone
// age in event ha nabudan (fallback) MutationObserver ro sabok rooye <head> run mikonim
globalThis.VELNAR = globalThis.VELNAR || {};

VELNAR.Observer = {
  _lastUrl: location.href,
  _callback: null,
  _scheduled: false,

  start(callback) {
    this._callback = callback;

    document.addEventListener("turbo:render", () => this._trigger());
    document.addEventListener("turbo:load", () => this._trigger());
    document.addEventListener("pjax:end", () => this._trigger());
    window.addEventListener("popstate", () => this._trigger());

    // fallback baraye vaghti event haye bala mojud nabashan: check kardane url dar interval kootah
    // The fallback only checks visible tabs; Turbo/PJAX events are the primary path.
    setInterval(() => {
      if (!document.hidden && location.href !== this._lastUrl) {
        this._lastUrl = location.href;
        this._trigger();
      }
    }, 800);

    // hamchenin ye observer sabok rooye head bezarim ta age <head> az no sakhte shod
    // style tag haye ma ro dobare vasl konim (nadir pish miad vali ehtiyat)
    const headObserver = new MutationObserver(() => {
      if (!document.getElementById(VELNAR.STYLE_TAG_ID)) {
        this._trigger();
      }
    });
    if (document.head) {
      headObserver.observe(document.head, { childList: true });
    }
  },

  _trigger() {
    if (this._scheduled) return;
    this._scheduled = true;
    // Turbo can emit render/load/pjax:end in the same frame.
    requestAnimationFrame(() => {
      this._scheduled = false;
      this._lastUrl = location.href;
      if (this._callback) this._callback();
    });
  }
};
