//! Команда export_grid: склейка фото в одно изображение PNG/JPG.
//! Реализация (image crate, тайловая запись) — Sprint 1.

/// Экспортирует сетку в файл по указанному пути.
/// `grid_order` — упорядоченный список UUID фото; `columns` — число фото в ряду.
#[tauri::command]
pub async fn export_grid(
    grid_order: Vec<String>,
    columns: u32,
    output_path: String,
    format: String,
) -> Result<(), String> {
    // TODO Sprint 1: считать миниатюры из кэша, склеить через image crate,
    // записать в output_path с нужным форматом (PNG/JPG).
    let _ = (grid_order, columns, output_path, format);
    Ok(())
}
