//! Команда import_photos: сканирование файлов/папок, генерация миниатюр, прогресс-события.

use std::path::Path;

use tauri::{AppHandle, Emitter, Manager};
use uuid::Uuid;
use walkdir::WalkDir;

use crate::{image::thumbs::generate_thumbnail, project::model::Photo};

/// Полезная нагрузка события прогресса импорта.
#[derive(serde::Serialize, Clone)]
struct ImportProgress {
    current: usize,
    total: usize,
}

/// Принимает пути к файлам или папкам, генерирует миниатюры, возвращает Vec<Photo>.
/// Эмитирует событие `import:progress { current, total }` после каждого файла.
#[tauri::command]
pub async fn import_photos(app: AppHandle, paths: Vec<String>) -> Result<Vec<Photo>, String> {
    let files = collect_image_files(&paths);
    let total = files.len();

    if total == 0 {
        return Ok(vec![]);
    }

    let cache_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Не удалось получить app data dir: {e}"))?
        .join("cache");

    let mut photos = Vec::with_capacity(total);

    for (i, file_path) in files.into_iter().enumerate() {
        let id = Uuid::new_v4().to_string();

        // Миниатюра не критична — продолжаем импорт даже при ошибке
        let thumb_path = generate_thumbnail(&file_path, &cache_dir, &id)
            .ok()
            .map(|p| p.to_string_lossy().into_owned());

        photos.push(Photo {
            id,
            path: file_path.to_string_lossy().into_owned(),
            thumb_path,
            dominant_color: None,
            exif_date: None,
        });

        let _ = app.emit(
            "import:progress",
            ImportProgress {
                current: i + 1,
                total,
            },
        );
    }

    Ok(photos)
}

/// Рекурсивно собирает JPG/PNG файлы из списка путей (файлы и папки смешанно).
fn collect_image_files(paths: &[String]) -> Vec<std::path::PathBuf> {
    let mut files = Vec::new();

    for path_str in paths {
        let path = Path::new(path_str);
        if path.is_dir() {
            for entry in WalkDir::new(path)
                .follow_links(true)
                .into_iter()
                .filter_map(|e| e.ok())
            {
                if entry.file_type().is_file() && is_image(entry.path()) {
                    files.push(entry.into_path());
                }
            }
        } else if path.is_file() && is_image(path) {
            files.push(path.to_path_buf());
        }
    }

    files
}

/// Возвращает true если расширение файла — JPG или PNG (без учёта регистра).
fn is_image(path: &Path) -> bool {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(str::to_ascii_lowercase);
    matches!(ext.as_deref(), Some("jpg" | "jpeg" | "png"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    #[test]
    fn collect_files_from_dir() {
        let dir = TempDir::new().unwrap();
        fs::write(dir.path().join("a.jpg"), b"fake").unwrap();
        fs::write(dir.path().join("b.PNG"), b"fake").unwrap();
        fs::write(dir.path().join("c.txt"), b"fake").unwrap();

        let paths = vec![dir.path().to_string_lossy().into_owned()];
        let files = collect_image_files(&paths);
        assert_eq!(files.len(), 2);
    }

    #[test]
    fn collect_individual_file() {
        let dir = TempDir::new().unwrap();
        let jpg = dir.path().join("photo.jpeg");
        fs::write(&jpg, b"fake").unwrap();

        let paths = vec![jpg.to_string_lossy().into_owned()];
        let files = collect_image_files(&paths);
        assert_eq!(files.len(), 1);
    }

    #[test]
    fn skip_non_image_files() {
        let dir = TempDir::new().unwrap();
        fs::write(dir.path().join("doc.pdf"), b"fake").unwrap();
        fs::write(dir.path().join("video.mp4"), b"fake").unwrap();

        let paths = vec![dir.path().to_string_lossy().into_owned()];
        let files = collect_image_files(&paths);
        assert!(files.is_empty());
    }

    #[test]
    fn is_image_case_insensitive() {
        assert!(is_image(Path::new("photo.JPG")));
        assert!(is_image(Path::new("photo.PNG")));
        assert!(is_image(Path::new("photo.jpeg")));
        assert!(is_image(Path::new("photo.JPEG")));
        assert!(!is_image(Path::new("photo.gif")));
        assert!(!is_image(Path::new("photo.webp")));
        assert!(!is_image(Path::new("photo")));
    }

    #[test]
    fn collect_from_missing_path_is_silent() {
        let paths = vec!["/nonexistent/path/to/photos".to_string()];
        let files = collect_image_files(&paths);
        assert!(files.is_empty());
    }

    #[test]
    fn collect_recursively() {
        let dir = TempDir::new().unwrap();
        let sub = dir.path().join("sub");
        fs::create_dir(&sub).unwrap();
        fs::write(sub.join("nested.jpg"), b"fake").unwrap();
        fs::write(dir.path().join("root.png"), b"fake").unwrap();

        let paths = vec![dir.path().to_string_lossy().into_owned()];
        let files = collect_image_files(&paths);
        assert_eq!(files.len(), 2);
    }
}
