import { useUI } from "../context/UIContext";
import "../css/Loader.css";

export function Loader() {
  const { pending } = useUI();
  if (!pending) return null;

  return (
    <div className="loader-overlay" aria-live="polite" aria-label="Loading">
      <div className="loader-spinner" />
    </div>
  );
}
