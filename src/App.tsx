/** Корневой компонент: роутер + глобальная раскладка (NavBar + контент страницы). */
import { Navigate, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ExportPage } from "./pages/ExportPage";
import { GridPage } from "./pages/GridPage";
import { LibraryPage } from "./pages/LibraryPage";

export function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <NavBar />
      <main className="flex flex-1 overflow-hidden">
        <Routes>
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/grid" element={<GridPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="*" element={<Navigate to="/library" replace />} />
        </Routes>
      </main>
    </div>
  );
}
