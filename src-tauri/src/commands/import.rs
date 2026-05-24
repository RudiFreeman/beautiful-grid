//! Команда import_photos: приём путей к файлам/папке от frontend.
//! Реализация (генерация WebP-миниатюр, чтение метаданных) — Sprint 1.

/// Принимает список путей к файлам или папкам и запускает импорт в проект.
/// Возвращает список UUID добавленных фото.
#[tauri::command]
pub async fn import_photos(paths: Vec<String>) -> Result<Vec<String>, String> {
    // TODO Sprint 1: сканировать папки, генерировать миниатюры через image/,
    // эмитировать события прогресса через tauri::Emitter.
    let _ = paths;
    Ok(vec![])
}
