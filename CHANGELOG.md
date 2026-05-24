# Changelog

All notable changes to **Beautiful Grid** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Pre-release tags use the `-alpha` / `-beta` suffixes.

## [Unreleased]

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

[Unreleased]: https://github.com/RudiFreeman/beautiful-grid/compare/v0.1.0-alpha...HEAD
[0.1.0-alpha]: https://github.com/RudiFreeman/beautiful-grid/releases/tag/v0.1.0-alpha
