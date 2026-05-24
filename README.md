# Beautiful Grid

![Version](https://img.shields.io/badge/version-1.1.0-brightgreen?style=flat-square) ![Platform](https://img.shields.io/badge/platform-macOS_%7C_Windows-blue?style=flat-square) ![Tauri](https://img.shields.io/badge/tauri-2.11-blue?style=flat-square) ![React](https://img.shields.io/badge/react-19.2-blue?style=flat-square) ![TypeScript](https://img.shields.io/badge/typescript-6.0-blue?style=flat-square) ![Vite](https://img.shields.io/badge/vite-8.0-blue?style=flat-square) ![Tailwind](https://img.shields.io/badge/tailwind-4.3-blue?style=flat-square) ![Zustand](https://img.shields.io/badge/zustand-5.0-blue?style=flat-square) ![Rust](https://img.shields.io/badge/rust-stable-orange?style=flat-square)

> Beautiful, local, open-source photo grid composer for photographers and designers.

---

## 🚀 Current version

**v1.1.0** — Sprint 1.1: bug fixes and UX polish across the full app.
Full changelog — [CHANGELOG.md](CHANGELOG.md). Roadmap — [docs/Roadmap.md](docs/Roadmap.md).

---

## What it does

Beautiful Grid helps photographers and designers compose large photo collections (100–500 images) into visually pleasing grids:

- **Local-only.** Your photos never leave your computer — important for NDA-bound commercial and wedding work.
- **Auto-sort by dominant color.** One click turns chaos into an HSL gradient.
- **Manual drag & drop.** Re-arrange the grid pixel-perfect.
- **Export options.** Save the entire grid as a single high-resolution PNG/JPG.

Target platforms: **macOS (Apple Silicon)** and **Windows 10/11**.

---

## 📦 Tech stack

| Layer | Technology |
|---|---|
| Desktop shell | Tauri 2 (Rust + WebView) |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State management | Zustand |
| Drag & drop | dnd-kit |
| Virtualisation | @tanstack/react-virtual |
| Image processing | `image` · `rayon` (Rust) |
| Platforms | macOS arm64 · Windows x64 |

---

## Installation

No technical knowledge required. Download, install, open — done.

### macOS (Apple Silicon)

1. Go to [Releases](../../releases) and download `Beautiful.Grid_1.1.0_aarch64.dmg`
2. Open the downloaded `.dmg` file
3. Drag **Beautiful Grid** into the **Applications** folder
4. Open **Applications**, find Beautiful Grid, and **right-click → Open**
   > macOS will warn that the app is from an unidentified developer — click **Open** to proceed. This is a one-time step.

### Windows 10 / 11

1. Go to [Releases](../../releases) and download `Beautiful.Grid_1.1.0_x64-setup.exe`
2. Run the installer and follow the prompts
3. Launch Beautiful Grid from the Start menu or desktop shortcut

---

## Roadmap

- **v1.0:** MVP — import, grid, color sort, export, project save.
- **v1.1 (current):** Bug fixes and UX polish.
- **v1.2:** Groups + renamed export, row variations.
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
