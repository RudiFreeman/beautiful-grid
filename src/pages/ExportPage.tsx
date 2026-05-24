/** Экран Export: предпросмотр и настройки экспорта сетки. Реализуется в Sprint 1. */
export function ExportPage() {
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
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      <p className="text-sm">Экспорт — Sprint 1</p>
      <p className="text-xs text-neutral-600">
        Составь сетку, чтобы экспортировать её в PNG / JPG
      </p>
    </div>
  );
}
