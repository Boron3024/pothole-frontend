import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Upload from "./components/Upload";
import MapView from "./components/MapView";
import LiveDetection from "./components/LiveDetection";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import "leaflet/dist/leaflet.css";
import MapPage from "./components/MapPage";
import SnapshotGallery from "./components/SnapshotGallery"; // ✅ Adjust path if needed


// In your <Routes>
<Route path="/map" element={<MapPage />} />


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/live-detection" element={<LiveDetection />} />
         <Route path="/about" element={<About />} /> 
         <Route path="/dashboard" element={<Dashboard />} /> 
         <Route path="/map" element={<MapPage />} /> 
         <Route path="/mapview" element={<MapView />} />
         <Route path="/snapshots" element={<SnapshotGallery />} />
    
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
