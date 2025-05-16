import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import "../styles/snapshotgallery.css";

const ITEMS_PER_PAGE = 12;

const SnapshotGallery = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/snapshots/`);
        const data = await response.json();
        setSnapshots(data);
      } catch (err) {
        console.error("Failed to fetch snapshots:", err);
      }
    };

    fetchSnapshots();
  }, []);

  const filteredSnapshots = snapshots.filter(filename =>
    filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSnapshots.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSnapshots = filteredSnapshots.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="snapshot-gallery">
      <div className="gallery-header">
        <h2 className="section-title">📂 Snapshot Archive</h2>
        <a
          href={`${process.env.REACT_APP_API_URL}/snapshots/zip`}
          className="download-link"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          📦 Download All
        </a>
      </div>

      <input
        type="text"
        placeholder="🔍 Search by filename..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {currentSnapshots.length === 0 ? (
        <p>No matching snapshots found.</p>
      ) : (
        <div className="snapshot-grid">
          {currentSnapshots.map((filename, idx) => (
            <div key={idx} className="snapshot-card">
              <ModalImage
                small={`${process.env.REACT_APP_API_URL}/snapshots/${filename}`}
                large={`${process.env.REACT_APP_API_URL}/snapshots/${filename}`}
                alt={`snapshot-${idx}`}
                className="snapshot-img"
              />
              <a
                href={`${process.env.REACT_APP_API_URL}/snapshots/${filename}`}
                download
                className="download-link"
              >
                ⬇ Download
              </a>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnapshotGallery;
