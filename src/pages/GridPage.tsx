/** Экран Grid: виртуализированная сетка с drag-and-drop и сортировкой по цвету. */
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef, useState } from "react";

import { sortPhotosByColor } from "../lib/tauri-commands";
import { useAppStore } from "../store/appStore";
import type { Photo } from "../types";

const MIN_COLS = 1;
const MAX_COLS = 10;
const CELL_PX = 160; // ширина ячейки в пикселях
const GAP = 4;

export function GridPage() {
  const photos = useAppStore((s) => s.photos);
  const gridOrder = useAppStore((s) => s.gridOrder);
  const columns = useAppStore((s) => s.settings.columns);
  const setColumns = useAppStore((s) => s.setColumns);
  const setGridOrder = useAppStore((s) => s.setGridOrder);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSorting, setIsSorting] = useState(false);

  // Строим map id → photo для быстрого доступа
  const photoMap = Object.fromEntries(photos.map((p) => [p.id, p]));
  const orderedPhotos = gridOrder.map((id) => photoMap[id]).filter(Boolean) as Photo[];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIdx = gridOrder.indexOf(String(active.id));
        const newIdx = gridOrder.indexOf(String(over.id));
        if (oldIdx !== -1 && newIdx !== -1) {
          setGridOrder(arrayMove(gridOrder, oldIdx, newIdx));
        }
      }
    },
    [gridOrder, setGridOrder],
  );

  const handleSortByColor = useCallback(async () => {
    const photosWithColor = photos.filter((p) => p.dominantColor !== null);
    if (photosWithColor.length === 0) return;

    setIsSorting(true);
    try {
      const sorted = await sortPhotosByColor(
        photosWithColor.map((p) => ({
          id: p.id,
          dominant_color: p.dominantColor as [number, number, number],
        })),
      );
      // Фото без цвета — в конец
      const withoutColor = gridOrder.filter(
        (id) => !photosWithColor.find((p) => p.id === id),
      );
      setGridOrder([...sorted, ...withoutColor]);
    } finally {
      setIsSorting(false);
    }
  }, [photos, gridOrder, setGridOrder]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-500">
        <p className="text-sm">Import photos in Library first</p>
      </div>
    );
  }

  const activePhoto = activeId ? photoMap[activeId] : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Панель управления */}
      <Toolbar
        columns={columns}
        setColumns={setColumns}
        onSortByColor={handleSortByColor}
        isSorting={isSorting}
        photoCount={orderedPhotos.length}
      />

      {/* Сетка с DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={gridOrder} strategy={rectSortingStrategy}>
          <VirtualGrid
            photos={orderedPhotos}
            columns={columns}
            cellPx={CELL_PX}
            gap={GAP}
            activeId={activeId}
          />
        </SortableContext>

        <DragOverlay>
          {activePhoto && <GridCell photo={activePhoto} cellPx={CELL_PX} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ToolbarProps {
  columns: number;
  setColumns: (n: number) => void;
  onSortByColor: () => void;
  isSorting: boolean;
  photoCount: number;
}

function Toolbar({
  columns,
  setColumns,
  onSortByColor,
  isSorting,
  photoCount,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-800 px-4 py-2">
      {/* Счётчик */}
      <span className="text-xs text-neutral-500">{photoCount} photos</span>

      {/* Слайдер N-колонок */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400">Cols</span>
        <input
          type="range"
          min={MIN_COLS}
          max={MAX_COLS}
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
          className="w-24 accent-neutral-300"
        />
        <span className="w-4 text-center text-xs font-mono text-neutral-300">
          {columns}
        </span>
      </div>

      <div className="flex-1" />

      {/* Сортировка по цвету */}
      <button
        onClick={onSortByColor}
        disabled={isSorting}
        className="rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100 disabled:opacity-40"
      >
        {isSorting ? "Sorting…" : "Sort by color"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface VirtualGridProps {
  photos: Photo[];
  columns: number;
  cellPx: number;
  gap: number;
  activeId: string | null;
}

function VirtualGrid({ photos, columns, cellPx, gap, activeId }: VirtualGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.ceil(photos.length / columns);
  const rowH = cellPx * 0.75 + gap; // 4:3 cells

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowH,
    overscan: 3,
  });

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto p-2"
      style={{ contain: "strict" }}
    >
      <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((vRow) => {
          const start = vRow.index * columns;
          const rowPhotos = photos.slice(start, start + columns);

          return (
            <div
              key={vRow.key}
              className="absolute left-0 flex"
              style={{ top: vRow.start, gap }}
            >
              {rowPhotos.map((photo) => (
                <SortableCell
                  key={photo.id}
                  photo={photo}
                  cellPx={cellPx}
                  isActive={photo.id === activeId}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function SortableCell({
  photo,
  cellPx,
  isActive,
}: {
  photo: Photo;
  cellPx: number;
  isActive: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: photo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GridCell photo={photo} cellPx={cellPx} />
    </div>
  );
}

function GridCell({
  photo,
  cellPx,
  isDragging,
}: {
  photo: Photo;
  cellPx: number;
  isDragging?: boolean;
}) {
  const src = photo.thumbPath ? convertFileSrc(photo.thumbPath) : null;
  const cellH = Math.round(cellPx * 0.75); // 4:3

  return (
    <div
      className={[
        "overflow-hidden rounded select-none cursor-grab active:cursor-grabbing",
        isDragging ? "shadow-2xl ring-2 ring-neutral-300" : "bg-neutral-800",
      ].join(" ")}
      style={{ width: cellPx, height: cellH, flexShrink: 0 }}
    >
      {src ? (
        <img
          src={src}
          width={cellPx}
          height={cellH}
          className="h-full w-full object-cover pointer-events-none"
          draggable={false}
          alt=""
          decoding="async"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-neutral-400" />
        </div>
      )}
    </div>
  );
}
