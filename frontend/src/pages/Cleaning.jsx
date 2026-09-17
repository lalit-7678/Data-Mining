import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Cleaning() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApplyClean = async () => {
    setError('');
    setMessage('');
    
    // Retrieve session ID from browser storage
    const sessionId = localStorage.getItem('active_session_id');

    if (!sessionId) {
      setError('Dataset not found. Please upload a file first.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/clean`, { session_id: sessionId });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to clean data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Interactive Data Cleaning</h3>
      <button onClick={handleApplyClean} disabled={loading}>
        {loading ? 'Cleaning...' : 'Apply & Clean Data'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}