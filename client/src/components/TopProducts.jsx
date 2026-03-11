import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API = 'http://localhost:5000';
const COLORS = ['#43e97b', '#6c63ff', '#ff6584', '#f7971e', '#a18cd1'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#6b6b80', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: 'DM Mono', fontSize: 14, color: '#43e97b' }}>
          ${Number(payload[0].value).toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function TopProducts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/analytics/top-products`)
      .then(res => {
        setData(res.data.map(d => ({ ...d, sales: Number(d.sales) })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Top Products by Revenue</span>
        <span className="card-badge">Top 5</span>
      </div>
      {loading ? (
        <div className="loading"><div className="spinner" /> Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 40, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#6b6b80', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="product" tick={{ fill: '#e8e8f0', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} width={70} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.05)' }} />
            <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
