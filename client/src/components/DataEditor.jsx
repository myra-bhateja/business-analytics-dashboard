import { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DataEditor({ onDataChange }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/sales`);
      setRecords(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditValues({
      region: record.region,
      product: record.product,
      amount: record.amount,
      quantity: record.quantity,
      saleDate: record.saleDate?.split('T')[0] || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      await axios.put(`${API}/api/sales/${id}`, {
        ...editValues,
        amount: parseFloat(editValues.amount),
        quantity: parseInt(editValues.quantity),
        saleDate: new Date(editValues.saleDate).toISOString(),
      });
      setMessage({ type: 'success', text: '✓ Record updated' });
      setEditingId(null);
      await fetchRecords();
      if (onDataChange) onDataChange();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to update record' });
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API}/api/sales/${id}`);
      setMessage({ type: 'success', text: '✓ Record deleted' });
      await fetchRecords();
      if (onDataChange) onDataChange();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete record' });
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading records...</div>;

  return (
    <div>
      <div className="editor-toolbar">
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Sales Records</div>
          <div className="record-count">{records.length} records total — edit values to see charts update live</div>
        </div>
        {message && (
          <div className={`alert alert-${message.type}`} style={{ margin: 0 }}>{message.text}</div>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Region</th>
              <th>Amount ($)</th>
              <th>Quantity</th>
              <th>Sale Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>#{record.id}</td>

                {editingId === record.id ? (
                  <>
                    <td><input className="td-input" value={editValues.product} onChange={e => setEditValues(p => ({ ...p, product: e.target.value }))} /></td>
                    <td><input className="td-input" value={editValues.region} onChange={e => setEditValues(p => ({ ...p, region: e.target.value }))} /></td>
                    <td><input className="td-input" type="number" value={editValues.amount} onChange={e => setEditValues(p => ({ ...p, amount: e.target.value }))} /></td>
                    <td><input className="td-input" type="number" value={editValues.quantity} onChange={e => setEditValues(p => ({ ...p, quantity: e.target.value }))} /></td>
                    <td><input className="td-input" type="date" value={editValues.saleDate} onChange={e => setEditValues(p => ({ ...p, saleDate: e.target.value }))} /></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-sm btn-success" onClick={() => saveEdit(record.id)} disabled={saving}>Save</button>
                        <button className="btn btn-sm btn-danger" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{record.product}</td>
                    <td>{record.region}</td>
                    <td style={{ color: 'var(--accent3)' }}>${Number(record.amount).toLocaleString()}</td>
                    <td>{record.quantity}</td>
                    <td>{record.saleDate ? new Date(record.saleDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-sm btn-success" onClick={() => startEdit(record)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteRecord(record.id)}>Delete</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
