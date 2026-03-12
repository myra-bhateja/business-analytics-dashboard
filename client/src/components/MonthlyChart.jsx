import { useEffect, useState } from 'react';
import axios from 'axios';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#6b6b80', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: 'DM Mono', fontSize: 14, color: '#6c63ff' }}>
          ${Number(payload[0].value).toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function MonthlyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/analytics/monthly-sales`)
      .then(res => {
        setData(res.data.map(d => ({
          month: new Date(d.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          sales: Number(d.sales)
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Monthly Sales Trend</span>
        <span className="card-badge">Area Chart</span>
      </div>
      {loading ? (
        <div className="loading"><div className="spinner" /> Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#6b6b80', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b6b80', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2a3a' }} />
            <Area type="monotone" dataKey="sales" stroke="#6c63ff" strokeWidth={2} fill="url(#salesGrad)" dot={{ fill: '#6c63ff', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#6c63ff' }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
