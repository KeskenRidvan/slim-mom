import { NavLink } from "react-router-dom";
import { RegistrationForm } from "../components/RegistrationForm";
import Logo from "../components/Logo";
import { DecorativeBackground } from "../components/DecorativeBackground";

export default function RegistrationPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-shell">
        <div className="auth-left-section">
          <div className="auth-header">
            <Logo to="/" />
            <div className="auth-nav-links">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "auth-nav-link active" : "auth-nav-link"
                }
              >
                LOG IN
              </NavLink>
              <NavLink
                to="/registration"
                className={({ isActive }) =>
                  isActive ? "auth-nav-link active" : "auth-nav-link"
                }
              >
                REGISTRATION
              </NavLink>
            </div>
          </div>

          <h1 className="auth-title">REGISTER</h1>
          <RegistrationForm />
        </div>

        <DecorativeBackground />
      </div>
    </div>
  );
}
