import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaYoutube, FaEnvelope, FaMoon, FaSun } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <footer className={`footer ${darkMode ? "dark" : ""}`}>
      <div className="container">
        <div className="footer-content">
          
          {/* About Section */}
          <div className="footer-section about">
            <h2>Pothole Detection</h2>
            <p>
              Our AI-powered pothole detection system enhances road safety by 
              identifying and reporting potholes efficiently.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/live-detection">Live Detection</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section contact">
            <h2>Contact Us</h2>
            <p><FaEnvelope /> support@pothole-detection.com</p>
            <p>📞 +254 798 248 942</p>
            <p>📞 +254 700 066 769</p>
            <p>📞 +254 798 550 870</p>
            <p>📍 <a href="https://goo.gl/maps/" target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>

            {/* Social Media Icons */}
            <div className="social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="footer-section newsletter">
            <h2>Subscribe to Updates</h2>
            <form>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pothole Detection | All Rights Reserved</p>

          {/* Dark Mode Toggle */}
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
