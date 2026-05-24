/** Виртуализированная сетка миниатюр для Library. */
import { convertFileSrc } from "@tauri-apps/api/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { Photo } from "../types";

const COLS = 6;
const THUMB_W = 156;
const GAP = 4;
const FALLBACK_RATIO = 4 / 3; // используется если размеры не известны

function thumbHeight(photo: Photo): number {
  if (photo.width > 0 && photo.height > 0) {
    return Math.round(THUMB_W * (photo.height / photo.width));
  }
  return Math.round(THUMB_W * FALLBACK_RATIO);
}

interface Props {
  photos: Photo[];
}

export function ThumbnailGrid({ photos }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(photos.length / COLS);

  // Высота каждой строки = максимальная высота фото в строке + отступ
  const rowHeights = Array.from({ length: rowCount }, (_, r) => {
    const rowPhotos = photos.slice(r * COLS, (r + 1) * COLS);
    return Math.max(...rowPhotos.map(thumbHeight)) + GAP;
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => rowHeights[i] ?? Math.round(THUMB_W * FALLBACK_RATIO) + GAP,
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
          const start = vRow.index * COLS;
          const rowPhotos = photos.slice(start, start + COLS);

          return (
            <div
              key={vRow.key}
              className="absolute left-0 flex"
              style={{ top: vRow.start, gap: GAP }}
            >
              {rowPhotos.map((photo) => (
                <Thumbnail key={photo.id} photo={photo} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Thumbnail({ photo }: { photo: Photo }) {
  // thumbPath предпочтительнее (меньше размер), но если не готов — показываем оригинал
  const src = convertFileSrc(photo.thumbPath ?? photo.path);
  const h = thumbHeight(photo);

  return (
    <div
      className="overflow-hidden rounded bg-neutral-800"
      style={{ width: THUMB_W, height: h, flexShrink: 0 }}
    >
      <img
        src={src}
        width={THUMB_W}
        height={h}
        className="h-full w-full object-cover"
        loading="lazy"
        alt=""
        decoding="async"
      />

      {/* Цветовая полоска снизу */}
      {photo.dominantColor && (
        <div
          className="h-0.5 w-full"
          style={{
            background: `rgb(${photo.dominantColor.join(",")})`,
          }}
        />
      )}
    </div>
  );
}
