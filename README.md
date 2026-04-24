# Atlas - Blockchain Intelligence Dashboard

A real-time blockchain intelligence dashboard powered by **Dune SIM** for tracking PUSD stablecoin activity on Solana.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8)
![Dune SIM](https://img.shields.io/badge/Dune%20SIM-00D1B2)

## About Dune SIM

[Dune SIM](https://www.dune.com/sim) is a real-time blockchain data API by Dune. It gives developers instant access to wallet balances, token metadata, transaction history, and onchain activity across 60+ EVM chains and Solana — all through a single API key, with no indexer setup required.

### Key Features
- Real-time wallet balances
- Transaction history
- Token transfer tracking
- Network activity monitoring
- Webhook subscriptions for push data

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/atlas.git
cd atlas

# Install dependencies
npm install

# Add your Dune SIM API key
echo "NEXT_PUBLIC_DUNE_API_KEY=your_api_key_here" > .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## How SIM is Used

This project integrates Dune SIM in the following ways:

### 1. Wallet Balance Queries
```typescript
// lib/simClient.ts - getWalletBalance()
const sql = `
  SELECT address, balance, balance_usd
  FROM balances.spl_latest
  WHERE blockchain = 'solana' AND address = '${walletAddress}'
`;
```

### 2. Transaction History
```typescript
// lib/simClient.ts - getTransactionHistory()
const sql = `
  SELECT block_time, tx_from, tx_to, value, tx_hash
  FROM solana.transactions
  WHERE (tx_from = '${walletAddress}' OR tx_to = '${walletAddress}')
    AND block_time > NOW() - INTERVAL '30' DAY
  ORDER BY block_time DESC
`;
```

### 3. Token Transfers
```typescript
// lib/simClient.ts - getTokenTransfers()
const sql = `
  SELECT block_time, from_account, to_account, amount, tx_hash
  FROM solana.spl_transfers
  WHERE from_account = '${walletAddress}' OR to_account = '${walletAddress}'
`;
```

### 4. Real-time Network Activity
```typescript
// lib/simClient.ts - getRecentNetworkActivity()
const sql = `
  SELECT block_time, tx_from, tx_to, value, tx_hash
  FROM solana.transactions
  WHERE block_time > NOW() - INTERVAL '1' HOUR
  ORDER BY block_time DESC
`;
```

## Features

### Global PUSD Flow Dashboard
- Live transaction feed with real-time updates
- Filter incoming/outgoing transactions
- Top wallets by activity

### Wallet Intelligence (`/wallet/[address]`)
- Complete wallet profile
- PUSD & SOL balance
- Transaction history
- Trust score (0-100)
- Activity timeline

### Trust Score Engine
Calculates wallet trustworthiness based on:
- Transaction volume consistency (+25 pts max)
- Unique counterparties (+25 pts max)
- Activity duration (+10 pts max)
- Stability metrics (+25 pts max)
- Anomaly penalties (-30 pts max)

### Risk Detection Panel (`/risk`)
- High velocity wallets
- Low trust score alerts
- New high-volume wallet detection
- Activity pattern analysis

### Analytics Dashboard (`/analytics`)
- Total network volume
- Active wallets count
- Volume over time charts
- Activity heatmap

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Data**: Dune SIM API
- **State**: Zustand
- **Charts**: Recharts

## Project Structure

```
.
├── app/
│   ├── page.tsx              # Global dashboard
│   ├── analytics/page.tsx   # Economic overview
│   ��── risk/page.tsx        # Risk detection
│   ├── wallet/[address]/    # Wallet intelligence
│   └── api/status/         # API status endpoint
├── components/
│   ├── TransactionFeed.tsx  # Live transactions
│   ├── WalletCard.tsx        # Wallet profile card
│   ├── TrustScoreBadge.tsx   # Trust score display
│   ├── FlowGraph.tsx        # Charts & heatmaps
│   └── RiskPanel.tsx       # Risk alerts
├── lib/
│   ├── simClient.ts        # Dune SIM integration
│   ├── trustScore.ts       # Trust algorithm
│   ├── formatters.ts       # Display utilities
│   └── store.ts           # Zustand state
└── ...
```

## API Configuration

Get your Dune SIM API key:
1. Sign up at [dune.com/sim](https://www.dune.com/sim)
2. Navigate to API settings
3. Copy your API key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_DUNE_API_KEY=your_api_key_here
   ```

## Demo

The app shows a "Live API" badge when connected to real Dune SIM data, or "Mock Data" when running without an API key.

## License

MIT

---

Built for the Dune SIM Hackathon 2026