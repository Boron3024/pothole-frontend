// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/potholes/`)
      .then((res) => res.json())
      .then((data) => setPotholes(data))
      .catch(console.error);
  }, []);

  const totalPotholes = potholes.length;
  const totalArea = potholes.reduce((acc, p) => acc + (p.area_m2 || 0), 0).toFixed(2);
  const totalVolume = potholes.reduce((acc, p) => acc + (p.volume_m3 || 0), 0).toFixed(2);

  const severityCounts = potholes.reduce((acc, p) => {
    acc[p.severity] = (acc[p.severity] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(severityCounts),
    datasets: [
      {
        label: "Potholes by Severity",
        data: Object.values(severityCounts),
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"]
      }
    ]
  };

  const timeSeriesData = {
    labels: potholes.map(p => new Date(p.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Potholes Over Time",
        data: potholes.map(() => 1),
        fill: false,
        borderColor: "#3498db"
      }
    ]
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Pothole Detection Dashboard</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div><strong>Total Potholes:</strong> {totalPotholes}</div>
        <div><strong>Total Area (m²):</strong> {totalArea}</div>
        <div><strong>Total Volume (m³):</strong> {totalVolume}</div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <Bar data={chartData} />
      </div>

      <div style={{ maxWidth: 600, marginTop: 40 }}>
        <Line data={timeSeriesData} />
      </div>
    </div>
  );
};

export default Dashboard;
