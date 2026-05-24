//! Корень Rust-крейта: инициализация Tauri и регистрация команд.

mod commands;
mod image;
mod project;

// generate_handler! требует функции прямо в scope, не через путь модуля
use commands::{analyze_colors, export_grid, import_photos};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            import_photos,
            analyze_colors,
            export_grid,
        ])
        .run(tauri::generate_context!())
        .expect("ошибка при запуске приложения");
}
