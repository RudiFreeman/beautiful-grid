/** Верхняя навигация: Library / Grid / Export, управление проектом, кнопка Support. */
import { open as openDialog, save as saveDialog } from "@tauri-apps/plugin-dialog";
import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { newProject, openProject, saveProject } from "../lib/tauri-commands";
import { useAppStore } from "../store/appStore";
import { SupportModal } from "./SupportModal";

const NAV_ITEMS = [
  { to: "/library", label: "Library" },
  { to: "/grid", label: "Grid" },
  { to: "/export", label: "Export" },
] as const;

export function NavBar() {
  const [showSupport, setShowSupport] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Save");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const store = useAppStore();

  const handleNew = async () => {
    if (!confirm("Start a new project? Unsaved changes will be lost.")) return;
    const project = await newProject("New Project").catch(console.error);
    if (project) {
      store.reset();
      store.setProjectName(project.projectName);
    }
  };

  const handleSave = async () => {
    const path = await saveDialog({
      filters: [{ name: "Beautiful Grid Project", extensions: ["bgrid"] }],
      defaultPath: `${store.projectName}.bgrid`,
    });
    if (!path) return;

    try {
      await saveProject(
        {
          projectName: store.projectName,
          version: 1,
          createdAt: new Date().toISOString(),
          settings: store.settings,
          photos: store.photos,
          gridOrder: store.gridOrder,
        },
        path,
      );
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      setSaveLabel("Saved ✓");
      saveTimerRef.current = setTimeout(() => setSaveLabel("Save"), 2000);
    } catch (e) {
      console.error("Save failed:", e);
      setSaveLabel("Save");
    }
  };

  const handleOpen = async () => {
    const path = await openDialog({
      filters: [{ name: "Beautiful Grid Project", extensions: ["bgrid"] }],
      multiple: false,
    });
    if (!path || Array.isArray(path)) return;

    const project = await openProject(path as string).catch(console.error);
    if (!project) return;

    store.reset();
    store.setProjectName(project.projectName);
    store.setColumns(project.settings.columns);
    store.setPhotos(project.photos);
    store.setGridOrder(project.gridOrder);
  };

  return (
    <>
      <header className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-4 py-2">
        <span className="mr-1 text-sm font-semibold tracking-wide text-neutral-100">
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

        <div className="flex-1" />

        {/* Управление проектом */}
        {[
          { label: "New", action: handleNew },
          { label: "Open", action: handleOpen },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="rounded px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
          >
            {label}
          </button>
        ))}
        <button
          onClick={handleSave}
          className="rounded px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
        >
          {saveLabel}
        </button>

        {/* Кнопка Support */}
        <button
          onClick={() => setShowSupport(true)}
          className="ml-1 rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
        >
          ♥ Support
        </button>
      </header>

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </>
  );
}
