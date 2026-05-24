/** Экран Library: импорт фото, прогресс обработки, виртуализированная сетка миниатюр. */
import { open as openDialog } from "@tauri-apps/plugin-dialog";
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
  // Ref чтобы listener регистрировался один раз, но всегда вызывал актуальный runImport
  const runImportRef = useRef(runImport);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    runImportRef.current = runImport;
  }, [runImport]);

  // Регистрируем системный drag-drop и drag-визуализацию только один раз.
  // aborted-флаг защищает от React Strict Mode: если cleanup отработал до того,
  // как promise разрешился — немедленно отписываемся.
  useEffect(() => {
    let aborted = false;
    let unlistenDrop: (() => void) | undefined;
    let unlistenEnter: (() => void) | undefined;
    let unlistenLeave: (() => void) | undefined;

    listen<{ paths: string[] }>("tauri://drag-drop", (event) => {
      setIsDragOver(false);
      dragCounterRef.current = 0;
      runImportRef.current(event.payload.paths);
    }).then((fn) => {
      if (aborted) fn();
      else unlistenDrop = fn;
    });

    listen("tauri://drag-enter", () => {
      setIsDragOver(true);
    }).then((fn) => {
      if (aborted) fn();
      else unlistenEnter = fn;
    });

    listen("tauri://drag-leave", () => {
      setIsDragOver(false);
    }).then((fn) => {
      if (aborted) fn();
      else unlistenLeave = fn;
    });

    const onDragOver = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", onDragOver);

    return () => {
      aborted = true;
      unlistenDrop?.();
      unlistenEnter?.();
      unlistenLeave?.();
      window.removeEventListener("dragover", onDragOver);
    };
  }, []);

  const handleImportClick = async () => {
    const result = await openDialog({
      multiple: true,
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png"] }],
    });
    if (!result) return;
    const paths = Array.isArray(result) ? result : [result];
    if (paths.length > 0) runImportRef.current(paths);
  };

  const isEmpty = photos.length === 0;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {isProcessing && (
        <ProgressBar
          current={current}
          total={total}
          label={total === 0 ? "Preparing…" : "Importing…"}
        />
      )}

      {isEmpty && !isProcessing && (
        <DropZoneEmpty isDragOver={isDragOver} onImportClick={handleImportClick} />
      )}

      {/* Скелетоны во время первого импорта когда photos ещё пусты */}
      {isEmpty && isProcessing && total > 0 && <SkeletonGrid count={total} />}

      {!isEmpty && (
        <>
          <LibraryToolbar onImportClick={handleImportClick} isProcessing={isProcessing} />
          <ThumbnailGrid photos={photos} />
        </>
      )}

      {isDragOver && !isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
          <DropHint />
        </div>
      )}
    </div>
  );
}

function LibraryToolbar({
  onImportClick,
  isProcessing,
}: {
  onImportClick: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="flex items-center border-b border-neutral-800 px-4 py-2">
      <button
        onClick={onImportClick}
        disabled={isProcessing}
        className="rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100 disabled:opacity-40"
      >
        + Import photos
      </button>
    </div>
  );
}

function DropZoneEmpty({
  isDragOver,
  onImportClick,
}: {
  isDragOver: boolean;
  onImportClick: () => void;
}) {
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
      <button
        onClick={onImportClick}
        className="rounded border border-neutral-700 px-4 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
      >
        or choose files…
      </button>
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

const SKELETON_COLS = 6;
const SKELETON_W = 156;
const SKELETON_H = 117;
const SKELETON_GAP = 4;

function SkeletonGrid({ count }: { count: number }) {
  const rows = Math.ceil(count / SKELETON_COLS);
  return (
    <div className="flex-1 overflow-hidden p-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex" style={{ gap: SKELETON_GAP, marginBottom: SKELETON_GAP }}>
          {Array.from({ length: Math.min(SKELETON_COLS, count - r * SKELETON_COLS) }).map(
            (_, c) => (
              <div
                key={c}
                className="animate-pulse rounded bg-neutral-800"
                style={{ width: SKELETON_W, height: SKELETON_H, flexShrink: 0 }}
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
}
