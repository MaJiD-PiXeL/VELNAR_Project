# VELNAR

Make GitHub yours. A private, local-first Chrome and Edge extension with 35 themes, 30 editable colors, typography controls and optional animations.

## Install

1. Extract `dist/velnar-extension.zip`.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**, choose **Load unpacked**, and select the extracted folder containing `manifest.json`.
4. Visit GitHub and open **VELNAR** in your browser toolbar.

For development, load the `extension/` directory directly. Chrome/Edge 111 or newer is required. No bundler or server is needed for the extension.

## Features

- Five cinematic themes: Spider-Man, The Last of Us, Red Dead, Rick and Morty, and Iron Man, each with original vector artwork and distinct animated effects.
- 30 additional official, community, vivid and gaming palettes, searchable in the popup and settings.
- Favorites, random themes, and automatic light/dark selection based on your system.
- Theme Builder with 30 color controls and a live preview before applying.
- 18 component switches, global typography, border radius and shadow intensity.
- Optional animations that respect reduced-motion preferences; disabled components do not animate.
- Custom CSS with size, delimiter and external-resource checks.
- Theme import/export and complete settings backup/restore with validation.
- Accessible keyboard controls, save feedback and live synchronization across settings windows.
- SPA navigation support, including restoration of removed styles.

Shortcuts: **Ctrl+Shift+G** (macOS: **Command+Shift+G**) toggles the extension; **Alt+Shift+R** selects a random theme. Customize them in your browser's extension-shortcut settings if needed.

Manual theme selection, import and random selection turn automatic system theme selection off. Background, shared Primer surface/text/border colors and typography remain global when individual component rules are disabled. Component switches control additional rules and component-specific tokens. Both current and legacy Primer tokens are mapped, including nested theme providers and dynamically loaded dashboard content. Styles target GitHub selectors; changes to GitHub's markup may require maintenance.

## Cinematic collection

Open **Themes → Cinematic collection** or choose a cinematic card in the popup. Selecting one also enables animations. Use **Settings → Animations** to pause effects while keeping the palette.

| Theme | Effects |
| --- | --- |
| Spider-Man | Drawing corner webs, red/blue tracers and charged buttons |
| The Last of Us | Swaying fungal branches, drifting spores and firefly glows |
| Red Dead | Sunset silhouettes, frontier dust and ember contributions |
| Rick and Morty | Rotating portals, floating particles and green energy pulses |
| Iron Man | Counter-rotating reactor rings, HUD traces and repulsor glows |

**Preview animations** opens an interactive demo repository inside the extension. Switch between all five worlds, pause motion and apply a theme to GitHub. For a preview without installing, open `extension/preview/preview.html`; applying a theme requires the installed extension.

Each cinematic theme also has a full-page backdrop, distinct card surfaces, themed borders and a patterned header. A compact illustrated banner appears on the signed-in dashboard, with moving light trails, spores, dust or reactor details. It recovers when GitHub replaces the dashboard content without a full reload.

Version 2.2.1 removes the separate dark layers behind changelog text and profile details. The contribution graph uses one animated sweep instead of individual animations on every day. Headers keep their pattern without continuous repainting, and primary buttons glow on hover or keyboard focus. Unchanged styles and paused banner artwork are reused, and the palette can appear before GitHub finishes parsing the page.

In 2.3.0, each cinematic theme replaces that sweep with a tiny story inside the contribution grid: web shooting and swinging, a survivor with a flashlight and growing fungi, Dead Eye aiming and a gunshot, a portal journey, or Iron Man's flight and repulsor. Targets line up with actual cells. Each graph has only 4–6 animated overlay objects; its cells remain unchanged. Scenes pause offscreen and follow **Animations** and **Contribution Graph** independently of the atmosphere switch.

Version 2.3.1 adds more detailed character drawings shared by the graph, banners and theme cards. Actors scale up to 76px to keep faces and clothing readable inside the grid. Spider-Man, Ellie, Arthur Morgan, Rick and Morty, and Iron Man are drawn locally in `extension/themes/character-art.js`; the extension downloads no character artwork. Run `node scripts/character-review.cjs` to rebuild the character gallery in `artifacts/character-redesign.html`.

Motion respects system reduced-motion preferences and stops while the GitHub tab is hidden. Pausing animations keeps the static theme and banner visible. The **Profile & cinematic atmosphere** switch hides the dashboard banner, backdrop and decorative margin layer; navbar, sidebar, card, button and contribution styles follow their respective component switches. Decorations never capture clicks or keyboard focus and shrink on small screens. All artwork is bundled locally, without network requests.

## Brand

The supplied VELNAR V/N monogram is the same mark used in the latest VELNAR website design. The original vector is in `assets/velnar-mark.svg`; PNG exports and browser icons are generated from it without redrawing the mark.

## Development and checks

- `extension/`: installable extension source.
- `landing/`: static introduction and ZIP download link. Serve the project root to preview it.
- `assets/`: canonical vector logo and large PNG export.
- `tests/`: regression checks and real-browser smoke tests.
- `scripts/`: icon generation and ZIP packaging.

```sh
npm install
npm test
npm run icons
python scripts/build_zip.py
```

Python 3 is needed only for packaging. `sharp` is used only to generate PNG icons; the installed extension has no runtime dependencies. The ZIP contains only `extension/` files, with the manifest at its root.

Browser smoke tests use Playwright and a separate, disposable browser profile:

```sh
npm install --no-save playwright
# Set VELNAR_BROWSER to an Edge/Chromium executable if required.
node tests/browser-smoke.cjs
node tests/cinematic-smoke.cjs
node tests/dashboard-coverage.cjs
node tests/surface-performance.cjs
node tests/graph-scenes.cjs
# Optional: compare animation counts with a previous unpacked version.
# node tests/surface-performance.cjs /path/to/previous/extension
```

## Existing installations

After replacing files in an existing unpacked installation, click **Reload** on VELNAR in `chrome://extensions` or `edge://extensions`, then refresh open GitHub tabs so they receive the updated content scripts.

The new settings key is `velnar_settings_v1`. Existing settings under earlier brand keys are migrated when upgrading the same browser extension. Installing the renamed folder as a separate unpacked extension may receive a different extension ID; export your old settings and restore that backup in VELNAR in that case. Old theme JSON exports remain supported.

## Privacy

Preferences stay in `chrome.storage.local`. There are no accounts, trackers, analytics or remote assets. Custom CSS cannot load URLs, imports or external fonts. Font-family controls use fonts already installed on your computer. No GitHub tokens or cookies are read.

## License

MIT. See `LICENSE`.
