# VELNAR

Make GitHub yours. VELNAR is a browser extension that lets you fully
customize the appearance of GitHub — themes, colors, typography and custom
CSS — without touching any of GitHub's actual functionality.

100% local-first. No analytics, no tracking, no ads, no data collection.

## Features

- **30 built-in themes** — Dark, Light, Midnight, Cyberpunk, AMOLED, Dracula,
  GitHub Classic, Nord, Solarized Dark/Light, Monokai, One Dark, Gruvbox
  Dark, Tokyo Night, Catppuccin Mocha, Rosé Pine, Synthwave '84, plus 9
  hand-designed **Vivid** two-tone themes (Aurora, Sunset Blaze, Neon Tokyo,
  Vaporwave, Emerald Forest, Royal Purple, Blood Moon, Arctic Ice, Peach
  Sorbet), and 4 **Gaming 🎮** themes with live RGB color-cycling (RGB
  Chroma, Esports Arena, Neon Grid, Overclock). Several themes carry a
  second accent color, so gradients and glows shift between two tones
  instead of a single flat color — and the 4 Gaming themes go further,
  continuously cycling primary buttons and high-activity contribution-graph
  cells through the full hue spectrum, like RGB gaming hardware.
- **✨ Animated theme** — an optional toggle that adds a subtle two-tone
  gradient shift to the navbar, a pulsing glow on primary buttons (color
  travels between your theme's two accents), and smooth transitions across
  hover states. The **contribution graph** gets its own dedicated animation
  system: a staggered week-by-week wave entrance, a continuous "breathing"
  wave that travels across the grid every few seconds, a two-tone glow on
  your most active days, a light shimmer sweep, and a hover pop — plus it
  recolors from GitHub's fixed green to your theme's accent colors. Fully
  respects `prefers-reduced-motion`.
- **Deep Theme Builder** — customize 28 individual colors, grouped into
  Surfaces, Text, Interactive, Borders/Overlays/Code, and Status — every one
  with a live color picker. Includes layout controls for border radius and
  shadow intensity.
- **Per-component control** — 18 GitHub areas (navbar, sidebar, repository
  cards, buttons, inputs, search box, code blocks, markdown, issues, pull
  requests, profile, followers/following, notifications, commit list, file
  explorer, dropdowns/menus, diffs/code review, contribution graph) can each
  be turned on or off independently, so theming touches only what you want
  it to.
- **Typography controls** — font family, font size, line height, font
  weight, and a separate code font.
- **Auto Dark Mode** — follows your OS light/dark preference live, mapped to
  any two themes you choose.
- **Favorites & Random Theme** — star your favorite themes for quick access,
  or hit the dice button to jump to a random one.
- **🕸️ Web Swinger easter egg** — an optional, off-by-default toggle that
  makes a generic masked hero silhouette swing across the screen on a
  thread every so often, but only on your profile page. It's drawn in your
  theme's own accent colors, not any trademarked character design, and it
  respects `prefers-reduced-motion` too.
- **Keyboard shortcuts** — `Ctrl+Shift+G` toggles the extension on/off,
  `Ctrl+Shift+R` switches to a random theme, from anywhere.
- **Custom CSS** — an advanced panel for writing your own CSS, with
  validation before it's applied and a one-click reset.
- **Import / Export** — export any theme as a JSON file and import it later,
  plus full settings backup and restore.
- **SPA-aware** — GitHub is a single-page app; VELNAR listens for
  in-page navigation so your theme survives without needing a full reload.

## Installation

### From source (Developer Mode)

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions` in Microsoft Edge).
3. Enable **Developer mode** (top right corner).
4. Click **Load unpacked** and select the `extension/` folder.
5. Visit [github.com](https://github.com) — VELNAR is now active.

### From the Chrome Web Store

Once published, VELNAR will be available directly from the Chrome Web
Store. A link will be added here.

## Development

The project requires no build step for the extension itself — it's plain
HTML/CSS/JS, loaded directly by the browser.

```
velnar/
├── extension/
│   ├── manifest.json          # Manifest V3 config
│   ├── background/
│   │   └── service-worker.js  # installs default settings
│   ├── content/
│   │   ├── content.js         # entry point, wires everything together
│   │   ├── injector.js        # builds and injects <style> tags
│   │   └── observer.js        # detects GitHub SPA navigation
│   ├── popup/                 # toolbar popup (quick theme switch)
│   ├── options/                # full settings dashboard
│   ├── themes/
│   │   └── presets.js         # the 7 built-in themes
│   ├── components/
│   │   └── colorpicker.js     # reusable color input component
│   ├── utils/
│   │   ├── constants.js       # shared constants / CSS var map
│   │   ├── storage.js         # chrome.storage.local wrapper
│   │   └── validator.js       # custom CSS validation
│   ├── styles/                # UI styles for popup/options (not GitHub)
│   └── icons/                 # extension icons (generated via Python)
├── assets/
│   └── logo-source.png        # official VELNAR mark, source for icon128
├── landing/                    # marketing / landing page
├── scripts/
│   ├── generate_icons.py      # Python script that generates the icons
│   └── build_zip.py           # packages extension/ into a Web Store zip
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
└── .gitignore
```

### Regenerating icons

All three icon sizes (`icon16.png`, `icon48.png`, `icon128.png`) are
generated directly from `assets/logo-source.png` — the official VELNAR mark,
resized only, with no simplification or substitution.

```bash
pip install Pillow
python3 scripts/generate_icons.py
```

## Build

There is no bundler in this project — it ships as plain files. To produce a
distributable ZIP for the Chrome Web Store:

```bash
python3 scripts/build_zip.py
```

This creates `dist/velnar-extension.zip`, containing only the contents of
`extension/`, ready for upload.

## Usage

1. Click the VELNAR icon in your toolbar to open the popup.
2. Pick a theme, or toggle the extension on/off.
3. Click **Open Settings** for the full dashboard: Theme Builder, Typography,
   Custom CSS, Import/Export, and general Settings.

## Theme Creation

Open **Options → Theme Builder**, adjust any of the 28 available colors
(grouped by Surfaces, Text, Interactive, Borders, and Status) using the
color pickers, tune border radius / shadow intensity under Advanced, give
your theme a name, and click **Apply Custom Theme**. It becomes active
immediately. Use the **Components** tab to limit theming to specific areas
of GitHub if you only want part of the site restyled.

## Import / Export

- **Export Theme**: downloads the currently active theme as a `.json` file.
- **Import Theme**: pick a previously exported `.json` file to apply it.
- **Backup / Restore Settings**: back up your entire configuration
  (theme, typography, custom CSS, toggles) and restore it later or on
  another machine.

## Privacy

VELNAR is local-first by design:

- No analytics or tracking of any kind.
- No ads.
- No data is ever sent to a server — everything lives in
  `chrome.storage.local` on your own machine.
- No GitHub tokens, cookies, or session data are accessed or stored.

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Initial release: VELNAR 1.0.0"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Preparing for the Chrome Web Store

1. Run `python3 scripts/build_zip.py` to produce `dist/velnar-extension.zip`.
2. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Create a new item and upload the ZIP.
4. Fill in the store listing (description, screenshots, privacy practices —
   VELNAR collects no data, so this section is straightforward).
5. Submit for review.

## Browser Support

- Google Chrome
- Microsoft Edge (Chromium-based)
- Firefox support is planned; the codebase avoids Chrome-only APIs where
  possible to ease a future port.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
