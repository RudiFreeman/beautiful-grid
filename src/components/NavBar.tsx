/** Верхняя навигация: Library / Grid / Export, управление проектом, кнопка Support. */
import { open as openDialog, save as saveDialog } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
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
  const [showNewModal, setShowNewModal] = useState(false);
  const store = useAppStore();
  const isDirty = useAppStore((s) => s.isDirty);
  const saveLabel = isDirty ? "Save" : "Saved ✓";

  const doSave = async (): Promise<boolean> => {
    const path = await saveDialog({
      filters: [{ name: "Beautiful Grid Project", extensions: ["bgrid"] }],
      defaultPath: `${store.projectName}.bgrid`,
    });
    if (!path) return false;
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
      store.markSaved();
      return true;
    } catch (e) {
      console.error("Save failed:", e);
      return false;
    }
  };

  const doNewProject = async () => {
    const project = await newProject("New Project").catch(console.error);
    if (project) {
      store.reset();
      store.setProjectName(project.projectName);
    }
  };

  const hasPhotos = useAppStore((s) => s.photos.length > 0);

  const handleNew = () => {
    if (hasPhotos) {
      setShowNewModal(true);
    } else {
      doNewProject();
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
    store.markSaved();
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
          onClick={doSave}
          className="rounded px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
        >
          {saveLabel}
        </button>

        <button
          onClick={() => setShowSupport(true)}
          className="ml-1 rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
        >
          ♥ Support
        </button>
      </header>

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}

      {showNewModal && (
        <NewProjectModal
          isDirty={isDirty}
          onSave={async () => {
            setShowNewModal(false);
            const saved = await doSave();
            if (saved) doNewProject();
          }}
          onDiscard={() => {
            setShowNewModal(false);
            doNewProject();
          }}
          onCancel={() => setShowNewModal(false)}
        />
      )}
    </>
  );
}

function NewProjectModal({
  isDirty,
  onSave,
  onDiscard,
  onCancel,
}: {
  isDirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl">
        <h2 className="mb-1 text-sm font-semibold text-neutral-100">New project</h2>
        <p className="mb-4 text-xs text-neutral-400">
          {isDirty
            ? "You have unsaved changes. Save before creating a new project?"
            : "Create a new project? The current project will be closed."}
        </p>

        {isDirty && (
          <button
            onClick={onSave}
            className="mb-3 w-full rounded-lg bg-neutral-700 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-blue-600 hover:text-white"
          >
            Save project
          </button>
        )}

        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="flex-1 rounded-lg border border-neutral-700 py-1.5 text-xs text-neutral-400 transition-colors hover:border-red-800 hover:text-red-400"
          >
            {isDirty ? "Discard" : "Create new"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-neutral-700 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
