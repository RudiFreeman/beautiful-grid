//! Сохранение и загрузка проекта в формате .bgrid (JSON).

use std::path::Path;

use chrono::Utc;

use super::model::{Project, ProjectSettings};

/// Создаёт новый пустой проект с заданным именем.
pub fn new_project(name: impl Into<String>) -> Project {
    Project {
        project_name: name.into(),
        version: 1,
        created_at: Utc::now().to_rfc3339(),
        settings: ProjectSettings::default(),
        photos: vec![],
        grid_order: vec![],
    }
}

/// Сохраняет проект в файл .bgrid по указанному пути.
pub fn save_project(project: &Project, path: impl AsRef<Path>) -> Result<(), String> {
    let json = serde_json::to_string_pretty(project)
        .map_err(|e| format!("Ошибка сериализации: {e}"))?;
    std::fs::write(path, json).map_err(|e| format!("Ошибка записи файла: {e}"))
}

/// Загружает проект из файла .bgrid.
pub fn open_project(path: impl AsRef<Path>) -> Result<Project, String> {
    let json = std::fs::read_to_string(path)
        .map_err(|e| format!("Ошибка чтения файла: {e}"))?;
    serde_json::from_str(&json).map_err(|e| format!("Ошибка десериализации: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use super::super::model::Photo;
    use tempfile::NamedTempFile;

    #[test]
    fn roundtrip_empty_project() {
        let project = new_project("Test Project");
        assert_eq!(project.project_name, "Test Project");
        assert_eq!(project.version, 1);

        let file = NamedTempFile::new().unwrap();
        save_project(&project, file.path()).unwrap();

        let loaded = open_project(file.path()).unwrap();
        assert_eq!(loaded.project_name, "Test Project");
        assert_eq!(loaded.version, 1);
        assert!(loaded.photos.is_empty());
        assert!(loaded.grid_order.is_empty());
        assert_eq!(loaded.settings.columns, 4);
        assert_eq!(loaded.settings.theme, "dark");
    }

    #[test]
    fn roundtrip_with_photos() {
        let mut project = new_project("Wedding 2026-05");
        project.photos.push(Photo {
            id: "abc-123".to_string(),
            path: "/photos/img001.jpg".to_string(),
            thumb_path: Some(".cache/abc-123.webp".to_string()),
            dominant_color: Some([180, 120, 90]),
            exif_date: None,
        });
        project.grid_order.push("abc-123".to_string());

        let file = NamedTempFile::new().unwrap();
        save_project(&project, file.path()).unwrap();

        let loaded = open_project(file.path()).unwrap();
        assert_eq!(loaded.photos.len(), 1);
        assert_eq!(loaded.photos[0].id, "abc-123");
        assert_eq!(loaded.photos[0].dominant_color, Some([180, 120, 90]));
        assert_eq!(loaded.grid_order, vec!["abc-123"]);
    }

    #[test]
    fn open_invalid_json_returns_error() {
        let file = NamedTempFile::new().unwrap();
        std::fs::write(file.path(), "not valid json at all").unwrap();
        assert!(open_project(file.path()).is_err());
    }

    #[test]
    fn open_missing_file_returns_error() {
        assert!(open_project("/nonexistent/path/project.bgrid").is_err());
    }

    #[test]
    fn save_creates_valid_json() {
        let project = new_project("JSON Check");
        let file = NamedTempFile::new().unwrap();
        save_project(&project, file.path()).unwrap();

        let raw = std::fs::read_to_string(file.path()).unwrap();
        let val: serde_json::Value = serde_json::from_str(&raw).unwrap();
        assert_eq!(val["project_name"], "JSON Check");
        assert_eq!(val["version"], 1);
        assert!(val["grid_order"].as_array().unwrap().is_empty());
    }
}
