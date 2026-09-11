# Contributing to VELNAR

Load `extension/` in a Chromium browser's developer mode, make changes, run `npm test`, and verify the popup, settings and representative GitHub pages.

- Keep browser functionality intact and prefer narrowly scoped selectors.
- Shared scripts must work in both documents and service workers (`globalThis`).
- Route setting mutations through the service worker. Validate imports before saving.
- Preserve accessibility, reduced motion, and existing stored preferences.
- Never introduce tracking, remote assets, `eval`, or remote code.
- Add themes through `buildTheme` in `extension/themes/presets.js`; all 30 colors are derived from the base palette.
- Generate icons from `assets/velnar-mark.svg` using `npm run icons`.
- Update the changelog and regenerate the distribution archive after a release.

See `README.md` for installation, packaging and browser-test instructions.
