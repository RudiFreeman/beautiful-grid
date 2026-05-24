//! Tauri-команды, вызываемые из frontend через invoke().
//! Sprint 0: пустые stubs с правильными сигнатурами.
//! Реализация — Sprint 1.

mod analyze;
mod export;
mod import;

pub use analyze::analyze_colors;
pub use export::export_grid;
pub use import::import_photos;
