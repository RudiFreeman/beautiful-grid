/** Верхняя навигационная панель с переключением между Library / Grid / Export. */
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/library", label: "Library" },
  { to: "/grid", label: "Grid" },
  { to: "/export", label: "Export" },
] as const;

export function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-2">
      <span className="text-sm font-semibold tracking-wide text-neutral-100">
        Beautiful Grid
      </span>

      <nav className="flex gap-1">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "rounded px-3 py-1 text-sm transition-colors",
                isActive
                  ? "bg-neutral-700 text-neutral-100"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",
              ].join(" ")
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Кнопка «Поддержать» — URL подключаются в config/donate.ts после релиза v1.0 */}
      <button
        className="rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
        disabled
        title="Поддержать — появится после v1.0"
      >
        ♥ Support
      </button>
    </header>
  );
}
