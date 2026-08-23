# 🚀 ReportIQ Production Deployment Guide (100% Free Tier)

This guide walks you step-by-step through deploying ReportIQ to production without paying hosting fees.

---

## 🛠 Tech Stack Overview

- **Frontend**: Next.js 16 (React 19, TailwindCSS) ➔ **Deployed on Vercel**
- **Backend**: NestJS 11 (TypeScript, Prisma) ➔ **Deployed on Render or Koyeb**
- **Database**: SQLite (via Turso) or Cloud PostgreSQL (via Neon / Supabase) ➔ **Free Tier**
- **Media & Storage**: Cloudinary (25GB Free Storage)
- **Transactional Emails**: Resend (3,000 Free Emails/Month)

---

## 🌐 Step 1: Deploy Database (Free Cloud Database)

Choose **Option A** (Simplest, SQLite) or **Option B** (PostgreSQL):

### Option A: Turso (Free Cloud SQLite - Recommended)
1. Install Turso CLI: `curl -sL https://get.tur.so/install.sh | bash`
2. Create a database: `turso db create reportiq`
3. Get connection URL: `turso db show reportiq --url`
4. Update `DATABASE_URL` in your backend environment variables (`libsql://...`).

### Option B: Neon PostgreSQL
1. Sign up at [Neon.tech](https://neon.tech) and create a new project `reportiq`.
2. Copy your Postgres Connection String (`postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`).
3. In `backend/prisma/schema.prisma`, set `provider = "postgresql"` (or use `schema.postgresql.prisma`).
4. Run schema push: `npx prisma db push`.

---

## ⚡ Step 2: Deploy Backend API (Render / Koyeb)

### Deploying on Render (Free Web Service)
1. Push your repository to **GitHub**.
2. Sign up at [Render.com](https://render.com).
3. Click **New +** ➔ **Blueprint** ➔ Connect your GitHub repository.
4. Select `backend/render.yaml` or create a **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma db push && npm run build`
   - **Start Command**: `npm run start:prod`
5. Set Environment Variables in Render Dashboard:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_custom_secure_jwt_secret_key
   OPENAI_API_KEY=sk-proj-your_openai_key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   USE_MOCK_EMAIL=true
   USE_MOCK_STORAGE=true
   ```
6. Copy your live backend URL (e.g. `https://reportiq-backend.onrender.com`).

---

## 🎨 Step 3: Deploy Frontend (Vercel)

1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New Project** ➔ Import your **GitHub Repository**.
3. Set **Framework Preset**: `Next.js`.
4. Set **Root Directory**: `frontend`.
5. Expand **Environment Variables** and add:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
   ```
6. Click **Deploy**. Vercel will automatically build and issue an SSL HTTPS domain for free!

---

## 🐳 Alternative: Deploy with Docker Compose

If you have a VPS or server (or run locally):
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
This starts both frontend (`http://localhost:3000`) and backend (`http://localhost:4000`) in containerized production mode.

---

## 🔒 Verification & Post-Deployment Checklist

- [ ] Visit `https://your-frontend-domain.vercel.app/` - ensure landing page renders cleanly.
- [ ] Test Signup & Login at `/auth/signup` and `/auth/login`.
- [ ] Visit Swagger Docs at `https://your-backend-url.onrender.com/api/docs`.
- [ ] Test AI Report generation (`/dashboard/reports/generate`).

---
Built with ❤️ for ReportIQ.
