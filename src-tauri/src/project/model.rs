//! Модель данных проекта Beautiful Grid. Соответствует схеме .bgrid (PRD Приложение B).

use serde::{Deserialize, Serialize};

pub type PhotoId = String;

/// Запись о фото в проекте.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Photo {
    pub id: PhotoId,
    /// Абсолютный путь к оригиналу (только чтение, никогда не модифицируется).
    pub path: String,
    /// Путь к WebP-миниатюре в кэше, None до генерации.
    pub thumb_path: Option<String>,
    /// Доминирующий цвет [R, G, B], None до анализа.
    pub dominant_color: Option<[u8; 3]>,
    /// Дата из EXIF, None если недоступна.
    pub exif_date: Option<String>,
}

/// Настройки проекта.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectSettings {
    /// Количество фото в ряду сетки.
    pub columns: u32,
    pub theme: String,
}

impl Default for ProjectSettings {
    fn default() -> Self {
        Self {
            columns: 4,
            theme: "dark".to_string(),
        }
    }
}

/// Полная модель проекта, сериализуемая в .bgrid (JSON).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub project_name: String,
    /// Версия схемы .bgrid. Всегда 1 для v1.0.
    pub version: u32,
    pub created_at: String,
    pub settings: ProjectSettings,
    pub photos: Vec<Photo>,
    /// Порядок отображения фото в сетке (список ID).
    pub grid_order: Vec<PhotoId>,
}
