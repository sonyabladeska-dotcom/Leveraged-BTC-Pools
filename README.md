# Leveraged BTC Pools

DeFi protocol for leveraged Bitcoin pools on Bitcoin L1 via OP_NET.

## Architecture

```
├── contracts/        # AssemblyScript smart contract (OP_NET)
├── frontend/         # Vite + React + Tailwind (Jupiter-inspired UI)
├── backend/          # Express.js API server
└── scripts/          # Deployment scripts
```

## Smart Contract

**LeveragedBTCPools** — deposit BTC into pools with x1, x2, or x3 leverage.

### Methods

| Method | Description |
|--------|-------------|
| `deposit(poolId, amount)` | Deposit BTC into a leveraged pool |
| `withdraw(poolId)` | Withdraw with leveraged returns |
| `getPoolInfo(poolId)` | Get pool TVL and multiplier |
| `getUserDeposit(poolId)` | Get user's deposit in a pool |
| `payForApiCall()` | Pay for premium API access |
| `getTotalPools()` | Get total number of pools |
| `getApiPayments()` | Get API payment count |

### Pools

- **x1 Pool** — 1:1 exposure, conservative
- **x2 Pool** — 2x leveraged exposure, moderate risk
- **x3 Pool** — 3x leveraged exposure, high risk

## Frontend

- **Home** — Hero section, protocol stats, pool overview
- **Pools** — Deposit/withdraw with live on-chain data
- **Dashboard** — User positions, exposure charts, TVL history
- **API** — Endpoint documentation, code examples

## Backend API

| Endpoint | Description |
|----------|-------------|
| `GET /api/btc-price` | Current BTC price (CoinGecko) |
| `GET /api/pool-stats` | Aggregated pool statistics |
| `GET /api/leverage-signal` | Market signal analysis |

## Setup

```bash
# Install all dependencies
npm install

# Build smart contract
cd contracts && npm run build

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

## Environment Variables

```
VITE_CONTRACT_ADDRESS=    # Deployed contract address
VITE_OPNET_RPC_URL=       # OP_NET RPC (default: https://testnet.opnet.org)
VITE_API_URL=             # Backend API URL
```

## Tech Stack

- **Contract**: AssemblyScript + OP_NET runtime
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Express.js, TypeScript
- **Wallet**: OP_WALLET browser extension
- **Network**: Bitcoin L1 (Testnet)
