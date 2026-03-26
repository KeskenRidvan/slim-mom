import { Link } from "react-router-dom";
import desktopLogo from "../img/deskop-logo.png";
import tabletLogo from "../img/tablet-header.png";

export default function Logo({ className = "", to = "/diary" }) {
  const composedClassName = ["logo-wrapper", className].filter(Boolean).join(" ");

  return (
    <Link to={to} className={composedClassName} aria-label="Open Slim Mom">
      <picture>
        <source media="(max-width: 1279px)" srcSet={tabletLogo} />
        <img src={desktopLogo} alt="Slim Mom" className="logo-image" />
      </picture>
    </Link>
  );
}
