import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      const sessionId = res.data.session_id;

      // Store session ID in browser storage
      localStorage.setItem('active_session_id', sessionId);
      
      if (onUploadSuccess) onUploadSuccess(sessionId);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}