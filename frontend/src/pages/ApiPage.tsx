import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { payForApiCallOnChain } from '../lib/opnet';

const ENDPOINTS = [
    {
        method: 'GET',
        path: '/api/btc-price',
        desc: 'Get current Bitcoin price in USD',
        example: '{ "price": 97500, "change24h": 2.5, "source": "coingecko" }',
        free: true,
    },
    {
        method: 'GET',
        path: '/api/pool-stats',
        desc: 'Get aggregated stats for all leveraged pools',
        example: '{ "totalTvl": 12.5, "totalDepositors": 85, "pools": [...] }',
        free: true,
    },
    {
        method: 'GET',
        path: '/api/leverage-signal',
        desc: 'Get AI-powered leverage signal and market analysis',
        example: '{ "signal": "moderate", "confidence": 0.72, "recommendation": "x2 pool" }',
        free: false,
    },
];

const CODE_EXAMPLES = {
    curl: `curl -X GET "https://leveraged-pools.example.com/api/btc-price"
  -H "Content-Type: application/json"`,

    javascript: `const response = await fetch('/api/btc-price');
const data = await response.json();
console.log(data.price); // 97500`,

    python: `import requests

response = requests.get('https://leveraged-pools.example.com/api/btc-price')
data = response.json()
print(data['price'])  # 97500`,
};

type Lang = keyof typeof CODE_EXAMPLES;

export default function ApiPage() {
    const { connected, opnetConfig } = useWallet();
    const [activeLang, setActiveLang] = useState<Lang>('javascript');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentResult, setPaymentResult] = useState<string | null>(null);
    const [liveData, setLiveData] = useState<any>(null);
    const [activeEndpoint, setActiveEndpoint] = useState(0);

    useEffect(() => {
        fetch('/api/btc-price')
            .then(r => r.json())
            .then(setLiveData)
            .catch(() => setLiveData({ price: 97500, change24h: 2.5, source: 'mock' }));
    }, []);

    const handlePayForApi = async () => {
        if (!connected) return;
        setPaymentLoading(true);
        setPaymentResult(null);
        try {
            const txId = await payForApiCallOnChain(opnetConfig);
            setPaymentResult(`Payment sent! TX: ${txId}`);
        } catch (e: any) {
            setPaymentResult(`Error: ${e?.message || 'Failed'}`);
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-black text-white mb-2">API Reference</h1>
                <p className="text-gray-400">Integrate Leveraged BTC Pools data into your applications</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Endpoints */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Endpoint list */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-lev-border">
                            <h2 className="text-lg font-bold text-white">Endpoints</h2>
                        </div>
                        <div className="divide-y divide-lev-border">
                            {ENDPOINTS.map((ep, i) => (
                                <button
                                    key={ep.path}
                                    onClick={() => setActiveEndpoint(i)}
                                    className={`w-full p-4 text-left transition-colors ${
                                        activeEndpoint === i ? 'bg-lev-surface' : 'hover:bg-lev-bg'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            ep.method === 'GET' ? 'bg-lev-green/10 text-lev-green' : 'bg-lev-orange/10 text-lev-orange'
                                        }`}>
                                            {ep.method}
                                        </span>
                                        <code className="text-sm text-white font-mono">{ep.path}</code>
                                        {!ep.free && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-lev-orange/10 text-lev-orange border border-lev-orange/20">
                                                Paid
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 ml-14">{ep.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active endpoint detail */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-lev-green/10 text-lev-green">
                                {ENDPOINTS[activeEndpoint].method}
                            </span>
                            <code className="text-lg text-white font-mono">{ENDPOINTS[activeEndpoint].path}</code>
                        </div>

                        <p className="text-gray-400 mb-6">{ENDPOINTS[activeEndpoint].desc}</p>

                        <h3 className="text-sm font-semibold text-gray-300 mb-3">Response Example</h3>
                        <pre className="bg-lev-bg rounded-xl p-4 overflow-x-auto border border-lev-border">
                            <code className="text-sm text-lev-green font-mono">
                                {ENDPOINTS[activeEndpoint].example}
                            </code>
                        </pre>
                    </div>

                    {/* Code examples */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Code Examples</h2>

                        <div className="flex gap-2 mb-4">
                            {(Object.keys(CODE_EXAMPLES) as Lang[]).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLang(lang)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        activeLang === lang
                                            ? 'bg-lev-orange/10 text-lev-orange border border-lev-orange/20'
                                            : 'bg-lev-bg text-gray-400 border border-transparent hover:text-white'
                                    }`}
                                >
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </button>
                            ))}
                        </div>

                        <pre className="bg-lev-bg rounded-xl p-4 overflow-x-auto border border-lev-border">
                            <code className="text-sm text-gray-300 font-mono whitespace-pre">
                                {CODE_EXAMPLES[activeLang]}
                            </code>
                        </pre>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-6">
                    {/* Live data */}
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Live Data</h3>
                        {liveData ? (
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">BTC Price</span>
                                    <span className="text-white font-bold">${liveData.price?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">24h Change</span>
                                    <span className={liveData.change24h >= 0 ? 'text-lev-green' : 'text-red-400'}>
                                        {liveData.change24h >= 0 ? '+' : ''}{liveData.change24h}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Source</span>
                                    <span className="text-gray-300">{liveData.source}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Loading...</p>
                        )}
                    </div>

                    {/* Pay for API */}
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">API Access</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Some endpoints require on-chain payment. Pay with BTC through the smart contract.
                        </p>
                        <button
                            onClick={handlePayForApi}
                            disabled={!connected || paymentLoading}
                            className="btn-primary w-full text-sm"
                        >
                            {paymentLoading ? 'Processing...' : !connected ? 'Connect Wallet' : 'Pay for API Call'}
                        </button>

                        {paymentResult && (
                            <div className={`mt-3 p-3 rounded-lg text-xs ${
                                paymentResult.startsWith('Error')
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : 'bg-lev-green/10 text-lev-green border border-lev-green/20'
                            }`}>
                                {paymentResult}
                            </div>
                        )}
                    </div>

                    {/* Rate limits */}
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Rate Limits</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Free endpoints</span>
                                <span className="text-white">100 req/min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Paid endpoints</span>
                                <span className="text-white">Unlimited</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Response format</span>
                                <span className="text-white">JSON</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">System Status</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'API Server', status: 'operational' },
                                { name: 'Smart Contract', status: 'operational' },
                                { name: 'Price Feed', status: 'operational' },
                            ].map(s => (
                                <div key={s.name} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">{s.name}</span>
                                    <span className="flex items-center gap-1.5 text-lev-green">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lev-green" />
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
