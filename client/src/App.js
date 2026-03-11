import { useState, useEffect } from 'react';
import Login from './components/Login';
import Upload from './components/Upload';
import RegionChart from './components/RegionChart';
import MonthlyChart from './components/MonthlyChart';
import TopProducts from './components/TopProducts';
import AIInsights from './components/AIInsights';
import AIChat from './components/AIChat';
import DataEditor from './components/DataEditor';
import './App.css';

const NAV_ITEMS = [
  { id: 'charts', label: 'Charts', icon: '📊' },
  { id: 'upload', label: 'Upload', icon: '📁' },
  { id: 'editor', label: 'Edit Data', icon: '✏️' },
  { id: 'insights', label: 'AI Insights', icon: '🤖' },
  { id: 'chat', label: 'AI Chat', icon: '💬' },
];

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('charts');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) setUser(username);
  }, []);

  const handleLogin = (username) => setUser(username);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const handleDataChange = () => setRefreshKey(k => k + 1);

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-mark">BA</div>
          <div>
            <div className="logo-title">Business Analytics</div>
            <div className="logo-sub">Enterprise Dashboard</div>
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user[0].toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{user}</div>
              <div className="user-role">Analyst</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign out">↪</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="page-title">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="page-sub">Real-time business analytics</p>
          </div>
          <div className="topbar-right">
            <div className="date-badge">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="content">
          {activeTab === 'charts' && (
            <div className="charts-grid">
              <RegionChart key={`region-${refreshKey}`} />
              <MonthlyChart key={`monthly-${refreshKey}`} />
              <TopProducts key={`products-${refreshKey}`} />
            </div>
          )}
          {activeTab === 'upload' && <Upload onUpload={handleDataChange} />}
          {activeTab === 'editor' && <DataEditor onDataChange={handleDataChange} />}
          {activeTab === 'insights' && <AIInsights key={`insights-${refreshKey}`} />}
          {activeTab === 'chat' && <AIChat />}
        </div>
      </main>
    </div>
  );
}

export default App;