# Laundromat Underwriting Copilot

An AI-powered web app for evaluating laundromat acquisition opportunities. Paste a listing URL or deal text, and get:

- **Structured data extraction** (via OpenAI + Playwright)
- **Market enrichment** (Census demographics, Google Places competitors)
- **10-year cash flow model** (IRR, DSCR, MOIC, CoC return)
- **Deal scoring** (100-point rubric across 5 categories)
- **Investment memo** (GPT-4o generated, first-pass analysis)

## Tech Stack

- **Frontend**: Next.js 16 / React / TypeScript / Tailwind CSS
- **Backend**: Next.js API routes (Node.js)
- **Database**: SQLite (via Prisma 7 + libSQL adapter)
- **AI**: OpenAI GPT-4o / GPT-4o-mini
- **Scraping**: Playwright (headless Chromium) + fetch fallback
- **Data Sources**: U.S. Census ACS API, Google Places API

## Setup

### 1. Install dependencies

```bash
cd laundromat-copilot
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here          # Required
GOOGLE_PLACES_API_KEY=your-key-here     # Optional (competitor data)
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Set up database

```bash
npx prisma migrate dev
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Home page**: Paste a listing URL (BizBuySell, BizQuest, LoopNet) or listing text
2. **Analysis runs automatically**: Extraction → Market enrichment → Cash flow model → Scoring
3. **Deal detail page** (tabs):
   - **Overview**: All extracted fields with confidence score
   - **Market Data**: Census demographics + competitor map
   - **Cash Flow Model**: 10-year P&L with IRR/DSCR/MOIC
   - **Deal Score**: 100-point scoring across 5 categories
   - **Investment Memo**: One-click GPT-4o memo generation

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home: URL/paste input
│   ├── deals/
│   │   ├── page.tsx                # All deals list
│   │   └── [id]/page.tsx           # Deal detail + tabs
│   └── api/
│       ├── analyze/route.ts        # Full pipeline (extract→enrich→model→score)
│       ├── extract/route.ts        # Listing extraction only
│       ├── enrich/route.ts         # Market enrichment only
│       ├── model/route.ts          # Cash flow modeling only
│       ├── score/route.ts          # Deal scoring only
│       ├── memo/route.ts           # Investment memo generation
│       └── deals/[id]/route.ts     # CRUD for deals
├── lib/
│   ├── extractors/
│   │   └── listingExtractor.ts     # Playwright + OpenAI extraction
│   ├── enrichment/
│   │   └── marketEnrichment.ts     # Census API + Google Places
│   ├── models/
│   │   └── cashFlowModel.ts        # 5–10 year financial model engine
│   ├── scoring/
│   │   └── dealScorer.ts           # 100-point deal scorer
│   ├── memo/
│   │   └── memoGenerator.ts        # GPT-4o investment memo
│   └── db/
│       └── prisma.ts               # Prisma client singleton
├── components/
│   ├── ListingCard.tsx             # Extracted data display
│   ├── MarketDataCard.tsx          # Demographics + competitors
│   ├── CashFlowTable.tsx           # Year-by-year model table
│   ├── DealScore.tsx               # Scoring card with bars
│   └── InvestmentMemo.tsx          # Memo display with markdown
└── types/
    └── deal.ts                     # TypeScript types for all data
```

## API Keys

| Key | Required | Source |
|-----|----------|--------|
| `OPENAI_API_KEY` | Yes | [platform.openai.com](https://platform.openai.com/api-keys) |
| `GOOGLE_PLACES_API_KEY` | No | [console.cloud.google.com](https://console.cloud.google.com) |

Without `GOOGLE_PLACES_API_KEY`, competitor data will be unavailable but all other features work.

## Scoring Rubric

| Category | Weight | Criteria |
|----------|--------|----------|
| Pricing | 25pts | SDE multiple vs. laundromat benchmarks (2–4x) |
| Cash Flow | 25pts | DSCR, IRR, Year-1 cash-on-cash return |
| Market | 20pts | Renter %, competition, population, income |
| Operations | 15pts | Machine age, service mix, lease quality |
| Risk Profile | 15pts | Data completeness, margin analysis |

## Cash Flow Model

- **Revenue growth**: 3% annually (adjustable)
- **Operating expenses**: Laundromat benchmarks (utilities 22%, labor 8%, maintenance 6%)
- **Financing**: SBA 7(a) @ 8.5%/10yr + optional seller financing
- **Exit**: 3.5x EBITDA multiple (adjustable)
- **IRR**: Computed via Newton-Raphson method
