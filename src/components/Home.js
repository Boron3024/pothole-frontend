import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import axiosClient from "../axios"; // Import Axios client
import "leaflet/dist/leaflet.css";

const Home = () => {
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    axiosClient.get("/")
      .then((res) => {
        setBackendMessage(res.data.message);
      })
      .catch((err) => {
        setBackendMessage("❌ Could not connect to backend.");
        console.error(err);
      });
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>AI-Powered Pothole Detection</h1>
          <p>
            Utilizing cutting-edge AI, our system detects potholes in real time, enhancing road safety and facilitating efficient maintenance.
          </p>
          <Link to="/upload" className="cta-button">Get Started</Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-box">
          <h2>Accurate Detection</h2>
          <p>AI-powered model ensures high precision in pothole identification.</p>
        </div>
        <div className="feature-box">
          <h2>Real-Time Processing</h2>
          <p>Instantly capture and analyze road conditions for proactive action.</p>
        </div>
        <div className="feature-box">
          <h2>Easy Reporting</h2>
          <p>Seamlessly generate maintenance reports for road authorities.</p>
        </div>
      </div>

      {/* Backend Status Message */}
      <div style={{ marginTop: "30px", color: "#00e676", fontWeight: "bold" }}>
        Backend status: {backendMessage}
      </div>
    </div>
  );
};

export default Home;
