import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Logo from "./Logo";
import { UserInfo } from "./UserInfo";
import "./Header.css";

function getTabletNavClassName({ isActive }) {
  return isActive ? "tablet-menu__link tablet-menu__link--active" : "tablet-menu__link";
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((currentValue) => !currentValue);
  };

  return (
    <header className={`main-header ${isMenuOpen ? "main-header--menu-open" : ""}`}>
      <div className="main-header__shell">
        <div className="main-header__bar">
          <div className="main-header__left">
            <Logo className="main-header__logo" to="/calculator" />
            <Navigation isPrivate showLogo={false} />
          </div>

          <div className="main-header__right">
            <UserInfo />
            <button
              type="button"
              className="main-header__menu-toggle"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="tablet-private-menu"
            >
              {isMenuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="tablet-private-menu" className="tablet-menu" aria-label="Private navigation">
          <NavLink
            to="/diary"
            className={getTabletNavClassName}
            onClick={() => setIsMenuOpen(false)}
          >
            DIARY
          </NavLink>
          <NavLink
            to="/calculator"
            className={getTabletNavClassName}
            onClick={() => setIsMenuOpen(false)}
          >
            CALCULATOR
          </NavLink>
        </nav>
      )}
    </header>
  );
}
