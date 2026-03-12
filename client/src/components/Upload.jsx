import { useState, useRef } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Upload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && f.name.endsWith('.csv')) {
      setFile(f);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid .csv file' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${API}/api/upload`, formData);
      setMessage({ type: 'success', text: `✓ "${file.name}" uploaded successfully` });
      setFile(null);
      if (onUpload) onUpload();
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Upload Dataset</span>
          <span className="card-badge">CSV only</span>
        </div>

        <div
          className={`upload-zone ${file ? 'active' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <div className="upload-icon">{file ? '📄' : '📂'}</div>
          <div className="upload-title">
            {file ? 'File ready to upload' : 'Drop your CSV here'}
          </div>
          <div className="upload-sub">
            {file ? file.name : 'or click to browse files'}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className="file-selected">
            <span className="file-name">📎 {file.name}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Mono' }}>
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        <div className="upload-btn-wrap">
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? 'Uploading...' : 'Upload Dataset'}
          </button>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <span className="card-title">Expected Format</span>
        </div>
        <div style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text-muted)', lineHeight: 2 }}>
          <div style={{ color: 'var(--accent3)', marginBottom: 8 }}>product, region, amount, quantity, saleDate</div>
          <div>Laptop, North, 1500, 3, 2024-01-15</div>
          <div>Phone, South, 800, 5, 2024-01-20</div>
          <div>Tablet, East, 600, 2, 2024-02-05</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 8 }}>...</div>
        </div>
      </div>
    </div>
  );
}
