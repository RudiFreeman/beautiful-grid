/** Хук управления импортом: вызывает Rust-команды и обновляет стор. */
import { listen } from "@tauri-apps/api/event";
import { useCallback } from "react";

import { analyzeColors, importPhotos } from "../lib/tauri-commands";
import { useAppStore } from "../store/appStore";

export function useImport() {
  const { addPhotos, updateColors, setProcessing } = useAppStore();

  const runImport = useCallback(
    async (paths: string[]) => {
      if (paths.length === 0) return;

      setProcessing(true, 0, 0);

      // Фаза 1: импорт и генерация миниатюр
      const unlistenImport = await listen<{ current: number; total: number }>(
        "import:progress",
        ({ payload }) => setProcessing(true, payload.current, payload.total),
      );

      let photos;
      try {
        photos = await importPhotos(paths);
      } finally {
        unlistenImport();
      }

      addPhotos(photos);

      if (photos.length === 0) {
        setProcessing(false);
        return;
      }

      // Фаза 2: извлечение доминирующего цвета (передаём миниатюры для скорости)
      const photoRefs = photos.map((p) => ({
        id: p.id,
        path: p.thumbPath ?? p.path,
      }));

      const unlistenAnalyze = await listen<{ current: number; total: number }>(
        "analyze:progress",
        ({ payload }) => setProcessing(true, payload.current, payload.total),
      );

      try {
        const colors = await analyzeColors(photoRefs);
        updateColors(colors);
      } finally {
        unlistenAnalyze();
      }

      setProcessing(false);
    },
    [addPhotos, updateColors, setProcessing],
  );

  return { runImport };
}
