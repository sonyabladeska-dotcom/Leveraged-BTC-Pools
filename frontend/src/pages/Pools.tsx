import { useState, useEffect } from 'react';
import { MOCK_POOLS, MOCK_USER_DEPOSITS } from '../lib/mock-data';
import { useWallet } from '../context/WalletContext';
import { getPoolInfoOnChain, getUserDepositOnChain } from '../lib/opnet';
import PoolCard from '../components/cards/PoolCard';
import type { Pool } from '../types';

export default function Pools() {
    const { connected, opnetConfig } = useWallet();
    const [pools, setPools] = useState<Pool[]>(MOCK_POOLS);
    const [userDeposits, setUserDeposits] = useState<Record<number, number>>({});
    const [btcPrice, setBtcPrice] = useState<number | null>(null);
    const [loadingOnChain, setLoadingOnChain] = useState(false);

    // Fetch BTC price from backend
    useEffect(() => {
        fetch('/api/btc-price')
            .then(r => r.json())
            .then(d => setBtcPrice(d.price))
            .catch(() => setBtcPrice(97500));
    }, []);

    // Fetch on-chain data when connected
    useEffect(() => {
        if (!connected || !opnetConfig.provider) return;
        setLoadingOnChain(true);

        (async () => {
            const updatedPools = [...MOCK_POOLS];
            const deposits: Record<number, number> = {};

            for (const pool of updatedPools) {
                try {
                    const info = await getPoolInfoOnChain(opnetConfig, pool.id);
                    if (info) {
                        pool.tvl = info.totalDeposits / 1e8;
                    }
                    const dep = await getUserDepositOnChain(opnetConfig, pool.id);
                    if (dep > 0) deposits[pool.id] = dep;
                } catch (e) {
                    console.error(`Pool ${pool.id}:`, e);
                }
            }

            setPools(updatedPools);
            setUserDeposits(deposits);
            setLoadingOnChain(false);
        })();
    }, [connected, opnetConfig]);

    // Use mock deposits if not connected
    const getDeposit = (poolId: number): number => {
        if (Object.keys(userDeposits).length > 0) return userDeposits[poolId] || 0;
        if (!connected) {
            const mock = MOCK_USER_DEPOSITS.find(d => d.poolId === poolId);
            return mock?.amount || 0;
        }
        return 0;
    };

    const totalTvl = pools.reduce((acc, p) => acc + p.tvl, 0);
    const totalDepositors = pools.reduce((acc, p) => acc + p.depositors, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-black text-white mb-2">Leveraged Pools</h1>
                <p className="text-gray-400">Deposit BTC into leveraged pools for multiplied exposure</p>
            </div>

            {/* Overview stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total TVL</p>
                    <p className="text-2xl font-black text-white">{totalTvl.toFixed(2)} BTC</p>
                    {btcPrice && (
                        <p className="text-sm text-gray-500">${(totalTvl * btcPrice).toLocaleString()}</p>
                    )}
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Depositors</p>
                    <p className="text-2xl font-black text-white">{totalDepositors}</p>
                    <p className="text-sm text-gray-500">unique addresses</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">BTC Price</p>
                    <p className="text-2xl font-black gradient-text-orange">
                        ${btcPrice ? btcPrice.toLocaleString() : '...'}
                    </p>
                    <p className="text-sm text-gray-500">live market</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${loadingOnChain ? 'bg-yellow-400 animate-pulse' : 'bg-lev-green'}`} />
                        <p className="text-lg font-bold text-white">
                            {loadingOnChain ? 'Syncing...' : connected ? 'On-Chain' : 'Demo Mode'}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">{connected ? 'live data' : 'connect wallet for live data'}</p>
                </div>
            </div>

            {/* Pool cards */}
            <div className="grid lg:grid-cols-3 gap-6">
                {pools.map((pool) => (
                    <PoolCard
                        key={pool.id}
                        pool={pool}
                        userDeposit={getDeposit(pool.id)}
                    />
                ))}
            </div>

            {/* Info */}
            <div className="mt-12 glass-card p-8">
                <h3 className="text-lg font-bold text-white mb-4">How Leveraged Pools Work</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
                    <div>
                        <h4 className="text-lev-green font-semibold mb-2">x1 Pool (Conservative)</h4>
                        <p>Standard 1:1 BTC deposit. No leverage applied. Ideal for long-term holders seeking on-chain custody.</p>
                    </div>
                    <div>
                        <h4 className="text-lev-orange font-semibold mb-2">x2 Pool (Moderate)</h4>
                        <p>2x leveraged exposure on your BTC deposit. Moderate risk with amplified potential returns on withdrawal.</p>
                    </div>
                    <div>
                        <h4 className="text-red-400 font-semibold mb-2">x3 Pool (Aggressive)</h4>
                        <p>3x leveraged exposure. Highest risk and reward. Suitable for experienced traders comfortable with volatility.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
