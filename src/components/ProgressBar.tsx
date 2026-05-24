/** Индикатор прогресса импорта/анализа. Формат: «25 / 300». */

interface Props {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5 px-6 py-3">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>{label ?? "Processing…"}</span>
        <span className="font-mono">
          {current} / {total}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-neutral-300 transition-all duration-100"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
