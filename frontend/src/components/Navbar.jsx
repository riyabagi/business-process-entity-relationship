import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "linear-gradient(90deg, #f8fbff, #e3f2fd)",
        padding: "8px 20px",
      }}
    >
      <div className="container-fluid">

        {/* Logo */}
        <span className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            alt="HSBC Logo"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </span>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Links */}
        <div
          className={`collapse navbar-collapse ${
            expanded ? "show" : ""
          }`}
        >
          <div className="navbar-nav ms-auto gap-lg-3 gap-2 mt-3 mt-lg-0">

            {[
              { name: "Overview", path: "/" },
              { name: "Impact Explorer", path: "/impact" },
              { name: "Assurance Score", path: "/assurance" },
            ].map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/"}
                className="nav-link fw-medium text-center"
                onClick={() => setExpanded(false)} // close menu after click
                style={({ isActive }) => ({
                  color: isActive ? "#0d47a1" : "#1565c0",
                  backgroundColor: isActive ? "#bbdefb" : "transparent",
                  borderRadius: "15px",
                  padding: "8px 14px",
                  fontWeight: isActive ? "bold" : "500",
                  transition: "all 0.2s ease-in-out",
                })}
              >
                {item.name}
              </NavLink>
            ))}

          </div>
        </div>
      </div>
    </nav>
  );
}
