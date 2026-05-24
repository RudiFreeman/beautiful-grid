/** Главный Zustand-стор приложения. Хранит состояние текущего проекта и UI. */
import { create } from "zustand";

import type { Photo, PhotoId, ProjectSettings } from "../types";

interface AppState {
  projectName: string;
  photos: Photo[];
  gridOrder: PhotoId[];
  settings: ProjectSettings;
  isProcessing: boolean;
  processingProgress: [number, number];

  setProjectName: (name: string) => void;
  setPhotos: (photos: Photo[]) => void;
  addPhotos: (photos: Photo[]) => void;
  updateColors: (colors: Record<string, [number, number, number]>) => void;
  setGridOrder: (order: PhotoId[]) => void;
  setColumns: (columns: number) => void;
  setProcessing: (active: boolean, current?: number, total?: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  projectName: "Новый проект",
  photos: [] as Photo[],
  gridOrder: [] as PhotoId[],
  settings: { columns: 4, theme: "dark" } as ProjectSettings,
  isProcessing: false,
  processingProgress: [0, 0] as [number, number],
};

export const useAppStore = create<AppState>()((set) => ({
  ...INITIAL_STATE,

  setProjectName: (name) => set({ projectName: name }),

  setPhotos: (photos) => set({ photos, gridOrder: photos.map((p) => p.id) }),

  addPhotos: (incoming) =>
    set((s) => {
      const existingPaths = new Set(s.photos.map((p) => p.path));
      const fresh = incoming.filter((p) => !existingPaths.has(p.path));
      return {
        photos: [...s.photos, ...fresh],
        gridOrder: [...s.gridOrder, ...fresh.map((p) => p.id)],
      };
    }),

  updateColors: (colors) =>
    set((s) => ({
      photos: s.photos.map((p) =>
        colors[p.id] ? { ...p, dominantColor: colors[p.id] } : p,
      ),
    })),

  setGridOrder: (order) => set({ gridOrder: order }),

  setColumns: (columns) => set((s) => ({ settings: { ...s.settings, columns } })),

  setProcessing: (active, current = 0, total = 0) =>
    set({ isProcessing: active, processingProgress: [current, total] }),

  reset: () => set(INITIAL_STATE),
}));
