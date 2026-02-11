import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "linear-gradient(90deg, #f8fbff, #e3f2fd)",
        padding: "12px 20px",
      }}
    >
      <div className="container-fluid">
        {/* Brand */}
         {/* Logo */}
        <span className="navbar-brand fw-bold d-flex align-items-center">
          <img
            src={logo}
            alt="HSBC Logo"
            className="navbar-logo"
           style={{
            height: "50px",
            width: "auto",
            objectFit: "contain"
          }}  />
        </span>

        {/* Links */}
        <div className="navbar-nav ms-auto gap-3">
          {[
            { name: "Overview", path: "/" },
            { name: "Impact Explorer", path: "/impact" },
            { name: "Assurance Score", path: "/overview" },
            // { name: "Live", path: "/live" },
          ].map((item, index) => (
            <Link
              key={index}
              className="nav-link fw-medium"
              to={item.path}
              style={{
                color: "#1565c0",
                borderRadius: "8px",
                padding: "6px 12px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#bbdefb";
                e.target.style.color = "#0d47a1";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#1565c0";
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
