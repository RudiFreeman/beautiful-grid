//! Команда export_grid: склейка фото в одно PNG/JPG изображение.

use std::collections::HashMap;
use std::path::Path;

use image::{imageops, ImageFormat, RgbImage};
use tauri::{AppHandle, Emitter};

/// Ширина ячейки сетки в пикселях (4:3 ландшафт).
const CELL_W: u32 = 400;
const CELL_H: u32 = 300;

/// Минимальная информация о фото для экспорта.
#[derive(serde::Deserialize)]
pub struct ExportPhotoRef {
    pub id: String,
    /// Абсолютный путь к оригинальному файлу.
    pub path: String,
}

#[derive(serde::Serialize, Clone)]
struct ExportProgress {
    current: usize,
    total: usize,
}

/// Экспортирует сетку в одно PNG или JPG изображение.
///
/// - `photos` — все фото проекта с путями к оригиналам.
/// - `grid_order` — упорядоченный список ID фото.
/// - `columns` — количество фото в ряду.
/// - `output_path` — путь к файлу результата.
/// - `format` — "png" или "jpg".
/// - `quality` — качество JPEG (0–100).
#[tauri::command]
pub async fn export_grid(
    app: AppHandle,
    photos: Vec<ExportPhotoRef>,
    grid_order: Vec<String>,
    columns: u32,
    output_path: String,
    format: String,
    quality: u8,
) -> Result<(), String> {
    if columns == 0 {
        return Err("columns должен быть ≥ 1".to_string());
    }

    // Строим map id → path для быстрого поиска
    let path_map: HashMap<&str, &str> = photos
        .iter()
        .map(|p| (p.id.as_str(), p.path.as_str()))
        .collect();

    // Оставляем только те ID, для которых есть путь
    let ordered: Vec<&str> = grid_order
        .iter()
        .filter_map(|id| path_map.get(id.as_str()).copied())
        .collect();

    let total = ordered.len();
    if total == 0 {
        return Err("Нет фото для экспорта".to_string());
    }

    let rows = (total as u32).div_ceil(columns);
    let canvas_w = columns * CELL_W;
    let canvas_h = rows * CELL_H;

    let mut canvas = RgbImage::new(canvas_w, canvas_h);

    for (i, img_path) in ordered.iter().enumerate() {
        let cell = load_cell(Path::new(img_path))?;
        let col = (i as u32) % columns;
        let row = (i as u32) / columns;
        imageops::replace(&mut canvas, &cell, (col * CELL_W) as i64, (row * CELL_H) as i64);

        let _ = app.emit(
            "export:progress",
            ExportProgress {
                current: i + 1,
                total,
            },
        );
    }

    save_canvas(canvas, &output_path, &format, quality)
}

/// Загружает изображение и обрезает его по центру до размера CELL_W × CELL_H.
fn load_cell(path: &Path) -> Result<RgbImage, String> {
    let img = image::open(path)
        .map_err(|e| format!("Не удалось открыть {}: {e}", path.display()))?;

    // Масштабируем так, чтобы оба размера были ≥ размера ячейки
    let src_w = img.width() as f64;
    let src_h = img.height() as f64;
    let scale = (CELL_W as f64 / src_w).max(CELL_H as f64 / src_h);
    let scaled_w = (src_w * scale).round() as u32;
    let scaled_h = (src_h * scale).round() as u32;

    let scaled = img.resize_exact(scaled_w, scaled_h, imageops::FilterType::Lanczos3);

    // Center crop
    let x = (scaled_w.saturating_sub(CELL_W)) / 2;
    let y = (scaled_h.saturating_sub(CELL_H)) / 2;
    Ok(scaled.crop_imm(x, y, CELL_W, CELL_H).into_rgb8())
}

/// Сохраняет холст в файл. PNG — без потерь, JPG — с заданным качеством.
fn save_canvas(canvas: RgbImage, path: &str, format: &str, quality: u8) -> Result<(), String> {
    match format.to_ascii_lowercase().as_str() {
        "png" => canvas
            .save_with_format(path, ImageFormat::Png)
            .map_err(|e| format!("Ошибка записи PNG: {e}")),
        "jpg" | "jpeg" => {
            use image::codecs::jpeg::JpegEncoder;
            let file =
                std::fs::File::create(path).map_err(|e| format!("Не удалось создать файл: {e}"))?;
            JpegEncoder::new_with_quality(file, quality)
                .encode_image(&canvas)
                .map_err(|e| format!("Ошибка записи JPEG: {e}"))
        }
        other => Err(format!("Неизвестный формат: {other}")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{Rgb, RgbImage};
    use tempfile::TempDir;

    fn make_test_image(dir: &std::path::Path, name: &str, w: u32, h: u32) -> String {
        let img = RgbImage::from_fn(w, h, |x, _| Rgb([x as u8, 128, 64]));
        let path = dir.join(name);
        img.save_with_format(&path, ImageFormat::Jpeg).unwrap();
        path.to_string_lossy().into_owned()
    }

    #[test]
    fn load_cell_center_crops_landscape() {
        let dir = TempDir::new().unwrap();
        let path_str = make_test_image(dir.path(), "wide.jpg", 1200, 800);
        let cell = load_cell(Path::new(&path_str)).unwrap();
        assert_eq!(cell.width(), CELL_W);
        assert_eq!(cell.height(), CELL_H);
    }

    #[test]
    fn load_cell_center_crops_portrait() {
        let dir = TempDir::new().unwrap();
        let path_str = make_test_image(dir.path(), "tall.jpg", 600, 900);
        let cell = load_cell(Path::new(&path_str)).unwrap();
        assert_eq!(cell.width(), CELL_W);
        assert_eq!(cell.height(), CELL_H);
    }

    #[test]
    fn load_cell_missing_file_returns_error() {
        assert!(load_cell(Path::new("/no/such/photo.jpg")).is_err());
    }

    #[test]
    fn save_canvas_png() {
        let dir = TempDir::new().unwrap();
        let out = dir.path().join("out.png").to_string_lossy().into_owned();
        let canvas = RgbImage::new(CELL_W, CELL_H);
        save_canvas(canvas, &out, "png", 90).unwrap();
        assert!(std::path::Path::new(&out).exists());
    }

    #[test]
    fn save_canvas_jpg() {
        let dir = TempDir::new().unwrap();
        let out = dir.path().join("out.jpg").to_string_lossy().into_owned();
        let canvas = RgbImage::new(CELL_W, CELL_H);
        save_canvas(canvas, &out, "jpg", 85).unwrap();
        assert!(std::path::Path::new(&out).exists());
    }

    #[test]
    fn save_canvas_unknown_format_errors() {
        let dir = TempDir::new().unwrap();
        let out = dir.path().join("out.bmp").to_string_lossy().into_owned();
        let canvas = RgbImage::new(CELL_W, CELL_H);
        assert!(save_canvas(canvas, &out, "bmp", 80).is_err());
    }
}
