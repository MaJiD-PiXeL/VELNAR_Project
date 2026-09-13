# Changelog

## 2.3.1 — 2026-09-13

- Redrew all five character sets with a shared vector illustration library: Spider-Man's mask, suit webs and chest emblem; Ellie's hair, face, backpack and clothing; Arthur Morgan's beard, hat, vest and gun belt; Rick and Morty's faces and outfits; and Iron Man's helmet, armor panels and reactor.
- Increased graph actors from at most 44px to at most 76px, adapting their size to the graph height and realigning web, gun and repulsor origins to the new hands.
- Used the same character designs in graph stories, dashboard banners, theme cards and the live preview.
- Kept 4–6 transform/opacity animations per graph, zero animations on contribution cells, offscreen pause, click-through and reduced-motion behavior.
- Added a character gallery and refreshed browser screenshots with sample data.

## 2.3.0 — 2026-09-12

- Added five stories inside the contribution grid: Spider-Man shoots webs and swings, a Last of Us survivor explores growing fungal colonies, a Red Dead outlaw aims and shoots, Rick and Morty cross between portals, and Iron Man flies and fires a repulsor.
- Anchored scene targets to actual contribution cells and kept native hover, click, keyboard and tooltip behavior available.
- Used 4–6 transform/opacity animations per graph, with no cell animations or per-frame JavaScript; offscreen scenes pause automatically.
- Added resizing, horizontal-scroll support, late-loaded graph recovery, reduced-motion handling and cleanup when animations, the contribution component or the extension are disabled.
- Updated the live preview and verified all five scenes with the actual extension in an isolated Edge profile using sample contribution data.

## 2.2.1 — 2026-09-12

- Removed dark strips inside changelog timelines and separate backgrounds behind profile names and bios. Profile columns and content wrappers now share a single cinematic canvas.
- Kept card backgrounds stable on hover and themed the contribution legend and selected year.
- Replaced per-day contribution animations with one transform/opacity sweep; made headers static and primary-button glows interactive. Scene artwork and particles remain animated.
- Reused unchanged styles and banner SVGs, combined navigation events within a frame, applied the palette before DOMContentLoaded, and stopped generic motion in hidden tabs.
- Added browser regressions for all five profile palettes, changelog surfaces, early rendering, pause/resume identity, style recovery, cleanup and mobile overflow. On the same 371-cell fixture, active cell animations fell from 371 to zero, with one graph sweep replacing them; these counts are not a page-load speed benchmark.

## 2.2.0 — 2026-09-12

- Redesigned the five cinematic themes with distinct card surfaces, full-page backdrops, patterned headers, themed borders and sidebar artwork.
- Added an illustrated dashboard banner with scene-specific particles and animation, and recovery after React replaces dashboard content.
- Kept the static cinematic design visible when motion is paused or reduced; moved decorative overlays away from the top repository list.
- Extended coverage to main page containers and feed cards with fixed background colors.
- Verified banner cleanup, route changes, component controls, reduced motion, responsive layouts and all five themes in a real extension browser session using a representative dashboard fixture.

## 2.1.1 — 2026-09-11

- Fixed incomplete dashboard coverage by mapping current and legacy Primer color tokens to the active VELNAR palette.
- Covered nested theme providers, dashboard surfaces, feed cards, controls and floating menus, including content loaded after navigation.
- Kept component-specific token overrides behind their switches and preserved semantic status colors, images and transparent surfaces.
- Added a representative dashboard regression fixture covering all five cinematic themes, Light/Dark, late styles, dynamic cards, cleanup and mobile layout.

## 2.1.0 — 2026-09-11

- Added five cinematic themes: Spider-Man, The Last of Us, Red Dead, Rick and Morty, and Iron Man.
- Created original SVG scene artwork for the theme cards and a bundled interactive preview with pause/apply controls.
- Added distinct animated atmospheric layers, navbar patterns, button glows and contribution effects.
- Enabled effects when selecting a cinematic theme; respected reduced motion, background-tab visibility and component controls.
- Kept all 30 existing palettes and the default Dark theme; added browser checks for effect cleanup, navigation, interaction and mobile layouts.
- Removed generated archives and unused logo assets carrying the previous names.

## 2.0.0 — 2026-09-11

- Renamed the extension, namespace, interface, documentation and release archive to VELNAR.
- Adopted the latest VELNAR V/N vector mark with 16/32/48/128 px browser icons.
- Fixed service-worker startup and missing Custom CSS validation in content scripts.
- Centralized and serialized settings changes; added legacy-key migration and storage error handling.
- Validated theme/settings imports and made full restore replace old settings, including null values.
- Initialized all Theme Builder controls on first load and added a palette preview.
- Added theme search, keyboard-accessible buttons and switches, status feedback and live settings synchronization.
- Fixed automatic-theme handling for random selection, imports and export.
- Applied shadow intensity and respected reduced motion and component animation switches.
- Improved preset link, secondary text and primary-button hover contrast; kept RGB motion on the contribution graph.
- Updated installation links, documentation and automated regression tests.
