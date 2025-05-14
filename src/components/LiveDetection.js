import React, { useRef, useState, useEffect } from "react";
import "../styles/livedetection.css";

const LiveDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [threshold, setThreshold] = useState(0.3);
  const [isLoading, setIsLoading] = useState(false);
  const [snapshotHistory, setSnapshotHistory] = useState([]);
  const [detectedImagePath, setDetectedImagePath] = useState("");
  const [excelReport, setExcelReport] = useState("");
  const [enableTimedSnapshots, setEnableTimedSnapshots] = useState(false);

  const startDetection = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        setStream(userStream);
        setIsStreaming(true);
        setStatus("Streaming...");
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
      setStatus("Camera access denied");
    }
  };

  const stopDetection = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
      setStatus("Stopped");
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    if (!isStreaming) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    const detectFrame = async () => {
      if (!video || video.readyState !== 4) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "frame.jpg");

        setIsLoading(true);
        try {
          const response = await fetch("${process.env.REACT_APP_API_URL}/detect_pothole/", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          let count = 0;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (Array.isArray(result.potholes)) {
            for (const p of result.potholes) {
              if (p.confidence >= threshold && p.x2 > p.x1 && p.y2 > p.y1) {
                ctx.strokeStyle = "red";
                ctx.lineWidth = 2;
                ctx.strokeRect(p.x1, p.y1, p.x2 - p.x1, p.y2 - p.y1);
                ctx.fillStyle = "red";
                ctx.font = "14px Arial";
                ctx.fillText(`${p.severity} (${(p.confidence * 100).toFixed(1)}%)`, p.x1, Math.max(p.y1 - 8, 10));
                count++;
              }
            }
          }

          setDetectedImagePath(result.image_path || "");
          setExcelReport(result.excel_report || "");
          setStatus(count > 0 ? `${count} pothole(s) detected` : "No potholes detected");

          if (result.image_path) {
            setSnapshotHistory((prev) => [...prev, result.image_path]);
          }

          // Optional: save snapshot to backend if toggle enabled
          if (enableTimedSnapshots) {
            const timestamp = new Date().toISOString();
            const snapshotForm = new FormData();
            snapshotForm.append("image", blob, `snapshot_${timestamp}.jpg`);
            await fetch("${process.env.REACT_APP_API_URL}/save_snapshot/", {
              method: "POST",
              body: snapshotForm,
            });
          }

        } catch (err) {
          console.error("Detection failed:", err);
          setStatus("Detection failed");
        } finally {
          setIsLoading(false);
        }
      }, "image/jpeg");

      setTimeout(detectFrame, 3000); // run every 3 seconds
    };

    detectFrame();
  }, [isStreaming, threshold, enableTimedSnapshots]);

  return (
    <div className="live-detection">
      <h2>Live Pothole Detection</h2>
      <p>Status: {status}</p>

      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline className="video-stream" />
        <canvas ref={canvasRef} className="canvas-overlay" />
        {isLoading && <div className="loading-overlay">Detecting...</div>}
      </div>

      <div className="controls">
        <label>
          Confidence Threshold: {threshold.toFixed(2)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={enableTimedSnapshots}
            onChange={() => setEnableTimedSnapshots(!enableTimedSnapshots)}
          />
          &nbsp;Enable Timed Snapshots
        </label>
      </div>

      <div className="button-container">
        <button className="start-btn" onClick={startDetection} disabled={isStreaming}>
          {isStreaming ? "Streaming..." : "Start Detection"}
        </button>
        <button className="stop-btn" onClick={stopDetection} disabled={!isStreaming}>
          Stop Detection
        </button>
      </div>

      {detectedImagePath && (
        <div style={{ marginTop: "1rem" }}>
          <a
            href={`${process.env.REACT_APP_API_URL}/${detectedImagePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
            download
          >
            📷 Download Detected Image
          </a>
        </div>
      )}

      {excelReport && (
        <div style={{ marginTop: "0.5rem" }}>
          <a
            href={`${process.env.REACT_APP_API_URL}/download_excel/${excelReport}`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
            download
          >
            📥 Download Excel Report
          </a>
        </div>
      )}

      {snapshotHistory.length > 0 && (
        <div className="snapshot-history">
          <h4>📸 Detection History</h4>
          <div className="snapshot-grid">
            {snapshotHistory.map((path, idx) => (
              <img
                key={idx}
                src={`${process.env.REACT_APP_API_URL}/${path}`}
                alt={`snapshot-${idx}`}
                className="snapshot-thumb"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDetection;
