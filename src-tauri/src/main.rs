//! Точка входа Tauri-приложения. Только вызов run() из lib.rs.
// Скрываем консоль на Windows в release-сборке
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    beautiful_grid_lib::run()
}
