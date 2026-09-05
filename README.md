# ReportIQ 🚀
### Enterprise AI-Powered Client Reporting Platform for Agencies & Freelancers

[![CI/CD Pipeline](https://github.com/rahulgarg55/ReportIQ/actions/workflows/ci.yml/badge.svg)](https://github.com/rahulgarg55/ReportIQ/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?logo=nestjs)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://prisma.io)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)](https://openai.com)

**ReportIQ** is a modern, white-label client reporting SaaS that automates the entire reporting workflow for digital marketing agencies. It pulls cross-channel marketing data, runs AI diagnostic evaluations, generates interactive presentation slide decks, benchmarks competitor intelligence, and automates multi-channel delivery directly to clients.

---

## 🌟 Key Features

### 1. 🤖 Automated AI Intelligence & Insights
- **Natural Language Executive Summaries**: Powered by OpenAI GPT-4o to transform complex metrics into clear executive takeaways.
- **Diagnostic Action Plans**: Automatically prioritizes high-impact recommendations for next month's campaign optimization.
- **AI Marketing Chat Assistant**: Interactive AI copilot inside the dashboard for ad performance analysis and strategy suggestions.

### 2. 📊 Interactive Presentation Slide Deck Mode
- **Full-Screen Client Review Decks**: 1-click transformation of any performance report into a 5-slide polished pitch presentation.
- **Keyboard Shortcuts & 16:9 Canvas**: Navigate effortlessly (`<` and `>` arrows) during live client Zoom / Google Meet presentations.
- **Dedicated Slides**: Executive Cover, KPI Performance, Channel Attribution & Traffic Mix, AI Diagnostics, and Next Month Strategic Action Plan.

### 3. 🛡️ Client Strategy & Budget Sign-Off Workflow
- **Digital Sign-Off Workflow**: Clients can review proposals, enter authorized signatory details, and approve monthly ad spend directly within their portal.
- **Audit-Logged Feedback**: Preserves client approvals and change requests with timestamps and budget confirmation records.

### 4. 📲 Multi-Channel Dispatch Engine
- **WhatsApp Delivery**: Instant dispatch of report notifications and executive summaries via Twilio WhatsApp.
- **Slack Incoming Webhook Integration**: Posts automated report alerts directly into agency or client Slack channels.
- **Transactional Email**: High-deliverability HTML emails with embedded report links powered by Resend.

### 5. ⚔️ Automated Competitor Benchmarking Matrix
- **Side-by-Side Competitive Intelligence**: Compare your client against 2-3 competitor domains in real time.
- **Key Metrics Tracked**: Domain Authority (DA), Organic Search Keyword Footprint, Estimated Monthly Traffic, Core Web Vitals PageSpeed, and Active Paid Ad Creatives.
- **AI Opportunity Gap Analysis**: Automatically identifies commercial keywords and technical gaps to unlock new revenue.

### 6. 🎨 Full Agency White-Labeling & Custom Domains
- **Custom CNAME Domains**: Host client reports under `reports.youragency.com` with automated SSL provisioning.
- **Agency Branding**: Custom agency logo, primary/accent brand colors, and personalized portal themes.
- **Localized Multi-Language Support**: Seamlessly switch between English and Spanish.

### 7. 🔌 100+ Data Integrations & Connectors
- **Analytics & SEO**: Google Analytics 4 (GA4), Google Search Console, Ahrefs, SEMrush.
- **Advertising**: Google Ads, Meta Ads (Facebook & Instagram), LinkedIn Ads, TikTok Ads.
- **E-Commerce & CRM**: Shopify, WooCommerce, Stripe, HubSpot, Salesforce.
- **Agency Notifications**: Slack Webhooks, WhatsApp, Resend/SendGrid.

### 8. 🛡️ Admin Command Center (`/admin`)
- Real-time platform metrics: Total Registered Agencies, Platform MRR, Active Subscriptions, and Reports Generated.
- Live platform activity feed & system health monitoring (API Latency, DB Pool, Redis Cache, AI Quota Usage).
- User Management: 1-click plan upgrades, manual verification, and "Login As" agency impersonation for customer support.

---

## 🏗 Architecture & Tech Stack

```
ReportIQ Architecture
├── Frontend (Next.js 16 App Router)
│   ├── Client & Agency Dashboard (/dashboard)
│   ├── Public & Shareable Reports (/report/[slug])
│   ├── Client Self-Service Portal (/portal)
│   ├── Admin Command Center (/admin)
│   └── Presentation Slide Deck Mode
│
├── Backend (NestJS 11 + TypeScript)
│   ├── AuthModule (JWT, Passport, Google OAuth 2.0, Demo 1-Click)
│   ├── ReportsModule (AI Generation, PDF Puppeteer, Slide Decks, Approvals)
│   ├── IntegrationsModule (GA4, Google Ads, Meta, Shopify, LinkedIn, Slack)
│   ├── UsersModule (White-Label Branding, Custom Domains CNAME)
│   ├── AdminModule (System Health, Metrics, Maintenance Mode)
│   ├── WhatsappModule & EmailModule (Multi-channel Dispatch)
│   └── ScraperModule (Cheerio & Competitor SEO Intelligence)
│
└── Database & Storage
    ├── Prisma ORM (Auto-adapts between SQLite & PostgreSQL)
    └── Cloudinary Storage (Report PDFs & Agency Assets)
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0 or higher (v20+ recommended)
- **npm**: v9.0 or higher

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/rahulgarg55/ReportIQ.git
cd reportiq

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

**Backend (`backend/.env`):**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=sk-proj-your_openai_api_key
FRONTEND_URL=http://localhost:3000
USE_MOCK_EMAIL=true
USE_MOCK_STORAGE=true
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize Database & Run

```bash
# In backend directory:
npx prisma db push
node prepare-db.js
npm run start:dev

# In a second terminal (frontend directory):
npm run dev
```

The application is now live:
- **Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api`
- **Swagger Documentation**: `http://localhost:4000/api/docs`
- **Admin Command Center**: `http://localhost:3000/admin`
- **Client Portal**: `http://localhost:3000/portal`

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new agency |
| `POST` | `/api/auth/login` | Agency login with JWT |
| `POST` | `/api/auth/demo-login` | 1-Click instant agency demo access |
| `GET` | `/api/auth/google` | Google OAuth 2.0 single sign-on |
| `GET` | `/api/reports` | List reports for agency / client |
| `POST` | `/api/reports/generate` | Generate AI-powered client report |
| `GET` | `/api/reports/:id/slides` | **NEW**: Structured 5-slide presentation data |
| `POST` | `/api/reports/:id/approve` | **NEW**: Submit client strategy/budget sign-off |
| `POST` | `/api/reports/:id/dispatch` | **NEW**: Multi-channel dispatch (Slack, WhatsApp, Email) |
| `GET` | `/api/users/me/custom-domain`| **NEW**: Get agency CNAME & SSL verification status |
| `POST` | `/api/users/me/custom-domain`| **NEW**: Save and verify custom domain |
| `POST` | `/api/integrations/shopify` | **NEW**: Connect Shopify store metrics |
| `POST` | `/api/integrations/linkedin-ads` | **NEW**: Connect LinkedIn Ads account |
| `POST` | `/api/integrations/slack` | **NEW**: Connect Slack notifications webhook |
| `GET` | `/api/admin/stats` | Platform MRR, users, and health stats |

---

## 🚀 Production Deployment

ReportIQ is pre-configured for automated continuous deployment on push to `main`:

### Backend (Render Free Tier)
- Infrastructure defined in [`render.yaml`](render.yaml)
- Auto-detects SQLite or Cloud PostgreSQL (Neon / Supabase) via `backend/prepare-db.js`
- Connect your GitHub repo via **Render Blueprint**

### Frontend (Vercel Free Tier)
- Connect repo to **Vercel** with Root Directory set to `frontend`
- Set `NEXT_PUBLIC_API_URL` to your Render backend URL
- Free SSL certificate & global edge CDN

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

Built with ❤️ for digital agencies by **Rahul Garg**.
