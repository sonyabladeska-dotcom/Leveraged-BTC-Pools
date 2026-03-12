import { Link } from 'react-router-dom';
import { MOCK_POOLS } from '../lib/mock-data';

const STATS = [
    { label: 'Total Value Locked', value: '12.5 BTC', sub: '$1.2M' },
    { label: 'Active Depositors', value: '85', sub: 'unique addresses' },
    { label: 'Max Leverage', value: '3x', sub: 'on BTC pools' },
    { label: 'Pools Available', value: '3', sub: 'x1, x2, x3' },
];

export default function Home() {
    return (
        <div className="bg-grid">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-lev-orange/5 via-transparent to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
                    <div className="text-center max-w-3xl mx-auto animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass-surface text-sm text-gray-400 mb-6">
                            <div className="w-2 h-2 rounded-full bg-lev-green animate-pulse" />
                            Powered by OP_NET on Bitcoin L1
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                            <span className="gradient-text">Leveraged</span>
                            <br />
                            <span className="text-white">BTC Pools</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Deposit Bitcoin into leveraged pools with up to 3x exposure.
                            Smart contracts on Bitcoin L1 via OP_NET protocol.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/pools" className="btn-primary text-lg !px-8 !py-4">
                                Explore Pools
                            </Link>
                            <Link to="/dashboard" className="btn-secondary text-lg !px-8 !py-4">
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                    {STATS.map((s) => (
                        <div key={s.label} className="stat-card">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
                            <p className="text-2xl sm:text-3xl font-black gradient-text-orange">{s.value}</p>
                            <p className="text-sm text-gray-500">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Pools */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Featured Pools</h2>
                    <Link to="/pools" className="text-sm text-lev-orange hover:text-amber-400 transition-colors flex items-center gap-1">
                        View All
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {MOCK_POOLS.map((pool) => (
                        <Link
                            key={pool.id}
                            to="/pools"
                            className={`glass-card p-6 group cursor-pointer transition-all duration-300
                                ${pool.multiplier === 1 ? 'hover:border-lev-green/40' :
                                  pool.multiplier === 2 ? 'hover:border-lev-orange/40' :
                                  'hover:border-red-500/40'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-lev-surface flex items-center justify-center">
                                        <span className="text-sm font-black gradient-text-orange">x{pool.multiplier}</span>
                                    </div>
                                    <h3 className="font-bold text-white group-hover:text-lev-orange transition-colors">
                                        {pool.name}
                                    </h3>
                                </div>
                                <span className={pool.multiplier === 1 ? 'pool-x1' : pool.multiplier === 2 ? 'pool-x2' : 'pool-x3'}>
                                    x{pool.multiplier}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">TVL</p>
                                    <p className="text-lg font-bold text-white">{pool.tvl.toFixed(2)} BTC</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Depositors</p>
                                    <p className="text-lg font-bold text-white">{pool.depositors}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-lev-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Leverage</span>
                                    <span className="text-white font-medium">{pool.multiplier}x exposure</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            step: '01',
                            title: 'Choose a Pool',
                            desc: 'Select from x1, x2, or x3 leverage pools based on your risk appetite.',
                            icon: (
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            ),
                        },
                        {
                            step: '02',
                            title: 'Deposit BTC',
                            desc: 'Deposit Bitcoin through your OP_WALLET. Your position is recorded on-chain.',
                            icon: (
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                        },
                        {
                            step: '03',
                            title: 'Earn Leveraged Exposure',
                            desc: 'Get multiplied BTC exposure. Withdraw anytime with leveraged returns.',
                            icon: (
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            ),
                        },
                    ].map((item) => (
                        <div key={item.step} className="glass-card p-8 text-center group hover:border-lev-orange/30 transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-lev-orange/10 flex items-center justify-center mx-auto mb-4
                                            text-lev-orange group-hover:bg-lev-orange/20 transition-colors">
                                {item.icon}
                            </div>
                            <div className="text-xs text-lev-orange font-bold mb-2">STEP {item.step}</div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-lev-border bg-lev-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-lev-orange to-amber-500 flex items-center justify-center">
                                <span className="text-black font-black text-xs">LP</span>
                            </div>
                            <span className="text-sm text-gray-400">Leveraged BTC Pools</span>
                        </div>
                        <p className="text-xs text-gray-600">
                            Built on OP_NET &bull; Bitcoin L1 Smart Contracts &bull; Testnet
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
