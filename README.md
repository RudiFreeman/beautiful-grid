# Beautiful Grid

> Beautiful, local, open-source photo grid composer for photographers and designers.

**Status:** pre-release — Sprint 0 setup in progress. First public release **v1.0** ships after the MVP sprint.

---

## What it does

Beautiful Grid helps photographers and designers compose large photo collections (100–500 images) into visually pleasing grids:

- **Local-only.** Your photos never leave your computer — important for NDA-bound commercial and wedding work.
- **Auto-sort by dominant color.** One click turns chaos into an HSL gradient.
- **Manual drag & drop.** Re-arrange the grid pixel-perfect.
- **Export options.** Save the entire grid as a single high-resolution PNG/JPG. Renamed-copies export (`wedding_001_2026-05-24.jpg`) coming in v1.1.

Target platforms: **macOS (Apple Silicon)** and **Windows 10/11**.

## Tech stack

Tauri (Rust + WebView) · React 18 + TypeScript + Vite · Tailwind CSS · Zustand · dnd-kit · `image` / `kmeans_colors` / `rayon` on the Rust side.

## Roadmap

- **Now:** Sprint 0 — project setup.
- **Next:** Sprint 1 — MVP core (import, grid, color sort, export, project save) → **v1.0**.
- **After v1.0:** Groups + renamed export, row variations, tags & collections, Instagram preview.

Full plan (Russian): [`docs/Roadmap.md`](docs/Roadmap.md).

## Build from source

Coming after Sprint 0. Until then this README is a placeholder.

## Documentation

Internal product docs live under [`docs/`](docs/) (Russian — planning artifacts). Public-facing docs (`README.md`, `CHANGELOG.md`, release notes) are English-only.

- [`docs/PRD.md`](docs/PRD.md) — product requirements.
- [`docs/Roadmap.md`](docs/Roadmap.md) — sprint plan.
- [`docs/Ideas.md`](docs/Ideas.md) — backlog inbox.

## License

[MIT](LICENSE). © 2026 Aleksei Rudovich.

## Support the project

If Beautiful Grid is useful to you, you can sponsor development via **GitHub Sponsors** — see the *Sponsor* button at the top of this repo. Additional platforms (Buy Me a Coffee, Boosty) coming after v1.0.
