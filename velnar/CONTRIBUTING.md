# Contributing to VELNAR

Thanks for considering a contribution! VELNAR is a community-driven,
local-first browser extension, and contributions of all sizes are welcome.

## Getting Started

1. Fork the repository and clone it locally.
2. Load the extension in Chrome using Developer Mode (see README.md).
3. Make your changes inside `extension/`.
4. Test on a few different GitHub pages (repo view, issues, PRs, profile).

## Project Structure

See the "Project Structure" section in `README.md` for a full breakdown of
each folder and file's responsibility.

## Guidelines

- Keep the code modular — one responsibility per file.
- Prefer resilient CSS selectors (`data-*`, `aria-*`, semantic tags) over
  fragile utility classes that GitHub may rename at any time.
- Never introduce analytics, tracking, or network calls.
- Never use `eval()` or inline script injection.
- Run any new Custom CSS input through `utils/validator.js`.
- Keep the popup and options UI consistent with `styles/variables.css`.

## Adding a New Preset Theme

Add a new object to the `VELNAR.PRESET_THEMES` array in
`extension/themes/presets.js` with a unique `id` and full set of 15 colors.

## Submitting a Pull Request

1. Create a feature branch (`feature/your-feature-name`).
2. Keep commits focused and descriptive.
3. Open a PR describing what changed and why.
4. Be responsive to review feedback.

## Reporting Bugs

Please open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser + extension version
- Screenshots if relevant (UI issues)
