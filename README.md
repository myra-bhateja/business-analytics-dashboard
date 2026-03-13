# Business Analytics Dashboard

A full-stack business intelligence platform for uploading, visualizing, and analyzing sales data with AI-powered insights.

**Live Demo:** https://business-analytics-dashboard-gilt.vercel.app

> Note: First load may take up to 60 seconds as the server wakes up from sleep.

---

## Features

- Login / Register with JWT authentication
- Sales analytics charts (by region, monthly trend, top products)
- CSV upload to populate the database
- Inline data editor (edit and delete records)
- AI-powered business insights and chat (Google Gemini)
- About page

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Recharts, Axios |
| Backend | Node.js, Express |
| Sales Database | PostgreSQL via Supabase |
| Auth Database | MongoDB Atlas |
| ORM | Prisma |
| AI | Google Gemini 2.0 Flash |
| Auth | JWT + bcrypt |
| Local Dev | Docker Compose |
| Deployment | Vercel (frontend), Render (backend) |

---

## Local Development

**Prerequisites:** Docker Desktop

```bash
git clone https://github.com/myra-bhateja/business-analytics-dashboard.git
cd business-analytics-dashboard
docker compose up
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Environment Variables

Create `server/.env`:

```env
DATABASE_URL=your_supabase_connection_string
DIRECT_URL=your_supabase_direct_url
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## Developed by

Myra Bhateja (myrabhateja@gmail.com)
