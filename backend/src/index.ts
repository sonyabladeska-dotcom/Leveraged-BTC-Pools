import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Leveraged BTC Pools API' });
});

// ── BTC Price ──
app.get('/api/btc-price', (_req, res) => {
    const base = 97500;
    const variance = (Math.random() - 0.5) * 2000;
    res.json({
        price: Math.round(base + variance),
        change24h: +(Math.random() * 6 - 3).toFixed(2),
        timestamp: new Date().toISOString(),
    });
});

// ── Pool Stats ──
app.get('/api/pool-stats', (_req, res) => {
    res.json({
        tvl: 12.5,
        pools: [
            { id: 1, name: 'BTC Pool x1', multiplier: 1, tvl: 5.0, depositors: 42 },
            { id: 2, name: 'BTC Pool x2', multiplier: 2, tvl: 4.2, depositors: 28 },
            { id: 3, name: 'BTC Pool x3', multiplier: 3, tvl: 3.3, depositors: 15 },
        ],
        timestamp: new Date().toISOString(),
    });
});

// ── Leverage Signal ──
app.get('/api/leverage-signal', (_req, res) => {
    const signals = ['LONG', 'SHORT', 'NEUTRAL'];
    const signal = signals[Math.floor(Math.random() * signals.length)];
    const confidence = +(50 + Math.random() * 50).toFixed(1);

    res.json({
        signal,
        confidence,
        recommendedPool: signal === 'LONG' ? 3 : signal === 'SHORT' ? 1 : 2,
        reasoning: signal === 'LONG'
            ? 'Strong upward momentum — BTC Pool x3 recommended'
            : signal === 'SHORT'
            ? 'Bearish signals — conservative BTC Pool x1 recommended'
            : 'Mixed signals — balanced BTC Pool x2 recommended',
        timestamp: new Date().toISOString(),
    });
});

const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n  🚀 Leveraged BTC Pools API on http://localhost:${PORT}`);
    console.log(`  📊 GET /api/btc-price`);
    console.log(`  📈 GET /api/pool-stats`);
    console.log(`  🎯 GET /api/leverage-signal\n`);
});
