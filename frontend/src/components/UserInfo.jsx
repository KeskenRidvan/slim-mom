import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function normalizeDisplayName(name) {
  const value = String(name || "").trim();
  if (!value) return "User";
  if (!/[ÃƒÃ‚Ã„Ã…ÃÃ‘]/.test(value)) return value;

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded.includes("ï¿½") ? value : decoded;
  } catch {
    return value;
  }
}

export function UserInfo() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      window.alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="user-info">
      <span className="user-name">{normalizeDisplayName(user?.name)}</span>
      <span className="user-divider" aria-hidden="true">
        |
      </span>
      <button type="button" className="logout-button" onClick={handleLogout}>
        Exit
      </button>
    </div>
  );
}
