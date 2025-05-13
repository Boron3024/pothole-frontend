import React from "react";
import "../styles/about.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Our AI-Powered Pothole Detection</h1>
      <div className="about-text">
        <p>
          Our cutting-edge AI system detects potholes in real-time, enabling 
          road maintenance teams to take swift action and improve road safety.
        </p>
      </div>

      <div className="about-features">
        <div className="feature-card">
          <i className="fas fa-microchip"></i>
          <h2>AI-Powered Accuracy</h2>
          <p>Leverages deep learning for high-precision pothole detection.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-clock"></i>
          <h2>Real-Time Processing</h2>
          <p>Instantly analyzes road conditions for faster response times.</p>
        </div>

        <div className="feature-card">
          <i className="fas fa-file-alt"></i>
          <h2>Automated Reports</h2>
          <p>Generates detailed reports to assist road maintenance teams.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
