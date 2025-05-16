import React, { useState } from "react";
import "../styles/upload.css";
import axiosClient from "../axios";

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [results, setResults] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadStatus("");
    setResults([]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus("⚠️ Please select at least one image.");
      return;
    }

    setUploadStatus("⏳ Uploading...");

    const newResults = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axiosClient.post("/detect_pothole/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        newResults.push(response.data);
      } catch (error) {
        console.error("Upload failed for:", file.name);
        newResults.push({ error: `❌ Failed: ${file.name}` });
      }
    }

    setResults(newResults);
    setUploadStatus("✅ Detection complete!");
  };

  const getStatusClass = () => {
    if (uploadStatus.includes("✅")) return "success";
    if (uploadStatus.includes("❌") || uploadStatus.includes("⚠️")) return "error";
    return "";
  };

  return (
    <div className="upload-container">
      <h2>📸 Pothole Detection</h2>
      <p>Select multiple photos to detect potholes using AI.</p>

      <input
        type="file"
        accept="image/*"
        multiple
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

      {results.length > 0 && (
        <div className="results-section">
          {results.map((res, index) => (
            <div key={index} className="result-block">
              {res.error ? (
                <p className="error-text">{res.error}</p>
              ) : (
                <>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${res.image_path}`}
                    alt={`Detected ${index}`}
                    className="detected-image"
                  />
                  {res.excel_report && (
                    <a
                      href={`${process.env.REACT_APP_API_URL}/download_excel/${res.excel_report}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      📥 Download Excel Report
                    </a>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
