/** Экран Export: настройка формата, экспорт сетки в PNG/JPG. */
import { listen } from "@tauri-apps/api/event";
import { save as saveDialog } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

import { ProgressBar } from "../components/ProgressBar";
import { exportGrid } from "../lib/tauri-commands";
import { useAppStore } from "../store/appStore";

export function ExportPage() {
  const photos = useAppStore((s) => s.photos);
  const gridOrder = useAppStore((s) => s.gridOrder);
  const columns = useAppStore((s) => s.settings.columns);

  const [format, setFormat] = useState<"jpg" | "png">("jpg");
  const [quality, setQuality] = useState(90);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<[number, number]>([0, 0]);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    const outputPath = await saveDialog({
      filters: [
        {
          name: format === "jpg" ? "JPEG Image" : "PNG Image",
          extensions: [format === "jpg" ? "jpg" : "png"],
        },
      ],
      defaultPath: `beautiful-grid.${format}`,
    });

    if (!outputPath) return;

    setIsExporting(true);
    setDone(false);
    setProgress([0, gridOrder.length]);

    const unlisten = await listen<{ current: number; total: number }>(
      "export:progress",
      ({ payload }) => setProgress([payload.current, payload.total]),
    );

    try {
      const photoRefs = photos.map((p) => ({ id: p.id, path: p.path }));
      await exportGrid({
        photos: photoRefs,
        gridOrder,
        columns,
        outputPath,
        format,
        quality,
      });
      setDone(true);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      unlisten();
      setIsExporting(false);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-500">
        <p className="text-sm">Import photos in Library first</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-base font-semibold text-neutral-100">Export Grid</h1>

      <div className="flex flex-col gap-4">
        {/* Формат */}
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm text-neutral-400">Format</span>
          <div className="flex gap-2">
            {(["jpg", "png"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={[
                  "rounded border px-4 py-1.5 text-sm transition-colors",
                  format === f
                    ? "border-neutral-400 text-neutral-100"
                    : "border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300",
                ].join(" ")}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Качество (только для JPG) */}
        {format === "jpg" && (
          <div className="flex items-center gap-4">
            <span className="w-20 text-sm text-neutral-400">Quality</span>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-40 accent-neutral-300"
            />
            <span className="w-8 text-right font-mono text-sm text-neutral-300">
              {quality}
            </span>
          </div>
        )}

        <p className="text-xs text-neutral-600">
          {gridOrder.length} photos · {columns} col{columns !== 1 ? "s" : ""} ·{" "}
          {Math.ceil(gridOrder.length / columns)} rows
        </p>
      </div>

      {isExporting && (
        <ProgressBar
          current={progress[0]}
          total={progress[1]}
          label="Exporting…"
        />
      )}
      {done && !isExporting && (
        <p className="text-sm text-green-400">Export complete!</p>
      )}

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="mt-auto w-full rounded-xl bg-neutral-200 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white disabled:opacity-40"
      >
        {isExporting ? "Exporting…" : "Export"}
      </button>
    </div>
  );
}
