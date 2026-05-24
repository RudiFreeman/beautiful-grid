# Beautiful Grid

> Beautiful, local, open-source photo grid composer for photographers and designers.

**Status:** v1.0 MVP — available for macOS and Windows.

---

## What it does

Beautiful Grid helps photographers and designers compose large photo collections (100–500 images) into visually pleasing grids:

- **Local-only.** Your photos never leave your computer — important for NDA-bound commercial and wedding work.
- **Auto-sort by dominant color.** One click turns chaos into an HSL gradient.
- **Manual drag & drop.** Re-arrange the grid pixel-perfect.
- **Export options.** Save the entire grid as a single high-resolution PNG/JPG. Renamed-copies export (`wedding_001_2026-05-24.jpg`) coming in v1.1.

Target platforms: **macOS (Apple Silicon)** and **Windows 10/11**.

---

## Installation

No technical knowledge required. Download, install, open — done.

### macOS (Apple Silicon)

1. Go to [Releases](../../releases) and download `Beautiful.Grid_1.0.0_aarch64.dmg`
2. Open the downloaded `.dmg` file
3. Drag **Beautiful Grid** into the **Applications** folder
4. Open **Applications**, find Beautiful Grid, and **right-click → Open**
   > macOS will warn that the app is from an unidentified developer — click **Open** to proceed. This is a one-time step.

### Windows 10 / 11

1. Go to [Releases](../../releases) and download `Beautiful.Grid_1.0.0_x64-setup.exe`
2. Run the installer and follow the prompts
3. Launch Beautiful Grid from the Start menu or desktop shortcut

---

## Tech stack

Tauri (Rust + WebView) · React 18 + TypeScript + Vite · Tailwind CSS · Zustand · dnd-kit · `image` / `kmeans_colors` / `rayon` on the Rust side.

## Roadmap

- **v1.0 (current):** MVP — import, grid, color sort, export, project save.
- **v1.1:** Groups + renamed export, row variations.
- **Later:** Tags & collections, Instagram preview.

Full plan (Russian): [`docs/Roadmap.md`](docs/Roadmap.md).

## Build from source

```bash
# Prerequisites: Rust (https://rustup.rs) + Node.js 20+
npm install
npm run tauri build
```

## Documentation

Internal product docs live under [`docs/`](docs/) (Russian — planning artifacts). Public-facing docs (`README.md`, `CHANGELOG.md`, release notes) are English-only.

- [`docs/PRD.md`](docs/PRD.md) — product requirements.
- [`docs/Roadmap.md`](docs/Roadmap.md) — sprint plan.
- [`docs/Ideas.md`](docs/Ideas.md) — backlog inbox.

## License

[MIT](LICENSE). © 2026 Aleksei Rudovich.

## Support the project

If Beautiful Grid is useful to you, you can sponsor development via **GitHub Sponsors** — see the *Sponsor* button at the top of this repo. Additional platforms (Buy Me a Coffee, Boosty) coming after v1.0.
