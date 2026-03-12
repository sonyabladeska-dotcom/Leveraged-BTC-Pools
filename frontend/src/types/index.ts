export interface Pool {
    id: number;
    name: string;
    multiplier: number;
    tvl: number;
    depositors: number;
}

export interface UserDeposit {
    poolId: number;
    amount: number;
    leveragedExposure: number;
}

export interface BtcPrice {
    price: number;
    change24h: number;
}

export interface LeverageSignal {
    signal: 'LONG' | 'SHORT' | 'NEUTRAL';
    confidence: number;
    recommendedPool: number;
    reasoning: string;
}
