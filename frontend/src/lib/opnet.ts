import { getLeveragedContract, CONTRACT_ADDRESS, DEFAULT_FEE_RATE, MAX_SAT_PER_TX } from '../services/contract';

export interface OpnetConfig {
    provider: any;
    network: any;
    publicKey?: string;
    signer?: any;
    walletAddress?: string;
}

function getContract(config: OpnetConfig) {
    return getLeveragedContract(config.provider, config.network, config.publicKey);
}

async function sendTx(config: OpnetConfig, simulation: any) {
    if (!config.signer) throw new Error('Wallet signer not available. Reconnect wallet.');
    return await simulation.sendTransaction({
        signer: config.signer,
        refundTo: config.walletAddress,
        maximumAllowedSatToSpend: MAX_SAT_PER_TX,
        feeRate: DEFAULT_FEE_RATE,
        network: config.network,
    } as any);
}

// ── Read ──

export async function getPoolInfoOnChain(config: OpnetConfig, poolId: number) {
    if (!CONTRACT_ADDRESS || !config.provider) return null;
    try {
        const c = getContract(config);
        const r = await c.getPoolInfo(BigInt(poolId));
        console.log(`getPoolInfo(${poolId}) raw:`, JSON.stringify(r, (_, v) => typeof v === 'bigint' ? v.toString() : v));
        const p = r?.properties as any;
        return {
            totalDeposits: Number(p?.totalDeposits?.toString() || '0'),
            multiplier: Number(p?.multiplier?.toString() || '1'),
        };
    } catch (e) { console.error(`getPoolInfo(${poolId}):`, e); return null; }
}

export async function getUserDepositOnChain(config: OpnetConfig, poolId: number) {
    if (!CONTRACT_ADDRESS || !config.provider) return 0;
    try {
        const c = getContract(config);
        const r = await c.getUserDeposit(BigInt(poolId));
        const p = r?.properties as any;
        return Number(p?.amount?.toString() || '0');
    } catch { return 0; }
}

// ── Write ──

export async function depositOnChain(config: OpnetConfig, poolId: number, amount: number): Promise<string> {
    const c = getContract(config);
    console.log('deposit params:', { poolId, amount });
    const sim = await c.deposit(BigInt(poolId), BigInt(amount));
    console.log('deposit simulation:', JSON.stringify(sim, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    if ((sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    console.log('deposit tx result:', JSON.stringify(tx, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    return tx?.transactionId || tx?.toString() || 'sent';
}

export async function withdrawOnChain(config: OpnetConfig, poolId: number): Promise<string> {
    const c = getContract(config);
    const sim = await c.withdraw(BigInt(poolId));
    if ((sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    return tx?.transactionId || tx?.toString() || 'sent';
}

export async function payForApiCallOnChain(config: OpnetConfig): Promise<string> {
    const c = getContract(config);
    const sim = await c.payForApiCall();
    if ((sim as any).revert) throw new Error((sim as any).revert);
    if ((sim as any).error) throw new Error((sim as any).error);
    const tx = await sendTx(config, sim);
    return tx?.transactionId || tx?.toString() || 'sent';
}
