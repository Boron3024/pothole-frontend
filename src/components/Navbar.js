import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp icon
import "../styles/navbar.css";
import logo from "../assets/logo.png"; // Logo import

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="logo">
          <img src={logo} alt="Pothole Detection Logo" />
        </Link>

        {/* Menu Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/live-detection">Live Detection</Link>
          <Link to="/snapshots">Snapshot Archive</Link>

          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/254798248942, 254700066769, 25498550870" // Replace with actual WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp size={26} className="whatsapp-icon" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
