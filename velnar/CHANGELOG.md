# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [1.7.0] - 2026-09-03
### Fixed
- **Critical: page-covering bug.** GitHub's `.Overlay` class is used for
  both dialog panels and, in some cases, the full-page backdrop/scrim
  behind them. We were forcing an opaque background onto `.Overlay`
  unconditionally, so opening a dropdown, menu, or dialog could turn a
  translucent backdrop into a solid opaque layer covering the whole page.
  Fixed with two layers of protection: styling is now scoped to
  `.Overlay-body`/`.Overlay-header`/`.Overlay-footer` instead of the
  ambiguous parent class, and an unconditional safety net (independent of
  any component toggle) forces `dialog::backdrop`, `.Overlay-backdrop`,
  and any `*Backdrop*`-named element to stay transparent. Verified with a
  new regression test that confirms the safety net survives even with
  every component disabled.
### Added
- **Gaming 🎮 theme category**: 4 new themes with genuine RGB
  color-cycling — RGB Chroma, Esports Arena, Neon Grid, Overclock. When
  Animated Theme is on, primary buttons and high-activity
  contribution-graph cells continuously cycle through the full hue
  spectrum via animated `hue-rotate()`, the same effect as RGB gaming
  peripherals. 30 themes total, all still passing the WCAG contrast audit.
- Small "RGB" badge on gaming theme cards in the Themes tab.

## [1.6.0] - 2026-09-02
### Fixed
- **Storage race condition**: `Storage.set()` used an unguarded
  read-modify-write. Clicking through themes quickly (rapid consecutive
  clicks) could cause writes to overwrite each other out of order, so a
  click would sometimes appear to do nothing. Fixed with a proper write
  queue that serializes every write; verified with a race-condition test
  simulating 10 concurrent clicks with randomized async delays.
- **Auto Dark Mode silently blocking manual theme picks**: if Auto Dark
  Mode was on, clicking a theme updated storage but had zero visible
  effect on GitHub, with no indication why. Picking a theme (preset,
  random, or a custom Theme Builder theme) now automatically turns Auto
  Dark Mode off, and a banner explains it when it's on.
- **WCAG contrast failures**: an automated contrast audit against all 26
  themes found 7 button-text combinations failing WCAG AA (as low as
  2.17:1 against a 4.5:1 minimum). Root cause: button text color was
  picked from the theme's overall darkness instead of the actual accent
  color's luminance. Fixed with a proper auto-contrast picker; all themes
  now pass.
### Added
- Instant visual feedback on theme clicks: the picked theme highlights
  immediately (before the storage round-trip resolves) and pulses once
  applied, so it's always clear a click registered.
- Hover shimmer sweep and a one-time staggered entrance animation on
  theme cards (first load only, not replayed on every click).
- Navbar gradient animation enriched to a smoother 5-stop blend with
  premium cubic-bezier easing.
### Testing
- Added three automated test harnesses that run against the real code
  (not mocks of it): a shared-scope CSS well-formedness scan across all
  themes/components/animations, a WCAG contrast audit, and a storage
  race-condition simulator.

## [1.5.0] - 2026-09-01
### Added
- New official VELNAR logo across the extension: a detailed mark for the
  128px icon (Chrome Web Store / extensions page), and a simplified,
  higher-contrast glyph for 16px/48px so it stays legible in the toolbar.
- Logo now appears as an actual image (not a CSS dot) in the popup header,
  options sidebar, and landing page nav/footer, plus a landing page
  favicon.
- `assets/logo-source.png` added as the canonical source asset;
  `scripts/generate_icons.py` rewritten to derive all three icon sizes
  from it reproducibly.
### Fixed
- Verified via an automated shared-scope test harness (simulating how
  content scripts actually share globals in the browser) that every
  generated stylesheet — across all 26 themes, all components, animations,
  and the Web Swinger easter egg — produces well-formed CSS with no
  unbalanced braces, stray `undefined`/`NaN`, or missing variables.

## [1.4.0] - 2026-08-29
### Added
- "Web Swinger" easter egg: a generic masked hero silhouette swings across
  the screen on a thread, once every ~16 seconds, only while viewing a
  GitHub profile page. Off by default (Settings → toggle). Colored using
  the active theme's accent colors, not a copy of any trademarked
  character design. Respects `prefers-reduced-motion`.

## [1.3.0] - 2026-08-29
### Added
- Two-tone accent system: every theme now has a primary and secondary
  accent color (`accentSecondary`), editable in the Theme Builder.
  Gradients and glows shift between the two instead of using one flat
  color.
- 9 new hand-designed "Vivid" themes: Aurora, Sunset Blaze, Neon Tokyo,
  Vaporwave, Emerald Forest, Royal Purple, Blood Moon, Arctic Ice, Peach
  Sorbet — 26 themes total.
- Existing high-energy themes (Cyberpunk, Dracula, Midnight, Tokyo Night,
  Synthwave) now also carry a secondary accent for richer glow effects.
- Contribution graph animation upgraded with a continuous "breathing wave"
  that travels across the grid every 6 seconds (not just a one-time
  entrance), and its glow/shimmer now uses the two-tone accent pair.
### Changed
- Navbar gradient animation and primary-button glow now shift between
  both accent colors.

## [1.2.0] - 2026-08-29
### Added
- Dedicated Contribution Graph animation: staggered week-by-week wave
  entrance, a soft pulsing glow on your most active days, a light shimmer
  sweep across the calendar, and a hover pop on each cell.
- Contribution graph now recolors from GitHub's fixed green to the active
  theme's accent color (toggleable, like every other component).
- New "Contribution Graph" entry in the Components tab for independent
  on/off control.
- All new motion respects `prefers-reduced-motion` automatically.

## [1.1.0] - 2026-08-29
### Added
- Renamed project to VELNAR.
- Animated Theme toggle: gradient navbar shift, pulsing primary buttons,
  smooth hover transitions.
- Functional Auto Dark Mode — follows OS light/dark preference, mapped to
  any two themes.
- Favorite themes (star) and Random Theme button, in both popup and options.
- Keyboard shortcuts: toggle extension, jump to a random theme.
### Fixed
- Header icon buttons and the search bar no longer render as solid
  full-color blocks — only true primary actions get a solid accent fill,
  everything else uses the theme's neutral surface colors.

## [1.0.0] - 2026-08-29
### Added
- Initial public release.
- 7 built-in themes: Dark, Light, Midnight, Cyberpunk, AMOLED, Dracula, GitHub Classic.
- Full Theme Builder with 15 customizable colors.
- Typography controls (font family, size, line height, weight, code font).
- Custom CSS panel with validation and reset.
- Theme import/export as JSON.
- Full settings backup/restore.
- Options dashboard with sidebar navigation.
- Popup for quick theme switching.
- Landing page.
