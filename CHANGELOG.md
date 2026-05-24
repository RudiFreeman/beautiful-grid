# Changelog

All notable changes to **Beautiful Grid** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Pre-release tags use the `-alpha` / `-beta` suffixes.

## [Unreleased]

## [1.0.0] — 2026-05-24

Sprint 1 — MVP core. First public release.

### Added
- **Library page**: drag-and-drop folders and files onto the app window; recursive scan for JPG/PNG; virtualized 6-column thumbnail grid (handles 500+ photos without jank).
- **Import pipeline**: `import_photos` Tauri command generates JPEG thumbnails (≤ 400 px) in `AppData/cache/`; emits `import:progress` events for real-time counter display.
- **Color analysis**: `analyze_colors` command extracts dominant color per photo (64×64 downsample → average RGB) using `rayon` parallel processing; emits `analyze:progress` events.
- **HSL-based color sort**: `sort_photos_by_color` command sorts photos by Hue → Saturation → Lightness; gracefully handles greys.
- **Grid page**: N-column layout (1–10 slider); drag-and-drop reordering via `dnd-kit`; "Sort by color" button; row-virtualized for 500+ photo performance.
- **Export page**: format picker (JPG / PNG), quality slider (10–100, JPG only), real-time progress bar, "Export complete!" feedback; `export_grid` Tauri command center-crops photos into 400×300 cells and stitches them into one output image.
- **Project save / open**: `.bgrid` format (JSON); New / Save / Open buttons in NavBar via native file dialogs (`tauri-plugin-dialog`); full round-trip including grid order and settings.
- **Support button**: NavBar header opens `SupportModal` with Buy Me a Coffee / Boosty / GitHub Sponsors links (opened in default browser via `tauri-plugin-opener`).
- **Welcome modal**: shown once on first launch (localStorage flag `bg_welcome_seen`); includes the same donate platform links.
- **Release pipeline**: GitHub Actions workflow triggers on `v*` tags; builds macOS DMG (arm64) and Windows MSI (x64) and publishes both to GitHub Releases.

[Unreleased]: https://github.com/RudiFreeman/beautiful-grid/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/RudiFreeman/beautiful-grid/releases/tag/v1.0.0

## [0.1.0-alpha] — 2026-05-24

Sprint 0 — project scaffolding. Pre-release: no end-user functionality yet.

### Added
- React 18 + TypeScript + Vite + Tailwind CSS (dark theme) + Zustand boilerplate.
- Tauri 2 backend (`src-tauri/`) with empty `import_photos`, `analyze_colors`, `export_grid` command stubs.
- Navigation skeleton: Library / Grid / Export pages.
- GitHub Actions CI matrix: macOS (arm64) and Windows (x64) Tauri builds + frontend lint/typecheck.
- ESLint + Prettier (frontend), rustfmt + clippy with `-D warnings` (Rust) — zero warnings on merge.
- MIT license, English README, CONTRIBUTING.md, `.github/FUNDING.yml` (GitHub Sponsors).

### Fixed
- Valid multi-resolution `icon.ico` and `icon.icns` so Windows `RC.EXE` and macOS bundler accept them (initial placeholders were PNGs with deceiving extensions; this blocked Windows CI).

[0.1.0-alpha]: https://github.com/RudiFreeman/beautiful-grid/releases/tag/v0.1.0-alpha
