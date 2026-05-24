/** Главный Zustand-стор приложения. Хранит состояние текущего проекта и UI. */
import { create } from "zustand";
import type { Photo, PhotoId, ProjectSettings } from "../types";

interface AppState {
  /** Имя текущего открытого проекта. */
  projectName: string;
  photos: Photo[];
  gridOrder: PhotoId[];
  settings: ProjectSettings;
  /** Флаг: идёт ли фоновая обработка фото. */
  isProcessing: boolean;
  /** Прогресс обработки: [текущий, всего]. */
  processingProgress: [number, number];

  setProjectName: (name: string) => void;
  setPhotos: (photos: Photo[]) => void;
  setGridOrder: (order: PhotoId[]) => void;
  setColumns: (columns: number) => void;
  setProcessing: (active: boolean, current?: number, total?: number) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  projectName: "Новый проект",
  photos: [],
  gridOrder: [],
  settings: { columns: 4, theme: "dark" },
  isProcessing: false,
  processingProgress: [0, 0],

  setProjectName: (name) => set({ projectName: name }),
  setPhotos: (photos) => set({ photos }),
  setGridOrder: (order) => set({ gridOrder: order }),
  setColumns: (columns) => set((s) => ({ settings: { ...s.settings, columns } })),
  setProcessing: (active, current = 0, total = 0) =>
    set({ isProcessing: active, processingProgress: [current, total] }),
}));
