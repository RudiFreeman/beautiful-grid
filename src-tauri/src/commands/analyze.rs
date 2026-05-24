//! Команда analyze_colors: извлечение доминирующего цвета для каждого фото.
//! Реализация (kmeans/color-thief + rayon) — Sprint 1.

/// Запускает извлечение доминирующего цвета для указанных UUID фото.
/// Возвращает map { uuid -> [R, G, B] }.
#[tauri::command]
pub async fn analyze_colors(
    photo_ids: Vec<String>,
) -> Result<std::collections::HashMap<String, [u8; 3]>, String> {
    // TODO Sprint 1: параллельно обработать фото через rayon,
    // извлечь доминирующий цвет, эмитировать прогресс.
    let _ = photo_ids;
    Ok(std::collections::HashMap::new())
}
