import React from "react";
import MapView from "./MapView";

const MapPage = () => {
  // Dummy data for testing map display
  const results = {
    potholes: [
      {
        latitude: -1.283,
        longitude: 36.8219,
        severity: "Moderate",
        volume_m3: 0.0012,
        image_path: "uploads/sample1.jpg"
      },
      {
        latitude: -1.285,
        longitude: 36.8225,
        severity: "Severe",
        volume_m3: 0.0031,
        image_path: "uploads/sample2.jpg"
      }
    ]
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Pothole Detection Map</h2>
      <MapView potholes={results.potholes} />
    </div>
  );
};

export default MapPage;
