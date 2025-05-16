from pathlib import Path

# Define the updated Upload.js content
upload_js_code = """
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
      setUploadStatus("⚠️ Please select file(s).");
      return;
    }

    setUploadStatus("⏳ Uploading...");

    const allResults = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axiosClient.post("/detect_pothole/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        allResults.push(response.data);
      } catch (error) {
        console.error("❌ Upload failed for:", file.name);
      }
    }

    setResults(allResults);
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
      <p>Capture or upload photo(s) to detect potholes using AI.</p>

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

      {results && results.length > 0 && (
        <div className="results-section">
          {results.map((res, index) => (
            <div key={index} className="result-block">
              <img
                src={`${process.env.REACT_APP_API_URL}/${res.image_path}`}
                alt={`Detected ${index + 1}`}
                className="detected-image"
              />
              {res.excel_report ? (
                <div style={{ marginTop: "0.5rem" }}>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/download_excel/${res.excel_report}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                    download
                  >
                    📥 Download Excel Report
                  </a>
                </div>
              ) : (
                <p style={{ color: "gray" }}>No report available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
"""

# Write the code to a file
output_path = Path("/mnt/data/Upload.js")
output_path.write_text(upload_js_code)

output_path.name
