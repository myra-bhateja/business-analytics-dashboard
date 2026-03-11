import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

const SUGGESTIONS = [
  'Which region has the highest sales?',
  'What is the best performing product?',
  'Show me the sales trend over time',
  'Which month had the most revenue?',
];

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/ai/chat`, { question: q });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Failed to get a response. Check your AI API key.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">💬</div>
              <div className="empty-chat-text">Ask anything about your sales data</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 20,
                      color: 'var(--text-muted)',
                      fontFamily: 'DM Mono',
                      fontSize: 11,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => e.target.style.borderColor = 'var(--accent)'}
                    onMouseOut={e => e.target.style.borderColor = 'var(--border)'}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <div className="msg-avatar">
                    {m.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="message ai">
                  <div className="msg-avatar">🤖</div>
                  <div className="msg-bubble">
                    <div className="loading" style={{ padding: '4px 0' }}>
                      <div className="spinner" /> Thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your sales data..."
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            onClick={() => send()}
            disabled={!input.trim() || loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
