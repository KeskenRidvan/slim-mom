import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import "../css/Navigation.css";

function getLinkClassName({ isActive }) {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

export default function Navigation({ isPrivate = false, showLogo = true }) {
  const { isAuthenticated } = useAuth();
  const showPrivateLinks = isPrivate || isAuthenticated;

  return (
    <nav className={`navigation ${isPrivate ? "navigation--private" : "navigation--public"}`}>
      {showLogo && (
        <Logo className="navigation-logo" to={showPrivateLinks ? "/calculator" : "/"} />
      )}

      <div className="nav-links">
        {showPrivateLinks ? (
          <>
            <NavLink to="/diary" className={getLinkClassName}>
              DIARY
            </NavLink>
            <NavLink to="/calculator" className={getLinkClassName}>
              CALCULATOR
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className={getLinkClassName}>
              LOG IN
            </NavLink>
            <NavLink to="/registration" className={getLinkClassName}>
              REGISTRATION
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
