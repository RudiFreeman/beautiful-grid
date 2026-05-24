//! Генерация JPEG-миниатюр для фотографий.
//! Прямой доступ к оригинальным файлам пользователя разрешён только из этого модуля.

use std::path::{Path, PathBuf};

const THUMB_MAX_PX: u32 = 400;

/// Генерирует JPEG-миниатюру из `src_path` и сохраняет в `cache_dir/{id}.jpg`.
/// Возвращает (путь к миниатюре, ширина оригинала, высота оригинала).
pub fn generate_thumbnail(
    src_path: &Path,
    cache_dir: &Path,
    id: &str,
) -> Result<(PathBuf, u32, u32), String> {
    let img = image::open(src_path)
        .map_err(|e| format!("Не удалось открыть {}: {e}", src_path.display()))?;

    let (width, height) = (img.width(), img.height());
    let thumb = img.thumbnail(THUMB_MAX_PX, THUMB_MAX_PX);

    std::fs::create_dir_all(cache_dir)
        .map_err(|e| format!("Не удалось создать кэш-директорию: {e}"))?;

    let out_path = cache_dir.join(format!("{id}.jpg"));
    thumb
        .save_with_format(&out_path, image::ImageFormat::Jpeg)
        .map_err(|e| format!("Не удалось сохранить миниатюру: {e}"))?;

    Ok((out_path, width, height))
}

/// Читает размеры изображения без декодирования пикселей (только заголовок).
pub fn read_dimensions(src_path: &Path) -> Result<(u32, u32), String> {
    let reader = image::ImageReader::open(src_path)
        .map_err(|e| format!("Не удалось открыть {}: {e}", src_path.display()))?
        .with_guessed_format()
        .map_err(|e| format!("Не удалось определить формат: {e}"))?;
    reader
        .into_dimensions()
        .map_err(|e| format!("Не удалось прочитать размеры: {e}"))
}
