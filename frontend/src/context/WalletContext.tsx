import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { JSONRpcProvider } from 'opnet';
import type { OPNetSigner } from '../services/wallet';
import type { OpnetConfig } from '../lib/opnet';

interface WalletCtx {
    walletAddress: string;
    balance: number;
    connected: boolean;
    connecting: boolean;
    opnetConfig: OpnetConfig;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const Ctx = createContext<WalletCtx>({
    walletAddress: '', balance: 0, connected: false, connecting: false,
    opnetConfig: { provider: null, network: null },
    connect: async () => {}, disconnect: () => {},
});

export const useWallet = () => useContext(Ctx);

export default function WalletProvider({ children }: { children: ReactNode }) {
    const [walletAddress, setWalletAddress] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [balance, setBalance] = useState(0);
    const [connecting, setConnecting] = useState(false);
    const [provider, setProvider] = useState<JSONRpcProvider | null>(null);
    const [signer, setSigner] = useState<OPNetSigner | null>(null);
    const [network, setNetwork] = useState<any>(null);

    const getWallet = useCallback(async () => await import('../services/wallet'), []);

    // Initialize provider + network on mount
    useEffect(() => {
        getWallet().then((w) => {
            setProvider(w.createProvider());
            setNetwork(w.getBitcoinNetwork());
        }).catch(console.error);
    }, [getWallet]);

    // Auto-reconnect if wallet was previously connected
    useEffect(() => {
        const check = async () => {
            try {
                const w = await getWallet();
                if (!w.isWalletAvailable()) return;
                const addr = await w.getAddress();
                if (addr) {
                    setWalletAddress(addr);
                    setPublicKey(await w.getPublicKey() || '');
                    setBalance(await w.getBalance());
                    try { setSigner(await w.createSigner()); } catch {}
                }
            } catch {}
        };
        check();
    }, [getWallet]);

    // Listen for account changes
    useEffect(() => {
        const w = typeof window !== 'undefined'
            ? (window as any).opnet || (window as any).unisat
            : null;
        if (!w) return;
        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length > 0) {
                const wallet = await getWallet();
                setWalletAddress(accounts[0]);
                setPublicKey(await wallet.getPublicKey() || '');
                setBalance(await wallet.getBalance());
                try { setSigner(await wallet.createSigner()); } catch {}
            } else {
                setWalletAddress(''); setPublicKey(''); setBalance(0); setSigner(null);
            }
        };
        w.on('accountsChanged', handleAccountsChanged);
        return () => { w?.removeListener('accountsChanged', handleAccountsChanged); };
    }, [getWallet]);

    const connect = useCallback(async () => {
        setConnecting(true);
        try {
            const w = await getWallet();
            const { address, publicKey: pk } = await w.connectWallet();
            setWalletAddress(address);
            setPublicKey(pk);
            setProvider(w.createProvider());
            setNetwork(w.getBitcoinNetwork());
            setBalance(await w.getBalance());
            try { setSigner(await w.createSigner()); } catch {}
        } catch (e: any) {
            console.error('Wallet connection failed:', e);
            alert(e?.message || 'Connection failed');
        } finally { setConnecting(false); }
    }, [getWallet]);

    const disconnect = useCallback(() => {
        setWalletAddress(''); setPublicKey(''); setBalance(0); setSigner(null);
    }, []);

    const opnetConfig: OpnetConfig = {
        provider, network,
        publicKey: publicKey || undefined,
        signer: signer || undefined,
        walletAddress: walletAddress || undefined,
    };

    return (
        <Ctx.Provider value={{ walletAddress, balance, connected: !!walletAddress, connecting, opnetConfig, connect, disconnect }}>
            {children}
        </Ctx.Provider>
    );
}
