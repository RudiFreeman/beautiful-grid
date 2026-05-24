/** Виртуализированная сетка миниатюр для Library. */
import { convertFileSrc } from "@tauri-apps/api/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { Photo } from "../types";

const COLS = 6;
const THUMB_W = 156;
const THUMB_H = 117; // 4:3
const GAP = 4;
const ROW_H = THUMB_H + GAP;

interface Props {
  photos: Photo[];
}

export function ThumbnailGrid({ photos }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(photos.length / COLS);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_H,
    overscan: 4,
  });

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto p-2"
      style={{ contain: "strict" }}
    >
      <div
        className="relative w-full"
        style={{ height: rowVirtualizer.getTotalSize() }}
      >
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
  const src = photo.thumbPath ? convertFileSrc(photo.thumbPath) : null;

  return (
    <div
      className="overflow-hidden rounded bg-neutral-800"
      style={{ width: THUMB_W, height: THUMB_H, flexShrink: 0 }}
    >
      {src ? (
        <img
          src={src}
          width={THUMB_W}
          height={THUMB_H}
          className="h-full w-full object-cover"
          loading="lazy"
          alt=""
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-neutral-300" />
        </div>
      )}

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
