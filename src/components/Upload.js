import React, { useState } from "react";
import "../styles/upload.css";
import axiosClient from "../axios";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus("");
    setResults(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("⚠️ Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploadStatus("⏳ Uploading...");

    try {
      const response = await axiosClient.post("/detect_pothole/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data);
      setUploadStatus("✅ Detection complete!");
    } catch (error) {
      console.error(error);
      setUploadStatus("❌ Upload failed. Try again.");
    }
  };

  const getStatusClass = () => {
    if (uploadStatus.includes("✅")) return "success";
    if (uploadStatus.includes("❌") || uploadStatus.includes("⚠️")) return "error";
    return "";
  };

  return (
    <div className="upload-container">
      <h2>📸 Pothole Detection</h2>
      <p>Capture or upload a photo to detect potholes using AI.</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ margin: "1rem 0" }}
      />
      <button className="upload-submit" onClick={handleUpload}>
        Upload & Detect
        {uploadStatus.includes("Uploading") && <span className="loader" />}
      </button>

      {uploadStatus && (
        <p className={`upload-status ${getStatusClass()}`}>{uploadStatus}</p>
      )}

      {results && (
        <div className="results-section">
          <img
            src={`${process.env.REACT_APP_API_URL}/${results.image_path}`}
            alt="Detected"
            className="detected-image"
          />

          {results.excel_report && (
            <div>
              <a
                href={`${process.env.REACT_APP_API_URL}/download_excel/${results.excel_report}`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-link"
              >
                📥 Download Excel Report
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
