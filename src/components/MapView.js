import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/mapview.css";

// Fix default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ potholes }) => {
  const validMarkers = potholes?.filter(
    (p) => p.latitude && p.longitude && p.latitude !== "Unknown" && p.longitude !== "Unknown"
  );

  const defaultCenter = validMarkers?.length
    ? [validMarkers[0].latitude, validMarkers[0].longitude]
    : [0, 0];

  return (
    <div className="map-container">
      <h3>🗺️ Pothole Locations</h3>
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {validMarkers.map((p, index) => (
          <Marker key={index} position={[p.latitude, p.longitude]}>
            <Popup>
              <strong>Severity:</strong> {p.severity}<br />
              <strong>Volume:</strong> {p.volume_m3?.toFixed(4)} m³<br />
              {p.image_path && (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${p.image_path}`}
                  alt="Detected Pothole"
                  style={{ width: "100px", marginTop: "8px", borderRadius: "4px" }}
                />
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
