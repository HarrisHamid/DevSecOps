# March Madness Metrics 🏀

A cloud-based analytics platform providing college basketball insights for fans and analysts during March Madness season.

## Team Members

- Harris Hamid
- Saikarthik Mummadisingu
- Esat Adiloglu
- Ryan Eshan
- Matt Bernardon

## Course

- **Course**: SSW 590-WS DevSecOps Principles and Practices
- **Professor**: Gregg Vesonder
- **Institution**: Stevens Institute of Technology

## Features

- 📊 Real-time college basketball statistics and analytics
- 🏆 Team performance tracking and comparisons
- 📈 Interactive data visualizations
- 🔔 Live score updates and notifications

## Tech Stack

### Frontend

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool & dev server
- **Tailwind CSS v4** — Styling
- **Chart.js** — Data visualizations
- **Supabase JS** — Database & realtime client

### Backend

- **Supabase** — Postgres database, authentication, realtime, and edge functions

### DevOps & Cloud

- **AWS** - Cloud infrastructure (EC2)
- **Docker** - Containerization
- **GitHub Actions** - CI/CD automation
- **CloudWatch** - Monitoring and logging

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (get credentials from **Settings → API**)

### Setup

```bash
# Install dependencies
cd frontend
npm install

# Configure environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`
