/** Виртуализированная сетка миниатюр для Library. Justified-layout: одинаковая высота строки, ширина пропорциональна aspect ratio. */
import { convertFileSrc } from "@tauri-apps/api/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLayoutEffect, useRef, useState } from "react";

import type { Photo } from "../types";

const COLS = 6;
const TARGET_ROW_H = 156;
const GAP = 4;

function naturalWidthAtTargetH(photo: Photo): number {
  if (photo.width > 0 && photo.height > 0) {
    return Math.round(TARGET_ROW_H * (photo.width / photo.height));
  }
  return TARGET_ROW_H; // квадратный fallback
}

interface RowLayout {
  photos: Photo[];
  height: number;
  widths: number[];
}

/** Justified-раскладка: строка масштабируется так, чтобы заполнить containerWidth. */
function computeLayouts(photos: Photo[], containerWidth: number): RowLayout[] {
  const rowCount = Math.ceil(photos.length / COLS);
  return Array.from({ length: rowCount }, (_, r) => {
    const rowPhotos = photos.slice(r * COLS, (r + 1) * COLS);
    const n = rowPhotos.length;
    const natWidths = rowPhotos.map(naturalWidthAtTargetH);
    const isLastRow = r === rowCount - 1 && n < COLS;

    if (isLastRow) {
      // Последнюю неполную строку не растягиваем
      return { photos: rowPhotos, height: TARGET_ROW_H, widths: natWidths };
    }

    const totalNatWidth = natWidths.reduce((a, b) => a + b, 0);
    const scale = (containerWidth - GAP * (n - 1)) / totalNatWidth;
    return {
      photos: rowPhotos,
      height: Math.round(TARGET_ROW_H * scale),
      widths: natWidths.map((w) => Math.round(w * scale)),
    };
  });
}

interface Props {
  photos: Photo[];
}

export function ThumbnailGrid({ photos }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layouts = containerWidth > 0 ? computeLayouts(photos, containerWidth) : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: layouts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (layouts[i]?.height ?? TARGET_ROW_H) + GAP,
    overscan: 4,
  });

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto p-2"
      style={{ contain: "strict" }}
    >
      <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          const layout = layouts[vRow.index];
          if (!layout) return null;

          return (
            <div
              key={vRow.key}
              className="absolute left-0 flex"
              style={{ top: vRow.start, gap: GAP }}
            >
              {layout.photos.map((photo, i) => (
                <Thumbnail
                  key={photo.id}
                  photo={photo}
                  width={layout.widths[i]!}
                  height={layout.height}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Thumbnail({ photo, width, height }: { photo: Photo; width: number; height: number }) {
  const src = convertFileSrc(photo.thumbPath ?? photo.path);

  return (
    <div
      className="overflow-hidden rounded bg-neutral-800"
      style={{ width, height, flexShrink: 0 }}
    >
      <img
        src={src}
        width={width}
        height={height}
        className="h-full w-full object-cover"
        loading="lazy"
        alt=""
        decoding="async"
      />

      {photo.dominantColor && (
        <div
          className="h-0.5 w-full"
          style={{ background: `rgb(${photo.dominantColor.join(",")})` }}
        />
      )}
    </div>
  );
}
