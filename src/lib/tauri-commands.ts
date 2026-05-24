/** Типизированные обёртки над Tauri-командами Rust-бэкенда. */
import { invoke } from "@tauri-apps/api/core";

import type { Photo, Project } from "../types";

export async function importPhotos(paths: string[]): Promise<Photo[]> {
  return invoke("import_photos", { paths });
}

export async function analyzeColors(
  photos: { id: string; path: string }[],
): Promise<Record<string, [number, number, number]>> {
  return invoke("analyze_colors", { photos });
}

export async function sortPhotosByColor(
  photos: { id: string; dominant_color: [number, number, number] }[],
): Promise<string[]> {
  return invoke("sort_photos_by_color", { photos });
}

export async function exportGrid(params: {
  photos: { id: string; path: string }[];
  gridOrder: string[];
  columns: number;
  outputPath: string;
  format: string;
  quality: number;
}): Promise<void> {
  return invoke("export_grid", {
    photos: params.photos,
    gridOrder: params.gridOrder,
    columns: params.columns,
    outputPath: params.outputPath,
    format: params.format,
    quality: params.quality,
  });
}

export async function newProject(name: string): Promise<Project> {
  return invoke("new_project", { name });
}

export async function saveProject(project: Project, path: string): Promise<void> {
  return invoke("save_project", { project, path });
}

export async function openProject(path: string): Promise<Project> {
  return invoke("open_project", { path });
}
