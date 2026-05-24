/** Одноразовое приветственное модальное окно при первом запуске. */
import { openUrl } from "@tauri-apps/plugin-opener";
import { useState } from "react";

import { DONATE_URLS } from "../config/donate";

const STORAGE_KEY = "bg_welcome_seen";

export function WelcomeModal() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
        <h2 className="mb-1 text-base font-semibold text-neutral-100">
          Welcome to Beautiful Grid
        </h2>
        <p className="mb-4 text-sm text-neutral-400">
          This is a free, open-source app. If it saves you time, consider supporting its
          development.
        </p>

        <div className="mb-5 flex flex-col gap-2">
          <DonateButton label="Buy Me a Coffee" url={DONATE_URLS.buyMeACoffee} />
          <DonateButton label="Boosty" url={DONATE_URLS.boosty} />
          <DonateButton label="GitHub Sponsors" url={DONATE_URLS.githubSponsors} />
        </div>

        <button
          onClick={handleClose}
          className="w-full rounded-lg border border-neutral-700 py-1.5 text-sm text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DonateButton({ label, url }: { label: string; url: string }) {
  const handleClick = () => {
    if (url) openUrl(url).catch(console.error);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!url}
      className="rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100 disabled:cursor-default disabled:opacity-40"
    >
      ♥ {label}
    </button>
  );
}
