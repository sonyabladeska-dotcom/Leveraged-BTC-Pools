import type { Pool, UserDeposit } from '../types';

export const MOCK_POOLS: Pool[] = [
    { id: 1, name: 'BTC Pool x1', multiplier: 1, tvl: 5.0, depositors: 42 },
    { id: 2, name: 'BTC Pool x2', multiplier: 2, tvl: 4.2, depositors: 28 },
    { id: 3, name: 'BTC Pool x3', multiplier: 3, tvl: 3.3, depositors: 15 },
];

export const MOCK_USER_DEPOSITS: UserDeposit[] = [
    { poolId: 1, amount: 50000, leveragedExposure: 50000 },
    { poolId: 2, amount: 30000, leveragedExposure: 60000 },
    { poolId: 3, amount: 20000, leveragedExposure: 60000 },
];

export const MOCK_TVL_HISTORY = [
    { day: 'Mon', pool1: 4.2, pool2: 3.5, pool3: 2.8 },
    { day: 'Tue', pool1: 4.5, pool2: 3.8, pool3: 2.9 },
    { day: 'Wed', pool1: 4.8, pool2: 4.0, pool3: 3.1 },
    { day: 'Thu', pool1: 4.6, pool2: 3.9, pool3: 3.0 },
    { day: 'Fri', pool1: 5.0, pool2: 4.2, pool3: 3.3 },
    { day: 'Sat', pool1: 5.2, pool2: 4.4, pool3: 3.5 },
    { day: 'Sun', pool1: 5.0, pool2: 4.2, pool3: 3.3 },
];
