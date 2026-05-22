# StorageIQ — Self-Storage Acquisition Intelligence Platform

A professional, PE-grade web application for evaluating self-storage facility acquisitions. Built with React, Tailwind CSS, Recharts, and Framer Motion.

## Features

### Slide Deck Mode (12 Slides)
- Title & framework overview
- Investment thesis with supporting metrics
- Market fundamentals scorecard with radar chart
- Supply & competition analysis with competitive table
- Occupancy & revenue dashboard with trend charts
- Revenue optimization opportunity matrix
- Expense structure with waterfall chart
- NOI & financing with sensitivity table
- Infrastructure & CapEx risk matrix
- Ideal vs. Dangerous deals comparison
- Weighted acquisition scorecard
- Final recommendation framework

### Interactive Dashboard
- Real-time acquisition input form
- Auto-calculated cap rate, DSCR, cash-on-cash, LTV, NOI margin
- Occupancy gauges (physical & market)
- Dynamic recommendation engine (Strong Buy / Moderate Buy / Investigate / Reject)
- Risk heatmap by category
- NOI trend, occupancy, revenue mix, and expense charts
- Pre-loaded DFW mock acquisition (Sundance Storage, Frisco TX)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **React 19** + Vite
- **Tailwind CSS v4**
- **Recharts** — Bar, Line, Pie, Radar charts
- **Framer Motion** — Animations and transitions
- **Lucide React** — Icons

## Mock Data

Includes a complete mock acquisition scenario:
- Property: Sundance Storage, Frisco TX (DFW market)
- 68,500 sf / 520 units
- Purchase price: $8.2M
- Current NOI: $612K / Stabilized: $740K
- DSCR: 1.38x / Cap rate: 7.46% / Cash-on-cash: 10.1%

## Export

Click **Export** in the presentation toolbar or **Export PDF** in the dashboard to trigger browser print (use "Save as PDF").
