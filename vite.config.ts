/** Конфигурация Vite: React + Tailwind CSS v4, интеграция с Tauri dev-сервером. */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tauri ожидает порт 1420 при dev
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    // Игнорируем изменения в Rust-части, чтобы не вызывать лишний HMR
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
