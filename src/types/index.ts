/** Общие TypeScript-типы проекта. Модель данных соответствует .bgrid §B PRD. */

export type PhotoId = string;
export type GroupId = string;

/** Запись о фото в библиотеке проекта. */
export interface Photo {
  id: PhotoId;
  /** Абсолютный путь к оригинальному файлу (только чтение). */
  path: string;
  /** Путь к WebP-миниатюре в кэше проекта. */
  thumbPath: string | null;
  /** Доминирующий цвет [R, G, B], заполняется после analyze_colors. */
  dominantColor: [number, number, number] | null;
  /** Дата из EXIF или null. */
  exifDate: string | null;
}

/** Настройки проекта. */
export interface ProjectSettings {
  columns: number;
  theme: "dark" | "light";
}

/** Полная модель проекта, сериализуемая в .bgrid. */
export interface Project {
  projectName: string;
  version: 1;
  createdAt: string;
  settings: ProjectSettings;
  photos: Photo[];
  gridOrder: PhotoId[];
}

/** Маршруты навигации между тремя экранами. */
export type AppRoute = "/library" | "/grid" | "/export";
