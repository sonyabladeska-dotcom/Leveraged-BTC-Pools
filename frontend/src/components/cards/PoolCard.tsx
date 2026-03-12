import { useState } from 'react';
import type { Pool } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { depositOnChain, withdrawOnChain } from '../../lib/opnet';

const MULTIPLIER_STYLES: Record<number, { badge: string; glow: string; border: string; ring: string }> = {
    1: { badge: 'pool-x1', glow: 'glow-green', border: 'border-lev-green/20 hover:border-lev-green/40', ring: 'ring-lev-green/20' },
    2: { badge: 'pool-x2', glow: 'glow-orange', border: 'border-lev-orange/20 hover:border-lev-orange/40', ring: 'ring-lev-orange/20' },
    3: { badge: 'pool-x3', glow: '', border: 'border-red-500/20 hover:border-red-500/40', ring: 'ring-red-500/20' },
};

interface Props {
    pool: Pool;
    userDeposit?: number;
}

export default function PoolCard({ pool, userDeposit = 0 }: Props) {
    const { connected, opnetConfig } = useWallet();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
    const [txResult, setTxResult] = useState<string | null>(null);

    const styles = MULTIPLIER_STYLES[pool.multiplier] || MULTIPLIER_STYLES[1];

    const handleDeposit = async () => {
        if (!amount || !connected) return;
        setLoading(true);
        setTxResult(null);
        try {
            const sats = Math.floor(parseFloat(amount) * 1e8);
            if (sats <= 0) throw new Error('Invalid amount');
            const txId = await depositOnChain(opnetConfig, pool.id, sats);
            setTxResult(`Deposited! TX: ${txId}`);
            setAmount('');
        } catch (e: any) {
            setTxResult(`Error: ${e?.message || 'Failed'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!connected) return;
        setLoading(true);
        setTxResult(null);
        try {
            const txId = await withdrawOnChain(opnetConfig, pool.id);
            setTxResult(`Withdrawn! TX: ${txId}`);
        } catch (e: any) {
            setTxResult(`Error: ${e?.message || 'Failed'}`);
        } finally {
            setLoading(false);
        }
    };

    const leveragedExposure = userDeposit > 0 ? (userDeposit * pool.multiplier / 1e8).toFixed(6) : '0';
    const userBtc = (userDeposit / 1e8).toFixed(6);

    return (
        <div className={`glass-card p-6 ${styles.border} transition-all duration-300 animate-fade-in`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-lev-surface flex items-center justify-center ${styles.glow}`}>
                        <span className="text-lg font-black gradient-text-orange">x{pool.multiplier}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{pool.name}</h3>
                        <p className="text-sm text-gray-400">{pool.depositors} depositors</p>
                    </div>
                </div>
                <span className={styles.badge}>x{pool.multiplier}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-lev-bg rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Value Locked</p>
                    <p className="text-lg font-bold text-white">{pool.tvl.toFixed(2)} <span className="text-sm text-gray-400">BTC</span></p>
                </div>
                <div className="bg-lev-bg rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Leverage</p>
                    <p className="text-lg font-bold text-white">{pool.multiplier}x <span className="text-sm text-gray-400">exposure</span></p>
                </div>
            </div>

            {/* Your position */}
            {userDeposit > 0 && (
                <div className={`bg-lev-bg rounded-xl p-4 mb-6 ring-1 ${styles.ring}`}>
                    <p className="text-xs text-gray-500 mb-2">Your Position</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Deposited</span>
                        <span className="text-white font-medium">{userBtc} BTC</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Leveraged Exposure</span>
                        <span className="text-lev-green font-medium">{leveragedExposure} BTC</span>
                    </div>
                </div>
            )}

            {/* Mode tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setMode('deposit')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        mode === 'deposit'
                            ? 'bg-lev-orange/10 text-lev-orange border border-lev-orange/20'
                            : 'bg-lev-bg text-gray-400 border border-transparent hover:text-white'
                    }`}
                >
                    Deposit
                </button>
                <button
                    onClick={() => setMode('withdraw')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        mode === 'withdraw'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-lev-bg text-gray-400 border border-transparent hover:text-white'
                    }`}
                >
                    Withdraw
                </button>
            </div>

            {/* Action */}
            {mode === 'deposit' ? (
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Amount in BTC"
                            className="input-field pr-16"
                            disabled={!connected || loading}
                            min="0"
                            step="0.0001"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">BTC</span>
                    </div>
                    {amount && parseFloat(amount) > 0 && (
                        <div className="text-xs text-gray-400 px-1">
                            Leveraged exposure: <span className="text-lev-green font-medium">
                                {(parseFloat(amount) * pool.multiplier).toFixed(6)} BTC
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleDeposit}
                        disabled={!connected || loading || !amount}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Processing...' : !connected ? 'Connect Wallet' : `Deposit x${pool.multiplier}`}
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleWithdraw}
                    disabled={!connected || loading || userDeposit <= 0}
                    className="btn-danger w-full"
                >
                    {loading ? 'Processing...' : userDeposit <= 0 ? 'No deposit' : 'Withdraw All'}
                </button>
            )}

            {/* TX result */}
            {txResult && (
                <div className={`mt-3 p-3 rounded-lg text-xs ${
                    txResult.startsWith('Error')
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-lev-green/10 text-lev-green border border-lev-green/20'
                }`}>
                    {txResult}
                </div>
            )}

            {/* Risk notice */}
            {pool.multiplier >= 3 && (
                <div className="mt-4 flex items-start gap-2 text-xs text-yellow-500/70">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd" />
                    </svg>
                    <span>High leverage increases both potential gains and losses. Trade responsibly.</span>
                </div>
            )}
        </div>
    );
}
