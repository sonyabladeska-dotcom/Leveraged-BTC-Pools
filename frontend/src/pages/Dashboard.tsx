import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatBTCShort, formatAddress } from '../services/wallet';
import { getUserDepositOnChain } from '../lib/opnet';
import { MOCK_POOLS, MOCK_USER_DEPOSITS, MOCK_TVL_HISTORY } from '../lib/mock-data';
import { Link } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend,
} from 'recharts';

export default function Dashboard() {
    const { connected, walletAddress, balance, opnetConfig } = useWallet();
    const [deposits, setDeposits] = useState(MOCK_USER_DEPOSITS);
    const [loadingChain, setLoadingChain] = useState(false);

    useEffect(() => {
        if (!connected || !opnetConfig.provider) return;
        setLoadingChain(true);

        (async () => {
            const onChainDeposits = [];
            for (const pool of MOCK_POOLS) {
                try {
                    const amt = await getUserDepositOnChain(opnetConfig, pool.id);
                    if (amt > 0) {
                        onChainDeposits.push({
                            poolId: pool.id,
                            amount: amt,
                            leveragedExposure: amt * pool.multiplier,
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            if (onChainDeposits.length > 0) setDeposits(onChainDeposits);
            setLoadingChain(false);
        })();
    }, [connected, opnetConfig]);

    const totalDeposited = deposits.reduce((a, d) => a + d.amount, 0);
    const totalExposure = deposits.reduce((a, d) => a + d.leveragedExposure, 0);
    const avgMultiplier = totalDeposited > 0 ? totalExposure / totalDeposited : 0;

    const chartTooltipStyle = {
        backgroundColor: '#131a2a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        color: '#e2e8f0',
        fontSize: '12px',
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-black text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">
                    {connected
                        ? `Wallet: ${formatAddress(walletAddress)}`
                        : 'Connect wallet to see your positions'}
                </p>
            </div>

            {/* Wallet overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Wallet Balance</p>
                    <p className="text-2xl font-black text-white">
                        {connected ? formatBTCShort(balance) : '—'}
                    </p>
                    <p className="text-sm text-gray-500">BTC</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Deposited</p>
                    <p className="text-2xl font-black gradient-text-orange">
                        {(totalDeposited / 1e8).toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-500">BTC across pools</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Exposure</p>
                    <p className="text-2xl font-black text-lev-green">
                        {(totalExposure / 1e8).toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-500">BTC (leveraged)</p>
                </div>
                <div className="stat-card">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Multiplier</p>
                    <p className="text-2xl font-black text-white">
                        {avgMultiplier.toFixed(1)}x
                    </p>
                    <p className="text-sm text-gray-500">weighted average</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Positions table */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Your Positions</h2>
                        {loadingChain && (
                            <span className="text-xs text-yellow-400 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                Syncing on-chain...
                            </span>
                        )}
                    </div>

                    {deposits.length > 0 ? (
                        <div className="space-y-3">
                            {deposits.map((dep) => {
                                const pool = MOCK_POOLS.find(p => p.id === dep.poolId);
                                if (!pool) return null;
                                const mult = pool.multiplier;

                                return (
                                    <div key={dep.poolId}
                                         className="flex items-center justify-between p-4 bg-lev-bg rounded-xl border border-lev-border hover:border-lev-orange/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-lev-surface flex items-center justify-center">
                                                <span className="text-sm font-black gradient-text-orange">x{mult}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{pool.name}</p>
                                                <p className="text-xs text-gray-500">{mult}x leverage</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">
                                                {(dep.amount / 1e8).toFixed(6)} BTC
                                            </p>
                                            <p className="text-xs text-lev-green">
                                                → {(dep.leveragedExposure / 1e8).toFixed(6)} BTC
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No active positions</p>
                            <Link to="/pools" className="btn-primary text-sm">
                                Deposit into a Pool
                            </Link>
                        </div>
                    )}
                </div>

                {/* Exposure breakdown chart */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Exposure Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={deposits.map(d => {
                            const pool = MOCK_POOLS.find(p => p.id === d.poolId);
                            return {
                                name: pool?.name || `Pool ${d.poolId}`,
                                deposited: +(d.amount / 1e8).toFixed(6),
                                exposure: +(d.leveragedExposure / 1e8).toFixed(6),
                            };
                        })}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip contentStyle={chartTooltipStyle} />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                            <Bar dataKey="deposited" fill="#f7931a" name="Deposited (BTC)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="exposure" fill="#14f195" name="Exposure (BTC)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TVL History chart */}
            <div className="glass-card p-6 mb-8">
                <h2 className="text-lg font-bold text-white mb-6">TVL History (7 days)</h2>
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={MOCK_TVL_HISTORY}>
                        <defs>
                            <linearGradient id="colorPool1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14f195" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14f195" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPool2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPool3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                        <Area type="monotone" dataKey="pool1" stroke="#14f195" fillOpacity={1} fill="url(#colorPool1)" name="x1 Pool" />
                        <Area type="monotone" dataKey="pool2" stroke="#f7931a" fillOpacity={1} fill="url(#colorPool2)" name="x2 Pool" />
                        <Area type="monotone" dataKey="pool3" stroke="#ef4444" fillOpacity={1} fill="url(#colorPool3)" name="x3 Pool" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Quick links */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/pools" className="glass-card p-6 group hover:border-lev-orange/30 transition-all flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-lev-orange/10 flex items-center justify-center text-lev-orange
                                    group-hover:bg-lev-orange/20 transition-colors shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-lev-orange transition-colors">Manage Pools</h3>
                        <p className="text-sm text-gray-400">Deposit or withdraw from leveraged pools</p>
                    </div>
                </Link>

                <Link to="/api" className="glass-card p-6 group hover:border-lev-green/30 transition-all flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-lev-green/10 flex items-center justify-center text-lev-green
                                    group-hover:bg-lev-green/20 transition-colors shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-lev-green transition-colors">API Access</h3>
                        <p className="text-sm text-gray-400">Integrate pool data into your applications</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
