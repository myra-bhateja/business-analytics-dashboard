import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function AIInsights() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/analytics/insights`);
      setInsights(res.data.insights);
    } catch (err) {
      setError('Failed to generate insights. Check your AI API key or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="card-header">
        <span className="card-title">AI Business Insights</span>
        <button className="btn btn-primary btn-sm" onClick={fetchInsights} disabled={loading}>
          {loading ? 'Analyzing...' : '✨ Generate Insights'}
        </button>
      </div>

      {!insights && !loading && !error && (
        <div className="insights-placeholder" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <div>Click "Generate Insights" to analyze your sales data with AI</div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Analyzing your sales data...
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ margin: '16px 0' }}>{error}</div>
      )}

      {insights && !loading && (
        <div className="insights-box">{insights}</div>
      )}
    </div>
  );
}
