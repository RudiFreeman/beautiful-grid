/** Модальное окно выбора платформы доната. */
import { openUrl } from "@tauri-apps/plugin-opener";

import { DONATE_URLS } from "../config/donate";

interface Props {
  onClose: () => void;
}

export function SupportModal({ onClose }: Props) {
  const handleOpen = (url: string) => {
    if (url) openUrl(url).catch(console.error);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl border border-neutral-700 bg-neutral-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-semibold text-neutral-100">
          Support Beautiful Grid
        </h2>
        <div className="flex flex-col gap-2">
          <PlatformButton
            label="Buy Me a Coffee"
            url={DONATE_URLS.buyMeACoffee}
            onOpen={handleOpen}
          />
          <PlatformButton label="Boosty" url={DONATE_URLS.boosty} onOpen={handleOpen} />
          <PlatformButton
            label="GitHub Sponsors"
            url={DONATE_URLS.githubSponsors}
            onOpen={handleOpen}
          />
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full text-xs text-neutral-600 hover:text-neutral-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PlatformButton({
  label,
  url,
  onOpen,
}: {
  label: string;
  url: string;
  onOpen: (url: string) => void;
}) {
  return (
    <button
      onClick={() => onOpen(url)}
      disabled={!url}
      className="rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100 disabled:opacity-40"
    >
      ♥ {label}
    </button>
  );
}
