export default function About() {
  return (
    <div className="about-container">
      <div className="about-section">
        <div className="about-label">Project</div>
        <h2 className="about-title">Business Analytics Dashboard</h2>
        <p className="about-desc">
          A full-stack business intelligence platform for uploading, visualizing, and analyzing sales data with AI-powered insights.
        </p>
      </div>

      <div className="about-divider" />

      <div className="about-section">
        <div className="about-label">Tech Stack</div>
        <div className="stack-grid">
          {[
            { layer: 'Frontend', detail: 'React, Recharts, Axios — deployed on Vercel' },
            { layer: 'Backend', detail: 'Node.js, Express — deployed on Render (Docker)' },
            { layer: 'Database', detail: 'MongoDB Atlas — sales data, authentication, and all storage' },
            { layer: 'AI', detail: 'Google Gemini 2.5 Flash with 1.5 Flash fallback' },
            { layer: 'Auth', detail: 'JWT tokens with bcrypt password hashing' },
            { layer: 'Infrastructure', detail: 'Docker (Render deployment)' },
          ].map(item => (
            <div key={item.layer} className="stack-item">
              <div className="stack-layer">{item.layer}</div>
              <div className="stack-detail">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-divider" />

      <div className="about-section">
        <div className="about-label">About Me</div>
        <div className="about-name">Myra Bhateja <span className="about-email">(myrabhateja@gmail.com)</span></div>
        <p className="about-bio">
          I am Computer Science undergraduate specialising in Big Data, committed to developing reliable, data-driven and AI-enabled systems. Strong interest in solving real-world problems through structured, analytical and research-oriented approaches. I'm someone who embraces challenges head-on and is always eager to explore new experiences. I strive to reach my fullest potential and am committed to continually expanding my skill set and broadening my horizons.
        </p>
      </div>
    </div>
  );
}