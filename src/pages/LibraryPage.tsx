/** Экран Library: импорт фото, прогресс обработки, виртуализированная сетка миниатюр. */
import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";

import { ProgressBar } from "../components/ProgressBar";
import { ThumbnailGrid } from "../components/ThumbnailGrid";
import { useImport } from "../hooks/useImport";
import { useAppStore } from "../store/appStore";

export function LibraryPage() {
  const photos = useAppStore((s) => s.photos);
  const isProcessing = useAppStore((s) => s.isProcessing);
  const [current, total] = useAppStore((s) => s.processingProgress);

  const { runImport } = useImport();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0); // счётчик для корректного drag enter/leave

  // Слушаем системный drag-drop от ОС (Tauri v2)
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    listen<{ paths: string[] }>("tauri://drag-drop", (event) => {
      setIsDragOver(false);
      dragCounterRef.current = 0;
      runImport(event.payload.paths);
    }).then((fn) => {
      unlisten = fn;
    });

    // Визуальная подсветка зоны при наведении файла из ОС
    const onDragEnter = () => {
      dragCounterRef.current++;
      setIsDragOver(true);
    };
    const onDragLeave = () => {
      dragCounterRef.current--;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragOver(false);
      }
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("dragover", (e) => e.preventDefault());

    return () => {
      unlisten?.();
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
    };
  }, [runImport]);

  const isEmpty = photos.length === 0;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Прогресс-бар */}
      {isProcessing && (
        <ProgressBar
          current={current}
          total={total}
          label={total === 0 ? "Preparing…" : "Importing…"}
        />
      )}

      {/* Пустое состояние — большая дроп-зона */}
      {isEmpty && !isProcessing && (
        <DropZoneEmpty isDragOver={isDragOver} />
      )}

      {/* Сетка миниатюр */}
      {!isEmpty && <ThumbnailGrid photos={photos} />}

      {/* Полупрозрачный оверлей при перетаскивании поверх фото */}
      {isDragOver && !isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
          <DropHint />
        </div>
      )}
    </div>
  );
}

function DropZoneEmpty({ isDragOver }: { isDragOver: boolean }) {
  return (
    <div
      className={[
        "flex flex-1 flex-col items-center justify-center gap-4 rounded-lg m-4 border-2 border-dashed transition-colors",
        isDragOver
          ? "border-neutral-400 bg-neutral-800/50"
          : "border-neutral-700 bg-transparent",
      ].join(" ")}
    >
      <svg
        className="h-14 w-14 text-neutral-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-300">
          {isDragOver ? "Release to import" : "Drag a folder or photos here"}
        </p>
        <p className="mt-1 text-xs text-neutral-600">JPG and PNG supported</p>
      </div>
    </div>
  );
}

function DropHint() {
  return (
    <div className="rounded-xl border border-neutral-600 bg-neutral-900/90 px-8 py-6 text-center shadow-xl">
      <p className="text-sm font-medium text-neutral-200">Drop to add photos</p>
    </div>
  );
}
