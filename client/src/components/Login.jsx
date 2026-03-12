import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/auth/${mode}`, { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      onLogin(res.data.username);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">BA</div>
          <div className="login-brand-text">
            <div className="login-brand-name">Business Analytics</div>
            <div className="login-brand-sub">Enterprise Platform</div>
          </div>
        </div>

        <div className="login-hero">
          <h1 className="login-hero-title">
            Data that<br />
            <span>drives</span><br />
            decisions.
          </h1>
          <p className="login-hero-sub">
            Upload, analyze, and visualize your business<br />
            data with AI-powered insights.
          </p>
          <div className="login-features">
            {[
              'Real-time sales analytics',
              'AI-powered business insights',
              'Interactive data editor',
              'CSV upload support'
            ].map(f => (
              <div key={f} className="login-feature">
                <div className="login-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          BUSINESS ANALYTICS DASHBOARD — {new Date().getFullYear()}
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="login-card-sub">
              {mode === 'login' ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
            </p>
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`login-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button
              className="login-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="login-disclaimer">
              Sometimes the server may take up to 60 seconds to wake up. Thank you for your patience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
