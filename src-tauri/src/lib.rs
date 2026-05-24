//! Корень Rust-крейта: инициализация Tauri и регистрация команд.

mod commands;
mod image;
mod project;

use commands::{
    analyze_colors, export_grid, import_photos, new_project, open_project, save_project,
    sort_photos_by_color,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            import_photos,
            analyze_colors,
            sort_photos_by_color,
            export_grid,
            new_project,
            save_project,
            open_project,
        ])
        .run(tauri::generate_context!())
        .expect("ошибка при запуске приложения");
}
