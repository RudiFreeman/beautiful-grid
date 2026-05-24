/** Экран Library: просмотр всех фото текущего проекта. Реализуется в Sprint 1. */
export function LibraryPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-500">
      <svg
        className="h-12 w-12 opacity-30"
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
      <p className="text-sm">Библиотека — Sprint 1</p>
      <p className="text-xs text-neutral-600">Перетащи папку с фото сюда, чтобы начать</p>
    </div>
  );
}
