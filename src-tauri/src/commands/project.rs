//! Tauri-команды для управления проектом: создание, сохранение, загрузка.

use crate::project::{
    io::{new_project as make_project, open_project as load_from_disk, save_project as write_to_disk},
    Project,
};

/// Создаёт новый пустой проект с заданным именем.
#[tauri::command]
pub fn new_project(name: String) -> Result<Project, String> {
    Ok(make_project(name))
}

/// Сохраняет проект в файл .bgrid по указанному пути.
/// Путь выбирается на frontend через @tauri-apps/plugin-dialog.
#[tauri::command]
pub fn save_project(project: Project, path: String) -> Result<(), String> {
    write_to_disk(&project, &path)
}

/// Загружает проект из файла .bgrid по указанному пути.
#[tauri::command]
pub fn open_project(path: String) -> Result<Project, String> {
    load_from_disk(&path)
}
