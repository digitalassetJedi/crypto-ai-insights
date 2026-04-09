# Crypto AI Insights

A premium research aggregation platform curating high-quality crypto and AI research from top investors and thought leaders.

## Getting Started

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org/)
- **npm** or **yarn** (npm comes with Node.js)

### Installation

```bash
# 1. Navigate into the project
cd crypto-ai-insights

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploying to Vercel (Recommended)

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"New Project"** → Import your repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Your site will be live at `your-project.vercel.app`

To connect a custom domain:
- In the Vercel dashboard → **Settings** → **Domains**
- Add your domain (e.g., `cryptoaiinsights.com`)
- Update your DNS records as instructed

## Project Structure

```
crypto-ai-insights/
├── src/
│   ├── app/
│   │   ├── layout.js        # Root layout (fonts, metadata, SEO)
│   │   ├── globals.css       # Global styles & animations
│   │   └── page.js           # Home page entry point
│   ├── components/
│   │   └── CryptoAIInsights.jsx  # Main application component
│   └── data/
│       ├── firms.js          # Research firm directory
│       ├── content.js        # Summaries, takeaways, authors
│       └── generateArticles.js  # Article generator (replace with real data later)
├── public/                   # Static assets
├── next.config.js
├── package.json
└── README.md
```

## Next Steps

- **Real Data**: Replace `generateArticles.js` with RSS feed ingestion or a database
- **Database**: Add Supabase or Firebase for article storage and user bookmarks
- **Auth**: Add user accounts for persistent bookmarks and preferences
- **Search**: Integrate full-text search with Algolia or Meilisearch
- **API**: Build Next.js API routes for server-side data fetching

## Research Sources

Currently aggregating from 20 firms:

**Crypto-Native**: a16z crypto, Paradigm, Delphi Digital, Messari, Galaxy Digital, Pantera Capital, Multicoin Capital, The Block Research, Polychain Capital, Electric Capital, Variant Fund, Placeholder VC, Dragonfly, Framework Ventures

**TradFi/Hybrid**: Coinbase Institutional, Sequoia Capital, Goldman Sachs Digital, JPMorgan Digital, Morgan Stanley Digital, Bernstein Research
