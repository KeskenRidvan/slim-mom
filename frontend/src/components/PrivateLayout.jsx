import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import "../css/PrivateLayout.css";

export function PrivateLayout() {
  return (
    <div className="private-layout-container">
      <div className="private-layout-shell">
        <Header />
        <main className="private-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
