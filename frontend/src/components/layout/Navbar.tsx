import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { formatAddress, formatBTCShort } from '../../services/wallet';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/pools', label: 'Pools' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/api', label: 'API' },
];

export default function Navbar() {
    const { pathname } = useLocation();
    const { connected, connecting, walletAddress, balance, connect, disconnect } = useWallet();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-lev-bg/80 backdrop-blur-xl border-b border-lev-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lev-orange to-amber-500 flex items-center justify-center
                                        group-hover:shadow-lg group-hover:shadow-lev-orange/20 transition-shadow">
                            <span className="text-black font-black text-sm">LP</span>
                        </div>
                        <span className="text-lg font-bold hidden sm:block">
                            <span className="gradient-text-orange">Leveraged</span>
                            <span className="text-gray-300 ml-1">Pools</span>
                        </span>
                    </Link>

                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    pathname === to
                                        ? 'bg-lev-orange/10 text-lev-orange'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Wallet */}
                    <div className="flex items-center gap-3">
                        {connected ? (
                            <>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-surface text-sm">
                                    <div className="w-2 h-2 rounded-full bg-lev-green animate-pulse" />
                                    <span className="text-gray-400">
                                        {formatBTCShort(balance)} <span className="text-gray-500">BTC</span>
                                    </span>
                                </div>
                                <button
                                    onClick={disconnect}
                                    className="flex items-center gap-2 px-4 py-2 glass-surface text-sm font-medium
                                               hover:border-red-500/30 hover:text-red-400 transition-all"
                                >
                                    <span className="text-gray-300">{formatAddress(walletAddress)}</span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={connect}
                                disabled={connecting}
                                className="btn-primary text-sm !px-5 !py-2"
                            >
                                {connecting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                                        </svg>
                                        Connecting...
                                    </span>
                                ) : 'Connect Wallet'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile nav */}
                <div className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                pathname === to
                                    ? 'bg-lev-orange/10 text-lev-orange'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
