//! Генерация JPEG-миниатюр для фотографий.
//! Прямой доступ к оригинальным файлам пользователя разрешён только из этого модуля.

use std::path::{Path, PathBuf};

const THUMB_MAX_PX: u32 = 400;

/// Генерирует JPEG-миниатюру из `src_path` и сохраняет в `cache_dir/{id}.jpg`.
/// Возвращает абсолютный путь к файлу миниатюры.
pub fn generate_thumbnail(src_path: &Path, cache_dir: &Path, id: &str) -> Result<PathBuf, String> {
    let img = image::open(src_path)
        .map_err(|e| format!("Не удалось открыть {}: {e}", src_path.display()))?;

    let thumb = img.thumbnail(THUMB_MAX_PX, THUMB_MAX_PX);

    std::fs::create_dir_all(cache_dir)
        .map_err(|e| format!("Не удалось создать кэш-директорию: {e}"))?;

    let out_path = cache_dir.join(format!("{id}.jpg"));
    thumb
        .save_with_format(&out_path, image::ImageFormat::Jpeg)
        .map_err(|e| format!("Не удалось сохранить миниатюру: {e}"))?;

    Ok(out_path)
}
