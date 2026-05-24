//! Команды analyze_colors и sort_photos_by_color.

use std::collections::HashMap;
use std::path::Path;
use std::sync::atomic::{AtomicUsize, Ordering};

use rayon::prelude::*;
use tauri::{AppHandle, Emitter};

use crate::image::color::{extract_dominant_color, sort_by_hsl};

/// Минимальная информация о фото для запуска анализа.
#[derive(serde::Deserialize)]
pub struct PhotoRef {
    pub id: String,
    /// Путь к миниатюре (предпочтительно) или к оригиналу.
    pub path: String,
}

/// Фото с уже известным цветом — для сортировки.
#[derive(serde::Deserialize)]
pub struct PhotoWithColor {
    pub id: String,
    pub dominant_color: [u8; 3],
}

#[derive(serde::Serialize, Clone)]
struct AnalyzeProgress {
    current: usize,
    total: usize,
}

/// Параллельно извлекает доминирующий цвет для каждого фото.
/// Эмитирует `analyze:progress { current, total }` после каждого файла.
/// Возвращает map { id -> [R, G, B] } только для успешно обработанных фото.
#[tauri::command]
pub async fn analyze_colors(
    app: AppHandle,
    photos: Vec<PhotoRef>,
) -> Result<HashMap<String, [u8; 3]>, String> {
    let total = photos.len();
    let counter = AtomicUsize::new(0);

    let results: Vec<(String, Option<[u8; 3]>)> = photos
        .par_iter()
        .map(|photo| {
            let color = extract_dominant_color(Path::new(&photo.path)).ok();
            let current = counter.fetch_add(1, Ordering::Relaxed) + 1;
            let _ = app.emit("analyze:progress", AnalyzeProgress { current, total });
            (photo.id.clone(), color)
        })
        .collect();

    let map = results
        .into_iter()
        .filter_map(|(id, color)| color.map(|c| (id, c)))
        .collect();

    Ok(map)
}

/// Сортирует фото по HSL-градиенту и возвращает новый порядок ID.
#[tauri::command]
pub fn sort_photos_by_color(photos: Vec<PhotoWithColor>) -> Vec<String> {
    let pairs: Vec<(String, [u8; 3])> = photos
        .into_iter()
        .map(|p| (p.id, p.dominant_color))
        .collect();
    sort_by_hsl(&pairs)
}
