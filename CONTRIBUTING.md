# Contributing to Beautiful Grid

Beautiful Grid is an open-source project. Contributions are welcome — bug fixes, docs, translations, and new features.

## Before you start

- Check [docs/Roadmap.md](docs/Roadmap.md) to see what's planned.
- Browse [Issues](../../issues) — look for `good first issue` tags.
- For large features, open an issue first to discuss before writing code.

## Prerequisites

- **Node.js** ≥ 20 + npm
- **Rust** (stable toolchain via [rustup](https://rustup.rs/))
- macOS arm64 or Windows 10/11

## Setup

```bash
git clone https://github.com/<your-fork>/beautiful-grid.git
cd beautiful-grid
npm install
npm run tauri dev   # opens the app window
```

## Branch model

| Branch | Purpose |
|---|---|
| `main` | Stable, tagged releases only |
| `sprint-N/<feature>` | Active sprint work |
| `fix/<short-description>` | Bug fixes |
| `docs/<topic>` | Documentation only |

**Never push directly to `main`.** All changes go through a Pull Request.

## Code style

- **TypeScript / TSX:** ESLint + Prettier (`npm run lint`, `npm run format:check`).
- **Rust:** `rustfmt` + `clippy` (`cargo fmt`, `cargo clippy -- -D warnings`).
- Variable / function / type names — **English**. Comments in source code — **Russian** (pre-v1.0 era; see [CLAUDE.md](CLAUDE.md)).

**File size limits** (from [CLAUDE.md](CLAUDE.md)):

| Stack | Target | Hard limit |
|---|---|---|
| Rust (`src-tauri/`) | 400 lines | 600 lines |
| Frontend (`src/`, TS/TSX) | 250 lines | 400 lines |

## Pull request checklist

- [ ] `npm run lint` passes with zero warnings.
- [ ] `npm run format:check` passes.
- [ ] `cargo fmt --check` passes (in `src-tauri/`).
- [ ] `cargo clippy -- -D warnings` passes (in `src-tauri/`).
- [ ] No network requests with user data added (offline-only invariant).
- [ ] Original photos are never modified or deleted.

## Commit messages

Write in **Russian** (pre-v1.0). Short imperative subject line, optional body.

```
Добавить скелет команды import_photos

Пустой stub с правильной сигнатурой. Реализация — Sprint 1.
```

## License

By contributing you agree that your contribution is released under the [MIT License](LICENSE).
